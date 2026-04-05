class Pagination {
    constructor(selector, options = {}) {
        this.container = document.querySelector(selector);
        if (!this.container) return;

        this.options = {
            itemsPerPage: 6,
            totalItems: 0,
            currentPage: 1,
            maxPagesToShow: 5,
            ...options
        };

        this.totalPages = Math.ceil(this.options.totalItems / this.options.itemsPerPage);
        this.onPageChange = options.onPageChange || (() => {});

        this.init();
    }

    init() {
        this.render();
        this.setupEventListeners();
    }

    render() {
        if (this.totalPages <= 1) {
            this.container.style.display = 'none';
            return;
        }

        this.container.style.display = 'flex';

        const prevBtn = this.container.querySelector('.pagination__btn--prev');
        const nextBtn = this.container.querySelector('.pagination__btn--next');
        const numbersContainer = this.container.querySelector('.pagination__numbers');

        if (prevBtn) {
            prevBtn.disabled = this.options.currentPage === 1;
        }

        if (nextBtn) {
            nextBtn.disabled = this.options.currentPage === this.totalPages;
        }

        if (numbersContainer) {
            numbersContainer.replaceChildren();

            const pages = this.getVisiblePages();

            pages.forEach(page => {
                if (page === '...') {
                    const ellipsis = document.createElement('span');
                    ellipsis.className = 'pagination__ellipsis';
                    ellipsis.textContent = '...';
                    numbersContainer.appendChild(ellipsis);
                } else {
                    const button = document.createElement('button');
                    button.className = `pagination__number${page === this.options.currentPage ? ' active' : ''}`;
                    button.textContent = page;
                    button.setAttribute('aria-label', `Страница ${page}`);
                    button.setAttribute('data-page', page);
                    numbersContainer.appendChild(button);
                }
            });
        }
    }

    getVisiblePages() {
        const pages = [];
        const maxPages = this.options.maxPagesToShow;
        let startPage = Math.max(1, this.options.currentPage - Math.floor(maxPages / 2));
        let endPage = Math.min(this.totalPages, startPage + maxPages - 1);

        if (endPage - startPage + 1 < maxPages) {
            startPage = Math.max(1, endPage - maxPages + 1);
        }

        if (startPage > 1) {
            pages.push(1);
            if (startPage > 2) {
                pages.push('...');
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        if (endPage < this.totalPages) {
            if (endPage < this.totalPages - 1) {
                pages.push('...');
            }
            pages.push(this.totalPages);
        }

        return pages;
    }

    setupEventListeners() {
        this.container.addEventListener('click', (e) => {
            const target = e.target;

            if (target.classList.contains('pagination__btn--prev')) {
                this.goToPage(this.options.currentPage - 1);
            } else if (target.classList.contains('pagination__btn--next')) {
                this.goToPage(this.options.currentPage + 1);
            } else if (target.classList.contains('pagination__number')) {
                const page = parseInt(target.getAttribute('data-page'));
                this.goToPage(page);
            }
        });
    }

    goToPage(page) {
        if (page < 1 || page > this.totalPages || page === this.options.currentPage) {
            return;
        }

        this.options.currentPage = page;
        this.render();
        this.onPageChange(page);
    }

    setTotalItems(total) {
        this.options.totalItems = total;
        this.totalPages = Math.ceil(total / this.options.itemsPerPage);
        this.options.currentPage = 1;
        this.render();
    }
}
