const BurgerMenu = {
    isOpen: false,

    init() {
        this.burger = document.querySelector('.burger-menu');
        this.menu = document.getElementById('mobile-menu');
        this.closeBtn = document.getElementById('mobile-menu-close');
        if (!this.burger || !this.menu) return;

        this.setupEventListeners();
    },

    setupEventListeners() {
        this.burger.addEventListener('click', () => this.toggle());

        this.menu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => this.close());
        });

        this.menu.addEventListener('click', (e) => {
            if (e.target === this.menu) {
                this.close();
            }
        });

        this.closeBtn.addEventListener('click', (e) => {
            this.close();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 1024 && this.isOpen) {
                this.close();
            }
        });
    },

    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    },

    open() {
        this.isOpen = true;
        this.burger.classList.add('active');
        this.burger.setAttribute('aria-expanded', 'true');
        this.menu.classList.add('active');
        this.menu.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';

        const firstLink = this.menu.querySelector('a');
        if (firstLink) {
            firstLink.focus();
        }
    },

    close() {
        this.isOpen = false;
        this.burger.classList.remove('active');
        this.burger.setAttribute('aria-expanded', 'false');
        this.menu.classList.remove('active');
        this.menu.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';

        this.burger.focus();
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = BurgerMenu;
}
