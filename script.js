// Globals (required names)
let display = "0";
let operand1 = null;
let operand2 = null;
let operator = null;
let history = []; // newest-first

const displayEl = document.getElementById("display");
const historyListEl = document.getElementById("history-list");

function updateDisplay() {
  if (displayEl) displayEl.textContent = display;
}

function appendDigit(digit) {
  // Prevent multiple leading zeros
  if ((display === "0" || display === "") && digit === 0) {
    if (display === "") display = "0";
    return;
  }

  if (display === "0" || display === "") {
    display = String(digit);
  } else {
    display += String(digit);
  }
  updateDisplay();
}

function appendDecimal() {
  if (display.includes(".")) return;
  if (display === "") {
    display = "0.";
  } else {
    display += ".";
  }
  updateDisplay();
}

function performCalculation(a, op, b) {
  if (op === "÷" && b === 0) {
    alert("Cannot divide by zero");
    display = "0";
    updateDisplay();
    return null;
  }
  let result;
  switch (op) {
    case "+":
      result = a + b;
      break;
    case "-":
      result = a - b;
      break;
    case "×":
      result = a * b;
      break;
    case "÷":
      result = a / b;
      break;
    default:
      return null;
  }
  if (!Number.isInteger(result)) {
    result = parseFloat(result.toFixed(10));
  }

  const historyEntry = `${a} ${op} ${b} = ${result}`;
  history.unshift(historyEntry); // newest first
  if (history.length > 10) history.pop();
  updateHistoryDisplay();
  return result;
}

function selectOperator(op) {
  // If user changes operator without entering a new number, just update operator
  if (operator !== null && display === "") {
    operator = op;
    return;
  }

  if (operand1 === null) {
    operand1 = Number(display);
  } else if (operator !== null && display !== "") {
    // chain calculation
    operand2 = Number(display);
    const res = performCalculation(operand1, operator, operand2);
    if (res === null) {
      // error (e.g., division by zero) already handled
      operand1 = null;
      operator = null;
      display = "0";
      updateDisplay();
      return;
    }
    operand1 = res;
    display = String(res);
  }

  operator = op;
  display = ""; // reset for next operand (not '0')
  updateDisplay();
}

function calculate() {
  if (operator === null || operand1 === null || display === "") return;
  operand2 = Number(display);
  if (operator === "÷" && operand2 === 0) {
    alert("Cannot divide by zero");
    display = "0";
    updateDisplay();
    return;
  }

  let result;
  switch (operator) {
    case "+":
      result = operand1 + operand2;
      break;
    case "-":
      result = operand1 - operand2;
      break;
    case "×":
      result = operand1 * operand2;
      break;
    case "÷":
      result = operand1 / operand2;
      break;
    default:
      return;
  }

  if (!Number.isInteger(result)) result = parseFloat(result.toFixed(10));

  const historyEntry = `${operand1} ${operator} ${operand2} = ${result}`;
  history.unshift(historyEntry);
  if (history.length > 10) history.pop();

  display = String(result);
  updateDisplay();
  updateHistoryDisplay();

  // Prepare for next calculation
  operand1 = result;
  operand2 = null;
  operator = null;
}

function clearAll() {
  display = "0";
  operand1 = null;
  operand2 = null;
  operator = null;
  updateDisplay();
}

function updateHistoryDisplay() {
  if (!historyListEl) return;
  historyListEl.innerHTML = history
    .map((item) => `<div class="item">${item}</div>`)
    .join("");
}

// Event listeners
for (let i = 0; i <= 9; i++) {
  const btn = document.getElementById(`btn-${i}`);
  if (btn) btn.addEventListener("click", () => appendDigit(i));
}

document
  .getElementById("btn-decimal")
  ?.addEventListener("click", appendDecimal);
document.getElementById("btn-equals")?.addEventListener("click", calculate);
document.getElementById("btn-clear")?.addEventListener("click", clearAll);

document
  .getElementById("btn-add")
  ?.addEventListener("click", () => selectOperator("+"));
document
  .getElementById("btn-subtract")
  ?.addEventListener("click", () => selectOperator("-"));
document
  .getElementById("btn-multiply")
  ?.addEventListener("click", () => selectOperator("×"));
document
  .getElementById("btn-divide")
  ?.addEventListener("click", () => selectOperator("÷"));

// Initialize UI
updateDisplay();
updateHistoryDisplay();
