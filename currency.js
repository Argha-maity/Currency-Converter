import { countryList } from "./codes.js";

const baseUrl = "https://open.er-api.com/v6/latest"; // Base URL for the API

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector(".btn");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const resultElement = document.querySelector('.msg p'); 

for (let select of dropdowns) {
    for (let currCode in countryList) {
        let newOption = document.createElement("option");
        newOption.innerText = currCode;
        newOption.value = currCode;
        if (select.name === "from" && currCode === "USD") {
            newOption.selected = "selected";
        } else if (select.name === "to" && currCode === "INR") {
            newOption.selected = "selected";
        }
        select.append(newOption);
    }
    select.addEventListener("change", (evt) => {
        updateFlag(evt.target);
    });
}

const updateFlag = (element) => {
    let currCode = element.value;
    let countryCode = countryList[currCode];
    let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
    let img = element.parentElement.querySelector("img");
    img.src = newSrc;
}

btn.addEventListener("click", async (evt) => {
    evt.preventDefault();
    let amount = document.querySelector(".amount input").value;
    
    if (amount === '' || amount < 0) {
        amount = 0;
        document.querySelector(".amount input").value = '0';
    }

    const url = `${baseUrl}/${fromCurr.value}`;
    console.log(`Fetching data from: ${url}`);
    try {
        let response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        let data = await response.json();
        console.log(data);
        
        const rate = data.rates[toCurr.value];
        if (!rate) {
            throw new Error(`Unable to get exchange rate for ${toCurr.value}`);
        }
        const result = amount * rate;
        if (resultElement) {
            resultElement.innerText = `${amount} ${fromCurr.value} = ${result.toFixed(2)} ${toCurr.value}`;
        } else {
            console.error('Result element not found');
        }
    } catch (error) {
        console.error('Error:', error);
        if (resultElement) {
            resultElement.innerText = 'Error converting currency';
        }
    }
});