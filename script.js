// GANTI URL INI DENGAN URL GOOGLE APPS SCRIPT ANDA
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzYelpynKr8JSuroFz3YPNh10wVl7q2h4cWncEOgMDHjNodjnvvZDcwGtrpGCMMTsq2/exec";

// Game State
let currentLevel = 1;
let coinsCollected = 0;
let studentData = { nama: "", whatsapp: "" };
let answersData = {};

// Keyboard & Touch Controls
const keys = { W: false, A: false, S: false, D: false };

// Data Quiz dan Penjelasan Jurusan tiap Level
const levelData = {
    1: {
        title: "Level 1: Akuntansi dan Keuangan Lembaga (AKL)",
        desc: "AKL mempelajari pengelolaan keuangan, pembukuan digital, dan administrasi pajak. Jurusan ini melatih ketelitian tinggi untuk karier akuntan dan perbankan.",
        question: "Apa fokus utama dari jurusan Akuntansi dan Keuangan Lembaga (AKL)?",
        options: ["Pengelolaan Keuangan & Pembukuan", "Memperbaiki Mesin Mobil", "Membuat Program Aplikasi"]
    },
    2: {
        title: "Level 2: Bisnis Daring dan Pemasaran (BDP)",
        desc: "BDP mendalami strategi pemasaran digital, e-commerce, konten kreatif promosi, serta manajemen ritel modern.",
        question: "Di jurusan BDP, keterampilan apa yang sangat diutamakan?",
        options: ["Pemasaran Digital & E-Commerce", "Pengelasan Logam", "Pelayanan Kamar Hotel"]
    },
    3: {
        title: "Level 3: Perhotelan (PH)",
        desc: "PH membekali siswa keahlian operasional hotel, tata boga, front office, dan standar pelayanan pariwisata internasional.",
        question: "Divisi yang menangani penerimaan tamu di hotel dinamakan?",
        options: ["Front Office", "Kitchen", "Engineering"]
    },
    4: {
        title: "Level 4: Rekayasa Perangkat Lunak (RPL)",
        desc: "RPL mempelajari pemrograman software, pembuatan website, aplikasi mobile, dan pengolahan basis data.",
        question: "Berikut ini yang merupakan kompetensi jurusan RPL adalah...",
        options: ["Pembuatan Website & Aplikasi Mobile", "Perbaikan AC Mobil", "Pemasaran Produk"]
    },
    5: {
        title: "Level 5: Teknik Otomotif (TO)",
        desc: "TO berfokus pada perawatan, perbaikan mesin kendaraan bermotor, sistem kelistrikan otomotif, serta teknologi modern kendaraan.",
        question: "Apa fokus utama dari jurusan Teknik Otomotif (TO)?",
        options: ["Perawatan & Perbaikan Mesin Kendaraan", "Administrasi Pajak", "Membuat Game 3D"]
    },
    6: {
        title: "Level 6: Teknik Pengelasan (TP)",
        desc: "TP melatih keahlian penyambungan logam dengan teknologi pengelasan modern standar manufaktur dan industri berat.",
        question: "Proses penyambungan dua bagian logam dengan panas disebut...",
        options: ["Pengelasan (Welding)", "Pemasaran", "Coding"]
    },
    7: {
        title: "Level 7: Rencana Masa Depan",
        desc: "Pertanyaan Refleksi Siswa",
        type: "text",
        question: "Setelah lulus SMP, Anda berencana melanjutkan ke mana dan apa alasannya?"
    },
    8: {
        title: "Level 8: Minat Jurusan",
        desc: "Pilihan Jurusan di SMK PINTAR",
        type: "select",
        question: "Jika kamu masuk ke SMK PINTAR (SMK 17 MUNCAR), jurusan apa yang ingin kamu ambil?",
        options: ["AKL", "BDP", "PH", "RPL", "TO", "TP"]
    },
    9: {
        title: "Level 9: Impian Jurusan",
        desc: "Pilihan Harapan Utama",
        type: "select",
        question: "Jurusan mana yang paling kamu inginkan agar diterima di SMK PINTAR?",
        options: ["AKL", "BDP", "PH", "RPL", "TO", "TP"]
    },
    10: {
        title: "Level 10: Hobi & Cita-Cita",
        desc: "Tuliskan secara jujur dari dalam HATI.",
        type: "textarea",
        question: "Apa Hobi dan Cita-Citamu? Ceritakan secara jujur dari hati, dan bagaimana SMK PINTAR menjadi jembatan suksesmu:"
    }
};

