//Document Container
const mainContainer = document.querySelector(".mainContainer");

//Header container
const headerContainer = document.createElement("h1");
headerContainer.classList.add("headerContainer");
headerContainer.textContent = "Calculator";

//Calculator Container
const calContainer = document.createElement("div");
calContainer.classList.add("calContainer");

//Display Container
const display = document.createElement("div");
display.classList.add("display");

//Grid Container
const calGridContainer = document.createElement("div");
calGridContainer.classList.add("calGridContainer");

calContainer.appendChild(display);
calContainer.appendChild(calGridContainer);
mainContainer.appendChild(headerContainer);
mainContainer.appendChild(calContainer);

//Calculator buttons
function calcButtons() {
    const calcBtnElements = ["A/C", "*", "/", "Bck", "7", "8", "9", "-", "4", "5", "6", "+", "1", "2", "3", ".", "0", "="];
    const buttonGrid = document.querySelector(".calGridContainer");

    let gridWidth = 400 / 4;
    let gridHeight = 350 / 5;
    let zeroWidth = gridWidth * 2;

    for (let i = 0; i < calcBtnElements.length; i++) {

        //Button creation
        const btn = document.createElement("button");

        if (["A/C", "*", "/"].includes(calcBtnElements[i])) {
            btn.classList.add("specOpButton");

        } else if (["Bck", ".", "-", "=", "+"].includes(calcBtnElements[i])) {
            btn.classList.add("operatorButton");

        } else {
            btn.classList.add("button");
        };

        btn.textContent = calcBtnElements[i];
        btn.dataset.choice = calcBtnElements[i];

        //Button size
        if (calcBtnElements[i] == "0" || calcBtnElements[i] == "=") {
            btn.style.width = `${zeroWidth}px`;
            btn.style.height = `${gridHeight}px`;
        } else {
            btn.style.width = `${gridWidth}px`;
            btn.style.height = `${gridHeight}px`;
        };
        buttonGrid.appendChild(btn);
    };
};

calcButtons();

//Computing functions
function add(value1, value2) {
    return value1 + value2;
};

function substract(value1, value2) {
    return value1 - value2;
};

function multiply(value1, value2) {
    return value1 * value2;
};

function divide(value1, value2) {
    return value1 / value2;
};



//Calculations engine
function operate(value1, operator, value2) {
    value1 = parseFloat(value1);
    value2 = parseFloat(value2);

    if (operator === "/" && value2 === 0) {
        return "Infinity";
    };
    if (operator === "+") return add(value1, value2);
    if (operator === "-") return substract(value1, value2);
    if (operator === "*") return multiply(value1, value2);
    if (operator === "/") return divide(value1, value2);
    return "Error";
}

//Display
function displayOutput() {
    const display = document.querySelector(".display");
    const buttons = document.querySelectorAll("button")
    const OPERATORS = new Set(["+", "-", "*", "/"]);

    let currentValue = "0";
    let previousValue = null;
    let operator = null;
    let awaitingNewValue = false;
    let lockedAfterInfinity = false;


    function calculate(a, op, b) {
        const result = operate(a, op, b);
        lockedAfterInfinity = result === "Infinity" || result === Infinity;
        if (typeof result === "number") {
            return Math.round(result * 100000000) / 100000000;
        }
        return result;
    };


    function inputDigit(digit) {
        if (awaitingNewValue) {
            currentValue = digit;
            awaitingNewValue = false;
        } else {
            currentValue = currentValue === "0" ? digit : currentValue = currentValue + digit
        }
    };


    function inputDecimal() {
        if (awaitingNewValue) {
            currentValue = "0.";
            awaitingNewValue = false;
        } else if (!currentValue.includes(".")) {
            currentValue += ".";
        }
    };


    function inputOperator(nextOperator) {
        if (operator && !awaitingNewValue) {
            currentValue = String(calculate(previousValue, operator, currentValue))
            if (lockedAfterInfinity) return;
        }
        previousValue = currentValue;
        operator = nextOperator;
        awaitingNewValue = true;
    };


    function inputEquals() {
        if (operator && previousValue !== null) {
            currentValue = String(calculate(previousValue, operator, currentValue));
            operator = null;
            previousValue = null;
            awaitingNewValue = true;
        }
    };

    function inputBackspace() {
        if (awaitingNewValue) {
            return;
        }
        currentValue = currentValue.length > 1 ? currentValue.slice(0, -1) : "0";
    };


    function clearCalculator() {
        currentValue = "0";
        previousValue = null;
        operator = null;
        awaitingNewValue = false;
        lockedAfterInfinity = false;
    };

    function updateDisplay() {
        if (lockedAfterInfinity) {
            display.textContent = currentValue;
            return;
        }
        if (!operator) {
            display.textContent = currentValue;
        } else if (awaitingNewValue) {
            display.textContent = previousValue + operator;
        } else {
            display.textContent = previousValue + operator + currentValue;
        }
    };

    buttons.forEach(button => {
        button.addEventListener("click", () => {
            const choice = button.dataset.choice;

            if (lockedAfterInfinity && choice !== "A/C") return;

            if (choice === "=") inputEquals();
            else if (choice === "A/C") clearCalculator();
            else if (choice === "Bck") inputBackspace();
            else if (choice === ".") inputDecimal();
            else if (OPERATORS.has(choice)) inputOperator(choice);
            else inputDigit(choice);

            updateDisplay();

        });
    })

    document.addEventListener("keydown", (e) => {
        const key = e.key;

        if (key.toLowerCase() === "c" || key === "Escape") {
            clearCalculator();
            updateDisplay();
            return;
        }
        if (lockedAfterInfinity) return;

        if (/^[0-9]$/.test(key)) inputDigit(key);
        else if (key === ".") inputDecimal();
        else if (OPERATORS.has(key)) inputOperator(key);
        else if (key === "Enter" || key === "=") inputEquals();
        else if (key === "Backspace") inputBackspace();
        else return;

        updateDisplay();
    });


}

displayOutput();
