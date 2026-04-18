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
        const lang = I18n.currentLang;

        list.forEach(item => {
            const activityName = lang === 'ru' ? item.name : item.nameEn;

            const html = `
                <article class="activity-card">
                    <img src="${item.image}" alt="${activityName}" class="activity-card__img" loading="lazy">
                    <div class="activity-card__overlay">
                        <h3 class="activity-card__title">${activityName}</h3>
                        <a href="activity-detail.html?id=${item.id}" class="activity-card__btn" aria-label="${I18n.t('moreAbout')} ${activityName}">
                            <svg width="20" height="20" fill="white"><use href="assets/icons/sprite.svg#arrow-right"></use></svg>
                        </a>
                    </div>
                </article>
            `;
            container.insertAdjacentHTML('beforeend', html);
        });
    }

    function updateTabsText() {
        tabs.forEach(tab => {
            const category = tab.dataset.category;
            let text = '';

            switch(category) {
                case 'all':
                    text = I18n.t('tabAll');
                    break;
                case 'sea':
                    text = I18n.t('tabSea');
                    break;
                case 'fishing':
                    text = I18n.t('tabFishing');
                    break;
                case 'extreme':
                    text = I18n.t('tabExtreme');
                    break;
            }

            if (!tab.dataset.originalText) {
                tab.dataset.originalText = tab.textContent;
            }

            tab.textContent = text;
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

    document.addEventListener('languageChanged', () => {
        updateTabsText();
        const activeTab = document.querySelector('.tabs__btn.active');
        if (activeTab) {
            const category = activeTab.dataset.category;
            const filtered = category === 'all'
                ? allActivities
                : allActivities.filter(a => a.category === category);
            renderActivities(filtered);
        }
    });
});
