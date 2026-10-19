// Mảng gốc các bạn nữ (Đúng số lượng ảnh gốc cho Scene 3)
const basePhotos = [];

// Tự động sinh ra 52 ảnh từ 1.jpg đến 52.jpg trong folder images/
for (let i = 1; i <= 7; i++) {
    basePhotos.push({
        src: `images/girls/${i}.png`,
        name: `Bạn 12B1 #${i}`
    });
}

const classPhotos = [];
while (classPhotos.length < 52) {
    classPhotos.push(...basePhotos);
}
classPhotos.length = 52;

// --- CANVAS HẠT LẤP LÁNH (GIỮ XUYÊN SUỐT) ---
const canvas = document.getElementById('sparkle-canvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
});

const particles = Array.from({ length: 500 }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    size: Math.random() * 2 + 0.8,
    canFlare: Math.random() < 0.35,
    flareProgress: Math.random() * Math.PI * 2,
    flareSpeed: Math.random() * 0.07 + 0.05,
    baseAlpha: Math.random() * 0.4 + 0.4,
    alpha: Math.random(),
    alphaSpeed: Math.random() * 0.02 + 0.005,
    driftX: (Math.random() - 0.5) * 0.2,
    driftY: (Math.random() - 0.5) * 0.2
}));

function animateCanvas() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
        p.x += p.driftX;
        p.y += p.driftY;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.save();
        if (p.canFlare) {
            p.flareProgress += p.flareSpeed;
            let flareFactor = (Math.sin(p.flareProgress) + 1) / 2;
            let haloRadius = p.size * 4 + flareFactor * 8;
            let grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, haloRadius);
            grad.addColorStop(0, `rgba(255, 255, 255, ${0.5 * flareFactor})`);
            grad.addColorStop(0.5, `rgba(255, 220, 140, ${0.2 * flareFactor})`);
            grad.addColorStop(1, 'rgba(255, 180, 80, 0)');

            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(p.x, p.y, haloRadius, 0, Math.PI * 2);
            ctx.fill();

            ctx.globalAlpha = p.baseAlpha + flareFactor * 0.4;
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        } else {
            p.alpha += p.alphaSpeed;
            if (p.alpha > 1 || p.alpha < 0.1) p.alphaSpeed = -p.alphaSpeed;

            ctx.globalAlpha = p.alpha * p.baseAlpha;
            ctx.fillStyle = '#fff4d1';
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    });

    requestAnimationFrame(animateCanvas);
}
animateCanvas();

// --- SCENE 1 & SCENE 2 LOGIC ---
function startBouquetScene() {
    const introCard = document.querySelector('.intro-card');
    const introScene = document.getElementById('intro-scene');
    const bouquetScene = document.getElementById('bouquet-scene');
    const bouquetBox = document.getElementById('bouquet-box');

    // Bước 1: Thu nhỏ và phát sáng card Scene 1
    introCard.classList.add('zoom-out-out');

    setTimeout(() => {
        // Bước 2: Ẩn Scene 1, hiện Scene 2
        introScene.classList.add('hidden');
        bouquetScene.classList.remove('hidden');
        
        // Bước 3: Cho Bó hoa bùng nổ hiện ra mượt mà từ tâm
        bouquetBox.classList.add('portal-appear');
        
        initSmallBlooms();
    }, 600);
}

function initSmallBlooms() {
    const container = document.getElementById('small-blooms');
    container.innerHTML = '';

    const total = classPhotos.length;
    let accumulatedDelay = 0;
    const startInterval = 0.16; 
    const endInterval = 0.015;  
    const step = (startInterval - endInterval) / (total - 1); 

    classPhotos.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'small-bloom-item';

        const angle = Math.random() * Math.PI * 2;
        const r = 10 + Math.random() * 28;
        const centerX = 42; 
        const centerY = 32; 

        const posX = centerX + Math.cos(angle) * r;
        const posY = centerY + Math.sin(angle) * (r * 0.85);
        const randomRotate = (Math.random() - 0.5) * 50;

        div.style.left = `${posX}%`;
        div.style.top = `${posY}%`;
        div.style.setProperty('--rot', `${randomRotate}deg`);
        div.style.animationDelay = `${accumulatedDelay}s`;

        let currentInterval = startInterval - (index * step);
        currentInterval = Math.max(endInterval, currentInterval);
        accumulatedDelay += currentInterval;

        div.innerHTML = `<img src="${item.src}" onerror="this.src='https://picsum.photos/100/100?random=${index}'">`;
        container.appendChild(div);
    });
}

let step = 1;

