
function setCookie(name, value, days) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = name + '=' + encodeURIComponent(value) + '; expires=' + expires + '; path=/';
}

function getCookie(name) {
    return document.cookie.split('; ').reduce((r, c) => {
        const [key, ...v] = c.split('=');
        return key === name ? decodeURIComponent(v.join('=')) : r;
    }, '');
}

function toggleTheme() {
    const body = document.body;
    const container = document.querySelector('.container');
    body.classList.toggle('dark-mode');
    container.classList.toggle('dark-mode');

    if (body.classList.contains('dark-mode')) {
        setCookie('theme', 'dark', 30);
    } else {
        setCookie('theme', 'light', 30);
    }
}

function loadTheme() {
    const savedTheme = getCookie('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        document.querySelector('.container').classList.add('dark-mode');
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const noteTitle = document.getElementById('note-title');
    const noteList = document.getElementById('note-list');
    const clearDataButton = document.getElementById('clear-data');
    const exportJsonButton = document.getElementById('export-json');
    const importJsonInput = document.getElementById('import-json-input');
    const importNotesButton = document.getElementById('import-notes-button');

    let notes = [];
    const dbName = 'notesDB';
    const storeName = 'notesStore';
    let db;

    const quill = new Quill('#editor', {
        theme: 'snow',
    });

    function openDB() {
        const request = indexedDB.open(dbName, 1);
        request.onupgradeneeded = function (event) {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(storeName)) {
                db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
            }
        };
        request.onsuccess = function (event) {
            db = event.target.result;
            loadFromIndexedDB();
        };
        request.onerror = function (event) {
            console.error('Error opening IndexedDB:', event.target.errorCode);
        };
    }

    function saveToIndexedDB(data) {
        const transaction = db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        store.clear();
        data.forEach(note => {
            store.add(note);
        });
    }

    function loadFromIndexedDB() {
        const transaction = db.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.getAll();
        request.onsuccess = function (event) {
            notes = event.target.result;
            updateNoteList();
        };
    }

    function updateNoteList() {
        noteList.innerHTML = '';
        notes.forEach((note, index) => {
            const li = document.createElement('li');
            li.className = 'note-item';
            li.innerHTML = `<strong>${note.title}</strong><br>${note.content}<button class="delete-note">Delete</button>`;
            li.querySelector('.delete-note').addEventListener('click', function () {
                deleteNote(index);
            });
            li.addEventListener('click', function () {
                editNote(index);
            });
            noteList.appendChild(li);
        });
    }

    document.getElementById('save-note').addEventListener('click', function () {
        const content = quill.root.innerHTML.trim();
        if (noteTitle.value.trim() === '' || content === '<p><br></p>') {
            alert('Title and content cannot be empty!');
            return;
        }

        const newNote = {
            title: noteTitle.value,
            content: content,
        };
        notes.push(newNote);
        saveToIndexedDB(notes);
        updateNoteList();
        noteTitle.value = '';
        quill.setText('');
    });

    function deleteNote(index) {
        notes.splice(index, 1);
        saveToIndexedDB(notes);
        updateNoteList();
    }

    function editNote(index) {
        noteTitle.value = notes[index].title;
        quill.root.innerHTML = notes[index].content;
        deleteNote(index);
    }

    exportJsonButton.addEventListener('click', function () {
        if (notes.length === 0) {
            alert('No notes to export.');
            return;
        }
        const dataStr = JSON.stringify(notes, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'notes.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    importNotesButton.addEventListener('click', function () {
        importJsonInput.click();
    });

    importJsonInput.addEventListener('change', function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                try {
                    const importedNotes = JSON.parse(e.target.result);
                    if (Array.isArray(importedNotes)) {
                        notes = importedNotes;
                        saveToIndexedDB(notes);
                        updateNoteList();
                    } else {
                        alert('Invalid JSON format.');
                    }
                } catch (error) {
                    alert('Error reading the JSON file.');
                }
            };
            reader.readAsText(file);
        }
        importJsonInput.value = '';
    });

    clearDataButton.addEventListener('click', function () {
        if (confirm('Are you sure you want to clear all notes?')) {
            clearIndexedDB();
        }
    });

    loadTheme();

    const themeIcon = document.getElementById('theme-icon');
    if (themeIcon) {
        themeIcon.addEventListener('click', toggleTheme);
    }

    openDB();
});
