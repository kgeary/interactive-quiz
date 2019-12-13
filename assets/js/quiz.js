const TIME_PER_QUESTION = 15;
const TIME_PER_SHOW_CORRECT_MS = 1500;

// Header Content
const spanTimeEl = document.getElementById("current-time");
const viewHighEl = document.getElementById("high-scores-link");
// Start Screen Content
const btnStartEl = document.getElementById("start");

// // Screen Divs
const screenStartEl = document.getElementById("start-screen");
const screenQuestionEl = document.getElementById("question-screen");
const screenResultEl = document.getElementById("result-screen");
const screenScoresEl = document.getElementById("scores-screen");
// Question Screen Content
const questionTextEl = document.getElementById("question-text");
const responseListEl = document.getElementById("response-list");
const responseCorrectEl = document.getElementById("response-correct");
// Results Screen Content
const finalScoreEl = document.getElementById("finalScore");
const btnSubmitScoreEl = document.getElementById("btnSubmitScore");
// Scores Screen Content
const scoresListEl = document.getElementById("high-score-list");
const btnBackEl = document.getElementById("btnBack");
const btnClearScoresEl = document.getElementById("btnClearScores");

let timeRemaining = 0;
let tmrInterval;
let questionIndex = 0;
let questionAnswer = "";
let highScores = [];
let currentScreen = screenStartEl;
let responseTimeoutId;

/* EVENT LISTENERS */
viewHighEl.addEventListener("click", function () {
    stopTimer();
    showScreen(screenScoresEl);
});

btnStartEl.addEventListener("click", startGame);
responseListEl.addEventListener("click", handleResponse);
btnBackEl.addEventListener("click", goBack);
btnClearScoresEl.addEventListener("click", clearScores);
btnSubmitScoreEl.addEventListener("click", submitScores);

function startGame() {
    console.log("START");
    questionIndex = 0;
    timeRemaining = TIME_PER_QUESTION * questions.length;
    spanTimeEl.textContent = timeRemaining;
    loadCurrentQuestion();
    showScreen(screenQuestionEl);
    tmrInterval = setInterval(timerEvent, 1000);
}

function stopTimer() {
    clearInterval(tmrInterval);
}

function submitScores() {
    let initials = document.getElementById("initials");
    addHighScore(initials.value, timeRemaining);
    showScreen(screenScoresEl);
}

function goBack() {
    showScreen(screenStartEl);
}

function clearScores() {
    highScores = [];
    refreshScoreList();
}

function updateResults() {
    finalScoreEl.textContent = timeRemaining;
}
a
function addHighScore(initials, finalScore) {
    if (highScores.filter(i => i.score >= finalScore).length < 5) {
        console.log("This is a new high score");
        highScores.push({ "initials": initials, "score": finalScore });
        highScores.sort(function (a, b) {
            if (a.score === b.score) { return 0; }
            else if (a.score < b.score) { return 1; }
            else { return -1; }
        });
    } else {
        console.log("Not a high score");
    }
    refreshScoreList();
}

function refreshScoreList() {
    scoresListEl.innerHTML = ""; // Clear Out old High Scores
    let numDisplay = highScores.length < 3 ? highScores.length : 3;
    for (let index = 0; index < numDisplay; index++) {
        let li = document.createElement("li");
        li.textContent = highScores[index].initials + ": " + highScores[index].score;
        scoresListEl.appendChild(li);
    }
}

function timerEvent() {
    timeRemaining--;
    spanTimeEl.textContent = timeRemaining;

    if (timeRemaining < 1) {
        stopTimer();
        updateResults();
        showScreen(screenResultEl);
    }
}

function loadCurrentQuestion() {
    let question = questions[questionIndex];
    questionAnswer = question.answer;
    questionTextEl.textContent = question.title;
    buildResponseList(question);
}

function handleResponse(event) {
    if (event.target.name === undefined) { return; }
    let answer = event.target.name;
    let isCorrect = (answer === questionAnswer);

    if (!isCorrect) {
        timeRemaining = (timeRemaining >= 15) ? (timeRemaining - 15) : 0;
    }

    showResponse(isCorrect);

    if (questionIndex < questions.length - 1) {
        questionIndex++;
        loadCurrentQuestion();
    } else {
        stopTimer();
        updateResults();
        showScreen(screenResultEl);
    }
}

// Temporarily pop-up a text showing if they got it right or wrong
function showResponse(isCorrect) {
    if (responseTimeoutId) {
        clearTimeout(responseTimeoutId);
    }
    responseCorrectEl.textContent = isCorrect ? "Correct!" : "Wrong!";
    responseCorrectEl.style.visibility = "visible";
    responseTimeoutId = setTimeout(function () {
        responseCorrectEl.style.visibility = "hidden";
    }, TIME_PER_SHOW_CORRECT_MS);
}

// Build the Question Response List
function buildResponseList(question) {
    responseListEl.innerHTML = "";
    for (let index = 0; index < question.choices.length; index++) {
        let btn = createResponseButton(question, index);
        responseListEl.appendChild(btn);
    }
}

// Create a single question response button
function createResponseButton(question, index) {
    let text = question.choices[index];
    let btn = document.createElement("button");
    btn.className = "btn btn-primary btn-choice";
    btn.name = text;
    btn.textContent = (index + 1) + ". " + text;
    return btn;
}

// Hide the current screen and show a new one
function showScreen(el) {
    if (currentScreen) {
        currentScreen.style.display = "none"
    }
    el.style.display = "block";
    currentScreen = el;
}
