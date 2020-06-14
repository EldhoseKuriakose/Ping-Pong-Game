var playingArea = document.getElementsByClassName('playing-area')[0];
var rods = document.getElementsByClassName('rod');
var ball = document.getElementsByClassName('ball')[0];
var pause = document.getElementsByClassName('pause')[0];
var msg = document.getElementsByClassName('msg')[0];

var controlBtn = document.querySelectorAll('.details-area .control-buttons button');
var playerNameh1 = document.querySelector('.details-area .player-name h1');
var totalScoreboard = document.querySelector('.details-area .scoreboard .total-scoreboard');
var totalScoreboardBody = document.querySelector('.details-area .scoreboard .total-scoreboard tbody');
var roundScoreboard = document.querySelector('.details-area .scoreboard .round-scoreboard');
var roundScoreboardh2 = document.querySelector('.details-area .scoreboard .round-scoreboard h2');
var roundScoreboardp = document.querySelector('.details-area .scoreboard .round-scoreboard p');

var playingAreaWidth = playingArea.clientWidth;
var playingAreaHeight = playingArea.clientHeight;
var rodWidth = rods[0].clientWidth;
var rodHeight = rods[0].clientHeight;
var ballWidth = ball.clientWidth;
var ballHeight = ball.clientHeight;
var ballTop = 20;
var topOperation = "+";
var ballLeft = 100;
var leftOperation = "+";
var rodMovingSpeed = 20;
var ballMovingSpeed = 0.5;
var scoreSpeed = 5;
var gameState = "";
var gameID = null;
var roundID = null;
var msgIntervalID = null;
var out = false;
var scores = [];
var roundScore = 0;
var playerName = "";

function newGame() {
    clearTimeout(roundID);
    roundID = null;
    clearInterval(msgIntervalID);
    msgIntervalID = null;

    controlBtn[0].blur();
    controlBtn[1].blur();
    controlBtn[0].disabled = true;
    controlBtn[0].style.cursor = "not-allowed";
    controlBtn[0].innerHTML = (scores.length == 4) ? "New Game" : "Next Round";

    if (scores.length == 5) {
        scores = [];
        resetTotalScoreboard();
    }

    if (scores.length == 0) {
        var playerName = prompt("Enter Your Name - ");
        if (playerName != "" && playerName != null) {
            playerNameh1.innerHTML = playerName;
        } else {
            playerNameh1.innerHTML = 'Guest';
        }
    }

    rodMovingSpeed = 20;
    ballMovingSpeed = 0.5;
    gameState = "new";
    gameID = null;
    out = false;
    roundScore = 0;
    scoreSpeed = 5;

    var rodStartingPosition = Math.floor(Math.random() * (playingAreaWidth - rodWidth));
    rods[0].style.left = rodStartingPosition + "px";
    rods[1].style.left = rodStartingPosition + "px";
    rods[0].style.transform = "none";
    rods[1].style.transform = "none";

    var ballStartingPositionTop = playingAreaHeight - rodHeight - ballHeight;
    var ballStartingPositionLeft = rodStartingPosition + (rodWidth / 2) - (ballWidth / 2);
    ball.style.top = ballStartingPositionTop + "px";
    ball.style.left = ballStartingPositionLeft + "px";
    ball.style.transform = "none";
    ballTop = ballStartingPositionTop;
    topOperation = "-";
    ballLeft = ballStartingPositionLeft;
    leftOperation = "+";
    ball.style.background = "var(--ballColor)";

    roundScoreboardp.innerHTML = roundScore;
    roundScoreboardh2.innerHTML = "Round " + (scores.length + 1);
    msg.innerHTML = "Press ENTER to Start Round " + (scores.length + 1);
    displayTotalScoreboard();
}

