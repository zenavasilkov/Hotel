/**
 * Internationalization (i18n) Utility
 */
const I18n = {
    currentLang: APP_CONFIG.LANGUAGES.RU,

    translations: {
        ru: {
            // Header
            bookNow: 'Забронировать',

            // Hero
            heroTitle: 'Комфортный отдых в Крыму',
            checkIn: 'Дата заезда',
            checkOut: 'Дата выезда',
            guests: 'Количество гостей',
            search: 'Найти',

            // Rooms
            roomsTitle: 'Номера',
            roomsSubtitle: 'Выбери свой номер',
            perNight: 'за ночь',
            book: 'Забронировать',
            details: 'Подробнее',
            sqm: 'кв.м',
            guests: 'гостей',

            // Amenities
            amenitiesTitle: 'Вам понравится у нас',
            pastaBar: 'Паста бар',
            aromaGarden: 'Арома-сад',
            beach: 'Пляж',
            territory: 'Территория отеля',

            // Active Recreation
            activeTitle: 'Активный отдых в отеле Santorini',
            seaTrips: 'Морские прогулки',
            fishing: 'Рыбалка',
            extreme: 'Экстрим',
            windsurfing: 'Виндсерфинг',
            kitesurfing: 'Кайтсерфинг',
            endoTour: 'Эндо-тур',
            safari: 'Сафари на джипах',

            // Offers
            offersTitle: 'Наши спецпредложения',
            viewAll: 'Смотреть все',

            // Video
            videoTitle: 'Посмотрите обзорное видео о нашем отеле',
            videoModalTitle: 'Видео об отеле',

            // Footer
            address: '298690, Россия, Крым, г. Ялта, пгт Форос, Форосский спуск, 1',
            copyright: '© 2022 Santorini. Все права защищены.',
            privacy: 'Политика конфиденциальности',

            // Navigation
            navRooms: 'Номера и цены',
            navAbout: 'Об отеле',
            navServices: 'Услуги',
            navConditions: 'Условия проживания',
            navNews: 'Новости',
            navContacts: 'Контакты',
            navPhotos: 'Фото отеля',
            navHowToGet: 'Как добраться',
            navReviews: 'Отзывы гостей',
            navAttractions: 'Достопримечательности',
            navPastaBar: 'Паста-бар',
            navActive: 'Активный отдых',
            navOffers: 'Спецпредложения',

            // Common
            loading: 'Загрузка...',
            error: 'Ошибка',
            close: 'Закрыть',
            next: 'Далее',
            prev: 'Назад',

            // Cookie Banner
            cookieText: 'Мы используем файлы cookie для улучшения работы сайта. Продолжая использовать сайт, вы соглашаетесь с нашей политикой конфиденциальности.',
            cookieAccept: 'Принять',
            cookieDecline: 'Отклонить'
        },

        en: {
            // Header
            bookNow: 'Book Now',

            // Hero
            heroTitle: 'Comfortable Rest in Crimea',
            checkIn: 'Check-in',
            checkOut: 'Check-out',
            guests: 'Number of Guests',
            search: 'Search',

            // Rooms
            roomsTitle: 'Rooms',
            roomsSubtitle: 'Choose your room',
            perNight: 'per night',
            book: 'Book',
            details: 'Details',
            sqm: 'sq.m',
            guests: 'guests',

            // Amenities
            amenitiesTitle: 'You will like it here',
            pastaBar: 'Pasta Bar',
            aromaGarden: 'Aroma Garden',
            beach: 'Beach',
            territory: 'Hotel Territory',

            // Active Recreation
            activeTitle: 'Active Recreation at Santorini Hotel',
            seaTrips: 'Sea Trips',
            fishing: 'Fishing',
            extreme: 'Extreme',
            windsurfing: 'Windsurfing',
            kitesurfing: 'Kitesurfing',
            endoTour: 'Enduro Tour',
            safari: 'Jeep Safari',

            // Offers
            offersTitle: 'Our Special Offers',
            viewAll: 'View All',

            // Video
            videoTitle: 'Watch an overview video of our hotel',
            videoModalTitle: 'Hotel Video',

            // Footer
            address: '298690, Russia, Crimea, Yalta, Foros, Foros Descent, 1',
            copyright: '© 2022 Santorini. All rights reserved.',
            privacy: 'Privacy Policy',

            // Navigation
            navRooms: 'Rooms & Prices',
            navAbout: 'About Hotel',
            navServices: 'Services',
            navConditions: 'Terms of Stay',
            navNews: 'News',
            navContacts: 'Contacts',
            navPhotos: 'Hotel Photos',
            navHowToGet: 'How to Get There',
            navReviews: 'Guest Reviews',
            navAttractions: 'Attractions',
            navPastaBar: 'Pasta Bar',
            navActive: 'Active Recreation',
            navOffers: 'Special Offers',

            // Common
            loading: 'Loading...',
            error: 'Error',
            close: 'Close',
            next: 'Next',
            prev: 'Previous',

            // Cookie Banner
            cookieText: 'We use cookies to improve the website. By continuing to use the site, you agree to our privacy policy.',
            cookieAccept: 'Accept',
            cookieDecline: 'Decline'
        }
    },

    /**
     * Initialize i18n
     */
    init() {
        this.currentLang = StorageUtils.get(APP_CONFIG.STORAGE_KEYS.LANGUAGE, APP_CONFIG.LANGUAGES.RU);
        this.applyTranslations();
    },

    /**
     * Get translation by key
     * @param {string} key - Translation key
     * @returns {string} Translated text
     */
    t(key) {
        return this.translations[this.currentLang][key] || key;
    },

    /**
     * Apply translations to the page
     */
    applyTranslations() {
        // Translate elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            element.textContent = this.t(key);
        });

        // Translate placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            element.placeholder = this.t(key);
        });

        // Translate aria-labels
        document.querySelectorAll('[data-i18n-aria-label]').forEach(element => {
            const key = element.getAttribute('data-i18n-aria-label');
            element.setAttribute('aria-label', this.t(key));
        });
    },

    /**
     * Change language
     * @param {string} lang - Language code
     */
    setLanguage(lang) {
        if (this.translations[lang]) {
            this.currentLang = lang;
            StorageUtils.set(APP_CONFIG.STORAGE_KEYS.LANGUAGE, lang);
            this.applyTranslations();

            // Update language buttons
            document.querySelectorAll('.lang-switcher__btn').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.lang === lang);
            });
        }
    }
};

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = I18n;
}
