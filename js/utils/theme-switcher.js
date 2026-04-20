const ThemeSwitcher = {
    currentTheme: APP_CONFIG.THEMES.LIGHT,

    init() {
        this.currentTheme = StorageUtils.get(APP_CONFIG.STORAGE_KEYS.THEME, APP_CONFIG.THEMES.LIGHT);
        this.applyTheme(this.currentTheme);
        this.setupEventListeners();
    },

    applyTheme(theme) {
        const themeStyle = document.getElementById('theme-style');
        if (themeStyle) {
            themeStyle.href = `css/themes/${theme}-theme.css`;
        }

        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }

        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            const icon = themeToggle.querySelector('use');
            if (icon) {
                icon.setAttribute('href', `assets/icons/sprite.svg#${theme === 'light' ? 'moon' : 'sun'}`);
            }
        }

        this.currentTheme = theme;
    },

    toggle() {
        const newTheme = this.currentTheme === APP_CONFIG.THEMES.LIGHT
            ? APP_CONFIG.THEMES.DARK
            : APP_CONFIG.THEMES.LIGHT;

        this.applyTheme(newTheme);
        StorageUtils.set(APP_CONFIG.STORAGE_KEYS.THEME, newTheme);
    },

    setupEventListeners() {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggle());
        }
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThemeSwitcher;
}
