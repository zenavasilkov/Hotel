/**
 * Preloader Component
 */
const Preloader = {
    /**
     * Initialize preloader
     */
    init() {
        this.preloader = document.getElementById('preloader');
        if (!this.preloader) return;

        window.addEventListener('load', () => {
            this.hide();
        });

        this.minDisplayTime = 500;
        this.startTime = Date.now();
    },

    /**
     * Hide preloader
     */
    hide() {
        const elapsedTime = Date.now() - this.startTime;
        const remainingTime = Math.max(0, this.minDisplayTime - elapsedTime);

        setTimeout(() => {
            this.preloader.classList.add('hidden');

            setTimeout(() => {
                this.preloader.style.display = 'none';
            }, 500);
        }, remainingTime);
    },

    /**
     * Show preloader
     */
    show() {
        this.preloader.style.display = 'flex';
        this.preloader.classList.remove('hidden');
        this.startTime = Date.now();
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Preloader;
}
