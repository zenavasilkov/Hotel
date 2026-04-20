document.addEventListener('DOMContentLoaded', () => {
    Preloader.init();
    I18n.init();
    BurgerMenu.init();
    Modal.init();
    ThemeSwitcher.init();

    initializePageScripts();
    setupAccessibility();
    setupCookieBanner();
    setupResetSettings();
    setupAmenitiesSync()

    console.log('Santorini Hotel website initialized');
});

function initializePageScripts() {
    const path = window.location.pathname;

    const isHomePage = path.endsWith('/') || path.includes('index.html');
    const isRoomsPage = path.includes('rooms.html');

    if (isHomePage) {
        initializeHomePage();
    } else if (isRoomsPage) {
        if (typeof initializeRoomsPage === 'function') {
            initializeRoomsPage();
        }
    }
}

function initializeHomePage() {
    setupRoomsSlider();

    const amenitiesSlider = new Slider('.amenities__slider', {
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: false,
        infinite: true,
        dots: false,
        arrows: false
    });

    setupAmenitiesSync(amenitiesSlider);

    syncAmenitiesUI(0);

    loadRoomsData();
    loadOffersData();
    initializeTabs();
    initializeHeroBookingCounter();
}

let roomsSliderInstance = null;

function setupRoomsSlider() {
    if (roomsSliderInstance && typeof roomsSliderInstance.destroy === 'function') {
        roomsSliderInstance.destroy();
    }

    roomsSliderInstance = new Slider('.rooms__slider', {
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: false,
        infinite: true,
        dots: true,
        arrows: true
    });
}

function initializeHeroBookingCounter() {
    const form = document.querySelector('.search-form--figma');
    if (!form) return;

    const output = form.querySelector('#guests-value');
    if (!output) return;

    let value = 2;
    const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
    const render = () => {
        output.textContent = String(value).padStart(2, '0');
    };

    form.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-action]');
        if (!btn) return;
        const action = btn.getAttribute('data-action');
        if (action === 'increase') value = clamp(value + 1, 1, 99);
        if (action === 'decrease') value = clamp(value - 1, 1, 99);
        render();
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const dateRangeInput = form.querySelector('#date-range');
        const dateRange = dateRangeInput ? encodeURIComponent(dateRangeInput.value.trim()) : '';
        window.location.href = `booking.html?guests=${value}&dates=${dateRange}`;
    });

    render();
}

async function loadRoomsData() {
    try {
        const rooms = await FetchAPI.get(API_ENDPOINTS.ROOMS);
        renderRooms(rooms);
    } catch (error) {
        console.error('Failed to load rooms:', error);
        showErrorMessage('Не удалось загрузить номера');
    }
}

function renderRooms(rooms) {
    const container = document.querySelector('.rooms__slider .slider__container');
    if (!container || !Array.isArray(rooms)) return;

    container.replaceChildren();

    rooms.forEach(room => {
        const article = document.createElement('article');
        article.className = 'room-card';

        const imgWrapper = document.createElement('div');
        imgWrapper.className = 'room-card__image-wrapper';
        const img = document.createElement('img');
        img.src = room.images[0];
        img.alt = I18n.currentLang === 'ru' ? room.name : room.nameEn;
        img.className = 'room-card__image';
        img.loading = 'lazy';
        imgWrapper.appendChild(img);
        article.appendChild(imgWrapper);

        const content = document.createElement('div');
        content.className = 'room-card__content';

        const header = document.createElement('div');
        header.className = 'room-card__header';

        const title = document.createElement('h3');
        title.className = 'room-card__title';
        title.textContent = I18n.currentLang === 'ru' ? room.name : room.nameEn;

        const price = document.createElement('div');
        price.className = 'room-card__price-wrapper';
        const priceValue = document.createElement('span');
        priceValue.className = 'room-card__price';
        priceValue.textContent = `${room.price.toLocaleString()} ₽`;
        const period = document.createElement('span');
        period.className = 'room-card__price-period';
        period.textContent = ` ${I18n.t('perNight')}`;
        price.append(priceValue, period);

        header.append(title, price);
        content.appendChild(header);

        const meta = document.createElement('div');
        meta.className = 'room-card__meta';

        const createMeta = (icon, text) => {
            const item = document.createElement('div');
            item.className = 'room-card__meta-item';
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('width', '18');
            svg.setAttribute('height', '18');
            const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
            use.setAttribute('href', `assets/icons/sprite.svg#${icon}`);
            svg.appendChild(use);
            const span = document.createElement('span');
            span.textContent = text;
            item.append(svg, span);
            return item;
        };

        meta.append(createMeta('area', `${room.area} ${I18n.t('sqm')}`), createMeta('guests', `${room.guests} ${I18n.t('guests')}`));
        content.appendChild(meta);

        const actions = document.createElement('div');
        actions.className = 'room-card__actions';

        const bookBtn = document.createElement('a');
        bookBtn.href = `booking.html?roomId=${room.id}`;
        bookBtn.className = 'btn btn--primary btn--full';
        bookBtn.textContent = I18n.t('book');

        const infoBtn = document.createElement('a');
        infoBtn.href = `room-detail.html?id=${room.id}`;
        infoBtn.className = 'btn btn--outline btn--full';
        infoBtn.textContent = I18n.t('details');

        actions.append(bookBtn, infoBtn);
        content.appendChild(actions);

        article.appendChild(content);
        container.appendChild(article);
    });

    setupRoomsSlider();
}

