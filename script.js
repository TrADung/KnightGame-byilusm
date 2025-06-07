// Lấy thẻ canvas và thiết lập ngữ cảnh vẽ
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
// Thiết lập kích thước canvas theo cửa sổ
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
// Load hình ảnh
const background = new Image();
background.src = "pic/background/background.png";
const knightImages = {
    idle: "pic/character/idle.png",
    run: "pic/character/run.png",
    jump: "pic/character/jump.png",
    attack: "pic/character/attack.png"
};
const enemyImage = "pic/character/enemy.png";
const enemyAttackImage = "pic/character/enemy_attack.png";
const princessImage = new Image();
princessImage.src = "pic/character/princess.png";  // Đường dẫn ảnh công chúa
const castleImage = new Image();
castleImage.src = "pic/background/castle.png"; // Đường dẫn đến hình ảnh lâu đài
let currentImage = new Image();
currentImage.src = knightImages.idle;
// Biến nhân vật
let knightX = 200;
let knightY = canvas.height - 250;
let knightWidth = 150;
let knightHeight = 150;
let isJumping = false;
let isAttacking = false;
let knightHP = 100;
const maxHP = 100;
let gravity = 2;
let velocityY = 0; // Đặt lại giá trị ban đầu cho velocityY
let gameOver = false;
// Biến điều khiển di chuyển
let keys = {};
// Mảng chứa kẻ địch
let enemies = [];
const enemyWidth = 150, enemyHeight = 150;
// Biến để theo dõi số kẻ địch đã bị tiêu diệt
let enemiesDefeated = 0;
const maxEnemies = 10; // Giảm số kẻ địch cần tiêu diệt xuống 10
let princessAppears = false;
// Biến để theo dõi vị trí công chúa
let princessX = -120; // Bắt đầu bên ngoài màn hình
let princessY = canvas.height - 250; // Đặt vị trí Y của công chúa
// Biến để theo dõi trạng thái của trò chơi
let gameState = "game"; // Trạng thái ban đầu là trò chơi
// Lớp kẻ địch
class Enemy {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.speed = Math.random() * 2 + 1;
        this.image = new Image();
        this.image.src = enemyImage;
        this.alive = true;
        this.attacking = false;
        this.direction = -1; // Mặc định di chuyển từ phải sang trái
    }
    
    move() {
        if (this.alive && !gameOver) {
            this.x += this.speed * this.direction;
            // Khi kẻ địch đi qua nhân vật, nó sẽ quay lại
            if (this.x + enemyWidth < knightX && this.direction === -1) {
                this.direction = 1;
            } else if (this.x > knightX + knightWidth && this.direction === 1) {
                this.direction = -1;
            }
            // Chỉ tấn công nếu nó đang gần nhân vật
            if (!this.attacking && Math.abs(this.x - knightX) < 50 && knightHP > 0) {
                this.attack();
            }
        }
    }
    
    attack() {
        this.attacking = true;
        this.image.src = enemyAttackImage;
        setTimeout(() => {
            if (this.alive && Math.abs(this.x - knightX) < 50) { // Chỉ trừ máu nếu đang trong phạm vi
                knightHP -= 10;
                if (knightHP <= 0) {
                    knightHP = 0;
                    endGame();
                }
            }
            this.image.src = enemyImage;
            this.attacking = false;
        }, 500);
    }
    
    draw() {
        if (this.alive) {
            let attackWidth = this.attacking ? enemyWidth + 30 : enemyWidth; // Mở rộng khi tấn công
            ctx.drawImage(this.image, this.x, this.y, attackWidth, enemyHeight);
        }
    }
}
// Hàm sinh kẻ địch
function spawnEnemy() {
    if (!gameOver && !princessAppears) {
        let enemyY = canvas.height - enemyHeight - 90;
        let enemy = new Enemy(canvas.width, enemyY);
        enemies.push(enemy);
    }
}
// Kiểm tra va chạm
function checkCollision() {
    enemies.forEach((enemy, index) => {
        if (isAttacking && enemy.alive && knightX + knightWidth >= enemy.x && knightX <= enemy.x + enemyWidth) {
            enemy.alive = false;
            enemiesDefeated++;
            // Nếu đã đủ 10 kẻ địch, dừng tạo kẻ địch và xuất hiện công chúa
            if (enemiesDefeated >= maxEnemies) {
                princessAppears = true; // Xuất hiện công chúa
                princessX = -120; // Đặt lại vị trí công chúa
                enemies = []; // Xóa tất cả kẻ địch còn lại
            }
        }
    });
}
// Vẽ thanh máu
function drawHP() {
    const barWidth = 200, barHeight = 20, x = 20, y = 20;
    ctx.fillStyle = "black";
    ctx.fillRect(x - 2, y - 2, barWidth + 4, barHeight + 4);
    ctx.fillStyle = "red";
    ctx.fillRect(x, y, (knightHP / maxHP) * barWidth, barHeight);
}
// Xử lý di chuyển
function moveKnight() {
    if (keys["a"]) {
        knightX -= 5;
        currentImage.src = knightImages.run;
    } else if (keys["d"]) {
        knightX += 5;
        currentImage.src = knightImages.run;
    } else if (!isJumping && !isAttacking) {
        currentImage.src = knightImages.idle;
    }
}
// Xử lý nhảy
function jump() {
    if (!isJumping && !gameOver) {
        isJumping = true;
        velocityY = -20; // Đặt lại giá trị cho velocityY khi nhảy
        currentImage.src = knightImages.jump;
    }
}
// Xử lý tấn công
function attack() {
    if (!isAttacking && !gameOver) {
        isAttacking = true;
        currentImage.src = knightImages.attack;
        setTimeout(() => {
            isAttacking = false;
        }, 500);
    }
}
// Kết thúc game
function endGame() {
    gameOver = true;
    // Kiểm tra nếu đã có màn hình game over thì không tạo lại
    if (document.getElementById("gameOverScreen")) return;
    
    // Tạo lớp phủ toàn màn hình
    let gameOverDiv = document.createElement("div");
    gameOverDiv.id = "gameOverScreen";
    gameOverDiv.style.position = "fixed";
    gameOverDiv.style.top = "0";
    gameOverDiv.style.left = "0";
    gameOverDiv.style.width = "100vw";
    gameOverDiv.style.height = "100vh";
    gameOverDiv.style.background = "rgba(0, 0, 0, 0.7)";
    gameOverDiv.style.display = "flex";
    gameOverDiv.style.flexDirection = "column";
    gameOverDiv.style.justifyContent = "center";
    gameOverDiv.style.alignItems = "center";
    gameOverDiv.style.textAlign = "center";
    gameOverDiv.style.color = "white";
    gameOverDiv.style.fontSize = "30px";
    
    let message = document.createElement("h1");
    message.innerText = "Bạn đã thua!";
    
    let restartButton = document.createElement("button");
    restartButton.innerText = "Chơi lại";
    restartButton.style.display = "flex"; 
    restartButton.style.justifyContent = "center"; 
    restartButton.style.alignItems = "center"; 
    restartButton.style.padding = "0"; 
    restartButton.style.fontSize = "20px"; 
    restartButton.style.fontWeight = "bold"; 
    restartButton.style.cursor = "pointer"; 
    restartButton.style.border = "none"; 
    restartButton.style.background = "red"; 
    restartButton.style.color = "white"; 
    restartButton.style.borderRadius = "10px"; 
    restartButton.style.width = "200px"; 
    restartButton.style.height = "60px"; 
    restartButton.style.textAlign = "center";
    restartButton.addEventListener("click", restartGame);
    
    gameOverDiv.appendChild(message);
    gameOverDiv.appendChild(restartButton);
    document.body.appendChild(gameOverDiv);
}
// Khởi động lại game
function restartGame() {
    // Đóng thông báo nếu nó đang hiển thị
    closeMessage(); // Gọi hàm để đóng thông báo
    // Đặt lại các biến trò chơi
    knightHP = 100;
    knightX = 200;
    knightY = canvas.height - 250;
    enemies = [];
    enemiesDefeated = 0; // Đặt lại số kẻ địch đã tiêu diệt
    princessAppears = false; // Đặt lại trạng thái công chúa
    princessX = -120; // Đặt lại vị trí công chúa
    gameOver = false;
    gameState = "game"; // Đặt lại trạng thái trò chơi
}
// Cập nhật game
function update() {
    if (gameState === "castle") {
        return; // Không cập nhật khi ở trong cảnh lâu đài
    }
    if (!gameOver) {
        if (isJumping) {
            knightY += velocityY;
            velocityY += gravity;
            if (knightY >= canvas.height - 250) {
                knightY = canvas.height - 250;
                isJumping = false;
            }
        }
        moveKnight();
        enemies.forEach((enemy) => enemy.move());
        checkCollision();
        // Di chuyển công chúa vào màn hình
        if (princessAppears) {
            princessX += 2; // Tốc độ di chuyển của công chúa
            if (princessX >= knightX) { // Khi công chúa đến gần knight
                showRescueMessage(); // Hiện thông báo đã giải cứu công chúa
                princessAppears = false; // Ngừng di chuyển công chúa
            }
        }
    }
}
// Vẽ game
function draw() {
    if (gameState === "castle") {
        ctx.drawImage(castleImage, 0, 0, canvas.width, canvas.height);
        // Không vẽ hiệp sĩ và công chúa ở đây để chúng biến mất
        return; // Kết thúc hàm draw để không vẽ lại trò chơi
    }
    // Phần vẽ trò chơi gốc
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    if (isAttacking) {
        let attackWidth = 245; // Mở rộng chiều rộng ảnh attack
        ctx.drawImage(currentImage, knightX - 0, knightY, attackWidth, knightHeight);
    } else {
        ctx.drawImage(currentImage, knightX, knightY, knightWidth, knightHeight);
    }
    drawHP();
    enemies.forEach((enemy) => enemy.draw());
    drawEnemyCount();  // Hiển thị số kẻ địch đã tiêu diệt
    drawPrincess();  // Hiển thị công chúa nếu đủ điều kiện
}
// Vẽ số kẻ địch đã tiêu diệt
function drawEnemyCount() {
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText(`Tiêu diệt: ${enemiesDefeated}/${maxEnemies}`, canvas.width - 150, 30);
}
// Vẽ công chúa
function drawPrincess() {
    if (princessAppears) {
        ctx.drawImage(princessImage, princessX, princessY, 150, 180); // Tăng kích thước công chúa
    }
}
// Hiện thông báo đã giải cứu công chúa
function showRescueMessage() {
    // Kiểm tra nếu đã có thông báo giải cứu thì không tạo lại
    if (document.getElementById("rescueMessage")) return;
    let messageDiv = document.createElement("div");
    messageDiv.id = "rescueMessage";
    messageDiv.style.position = "fixed";
    messageDiv.style.top = "0";
    messageDiv.style.left = "0";
    messageDiv.style.width = "100vw";
    messageDiv.style.height = "100vh";
    messageDiv.style.background = "rgba(0, 0, 0, 0.7)";
    messageDiv.style.display = "flex";
    messageDiv.style.flexDirection = "column";
    messageDiv.style.justifyContent = "center";
    messageDiv.style.alignItems = "center";
    messageDiv.style.textAlign = "center";
    messageDiv.style.color = "white";
    messageDiv.style.fontSize = "30px";
    let message = document.createElement("h1");
    message.innerText = "Bạn đã giải cứu công chúa!";
    let closeButton = document.createElement("button");
    closeButton.innerText = "Đóng";
    closeButton.style.display = "flex"; 
    closeButton.style.justifyContent = "center"; 
    closeButton.style.alignItems = "center"; 
    closeButton.style.padding = "0"; 
    closeButton.style.fontSize = "20px"; 
    closeButton.style.fontWeight = "bold"; 
    closeButton.style.cursor = "pointer"; 
    closeButton.style.border = "none"; 
    closeButton.style.background = "green"; // Màu nền cho nút
    closeButton.style.color = "white"; 
    closeButton.style.borderRadius = "10px"; 
    closeButton.style.width = "200px"; 
    closeButton.style.height = "60px"; 
    closeButton.style.textAlign = "center";
    closeButton.addEventListener("click", closeMessage);
    let restartButton = document.createElement("button");
    restartButton.innerText = "Chơi lại";
    restartButton.style.display = "flex"; 
    restartButton.style.justifyContent = "center"; 
    restartButton.style.alignItems = "center"; 
    restartButton.style.padding = "0"; 
    restartButton.style.fontSize = "20px"; 
    restartButton.style.fontWeight = "bold"; 
    restartButton.style.cursor = "pointer"; 
    restartButton.style.border = "none"; 
    restartButton.style.background = "blue"; // Màu nền cho nút
    restartButton.style.color = "white"; 
    restartButton.style.borderRadius = "10px"; 
    restartButton.style.width = "200px"; 
    restartButton.style.height = "60px"; 
    restartButton.style.textAlign = "center";
    restartButton.addEventListener("click", restartGame); // Thêm sự kiện cho nút "Chơi lại"
    messageDiv.appendChild(message);
    messageDiv.appendChild(closeButton);
    messageDiv.appendChild(restartButton); // Thêm nút "Chơi lại" vào thông báo
    document.body.appendChild(messageDiv);
}
// Đóng thông báo
function closeMessage() {
    let messageDiv = document.getElementById("rescueMessage");
    if (messageDiv) {
        messageDiv.remove();
    }
    
    // Chuyển đến cảnh mới
    gameState = "castle"; // Đặt trạng thái trò chơi là "castle"
}
// Game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    update();
    draw();
    requestAnimationFrame(gameLoop);
}
// Xử lý sự kiện bàn phím
window.addEventListener("keydown", (e) => {
    keys[e.key] = true;
    if (e.key === " ") jump();
});
window.addEventListener("keyup", (e) => keys[e.key] = false);
// Xử lý tấn công bằng chuột
window.addEventListener("mousedown", attack);
// Bắt đầu game
background.onload = () => {
    gameLoop();
    setInterval(spawnEnemy, 3000);
};


