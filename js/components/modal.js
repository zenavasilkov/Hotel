/**
 * Modal Component
 */
const Modal = {
    activeModals: [],

    /**
     * Initialize modal system
     */
    init() {
        this.setupEventListeners();
        this.setupTriggers();
    },

    /**
     * Setup global event listeners
     */
    setupEventListeners() {
        // Close on overlay click
        document.addEventListener('click', (e) => {
            if (e.target.hasAttribute('data-modal-close')) {
                this.close(e.target.closest('.modal'));
            }
        });

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.activeModals.length > 0) {
                this.close(this.activeModals[this.activeModals.length - 1]);
            }
        });
    },

    /**
     * Setup modal triggers
     */
    setupTriggers() {
        document.querySelectorAll('[data-modal-trigger]').forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                const modalId = trigger.getAttribute('data-modal-trigger');
                const modal = document.getElementById(modalId);
                if (modal) {
                    this.open(modal);
                }
            });
        });
    },

    /**
     * Open modal
     * @param {HTMLElement} modal - Modal element
     */
    open(modal) {
        if (!modal) return;

        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';

        // Focus trap
        const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length > 0) {
            focusableElements[0].focus();
        }

        this.activeModals.push(modal);

        // Track for analytics
        console.log('Modal opened:', modal.id);
    },

    /**
     * Close modal
     * @param {HTMLElement} modal - Modal element
     */
    close(modal) {
        if (!modal) return;

        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');

        // Remove from active modals
        const index = this.activeModals.indexOf(modal);
        if (index > -1) {
            this.activeModals.splice(index, 1);
        }

        // Restore body scroll if no more modals
        if (this.activeModals.length === 0) {
            document.body.style.overflow = '';
        }

        // Return focus to trigger
        const trigger = document.querySelector(`[data-modal-trigger="${modal.id}"]`);
        if (trigger) {
            trigger.focus();
        }
    },

    /**
     * Close all modals
     */
    closeAll() {
        [...this.activeModals].forEach(modal => this.close(modal));
    }
};

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Modal;
}
