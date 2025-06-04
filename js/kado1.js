// js/kado1.js

document.addEventListener('DOMContentLoaded', () => {
    const photoFrame = document.querySelector('.photo-frame');
    const ucapanKado1 = document.getElementById('ucapanKado1');
    const nextButtonKado1 = document.getElementById('nextButtonKado1');

    // Urutan animasi kemunculan elemen
    const elementsToAnimate = [
        { element: photoFrame, delay: 300 },    // Muncul pertama setelah 0.3 detik
        { element: ucapanKado1, delay: 800 },   // Ucapan muncul setelah foto
        { element: nextButtonKado1, delay: 1500 } // Tombol muncul terakhir
    ];

    elementsToAnimate.forEach(item => {
        if (item.element) {
            // Hapus kelas 'hidden' jika digunakan untuk menyembunyikan total
            item.element.classList.remove('hidden');
            // Tambahkan kelas 'visible' setelah delay untuk memicu transisi
            setTimeout(() => {
                item.element.classList.add('visible');
            }, item.delay);
        } else {
            console.warn("Element not found for animation:", item);
        }
    });

    // Navigasi ke halaman berikutnya
    if (nextButtonKado1) {
        nextButtonKado1.addEventListener('click', () => {
            // Efek fade out halaman sebelum pindah (opsional)
            document.body.style.transition = 'opacity 0.5s ease-out';
            document.body.style.opacity = 0;

            setTimeout(() => {
                window.location.href = 'game2.html'; // Arahkan ke Game 2
            }, 500); // Tunggu transisi selesai
        });
    } else {
        console.error("Button #nextButtonKado1 not found.");
    }

    // Opsional: Jika ingin tombol lanjut baru muncul setelah user scroll atau interaksi lain
    // Anda bisa menambahkan logika event listener di sini
});