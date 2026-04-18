document.addEventListener('DOMContentLoaded', function() {
    initFAQ();

    initScrollAnimations();

    initMap();
});

function initFAQ() {
    const faqTriggers = document.querySelectorAll('.faq-item__trigger');

    faqTriggers.forEach(trigger => {
        trigger.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            const content = document.getElementById(this.getAttribute('aria-controls'));

            this.setAttribute('aria-expanded', !isExpanded);
            if (content) {
                content.setAttribute('aria-hidden', isExpanded);
            }
        });
    });
}

function initScrollAnimations() {
    const animatedElements = document.querySelectorAll(
        '.transport-card, .faq-item, .transfer-content, .transfer-image'
    );

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

function initMap() {
    const mapElement = document.getElementById('hotel-map');

    if (!mapElement) return;

    function initGoogleMap() {
        const hotelLocation = {
            lat: 44.3901,
            lng: 33.7890
        };

        const map = new google.maps.Map(mapElement, {
            center: hotelLocation,
            zoom: 15,
            disableDefaultUI: false,
            zoomControl: true,
            streetViewControl: false,
            mapTypeControl: false
        });

        const marker = new google.maps.Marker({
            position: hotelLocation,
            map: map,
            title: 'Отель Santorini',
            animation: google.maps.Animation.DROP
        });

        const infoWindow = new google.maps.InfoWindow({
            content: `
                <div style="padding: 10px;">
                    <h3 style="margin: 0 0 5px 0; color: #4567AA;">Отель Santorini</h3>
                    <p style="margin: 0; font-size: 14px;">298690, Россия, Крым, г. Ялта, пгт Форос, Форосский спуск, 1</p>
                    <p style="margin: 5px 0 0 0; font-size: 14px;">Тел: 8 (912) 038-80-44</p>
                </div>
            `
        });

        marker.addListener('click', () => {
            infoWindow.open(map, marker);
        });
    }

    initGoogleMap();

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initGoogleMap`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href.length > 1) {
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});
window.addEventListener('error', function(e) {
    if (e.target.tagName === 'IFRAME' && e.target.closest('.map-section__map')) {
        const mapContainer = e.target.closest('.map-section__map');
        if (mapContainer) {
            mapContainer.innerHTML = `
				<div style="display: flex; align-items: center; justify-content: center; height: 100%; padding: 20px; text-align: center; color: var(--color-text-light);">
					<div>
						<p style="margin-bottom: 10px;">Карта временно недоступна</p>
						<p style="font-size: 14px;">Адрес: 298690, Россия, Крым, г. Ялта, пгт Форос, Форосский спуск, 1</p>
						<p style="font-size: 14px; margin-top: 10px;">Координаты: 44.3901° N, 33.7890° E</p>
					</div>
				</div>
			`;
        }
    }
}, true);

document.addEventListener('languageChanged', () => {
    document.querySelectorAll('.faq-item__trigger').forEach(trigger => {
        const questionEl = trigger.querySelector('.faq-item__question');
        if (questionEl && questionEl.dataset.i18n) {
            const key = questionEl.dataset.i18n + 'Trigger';
            trigger.setAttribute('aria-label', I18n.t(key));
        }
    });
});

