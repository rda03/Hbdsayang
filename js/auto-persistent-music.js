// js/auto-persistent-music.js

document.addEventListener('DOMContentLoaded', () => {
    const audio = document.getElementById('backgroundMusicLoop');
    const MUSIC_STORAGE_KEY = 'persistentMusicState';

    // Variabel untuk melacak apakah kita sudah mencoba play dan gagal karena kebijakan autoplay
    let initialPlayAttempted = false;
    let autoplayBlocked = false;

    function saveMusicState() {
        if (audio) {
            // Hanya simpan jika audio sudah mulai dimainkan (punya durasi) dan tidak error
            if (audio.duration && !isNaN(audio.duration) && !audio.error) {
                const musicState = {
                    currentTime: audio.currentTime,
                    // Kita asumsikan jika state ada, musik seharusnya playing, kecuali dihentikan secara eksplisit
                    // Atau, kita bisa cek audio.paused, tapi ini bisa tricky jika halaman baru dimuat
                    isPlaying: !audio.paused && audio.currentTime > 0, // Lebih akurat: sedang main jika tidak dijeda & sudah mulai
                    volume: audio.volume, // Simpan volume juga
                    muted: audio.muted    // Simpan status mute
                };
                localStorage.setItem(MUSIC_STORAGE_KEY, JSON.stringify(musicState));
                console.log('AutoMusic: State saved:', musicState);
            } else {
                console.log('AutoMusic: Audio not ready or in error state, not saving state.');
            }
        }
    }

    function loadAndAutoplayMusic() {
        if (!audio) {
            console.error("AutoMusic: Audio element #backgroundMusicLoop not found.");
            return;
        }

        const savedStateString = localStorage.getItem(MUSIC_STORAGE_KEY);
        let playPromise;

        if (savedStateString) {
            const musicState = JSON.parse(savedStateString);
            console.log('AutoMusic: Loaded music state:', musicState);

            // Set properti dari state yang tersimpan
            audio.volume = musicState.volume !== undefined ? musicState.volume : 1;
            audio.muted = musicState.muted || false; // Jika muted tidak ada, anggap false

            // Coba set currentTime jika audio sudah siap
            // Kita akan lebih agresif mencoba set currentTime setelah play()
            if (musicState.currentTime !== undefined) {
                // Fungsi untuk set waktu setelah audio siap
                const setTime = () => {
                    if (audio.readyState >= 2) { // HAVE_CURRENT_DATA atau lebih tinggi
                        try {
                            audio.currentTime = musicState.currentTime;
                            console.log('AutoMusic: currentTime set to', audio.currentTime, 'from saved state.');
                        } catch (e) {
                            console.warn('AutoMusic: Could not set currentTime on load:', e);
                        }
                    } else {
                        console.log('AutoMusic: Audio not ready to set currentTime, will retry on loadedmetadata.');
                    }
                };
                
                if(audio.readyState >= 2) {
                    setTime();
                } else {
                    audio.addEventListener('loadedmetadata', setTime, { once: true });
                }
            }
            
            // Jika state tersimpan mengatakan musik sedang bermain, coba putar
            if (musicState.isPlaying) {
                console.log('AutoMusic: Attempting to resume play from saved state.');
                playPromise = audio.play();
            } else {
                console.log('AutoMusic: Saved state indicates music was paused.');
            }

        } else {
            // Tidak ada state tersimpan, ini mungkin pemuatan pertama di kado1.html
            // atau localStorage telah dihapus. Coba putar dari awal.
            console.log('AutoMusic: No saved state, attempting to play from start.');
            playPromise = audio.play();
        }

        initialPlayAttempted = true; // Tandai bahwa kita sudah mencoba play

        if (playPromise !== undefined) {
            playPromise.then(() => {
                console.log('AutoMusic: Playback started or resumed successfully.');
                autoplayBlocked = false;
            }).catch(error => {
                console.error('AutoMusic: Autoplay was prevented or error occurred:', error);
                autoplayBlocked = true;
                // Karena tidak ada tombol, pengguna mungkin tidak sadar musik tidak berbunyi.
                // Anda bisa menampilkan pesan kecil atau ikon di console.
                // Kita akan coba lagi jika ada interaksi lain.
            });
        }
    }

    // --- Handle Autoplay Policy ---
    // Fungsi untuk mencoba memutar musik setelah interaksi pengguna jika autoplay awal gagal
    function attemptPlayAfterInteraction() {
        if (audio && audio.paused && autoplayBlocked) {
            console.log('AutoMusic: Attempting to play music after user interaction.');
            audio.play().then(() => {
                autoplayBlocked = false; // Berhasil, reset flag
                console.log('AutoMusic: Playback started after interaction.');
            }).catch(error => {
                console.error('AutoMusic: Still unable to play after interaction:', error);
            });
        }
        // Hapus event listener ini setelah berhasil atau setelah beberapa kali percobaan
        document.body.removeEventListener('click', attemptPlayAfterInteraction, true);
        document.body.removeEventListener('touchstart', attemptPlayAfterInteraction, true);
    }

    // Jika kita tahu autoplay mungkin diblokir, pasang listener untuk interaksi pertama
    // Ini akan dipanggil setelah loadAndAutoplayMusic() selesai
    // Kita bisa cek autoplayBlocked setelah beberapa saat
    setTimeout(() => {
        if (autoplayBlocked && audio && audio.paused) {
            console.log('AutoMusic: Autoplay was blocked. Waiting for first user interaction to play music.');
            document.body.addEventListener('click', attemptPlayAfterInteraction, { once: true, capture: true });
            document.body.addEventListener('touchstart', attemptPlayAfterInteraction, { once: true, capture: true });
        }
    }, 1000); // Tunggu 1 detik untuk memberi kesempatan autoplay awal


    // Muat dan coba putar musik saat halaman siap
    if (audio) { // Hanya jalankan jika elemen audio ada
        // Beberapa browser butuh 'loadedmetadata' sebelum currentTime bisa di-set dengan benar
        audio.addEventListener('loadedmetadata', () => {
            console.log('AutoMusic: Audio metadata loaded.');
            // Jika ada state tersimpan dan currentTime belum sesuai, coba set lagi
            const savedStateString = localStorage.getItem(MUSIC_STORAGE_KEY);
            if (savedStateString) {
                const musicState = JSON.parse(savedStateString);
                if (musicState.currentTime && Math.abs(audio.currentTime - musicState.currentTime) > 0.5) {
                     try {
                        audio.currentTime = musicState.currentTime;
                        console.log('AutoMusic: currentTime re-adjusted on loadedmetadata to:', audio.currentTime);
                    } catch (e) {
                        console.warn("AutoMusic: Could not set currentTime on loadedmetadata:", e);
                    }
                }
            }
        }, { once: true });
        
        loadAndAutoplayMusic();

        // Simpan state musik saat pengguna akan meninggalkan halaman
        window.addEventListener('beforeunload', saveMusicState);
        window.addEventListener('pagehide', saveMusicState);

        // Simpan state secara periodik saat musik bermain (opsional, untuk kasus browser crash)
        // const periodicSaveInterval = setInterval(() => {
        //     if (!audio.paused) {
        //         saveMusicState();
        //     }
        // }, 5000); // Setiap 5 detik

        // Event untuk menangani akhir dari rentang musik ini
        const currentPage = window.location.pathname.split("/").pop();
        // GANTI 'game3.html' dengan nama file halaman terakhir musik harus berputar
        // GANTI 'nextButtonInGame3' dengan ID tombol lanjut di halaman game3.html
        if (currentPage === 'game3.html') {
            const lastPageNextButton = document.getElementById('nextButtonGame3'); // ID Tombol Lanjut di game3.html
            if (lastPageNextButton) {
                lastPageNextButton.addEventListener('click', () => {
                    console.log('AutoMusic: End of music sequence. Clearing music state.');
                    if (audio) audio.pause(); // Hentikan musik
                    localStorage.removeItem(MUSIC_STORAGE_KEY); // Hapus state
                    // Hapus interval penyimpanan periodik jika ada
                    // clearInterval(periodicSaveInterval);
                    // Penting: Hapus event listener beforeunload agar tidak menyimpan state kosong saat pindah
                    window.removeEventListener('beforeunload', saveMusicState);
                    window.removeEventListener('pagehide', saveMusicState);
                });
            }
        }
    } else {
        console.error("AutoMusic: Audio element #backgroundMusicLoop not found on page load.");
    }
});