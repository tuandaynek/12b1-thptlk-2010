// Mảng gốc các bạn nữ (Đúng số lượng ảnh gốc cho Scene 3)
const isMobile = window.innerWidth < 768;
const basePhotos = [];

const validStudents = [
    "1_Nguyễn Thị Hải Yến",
    "Bùi Nguyễn Thuỷ Tiên",
    "Huỳnh Thư Nhã Uyên",
    "Lê Ngọc Minh Hằng",
    "Lê Trần Bảo Ngọc",
    "Nguyễn Thị Hải Yến",
    "Ngô Mai Phương",
    "Vương Thảo Như"
]

for (let i = 0; i < validStudents.length; i++) {
    basePhotos.push({
        src: `images/girls/${validStudents[i]}.jpg`,
        name: `Bạn ${validStudents[i]}`
    });
}

const classPhotos = [];
while (classPhotos.length < 50) {
    classPhotos.push(...basePhotos);
}
classPhotos.length = 50;

const totalBoyPhotos = 22;
const totalPresentPhotos = 22;

const boyPhotos = []
for (let i = 1; i <= totalBoyPhotos; i++){
    boyPhotos.push(`images/boys/${i}.jpg`)
}

const presentPhotos = []
for (let i = 1; i <= totalPresentPhotos; i++){
    presentPhotos.push(`images/presents/${i}.jpg`)
}



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

// 1. Khi bấm nút "Mở Món Quà Đặc Biệt" ở Màn Hình Đầu (Yên lặng)
function onStartScratch() {
    const nameInput = document.getElementById('user-name-input');
    const errorMsgEl = document.getElementById('name-error-msg');
    if (errorMsgEl) errorMsgEl.innerText = "";
    const rawName = nameInput ? nameInput.value.trim() : "";

    // Bắt buộc nhập tên
    if (!rawName) {
        if (errorMsgEl) errorMsgEl.innerText = "🌸 Nhập họ tên vào để nhận điều đặc biệt nhé!";
        if (nameInput) nameInput.focus();
        return;
    }

    // 1. Chuẩn hóa tên và cập nhật dữ liệu vào thư ẩn bên trong
    prepareStudentData(rawName);

    const audio = document.getElementById('bg-music');
    if (audio) {
        audio.play().catch(() => {});
    }

    // 3. Kích hoạt hiệu ứng Cinematic (Vẽ trái tim -> Dịch trái -> Hiện hộp quà)
    runCinematicSequence();
}

// 2. Hàm chuẩn bị dữ liệu tên & đường dẫn ảnh cá nhân
function prepareStudentData(rawName) {
    // Viết hoa chữ cái đầu mỗi từ (VD: Lê Trần Bảo Ngọc)
    const formattedName = rawName
        .toLowerCase()
        .split(' ')
        .filter(word => word.length > 0)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    // Mã hóa tên file hỗ trợ khoảng trắng & dấu tiếng Việt (mặc định đuôi .jpg)
    const encodedFileName = encodeURIComponent(formattedName);
    let imagePath = `./images/girls/${encodedFileName}.jpg`;

    let finalWish = `Chúc ${formattedName} ngày 20/10 thật rực rỡ, luôn xinh đẹp, hạnh phúc và gặt hái được mọi ước mơ nhé! ✨`;

    // Cập nhật thông tin vào DOM của thư
    if (typeof updateLetterDynamicContent === 'function') {
        updateLetterDynamicContent({
            name: formattedName,
            image: imagePath,
            wish: finalWish
        });
    }
}

// Kích hoạt overlay Cinematic song song
function runCinematicSequence() {
    const overlay = document.getElementById('cinematic-overlay');
    if (!overlay) return;

    overlay.classList.remove('hidden');
    overlay.classList.add('active');
}

let totalChoices = 0;
let lastChoice = null;
let giftCount = 0;
let heartCount = 0;
let heartScale = 1.0;
let giftScale = 1.0;

// Trạng thái mở quà
let firstChoiceFinal = null;
let hasOpenedFirst = false;
let hasOpenedSecond = false;
let collectedPhotos = { heart: [], gift: [] };

