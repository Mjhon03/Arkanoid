const canvas = document.getElementById("arkanoidGame");
const ctx = canvas.getContext("2d");

// Dimensiones
const ballRadius = 7;
let x, y, dx, dy;

const paddleHeight = 10;
const paddleWidth = 100;
let paddleX;

const brickRowCount = 7;
const brickColumnCount = 10;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

let score = 0;
let totalBricks = brickRowCount * brickColumnCount;
let gameState = "ready"; // 'ready', 'playing', 'gameover'

let bricks = [];

function initGame() {
  x = canvas.width / 2;
  y = canvas.height - 30;
  dx = 3;
  dy = -3;
  paddleX = (canvas.width - paddleWidth) / 2;
  score = 0;
  bricks = [];
  for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
      bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
  }
}


document.addEventListener("mousemove", mouseMoveHandler, false);
canvas.addEventListener("click", () => {
  if (gameState === "ready" || gameState === "gameover") {
    initGame();
    gameState = "playing";
    draw();
  }
});

function mouseMoveHandler(e) {
  const relativeX = e.clientX - canvas.getBoundingClientRect().left;
  if (relativeX > 0 && relativeX <= canvas.width) {
    paddleX = relativeX - paddleWidth / 2;
    if (paddleX < 0) {
      paddleX = 0;
    } else if (paddleX + paddleWidth > canvas.width) {
      paddleX = canvas.width - paddleWidth;
    }
  }
}

function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const b = bricks[c][r];
      if (b.status === 1) {
        if (
          x > b.x &&
          x < b.x + brickWidth &&
          y > b.y &&
          y < b.y + brickHeight
        ) {
          dy = -dy;
          b.status = 0;
          score++;
          if (score === totalBricks) {
            gameState = "win";
            drawWinMessage();
            return;
          }
        }
      }
    }
  }
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#ffbd39";
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight - 5, paddleWidth, paddleHeight);
  ctx.fillStyle = "#4cc9f0";
  ctx.fill();
  ctx.closePath();
}

function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status === 1) {
        const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#7209b7";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function drawScore() {
  ctx.font = "16px Orbitron, sans-serif";
  ctx.fillStyle = "#fff";
  ctx.fillText("Puntaje: " + score, 8, 20);
}

function drawStartMessage() {
  ctx.font = "20px Orbitron, sans-serif";
  ctx.fillStyle = "#ffffffaa";
  ctx.textAlign = "center";
  ctx.fillText("Haz clic para comenzar", canvas.width / 2, canvas.height / 2);
  ctx.textAlign = "start";
}

function drawGameOverMessage() {
  ctx.font = "20px Orbitron, sans-serif";
  ctx.fillStyle = "#f72585";
  ctx.textAlign = "center";
  ctx.fillText("¡Has perdido! Haz clic para reiniciar", canvas.width / 2, canvas.height / 2);
  ctx.textAlign = "start";
}

function drawWinMessage() {
  ctx.font = "20px Orbitron, sans-serif";
  ctx.fillStyle = "#4cc9f0";
  ctx.textAlign = "center";
  ctx.fillText("¡Ganaste! Haz clic para reiniciar", canvas.width / 2, canvas.height / 2);
  ctx.textAlign = "start";
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();
  drawScore();
  collisionDetection();

  // Rebote en bordes
  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) dx = -dx;
  if (y + dy < ballRadius) {
    dy = -dy;
  } else if (y + dy > canvas.height - ballRadius - paddleHeight - 5) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
    } else if (y + dy > canvas.height - ballRadius) {
      gameState = "gameover";
      drawGameOverMessage();
      return;
    }
  }

  x += dx;
  y += dy;

  if (gameState === "playing") {
    requestAnimationFrame(draw);
  }
}


// Mostrar mensaje inicial
initGame();
draw();
drawStartMessage();