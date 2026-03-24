let currentInput = '0';
let previousInput = '';
let operator = '';
let shouldResetScreen = false;

// Get display element
const display = document.getElementById('display-input');

// Append number to display
function appendNumber(number) {
    if (currentInput === '0' || shouldResetScreen) {
        currentInput = number;
        shouldResetScreen = false;
    } else {
        // Prevent multiple decimal points
        if (number === '.' && currentInput.includes('.')) return;
        currentInput += number;
    }
    updateDisplay();
}

// Append operator to display
function appendOperator(op) {
    if (operator !== '') {
        calculate();
    }
    previousInput = currentInput;
    operator = op;
    shouldResetScreen = true;
}

// Clear the display
function clearDisplay() {
    currentInput = '0';
    previousInput = '';
    operator = '';
    updateDisplay();
}

// Delete last character
function deleteLast() {
    if (currentInput.length === 1 || currentInput === '0') {
        currentInput = '0';
    } else {
        currentInput = currentInput.slice(0, -1);
    }
    updateDisplay();
}

// Calculate the result
function calculate() {
    if (operator === '' || shouldResetScreen) return;
    
    let result;
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);
    
    if (isNaN(prev) || isNaN(current)) return;
    
    switch (operator) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '*':
            result = prev * current;
            break;
        case '/':
            if (current === 0) {
                currentInput = 'Error';
                updateDisplay();
                return;
            }
            result = prev / current;
            break;
        default:
            return;
    }
    
    // Round to avoid floating point errors
    result = Math.round(result * 100000000) / 100000000;
    currentInput = result.toString();
    operator = '';
    shouldResetScreen = true;
    updateDisplay();
}

// Update the display
function updateDisplay() {
    display.value = currentInput;
}

// Keyboard support
document.addEventListener('keydown', function(event) {
    const key = event.key;
    
    if (key >= '0' && key <= '9') {
        appendNumber(key);
    } else if (key === '.') {
        appendNumber('.');
    } else if (key === '+') {
        appendOperator('+');
    } else if (key === '-') {
        appendOperator('-');
    } else if (key === '*') {
        appendOperator('*');
    } else if (key === '/') {
        appendOperator('/');
    } else if (key === 'Enter' || key === '=') {
        event.preventDefault();
        calculate();
    } else if (key === 'Escape') {
        clearDisplay();
    } else if (key === 'Backspace') {
        deleteLast();
    }
});