function handleChoice(choiceType) {
    if (hasOpenedFirst && !hasOpenedSecond) {
        // Nếu đã mở cái đầu, bấm vào cái còn lại để mở nốt
        triggerSecondOpening(choiceType);
        return;
    }

    if (hasOpenedFirst && hasOpenedSecond) return; // Đã xong hết thì chặn click

    totalChoices++;
    const promptEl = document.getElementById('cinematic-prompt');
    const heartItem = document.getElementById('heart-choice-item');
    const giftItem = document.getElementById('gift-choice-item');

    // Cộng dồn scale
    if (choiceType === 'gift') {
        giftScale += 0.22;
        heartScale = Math.max(0.4, heartScale - 0.18);
        if(giftItem) giftItem.style.setProperty('--current-scale', giftScale);
    } else {
        heartScale += 0.22;
        giftScale = Math.max(0.4, giftScale - 0.18);
        if(heartItem) heartItem.style.setProperty('--current-scale', heartScale);
    }

    if (heartItem) heartItem.style.transform = `scale(${heartScale})`;
    if (giftItem) giftItem.style.transform = `scale(${giftScale})`;

    let message = "";
    if (lastChoice !== null && lastChoice !== choiceType) {
        message = (choiceType === 'gift') ? "Hey, quay đầu là bờ hả ta 😏" : "Bạn bỏ tụi tui mà đi 💔";
    } else {
        if (choiceType === 'gift') {
            giftCount++;
            message = (giftCount === 1) ? "Các bạn chả thương nam tụi tui 🥲" : (giftCount === 2) ? "Thật sự là vậy sao 😳" : "Nhất quyết không chọn tụi tui à 🥺";
        } else {
            heartCount++;
            message = (heartCount === 1) ? "Không muốn nhận quà hả ta 🤔" : (heartCount === 2) ? "Thật sự là không cần quà à 🥀" : "Người con gái liêm chính của 12B1 👑";
        }
    }
    lastChoice = choiceType;

    if (promptEl) {
        promptEl.innerText = message;
        promptEl.classList.remove('pulse-text');
        void promptEl.offsetWidth;
        promptEl.classList.add('pulse-text');
    }

    // 🌟 ĐẠT MỐC 4 LẦN -> MỞ CÁI ĐẦU TIÊN
    if (totalChoices >= 4 && !hasOpenedFirst) {
        hasOpenedFirst = true;
        firstChoiceFinal = choiceType;
        triggerFirstExplosionAndNeat(choiceType);
    }
}

// 1. Mở cái đầu tiên: Tuôn trào rồi xếp gọn vào 1 bên

function triggerFirstExplosionAndNeat(choiceType) {
    const heartItem = document.getElementById('heart-choice-item');
    const giftItem = document.getElementById('gift-choice-item');
    const promptEl = document.getElementById('cinematic-prompt');

    const targetItem = (choiceType === 'heart') ? heartItem : giftItem;
    if (targetItem) targetItem.classList.add('shake-violently');

    setTimeout(() => {
        if (targetItem) targetItem.classList.remove('shake-violently');
        
        // Tuôn trào ảnh rồi xếp gọn vào lề (Heart -> Trái, Gift -> Phải)
        const side = (choiceType === 'heart') ? 'left' : 'right';
        launchAndOrganizePhotos(choiceType, side, () => {
            // Sau khi xếp xong, đổi text yêu cầu mở cái còn lại
            if (promptEl) {
                promptEl.innerText = "Trẻ con mới chọn, mở cả cái còn lại đi nào";
                promptEl.style.color = "#ffd1dc";
            }
            // Kích hoạt item còn lại để có thể click tiếp
            const remainingItem = (choiceType === 'heart') ? giftItem : heartItem;
            if (remainingItem) {
                remainingItem.style.opacity = '1';
                remainingItem.style.cursor = 'pointer';
            }
        });
    }, 1000);
}

