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
}

document.getElementById('left').addEventListener('touchstart', () => moveCar('left'));
document.getElementById('right').addEventListener('touchstart', () => moveCar('right'));
document.getElementById('up').addEventListener('touchstart', () => moveCar('up'));
document.getElementById('down').addEventListener('touchstart', () => moveCar('down'));

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

function gameLoop() {
    update();
    applyPhysics();
    requestAnimationFrame(gameLoop);
}

gameLoop();
    
