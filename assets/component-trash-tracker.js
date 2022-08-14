
customElements.define('trash-count',
    class trashTracker extends HTMLElement {
        constructor() {
            super();
            this.trashUrl = 'https://us-central1-trash-tracker-49de1.cloudfunctions.net'

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

        async connectedCallback() {
            const count = await this.render();

            this.innerHTML = count;
        }

        async render() {
            const count = this.getTrashCount('count') ?? this.storeTrashCount('count', await this.trashFetch('getTrashCount'), 86400000);

            return count;
        }
    }
)