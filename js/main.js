document.addEventListener('DOMContentLoaded', () => {

    // Logika Loading Screen    // 1. Preloader Animasi 3D dan Waktu Tunggu
    const preloader = document.getElementById('preloader');
    if (preloader) {
        const content = preloader.querySelector('.preloader-content');
        
        // Interaktivitas 3D mengikuti pergerakan mouse
        preloader.addEventListener('mousemove', (e) => {
            if(content) {
                let x = (window.innerWidth / 2 - e.pageX) / 25;
                let y = (window.innerHeight / 2 - e.pageY) / 25;
                content.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
            }
        });

        setTimeout(() => {
            preloader.classList.add('slide-up');
            // Menghapus preloader dari DOM setelah animasi selesai agar tidak menutupi klik
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 1200); // 1.2 detik sesuai dengan durasi CSS transition
        }, 3000); // Tepat 3 detik
    }

    // Custom Cursor Logic
    const cursorDot = document.getElementById('cursor-dot');
    const cursorText = document.getElementById('cursor-text');
    
    // Pastikan kursor custom hanya aktif di layar desktop (mendeteksi pointer halus)
    if(window.matchMedia("(pointer: fine)").matches) {
        
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;
            
            // Posisi dot mengikuti mouse
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;
            
            // Posisi text mengikuti mouse
            cursorText.style.left = `${posX}px`;
            cursorText.style.top = `${posY}px`;
        });

        // Efek hover umum untuk link/tombol
        const hoverTargets = document.querySelectorAll('.hover-target, a, button');
        hoverTargets.forEach(target => {
            target.addEventListener('mouseenter', () => {
                cursorDot.classList.add('grow');
            });
            target.addEventListener('mouseleave', () => {
                cursorDot.classList.remove('grow');
            });
        });

        // Efek khusus saat hover gambar portofolio (muncul teks "VIEW")
        const projectHovers = document.querySelectorAll('.project-hover');
        projectHovers.forEach(project => {
            project.addEventListener('mouseenter', () => {
                cursorDot.classList.remove('grow');
                cursorDot.classList.add('view-mode');
            });
            project.addEventListener('mouseleave', () => {
                cursorDot.classList.remove('view-mode');
            });
        });
    }

    // Logic Toggle Bahasa (English <-> Indonesia)
    const langToggle = document.getElementById('lang-toggle');
    if (langToggle) {
        // Cek jika user sudah pernah memilih bahasa sebelumnya
        const savedLang = localStorage.getItem('website-lang') || 'en';
        document.documentElement.setAttribute('lang', savedLang);
        langToggle.textContent = savedLang === 'en' ? 'ID' : 'EN';

        langToggle.addEventListener('click', () => {
            const currentLang = document.documentElement.getAttribute('lang');
            if (currentLang === 'en') {
                // Ganti ke Indonesia
                document.documentElement.setAttribute('lang', 'id');
                langToggle.textContent = 'EN';
                localStorage.setItem('website-lang', 'id');
            } else {
                // Ganti ke English
                document.documentElement.setAttribute('lang', 'en');
                langToggle.textContent = 'ID';
                localStorage.setItem('website-lang', 'en');
            }
        });
    }
});
