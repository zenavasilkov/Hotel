const ACTIVITY_CATEGORIES = {
    ru: {
        sea: 'Морские прогулки',
        fishing: 'Рыбалка',
        extreme: 'Экстрим'
    },
    en: {
        sea: 'Sea Trips',
        fishing: 'Fishing',
        extreme: 'Extreme'
    }
};

const AVAILABILITY_STATUS = {
    ru: {
        available: 'Доступно',
        unavailable: 'Временно недоступно'
    },
    en: {
        available: 'Available',
        unavailable: 'Temporarily unavailable'
    }
};

async function initActivityDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const activityId = urlParams.get('id');

    if (!activityId) {
        window.location.href = 'active-recreation.html';
        return;
    }

    try {
        const activity = await FetchAPI.get(`${API_ENDPOINTS.ACTIVITIES}/${activityId}`);

        if (!activity) throw new Error('Activity not found');

        const lang = I18n.currentLang;

        const activityName = lang === 'ru' ? activity.name : activity.nameEn;
        document.title = `${activityName} - Santorini Hotel`;

        const heroImg = document.getElementById('activity-hero-img');
        heroImg.src = activity.image;
        heroImg.alt = activityName;

        document.getElementById('activity-title').textContent = activityName;
        document.getElementById('activity-desc').textContent = lang === 'ru'
            ? activity.description
            : activity.descriptionEn;

        document.getElementById('activity-duration').textContent = activity.duration;
        document.getElementById('activity-price').textContent = activity.price;

        const categoryKey = activity.category;
        document.getElementById('activity-cat').textContent =
            ACTIVITY_CATEGORIES[lang][categoryKey] || categoryKey;

        const statusKey = activity.available ? 'available' : 'unavailable';
        document.getElementById('activity-status').textContent =
            AVAILABILITY_STATUS[lang][statusKey];

        document.addEventListener('languageChanged', () => {
            initActivityDetail();
        });

    } catch (error) {
        console.error('Error:', error);
        window.location.replace('404.html');
    }
}

document.addEventListener('DOMContentLoaded', initActivityDetail);