function triggerBouquetAction() {
    const smallBlooms = document.getElementById('small-blooms');
    const guideText = document.getElementById('story-guide');
    const bouquetBox = document.getElementById('bouquet-box');

    if (step === 1) {
        smallBlooms.classList.add('active');
        bouquetBox.classList.remove('portal-appear');
        guideText.innerText = "- Chạm vào bó hoa lần nữa để cảm nhận điều kỳ diệu -";
        step = 2;
    } 
    else if (step === 2) {
        playMusic();
        guideText.style.opacity = '0';
        bouquetBox.classList.add('sinking-down');

        // Hiển thị câu thoại cinematic lắng đọng
        showAdvancedCinematicText();

        // 🌟 Gọi hàm floodScreenPhotos() để ảnh bung nở tỏa ra khắp màn hình 2D mượt mà
        setTimeout(() => {
            bouquetBox.classList.add('disappear');
            floodScreenPhotos();
        }, 1200);

        // 🌟 Sau khi ảnh đã tràn ngập màn hình, chuyển mượt sang không gian 3D (Scene 3)
        setTimeout(() => {
            const bouquetScene = document.getElementById('bouquet-scene');
            bouquetScene.classList.add('smooth-fade-out'); // Mờ dần Scene 2

            setTimeout(() => {
                bouquetScene.classList.add('hidden');
                
                const scene3 = document.getElementById('universe-3d-scene');
                scene3.classList.remove('hidden');
                scene3.style.opacity = '0';

                // Fade-in không gian 3D từ từ
                setTimeout(() => {
                    scene3.style.opacity = '1';
                }, 50);

                initStreamingUniverse();
            }, 800);
        }, 4600);

        step = 3;
    }
}

function showAdvancedCinematicText() {
    const textOverlay = document.createElement('div');
    textOverlay.className = 'cinematic-text-box';
    textOverlay.innerHTML = `
        <p class="cine-line-1">Những bông hoa của lớp 12B1...</p>
        <h2 class="cine-line-2">Làm sao mà giới hạn trong một bó hoa nhỏ bé được chứ?</h2>
        <p class="cine-line-3">Đó là cả một vũ trụ rực rỡ và thanh xuân tuyệt đẹp</p>
    `;
    document.getElementById('bouquet-scene').appendChild(textOverlay);
    setTimeout(() => textOverlay.classList.add('show'), 100);
    setTimeout(() => {
        textOverlay.classList.remove('show');
        setTimeout(() => textOverlay.remove(), 1000);
    }, 3800);
}

// Giữ nguyên hàm floodScreenPhotos() để tạo hiệu ứng ảnh bung tỏa mượt mà
function floodScreenPhotos() {
    const universeContainer = document.getElementById('universe-container');
    if (!universeContainer) return; // Đảm bảo container tồn tại
    
    universeContainer.innerHTML = '';
    universeContainer.classList.add('active');

    const total = classPhotos.length;
    let accumulatedDelay = 0;
    const startInterval = 0.08; 
    const endInterval = 0.004;  
    const step = (startInterval - endInterval) / (total - 1);

    classPhotos.forEach((item, index) => {
        const photoDiv = document.createElement('div');
        photoDiv.className = 'universe-photo';

        const randomX = Math.random() * (window.innerWidth - 250);
        const randomY = Math.random() * (window.innerHeight - 280);
        const randomRotate = (Math.random() - 0.5) * 60;

        photoDiv.style.left = `${randomX}px`;
        photoDiv.style.top = `${randomY}px`;
        photoDiv.style.setProperty('--rot', `${randomRotate}deg`);
        photoDiv.style.animationDelay = `${accumulatedDelay}s`;

        let currentInterval = startInterval - (index * step);
        currentInterval = Math.max(endInterval, currentInterval);
        accumulatedDelay += currentInterval;

        photoDiv.innerHTML = `<img src="${item.src}" onerror="this.src='https://picsum.photos/220/260?random=${index + 20}'">`;
        
        photoDiv.onclick = (e) => {
            e.stopPropagation();
            openModal(item);
        };

        universeContainer.appendChild(photoDiv);
    });
}

function triggerBoomEffect() {
    const scene = document.getElementById('bouquet-scene');

    setTimeout(() => {
        scene.classList.add('hidden');
        const scene3 = document.getElementById('universe-3d-scene');
        scene3.classList.remove('hidden');

        initStreamingUniverse();
    }, 600);
}

// --- QUẢN LÝ NHẠC NỀN ---
let isPlaying = false;
function playMusic() {
    const music = document.getElementById('bg-music');
    music.volume = 0.6;
    music.play().then(() => { isPlaying = true; }).catch(err => console.log(err));
}

