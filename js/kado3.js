// js/kado3.js

document.addEventListener('DOMContentLoaded', () => {
    // Elemen UI Utama
    const initialMessageEl = document.getElementById('initialMessageKado3');
    const videoPlayerContainerEl = document.getElementById('videoPlayerContainer');
    const finalRevealAreaEl = document.getElementById('finalRevealArea');
    const finalPhotoEl = document.getElementById('finalPhoto');
    const finalCaptionEl = document.getElementById('finalCaption');
    const replayButton = document.getElementById('replayButton');

    // Elemen Video dan Kontrolnya
    const videoSpesialEl = document.getElementById('videoSpesial');
    const customControlsEl = document.getElementById('customControls');
    const playPauseVideoButton = document.getElementById('playPauseVideoButton');
    const playIcon = playPauseVideoButton ? playPauseVideoButton.querySelector('.play-icon') : null;
    const pauseIcon = playPauseVideoButton ? playPauseVideoButton.querySelector('.pause-icon') : null;
    const videoProgressBar = document.getElementById('videoProgressBar');
    const progressBarContainer = document.querySelector('.progress-bar-container');
    const currentTimeEl = document.getElementById('currentTime');
    const durationEl = document.getElementById('duration');
    const fullscreenButton = document.getElementById('fullscreenButton');

    // Elemen Musik Latar (asumsi ID ini konsisten di semua halaman jika ada)
    const backgroundMusicGlobal = document.getElementById('backgroundMusic');

    let controlsTimeout; // Untuk auto-hide custom controls

    // --- Fungsi Helper ---
    function showElement(element, delay = 0) {
        if (element) {
            element.classList.remove('hidden');
            setTimeout(() => {
                void element.offsetWidth; // Paksa reflow untuk memastikan transisi berjalan
                element.classList.add('visible');
            }, delay);
        } else {
            // console.warn("Attempted to show a null element."); // Aktifkan jika perlu debugging
        }
    }

    function hideElement(element) {
        if (element) {
            element.classList.remove('visible');
            // Jika .hidden di CSS menggunakan display:none, mungkin perlu delay sebelum menambah .hidden
            // agar transisi opacity selesai. Namun, jika .hidden hanya opacity/visibility, ini cukup.
            element.classList.add('hidden'); 
        } else {
            // console.warn("Attempted to hide a null element."); // Aktifkan jika perlu debugging
        }
    }

    function formatTime(timeInSeconds) {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = Math.floor(timeInSeconds % 60).toString().padStart(2, '0');
        return `${minutes}:${seconds}`;
    }

    function pauseBackgroundMusic() {
        if (backgroundMusicGlobal && !backgroundMusicGlobal.paused) {
            console.log("Pausing background music.");
            backgroundMusicGlobal.pause();
        }
    }

    function resumeBackgroundMusic() { // Opsional: jika ingin memutar lagi setelah video
        if (backgroundMusicGlobal && backgroundMusicGlobal.paused) {
            console.log("Attempting to resume background music.");
            backgroundMusicGlobal.play().catch(e => console.warn("Could not resume BG music:", e.message));
        }
    }

    // --- Inisialisasi Halaman ---
    showElement(initialMessageEl, 300);
    setTimeout(() => {
        pauseBackgroundMusic(); // Hentikan musik latar saat video player akan muncul
        showElement(videoPlayerContainerEl, 0);
        // Tampilkan kontrol jika metadata video sudah termuat (durasi diketahui)
        if (customControlsEl && videoSpesialEl && videoSpesialEl.readyState >= 1) { // readyState >= 1 berarti metadata ada
             showElement(customControlsEl, 100);
        }
    }, 2500); // Jeda setelah pesan awal muncul

    // --- Event Listeners untuk Video Player ---
    if (videoSpesialEl && playPauseVideoButton && playIcon && pauseIcon && videoProgressBar && currentTimeEl && durationEl) {
        
        videoSpesialEl.addEventListener('loadedmetadata', () => {
            if (durationEl) durationEl.textContent = formatTime(videoSpesialEl.duration);
            if (customControlsEl && !customControlsEl.classList.contains('visible')) { // Tampilkan kontrol jika belum
                showElement(customControlsEl, 50); 
            }
        });

        playPauseVideoButton.addEventListener('click', () => {
            pauseBackgroundMusic(); // Pastikan lagi musik latar berhenti saat interaksi play/pause video
            if (videoSpesialEl.paused || videoSpesialEl.ended) {
                videoSpesialEl.play();
            } else {
                videoSpesialEl.pause();
            }
        });

        videoSpesialEl.addEventListener('play', () => { // Gunakan event 'play'
            if(playIcon) playIcon.classList.add('hidden');
            if(pauseIcon) pauseIcon.classList.remove('hidden');
            if(customControlsEl) customControlsEl.classList.add('visible');
            pauseBackgroundMusic(); // Aksi utama penghentian musik latar
        });

        videoSpesialEl.addEventListener('pause', () => { // Gunakan event 'pause'
            if(playIcon) playIcon.classList.remove('hidden');
            if(pauseIcon) pauseIcon.classList.add('hidden');
            if(customControlsEl) customControlsEl.classList.add('visible'); 
            // Opsional: resumeBackgroundMusic(); // Jika ingin musik latar kembali saat video dijeda
        });

        videoSpesialEl.addEventListener('ended', () => { // Gunakan event 'ended'
            if(playIcon) playIcon.classList.remove('hidden');
            if(pauseIcon) pauseIcon.classList.add('hidden');
            revealFinalSurprise(); 
            if(replayButton) showElement(replayButton, 500);
            // Opsional: resumeBackgroundMusic(); // Jika ingin musik latar kembali setelah video selesai
        });

        videoSpesialEl.addEventListener('timeupdate', () => {
            if (videoSpesialEl.duration) { // Pastikan durasi ada untuk menghindari NaN
                const percentage = (videoSpesialEl.currentTime / videoSpesialEl.duration) * 100;
                if(videoProgressBar) videoProgressBar.style.width = `${percentage}%`;
            }
            if(currentTimeEl) currentTimeEl.textContent = formatTime(videoSpesialEl.currentTime);
        });

        if (progressBarContainer) {
            progressBarContainer.addEventListener('click', (e) => {
                if(videoSpesialEl.duration){
                    const rect = progressBarContainer.getBoundingClientRect();
                    const clickPosition = e.clientX - rect.left;
                    const percentage = (clickPosition / progressBarContainer.offsetWidth);
                    videoSpesialEl.currentTime = percentage * videoSpesialEl.duration;
                }
            });
        }
        
        if (fullscreenButton) {
            fullscreenButton.addEventListener('click', () => {
                if (videoSpesialEl.requestFullscreen) videoSpesialEl.requestFullscreen();
                else if (videoSpesialEl.mozRequestFullScreen) videoSpesialEl.mozRequestFullScreen();
                else if (videoSpesialEl.webkitRequestFullscreen) videoSpesialEl.webkitRequestFullscreen();
                else if (videoSpesialEl.msRequestFullscreen) videoSpesialEl.msRequestFullscreen();
            });
        }

        // Logika auto-hide custom controls
        if(videoPlayerContainerEl && customControlsEl){
            videoPlayerContainerEl.addEventListener('mouseenter', () => {
                clearTimeout(controlsTimeout);
                customControlsEl.classList.add('visible');
            });
            videoPlayerContainerEl.addEventListener('mousemove', () => { 
                clearTimeout(controlsTimeout);
                if (!customControlsEl.classList.contains('visible')) { // Tampilkan jika tersembunyi
                    customControlsEl.classList.add('visible');
                }
                controlsTimeout = setTimeout(() => {
                    if (!videoSpesialEl.paused && !videoSpesialEl.ended) { 
                        customControlsEl.classList.remove('visible');
                    }
                }, 2500); 
            });
            videoPlayerContainerEl.addEventListener('mouseleave', () => {
                if (!videoSpesialEl.paused && !videoSpesialEl.ended) {
                    controlsTimeout = setTimeout(() => {
                         customControlsEl.classList.remove('visible');
                    }, 500);
                }
            });
        }
    } else {
        console.error("One or more video player control elements are missing in kado3.html. Functionality will be limited.");
    }

    // --- Final Reveal ---
    function revealFinalSurprise() {
        console.log("Final reveal triggered!");
        if (videoPlayerContainerEl) hideElement(videoPlayerContainerEl);
        
        showElement(finalRevealAreaEl, 100); 
        if (finalPhotoEl) showElement(finalPhotoEl, 300); 
        if (finalCaptionEl) showElement(finalCaptionEl, 800); 
    }
    
    // --- Tombol Replay ---
    if(replayButton && videoSpesialEl && videoPlayerContainerEl && finalRevealAreaEl){
        replayButton.addEventListener('click', () => {
            hideElement(finalRevealAreaEl); 
            if(replayButton) hideElement(replayButton); // Sembunyikan tombol replay itu sendiri
            
            showElement(videoPlayerContainerEl); 
            if(customControlsEl) {
                customControlsEl.classList.remove('hidden');
                customControlsEl.classList.add('visible');
            }
            pauseBackgroundMusic(); // Pastikan musik latar berhenti lagi saat replay
            videoSpesialEl.currentTime = 0;
            videoSpesialEl.play();
        });
    }

    // --- Pengecekan Elemen Utama ---
    if(!initialMessageEl || !videoPlayerContainerEl || !finalRevealAreaEl) {
        console.error("One or more main layout containers for Kado 3 are missing from the HTML.");
    }
});