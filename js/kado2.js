// js/kado2.js

document.addEventListener('DOMContentLoaded', () => {
    const ucapanAtas = document.querySelector('.ucapan-atas');
    const galleryWrapper = document.querySelector('.gallery-wrapper');
    const galleryItems = document.querySelectorAll('.gallery-item'); // Ambil semua item galeri
    const nextButtonKado2 = document.getElementById('nextButtonKado2');

    // Urutan animasi kemunculan
    // 1. Ucapan atas
    // 2. Gallery wrapper (sebagai kontainer) atau setiap item galeri satu per satu
    // 3. Tombol lanjut

    let delay = 300; // Initial delay

    if (ucapanAtas) {
        ucapanAtas.classList.remove('hidden'); // Hapus hidden jika ada
        setTimeout(() => {
            ucapanAtas.classList.add('visible');
        }, delay);
        delay += 500; // Tambah delay untuk elemen berikutnya
    }

    // Animasi untuk gallery wrapper secara keseluruhan
    if (galleryWrapper) {
        galleryWrapper.classList.remove('hidden');
         setTimeout(() => {
            galleryWrapper.classList.add('visible');
        }, delay);
        delay += 700; 
    }
    
    // ATAU Jika ingin setiap item galeri muncul satu per satu (lebih dinamis):
    /*
    if (galleryItems.length > 0) {
        galleryItems.forEach(item => {
            item.classList.remove('hidden');
            setTimeout(() => {
                item.classList.add('visible');
            }, delay);
            delay += 200; // Jeda kecil antar kemunculan item galeri
        });
        delay += 300; // Tambahan delay setelah item terakhir muncul
    }
    */


    if (nextButtonKado2) {
        nextButtonKado2.classList.remove('hidden');
        setTimeout(() => {
            nextButtonKado2.classList.add('visible');
        }, delay);
    }

    // Navigasi ke halaman berikutnya
    if (nextButtonKado2) {
        nextButtonKado2.addEventListener('click', () => {
            document.body.style.transition = 'opacity 0.5s ease-out';
            document.body.style.opacity = 0;
            setTimeout(() => {
                window.location.href = 'game3.html'; // Arahkan ke Game 3
            }, 500);
        });
    } else {
        console.error("Button #nextButtonKado2 not found.");
    }
});