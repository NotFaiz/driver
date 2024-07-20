const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const track = [
    {x: canvas.width / 4, y: 0},
    {x: 3 * canvas.width / 4, y: 0},
    {x: 3 * canvas.width / 4, y: canvas.height},
    {x: canvas.width / 4, y: canvas.height},
];

const car = { x: canvas.width / 2, y: canvas.height - 100, width: 50, height: 100, speed: 0, maxSpeed: 5, angle: 0 };
const aiCar = { x: canvas.width / 2, y: 0, width: 50, height: 100, speed: 3, angle: 0 };

let laps = 0;
let lastTimestamp = 0;

function drawTrack() {
    ctx.fillStyle = 'gray';
    ctx.beginPath();
    ctx.moveTo(track[0].x, track[0].y);
    for (let i = 1; i < track.length; i++) {
        ctx.lineTo(track[i].x, track[i].y);
    }
    ctx.closePath();
    ctx.fill();
}

function drawCar(car, color) {
    ctx.save();
    ctx.translate(car.x, car.y);
    ctx.rotate(car.angle);
    ctx.fillStyle = color;
    ctx.fillRect(-car.width / 2, -car.height / 2, car.width, car.height);
    ctx.restore();
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawTrack();
    drawCar(car, 'blue');
    drawCar(aiCar, 'red');
    aiCar.y += aiCar.speed;
    if (aiCar.y > canvas.height) {
        aiCar.y = -100;
        aiCar.x = Math.random() * (canvas.width - aiCar.width);
    }
    document.getElementById('speed').textContent = `Speed: ${Math.abs(Math.round(car.speed * 10))}`;
    document.getElementById('laps').textContent = `Laps: ${laps}`;
}

function moveCar(direction) {
    switch (direction) {
        case 'left':
            car.angle -= 0.1;
            break;
        case 'right':
            car.angle += 0.1;
            break;
        case 'up':
            car.speed = car.maxSpeed;
            break;
        case 'down':
            car.speed = -car.maxSpeed;
            break;
    }
}

function applyPhysics() {
    car.x += car.speed * Math.cos(car.angle);
    car.y += car.speed * Math.sin(car.angle);
    car.speed *= 0.98; // friction
    if (car.x < 0) car.x = 0;
    if (car.x > canvas.width) car.x = canvas.width;
    if (car.y < 0) car.y = 0;
    if (car.y > canvas.height) car.y = canvas.height;
}

document.getElementById('left').addEventListener('touchstart', () => moveCar('left'));
document.getElementById('right').addEventListener('touchstart', () => moveCar('right'));
document.getElementById('up').addEventListener('touchstart', () => moveCar('up'));
document.getElementById('down').addEventListener('touchstart', () => moveCar('down'));

document.getElementById('left').addEventListener('touchend', () => car.angle = 0);
document.getElementById('right').addEventListener('touchend', () => car.angle = 0);
document.getElementById('up').addEventListener('touchend', () => car.speed = 0);
document.getElementById('down').addEventListener('touchend', () => car.speed = 0);

window.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowLeft':
            moveCar('left');
            break;
        case 'ArrowRight':
            moveCar('right');
            break;
        case 'ArrowUp':
            moveCar('up');
            break;
        case 'ArrowDown':
            moveCar('down');
            break;
    }
});

function gameLoop(timestamp) {
    update();
    applyPhysics();
    requestAnimationFrame(gameLoop);
    if (timestamp - lastTimestamp > 1000) {
        lastTimestamp = timestamp;
        if (car.y < 0) {
            car.y = canvas.height;
            laps++;
        }
    }
}

gameLoop();
                   