function startGame() {
    gameID = setInterval(() => {
        ball.style.top = ballTop + "px";
        ball.style.left = ballLeft + "px";
        ballMovingSpeed = ballMovingSpeed + 0.0000625;
        ballTop = eval(ballTop + topOperation + ballMovingSpeed);
        ballLeft = eval(ballLeft + leftOperation + ballMovingSpeed);

        if (ballTop >= (playingAreaHeight - rodHeight - ballHeight)) {
            var ballPos = (ballLeft + (3 * ballWidth / 4));
            console.log('entered start');
            if (ballPos >= rods[0].offsetLeft && (ballLeft + (ballWidth / 4)) <= rods[0].offsetLeft + rodWidth) {
                topOperation = "-";
                scoreSpeed = getScoreSpeed(ballMovingSpeed);
                roundScore += scoreSpeed;
                roundScoreboardp.innerHTML = roundScore;
            } else {
                gameOver();
            }
        } else if (ballTop <= rodHeight) {
            var ballPos = (ballLeft + (3 * ballWidth / 4));
            if (ballPos >= rods[0].offsetLeft && (ballLeft + (ballWidth / 4)) <= rods[0].offsetLeft + rodWidth) {
                topOperation = "+";
                scoreSpeed = getScoreSpeed(ballMovingSpeed);
                roundScore += scoreSpeed;
                roundScoreboardp.innerHTML = roundScore;
            } else {
                gameOver();
            }
        }

        if (ballLeft >= (playingAreaWidth - ballWidth)) {
            leftOperation = "-";
        } else if (ballLeft <= 0) {
            leftOperation = "+";
        }
    }, 5);
}

function gameOver() {
    clearInterval(gameID);
    gameID = null;
    out = true;
    gameState = "over";
    ballTop = eval(ballTop + topOperation + 5);
    ball.style.top = ballTop + "px";
    ball.style.left = ballLeft + "px";
    ball.style.background = "#a90200";

    scores[scores.length] = roundScore;
    updateTotalScoreboard();
    enableButtons();

    if (scores.length == 5) {
        displayTotalScoreboard();
        calculateTotalScore();
        return;
    }
    let i = 5;
    msg.innerHTML = "Score : " + roundScore + "</br>Next Round Starting in " + i;
    i = i - 1;
    msgIntervalID = setInterval(() => {
        if (i == 0) {
            clearInterval(msgIntervalID);
            msgIntervalID = null;
        }
        msg.innerHTML = "Score : " + roundScore + "</br>Next Round Starting in " + i;
        i = i - 1;
    }, 1000)

    roundID = setTimeout(() => {
        newGame();
    }, 5000)
}

function resetGame() {
    disableButtons();
    clearInterval(gameID);
    clearTimeout(roundID);
    clearInterval(msgIntervalID);
    gameID = null;
    roundID = null;
    msgIntervalID = null;

    controlBtn[0].blur();
    controlBtn[1].blur();
    controlBtn[0].innerHTML = "New Game";
    scores = [];
    resetTotalScoreboard();
    gameState = "";
    out = false;
    roundScore = 0;
    scoreSpeed = 5;

    msg.innerHTML = "Click on New Game to Start";
    pause.style.display = "none";

    rods[0].style.left = "50%";
    rods[1].style.left = "50%";
    rods[0].style.transform = "translate(-50%)";
    rods[1].style.transform = "translate(-50%)";

    ball.style.top = "50%";
    ball.style.left = "50%";
    ball.style.transform = "translate(-50%, -50%)";
    ball.style.background = "var(--ballColor)";

    roundScoreboardp.innerHTML = "";
    roundScoreboardh2.innerHTML = "";
    playerNameh1.innerHTML = "";
    enableButtons();
}

function disableButtons() {
    controlBtn[0].disabled = true;
    controlBtn[1].disabled = true;
    controlBtn[0].style.cursor = "not-allowed";
    controlBtn[1].style.cursor = "not-allowed";
}