// Form Handler Setup
document.getElementById('student-form').addEventListener('submit', (e) => {
    e.preventDefault();
    studentData.nama = document.getElementById('nama').value;
    studentData.whatsapp = document.getElementById('whatsapp').value;
    document.getElementById('form-overlay').classList.add('hidden');
    document.getElementById('hud').classList.remove('hidden');
    document.getElementById('controls').classList.remove('hidden');
    init3DGame();
});

// Three.js Engine Variables
let scene, camera, renderer, car, coins = [];

function init3DGame() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xa0a0a0);

    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Pencahayaan
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(10, 20, 15);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0x666666));

    // Arena / Jalan
    const planeGeo = new THREE.PlaneGeometry(100, 100);
    const planeMat = new THREE.MeshPhongMaterial({ color: 0x333333 });
    const ground = new THREE.Mesh(planeGeo, planeMat);
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);

    // Bikin Mobil Merah angka "17"
    car = createCarMesh();
    scene.add(car);

    // Buat Koin untuk Level 1
    spawnCoins();

    setupControls();
    animate();
}

// Membuat Mobil Merah Angka 17
function createCarMesh() {
    const carGroup = new THREE.Group();

    // Body Mobil (Merah)
    const bodyGeo = new THREE.BoxGeometry(2, 1, 4);
    const bodyMat = new THREE.MeshPhongMaterial({ color: 0xff0000 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 0.5;
    carGroup.add(body);

    // Angka 17 (Atap Mobil)
    const canvas = document.createElement('canvas');
    canvas.width = 128; canvas.height = 128;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'red'; ctx.fillRect(0,0,128,128);
    ctx.fillStyle = 'white'; ctx.font = 'Bold 80px Arial';
    ctx.fillText('17', 20, 90);
    const texture = new THREE.CanvasTexture(canvas);

    const roofGeo = new THREE.BoxGeometry(1.8, 0.6, 2);
    const roofMat = new THREE.MeshPhongMaterial({ map: texture });
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.position.set(0, 1.2, -0.2);
    carGroup.add(roof);

    return carGroup;
}

// Buat Koin
function spawnCoins() {
    coins.forEach(c => scene.remove(c));
    coins = [];
    coinsCollected = 0;
    updateHUD();

    const coinGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.2, 16);
    const coinMat = new THREE.MeshPhongMaterial({ color: 0xffd700 });

    for (let i = 0; i < 10; i++) {
        const coin = new THREE.Mesh(coinGeo, coinMat);
        coin.position.set((Math.random() - 0.5) * 40, 0.8, (Math.random() - 0.5) * 40);
        scene.add(coin);
        coins.push(coin);
    }
}

// Kontrol HP / Sentuh
function setupControls() {
    const bindTouch = (id, key) => {
        const btn = document.getElementById(id);
        btn.addEventListener('touchstart', (e) => { e.preventDefault(); keys[key] = true; });
        btn.addEventListener('touchend', (e) => { e.preventDefault(); keys[key] = false; });
        btn.addEventListener('mousedown', () => keys[key] = true);
        btn.addEventListener('mouseup', () => keys[key] = false);
    };

    bindTouch('btn-up', 'W');
    bindTouch('btn-down', 'S');
    bindTouch('btn-left', 'A');
    bindTouch('btn-right', 'D');

    window.addEventListener('keydown', (e) => {
        if(e.key === 'ArrowUp' || e.key === 'w') keys.W = true;
        if(e.key === 'ArrowDown' || e.key === 's') keys.S = true;
        if(e.key === 'ArrowLeft' || e.key === 'a') keys.A = true;
        if(e.key === 'ArrowRight' || e.key === 'd') keys.D = true;
    });

    window.addEventListener('keyup', (e) => {
        if(e.key === 'ArrowUp' || e.key === 'w') keys.W = false;
        if(e.key === 'ArrowDown' || e.key === 's') keys.S = false;
        if(e.key === 'ArrowLeft' || e.key === 'a') keys.A = false;
        if(e.key === 'ArrowRight' || e.key === 'd') keys.D = false;
    });

    document.getElementById('btn-next-level').addEventListener('click', openQuiz);
}

// Game Loop
function animate() {
    requestAnimationFrame(animate);

    // Gerakan Mobil
    const speed = 0.3;
    const rotSpeed = 0.05;

    if (keys.W) car.translateZ(-speed);
    if (keys.S) car.translateZ(speed);
    if (keys.A) car.rotation.y += rotSpeed;
    if (keys.D) car.rotation.y -= rotSpeed;

    // Kamera mengikuti mobil
    camera.position.x = car.position.x;
    camera.position.z = car.position.z + 12;
    camera.position.y = car.position.y + 8;
    camera.lookAt(car.position);

    // Animasi dan Cek Tabrakan Koin
    coins.forEach((coin, index) => {
        coin.rotation.y += 0.05;
        if (car.position.distanceTo(coin.position) < 2) {
            scene.remove(coin);
            coins.splice(index, 1);
            coinsCollected++;
            updateHUD();
        }
    });

    renderer.render(scene, camera);
}

function updateHUD() {
    document.getElementById('hud-coins').innerText = coinsCollected;
    document.getElementById('hud-level').innerText = currentLevel;
    
    // Tombol lanjut aktif jika koin <= 10 (bisa langsung kumpul koin atau klik tombol kapan pun koin > 0)
    if (coinsCollected > 0) {
        document.getElementById('btn-next-level').classList.remove('hidden');
    }
}

// Quiz System
function openQuiz() {
    const quizOverlay = document.getElementById('quiz-overlay');
    const qData = levelData[currentLevel];
    
    document.getElementById('quiz-title').innerText = qData.title;
    document.getElementById('quiz-desc').innerText = qData.desc;
    
    const body = document.getElementById('quiz-body');
    body.innerHTML = `<p style="margin-bottom:10px; font-weight:bold;">${qData.question}</p>`;

    if (!qData.type) {
        // Pilihan Ganda
        qData.options.forEach(opt => {
            body.innerHTML += `<label style="display:block; text-align:left; margin:5px 0;">
                <input type="radio" name="answer" value="${opt}"> ${opt}
            </label>`;
        });
    } else if (qData.type === 'text' || qData.type === 'textarea') {
        body.innerHTML += `<textarea id="ans-text" rows="4" placeholder="Ketik jawaban jujur Anda di sini..."></textarea>`;
    } else if (qData.type === 'select') {
        let optionsHtml = qData.options.map(o => `<option value="${o}">${o}</option>`).join('');
        body.innerHTML += `<select id="ans-select">${optionsHtml}</select>`;
    }

    quizOverlay.classList.remove('hidden');
}

document.getElementById('btn-submit-quiz').addEventListener('click', () => {
    const qData = levelData[currentLevel];
    let val = "";

    if (!qData.type) {
        const selected = document.querySelector('input[name="answer"]:checked');
        if (!selected) return alert("Pilih salah satu jawaban!");
        val = selected.value;
    } else if (qData.type === 'select') {
        val = document.getElementById('ans-select').value;
    } else {
        val = document.getElementById('ans-text').value;
        if (!val.trim()) return alert("Isi jawaban terlebih dahulu!");
    }

    // Simpan jawaban
    answersData[`Level_${currentLevel}`] = val;

    document.getElementById('quiz-overlay').classList.add('hidden');
    document.getElementById('btn-next-level').classList.add('hidden');

    if (currentLevel < 10) {
        currentLevel++;
        car.position.set(0, 0, 0);
        spawnCoins();
    } else {
        finishGame();
    }
});

// Selesai Game & Kirim ke Google Sheets / Database
function finishGame() {
    alert("Selamat! Anda menyelesaikan semua level di SMK PINTAR!");
    
    const payload = {
        nama: studentData.nama,
        whatsapp: studentData.whatsapp,
        answers: JSON.stringify(answersData)
    };

    fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    }).then(() => {
        alert("Data pendaftaran & jawaban quiz berhasil dikirim!");
        location.reload();
    }).catch(err => alert("Gagal mengirim data: " + err));
}