// Xử lý điều khiển trên điện thoại
document.getElementById("btn-left").addEventListener("touchstart", () => keys["a"] = true);
document.getElementById("btn-left").addEventListener("touchend", () => keys["a"] = false);
document.getElementById("btn-right").addEventListener("touchstart", () => keys["d"] = true);
document.getElementById("btn-right").addEventListener("touchend", () => keys["d"] = false);
document.getElementById("btn-jump").addEventListener("touchstart", jump);
document.getElementById("btn-attack").addEventListener("touchstart", attack);

// Thiết lập kích thước nút điều khiển
document.getElementById("btn-left").style.width = "80px";
document.getElementById("btn-left").style.height = "80px";
document.getElementById("btn-left").style.left = "20px"; // Xích vào trong
document.getElementById("btn-right").style.width = "80px";
document.getElementById("btn-right").style.height = "80px";
document.getElementById("btn-right").style.left = "120px"; // Xích vào trong
document.getElementById("btn-jump").style.width = "80px";
document.getElementById("btn-jump").style.height = "80px";
document.getElementById("btn-jump").style.right = "120px"; // Xích vào trong
document.getElementById("btn-attack").style.width = "80px";
document.getElementById("btn-attack").style.height = "80px";
document.getElementById("btn-attack").style.right = "20px"; // Xích vào trong