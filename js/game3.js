// js/game3.js
// KODE JAVASCRIPT INI ADALAH VERSI LENGKAP YANG TELAH KITA SEMPURNAKAN SEBELUMNYA.

document.addEventListener('DOMContentLoaded', () => {
    const gameContainerWrapper = document.querySelector('.game-container-wrapper');
    const decorativeBackground = document.querySelector('.decorative-background-effects');
    const starsBackground = document.getElementById('starsBackground');
    
    const gameContainer = document.getElementById('interactiveGameContainer');
    const gameTitleEl = document.getElementById('gameTitle');
    const gameSubtitleEl = document.getElementById('gameSubtitle');
    const questionWrapperEl = document.getElementById('questionWrapper');
    const questionTextEl = document.getElementById('questionText');
    const yesButton = document.getElementById('yesButton');
    const noButton = document.getElementById('noButton');
    const feedbackTextEl = document.getElementById('feedbackText');
    const gameResultArea = document.getElementById('gameResultArea');
    const nextButtonGame3 = document.getElementById('nextButtonGame3');

    const questions = [
        { question: "Jujur ya, aku ganteng kan di mata kamu?", yesText: "Banget! Nggak Ada Duanya!", noText: "Relatif Sih Ya...", noMessages: ["Yakin? Coba pikir lagi deh...", "Masa sih? Aku udah maksimal lho!", "Ayolah, jangan gitu..."] },
        { question: "Kamu percaya kan kalau aku tulus sayang sama kamu?", yesText: "Percaya Selalu!", noText: "Agak Ragu Nih...", noMessages: ["Kok ragu? Aku buktiin nih!", "Jangan buat aku sedih...", "Percaya dong, please..."] },
        { question: "Sayang, setelah semua kejutan dan game ini, hatimu masih sepenuhnya buat aku kan?", yesText: "Selalu dan Selamanya, Cintaku!", noText: "Ada yang Nyempil Dikit...", noMessages: ["Waduh, siapa tuh? Awas ya!", "Nggak boleh! Harus aku semua!", "Cuma boleh buat aku titik!"] }
    ];

    let currentQuestionIndex = 0;
    let noButtonClickCount = 0;
    let gameFinished = false;
    let wrapperRect = null; 

    function updateWrapperRect() { 
        if (gameContainerWrapper) {
            wrapperRect = gameContainerWrapper.getBoundingClientRect();
        } else {
            console.error(".game-container-wrapper not found for positioning!");
        }
    }
    
    window.addEventListener('resize', updateWrapperRect); 

    if (gameContainerWrapper) {
        gameContainerWrapper.classList.add('background-initial');
        if (decorativeBackground) decorativeBackground.style.opacity = '0.7';
        updateWrapperRect(); 
        console.log('Initial background set. Wrapper Rect:', wrapperRect);
    } else {
        console.error(".game-container-wrapper not found!");
    }

    console.log('Game 3 JS Loaded. Yes Btn:', yesButton, 'No Btn:', noButton);

    function showElement(element, makeVisibleClass = true) {
        if (element) {
            element.classList.remove('hidden'); 
            element.style.display = ''; // Hapus style display inline jika ada
            if (makeVisibleClass) {
                void element.offsetWidth; 
                requestAnimationFrame(() => {
                     setTimeout(() => { element.classList.add('visible'); }, 10); 
                });
            }
        } else console.warn("Attempted to show a null element for an operation.");
    }

    function hideElement(element, useAnimationClass = true) {
        if (element) {
            if (useAnimationClass) {
                element.classList.remove('visible');
                // Tambah 'hidden' setelah transisi jika .hidden adalah display:none
                // setTimeout(() => { element.classList.add('hidden'); }, parseFloat(getComputedStyle(element).transitionDuration) * 1000 || 700);
            }
             element.classList.add('hidden'); 
        } else console.warn("Attempted to hide a null element for an operation.");
    }
    
    function createRandomStar() {
        if (!starsBackground) return;
        const star = document.createElement('div');
        star.classList.add('star');
        star.style.top = `${90 + Math.random() * 10}%`;
        star.style.left = `${Math.random() * 100}%`;
        const baseSize = Math.random() * 1.5 + 1;
        star.style.width = `${baseSize}px`;
        star.style.setProperty('--star-duration', `${Math.random() * 3 + 3.5}s`);
        star.style.setProperty('--star-delay', `${Math.random() * 5}s`);
        starsBackground.appendChild(star);
        const duration = parseFloat(star.style.getPropertyValue('--star-duration').replace('s','')) * 1000;
        const delay = parseFloat(star.style.getPropertyValue('--star-delay').replace('s','')) * 1000;
        const totalAnimationTime = duration + delay + 500;
        setTimeout(() => { if (star.parentNode) star.parentNode.removeChild(star); }, totalAnimationTime);
    }
    function activateStarryBackground(numberOfStars = 50) {
        if (!starsBackground) return;
        starsBackground.innerHTML = '';
        for (let i = 0; i < numberOfStars; i++) { setTimeout(createRandomStar, i * 100); }
        starsBackground.classList.add('active'); 
        console.log('Rising star animation activated.');
    }
    function switchToDarkBackground() {
        if (gameContainerWrapper) {
            gameContainerWrapper.classList.remove('background-initial');
            gameContainerWrapper.classList.add('background-dark-stars');
            if (decorativeBackground) {
                decorativeBackground.style.opacity = '0';
                setTimeout(() => { if(decorativeBackground) decorativeBackground.style.display = 'none'; }, 500);
            }
            activateStarryBackground(50);
        }
    }
    
    function loadQuestion(index) {
        if (gameFinished || index >= questions.length) {
            if (!gameFinished) endGame();
            return;
        }
        const q = questions[index];
        if (questionTextEl) questionTextEl.textContent = q.question;
        
        if (yesButton) {
            yesButton.textContent = q.yesText;
            yesButton.disabled = false;
            showElement(yesButton);
        }
        if (noButton) {
            noButton.textContent = q.noText;
            noButton.disabled = false;
            noButton.classList.remove('escaping');
            noButton.style.position = ''; 
            noButton.style.top = '';
            noButton.style.left = '';
            showElement(noButton); 
        }
        if (feedbackTextEl) {
            feedbackTextEl.textContent = '';
            feedbackTextEl.classList.remove('no-feedback');
        }
        noButtonClickCount = 0;

        if (questionWrapperEl) {
            if (index === 0) {
                questionWrapperEl.classList.remove('hidden');
                // questionWrapperEl.classList.add('animated-item'); // animated-item sudah permanen di HTML
                showElement(questionWrapperEl);
            } else {
                questionWrapperEl.classList.add('visible');
            }
        }
    }

    function handleYesClick() {
        if (gameFinished) return;
        currentQuestionIndex++;
        loadQuestion(currentQuestionIndex);
    }

    function handleNoClick() {
        if (gameFinished) return;
        noButtonClickCount++;
        const q = questions[currentQuestionIndex];
        if (feedbackTextEl && q.noMessages) {
            feedbackTextEl.textContent = q.noMessages[Math.min(noButtonClickCount - 1, q.noMessages.length - 1)] || "Jangan gitu dong...";
            feedbackTextEl.classList.add('no-feedback');
        }

        if (!noButton || !wrapperRect || !yesButton) {
            console.error("Button 'No', wrapper dimensions, or button 'Yes' not found for escape logic.");
            return;
        }
        
        noButton.classList.remove('hidden'); // Pastikan tidak hidden
        void noButton.offsetWidth;          // Paksa reflow
        noButton.classList.add('escaping');  // Terapkan position:fixed dari CSS

        const btnNoStyle = getComputedStyle(noButton); 
        const btnNoRect = { 
            width: parseFloat(btnNoStyle.width) || noButton.offsetWidth, // Fallback ke offsetWidth
            height: parseFloat(btnNoStyle.height) || noButton.offsetHeight
        };
        const btnYesRect = yesButton.getBoundingClientRect(); // Ini relatif ke viewport

        let randomX, randomY, isOverlapping;
        let attempts = 0;
        const maxAttempts = 100;
        const safetyMargin = 20; // Jarak aman

        do {
            // Posisi acak di dalam viewport (karena .no-button.escaping adalah fixed)
            randomX = Math.random() * (window.innerWidth - btnNoRect.width - 2 * safetyMargin) + safetyMargin;
            randomY = Math.random() * (window.innerHeight - btnNoRect.height - 2 * safetyMargin) + safetyMargin;

            // BoundingBox potensial dari tombol 'Tidak' (ini sudah koordinat viewport)
            let noButtonPotentialRight = randomX + btnNoRect.width;
            let noButtonPotentialBottom = randomY + btnNoRect.height;

            isOverlapping = !(
                (noButtonPotentialRight + safetyMargin) < btnYesRect.left ||
                (randomX - safetyMargin) > btnYesRect.right ||
                (noButtonPotentialBottom + safetyMargin) < btnYesRect.top ||
                (randomY - safetyMargin) > btnYesRect.bottom
            );
            attempts++;
        } while (isOverlapping && attempts < maxAttempts);
        
        if (isOverlapping && attempts >= maxAttempts) { 
            console.warn("Still overlapping after max attempts, placing 'No' button further away.");
            if (btnYesRect.left < window.innerWidth / 2) { 
                randomX = window.innerWidth - btnNoRect.width - safetyMargin - 5; 
            } else { 
                randomX = safetyMargin + 5; 
            }
            randomY = Math.max(safetyMargin, Math.min(randomY, window.innerHeight - btnNoRect.height - safetyMargin));
        }
        
        noButton.style.left = `${randomX}px`;
        noButton.style.top = `${randomY}px`;
    }

    function endGame() {
        if(gameFinished) return;
        gameFinished = true; 
        console.log("Game Selesai!");

        if (questionWrapperEl) hideElement(questionWrapperEl);
        if (gameResultArea) showElement(gameResultArea); 
        
        if(gameTitleEl) gameTitleEl.textContent = "Kamu Berhasil Melewati Semuanya!";
        if(gameSubtitleEl) {
             gameSubtitleEl.textContent = ""; 
             hideElement(gameSubtitleEl, false);
        }

        if (noButton) {
            noButton.classList.remove('escaping');
            noButton.style.position = ''; 
            noButton.style.top = '';
            noButton.style.left = '';
            hideElement(noButton, false); 
        }
        if (yesButton) hideElement(yesButton, false); 
        if (feedbackTextEl) {
            feedbackTextEl.textContent = '';
            feedbackTextEl.classList.remove('no-feedback');
        }
    }

    if (yesButton) yesButton.addEventListener('click', handleYesClick);
    if (noButton) noButton.addEventListener('click', handleNoClick);

    if (nextButtonGame3) {
        nextButtonGame3.addEventListener('click', () => {
            window.location.href = 'kado3.html';
        });
    } else {
        console.error("Error: #nextButtonGame3 not found!");
    }

    loadQuestion(currentQuestionIndex);
});