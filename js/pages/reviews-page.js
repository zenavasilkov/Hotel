let allReviews = [];
let currentPage = 1;
const reviewsPerPage = 6;

const reviewsContainer = document.getElementById('reviews-container');
const loadMoreBtn = document.getElementById('load-more');

async function initReviews() {
    try {
        allReviews = await FetchAPI.get(API_ENDPOINTS.REVIEWS);
        renderReviews();

        loadMoreBtn.addEventListener('click', () => {
            currentPage++;
            renderReviews();
        });

        document.addEventListener('languageChanged', () => {
            currentPage = 1;
            renderReviews();
            updateLoadMoreText();
        });

    } catch (error) {
        console.error('Ошибка при загрузке отзывов:', error);
    }
}

function renderReviews() {
    const startIndex = (currentPage - 1) * reviewsPerPage;
    const endIndex = startIndex + reviewsPerPage;
    const currentReviews = allReviews.slice(0, endIndex);

    reviewsContainer.innerHTML = '';

    currentReviews.forEach(review => {
        const card = createReviewCard(review);
        reviewsContainer.appendChild(card);
    });

    if (endIndex >= allReviews.length) {
        loadMoreBtn.style.display = 'none';
    } else {
        loadMoreBtn.style.display = 'block';
        updateLoadMoreText();
    }
}

function updateLoadMoreText() {
    loadMoreBtn.textContent = I18n.t('loadMore');
}

function createReviewCard(data) {
    const div = document.createElement('article');
    div.className = 'review-card';

    let stars = '';
    for(let i = 0; i < 5; i++) {
        stars += i < data.rating ? '★' : '☆';
    }

    const lang = I18n.currentLang;

    div.innerHTML = `
        <div class="review-card__rating" aria-label="${I18n.t('rating')}: ${data.rating} ${I18n.t('outOf5')}">${stars}</div>
        <p class="review-card__text">${data.text}</p>
        <div class="review-card__avatar"></div>
        <div class="review-card__info">
            <span class="review-card__author">${data.author}</span>
            <span class="review-card__city">${data.city}</span>
        </div>
    `;
    return div;
}

document.addEventListener('DOMContentLoaded', initReviews);