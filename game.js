const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: '#f3f3f3',
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let game = new Phaser.Game(config);
let car;
let cursors;
let crashPopup;

function preload() {
    this.load.image('car', 'path/to/car/image.png');
    this.load.image('track', 'path/to/track/image.png');
}

function create() {
    this.add.image(config.width / 2, config.height / 2, 'track');
    car = this.physics.add.image(config.width / 2, config.height - 150, 'car');
    car.setCollideWorldBounds(true);

    cursors = this.input.keyboard.createCursorKeys();
    crashPopup = document.getElementById('crashPopup');
}

function update() {
    car.setVelocity(0);

    if (cursors.left.isDown) {
        car.setAngularVelocity(-150);
    } else if (cursors.right.isDown) {
        car.setAngularVelocity(150);
    } else {
        car.setAngularVelocity(0);
    }

    if (cursors.up.isDown) {
        this.physics.velocityFromRotation(car.rotation, 200, car.body.velocity);
    } else if (cursors.down.isDown) {
        this.physics.velocityFromRotation(car.rotation, -200, car.body.velocity);
    }

    if (checkCollision()) {
        showCrashPopup();
    }
}

function checkCollision() {
    if (car.x < 0 || car.x > config.width || car.y < 0 || car.y > config.height) {
        return true;
    }
    return false;
}

function showCrashPopup() {
    crashPopup.style.display = 'block';
}

function restartGame() {
    car.setPosition(config.width / 2, config.height - 150);
    car.setVelocity(0);
    car.setAngularVelocity(0);
    crashPopup.style.display = 'none';
}

window.addEventListener('resize', () => {
    game.scale.resize(window.innerWidth, window.innerHeight);
});
    
