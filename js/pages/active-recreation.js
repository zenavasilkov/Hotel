document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('activities-container');
    const tabs = document.querySelectorAll('.tabs__btn');

    let allActivities = [];

    try {
        allActivities = await FetchAPI.get(API_ENDPOINTS.ACTIVITIES);
        renderActivities(allActivities);
    } catch (error) {
        console.error('Ошибка загрузки активностей:', error);
    }

    function renderActivities(list) {
        container.innerHTML = '';
        list.forEach(item => {
            const html = `
                <article class="activity-card">
                    <img src="${item.image}" alt="${item.name}" class="activity-card__img">
                    <div class="activity-card__overlay">
                        <h3 class="activity-card__title">${item.name}</h3>
                        <a href="activity-detail.html?id=${item.id}" class="activity-card__btn">
                            <svg width="20" height="20" fill="white"><use href="assets/icons/sprite.svg#arrow-right"></use></svg>
                        </a>
                    </div>
                </article>
            `;
            container.insertAdjacentHTML('beforeend', html);
        });
    }

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const category = tab.dataset.category;
            const filtered = category === 'all'
                ? allActivities
                : allActivities.filter(a => a.category === category);

            renderActivities(filtered);
        });
    });
});
