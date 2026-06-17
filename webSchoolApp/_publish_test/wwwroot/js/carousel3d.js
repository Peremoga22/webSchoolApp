(function () {
    'use strict';

    const SWIPE_THRESHOLD = 52;

    function getCheckedIndex(radios) {
        return Math.max(0, [...radios].findIndex((radio) => radio.checked));
    }

    function go(carousel, delta) {
        const radios = carousel.querySelectorAll('.carousel-3d-radio');
        if (radios.length < 2) {
            return;
        }

        const next = (getCheckedIndex(radios) + delta + radios.length) % radios.length;
        radios[next].checked = true;
    }

    function bindCarousel(carousel) {
        const radios = carousel.querySelectorAll('.carousel-3d-radio');
        if (radios.length < 2) {
            return;
        }

        carousel.querySelector('[data-carousel-prev]')
            ?.addEventListener('click', () => go(carousel, -1));

        carousel.querySelector('[data-carousel-next]')
            ?.addEventListener('click', () => go(carousel, 1));

        carousel.tabIndex = 0;
        carousel.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowLeft') {
                event.preventDefault();
                go(carousel, -1);
            }

            if (event.key === 'ArrowRight') {
                event.preventDefault();
                go(carousel, 1);
            }
        });

        const viewport = carousel.querySelector('.carousel-3d-viewport');
        if (!viewport) {
            return;
        }

        let startX = 0;
        let startY = 0;

        viewport.addEventListener('touchstart', (event) => {
            startX = event.touches[0].clientX;
            startY = event.touches[0].clientY;
        }, { passive: true });

        viewport.addEventListener('touchend', (event) => {
            const dx = event.changedTouches[0].clientX - startX;
            const dy = event.changedTouches[0].clientY - startY;

            if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dx) < Math.abs(dy)) {
                return;
            }

            go(carousel, dx > 0 ? -1 : 1);
        }, { passive: true });
    }

    function init() {
        document.querySelectorAll('[data-carousel]').forEach(bindCarousel);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
