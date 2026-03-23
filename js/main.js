/**
 * Main Application Entry Point
 */
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    Preloader.init();
    I18n.init();
    ThemeSwitcher.init();
    BurgerMenu.init();
    Modal.init();

    // Initialize page-specific scripts
    initializePageScripts();

    // Setup accessibility
    setupAccessibility();

    // Setup cookie banner
    setupCookieBanner();

    // Setup reset settings button
    setupResetSettings();

    console.log('Santorini Hotel website initialized');
});

/**
 * Initialize page-specific scripts
 */
function initializePageScripts() {
    const path = window.location.pathname;

    // Initialize sliders on pages that need them
    if (path.includes('index.html') || path === '/') {
        initializeHomePage();
    } else if (path.includes('rooms.html')) {
        initializeRoomsPage();
    }
}

/**
 * Initialize home page components
 */
function initializeHomePage() {
    setupRoomsSlider();

    // Initialize amenities slider
    new Slider('.amenities__slider', {
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 4000,
        infinite: true,
        dots: false,
        arrows: false
    });

    // Load rooms data
    loadRoomsData();

    // Load offers data
    loadOffersData();

    // Initialize tabs
    initializeTabs();

    // Initialize Figma booking module counter (homepage)
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
        autoplay: true,
        autoplaySpeed: 5000,
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

/**
 * Load rooms data from API
 */
async function loadRoomsData() {
    try {
        const rooms = await FetchAPI.get(API_ENDPOINTS.ROOMS);
        renderRooms(rooms);
    } catch (error) {
        console.error('Failed to load rooms:', error);
        showErrorMessage('Не удалось загрузить номера');
    }
}

/**
 * Render rooms cards
 */
function renderRooms(rooms) {
    const container = document.querySelector('.rooms__slider .slider__container');
    if (!container) return;

    container.innerHTML = rooms.map(room => `
        <article class="room-card">
            <div class="room-card__image-wrapper">
                <img src="${room.images[0]}" alt="${room.name}" class="room-card__image" loading="lazy">
            </div>
            <div class="room-card__content">
                <div class="room-card__header">
                    <div>
                        <h3 class="room-card__title">${room.name}</h3>
                        <p class="room-card__price">${room.price.toLocaleString()} ₽ 
                            <span class="room-card__price-period">/ ночь</span>
                        </p>
                    </div>
                </div>
                <div class="room-card__meta">
                    <span class="room-card__meta-item">
                        <svg width="16" height="16" aria-hidden="true">
                            <use href="assets/icons/sprite.svg#area"></use>
                        </svg>
                        ${room.area} м²
                    </span>
                    <span class="room-card__meta-item">
                        <svg width="16" height="16" aria-hidden="true">
                            <use href="assets/icons/sprite.svg#guests"></use>
                        </svg>
                        ${room.guests} гостей
                    </span>
                </div>
                <div class="room-card__actions">
                    <a href="booking.html?roomId=${room.id}" class="btn btn--primary">Забронировать</a>
                    <a href="room-detail.html?id=${room.id}" class="btn btn--outline">Подробнее</a>
                </div>
            </div>
        </article>
    `).join('');

    // Re-initialize slider after dynamic content render
    setupRoomsSlider();
}

/**
 * Load offers data from API
 */
async function loadOffersData() {
    try {
        const offers = await FetchAPI.get(API_ENDPOINTS.OFFERS);
        renderOffers(offers.slice(0, 3)); // Show first 3 on homepage
    } catch (error) {
        console.error('Failed to load offers:', error);
    }
}

/**
 * Render offers cards
 */
function renderOffers(offers) {
    const container = document.querySelector('.offers__list');
    if (!container) return;

    container.innerHTML = offers.map(offer => `
        <article class="offer-card">
            <img src="${offer.image}" alt="${offer.title}" class="offer-card__image" loading="lazy">
            <div class="offer-card__content">
                <time class="offer-card__date" datetime="${offer.validFrom}">${formatDate(offer.validFrom)}</time>
                <h3 class="offer-card__title">${offer.title}</h3>
                <p class="offer-card__description">${offer.description}</p>
                <a href="special-offers.html" class="offer-card__link">
                    Подробнее
                    <svg width="16" height="16" aria-hidden="true">
                        <use href="assets/icons/sprite.svg#arrow-right"></use>
                    </svg>
                </a>
            </div>
        </article>
    `).join('');
}

/**
 * Initialize tabs functionality
 */
function initializeTabs() {
    const tabs = document.querySelectorAll('.tabs__btn');
    const panels = document.querySelectorAll('.active-recreation__panel');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.getAttribute('aria-controls');

            // Update tabs
            tabs.forEach(t => {
                t.setAttribute('aria-selected', 'false');
                t.classList.remove('active');
                t.setAttribute('tabindex', '-1');
            });

            tab.setAttribute('aria-selected', 'true');
            tab.classList.add('active');
            tab.setAttribute('tabindex', '0');

            // Update panels
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

        // Keyboard navigation
        tab.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                e.preventDefault();
                // Handle arrow key navigation
            }
        });
    });
}

/**
 * Setup accessibility features
 */
function setupAccessibility() {
    const accessibilityToggle = document.getElementById('accessibility-toggle');
    if (!accessibilityToggle) return;

    accessibilityToggle.addEventListener('click', () => {
        const isAccessible = StorageUtils.get(APP_CONFIG.STORAGE_KEYS.ACCESSIBILITY, false);
        StorageUtils.set(APP_CONFIG.STORAGE_KEYS.ACCESSIBILITY, !isAccessible);
        applyAccessibilitySettings(!isAccessible);
    });

    // Apply saved settings
    const isAccessible = StorageUtils.get(APP_CONFIG.STORAGE_KEYS.ACCESSIBILITY, false);
    if (isAccessible) {
        applyAccessibilitySettings(true);
    }
}

/**
 * Apply accessibility settings
 */
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

/**
 * Setup cookie banner
 */
function setupCookieBanner() {
    const banner = document.getElementById('cookie-banner');
    if (!banner) return;

    const accepted = StorageUtils.get('cookie_consent', null);

    if (accepted === null) {
        banner.hidden = false;
    }

    // Accept button
    const acceptBtn = document.querySelector('[data-cookie-accept]');
    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            StorageUtils.set('cookie_consent', true);
            banner.hidden = true;
        });
    }

    // Decline button
    const declineBtn = document.querySelector('[data-cookie-decline]');
    if (declineBtn) {
        declineBtn.addEventListener('click', () => {
            StorageUtils.set('cookie_consent', false);
            banner.hidden = true;
        });
    }
}

/**
 * Setup reset settings button
 */
function setupResetSettings() {
    // Can be triggered from settings panel or footer
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

/**
 * Format date for display
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}

/**
 * Show error message
 */
function showErrorMessage(message) {
    // Implement error notification system
    console.error(message);
}

// Export functions for page-specific scripts
window.SantoriniApp = {
    loadRoomsData,
    renderRooms,
    loadOffersData,
    renderOffers,
    formatDate,
    showErrorMessage
};
