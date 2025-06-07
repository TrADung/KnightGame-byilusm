
// Lấy canvas và thiết lập context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Kích thước và vị trí hiệp sĩ
let knightX = 200;
let knightY = canvas.height - 250;
const knightWidth = 80;
const knightHeight = 100;
let knightHP = 100;
let isJumping = false;
let velocityY = 0;
const gravity = 0.5;

// Ảnh của hiệp sĩ
const knightImages = {
    idle: "pic/character/knight_idle.png",
    run: "pic/character/knight_run.png",
    attack: "pic/character/knight_attack.png",
};
let currentImage = new Image();
currentImage.src = knightImages.idle;

// Điều khiển nhân vật
let keys = {};
document.addEventListener("keydown", (event) => keys[event.key] = true);
document.addEventListener("keyup", (event) => keys[event.key] = false);

// Xử lý di chuyển và nhảy
function updateKnight() {
    if (keys["a"] && knightX > 0) {
        knightX -= 5;
        currentImage.src = knightImages.run;
    } else if (keys["d"] && knightX + knightWidth < canvas.width) {
        knightX += 5;
        currentImage.src = knightImages.run;
    } else {
        currentImage.src = knightImages.idle;
    }

    if (keys[" "] && !isJumping) {
        isJumping = true;
        velocityY = -10;
    }

    if (isJumping) {
        knightY += velocityY;
        velocityY += gravity;
        if (knightY >= canvas.height - 250) {
            knightY = canvas.height - 250;
            velocityY = 0;
            isJumping = false;
        }
    }
}

// Kẻ địch
class Enemy {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 80;
        this.height = 100;
        this.speed = 2;
        this.attacking = false;
    }

    move() {
        if (!this.attacking) {
            this.x -= this.speed;
        }
        if (!this.attacking && Math.abs(this.x - knightX) < 50 && knightHP > 0) {
            this.attack();
        }
    }

    attack() {
        this.attacking = true;
        setTimeout(() => {
            knightHP -= 10;
            this.attacking = false;
        }, 500);
    }

    draw() {
        ctx.fillStyle = "red";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

let enemies = [];
const maxEnemies = 5;

function spawnEnemy() {
    if (!gameOver && !princessAppears && enemies.length < maxEnemies) {
        let enemyY = canvas.height - 190;
        let enemy = new Enemy(canvas.width, enemyY);
        enemies.push(enemy);
    }
}

setInterval(spawnEnemy, 3000);

// Công chúa xuất hiện
let princessAppears = false;
let princessX = -120;

// Vẽ nhân vật
function drawKnight() {
    ctx.drawImage(currentImage, knightX, knightY, knightWidth, knightHeight);
}

// Cập nhật trò chơi
function updateGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    updateKnight();
    drawKnight();

    enemies.forEach((enemy) => {
        enemy.move();
        enemy.draw();
    });

    if (knightHP <= 0) {
        gameOver = true;
        showGameOverScreen();
    }

    if (!gameOver) requestAnimationFrame(updateGame);
}

let gameOver = false;
function showGameOverScreen() {
    let gameOverScreen = document.createElement("div");
    gameOverScreen.id = "gameOverScreen";
    gameOverScreen.innerHTML = "<h1>Game Over</h1><button onclick='restartGame()'>Chơi lại</button>";
    document.body.appendChild(gameOverScreen);
}

function restartGame() {
    let gameOverScreen = document.getElementById("gameOverScreen");
    if (gameOverScreen) gameOverScreen.remove();

    knightHP = 100;
    knightX = 200;
    knightY = canvas.height - 250;
    enemies = [];
    gameOver = false;
    princessAppears = false;
    princessX = -120;

    updateGame();
}

// Kiểm tra thiết bị di động
function checkOrientation() {
    if (window.innerWidth < window.innerHeight) {
        alert("Vui lòng xoay ngang điện thoại để chơi game!");
    }
}
window.addEventListener("resize", checkOrientation);
window.addEventListener("load", checkOrientation);

updateGame();
