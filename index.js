//board
let tileSize = 30;
let rows = 10;
let columns = 20;
let boardWidth = tileSize * columns;
let boardHeight = tileSize * rows;
let board;
let context;

//dinosaur dimensions and position
let dinoWidth = tileSize * 2 + tileSize / 2;
let dinoHeight = tileSize * 3;
let dinoX = tileSize / 2;
let dinoY = tileSize * rows - tileSize * 3;
let dino = {
    x : dinoX,
    y : dinoY,
    width : dinoWidth,
    height : dinoHeight,
    alive : true
}
let dinoImg;
let jumpDino = false;

//ball
let ballWidth = tileSize;
let ballHeight = tileSize;
let ballX = tileSize * columns - tileSize;
let ballY = tileSize * rows - tileSize;
let ball = {
    x : ballX,
    y : ballY,
    width : ballWidth,
    height : ballHeight,
    alive : true
}
let ballImg;
let ballArray = [];
let colision = false;

//time animation
let secondsPassed = 0;
let oldTimeStamp = 0;
let ballMovingSpeed = 3;
let dinoMovingSpeed = 0.4;
let timeStamp = 0;
let timePassed = 0;
let dinoTimePassed = 0;
let dinoSecondPassed = 0;
let dinoDirectionDown = false;
let gameOver = false;
let startTime = Date.now();
let endTime = 0;
let playTime = 0;
let loopTime;
let stopTime;

//score
let highScore = -1;

window.onload = function() {
    board = document.getElementById("board");
    board.width = boardWidth;
    board.height = boardHeight;
    context = board.getContext("2d");

    //load and draw the dino
    dinoImg = new Image();
    dinoImg.src = "./dino.png";
    dinoImg.onload = function() {
        context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
    }
    ballImg = new Image();
    ballImg.src = "./ball.png";
    ballImg.onload = function() {
        context.drawImage(ballImg, ball.x, ball.y, ball.width, ball.height);
    }
    document.addEventListener('keydown', jump);
    document.addEventListener('keydown', restartGame);
    requestAnimationFrame(gameLoop);
}

function gameLoop(timeStamp) {
    // Calculate how much time has passed
    secondsPassed = (timeStamp - oldTimeStamp) / 1000;
    oldTimeStamp = timeStamp;

    // Pass the time to the update
    updateBall(secondsPassed);
    updateDino(secondsPassed);
    draw();
    displayScore();
    dinoCollision();
    if (gameOver) {
        return;
    } else {
        requestAnimationFrame(gameLoop);
    }
}

function updateBall(secondsPassed) {
    if (ball.alive) {
        // Move forward in time with a maximum amount for each frame
        secondsPassed = Math.min(secondsPassed, 0.1);
        timePassed += secondsPassed;

        // Clear the entire canvas
        context.clearRect(0, 0, board.width, board.height);

        //Use different easing functions for different effects.
        if (ball.x > - tileSize) {
            ball.x = easeLinear(timePassed, boardWidth, - boardWidth, ballMovingSpeed);
        }
        if (ball.x <= - tileSize) {
            timePassed = secondsPassed;
            ball.x = boardWidth;
        }
    }
}

function updateDino(secondsPassed) {
    dinoSecondPassed = Math.min(secondsPassed, 0.1);
    dinoTimePassed += dinoSecondPassed;
    context.clearRect(0, 0, board.width, board.height);

    //calculates the movement of the dino from the bottom to the maximum jump position and then back down
    if (jumpDino) {
        if (!dinoDirectionDown && dino.y > boardHeight / 3) {
        dino.y = easeLinear(dinoTimePassed, dinoY, - boardHeight / 2, dinoMovingSpeed);
        }
        if (dino.y < boardHeight / 3) {
            dinoTimePassed = 0;
            dinoDirectionDown = true;
            dino.y = boardHeight / 3;
        }
        if (dinoDirectionDown && dino.y < dinoY) {
            dino.y = easeLinear(dinoTimePassed, dino.y, 5, dinoMovingSpeed);
        }
        if (dino.y >= dinoY) {
            dino.y = dinoY;
            dinoDirectionDown = false;
            jumpDino = false;
            dinoTimePassed = 0;
        }
    }
}

//generating types of movements:
//t - the time at which the animation starts, time that make the animation progress
//b - coordinate of the Starting position on the x or y axis
//c - the number of intermediate frames until the end position on the x or y axis
//d - the time in seconds for making the animation from position 'b' to position 'c'
function easeLinear(t, b, c, d) {
    return c * t / d + b;
}

function drawInterval() {
    context.drawImage(ballImg, ball.x, ball.y, ball.width, ball.height);
}

function draw() {
    loopTime = Date.now();
    context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
    context.drawImage(ballImg, ball.x, ball.y, ball.width, ball.height);
}

function displayScore() {
    playTime = Math.round((loopTime - startTime) / 1000);

    //displays the running time of the game
    context.fillStyle = "black";
    context.font = "bold 20px courier";
    context.fillText(playTime, 550, 15);

    //display the highest score
    if (highScore > 0) {
        context.fillStyle = "red";
        context.font = "bold 20px courier";
        context.fillText("HI  " + highScore, 450, 15);
    }
}

function jump(e) {
    if (e.code == 'Space') {
        jumpDino = true;
        dinoTimePassed = 0;
    }
}

function restartGame(e) {
    if (e.code == 'KeyS' || e.code == 'Keys') {
        if (gameOver) {
            //calculate the highest score
            if (highScore < playTime) {
                highScore = playTime;
            }
            timePassed = 0;
            secondsPassed = 0;
            ball.alive = true;
            startTime = Date.now();
            loopTime = 0;
            endTime = 0;
            playTime = 0;
            gameOver = false;
            requestAnimationFrame(gameLoop);
        }
    }
}

function dinoCollision() {
    if (ball.alive && detectCollision(ball, dino)) {
        ball.alive = false;
        gameOver = true;
    }
    if (gameOver) {
        context.fillStyle = "red";
        context.font = "bold 100px courier";
        context.fillText("GAME OVER", 34, 170);
    }
}

function detectCollision(a, b) {
    return a.x <= b.x + tileSize * 2 && a.x >= b.x - tileSize / 2 && a.y <= b.y + tileSize * 2;
}