function toggleMusic() {
    const music = document.getElementById('bg-music');
    const btn = document.getElementById('music-toggle');
    if (isPlaying) {
        music.pause();
        btn.innerText = "🔇";
        isPlaying = false;
    } else {
        music.play();
        btn.innerText = "🔊";
        isPlaying = true;
    }
}

// --- SCENE 3: DÒNG CHẢY KỶ NIỆM (FLOWING 3D STREAM) ---
const wishes3D = [
    "Chúc bạn tui 20/10 ngập tràn quà nhé",
    "Mãi là bạn tốt cùng nhau vượt vũ môn nha",
    "Chúc bạn luôn xinh đẹp, bớt dỗi lại nhé",
    "Thanh xuân cấp 3 có cậu thật tuyệt",
    "20/10 rực rỡ, luôn cười tươi nha bạn tôi",
    "Chúc bạn học giỏi nha",
    "Chúc mừng 20/10 chiếc bạn cùng bàn siêu dễ thương",
    "Luôn tỏa sáng và giữ mãi nụ cười này nhé",
    "12B1 mãi đỉnh, chúc bạn ngày lễ siêu vui",
    "Chúc bạn tôi thi đâu đậu đó"
];

let streamItems = [];
let rotX = 0;  // Góc nghiêng camera ban đầu giống mẫu
let rotY = 40; 
let targetRotX = 0, targetRotY = 40; // Góc mục tiêu để tạo quán tính xoay mượt
let zoomZ = 0;                       // Khoảng cách zoom
let targetZoomZ = 0;                 // Zoom mục tiêu

let isDragging = false;
let startX = 0, startY = -95;

// --- 1. KHỞI TẠO KHÔNG GIAN 3D ĐA LỚP DÀY DẶN ---
function initStreamingUniverse() {
    const world = document.getElementById('world-3d');
    world.innerHTML = '';
    streamItems = [];

    const totalElements = 130; // 🌟 Tăng số lượng lên 130 để phủ kín nhiều lớp không gian

    for (let i = 0; i < totalElements; i++) {
        let type, content;
        if (i < basePhotos.length * 2) {
            type = 'photo';
            content = basePhotos[i % basePhotos.length];
        } else if (i % 2 === 0) {
            type = 'text';
            content = wishes3D[Math.floor(Math.random() * wishes3D.length)];
        } else {
            type = 'heart';
            content = '❤️';
        }

        const el = document.createElement('div');
        el.className = 'stream-item-3d';

        if (type === 'photo') {
            el.classList.add('stream-photo');
            el.innerHTML = `<img src="${content.src}" onerror="this.src='https://picsum.photos/140/180?random=${i + 50}'">`;
            el.onclick = (e) => {
                e.stopPropagation();
                openModal(content);
            };
        } else if (type === 'text') {
            el.classList.add('stream-text');
            el.innerText = content;
        } else {
            el.classList.add('stream-heart');
            el.innerText = '❤️';
        }

        world.appendChild(el);

        // 🌟 Phân bổ bán kính rộng và chiều sâu Z sâu hơn để tạo nhiều tầng lớp (Layers)
        const radius = 250 + Math.random() * 650;
        const theta = Math.random() * Math.PI * 2;
        const phi = (Math.random() - 0.5) * Math.PI;

        streamItems.push({
            element: el,
            x: radius * Math.cos(phi) * Math.sin(theta),
            y: (Math.random() - 0.5) * 1200, // Trải dài theo chiều dọc
            z: radius * Math.sin(phi) * Math.sin(theta),
            speed: 3
        });
    }

    initStreamingLoop();
    initStreamingInteraction();
}

