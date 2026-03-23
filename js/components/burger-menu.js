/**
 * Burger Menu Component
 */
const BurgerMenu = {
    isOpen: false,

    /**
     * Initialize burger menu
     */
    init() {
        this.burger = document.querySelector('.burger-menu');
        this.menu = document.getElementById('mobile-menu');

        if (!this.burger || !this.menu) return;

        this.setupEventListeners();
    },

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Toggle menu
        this.burger.addEventListener('click', () => this.toggle());

        // Close on link click
        this.menu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => this.close());
        });

        // Close on overlay click
        this.menu.addEventListener('click', (e) => {
            if (e.target === this.menu) {
                this.close();
            }
        });

        // Close on escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });

        // Handle resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 1024 && this.isOpen) {
                this.close();
            }
        });
    },

    /**
     * Toggle menu state
     */
    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    },

    /**
     * Open menu
     */
    open() {
        this.isOpen = true;
        this.burger.classList.add('active');
        this.burger.setAttribute('aria-expanded', 'true');
        this.menu.classList.add('active');
        this.menu.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';

        // Focus first link
        const firstLink = this.menu.querySelector('a');
        if (firstLink) {
            firstLink.focus();
        }
    },

    /**
     * Close menu
     */
    close() {
        this.isOpen = false;
        this.burger.classList.remove('active');
        this.burger.setAttribute('aria-expanded', 'false');
        this.menu.classList.remove('active');
        this.menu.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';

        // Return focus to burger
        this.burger.focus();
    }
};

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BurgerMenu;
}
