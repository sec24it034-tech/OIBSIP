document.addEventListener('DOMContentLoaded', function() {
    const temperatureInput = document.getElementById('temperature');
    const unitRadios = document.querySelectorAll('input[name="unit"]');
    const convertToSelect = document.getElementById('convertTo');
    const convertBtn = document.getElementById('convertBtn');
    const resultDiv = document.getElementById('result');
    const errorDiv = document.getElementById('error');

    // Conversion functions
    function celsiusToFahrenheit(celsius) {
        return (celsius * 9/5) + 32;
    }

    function celsiusToKelvin(celsius) {
        return celsius + 273.15;
    }

    function fahrenheitToCelsius(fahrenheit) {
        return (fahrenheit - 32) * 5/9;
    }

    function fahrenheitToKelvin(fahrenheit) {
        return (fahrenheit - 32) * 5/9 + 273.15;
    }

    function kelvinToCelsius(kelvin) {
        return kelvin - 273.15;
    }

    function kelvinToFahrenheit(kelvin) {
        return (kelvin - 273.15) * 9/5 + 32;
    }

    // Main conversion function
    function convertTemperature(value, fromUnit, toUnit) {
        let result;

        // Convert to Celsius first, then to target unit
        switch(fromUnit) {
            case 'celsius':
                if (toUnit === 'fahrenheit') {
                    result = celsiusToFahrenheit(value);
                } else if (toUnit === 'kelvin') {
                    result = celsiusToKelvin(value);
                } else {
                    result = value;
                }
                break;

            case 'fahrenheit':
                if (toUnit === 'celsius') {
                    result = fahrenheitToCelsius(value);
                } else if (toUnit === 'kelvin') {
                    result = fahrenheitToKelvin(value);
                } else {
                    result = value;
                }
                break;

            case 'kelvin':
                if (toUnit === 'celsius') {
                    result = kelvinToCelsius(value);
                } else if (toUnit === 'fahrenheit') {
                    result = kelvinToFahrenheit(value);
                } else {
                    result = value;
                }
                break;
        }

        return result;
    }

    // Get selected unit
    function getSelectedUnit() {
        for (const radio of unitRadios) {
            if (radio.checked) {
                return radio.value;
            }
        }
        return 'celsius';
    }

    // Get unit display name
    function getUnitDisplayName(unit) {
        switch(unit) {
            case 'celsius':
                return '°C';
            case 'fahrenheit':
                return '°F';
            case 'kelvin':
                return 'K';
            default:
                return '';
        }
    }

    // Show error message
    function showError(message) {
        errorDiv.textContent = message;
        errorDiv.classList.add('show');
        resultDiv.classList.remove('show');
    }

    // Show result
    function showResult(value, unit) {
        const roundedValue = Math.round(value * 100) / 100;
        resultDiv.innerHTML = `
            <div class="value">${roundedValue}</div>
            <div class="unit">${getUnitDisplayName(unit)}</div>
        `;
        resultDiv.classList.add('show');
        errorDiv.classList.remove('show');
    }

    // Convert button click handler
    convertBtn.addEventListener('click', function() {
        const value = temperatureInput.value.trim();
        const fromUnit = getSelectedUnit();
        const toUnit = convertToSelect.value;

        // Input validation
        if (value === '') {
            showError('Please enter a temperature value');
            return;
        }

        const numValue = parseFloat(value);

        if (isNaN(numValue)) {
            showError('Please enter a valid number');
            return;
        }

        // Check for impossible Kelvin values
        if (fromUnit === 'kelvin' && numValue < 0) {
            showError('Kelvin cannot be negative (absolute temperature)');
            return;
        }

        // Check for impossible Fahrenheit/Celsius values for conversion to Kelvin
        if (toUnit === 'kelvin' && fromUnit !== 'kelvin' && numValue < -273.15) {
            showError('Temperature cannot be below absolute zero');
            return;
        }

        // Perform conversion
        const result = convertTemperature(numValue, fromUnit, toUnit);
        showResult(result, toUnit);
    });

    // Allow pressing Enter to convert
    temperatureInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            convertBtn.click();
        }
    });
});
