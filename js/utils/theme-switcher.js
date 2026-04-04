/**
 * Theme Switcher Utility
 */
const ThemeSwitcher = {
    currentTheme: APP_CONFIG.THEMES.LIGHT,

    /**
     * Initialize theme switcher
     */
    init() {
        this.currentTheme = StorageUtils.get(APP_CONFIG.STORAGE_KEYS.THEME, APP_CONFIG.THEMES.LIGHT);
        this.applyTheme(this.currentTheme);
        this.setupEventListeners();
    },

    /**
     * Apply theme to the page
     * @param {string} theme - Theme name
     */
    applyTheme(theme) {
        const themeStyle = document.getElementById('theme-style');
        if (themeStyle) {
            themeStyle.href = `css/themes/${theme}-theme.css`;
        }

        // Update theme toggle button icon
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            const icon = themeToggle.querySelector('use');
            if (icon) {
                icon.setAttribute('href', `assets/icons/sprite.svg#${theme === 'light' ? 'moon' : 'sun'}`);
            }
        }

        this.currentTheme = theme;
    },

    /**
     * Toggle between light and dark themes
     */
    toggle() {
        const newTheme = this.currentTheme === APP_CONFIG.THEMES.LIGHT
            ? APP_CONFIG.THEMES.DARK
            : APP_CONFIG.THEMES.LIGHT;

        this.applyTheme(newTheme);
        StorageUtils.set(APP_CONFIG.STORAGE_KEYS.THEME, newTheme);
    },

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggle());
        }
    }
};

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThemeSwitcher;
}