function renderOffers(offers) {
    const container = document.querySelector('.offers__list');
    if (!container || !Array.isArray(offers)) return;

    container.replaceChildren();

    offers.forEach(offer => {
        const article = document.createElement('article');
        article.className = 'offer-card';

        const img = document.createElement('img');
        img.src = offer.image;
        img.alt = I18n.currentLang === 'ru' ? offer.title : offer.titleEn;
        img.className = 'offer-card__image';
        img.loading = 'lazy';

        const content = document.createElement('div');
        content.className = 'offer-card__content';

        const time = document.createElement('time');
        time.className = 'offer-card__date';
        time.setAttribute('datetime', offer.validFrom);
        time.textContent = formatDate(offer.validFrom);

        const h3 = document.createElement('h3');
        h3.className = 'offer-card__title';
        h3.textContent = I18n.currentLang === 'ru' ? offer.title : offer.titleEn;

        const p = document.createElement('p');
        p.className = 'offer-card__description';
        p.textContent = I18n.currentLang === 'ru' ? offer.description : offer.descriptionEn;

        const link = document.createElement('a');
        link.href = '#';
        link.className = 'offer-card__link';
        link.textContent = `${I18n.t('details')}`;

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '16');
        svg.setAttribute('height', '16');
        const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
        use.setAttribute('href', 'assets/icons/sprite.svg#arrow-right');
        svg.appendChild(use);
        link.appendChild(svg);

        content.append(time, h3, p, link);
        article.append(img, content);
        container.appendChild(article);
    });
}

async function loadOffersData() {
    try {
        const offers = await FetchAPI.get(API_ENDPOINTS.OFFERS);
        renderOffers(offers.slice(0, 3));
    } catch (error) {
        console.error('Failed to load offers:', error);
    }
}

function initializeTabs() {
    const tabs = document.querySelectorAll('.tabs__btn');
    const panels = document.querySelectorAll('.active-recreation__panel');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.getAttribute('aria-controls');

            tabs.forEach(t => {
                t.setAttribute('aria-selected', 'false');
                t.classList.remove('active');
                t.setAttribute('tabindex', '-1');
            });

            tab.setAttribute('aria-selected', 'true');
            tab.classList.add('active');
            tab.setAttribute('tabindex', '0');

            panels.forEach(panel => {
                panel.classList.remove('active');
                panel.setAttribute('hidden', '');
            });

            const activePanel = document.getElementById(target);
            if (activePanel) {
                activePanel.classList.add('active');
                activePanel.removeAttribute('hidden');
            }
        });

        tab.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                e.preventDefault();
            }
        });
    });
}

function setupAccessibility() {
    const accessibilityToggle = document.getElementById('accessibility-toggle');
    if (!accessibilityToggle) return;

    accessibilityToggle.addEventListener('click', () => {
        const isAccessible = StorageUtils.get(APP_CONFIG.STORAGE_KEYS.ACCESSIBILITY, false);
        StorageUtils.set(APP_CONFIG.STORAGE_KEYS.ACCESSIBILITY, !isAccessible);
        applyAccessibilitySettings(!isAccessible);
    });

    const isAccessible = StorageUtils.get(APP_CONFIG.STORAGE_KEYS.ACCESSIBILITY, false);
    if (isAccessible) {
        applyAccessibilitySettings(true);
    }
}

function applyAccessibilitySettings(enabled) {
    const accessibilityStyle = document.getElementById('accessibility-style');
    if (accessibilityStyle) {
        accessibilityStyle.disabled = !enabled;
    }

    if (enabled) {
        document.body.classList.add('accessibility-mode');
    } else {
        document.body.classList.remove('accessibility-mode');
    }
}