// 2. Mở cái thứ hai (cái còn lại)
function triggerSecondOpening(choiceType) {
    if (choiceType === firstChoiceFinal) return; // Phải bấm vào cái khác
    hasOpenedSecond = true;

    const heartItem = document.getElementById('heart-choice-item');
    const giftItem = document.getElementById('gift-choice-item');
    const promptEl = document.getElementById('cinematic-prompt');

    const targetItem = (choiceType === 'heart') ? heartItem : giftItem;
    if (targetItem) targetItem.classList.add('shake-violently');

    setTimeout(() => {
        if (targetItem) targetItem.classList.remove('shake-violently');
        
        const side = (choiceType === 'heart') ? 'left' : 'right';
        launchAndOrganizePhotos(choiceType, side, () => {
            // Khi cả 2 đã mở xong -> Kích hoạt Grand Finale (Vòng tròn xoay vòng -> Văng tung tóe -> Vào scene chính)
            if (promptEl) {
                promptEl.innerText = "Tuyệt vời! Khám phá bất ngờ lớn nhất nào 🌸";
            }

            setTimeout(() => {
                startGrandFinaleSequence();
            }, 1200);
        });
    }, 1000);
}

// 🛠️ Hàm bóc tách đường dẫn ảnh sạch sẽ, tránh lấy nhầm Object/HTML card
function getCleanImageSrc(item) {
    if (!item) return './images/boys/boy1.png';
    if (typeof item === 'string') {
        // Nếu lỡ là chuỗi HTML tag, bóc lấy src bên trong
        if (item.trim().startsWith('<')) {
            const match = item.match(/src="([^"]+)"/);
            return match ? match[1] : './images/boys/boy1.png';
        }
        return item;
    }
    // Nếu là object chứa thông tin học sinh, lấy thuộc tính ảnh (image, src, photo, url...)
    return item.image || item.src || item.photo || item.url || item.avatar || './images/boys/boy1.png';
}

// Hàm tuôn ảnh và xếp gọn vào panel linh hoạt theo thiết bị
function launchAndOrganizePhotos(choiceType, sideName, callback) {
    const container = document.getElementById('photo-explosion-container') || document.body;
    
    // 📱 Kiểm tra xem có phải màn hình mobile không (< 768px)
    const isMobileScreen = window.innerWidth <= 768;

    let targetArea = sideName; // Mặc định 'left' hoặc 'right' cho desktop
    if (isMobileScreen) {
        // Trên mobile: nếu là lề trái -> đẩy lên 'top', lề phải -> đẩy xuống 'bottom'
        targetArea = (sideName === 'left') ? 'top' : 'bottom';
    }
    
    // Tạo hoặc lấy panel tương ứng
    let panel = document.getElementById(`panel-${targetArea}`);
    if (!panel) {
        panel = document.createElement('div');
        panel.id = `panel-${targetArea}`;
        panel.className = `photo-side-panel ${targetArea}`;
        document.getElementById('cinematic-overlay').appendChild(panel);
    }

    panel.innerHTML = '';
    collectedPhotos[choiceType] = [];

    // Lấy danh sách ảnh sạch 100%
    let rawList = (choiceType === 'heart') ? boyPhotos : presentPhotos;
    let photoList = rawList.map(item => getCleanImageSrc(item));
    photoList = [...new Set(photoList)];

    let loadedCount = 0;
    const totalToSpawn = photoList.length;

    for (let i = 0; i < totalToSpawn; i++) {
        setTimeout(() => {
            const imgSrc = photoList[i];
            
            // 1. Bay tuôn trào từ tâm màn hình ra
            const flyingImg = document.createElement('img');
            flyingImg.src = imgSrc;
            flyingImg.className = 'flying-photo';
            
            const angle = Math.random() * Math.PI * 2;
            const dist = 140 + Math.random() * 120;
            flyingImg.style.setProperty('--dx', `${Math.cos(angle) * dist}px`);
            flyingImg.style.setProperty('--dy', `${Math.sin(angle) * dist}px`);
            flyingImg.style.setProperty('--rot', `${Math.random() * 40 - 20}deg`);
            container.appendChild(flyingImg);

            // 2. Gom vào xếp gọn gàng vào vùng Top/Bottom (hoặc Left/Right trên PC)
            setTimeout(() => {
                flyingImg.remove();

                const neatImg = document.createElement('img');
                neatImg.src = imgSrc;
                neatImg.className = 'neat-card';

                const rot = Math.random() * 24 - 12;
                const tx = Math.random() * 12 - 6;
                const ty = Math.random() * 12 - 6;
                
                neatImg.style.setProperty('--card-transform', `rotate(${rot}deg) translate(${tx}px, ${ty}px)`);
                neatImg.style.zIndex = i;

                panel.appendChild(neatImg);
                collectedPhotos[choiceType].push(imgSrc);

                setTimeout(() => neatImg.classList.add('show-neat'), 50);

                loadedCount++;
                if (loadedCount === totalToSpawn && typeof callback === 'function') {
                    callback();
                }
            }, 1200);

        }, i * 90);
    }
}