function enableButtons() {
    controlBtn[0].disabled = false;
    controlBtn[1].disabled = false;
    controlBtn[0].style.cursor = "pointer";
    controlBtn[1].style.cursor = "pointer";
}

function displayTotalScoreboard() {
    totalScoreboard.style.display = "flex";
    roundScoreboard.style.display = "none";
}

function hideTotalScoreboard() {
    totalScoreboard.style.display = "none";
    roundScoreboard.style.display = "flex";
}

function updateTotalScoreboard() {
    var text1 = document.createTextNode("Round " + scores.length);
    var text2 = document.createTextNode(scores[scores.length - 1]);

    var td1 = document.createElement("td");
    var td2 = document.createElement("td");
    td1.appendChild(text1);
    td2.appendChild(text2);

    var tr = document.createElement("tr");
    tr.appendChild(td1);
    tr.appendChild(td2);

    totalScoreboardBody.appendChild(tr);
}

function resetTotalScoreboard() {
    var totalScoreboardRows = document.querySelectorAll('.details-area .scoreboard .total-scoreboard tbody tr');
    for (var i = 0; i < totalScoreboardRows.length; i++) {
        totalScoreboardRows[i].remove();
    }
}

function calculateTotalScore() {
    var sum = 0;
    for (var i = 0; i < scores.length; i++) {
        sum += scores[i];
    }
    msg.innerHTML = "Total Score : " + sum + ".</br>Click on New Game to Restart Game";

    var text1 = document.createTextNode("Total");
    var text2 = document.createTextNode(sum);

    var td1 = document.createElement("td");
    var td2 = document.createElement("td");
    td1.appendChild(text1);
    td2.appendChild(text2);

    var tr = document.createElement("tr");
    tr.appendChild(td1);
    tr.appendChild(td2);
    totalScoreboardBody.appendChild(tr);
}

function getScoreSpeed(ballMovingSpeed) {
    if (ballMovingSpeed < 1.0) {
        return 5;
    } else if (ballMovingSpeed >= 1.0 && ballMovingSpeed < 1.5) {
        rodMovingSpeed = 22;
        return 7;
    } else {
        rodMovingSpeed = 25;
        return 9;
    }
}

function moveLeft() {
    var leftDistance = rods[0].offsetLeft;
    if (leftDistance == 0) {
        return;
    }
    var value;
    if ((leftDistance - rodMovingSpeed) <= 0) {
        value = 0;
    } else {
        value = leftDistance - rodMovingSpeed;
    }
    rods[0].style.left = value + "px";
    rods[1].style.left = value + "px";
}

function moveRight() {
    var leftDistance = rods[0].offsetLeft;
    if (leftDistance + rodWidth == playingAreaWidth) {
        return;
    }
    var value;
    if ((leftDistance + rodWidth + rodMovingSpeed) >= playingAreaWidth) {
        value = playingAreaWidth - rodWidth;
    } else {
        value = leftDistance + rodMovingSpeed;
    }
    rods[0].style.left = value + "px";
    rods[1].style.left = value + "px";
}

document.addEventListener('keydown', function(e) {
    if (e.code == "Enter" && !out && gameState != "") {
        if (gameID != null) {
            hideTotalScoreboard();
            clearInterval(gameID);
            gameID = null;
            gameState = "pause";
            msg.innerHTML = "Press ENTER to continue"
            pause.style.display = "block";
            controlBtn[1].disabled = false;
            controlBtn[1].style.cursor = "pointer";
        } else {
            hideTotalScoreboard();
            gameState = "running";
            msg.innerHTML = "";
            pause.style.display = "none";
            controlBtn[1].disabled = true;
            controlBtn[1].style.cursor = "not-allowed";
            startGame();
        }
    }

    if (gameState == "running") {
        if (e.code == "KeyA" || e.keyCode == "37") {
            moveLeft();
            return;
        }
        if (e.code == "KeyD" || e.keyCode == "39") {
            moveRight();
            return;
        }
    }
});