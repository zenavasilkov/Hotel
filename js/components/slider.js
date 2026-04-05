class Slider {
    constructor(selector, options = {}) {
        this.slider = document.querySelector(selector);
        if (!this.slider) return;

        this.options = {
            slidesToShow: 3,
            slidesToScroll: 1,
            autoplay: false,
            autoplaySpeed: 5000,
            infinite: true,
            dots: true,
            arrows: true,
            ...options
        };

        this.track = this.slider.querySelector('.slider__track');
        this.container = this.slider.querySelector('.slider__container');
        this.slides = this.slider.querySelectorAll('.slider__slide, .room-card');
        this.prevBtn = this.slider.querySelector('.slider__btn--prev');
        this.nextBtn = this.slider.querySelector('.slider__btn--next');
        this.pagination = this.slider.querySelector('.slider__pagination');

        this.currentIndex = 0;
        this.totalSlides = this.slides.length;
        this.autoplayInterval = null;

        this.init();
    }

    init() {
        this.updateSlideWidth();
        this.createPagination();
        this.setupEventListeners();
        this.updateSliderPosition();

        if (this.options.autoplay) {
            this.startAutoplay();
        }

        window.addEventListener('resize', () => {
            this.updateSlideWidth();
            this.updateSliderPosition();
        });
    }

    updateSlideWidth() {
        const width = this.slider.offsetWidth;
        let slidesToShow = this.options.slidesToShow;

        if (width <= 480) {
            slidesToShow = 1;
        } else if (width <= 768) {
            slidesToShow = 2;
        }

        this.slideWidth = width / slidesToShow;
        this.slides.forEach(slide => {
            slide.style.minWidth = `${this.slideWidth}px`;
        });
    }

    createPagination() {
        if (!this.options.dots || !this.pagination) return;

        this.pagination.replaceChildren();

        const pageCount = Math.ceil(this.totalSlides / this.options.slidesToShow);

        for (let i = 0; i < pageCount; i++) {
            const dot = document.createElement('button');
            dot.className = `slider__dot${i === 0 ? ' active' : ''}`;
            dot.setAttribute('aria-label', `Слайд ${i + 1}`);
            dot.addEventListener('click', () => this.goToSlide(i * this.options.slidesToShow));
            this.pagination.appendChild(dot);
        }
    }

    setupEventListeners() {
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prev());
        }

        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.next());
        }

        this.slider.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prev();
            if (e.key === 'ArrowRight') this.next();
        });

        let touchStartX = 0;
        let touchEndX = 0;

        this.slider.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        this.slider.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe(touchStartX, touchEndX);
        }, { passive: true });

        this.slider.addEventListener('mouseenter', () => this.stopAutoplay());
        this.slider.addEventListener('mouseleave', () => this.startAutoplay());
    }

    handleSwipe(startX, endX) {
        const diff = startX - endX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                this.next();
            } else {
                this.prev();
            }
        }
    }

    updateSliderPosition() {
        if (!this.container) return;

        const offset = -this.currentIndex * this.slideWidth;
        this.container.style.transform = `translateX(${offset}px)`;
        this.container.style.transition = 'transform 0.5s ease';

        this.updatePagination();
        this.updateButtons();
    }

    updatePagination() {
        if (!this.pagination) return;

        const dots = this.pagination.querySelectorAll('.slider__dot');
        const currentDot = Math.floor(this.currentIndex / this.options.slidesToShow);

        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentDot);
        });
    }

    updateButtons() {
        if (this.prevBtn) {
            this.prevBtn.disabled = this.currentIndex === 0 && !this.options.infinite;
        }

        if (this.nextBtn) {
            const maxIndex = this.totalSlides - this.options.slidesToShow;
            this.nextBtn.disabled = this.currentIndex >= maxIndex && !this.options.infinite;
        }
    }

    goToSlide(index) {
        if (index < 0) {
            index = this.options.infinite ? this.totalSlides - this.options.slidesToShow : 0;
        } else if (index > this.totalSlides - this.options.slidesToShow) {
            index = this.options.infinite ? 0 : this.totalSlides - this.options.slidesToShow;
        }

        this.currentIndex = index;
        this.updateSliderPosition();
    }

    next() {
        this.goToSlide(this.currentIndex + this.options.slidesToScroll);
    }

    prev() {
        this.goToSlide(this.currentIndex - this.options.slidesToScroll);
    }

    startAutoplay() {
        if (!this.options.autoplay) return;

        this.stopAutoplay();
        this.autoplayInterval = setInterval(() => this.next(), this.options.autoplaySpeed);
    }

    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }

    destroy() {
        this.stopAutoplay();
        this.slider = null;
        this.track = null;
        this.container = null;
        this.slides = null;
    }
}