// 🌟 GRAND FINALE: Hình trái tim ảnh khổng lồ -> Thu nhỏ -> Văng tung tóe -> Vào thẳng Bó hoa
function startGrandFinaleSequence() {
    // 1. Fade out mượt mà các panel 2 bên và prompt cũ
    document.querySelectorAll('.photo-side-panel').forEach(p => {
        p.style.transition = 'opacity 0.6s ease';
        p.style.opacity = '0';
    });

    const stageBox = document.getElementById('cinematic-stage-box');
    if (stageBox) {
        stageBox.style.transition = 'opacity 0.6s ease';
        stageBox.style.opacity = '0';
    }
    
    const promptEl = document.getElementById('cinematic-prompt');
    if (promptEl) {
        promptEl.style.display = 'none';
    }

    const container = document.getElementById('photo-explosion-container');
    if (!container) return;
    container.innerHTML = ''; // Clear sạch màn hình

    // 2. Lấy TẤT CẢ ảnh và loại bỏ trùng lặp
    let allBoys = (typeof boyPhotos !== 'undefined') ? boyPhotos.map(getCleanImageSrc) : [];
    let allPresents = (typeof presentPhotos !== 'undefined') ? presentPhotos.map(getCleanImageSrc) : [];
    
    let allPhotos = [...new Set([...allBoys, ...allPresents, ...collectedPhotos.heart, ...collectedPhotos.gift])];
    
    if (allPhotos.length === 0) {
        allPhotos = ['./images/boys/boy1.png', './images/making/gift1.png'];
    }

    // 3. Tạo container vòng tròn/trái tim orbit
    const orbitWrapper = document.createElement('div');
    orbitWrapper.className = 'circle-orbit-container';
    container.appendChild(orbitWrapper);

    const totalOrbitPhotos = allPhotos.length;
    const orbitDuration = 12; // Khớp với 12s trong CSS moveHeart
    
    for (let i = 0; i < totalOrbitPhotos; i++) {
        const img = document.createElement('img');
        img.src = allPhotos[i];
        img.className = 'orbit-photo';

        const delay = - (orbitDuration / totalOrbitPhotos) * i;
        img.style.animationDelay = `${delay}s`;

        orbitWrapper.appendChild(img);
    }

    // 🌟 Kích hoạt hiệu ứng xuất hiện trái tim bay bổng (Bloom in)
    setTimeout(() => {
        orbitWrapper.classList.add('active-orbit');
    }, 50);

    // BƯỚC B: Sau 4 giây, thu nhỏ toàn bộ khung trái tim lại từ to -> nhỏ
    setTimeout(() => {
        const isMob = window.innerWidth <= 768;
        const scaleTarget = isMob ? '0.2' : '0.35';
        orbitWrapper.style.transition = 'transform 1.5s ease-in-out';
        orbitWrapper.style.transform = `translate(-50%, -50%) scale(${scaleTarget})`;
    }, 4000);

    // BƯỚC C: Sau 5.5 giây -> Văng tung tóe khắp màn hình
    setTimeout(() => {
        orbitWrapper.remove(); // Xóa khung trái tim đi

        for (let i = 0; i < totalOrbitPhotos; i++) {
            const scatterImg = document.createElement('img');
            scatterImg.src = allPhotos[i];
            scatterImg.className = 'scatter-photo';

            const scatterAngle = (i / totalOrbitPhotos) * 360;
            const scatterDist = 450 + Math.random() * 200;
            scatterImg.style.setProperty('--sc-dx', `${Math.cos((scatterAngle * Math.PI) / 180) * scatterDist}px`);
            scatterImg.style.setProperty('--sc-dy', `${Math.sin((scatterAngle * Math.PI) / 180) * scatterDist}px`);
            scatterImg.style.setProperty('--sc-rot', `${Math.random() * 360 - 180}deg`);

            container.appendChild(scatterImg);
        }

        // BƯỚC D: CHUYỂN THẲNG VÀO SCENE BÓ HOA (Bypass hoàn toàn màn hình form/card cũ)
        setTimeout(() => {
            const overlay = document.getElementById('cinematic-overlay');
            if (overlay) {
                overlay.classList.add('fade-out');
                setTimeout(() => {
                    overlay.classList.add('hidden');
                    overlay.classList.remove('active');

                    // Ẩn sạch các scene trung gian hoặc intro cũ để không bị lộ form
                    const introScene = document.getElementById('intro-scene');
                    if (introScene) introScene.classList.add('hidden');

                    const welcomeBox = document.querySelector('.welcome-box');
                    if (welcomeBox) welcomeBox.classList.add('hidden');

                    // 🌟 Bật thẳng Scene Bó Hoa 3D
                    const bouquetScene = document.getElementById('bouquet-scene');
                    if (bouquetScene) {
                        bouquetScene.classList.remove('hidden');
                        bouquetScene.style.opacity = '0';
                        setTimeout(() => {
                            bouquetScene.style.transition = 'opacity 0.8s ease';
                            bouquetScene.style.opacity = '1';
                        }, 50);
                    }

                    const bouquetBox = document.getElementById('bouquet-box');
                    if (bouquetBox) {
                        bouquetBox.classList.add('portal-appear');
                    }

                    if (typeof initSmallBlooms === 'function') {
                        initSmallBlooms();
                    }
                }, 500);
            }
        }, 1000);

    }, 5500);
}

