const AMENITIES_MAP = {
    wifi: 'Бесплатный Wi-Fi',
    tv: 'Smart TV',
    ac: 'Кондиционер',
    minibar: 'Мини-бар',
    balcony: 'Балкон',
    seaView: 'Вид на море',
    jacuzzi: 'Джакузи',
    kitchen: 'Кухня',
    butler: 'Услуги батлера'
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

        document.title = `${room.name} - Santorini`;
        document.getElementById('room-name').textContent = room.name;
        document.getElementById('room-price').textContent = room.price.toLocaleString();
        document.getElementById('room-area').textContent = room.area;
        document.getElementById('room-guests').textContent = room.guests;
        document.getElementById('room-beds').textContent = room.beds === 1 ? '1 большая кровать' : `${room.beds} раздельные кровати`;
        document.getElementById('room-desc').textContent = room.description;

        const imagesContainer = document.getElementById('room-images');
        imagesContainer.innerHTML = room.images.map(img => `
            <img src="${img}" alt="${room.name}" class="room-gallery__img">
        `).join('');

        const amenitiesContainer = document.getElementById('room-amenities');
        amenitiesContainer.innerHTML = room.amenities.map(key => `
            <div class="amenity-item">
                <svg class="amenity-icon"><use href="assets/icons/sprite.svg#check"></use></svg>
                <span>${AMENITIES_MAP[key] || key}</span>
            </div>
        `).join('');

    } catch (error) {
        console.error('Error loading room:', error);
        window.location.replace('404.html');
    }
}

document.addEventListener('DOMContentLoaded', initRoomDetail);
