const TIME_PER_QUESTION = 15;
let btnStart = document.getElementById("start");
let spanTime = document.getElementById("current-time");
let questionScreen = document.getElementById("question-screen");
let questionText = document.getElementById("question-text");
let responseList = document.getElementById("response-list");
let responseCorrect = document.getElementById("response-correct");
let resultScreen = document.getElementById("result-screen");
let score = 0;
let timeRemaining;
let tmrInterval;

let questionIndex;

let highScores = [
];

btnStart.addEventListener("click", function () {
    btnStart.hidden = true;
    questionIndex = 0;
    score = 0;
    responseList.addEventListener("click", handleClick);
    loadQuestion(questionIndex);
    questionScreen.style.display = "block";
    timeRemaining = TIME_PER_QUESTION * questions.length;
    tmrInterval = setInterval(tickEvent, 1000);
});

function stopTimer() {
    console.log("STOPPING TIMER");
    clearInterval(tmrInterval);
    responseList.removeEventListener("click", handleClick);
    questionScreen.style.display = "none";
    resultScreen.style.display="block";
    updateResults();
}

function updateResults() {
    let finalScore = document.getElementById("finalScore");
    let btnSubmit = document.getElementById("submit");
    finalScore.textContent = score;
    btnSubmit.addEventListener("click", addInitials);
}

function addInitials() {
    let initials = document.getElementById("initials");
    addHighScore(initials.textContent, score);
}

function addHighScore(initials, finalScore) {
    if (highScores.filter( i => i.score >= finalScore ).length < 5) {
        console.log("This is a new high score");  
        highScores.push({"initials": initials, "score": finalScore});
    } else {
        console.log("Not a high score");
    }
}

function tickEvent() {
    console.log("TICK");
    timeRemaining--;
    spanTime.textContent = timeRemaining;

    if (timeRemaining < 1) {
        timeExpired();
    }
}

function timeExpired() {
    stopTimer();
    alert("Times Up!");
}

function loadQuestion(index) {
    let question = questions[index];

    questionText.textContent = question.title;
    buildResponseList(question);
}

function handleClick(event) {
    if (event.target.name) {
        evaluateResponse(event.target.name);
    }
}

function evaluateResponse(answer) {
    let isCorrect = (answer === questions[questionIndex].answer);
    if (isCorrect) {
        score++;
    } else {
        timeRemaining -= 15;
        timeRemaining = (timeRemaining >= 15) ? (timeRemaining - 15) : 0;
    }

    if (questionIndex < questions.length - 1) {
        questionIndex++;
        loadQuestion(questionIndex);
    } else {
        stopTimer();
        setTimeout(function () {
            alert("FINAL SCORE = " + score);
        }, 1000);
    }

    responseCorrect.textContent = isCorrect ? "Correct!" : "Wrong!";
    responseCorrect.style.visibility = "visible";
    setTimeout(function () {
        responseCorrect.style.visibility = "hidden";
    }, 1000);
}

function buildResponseList(question) {
    responseList.innerHTML = "";

    for (let index = 0; index < question.choices.length; index++) {
        let btn = document.createElement("button");
        btn.className = "btn btn-primary btn-choice";
        btn.name = question.choices[index];
        btn.textContent = (index + 1) + ". " + question.choices[index];
        responseList.appendChild(btn);
    }
}
