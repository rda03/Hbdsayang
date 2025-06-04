// js/game2.js

document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('gameBoard');
    const scoreDisplay = document.getElementById('score');
    const attemptsDisplay = document.getElementById('attempts');
    const resetButton = document.getElementById('resetButton');
    const nextButtonGame2 = document.getElementById('nextButtonGame2');

    // Daftar nama file gambar untuk kartu (tanpa path dan ekstensi, akan ditambahkan nanti)
    // Pastikan ada pasangan untuk setiap gambar!
    const cardImageNames = ['icon1', 'icon2', 'icon3', 'icon4', 'icon5', 'icon6'];
    let cardsArray = []; // Akan diisi dengan objek kartu

    let flippedCards = []; // Menyimpan kartu yang sedang dibuka (maksimal 2)
    let matchedPairs = 0;
    let score = 0;
    let attempts = 0;
    let canFlip = true; // Mencegah flip berlebihan saat animasi

    const IMAGE_PATH = 'assets/images/memory/'; // Path ke gambar kartu Anda
    const IMAGE_EXTENSION = '.png'; // Ekstensi file gambar Anda
    // const CARD_BACK_IMAGE = IMAGE_PATH + 'card_back.png'; // Jika Anda punya gambar belakang kartu

    function createCard(imageName) {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.imageName = imageName; // Simpan nama gambar untuk pencocokan

        const img = document.createElement('img');
        img.src = IMAGE_PATH + imageName + IMAGE_EXTENSION;
        img.alt = imageName;

        // Jika tidak menggunakan gambar belakang kartu, kita bisa langsung style .card
        // Jika pakai gambar belakang:
        // const cardBack = document.createElement('img');
        // cardBack.src = CARD_BACK_IMAGE;
        // cardBack.classList.add('card-face', 'card-back-face');
        // card.appendChild(cardBack);
        // img.classList.add('card-face', 'card-front-face');

        card.appendChild(img);
        card.addEventListener('click', () => flipCard(card));
        return card;
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; // Tukar elemen
        }
        return array;
    }

    function initializeGame() {
        gameBoard.innerHTML = ''; // Bersihkan papan lama
        matchedPairs = 0;
        score = 0;
        attempts = 0;
        flippedCards = [];
        canFlip = true;
        updateGameInfo();

        resetButton.classList.add('hidden');
        nextButtonGame2.classList.add('hidden');

        // Buat pasangan kartu
        cardsArray = [];
        cardImageNames.forEach(name => {
            cardsArray.push({ imageName: name, id: name + '1' }); // Objek kartu dengan ID unik
            cardsArray.push({ imageName: name, id: name + '2' });
        });

        shuffleArray(cardsArray);

        // Atur jumlah kolom berdasarkan jumlah kartu (contoh: untuk 12 kartu, bisa 4x3 atau 3x4)
        // Ini bisa dibuat lebih dinamis
        let columns = 4;
        if (cardsArray.length === 8) columns = 4; // 2x4 atau 4x2
        else if (cardsArray.length === 12) columns = 4; // 3x4
        else if (cardsArray.length === 16) columns = 4; // 4x4
        // Sesuaikan dengan jumlah kartu yang Anda miliki
        if (window.innerWidth < 450 && (cardsArray.length === 12 || cardsArray.length === 8)) {
             columns = cardsArray.length === 8 ? 2 : 3; // 2x4 atau 3x4 di mobile
        }
        gameBoard.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;


        cardsArray.forEach(cardData => {
            const cardElement = createCard(cardData.imageName);
            cardElement.dataset.cardId = cardData.id; // Simpan ID unik ke elemen
            gameBoard.appendChild(cardElement);
        });
    }

    function flipCard(card) {
        if (!canFlip || card.classList.contains('flipped') || card.classList.contains('matched')) {
            return;
        }

        // if (flipSound) flipSound.play();
        card.classList.add('flipped');
        flippedCards.push(card);

        if (flippedCards.length === 2) {
            canFlip = false; // Blok flip sementara
            attempts++;
            updateGameInfo();
            checkForMatch();
        }
    }

    function checkForMatch() {
        const [card1, card2] = flippedCards;
        if (card1.dataset.imageName === card2.dataset.imageName) {
            // Kartu cocok!
            // if (matchSound) matchSound.play();
            score += 10;
            matchedPairs++;
            card1.classList.add('matched');
            card2.classList.add('matched');
            flippedCards = [];
            canFlip = true; // Izinkan flip lagi
            updateGameInfo();

            if (matchedPairs === cardImageNames.length) {
                // Semua pasangan ditemukan - Menang!
                // if (winSound) winSound.play();
                setTimeout(() => {
                    // alert('Selamat! Kamu menemukan semua kenangan!');
                    document.getElementById('gameSubtitle').textContent = "Kenangan adalah jembatan menuju hati… ayo lihat lebih banyak.";
                    nextButtonGame2.classList.remove('hidden');
                    resetButton.classList.remove('hidden');
                }, 500);
            }
        } else {
            // Tidak cocok, balikkan kartu setelah jeda
            score -= 2; // Kurangi skor jika salah
            if (score < 0) score = 0;
            setTimeout(() => {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
                flippedCards = [];
                canFlip = true; // Izinkan flip lagi
                updateGameInfo();
            }, 1200); // Jeda sebelum kartu dibalik kembali
        }
    }

    function updateGameInfo() {
        if (scoreDisplay) scoreDisplay.textContent = score;
        if (attemptsDisplay) attemptsDisplay.textContent = attempts;
    }

    // Event listener untuk tombol
    if (resetButton) {
        resetButton.addEventListener('click', initializeGame);
    }

    if (nextButtonGame2) {
        nextButtonGame2.addEventListener('click', () => {
            document.body.style.transition = 'opacity 0.5s ease-out';
            document.body.style.opacity = 0;
            setTimeout(() => {
                window.location.href = 'kado2.html';
            }, 500);
        });
    }

    // Mulai game saat halaman dimuat
    initializeGame();
});