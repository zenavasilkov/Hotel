/**
 * Application Constants
 */
const APP_CONFIG = {
    API_BASE_URL: 'http://localhost:3000',
    API_TIMEOUT: 10000,

    ITEMS_PER_PAGE: 6,

    STORAGE_KEYS: {
        LANGUAGE: 'santorini_lang',
        THEME: 'santorini_theme',
        ACCESSIBILITY: 'santorini_accessibility',
        USER: 'santorini_user',
        BOOKING: 'santorini_booking'
    },

    LANGUAGES: {
        RU: 'ru',
        EN: 'en'
    },

    THEMES: {
        LIGHT: 'light',
        DARK: 'dark'
    },

    ROLES: {
        GUEST: 'guest',
        USER: 'user',
        ADMIN: 'admin'
    },

    DATE_FORMAT: {
        DISPLAY: 'DD.MM.YYYY',
        ISO: 'YYYY-MM-DD'
    },

    VALIDATION: {
        MIN_PASSWORD_LENGTH: 8,
        MAX_PASSWORD_LENGTH: 20,
        MIN_AGE: 16,
        PHONE_PATTERN: /^\+375\d{9}$/
    }
};

Object.freeze(APP_CONFIG);
Object.freeze(APP_CONFIG.STORAGE_KEYS);
Object.freeze(APP_CONFIG.LANGUAGES);
Object.freeze(APP_CONFIG.THEMES);
Object.freeze(APP_CONFIG.ROLES);
Object.freeze(APP_CONFIG.DATE_FORMAT);
Object.freeze(APP_CONFIG.VALIDATION);