function setupCookieBanner() {
    const banner = document.getElementById('cookie-banner');
    if (!banner) return;

    const accepted = StorageUtils.get('cookie_consent', null);

    if (accepted === null) {
        banner.hidden = false;
    }

    const acceptBtn = document.querySelector('[data-cookie-accept]');
    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            StorageUtils.set('cookie_consent', true);
            banner.hidden = true;
        });
    }

    const declineBtn = document.querySelector('[data-cookie-decline]');
    if (declineBtn) {
        declineBtn.addEventListener('click', () => {
            StorageUtils.set('cookie_consent', false);
            banner.hidden = true;
        });
    }
}

function setupResetSettings() {
    const resetBtn = document.querySelector('[data-reset-settings]');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (confirm('Вы уверены, что хотите сбросить все настройки?')) {
                StorageUtils.clear();
                location.reload();
            }
        });
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const locale = I18n.currentLang === 'ru' ? 'ru-RU' : 'en-US';
    return date.toLocaleDateString(locale, {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}

function showErrorMessage(message) {
    console.error(message);
}

function setupAmenitiesSync(sliderInstance) {
    const listItems = document.querySelectorAll('.amenities__item');
    const prevBtn = document.getElementById('amenities-prev');
    const nextBtn = document.getElementById('amenities-next');

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            sliderInstance.prev();
            syncAmenitiesUI(sliderInstance.currentIndex);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            sliderInstance.next();
            syncAmenitiesUI(sliderInstance.currentIndex);
        });
    }

    listItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            sliderInstance.goToSlide(index);
            syncAmenitiesUI(index);
        });
    });
}

function syncAmenitiesUI(index) {
    const items = document.querySelectorAll('.amenities__item');
    const counter = document.getElementById('amenities-current');

    items.forEach((item, i) => {
        item.classList.toggle('active', i === index);
    });

    if (counter) {
        counter.textContent = String(index + 1).padStart(2, '0');
    }
}

(function initAdminQuickAccess() {
    const panel = document.getElementById('adminQuickAccess');
    if (!panel) return;

    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const isAdmin = user.role === 'admin' && user.email;

    if (!isAdmin) {
        panel.hidden = true;
        panel.remove?.();
        return;
    }

    panel.hidden = false;
    panel.setAttribute('data-visible', 'true');

    const greetingEl = document.getElementById('adminGreeting');
    if (greetingEl) {
        greetingEl.textContent = user.fullName?.split(' ')[0] || user.nickname || user.email.split('@')[0] || 'Админ';
    }

    const toggleBtn = panel.querySelector('.admin-quick-access__toggle');
    const closeBtn = panel.querySelector('.admin-quick-access__close');
    const panelContent = panel.querySelector('.admin-quick-access__panel');
    const logoutBtn = document.getElementById('adminQuickLogout');

    let isOpen = false;

    function togglePanel() {
        isOpen = !isOpen;
        panelContent.classList.toggle('active', isOpen);
        toggleBtn.setAttribute('aria-expanded', isOpen);
        panelContent.setAttribute('aria-hidden', !isOpen);

        if (isOpen) {
            document.addEventListener('click', closeOnOutsideClick);
        } else {
            document.removeEventListener('click', closeOnOutsideClick);
        }
    }

    function closePanel() {
        isOpen = false;
        panelContent.classList.remove('active');
        toggleBtn.setAttribute('aria-expanded', 'false');
        panelContent.setAttribute('aria-hidden', 'true');
        document.removeEventListener('click', closeOnOutsideClick);
    }

    function closeOnOutsideClick(e) {
        if (!panel.contains(e.target) && !toggleBtn.contains(e.target)) {
            closePanel();
        }
    }

    toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        togglePanel();
    });

    closeBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        closePanel();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isOpen) {
            closePanel();
            toggleBtn.focus();
        }
    });

    logoutBtn?.addEventListener('click', () => {
        localStorage.removeItem('user');
        window.location.href = 'auth.html';
    });

    panel.querySelectorAll('.admin-quick-access__link').forEach(link => {
        link.addEventListener('click', closePanel);
    });

    console.log('✅ Admin Quick Access Panel initialized');
})();

document.addEventListener('languageChanged', () => {
    const roomsSliderContainer = document.querySelector('.rooms__slider .slider__container');
    if (roomsSliderContainer && roomsSliderContainer.children.length > 0) {
        loadRoomsData();
    }

    const offersContainer = document.querySelector('.offers__list');
    if (offersContainer && offersContainer.children.length > 0) {
        loadOffersData();
    }

    const roomsCatalogContainer = document.getElementById('rooms-catalog-container');
    if (roomsCatalogContainer && roomsCatalogContainer.children.length > 0) {
        if (typeof initRoomsCatalog === 'function') {
            initRoomsCatalog();
        }
    }
});

window.SantoriniApp = {
    loadRoomsData,
    renderRooms,
    loadOffersData,
    renderOffers,
    formatDate,
    showErrorMessage
};
