const AMENITIES_MAP = {
    ru: {
        wifi: 'Бесплатный Wi-Fi',
        tv: 'Smart TV',
        ac: 'Кондиционер',
        minibar: 'Мини-бар',
        balcony: 'Балкон',
        seaView: 'Вид на море',
        jacuzzi: 'Джакузи',
        kitchen: 'Кухня',
        butler: 'Услуги батлера'
    },
    en: {
        wifi: 'Free Wi-Fi',
        tv: 'Smart TV',
        ac: 'Air Conditioning',
        minibar: 'Mini-bar',
        balcony: 'Balcony',
        seaView: 'Sea View',
        jacuzzi: 'Jacuzzi',
        kitchen: 'Kitchen',
        butler: 'Butler Service'
    }
};

async function initRoomDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const roomId = urlParams.get('id');

    if (!roomId) {
        window.location.replace('rooms.html');
        return;
    }

    try {
        const room = await FetchAPI.get(`${API_ENDPOINTS.ROOMS}/${roomId}`);

        if (!room) {
            window.location.replace('404.html');
            return;
        }

        const roomName = I18n.currentLang === 'ru' ? room.name : room.nameEn;
        document.title = `${roomName} - Santorini`;

        document.getElementById('room-name').textContent = roomName;

        document.getElementById('room-price').textContent = room.price.toLocaleString();

        document.getElementById('room-area').textContent = room.area;
        document.getElementById('room-guests').textContent = room.guests;

        const bedsText = I18n.currentLang === 'ru'
            ? (room.beds === 1 ? '1 большая кровать' : `${room.beds} раздельные кровати`)
            : (room.beds === 1 ? '1 king bed' : `${room.beds} separate beds`);
        document.getElementById('room-beds').textContent = bedsText;

        document.getElementById('room-desc').textContent = I18n.currentLang === 'ru'
            ? room.description
            : room.descriptionEn;

        const imagesContainer = document.getElementById('room-images');
        imagesContainer.innerHTML = room.images.map(img => `
            <img src="${img}" alt="${roomName}" class="room-gallery__img" loading="lazy">
        `).join('');

        const amenitiesContainer = document.getElementById('room-amenities');
        const lang = I18n.currentLang;
        amenitiesContainer.innerHTML = room.amenities.map(key => `
            <div class="amenity-item">
                <svg class="amenity-icon"><use href="assets/icons/sprite.svg#check"></use></svg>
                <span>${AMENITIES_MAP[lang][key] || key}</span>
            </div>
        `).join('');

        document.addEventListener('languageChanged', () => {
            initRoomDetail();
        });

    } catch (error) {
        console.error('Error loading room:', error);
        window.location.replace('404.html');
    }
}

document.addEventListener('DOMContentLoaded', initRoomDetail);
