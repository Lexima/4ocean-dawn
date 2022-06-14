
customElements.define('trash-tracker',
    class trashTracker extends HTMLElement {
        constructor() {
            super();
            this.trashUrl = 'https://us-central1-trash-tracker-49de1.cloudfunctions.net'

            let template = document.getElementById('trash-tracker-template');
            let templateContent = template.content;

            const shadowRoot = this.attachShadow({ mode: 'open' });
            shadowRoot.appendChild(templateContent.cloneNode(true));
        }

        async trashFetch(endpoint) {
            return fetch(`${this.trashUrl}/${endpoint}`, {
                method: 'GET'
            })
                .then(res => res.json())
                .then(json => json.pounds)
                .then(number => number.toLocaleString("en-US"));
        }

        getTrashCount(key) {
            const itemStr = localStorage.getItem(key);

            if (!itemStr) {
                return null
            }

            const item = JSON.parse(itemStr)
            const now = new Date()
            if (now.getTime() > item.expiry) {
                localStorage.removeItem(key)
                return null
            }
            return item.value

        }

        storeTrashCount(key, value, ttl) {
            const now = new Date();

            const item = {
                value: value,
                expiry: now.getTime() + ttl
            }

            localStorage.setItem(key, JSON.stringify(item))

            return item.value;

        }

        connectedCallback() {
            this.render();
        }

        async render() {
            const count = this.getTrashCount('count') ?? this.storeTrashCount('count', await this.trashFetch('getTrashCount'), 86400000);
            const target = this.shadowRoot.querySelector('.trash-tracker__count');
            target.innerHTML = count;

        }
    }
)