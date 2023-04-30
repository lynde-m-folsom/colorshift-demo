// scripts.js
const colorNamingContainer = document.getElementById("color-naming-container");
const colorDisplay = document.getElementById("color-display");
const colorNameInput = document.getElementById("color-name");
const submitNameButton = document.getElementById("submit-name");
const nextButton = document.getElementById("next-button");
const rectContainer = document.getElementById("rect-container");
const colorBox = document.getElementById("color-box");
const feedback = document.getElementById("feedback");
const nextTrialButton = document.getElementById("next-trial");
const results = document.getElementById("results");

const hexCodes = ["#00FFFF", "#F0FFFF", "#89CFF0", "#0000FF", "#7393B3", "#3F00FF", "#00008B", "#1434A4", "#000080", "#1F51FF"];
let currentHexIndex = 0;
let colorNames = [];
let reactionTimes = [];
let trialCount = 0;
const maxTrials = 4; // You can change this value to set the desired number of trials
let pressedColors = [];

function showColor() {
    colorDisplay.style.backgroundColor = hexCodes[currentHexIndex];
}

function submitColorName() {
    const colorName = colorNameInput.value.trim();
    if (colorName) {
        colorNames.push(colorName);
        currentHexIndex++;
        colorNameInput.value = "";
    }
    if (currentHexIndex >= hexCodes.length) {
        submitNameButton.disabled = true;
        nextButton.hidden = false;
    } else {
        showColor();
    }
}

function startShiftingColors() {
    colorNamingContainer.hidden = true;
    rectContainer.hidden = false;
    let startTime = Date.now();
    let currentColor = getRandomColor();
    colorBox.style.backgroundColor = currentColor;
    let shiftColorsInterval = setInterval(() => {
        currentColor = getRandomColor();
        colorBox.style.backgroundColor = currentColor;
    }, 1000);
    function handleSpacebarPress(e) {
        if (e.code === "Space") {
            clearInterval(shiftColorsInterval);
            pressedColors.push(currentColor);
            reactionTimes.push(Date.now() - startTime);
            document.removeEventListener("keydown", handleSpacebarPress);
            rectContainer.hidden = true;
            feedback.hidden = false;
            if (trialCount < maxTrials - 1) {
                nextTrialButton.hidden = false;
            } else {
                displayResults();
            }
        }
    }
    document.addEventListener("keydown", handleSpacebarPress);
}
function startNextTrial() {
    trialCount++;
    feedback.hidden = true;
    nextTrialButton.hidden = true;
    startShiftingColors();
}

function displayResults() {
    feedback.hidden = true;
    results.hidden = false;

    let resultText = "<h2>Results</h2><ul>";
    for (let i = 0; i < hexCodes.length; i++) {
        resultText += `<li>Color: ${hexCodes[i]}, Name: ${colorNames[i]}</li>`;
    }
    resultText += "</ul><ul>";
    for (let i = 0; i < reactionTimes.length; i++) {
        resultText += `<li>Trial ${i + 1}: ${reactionTimes[i]}ms, Pressed Color: ${pressedColors[i]}</li>`;
    }
    resultText += "</ul>";
    results.innerHTML = resultText;
}

function getRandomColor() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
}

submitNameButton.addEventListener("click", submitColorName);
nextButton.addEventListener("click", startShiftingColors);
nextTrialButton.addEventListener("click", startNextTrial);

showColor();
