// Lấy canvas và thiết lập context
console.log("Script đang chạy");
const canvas = document.getElementById("gameCanvas");
console.log("Canvas element:", canvas);
const ctx = canvas.getContext("2d");
console.log("Canvas context:", ctx);

// Kích thước và vị trí hiệp sĩ
let knightX = 200;
let knightY = canvas.height - 250;
const knightWidth = 80;
const knightHeight = 100;
let knightHP = 100;
let isJumping = false;
let velocityY = 0;
const gravity = 0.5;

// Vẽ hiệp sĩ
function drawKnight() {
    console.log("Đang vẽ hiệp sĩ tại:", knightX, knightY);
    // Vẽ thân
    ctx.fillStyle = "#4169E1"; // Màu xanh dương
    ctx.fillRect(knightX, knightY, knightWidth, knightHeight);
    
    // Vẽ đầu
    ctx.fillStyle = "#FFD700"; // Màu vàng
    ctx.fillRect(knightX + 20, knightY - 20, 40, 40);
    
    // Vẽ kiếm
    ctx.fillStyle = "#C0C0C0"; // Màu bạc
    ctx.fillRect(knightX + knightWidth, knightY + 30, 20, 5);
}

// Điều khiển nhân vật
let keys = {};
document.addEventListener("keydown", (event) => {
    console.log("Phím được nhấn:", event.key);
    keys[event.key] = true;
});
document.addEventListener("keyup", (event) => keys[event.key] = false);

// Xử lý di chuyển và nhảy
function updateKnight() {
    if (keys["a"] && knightX > 0) {
        knightX -= 5;
    } else if (keys["d"] && knightX + knightWidth < canvas.width) {
        knightX += 5;
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
        // Vẽ thân
        ctx.fillStyle = "#8B0000"; // Màu đỏ đậm
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Vẽ đầu
        ctx.fillStyle = "#FF4500"; // Màu cam đỏ
        ctx.fillRect(this.x + 20, this.y - 20, 40, 40);
        
        // Vẽ vũ khí
        ctx.fillStyle = "#696969"; // Màu xám đậm
        ctx.fillRect(this.x - 10, this.y + 30, 20, 5);
    }
}

let enemies = [];
const maxEnemies = 5;

function spawnEnemy() {
    if (!gameOver && !princessAppears && enemies.length < maxEnemies) {
        let enemyY = canvas.height - 190;
        let enemy = new Enemy(canvas.width, enemyY);
        enemies.push(enemy);
        console.log("Spawn enemy tại:", canvas.width, enemyY);
    }
}

setInterval(spawnEnemy, 3000);

// Công chúa xuất hiện
let princessAppears = false;
let princessX = -120;

// Cập nhật trò chơi
function updateGame() {
    console.log("Đang cập nhật game");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Vẽ nền
    ctx.fillStyle = "#87CEEB"; // Màu xanh da trời
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Vẽ mặt đất
    ctx.fillStyle = "#8B4513"; // Màu nâu
    ctx.fillRect(0, canvas.height - 150, canvas.width, 150);
    
    // Vẽ cỏ
    ctx.fillStyle = "#228B22"; // Màu xanh lá
    ctx.fillRect(0, canvas.height - 150, canvas.width, 10);

    updateKnight();
    drawKnight();

    enemies.forEach((enemy) => {
        enemy.move();
        enemy.draw();
    });

    // Vẽ thanh máu
    ctx.fillStyle = "#FF0000"; // Màu đỏ
    ctx.fillRect(10, 10, 200, 20);
    ctx.fillStyle = "#00FF00"; // Màu xanh lá
    ctx.fillRect(10, 10, knightHP * 2, 20);
    
    // Vẽ viền thanh máu
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, 200, 20);

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
    gameOverScreen.style.display = "block";
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
window.addEventListener("load", () => {
    console.log("Trang đã tải xong");
    checkOrientation();
    updateGame();
}); 