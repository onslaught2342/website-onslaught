document.addEventListener('keydown', handleKeyPress);

function handleKeyPress(event) {
    const key = event.key;
    if (!isNaN(key)) {
        appendToDisplay(key);
    } else if (key === '+') {
        appendToDisplay('+');
    } else if (key === '-') {
        appendToDisplay('-');
    } else if (key === '*') {
        appendToDisplay('*');
    } else if (key === '/') {
        appendToDisplay('/');
    } else if (key === '.') {
        appendToDisplay('.');
    } else if (key === 'Enter' || key === '=') {
        calculate();
    } else if (key === 'Backspace') {
        deleteLastCharacter();
    } else if (key === 'Escape' || key.toLowerCase() === 'c') {
        clearDisplay();
    } else if (key.toLowerCase() === 'p') {
        appendToDisplay(Math.PI);
    } else if (key.toLowerCase() === 'e') {
        appendToDisplay(Math.E);
    }

    else if (key.toLowerCase() === 's') {
        appendToDisplay('Math.sin(');
    } else if (key.toLowerCase() === 'c') {
        appendToDisplay('Math.cos(');
    } else if (key.toLowerCase() === 't') {
        appendToDisplay('Math.tan(');
    } else if (key.toLowerCase() === 'l') {
        appendToDisplay('Math.log10(');
    } else if (key === '(' || key === ')') {
        appendToDisplay(key);
    }

    else if (key.toLowerCase() === 'r') { 
        appendToDisplay('Math.sqrt(');
    } else if (key === '^') { 
        appendToDisplay('**');
    } else if (key.toLowerCase() === 'a') {
        appendToDisplay('Math.abs(');
    }
}

function deleteLastCharacter() {
    const display = document.getElementById('display');
    display.value = display.value.slice(0, -1);
}

function appendToDisplay(value) {
    const display = document.getElementById('display');
    display.value += value;
}

function clearDisplay() {
    document.getElementById('display').value = '';
}

function calculate() {
    try {
        let result = eval(document.getElementById('display').value);
        document.getElementById('display').value = result;
    } catch (error) {
        document.getElementById('display').value = 'Error';
    }
}
