document.addEventListener('DOMContentLoaded', () => {

    // 1. EASED CINEMATIC SMOOTH SCROLL ENGINE
    let currentPosition = window.pageYOffset;
    let targetPosition = window.pageYOffset;
    let isMoving = false;
    const easeFactor = 0.2; // Smooth slow motion multiplier

    function smoothScrollAnimation() {
        const distance = targetPosition - currentPosition;
        currentPosition += distance * easeFactor;

        window.scrollTo(0, currentPosition);

        if (Math.abs(distance) > 0.5) {
            requestAnimationFrame(smoothScrollAnimation);
        } else {
            currentPosition = targetPosition;
            window.scrollTo(0, currentPosition);
            isMoving = false;
        }
    }

    window.addEventListener('wheel', (event) => {

    event.preventDefault();

    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

    targetPosition += event.deltaY;

    targetPosition = Math.max(0, Math.min(targetPosition, maxScroll));

    if (!isMoving) {
        isMoving = true;
        requestAnimationFrame(smoothScrollAnimation);
    }

}, { passive: false });
    window.addEventListener('resize', () => {
        currentPosition = window.pageYOffset;
        targetPosition = window.pageYOffset;
    });

    // 2. OPPOSITE DIRECTION 3D SLOW-MOTION BEND TILT
    const tiltCards = document.querySelectorAll('.glow-border-card');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // Opposite direction tilt formula
            const rotateX = ((y - centerY) / centerY) * 10;
            const rotateY = -((x - centerX) / centerX) * 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
    });

    // 3. MOBILE MENU TOGGLE
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenu && navLinks) {
        mobileMenu.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
        
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => navLinks.classList.remove('active'));
        });
    }

    // 4. CATEGORY FILTER FOR PROJECTS
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            projectCards.forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // 5. STATS NUMBER COUNTER
    const statNumbers = document.querySelectorAll('.stat-number');
    let counted = false;

    function countUp() {
        const statsSection = document.querySelector('.hero-stats');
        if (!statsSection) return;

        const sectionTop = statsSection.getBoundingClientRect().top;
        if (sectionTop < window.innerHeight && !counted) {
            counted = true;
            statNumbers.forEach(num => {
                const target = parseInt(num.dataset.target);
                if (isNaN(target)) return;
                
                let count = 0;
                const speed = target / 30;
                
                const updateCount = () => {
                    count += speed;
                    if (count < target) {
                        num.innerText = Math.ceil(count);
                        setTimeout(updateCount, 40);
                    } else {
                        num.innerText = target;
                    }
                };
                updateCount();
            });
        }
    }

    // 6. SCROLL REVEAL OBSERVER
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.15 });

    revealElements.forEach(el => revealObserver.observe(el));

    window.addEventListener('scroll', countUp);
});