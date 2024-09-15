let selectAll = document.querySelectorAll('select');
let exchange = document.getElementById('exchange');
let msgValue = document.getElementById('getExchange');
let amountId = document.getElementById('amountId');
let fromCurr = document.querySelector('.from select');
let toCurr = document.querySelector('.to select');
// let BASE = `https://api.currencyapi.com/v3/latest?apikey=cur_live_AY13imJVVc72HWMhnXcnyKL19IHvzJIIFyO58daH&currencies=EUR%2CUSD%2CCAD`
let BASE = `https://api.currencyapi.com/v3/latest?apikey=cur_live_AY13imJVVc72HWMhnXcnyKL19IHvzJIIFyO58daH&currencies`;

for (let selection of selectAll) {
    for (let currCode in countryList) {
        let opt = document.createElement('option');
        opt.innerText = currCode;
        opt.value = currCode;

        if (selection.name === "from" && currCode === "USD") {
            opt.selected = currCode;
        } else if (selection.name === "to" && currCode === "PKR") {
            opt.selected = currCode;
        }
        selection.append(opt);
    }

    selection.addEventListener('change', (evt) => {
        updateFlag(evt.target);
    });
}

function updateFlag(evt) {
    let evtVal = evt.value;
    let countCode = countryList[evtVal];
    let src = `https://flagsapi.com/${countCode}/flat/64.png`;
    let image = evt.parentElement.querySelector('img');
    image.src = src;
}

async function currencyValue() {
    let amountVal = amountId.value;

    // Ensure that the amount is a valid number
    if (isNaN(amountVal) || amountVal === "" || amountVal < 1) {
        amountVal = 1; // Default to 1 if invalid
        amountId.value = 1; // Update the input field
    }

    try {
        const URL = `${BASE}&base_currency=${fromCurr.value}&currencies=${toCurr.value}`;
        let response = await fetch(URL);

        if (!response.ok) {
            throw new Error("API request failed");
        }

        let data = await response.json();

        // Ensure that the API has returned a valid rate
        if (data && data.data && data.data[toCurr.value]) {
            let rate = data.data[toCurr.value].value;
            let finalAmount = rate * amountVal;
            msgValue.innerText = `${amountVal} ${fromCurr.value} = ${finalAmount.toFixed(3)} ${toCurr.value}`;
        } else {
            throw new Error("Currency rate not available");
        }
    } catch (error) {
        msgValue.innerText = "Error fetching exchange rate. Please try again.";
        console.error("Error:", error);
    }
}

exchange.addEventListener('click', async (evt) => {
    evt.preventDefault();
    await currencyValue();
});
