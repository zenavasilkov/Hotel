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

        // Hide when page is loaded
        window.addEventListener('load', () => {
            this.hide();
        });

        // Minimum display time (for smooth UX)
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

            // Remove from DOM after animation
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

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Preloader;
}
