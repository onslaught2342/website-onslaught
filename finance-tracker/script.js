document.addEventListener('DOMContentLoaded', function() {
    const salaryForm = document.getElementById('salary-form');
    const expenseForm = document.getElementById('expense-form');
    const totalExpensesElement = document.getElementById('total-expenses');
    const remainingBalanceElement = document.getElementById('remaining-balance');
    const expenseList = document.getElementById('expense-list');
    const importJsonInput = document.getElementById('import-json-input');
    const modal = document.getElementById('modal');
    const modalImg = document.getElementById('modal-img');
    const closeModal = document.getElementsByClassName('close')[0];
    const clearDataButton = document.getElementById('clear-data');
    const importButton = document.getElementById('import-json');
    let salary = 0;
    let totalExpenses = 0;
    let expenses = [];
    const dbName = 'financeTrackerDB';
    const storeName = 'expensesStore';
    let db;
    function openDB() {
        const request = indexedDB.open(dbName, 1);
        request.onupgradeneeded = function(event) {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(storeName)) {
                db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
            }
        };
        request.onsuccess = function(event) {
            db = event.target.result;
            loadFromIndexedDB();
        };
        request.onerror = function(event) {
            console.error('Error opening IndexedDB:', event.target.errorCode);
        };
    }

    function saveToIndexedDB(data) {
        const transaction = db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        data.forEach(item => {
            store.put(item);
        });
        transaction.oncomplete = function() {
            console.log('Data saved to IndexedDB.');
        };
        transaction.onerror = function(event) {
            console.error('Error saving to IndexedDB:', event.target.errorCode);
        };
    }

    function loadFromIndexedDB() {
        const transaction = db.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.getAll();
        request.onsuccess = function(event) {
            expenses = event.target.result;
            totalExpenses = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
            updateSummary();
            updateExpenseList(expenses);
        };
        request.onerror = function(event) {
            console.error('Error loading from IndexedDB:', event.target.errorCode);
        };
    }

    function clearIndexedDB() {
        const transaction = db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.clear();
        request.onsuccess = function() {
            console.log('IndexedDB cleared.');
            expenses = [];
            totalExpenses = 0;
            updateSummary();
            updateExpenseList(expenses);
        };
        request.onerror = function(event) {
            console.error('Error clearing IndexedDB:', event.target.errorCode);
        };
    }

    function updateSummary() {
        totalExpensesElement.textContent = `Total Expenses: $${totalExpenses.toFixed(2)}`;
        remainingBalanceElement.textContent = `Remaining Balance: $${(salary - totalExpenses).toFixed(2)}`;
    }

    function updateExpenseList(expenses) {
        expenseList.innerHTML = '';
        expenses.forEach((expense, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                ${expense.receipt ? `<img src="${expense.receipt}" alt="Receipt Image" class="receipt-img" data-index="${index}">` : `<span class="no-receipt">No image provided</span>`}
                <span contenteditable="true" class="editable-item">${expense.item}</span>: 
                $<span contenteditable="true" class="editable-amount">${expense.amount.toFixed(2)}</span>
                <button class="edit-receipt" data-index="${index}">Edit Receipt</button>
            `;
            li.querySelector('.editable-item').addEventListener('blur', () => editExpense(index, 'item', li.querySelector('.editable-item').textContent));
            li.querySelector('.editable-amount').addEventListener('blur', () => editExpense(index, 'amount', parseFloat(li.querySelector('.editable-amount').textContent)));
            if (expense.receipt) {
                li.querySelector('.receipt-img').addEventListener('click', () => viewImage(expense.receipt));
            }
            li.querySelector('.edit-receipt').addEventListener('click', () => editReceipt(index));
            expenseList.appendChild(li);
        });
    }

    function editExpense(index, field, value) {
        if (field === 'amount') {
            value = parseFloat(value);
            if (isNaN(value)) return; // Skip if the value is not a number
        }
        expenses[index][field] = value;
        if (field === 'amount') {
            totalExpenses = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
        }
        saveToIndexedDB(expenses);
        updateSummary();
        updateExpenseList(expenses);
    }

    function editReceipt(index) {
        const receiptInput = document.createElement('input');
        receiptInput.type = 'file';
        receiptInput.accept = 'image/*';
        receiptInput.addEventListener('change', function() {
            if (receiptInput.files && receiptInput.files[0]) {
                const file = receiptInput.files[0];
                const reader = new FileReader();
                reader.onload = function(event) {
                    expenses[index].receipt = event.target.result;
                    saveToIndexedDB(expenses);
                    updateExpenseList(expenses);
                };
                reader.readAsDataURL(file);
            }
        });
        receiptInput.click();
    }

    function viewImage(src) {
        modal.style.display = 'block';
        modalImg.src = src;
    }

    closeModal.onclick = function() {
        modal.style.display = 'none';
    };

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };

    salaryForm.addEventListener('submit', function(event) {
        event.preventDefault();
        salary = parseFloat(document.getElementById('salary').value);
        updateSummary();
    });

    expenseForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const item = document.getElementById('expense-item').value;
        const amount = parseFloat(document.getElementById('expense').value);
        const receiptInput = document.getElementById('receipt');
        let receipt = null;

        if (receiptInput.files.length > 0) {
            const file = receiptInput.files[0];
            const reader = new FileReader();
            reader.onload = function(event) {
                receipt = event.target.result;
                addExpense(item, amount, receipt);
            };
            reader.readAsDataURL(file);
        } else {
            addExpense(item, amount, receipt);
        }

        document.getElementById('expense-item').value = '';
        document.getElementById('expense').value = '';
        receiptInput.value = '';
    });

    function addExpense(item, amount, receipt) {
        totalExpenses += amount;
        expenses.push({ item, amount, receipt });
        saveToIndexedDB(expenses);
        updateSummary();
        updateExpenseList(expenses);
    }

    importButton.addEventListener('click', function() {
        importJsonInput.click();
    });

    importJsonInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const data = JSON.parse(event.target.result);
                salary = data.salary;
                totalExpenses = data.totalExpenses;
                expenses = data.expenses;
                document.getElementById('salary').value = salary;
                updateSummary();
                updateExpenseList(expenses);
            };
            reader.readAsText(file);
        }
    });

    document.getElementById('export-json').addEventListener('click', function() {
        const data = { salary, totalExpenses, expenses };
        const json = JSON.stringify(data);
        downloadFile('data.json', json);
    });

    document.getElementById('export-csv').addEventListener('click', function() {
        let data = `Salary,Total Expenses\n${salary},${totalExpenses}\n\nItem,Amount,Receipt\n`;
        expenses.forEach(expense => {
            data += `${expense.item},${expense.amount},${expense.receipt ? 'Yes' : 'No'}\n`;
        });
        downloadFile('data.csv', data);
    });

    document.getElementById('export-yaml').addEventListener('click', function() {
        let data = `salary: ${salary}\ntotalExpenses: ${totalExpenses}\nexpenses:\n`;
        expenses.forEach(expense => {
            data += `  - item: ${expense.item}\n    amount: ${expense.amount}\n    receipt: ${expense.receipt ? 'Yes' : 'No'}\n`;
        });
        downloadFile('data.yaml', data);
    });

    clearDataButton.addEventListener('click', function() {
        if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
            if (confirm('Are you really sure?')) {
                if (confirm('Last chance! Are you absolutely sure you want to clear all data?')) {
                    clearIndexedDB();
                }
            }
        }
    });

    function downloadFile(filename, content) {
        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }

    openDB();
});