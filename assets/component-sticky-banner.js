class StickyBanner extends HTMLElement {
    constructor() {
        super();

        this.classList.add('hide');
        this.target = document.querySelector(this.dataset.intersectTarget)

    }
    connectedCallback() {
        this.onScrollHandler = this.onScroll.bind(this);
        window.addEventListener('scroll', this.onScrollHandler, false);
        this.createObserver();
    }

    createObserver() {
        let observer = new IntersectionObserver((entries, observer) => {
            const scrollTop = window.pageYOffset;

            this.isIntersecting = entries[0].isIntersecting;

        }, {
            threshold: 0.2
        });
        observer.observe(this.target);
    }

    onScroll() {
        const scrollTop = window.pageYOffset;
        if (scrollTop < 130 || this.isIntersecting) {
            requestAnimationFrame(this.hide.bind(this));
        } else if (!this.isIntersecting) {
            requestAnimationFrame(this.show.bind(this));
        }
    }

    hide() {
        this.classList.add('hide');
    }

    show() {
        this.classList.remove('hide');
    }
}

customElements.define('sticky-banner', StickyBanner);