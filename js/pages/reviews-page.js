let allReviews = [];
let currentPage = 1;
const reviewsPerPage = 6;

const reviewsContainer = document.getElementById('reviews-container');
const loadMoreBtn = document.getElementById('load-more');
let paginationContainer = null;

async function initReviews() {
    try {
        allReviews = await FetchAPI.get(API_ENDPOINTS.REVIEWS);

        if (!paginationContainer) {
            paginationContainer = document.createElement('div');
            paginationContainer.className = 'pagination';
            loadMoreBtn.parentNode.replaceChild(paginationContainer, loadMoreBtn);
        }

        renderReviews();
        renderPagination();

        document.addEventListener('languageChanged', () => {
            currentPage = 1;
            renderReviews();
            renderPagination();
        });

    } catch (error) {
        console.error('Ошибка при загрузке отзывов:', error);
    }
}

function renderReviews() {
    const startIndex = (currentPage - 1) * reviewsPerPage;
    const endIndex = startIndex + reviewsPerPage;
    const currentReviews = allReviews.slice(startIndex, endIndex);

    reviewsContainer.innerHTML = '';

    if (currentReviews.length === 0) {
        reviewsContainer.innerHTML = '<p class="no-reviews">Отзывов пока нет</p>';
        return;
    }

    currentReviews.forEach(review => {
        const card = createReviewCard(review);
        reviewsContainer.appendChild(card);
    });

    document.querySelector('.feedbacks').scrollIntoView({ behavior: 'smooth' });
}

function renderPagination() {
    const totalPages = Math.ceil(allReviews.length / reviewsPerPage);

    paginationContainer.innerHTML = '';

    if (totalPages <= 1) return;

    const prevBtn = createPaginationButton('‹', currentPage - 1, currentPage === 1);
    paginationContainer.appendChild(prevBtn);

    for (let i = 1; i <= totalPages; i++) {
        const pageBtn = createPaginationButton(i.toString(), i, i === currentPage);
        paginationContainer.appendChild(pageBtn);
    }

    const nextBtn = createPaginationButton('›', currentPage + 1, currentPage === totalPages);
    paginationContainer.appendChild(nextBtn);
}

function createPaginationButton(text, pageNum, isDisabled) {
    const btn = document.createElement('button');
    btn.className = 'pagination-btn';
    btn.textContent = text;

    if (isDisabled) {
        btn.classList.add('disabled');
        btn.disabled = true;
    } else {
        btn.addEventListener('click', () => {
            currentPage = pageNum;
            renderReviews();
            renderPagination();
        });
    }

    return btn;
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