// --- 2. VÒNG LẶP ANIMATION ĐA LỚP VỚI HIỆU ỨNG PHÓNG THU CHIỀU SÂU (Z-SCALING) ---
function initStreamingLoop() {
    const world = document.getElementById('world-3d');
    const boundY = 700;

    function update() {
        rotX += (targetRotX - rotX) * 0.12;
        rotY += (targetRotY - rotY) * 0.12;
        zoomZ += (targetZoomZ - zoomZ) * 0.12;

        world.style.transform = `translateZ(${zoomZ}px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;

        for (let i = 0; i < streamItems.length; i++) {
            const item = streamItems[i];
            item.y += item.speed;

            if (item.y > boundY) {
                item.y = -boundY;
                item.x = (Math.random() - 0.5) * window.innerWidth * 0.9;
                item.z = (Math.random() - 0.5) * 700;
            }

            // 🌟 TÍNH TOÁN TỶ LỆ PHÓNG TO/THU (SCALE) VÀ ĐỘ MỜ THEO CHIỀU SÂU Z (MULTI-LAYER)
            // Lớp ở gần (z dương lớn) sẽ to và rõ; lớp ở xa (z âm sâu) sẽ nhỏ và mờ ảo
            let depthScale = 0.5 + (item.z + 400) / 700;
            depthScale = Math.max(0.35, Math.min(1.5, depthScale));

            let depthAlpha = 0.35 + (item.z + 400) / 700;
            depthAlpha = Math.max(0.25, Math.min(1, depthAlpha));

            // Hiệu ứng mờ dần nhẹ ở biên trên/dưới
            const distanceToEdge = boundY - Math.abs(item.y);
            let edgeAlpha = Math.min(1, Math.max(0, distanceToEdge / 180));

            item.element.style.opacity = (depthAlpha * edgeAlpha).toFixed(2);
            
            // Kết hợp translate3d và scale3d để tạo hiệu ứng không gian đa lớp cực kỳ có chiều sâu
            item.element.style.transform = `translate3d(${item.x.toFixed(1)}px, ${item.y.toFixed(1)}px, ${item.z.toFixed(1)}px) scale(${depthScale.toFixed(2)})`;
        }

        requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
}

// --- 3. TƯƠNG TÁC XOAY 360 ĐỘ VÀ ZOOM CON LĂN CHUỘT ---
function initStreamingInteraction() {
    const scene3D = document.getElementById('universe-3d-scene');

    // Kéo chuột xoay tự do
    scene3D.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;

        targetRotY += deltaX * 0.35;
        targetRotX -= deltaY * 0.35;

        startX = e.clientX;
        startY = e.clientY;
    });

    window.addEventListener('mouseup', () => { 
        isDragging = false; 
    });

    // 🌟 ZOOM IN / ZOOM OUT BẰNG CON LĂN CHUỘT (MƯỢT MÀ)
    scene3D.addEventListener('wheel', (e) => {
        e.preventDefault();
        targetZoomZ -= e.deltaY * 0.6; // Điều chỉnh độ nhạy khi lăn chuột
        targetZoomZ = Math.max(-500, Math.min(450, targetZoomZ)); // Giới hạn khoảng cách zoom an toàn
    }, { passive: false });

    // Hỗ trợ cảm ứng vuốt trên điện thoại / tablet
    scene3D.addEventListener('touchstart', (e) => {
        isDragging = true;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    });

    window.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const deltaX = e.touches[0].clientX - startX;
        const deltaY = e.touches[0].clientY - startY;

        targetRotY += deltaX * 0.35;
        targetRotX -= deltaY * 0.35;

        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    });

    window.addEventListener('touchend', () => { 
        isDragging = false; 
    });
}

// --- MODAL XEM CHI TIẾT ---
function openModal(item) {
    const modal = document.getElementById('image-modal');
    const zoomedImg = document.getElementById('modal-zoomed-img');
    const caption = document.getElementById('modal-caption');

    zoomedImg.src = item.src;
    caption.innerText = `💖 ${item.name || 'Hoa 12B1'} 💖`;
    modal.classList.remove('hidden');
}

function closeModal() {
    document.getElementById('image-modal').classList.add('hidden');
}

// --- XỬ LÝ ĐÓNG / MỞ PHONG THƯ TÌNH YÊU 20/10 ---

// Hàm bật/tắt cửa sổ phong thư
function toggleEnvelope(show) {
    const envelopeOverlay = document.getElementById('envelope-overlay');
    const envelopeCard = document.getElementById('envelope-card');
    const letterContent = document.getElementById('letter-content');

    if (show) {
        envelopeOverlay.classList.remove('hidden');
        envelopeCard.classList.remove('hidden');
        letterContent.classList.add('hidden'); // Trở về trạng thái phong thư ban đầu
    } else {
        envelopeOverlay.classList.add('hidden');
    }
}

// Hàm bấm vào phong thư để mở thiệp chúc mừng bên trong
function openLetterContent() {
    const envelopeCard = document.getElementById('envelope-card');
    const letterContent = document.getElementById('letter-content');

    // Mở nắp/ẩn vỏ thư và hiện thiệp chúc mừng
    envelopeCard.classList.add('hidden');
    letterContent.classList.remove('hidden');
    const mainImg = document.getElementById('letter-main-img');
    mainImg.src = "./images/tap-the-lop.jpg"
}