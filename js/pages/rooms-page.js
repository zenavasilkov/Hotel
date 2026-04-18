async function initRoomsCatalog() {
    const container = document.getElementById('rooms-catalog-container');
    if (!container) return;

    try {
        const rooms = await FetchAPI.get(API_ENDPOINTS.ROOMS);

        if (!rooms || rooms.length === 0) {
            container.innerHTML = `<p class="text-center">${I18n.t('noRoomsFound')}</p>`;
            return;
        }

        container.innerHTML = '';

        rooms.forEach((room, index) => {
            const imageSrc = (room.images && room.images.length > 0)
                ? room.images[0]
                : 'assets/images/placeholder.jpg';

            const roomName = I18n.currentLang === 'ru' ? room.name : room.nameEn;

            const balconyText = room.beds > 1
                ? I18n.t('terrace')
                : I18n.t('balcony');

            const roomCard = `
                <article class="room-card-alt">
                    <div class="room-card-alt__img">
                        <img src="${imageSrc}" alt="${roomName}" loading="lazy">
                    </div>
                    <div class="room-card-alt__body">
                        <h3 class="room-card-alt__title">${roomName.toUpperCase()}</h3>
                        <div class="room-card-alt__meta">
                            <span>${room.area} ${I18n.t('sqm')}</span>
                            <span>${room.guests} ${I18n.t('guests')}</span>
                            <span>${balconyText}</span>
                        </div>
                        <div class="room-card-alt__actions">
                            <a href="booking.html?roomId=${room.id}" class="btn btn--primary">${I18n.t('book')}</a>
                            <a href="room-detail.html?id=${room.id}" class="btn btn--outline">${I18n.t('details')}</a>
                        </div>
                    </div>
                </article>
            `;

            container.insertAdjacentHTML('beforeend', roomCard);

            if ((index + 1) % 2 === 0 && (index + 1) !== rooms.length) {
                const divider = `
                    <div class="rooms-grid__divider">
                        <span class="section__dot"></span>
                        <span class="section__dot"></span>
                        <span class="section__dot"></span>
                    </div>
                `;
                container.insertAdjacentHTML('beforeend', divider);
            }
        });

    } catch (error) {
        console.error('Критическая ошибка при загрузке номеров:', error);
        container.innerHTML = `<p class="text-center">${I18n.t('loadError')}</p>`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initRoomsCatalog();

    document.addEventListener('languageChanged', () => {
        initRoomsCatalog();
    });
});
