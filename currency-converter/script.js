const apiBaseUrl = "https://api.exchangerate-api.com/v4/latest/USD"; // Using ExchangeRate-API for conversion rates
let search = document.querySelector(".searchBox");
let convert = document.querySelector(".convert");
let fromCurrency = document.querySelector(".from");
let toCurrency = document.querySelector(".to");
let finalValue = document.querySelector(".finalValue");
let finalAmount = document.getElementById("finalAmount");
let loading = document.querySelector(".loading");
let resultFrom;
let resultTo;
let searchValue;

// Fetch all available currencies and populate the dropdowns
function loadCurrencies() {
    fetch(apiBaseUrl)
        .then(response => response.json())
        .then(data => {
            if (data && data.rates) {
                const currencies = Object.keys(data.rates); // Extracting available currency codes
                currencies.forEach(currency => {
                    const optionFrom = document.createElement("option");
                    optionFrom.value = currency;
                    optionFrom.textContent = currency;
                    fromCurrency.appendChild(optionFrom);

                    const optionTo = document.createElement("option");
                    optionTo.value = currency;
                    optionTo.textContent = currency;
                    toCurrency.appendChild(optionTo);
                });
            } else {
                throw new Error("No rates found in the response");
            }
        })
        .catch(error => {
            alert("Error loading currencies. Please try again later.");
            console.error("Error loading currencies:", error);
        });
}

// Event listeners for input fields
fromCurrency.addEventListener('change', (event) => {
    resultFrom = event.target.value;
    convertCurrency(); // Trigger conversion whenever "From" currency changes
});

toCurrency.addEventListener('change', (event) => {
    resultTo = event.target.value;
    convertCurrency(); // Trigger conversion whenever "To" currency changes
});

search.addEventListener('input', (e) => {
    searchValue = e.target.value;
    convertCurrency(); // Trigger conversion whenever user types the amount
});

// Input validation and automatic conversion
function convertCurrency() {
    if (validateInput()) {
        loading.style.display = "block";
        getResults();
    }
}

// Input validation
function validateInput() {
    if (!resultFrom || !resultTo || !searchValue) {
        finalAmount.style.display = "none"; // Hide result if input is incomplete
        return false;
    }
    return true;
}

// Fetch conversion rates and display results
function getResults() {
    fetch(apiBaseUrl)
        .then(response => response.json())
        .then(currency => displayResults(currency))
        .catch(error => {
            alert("Error fetching data. Please try again later.");
            loading.style.display = "none";
            console.error("Error fetching data:", error);
        });
}

// Display conversion results
function displayResults(currency) {
    let fromRate = currency.rates[resultFrom];
    let toRate = currency.rates[resultTo];
    finalValue.innerHTML = ((toRate / fromRate) * searchValue).toFixed(2);
    finalAmount.style.display = "block";
    loading.style.display = "none";
}

// Clear all form fields
function clearVal() {
    fromCurrency.value = "";
    toCurrency.value = "";
    search.value = "";
    finalAmount.style.display = "none";
    finalValue.innerHTML = "";
}

// Load the currencies on page load
window.onload = loadCurrencies;
