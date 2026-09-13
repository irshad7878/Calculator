const currentDisplay = document.getElementById("currentDisplay");
const previousDisplay = document.getElementById("previousDisplay");

const buttons = document.querySelectorAll(".buttons button");

const themeBtn = document.getElementById("themeBtn");
const historyList = document.getElementById("historyList");
const clearHistoryBtn = document.getElementById("clearHistory");

let current = "";
let previous = "";
let operation = null;


/* =========================
   NUMBER BUTTONS
========================= */

document.querySelectorAll("[data-number]").forEach(button => {

    button.addEventListener("click", () => {

        const number = button.dataset.number;

        if (number === "." && current.includes(".")) {
            return;
        }

        if (current === "0" && number !== ".") {
            current = "";
        }

        current += number;

        updateDisplay();
    });

});


/* =========================
   OPERATOR BUTTONS
========================= */

document.querySelectorAll("[data-operation]").forEach(button => {

    button.addEventListener("click", () => {

        if (current === "" && previous === "") {
            return;
        }

        if (current !== "" && previous !== "") {
            calculate();
        }

        operation = button.dataset.operation;

        previous = current;

        current = "";

        updateDisplay();
    });

});


/* =========================
   EQUAL BUTTON
========================= */

document.querySelector('[data-action="equals"]')
    .addEventListener("click", () => {

        if (previous === "" || current === "" || operation === null) {
            return;
        }

        calculate();

    });


/* =========================
   CALCULATE
========================= */

function calculate() {

    const firstNumber = parseFloat(previous);
    const secondNumber = parseFloat(current);

    let result;

    switch (operation) {

        case "+":
            result = firstNumber + secondNumber;
            break;

        case "-":
            result = firstNumber - secondNumber;
            break;

        case "*":
            result = firstNumber * secondNumber;
            break;

        case "/":

            if (secondNumber === 0) {
                current = "Error";
                previous = "";
                operation = null;

                updateDisplay();

                return;
            }

            result = firstNumber / secondNumber;
            break;
    }

    result = Number(result.toFixed(10));

    addHistory(`${firstNumber} ${operation} ${secondNumber}`, result);

    current = result.toString();

    previous = "";

    operation = null;

    updateDisplay();
}


/* =========================
   CLEAR
========================= */

document.querySelector('[data-action="clear"]')
    .addEventListener("click", () => {

        current = "";
        previous = "";
        operation = null;

        updateDisplay();
    });


/* =========================
   DELETE
========================= */

document.querySelector('[data-action="delete"]')
    .addEventListener("click", () => {

        current = current.slice(0, -1);

        updateDisplay();
    });


/* =========================
   PERCENTAGE
========================= */

document.querySelector('[data-action="percent"]')
    .addEventListener("click", () => {

        if (current === "") {
            return;
        }

        current = (parseFloat(current) / 100).toString();

        updateDisplay();
    });


/* =========================
   DISPLAY
========================= */

function updateDisplay() {

    currentDisplay.textContent = current || "0";

    if (previous && operation) {

        let symbol = operation;

        if (operation === "*") symbol = "×";
        if (operation === "/") symbol = "÷";

        previousDisplay.textContent =
            `${previous} ${symbol}`;

    } else {

        previousDisplay.textContent = "";
    }
}


/* =========================
   HISTORY
========================= */

function addHistory(expression, result) {

    const empty = historyList.querySelector(".empty");

    if (empty) {
        empty.remove();
    }

    const item = document.createElement("div");

    item.classList.add("history-item");

    item.innerHTML = `
        <span>${expression}</span>
        <strong>= ${result}</strong>
    `;

    historyList.prepend(item);
}


/* =========================
   CLEAR HISTORY
========================= */

clearHistoryBtn.addEventListener("click", () => {

    historyList.innerHTML =
        `<p class="empty">No calculations yet</p>`;
});


/* =========================
   DARK / LIGHT MODE
========================= */

themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {

        themeBtn.textContent = "🌙";

    } else {

        themeBtn.textContent = "☀️";
    }

});


/* =========================
   KEYBOARD SUPPORT
========================= */

document.addEventListener("keydown", event => {

    const key = event.key;

    if (!isNaN(key) || key === ".") {

        const button =
            document.querySelector(`[data-number="${key}"]`);

        if (button) {
            button.click();
        }
    }

    if (["+", "-", "*", "/"].includes(key)) {

        const button =
            document.querySelector(`[data-operation="${key}"]`);

        if (button) {
            button.click();
        }
    }

    if (key === "Enter" || key === "=") {

        document.querySelector('[data-action="equals"]').click();
    }

    if (key === "Backspace") {

        document.querySelector('[data-action="delete"]').click();
    }

    if (key === "Escape") {

        document.querySelector('[data-action="clear"]').click();
    }

});