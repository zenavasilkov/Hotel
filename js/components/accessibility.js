const Accessibility = {
    modal: null,
    toggles: null,
    defaultSettings: {
        fontSize: 'medium',
        colorScheme: 'default',
        showImages: true
    },

    init() {
        this.modal = document.getElementById('accessibility-modal');
        if (!this.modal) return;

        this.toggles = {
            openBtn: document.getElementById('accessibility-toggle'),
            closeBtns: document.querySelectorAll('[data-acc-close]'),
            resetBtn: document.querySelector('[data-acc-reset]'),
            sizeBtns: document.querySelectorAll('.acc-btn--size'),
            colorBtns: document.querySelectorAll('.acc-color-circle'),
            imagesToggle: document.getElementById('acc-images-toggle')
        };

        this.loadSettings();
        this.bindEvents();
    },

    bindEvents() {
        if (this.toggles.openBtn) {
            this.toggles.openBtn.addEventListener('click', () => this.openModal());
        }

        this.toggles.closeBtns.forEach(btn => {
            btn.addEventListener('click', () => this.closeModal());
        });

        if (this.toggles.resetBtn) {
            this.toggles.resetBtn.addEventListener('click', () => this.resetSettings());
        }

        this.toggles.sizeBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setFontSize(e.target.dataset.size);
                this.updateActiveState(this.toggles.sizeBtns, e.target);
            });
        });

        this.toggles.colorBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setColorScheme(e.target.dataset.scheme);
                this.updateActiveState(this.toggles.colorBtns, e.target);
            });
        });

        if (this.toggles.imagesToggle) {
            this.toggles.imagesToggle.addEventListener('change', (e) => {
                this.toggleImages(e.target.checked);
            });
        }
    },

    loadSettings() {
        const saved = localStorage.getItem('accessibility_settings');
        const settings = saved ? JSON.parse(saved) : this.defaultSettings;

        this.applySettings(settings);
        this.applyImageVisibility(settings.showImages);
        this.updateActiveState(this.toggles.sizeBtns, document.querySelector(`.acc-btn--size[data-size="${settings.fontSize}"]`));
        this.updateActiveState(this.toggles.colorBtns, document.querySelector(`.acc-color-circle[data-scheme="${settings.colorScheme}"]`));
        if (this.toggles.imagesToggle) {
            this.toggles.imagesToggle.checked = settings.showImages;
        }
    },

    applySettings(settings) {
        const body = document.body;

        if (settings.colorScheme !== 'default') {
            body.classList.add('accessibility-mode');
        } else {
            body.classList.remove('accessibility-mode');
        }

        body.classList.remove('font-small', 'font-medium', 'font-large');
        body.classList.add(`font-${settings.fontSize}`);

        body.classList.remove('scheme-bw', 'scheme-bg', 'scheme-wb', 'scheme-bc', 'scheme-bd');
        if (settings.colorScheme !== 'default') {
            body.classList.add(`scheme-${settings.colorScheme}`);
        }

        if (!settings.showImages) {
            body.classList.add('hide-images');
        } else {
            body.classList.remove('hide-images');
        }
    },

    setFontSize(size) {
        const settings = this.getSettings();
        settings.fontSize = size;
        this.saveSettings(settings);
        this.applySettings(settings);
    },

    setColorScheme(scheme) {
        const settings = this.getSettings();
        settings.colorScheme = scheme;
        this.saveSettings(settings);
        this.applySettings(settings);
    },

    toggleImages(show) {
        const settings = this.getSettings();
        settings.showImages = show;
        this.saveSettings(settings);
        this.applySettings(settings);
        this.applyImageVisibility(show);
    },

    applyImageVisibility(show) {
        document.querySelectorAll('img').forEach(img => {
            if (!img.alt || img.alt.trim() === '') return;

            if (show) {
                img.style.display = '';
                const placeholder = img.nextElementSibling;
                if (placeholder && placeholder.classList.contains('acc-alt-placeholder')) {
                    placeholder.remove();
                }
            } else {
                img.style.display = 'none';
                if (!img.nextElementSibling?.classList.contains('acc-alt-placeholder')) {
                    const placeholder = document.createElement('div');
                    placeholder.className = 'acc-alt-placeholder';
                    placeholder.textContent = img.alt.trim();
                    placeholder.setAttribute('role', 'img');
                    placeholder.setAttribute('aria-label', img.alt);
                    img.parentNode.insertBefore(placeholder, img.nextSibling);
                }
            }
        });
    },

    resetSettings() {
        localStorage.removeItem('accessibility_settings');
        location.reload();
    },

    getSettings() {
        const saved = localStorage.getItem('accessibility_settings');
        return saved ? JSON.parse(saved) : this.defaultSettings;
    },

    saveSettings(settings) {
        localStorage.setItem('accessibility_settings', JSON.stringify(settings));
    },

    openModal() {
        this.modal.classList.add('active');
        this.modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    },

    closeModal() {
        this.modal.classList.remove('active');
        this.modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    },

    updateActiveState(list, target) {
        list.forEach(el => el.classList.remove('active'));
        if (target) target.classList.add('active');
    }
};

document.addEventListener('DOMContentLoaded', () => Accessibility.init());
