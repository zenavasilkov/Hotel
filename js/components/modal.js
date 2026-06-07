const Modal = {
    activeModals: [],
    videoPlayer: null,

    init() {
        this.setupEventListeners();
        this.setupTriggers();
    },

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.hasAttribute('data-modal-close')) {
                this.close(e.target.closest('.modal'));
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.activeModals.length > 0) {
                this.close(this.activeModals[this.activeModals.length - 1]);
            }
        });
    },

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

    open(modal) {
        if (!modal) return;

        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';

        const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length > 0) {
            focusableElements[0].focus();
        }

        this.activeModals.push(modal);

        if (modal.id === 'video-modal') {
            this.setupVideoPlayer(modal);
        }

        console.log('Modal opened:', modal.id);
    },

    setupVideoPlayer(modal) {
        const videoContainer = modal.querySelector('#video-player');
        if (!videoContainer) return;

        this.videoPlayer = document.createElement('video');
        this.videoPlayer.src = 'assets/videos/yacht.mp4';
        this.videoPlayer.controls = true;
        this.videoPlayer.autoplay = true;
        this.videoPlayer.style.width = '100%';
        this.videoPlayer.style.height = '100%';
        this.videoPlayer.style.objectFit = 'contain';
        this.videoPlayer.setAttribute('playsinline', '');
        this.videoPlayer.setAttribute('webkit-playsinline', '');

        videoContainer.innerHTML = '';
        videoContainer.appendChild(this.videoPlayer);

        this.videoPlayer.play().catch(error => {
            console.log('Autoplay prevented:', error);
        });
    },

    close(modal) {
        if (!modal) return;

        if (modal.id === 'video-modal' && this.videoPlayer) {
            this.videoPlayer.pause();
            this.videoPlayer.src = '';
            this.videoPlayer.load();
            this.videoPlayer = null;
        }

        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');

        const index = this.activeModals.indexOf(modal);
        if (index > -1) {
            this.activeModals.splice(index, 1);
        }

        if (this.activeModals.length === 0) {
            document.body.style.overflow = '';
        }

        const trigger = document.querySelector(`[data-modal-trigger="${modal.id}"]`);
        if (trigger) {
            trigger.focus();
        }
    },

    closeAll() {
        [...this.activeModals].forEach(modal => this.close(modal));
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Modal;
}
