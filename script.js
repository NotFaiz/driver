const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const carWidth = 50;
const carHeight = 100;
const carSpeed = 5;
const obstacleWidth = 50;
const obstacleHeight = 100;
const obstacleSpeed = 3;
const obstacleFrequency = 2000; // milliseconds
const aiCarWidth = 50;
const aiCarHeight = 100;
const aiCarSpeed = 2;

let carX = canvas.width / 2 - carWidth / 2;
let carY = canvas.height - carHeight - 10;
let aiCarX = canvas.width / 2 - aiCarWidth / 2;
let aiCarY = -aiCarHeight; // Start off-screen
let obstacles = [];
let keys = {};
let score = 0;
let startTime;
let gameInterval;
let obstacleInterval;

document.getElementById('startButton').addEventListener('click', startGame);
document.getElementById('restartButton').addEventListener('click', restartGame);

function startGame() {
    document.getElementById('startScreen').style.display = 'none';
    document.getElementById('gameArea').style.display = 'block';
    startTime = Date.now();
    gameInterval = setInterval(update, 1000 / 60); // 60 FPS
    obstacleInterval = setInterval(() => {
        if (Math.random() < 0.5) {
            const x = Math.random() * (canvas.width - obstacleWidth);
            obstacles.push({ x, y: -obstacleHeight });
        }
    }, obstacleFrequency);
}

function restartGame() {
    document.getElementById('gameOverScreen').style.display = 'none';
    document.getElementById('startScreen').style.display = 'block';
    carX = canvas.width / 2 - carWidth / 2;
    carY = canvas.height - carHeight - 10;
    aiCarX = canvas.width / 2 - aiCarWidth / 2;
    aiCarY = -aiCarHeight;
    obstacles = [];
    score = 0;
    document.getElementById('score').textContent = 'Score: 0';
    document.getElementById('timer').textContent = 'Time: 0';
    clearInterval(gameInterval);
    clearInterval(obstacleInterval);
}

document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

function drawCar() {
    ctx.fillStyle = 'red';
    ctx.fillRect(carX, carY, carWidth, carHeight);
}

function drawAICar() {
    ctx.fillStyle = 'green';
    ctx.fillRect(aiCarX, aiCarY, aiCarWidth, aiCarHeight);
}

function drawObstacle(obstacle) {
    ctx.fillStyle = 'blue';
    ctx.fillRect(obstacle.x, obstacle.y, obstacleWidth, obstacleHeight);
}

function updateObstacles() {
    obstacles.forEach(obstacle => {
        obstacle.y += obstacleSpeed;
    });

    obstacles = obstacles.filter(obstacle => obstacle.y < canvas.height);

    if (Math.random() < 0.05) {
        const x = Math.random() * (canvas.width - obstacleWidth);
        obstacles.push({ x, y: -obstacleHeight });
    }
}

function updateAICar() {
    aiCarY += aiCarSpeed;
    if (aiCarY > canvas.height) {
        aiCarY = -aiCarHeight;
        aiCarX = Math.random() * (canvas.width - aiCarWidth);
    }
}

function detectCollisions() {
    obstacles.forEach(obstacle => {
        if (carX < obstacle.x + obstacleWidth &&
            carX + carWidth > obstacle.x &&
            carY < obstacle.y + obstacleHeight &&
            carY + carHeight > obstacle.y) {
            endGame();
        }
    });

    if (carX < aiCarX + aiCarWidth &&
        carX + carWidth > aiCarX &&
        carY < aiCarY + aiCarHeight &&
        carY + carHeight > aiCarY) {
        endGame();
    }
}

function endGame() {
    clearInterval(gameInterval);
    clearInterval(obstacleInterval);
    document.getElementById('gameArea').style.display = 'none';
    document.getElementById('gameOverScreen').style.display = 'block';
    document.getElementById('finalScore').textContent = 'Score: ' + score;
}

function update() {
    if (keys['ArrowLeft'] && carX > 0) {
        carX -= carSpeed;
    }
    if (keys['ArrowRight'] && carX < canvas.width - carWidth) {
        carX += carSpeed;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawCar();
    drawAICar();
    updateObstacles();
    updateAICar();
    obstacles.forEach(drawObstacle);
    detectCollisions();

    // Update score and timer
    score += 1;
    const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
    document.getElementById('score').textContent = 'Score: ' + score;
    document.getElementById('timer').textContent = 'Time: ' + elapsedTime;
}
