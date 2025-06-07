// Tạo hiệu ứng tuyết rơi
function createSnowflakes() {
    const snowflakesContainer = document.querySelector('.snowflakes');
    for (let i = 0; i < 100; i++) {
        const snowflake = document.createElement('div');
        snowflake.classList.add('snowflake');
        snowflake.textContent = '❄';
        
        // Tạo kích thước ngẫu nhiên cho từng tuyết
        const size = Math.random() * 0.5 + 0.5; // Kích thước ngẫu nhiên từ 0.5 đến 1
        snowflake.style.fontSize = `${size}rem`;
        
        // Tạo vị trí ngẫu nhiên cho từng tuyết
        snowflake.style.left = `${Math.random() * 100}vw`; // Ngẫu nhiên từ 0 đến 100% chiều rộng
        snowflake.style.animationDuration = `${Math.random() * 3 + 5}s`; // Thời gian rơi ngẫu nhiên (từ 5 đến 8 giây)
        snowflake.style.animationDelay = `${Math.random() * 5}s`; // Trễ ngẫu nhiên để tạo hiệu ứng không đồng bộ
        
        snowflakesContainer.appendChild(snowflake);
    }
}

// Xử lý khi nhấp vào hộp quà
document.getElementById('giftBox').addEventListener('click', function() {
    document.getElementById('giftBox').style.display = 'none';  // Ẩn hộp quà khi nhấn vào
    toggleMusic();  // Điều khiển play/pause nhạc khi nhấn hộp quà
    startAnimations();  // Chạy các hiệu ứng bạn đã chuẩn bị sau khi hộp quà biến mất
});

// Chạy các hiệu ứng sau khi hộp quà biến mất
function startAnimations() {
    // Vẽ cây thông và ông già Noel
    createTreeAndSanta();  // Vẽ cây thông và ông già Noel
    createSnowflakes();  // Khởi tạo tuyết rơi
    toggleMusic();  // Phát nhạc ngay khi bắt đầu

    console.log("Chạy các hiệu ứng vẽ cây thông và ông già Noel");
}

// Vẽ cây thông và ông già Noel
function createTreeAndSanta() {
    const treeContainer = document.createElement('div');
    treeContainer.classList.add('tree-container');
    
    const tree = document.createElement('div');
    tree.classList.add('tree');
    
    const treeTop = document.createElement('div');
    treeTop.classList.add('tree-top');
    
    const santa = document.createElement('div');
    santa.classList.add('santa');

    treeContainer.appendChild(tree);
    tree.appendChild(treeTop);
    treeContainer.appendChild(santa);

    document.body.appendChild(treeContainer);
}

// Điều khiển play/pause nhạc khi nhấn vào hộp quà
function toggleMusic() {
    const music = document.getElementById('backgroundMusic');
    if (music.paused) {
        music.play();
    } else {
        music.pause();
    }
}
