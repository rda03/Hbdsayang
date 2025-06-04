// js/opening.js

document.addEventListener('DOMContentLoaded', () => {
    const initialHint = document.getElementById('initialHint');
    const birthdayMessage = document.getElementById('birthdayMessage');
    const nextStepMessage = document.getElementById('nextStepMessage');
    const nextButton = document.getElementById('nextButton');
    const fireworksContainer = document.getElementById('fireworksContainer');

    const fireworkSound1 = document.getElementById('fireworkSound1');
    const fireworkSound2 = document.getElementById('fireworkSound2');

    const sounds = [];
    if (fireworkSound1) sounds.push(fireworkSound1);
    if (fireworkSound2) sounds.push(fireworkSound2);

    function createCSSFirework(container) {
        if (!container) return;

        // --- TAHAP 1: MEMBUAT DAN MELUNCURKAN ROKET ---
        const rocket = document.createElement('div');
        rocket.classList.add('rocket');

        const startX = container.offsetWidth / 2; // Mulai dari tengah bawah
        rocket.style.left = `${startX}px`;
        rocket.style.bottom = `0px`;

        const explosionBaseHue = 270 + (Math.random() * 60 - 30); // Nuansa ungu
        rocket.style.backgroundColor = `hsl(${explosionBaseHue}, 100%, 70%)`;
        rocket.style.boxShadow = `0 0 10px 2px hsl(${explosionBaseHue}, 100%, 80%)`;

        container.appendChild(rocket);

        const targetX = Math.random() * (container.offsetWidth * 0.7) + (container.offsetWidth * 0.15);
        const targetY = Math.random() * (container.offsetHeight * 0.4) + (container.offsetHeight * 0.1); // Dari atas

        const launchDuration = Math.random() * 0.5 + 0.8; // 0.8s - 1.3s
        rocket.style.transition = `transform ${launchDuration}s cubic-bezier(0.5, 0, 1, 0.5), opacity ${launchDuration * 0.3}s ${launchDuration * 0.7}s linear`;

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                 // Bergerak ke targetX (relatif thd startX) dan targetY (relatif thd tinggi container dari bawah)
                rocket.style.transform = `translate(${targetX - startX}px, -${container.offsetHeight - targetY}px) scaleY(2.5) scaleX(0.6)`;
                rocket.style.opacity = '0';
            });
        });

        // --- TAHAP 2: LEDAKAN ---
        setTimeout(() => {
            if (container.contains(rocket)) {
                container.removeChild(rocket);
            }

            const fireworkExplosion = document.createElement('div');
            fireworkExplosion.classList.add('firework-explosion');
            fireworkExplosion.style.left = `${targetX}px`;
            fireworkExplosion.style.top = `${targetY}px`;

            container.appendChild(fireworkExplosion);

            const numParticles = Math.floor(Math.random() * 30) + 50; // 50-79 partikel

            for (let i = 0; i < numParticles; i++) {
                const particle = document.createElement('div');
                particle.classList.add('particle');

                const hue = explosionBaseHue + (Math.random() * 40 - 20);
                particle.style.backgroundColor = `hsl(${hue}, 100%, 70%)`;

                particle.style.setProperty('--angle', (Math.random() * Math.PI * 2) + 'rad');
                const spreadDistance = Math.random() * 100 + 60; // Jarak sebaran 60px - 160px
                particle.style.setProperty('--distance', spreadDistance + 'px');
                const particleDuration = Math.random() * 1.0 + 0.8; // Durasi partikel 0.8s - 1.8s
                particle.style.setProperty('--duration', particleDuration + 's');
                const particleDelay = Math.random() * 0.25;
                particle.style.setProperty('--delay', particleDelay + 's');

                fireworkExplosion.appendChild(particle);
            }

            if (sounds.length > 0) {
                const randomSound = sounds[Math.floor(Math.random() * sounds.length)];
                if (randomSound) {
                    randomSound.currentTime = 0;
                    randomSound.play().catch(e => console.log("Autoplay sound error:", e));
                }
            }

            setTimeout(() => {
                if (container.contains(fireworkExplosion)) {
                    container.removeChild(fireworkExplosion);
                }
            }, 2500); // Disesuaikan dengan durasi partikel terpanjang + delay

        }, launchDuration * 1000); // Ledakan setelah durasi peluncuran
    }

    // --- ALUR UTAMA ---
    setTimeout(() => {
        if (initialHint) {
            initialHint.style.transition = 'opacity 1s ease-out';
            initialHint.style.opacity = 0;
        }

        let fireworksCount = 0;
        const maxFireworks = 7;
        // Interval bisa sedikit lebih panjang untuk memberi waktu roket meluncur sebelum roket berikutnya
        const fireworkInterval = 1300; // Sebelumnya 1000ms, coba 1300ms

        if (fireworksContainer) {
            const fireworkLoop = setInterval(() => {
                createCSSFirework(fireworksContainer);
                fireworksCount++;
                if (fireworksCount >= maxFireworks) {
                    clearInterval(fireworkLoop);

                    setTimeout(() => {
                        if (birthdayMessage) {
                            birthdayMessage.classList.remove('hidden');
                            birthdayMessage.style.opacity = 1;
                            birthdayMessage.style.visibility = 'visible';
                            birthdayMessage.style.transform = 'translateY(0)';
                        }

                        setTimeout(() => {
                            if (nextStepMessage) {
                                nextStepMessage.classList.remove('hidden');
                                nextStepMessage.style.opacity = 1;
                                nextStepMessage.style.visibility = 'visible';
                                nextStepMessage.style.transform = 'translateY(0)';
                            }
                            if (nextButton) {
                                nextButton.classList.remove('hidden');
                                nextButton.style.opacity = 1;
                                nextButton.style.visibility = 'visible';
                                nextButton.style.transform = 'translateY(0)';
                            }
                        }, 1500);
                    }, 1000); // Jeda setelah kembang api terakhir selesai (termasuk peluncurannya)
                }
            }, fireworkInterval);
        } else {
            console.error("fireworksContainer not found!");
            // Fallback jika container tidak ada
            if (birthdayMessage) { /* ... kode untuk langsung tampilkan pesan ultah ... */ }
        }
    }, 4000); // Jeda awal

    if (nextButton) {
        nextButton.addEventListener('click', () => {
            document.body.style.transition = 'opacity 0.5s ease-out';
            document.body.style.opacity = 0;
            setTimeout(() => {
                window.location.href = 'game3.html';
            }, 500);
        });
    }
});