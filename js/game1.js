// js/game1.js
// KODE JAVASCRIPT PERSIS SAMA DENGAN YANG ANDA BERIKAN DI PROMPT SEBELUMNYA.

document.addEventListener('DOMContentLoaded', () => {
    const gameContainerWrapper = document.querySelector('.game-container-wrapper');
    const decorativeBackground = document.querySelector('.decorative-background-effects');
    const starsBackground = document.getElementById('starsBackground');
    
    const candle = document.getElementById('candle');
    const flame = document.getElementById('flame');

    const initialGameText = document.getElementById('initialGameText');
    const secondaryGameText = document.getElementById('secondaryGameText');
    const resultMessage = document.getElementById('resultMessage');
    const nextButtonGame1 = document.getElementById('nextButtonGame1');

    let isSwipingActive = false;
    let startX = 0;
    let isBlownOut = false;

    if (gameContainerWrapper) {
        gameContainerWrapper.classList.add('background-initial');
        if (decorativeBackground) decorativeBackground.style.opacity = '0.7';
        console.log('Initial background set to bright.');
    } else {
        console.error(".game-container-wrapper not found!");
    }

    console.log('Game 1 JS Loaded. Candle:', candle, 'Flame:', flame);

    function showElement(element) {
        if (element) element.classList.remove('hidden');
        else console.warn("Attempted to show a null element.");
    }

    function hideElement(element) {
        if (element) element.classList.add('hidden');
        else console.warn("Attempted to hide a null element.");
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
        
        const totalAnimationTime = (parseFloat(star.style.getPropertyValue('--star-duration').replace('s','')) +
                                   parseFloat(star.style.getPropertyValue('--star-delay').replace('s',''))) * 1000 + 500;
        setTimeout(() => {
            if (star.parentNode) star.parentNode.removeChild(star);
        }, totalAnimationTime);
    }

    function activateStarryBackground(numberOfStars = 50) {
        if (!starsBackground) return;
        starsBackground.innerHTML = '';
        for (let i = 0; i < numberOfStars; i++) {
            setTimeout(createRandomStar, i * 100);
        }
        starsBackground.classList.add('active'); 
        console.log('Rising star animation activated.');
    }

    function switchToDarkBackground() {
        if (gameContainerWrapper) {
            console.log('Switching to dark background...');
            gameContainerWrapper.classList.remove('background-initial');
            gameContainerWrapper.classList.add('background-dark-stars');
            if (decorativeBackground) {
                decorativeBackground.style.opacity = '0';
            }
            activateStarryBackground(50);
        }
    }

    function blowOutCandle() {
        if (isBlownOut) return;
        isBlownOut = true;
        console.log('Blowing out candle...');
        if (flame) flame.classList.add('out');
        else console.error('#flame element not found!');
        if (candle) candle.style.cursor = 'default';
        hideElement(initialGameText);
        hideElement(secondaryGameText);
        showElement(resultMessage);
        showElement(nextButtonGame1);
        switchToDarkBackground();
    }

    if (candle) {
        candle.addEventListener('touchstart', (e) => {
            if (isBlownOut) return;
            isSwipingActive = true; startX = e.touches[0].clientX; candle.classList.add('swiping'); e.preventDefault();
        }, { passive: false });
        candle.addEventListener('touchmove', (e) => {
            if (!isSwipingActive || isBlownOut) return;
            let diffX = e.touches[0].clientX - startX;
            if (diffX > 35) blowOutCandle();
        });
        candle.addEventListener('touchend', () => {
            isSwipingActive = false; if (!isBlownOut && candle) candle.classList.remove('swiping');
        });
        candle.addEventListener('mousedown', (e) => {
            if (isBlownOut) return;
            isSwipingActive = true; startX = e.clientX; candle.classList.add('swiping'); e.preventDefault();
        });
        candle.addEventListener('mousemove', (e) => {
            if (!isSwipingActive || isBlownOut) return;
            let diffX = e.clientX - startX;
            if (diffX > 55) blowOutCandle();
        });
    } else {
        console.error("CRITICAL: #candle element not found!");
    }

    document.addEventListener('mouseup', () => {
        if (isSwipingActive) {
            isSwipingActive = false; if(candle && !isBlownOut) candle.classList.remove('swiping');
        }
    });

    if (nextButtonGame1) {
        nextButtonGame1.addEventListener('click', () => {
            window.location.href = 'kado1.html';
        });
    } else {
        console.error("Error: #nextButtonGame1 not found!");
    }
});