// 🌸 3. HÀM HIỆU ỨNG TRÁI TIM GIẬT LẠI & CHUYỂN SCENE BÓ HOA
function startBouquetScene() {
    const introCard = document.querySelector('.intro-card');
    const introScene = document.getElementById('intro-scene');
    const bouquetScene = document.getElementById('bouquet-scene');
    const bouquetBox = document.getElementById('bouquet-box');
    const welcomeBox = document.querySelector('.welcome-box');

    if (introCard) {
        introCard.classList.add('zoom-out-out');
    }

    setTimeout(() => {
        if (introScene) introScene.classList.add('hidden');
        if (bouquetScene) bouquetScene.classList.remove('hidden');
        if (welcomeBox) welcomeBox.classList.add('hidden');

        if (bouquetBox) {
            bouquetBox.classList.add('portal-appear');
        }

        // Kích hoạt smallBlooms và nhạc nền chuẩn xác ở đây
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

        div.innerHTML = `<img src="${encodeURIComponent(item.src)}" onerror="this.src='https://picsum.photos/100/100?random=${index}'">`;
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

        // 🌟 Sau 2 giây, bó hoa biến mất và kích hoạt hiệu ứng bung nở ảnh
        setTimeout(() => {
            bouquetBox.classList.add('disappear');
            
            // floodScreenPhotos sẽ trả về tổng thời gian (ms) chạy xong toàn bộ ảnh
            const totalFloodDuration = floodScreenPhotos();

            // 🌟 CHỜ CHO ĐẾN KHI TOÀN BỘ ẢNH BUNG NỞ XONG HẲN MỚI CHUYỂN SANG 3D
            setTimeout(() => {
                const bouquetScene = document.getElementById('bouquet-scene');
                if (!bouquetScene) return;
                
                bouquetScene.classList.add('smooth-fade-out'); // Mờ dần Scene 2

                setTimeout(() => {
                    bouquetScene.classList.add('hidden');
                    
                    const scene3 = document.getElementById('universe-3d-scene');
                    if (!scene3) return;

                    scene3.classList.remove('hidden');
                    scene3.style.opacity = '0';

                    // Fade-in không gian 3D từ từ
                    setTimeout(() => {
                        scene3.style.opacity = '1';
                    }, 50);

                    if (typeof initStreamingUniverse === 'function') {
                        initStreamingUniverse();
                    }
                }, 800); // Thời gian fade-out scene 2

            }, totalFloodDuration + 800); // Đợi ảnh nở xong + dư ra chút đỉnh cho đẹp mắt

        }, 2000);

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

// 🌟 Hàm floodScreenPhotos tính toán và trả về tổng thời gian chạy
function floodScreenPhotos() {
    const universeContainer = document.getElementById('universe-container');
    if (!universeContainer) return 0;
    
    universeContainer.innerHTML = '';
    universeContainer.classList.add('active');

    const total = classPhotos.length;
    let accumulatedDelay = 0;
    const startInterval = isMobile ? 0.12 : 0.08; 
    const endInterval = isMobile ? 0.08 : 0.004;
    const stepInterval = (startInterval - endInterval) / (total - 1 || 1);

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

        let currentInterval = startInterval - (index * stepInterval);
        currentInterval = Math.max(endInterval, currentInterval);
        accumulatedDelay += currentInterval;

        // Xử lý encode đường dẫn ảnh an toàn
        let imgSrc = '';
        if (typeof item === 'string') {
            imgSrc = item;
        } else if (typeof getCleanImageSrc === 'function') {
            imgSrc = getCleanImageSrc(item);
        } else {
            imgSrc = item.src || item.image || '';
        }

        photoDiv.innerHTML = `<img src="${encodeURIComponent(imgSrc)}" onerror="this.src='https://picsum.photos/220/260?random=${index + 20}'">`;
        
        photoDiv.onclick = (e) => {
            e.stopPropagation();
            if (typeof openModal === 'function') openModal(item);
        };

        universeContainer.appendChild(photoDiv);
    });

    // Trả về tổng thời gian delay (tính bằng mili-giây) + thêm 1000ms thời lượng animation của tấm cuối cùng
    return (accumulatedDelay * 1000) + 1000;
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
    "Mãi là bạn tốt cùng nhau tiến bộ trong học tập nha",
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
let startX = 0, startY = -95;

let isDragging = false;
let initialTouchDistance = 0;

// --- 1. KHỞI TẠO KHÔNG GIAN 3D ĐA LỚP DÀY DẶN ---
// --- KHỞI TẠO KHÔNG GIAN 3D TỰ ĐỘNG TỐI ƯU HIỆU NĂNG (MOBILE FRIENDLY) ---
function initStreamingUniverse() {
    const world = document.getElementById('world-3d');
    world.innerHTML = '';
    streamItems = [];

    // 🌟 TỐI ƯU DEVELOPER: Nếu là điện thoại, giảm số lượng xuống 45 items để mượt 60FPS, PC giữ 120 items
    const totalElements = isMobile ? 80 : 120; 

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
            // Trên mobile dùng ảnh kích thước nhỏ hơn để tiết kiệm RAM và băng thông load
            const imgSize = isMobile ? '90/120' : '140/180';
            el.innerHTML = `<img src="${content.src}" onerror="this.src='https://picsum.photos/${imgSize}?random=${i + 50}'">`;
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

        const radius = (isMobile ? 200 : 280) + Math.random() * (isMobile ? 300 : 600);
        const theta = Math.random() * Math.PI * 2;
        const phi = (Math.random() - 0.5) * Math.PI;

        streamItems.push({
            element: el,
            x: radius * Math.cos(phi) * Math.sin(theta),
            y: (Math.random() - 0.5) * (isMobile ? 900 : 1200),
            z: radius * Math.sin(phi) * Math.sin(theta),
            speed: 0.6 + Math.random() * 0.6
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

    // --- 1. XỬ LÝ TRÊN MÁY TÍNH (PC) ---
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

    // Zoom bằng con lăn chuột trên PC
    scene3D.addEventListener('wheel', (e) => {
        e.preventDefault();
        targetZoomZ -= e.deltaY * 0.6;
        targetZoomZ = Math.max(-400, Math.min(350, targetZoomZ));
    }, { passive: false });

    // --- 2. XỬ LÝ TRÊN ĐIỆN THOẠI / TABLET (MOBILE TOUCH & PINCH ZOOM) ---
    scene3D.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
            // Chạm 1 ngón: Bắt đầu xoay
            isDragging = true;
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        } else if (e.touches.length === 2) {
            // Chạm 2 ngón: Bắt đầu tính khoảng cách để pinch-to-zoom
            isDragging = false;
            initialTouchDistance = getTouchDistance(e.touches[0], e.touches[1]);
        }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
        if (e.touches.length === 1 && isDragging) {
            // Vuốt 1 ngón để xoay 360 độ
            const deltaX = e.touches[0].clientX - startX;
            const deltaY = e.touches[0].clientY - startY;

            targetRotY += deltaX * 0.4;
            targetRotX -= deltaY * 0.4;

            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        } else if (e.touches.length === 2) {
            // 🌟 Dùng 2 ngón chụm/mở để Zoom In / Zoom Out mượt mà trên điện thoại
            const currentDistance = getTouchDistance(e.touches[0], e.touches[1]);
            const distanceDelta = currentDistance - initialTouchDistance;

            targetZoomZ += distanceDelta * 0.8;
            targetZoomZ = Math.max(-400, Math.min(350, targetZoomZ));

            initialTouchDistance = currentDistance;
        }
    }, { passive: true });

    window.addEventListener('touchend', (e) => {
        if (e.touches.length < 2) {
            initialTouchDistance = 0;
        }
        if (e.touches.length === 0) {
            isDragging = false;
        }
    });
}

// Hàm phụ trợ tính khoảng cách giữa 2 ngón tay trên màn hình cảm ứng
function getTouchDistance(touch1, touch2) {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
}

// --- MODAL XEM CHI TIẾT ---
function openModal(item) {
    const modal = document.getElementById('image-modal');
    const zoomedImg = document.getElementById('modal-zoomed-img');
    const caption = document.getElementById('modal-caption');

    zoomedImg.src = encodeURIComponent(item.src);
    caption.innerText = `💖 ${item.name || 'Hoa 12B1'} 💖`;
    modal.classList.remove('hidden');
}

function closeModal() {
    document.getElementById('image-modal').classList.add('hidden');
}

// --- XỬ LÝ ĐÓNG / MỞ PHONG THƯ ĐA LỚP 3D ---

function toggleEnvelope(show) {
    const overlay = document.getElementById('envelope-overlay');
    const envelopeCard = document.getElementById('envelope-card');
    
    if (show) {
        overlay.classList.remove('hidden');
    } else {
        overlay.classList.add('hidden');
        // Reset trạng thái khi đóng lại
        envelopeCard.classList.remove('is-open');
        document.getElementById('interaction-hint').innerText = 'Nhấn để mở thư';
    }
}

function openLetterContent() {
    const envelopeCard = document.getElementById('envelope-card');
    const hint = document.getElementById('interaction-hint');
    
    // Toggle trạng thái mở/đóng giống như trong mẫu React (setOpened(!value))
    envelopeCard.classList.toggle('is-open');
    
    if (envelopeCard.classList.contains('is-open')) {
        hint.innerText = 'Chạm lần nữa để gấp thư lại';
    } else {
        hint.innerText = 'Nhấn để mở thư';
    }
}

// 3. HÀM CẬP NHẬT NỘI DUNG LÊN THƯ GIẤY
// Hàm cập nhật nội dung lên giấy thư
function updateLetterDynamicContent(data) {
    const greetingEl = document.querySelector('.paper-greeting');
    if (greetingEl) {
        greetingEl.innerText = `Gửi ${data.name},`;
    }

    const wishEl = document.querySelector('.paper-content p:nth-child(2)');
    if (wishEl) {
        wishEl.innerText = data.wish;
    }

    const portraitImg = document.querySelector('.paper-portrait');
    if (portraitImg) {
        portraitImg.src = data.image;
        portraitImg.onerror = function() {
            this.src = "./images/tap-the-lop.jpg";
        };
    }
}