const I18n = {
    currentLang: APP_CONFIG.LANGUAGES.RU,

    translations: {
        ru: {
            bookNow: 'Забронировать',
            heroTitle: 'Комфортный отдых в Крыму',
            checkIn: 'Дата заезда',
            checkOut: 'Дата выезда',
            guests: 'Количество гостей',
            search: 'Найти',
            roomsTitle: 'Номера',
            roomsSubtitle: 'Выбери свой номер',
            perNight: 'за ночь',
            book: 'Забронировать',
            details: 'Подробнее',
            sqm: 'кв.м',
            amenitiesTitle: 'Вам понравится у нас',
            pastaBar: 'Паста бар',
            aromaGarden: 'Арома-сад',
            beach: 'Пляж',
            territory: 'Территория отеля',
            activeTitle: 'Активный отдых в отеле Santorini',
            seaTrips: 'Морские прогулки',
            fishing: 'Рыбалка',
            extreme: 'Экстрим',
            windsurfing: 'Виндсерфинг',
            kitesurfing: 'Кайтсерфинг',
            endoTour: 'Эндо-тур',
            safari: 'Сафари на джипах',
            offersTitle: 'Наши спецпредложения',
            viewAll: 'Смотреть все',
            videoTitle: 'Посмотрите обзорное видео о нашем отеле',
            videoModalTitle: 'Видео об отеле',
            address: '298690, Россия, Крым, г. Ялта, пгт Форос, Форосский спуск, 1',
            copyright: '© 2022 Santorini. Все права защищены.',
            privacy: 'Политика конфиденциальности',
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
            loading: 'Загрузка...',
            error: 'Ошибка',
            close: 'Закрыть',
            next: 'Далее',
            prev: 'Назад',
            cookieText: 'Мы используем файлы cookie для улучшения работы сайта. Продолжая использовать сайт, вы соглашаетесь с нашей политикой конфиденциальности.',
            cookieAccept: 'Принять',
            cookieDecline: 'Отклонить'
        },
        en: {
            bookNow: 'Book Now',
            heroTitle: 'Comfortable Rest in Crimea',
            checkIn: 'Check-in',
            checkOut: 'Check-out',
            guests: 'Number of Guests',
            search: 'Search',
            roomsTitle: 'Rooms',
            roomsSubtitle: 'Choose your room',
            perNight: 'per night',
            book: 'Book',
            details: 'Details',
            sqm: 'sq.m',
            amenitiesTitle: 'You will like it here',
            pastaBar: 'Pasta Bar',
            aromaGarden: 'Aroma Garden',
            beach: 'Beach',
            territory: 'Hotel Territory',
            activeTitle: 'Active Recreation at Santorini Hotel',
            seaTrips: 'Sea Trips',
            fishing: 'Fishing',
            extreme: 'Extreme',
            windsurfing: 'Windsurfing',
            kitesurfing: 'Kitesurfing',
            endoTour: 'Enduro Tour',
            safari: 'Jeep Safari',
            offersTitle: 'Our Special Offers',
            viewAll: 'View All',
            videoTitle: 'Watch an overview video of our hotel',
            videoModalTitle: 'Hotel Video',
            address: '298690, Russia, Crimea, Yalta, Foros, Foros Descent, 1',
            copyright: '© 2022 Santorini. All rights reserved.',
            privacy: 'Privacy Policy',
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
            loading: 'Loading...',
            error: 'Error',
            close: 'Close',
            next: 'Next',
            prev: 'Previous',
            cookieText: 'We use cookies to improve the website. By continuing to use the site, you agree to our privacy policy.',
            cookieAccept: 'Accept',
            cookieDecline: 'Decline'
        }
    },

    init() {
        this.currentLang = StorageUtils.get(APP_CONFIG.STORAGE_KEYS.LANGUAGE, APP_CONFIG.LANGUAGES.RU);
        this.applyTranslations();
    },

    t(key) {
        return this.translations[this.currentLang][key] || key;
    },

    applyTranslations() {
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.t(key);
            if (!translation) return;

            const textNodes = Array.from(element.childNodes).filter(
                node => node.nodeType === Node.TEXT_NODE && node.textContent.trim()
            );

            if (textNodes.length > 0) {
                textNodes[0].textContent = translation;
            } else {
                const target = element.querySelector('[data-i18n-target]');
                if (target) {
                    target.textContent = translation;
                } else {
                    element.textContent = translation;
                }
            }
        });

        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            element.placeholder = this.t(key);
        });

        document.querySelectorAll('[data-i18n-aria-label]').forEach(element => {
            const key = element.getAttribute('data-i18n-aria-label');
            element.setAttribute('aria-label', this.t(key));
        });

        document.querySelectorAll('[data-i18n-title]').forEach(element => {
            const key = element.getAttribute('data-i18n-title');
            element.title = this.t(key);
        });
    },

    setLanguage(lang) {
        if (this.translations[lang]) {
            this.currentLang = lang;
            StorageUtils.set(APP_CONFIG.STORAGE_KEYS.LANGUAGE, lang);
            this.applyTranslations();

            document.querySelectorAll('.lang-switcher__btn').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.lang === lang);
            });

            document.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
        }
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = I18n;
}
