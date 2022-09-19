class SubscriptionUpsell extends HTMLElement {
  constructor() {
    super();

    this.radio = this.querySelector("[name='subscriptionUpsellRadio']");
    this.subscriptionRadio = this.querySelector("#subscription");
    this.select = this.querySelector("[name='subscriptionUpsellOptions']");
    this.productForm = document.querySelector('form');

    document.addEventListener('submit', this.addSubscription);

    this.subscription = this.querySelector('#subscription').checked;

    this.select.addEventListener('change', (event) => {

      const dataset = event.target.options[event.target.selectedIndex].dataset;

      this.updateDisplayedValues(dataset);
      this.updateSellingPlans();

    });

    this.subscriptionRadio.addEventListener('change', this.toggleSelect.bind(this))

    this.options = this.querySelectorAll('.subscription-upsell__group');

    this.options.forEach((el) => {
      el.addEventListener('click', (e) => {
        this.checkRadio(e);
      })
    })

    this.addSellingPlans();

  }

  checkRadio(evt) {
    const x = evt.currentTarget;
    const radio = x.querySelector("[type='radio']")
    radio.checked = true;

    this.toggleSelect(evt);

  }

  toggleSelect(evt) {
    const select = this.querySelector('.selectGroup');
    if (evt.currentTarget.classList.contains('subscription')) {
      select.classList.remove('hide');
    } else {
      select.classList.add('hide');
    }
  }

  getSelectedSubscription(event) {

    const selectedOption = event.target.options[event.target.selectedIndex].dataset;


  }

  addSellingPlans() {
    const subscriptionOnly = this.querySelector('.subscription-upsell__group > input').dataset.type == 'subscriptionOnly';
    const select = this.querySelector("[name='subscriptionUpsellOptions']");
    const selectedOption = select.options[select.selectedIndex].dataset;

    const addToCartForms = document.querySelectorAll('product-form form');



    if (subscriptionOnly) {
      addToCartForms.forEach((el) => {
        const input = document.createElement('input');
        input.setAttribute('type', 'hidden');
        input.setAttribute('name', 'selling_plan');
        input.setAttribute('value', selectedOption.sellingPlanId);
        el.appendChild(input);

        const productId = el.querySelector("[name='id']");
        productId.value = selectedOption.productId;
      })
    }
  }

  updateSellingPlans() {

    const addToCartForms = document.querySelectorAll('product-form form');
    const subscriptionOnly = this.querySelector('.subscription-upsell__group > input').dataset.type == 'subscriptionOnly';

    const select = this.querySelector("[name='subscriptionUpsellOptions']");
    const selectedOption = select.options[select.selectedIndex].dataset;

    if (subscriptionOnly) {

      addToCartForms.forEach((el) => {
        const productId = el.querySelector("[name='id']");
        productId.value = selectedOption.productId;

        const sellingPlan = el.querySelector("[name='selling_plan']");
        sellingPlan.value = selectedOption.sellingPlanId;
      })


    }



  }

  addSubscription(evt) {
    const oneTimeChcked = this.querySelector('#onetime')?.checked;

    const select = this.querySelector("[name='subscriptionUpsellOptions']");
    const selectedOption = select.options[select.selectedIndex].dataset;

    const productId = document.querySelector("product-form [name='id'").value;

    const subscriptionOnly = this.querySelector('.subscription-upsell__group > input').dataset.type == 'subscriptionOnly';


    if (oneTimeChcked) return;

    const formData = {
      items: [
        {
          quantity: 1,
          id: selectedOption.productId,
          selling_plan: selectedOption.sellingPlanId,
          properties: {
            shipping_interval_frequency: selectedOption.interval,
            shipping_interval_unit_type: 'Month',
            subscription_charge_date: 15,
            subscription_payment_amount: selectedOption.price * selectedOption.interval
          }
        }

      ]
    }

    if (!subscriptionOnly) {
      formData.items.push(
        {
          id: productId
        }
      )
    }



    fetch('/cart/add.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)

    })
      .then(res => res.json())
      .then(console.log)
  }

  connectedCallback() {

    const select = this.querySelector("[name='subscriptionUpsellOptions']");

    const selectedOption = select.options[select.selectedIndex].dataset;

    this.updateDisplayedValues(selectedOption);

  }

  attributeChangedCallback() {

  }

  updateDisplayedValues(dataset) {

    const { discount, price, fullPrice, interval } = dataset;

    const subscriptionHeader = this.querySelector('.subscription h3 span');
    const discountedPrice = this.querySelector('.subscription-upsell__discounted-price');
    const fullPriceEl = this.querySelector('.subscription-upsell__full-price');
    const billingTerms = this.querySelector('.billingTerms');


    if (!discount) {
      subscriptionHeader.innerText = '';
      fullPriceEl.innerText = '';
    } else {
      subscriptionHeader.innerText = ` (Save ${parseInt(discount)}%)`;
      fullPriceEl.innerText = ` $${parseInt(fullPrice)}`;
    }

    billingTerms.innerText = `Billed as $${price * interval}` + ' every ' + (interval > 1 ? interval : '') + ' month' + (interval > 1 ? 's' : '');


    discountedPrice.innerText = `$${parseInt(price)}/mo`;


  }

}

customElements.define('subscription-upsell', SubscriptionUpsell);



