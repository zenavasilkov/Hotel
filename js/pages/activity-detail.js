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

        document.title = `${activity.name} - Santorini Hotel`;

        document.getElementById('activity-hero-img').src = activity.image;
        document.getElementById('activity-hero-img').alt = activity.name;

        document.getElementById('activity-title').textContent = activity.name;
        document.getElementById('activity-desc').textContent = activity.description;

        document.getElementById('activity-duration').textContent = activity.duration;
        document.getElementById('activity-price').textContent = activity.price;
        document.getElementById('activity-cat').textContent = activity.category;
        document.getElementById('activity-status').textContent = activity.available ? 'Доступно' : 'Временно недоступно';

    } catch (error) {
        console.error('Error:', error);
        window.location.replace('404.html');
    }
}

document.addEventListener('DOMContentLoaded', initActivityDetail);
