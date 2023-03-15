import createElement from '../../assets/lib/create-element.js';
import escapeHtml from '../../assets/lib/escape-html.js';

import Modal from '../../7-module/2-task/index.js';

export default class Cart {
  cartItems = []; // [product: {...}, count: N]

  constructor(cartIcon) {
    this.cartIcon = cartIcon;

    this.addEventListeners();
  }
  addProduct(product) {

    if (!product) { return; }
    let isPresent = false;
    const newCartItem = { 'product': product, 'count': 1 };

    if (this.cartItems.length === 0) {
      this.cartItems.push(newCartItem);
    } else {

      this.cartItems.forEach(cartItem => {

        if (product.id === cartItem.product.id) {
          ++cartItem.count;
          isPresent = true;
        }
      });
      if (!isPresent) {
        this.cartItems.push(newCartItem);
      }

    }

    this.onProductUpdate(newCartItem);
  }


  updateProductCount(productId, amount) {

    for (let i = 0; i < this.cartItems.length; i++) {

      if (productId === this.cartItems[i].product.id) {
        this.cartItems[i].count = this.cartItems[i].count + amount;
      }

      // this.onProductUpdate(this.cartItems[i]);

      const tmp = this.cartItems[i];

      if (this.cartItems[i].count === 0) {

        this.cartItems.splice(i, 1);
      }

      this.onProductUpdate(tmp);
    }
  }


  isEmpty() {
    if (this.cartItems.length !== 0) {
      return false;
    } else {
      return true;
    }
  }


  getTotalCount() {
    let result = 0;
    this.cartItems.forEach(cartItem => {
      result = result + cartItem.count;
    });
    return result;
  }


  getTotalPrice() {
    let result = 0;
    this.cartItems.forEach(cartItem => {
      result = result + cartItem.product.price * cartItem.count;
    });
    return result;
  }


  renderProduct(product, count) {
    return createElement(`
    <div class="cart-product" data-product-id="${product.id}">
      <div class="cart-product__img">
        <img src="/assets/images/products/${product.image}" alt="product">
      </div>
      <div class="cart-product__info">
        <div class="cart-product__title">${escapeHtml(product.name)}</div>
        <div class="cart-product__price-wrap">
          <div class="cart-counter">
            <button type="button" class="cart-counter__button cart-counter__button_minus">
              <img src="/assets/images/icons/square-minus-icon.svg" alt="minus">
            </button>
            <span class="cart-counter__count">${count}</span>
            <button type="button" class="cart-counter__button cart-counter__button_plus">
              <img src="/assets/images/icons/square-plus-icon.svg" alt="plus">
            </button>
          </div>
          <div class="cart-product__price">€${(product.price * count).toFixed(2)}</div>
        </div>
      </div>
    </div>`);
  }

  renderOrderForm() {
    return createElement(`<form class="cart-form">
      <h5 class="cart-form__title">Delivery</h5>
      <div class="cart-form__group cart-form__group_row">
        <input name="name" type="text" class="cart-form__input" placeholder="Name" required value="Santa Claus">
        <input name="email" type="email" class="cart-form__input" placeholder="Email" required value="john@gmail.com">
        <input name="tel" type="tel" class="cart-form__input" placeholder="Phone" required value="+1234567">
      </div>
      <div class="cart-form__group">
        <input name="address" type="text" class="cart-form__input" placeholder="Address" required value="North, Lapland, Snow Home">
      </div>
      <div class="cart-buttons">
        <div class="cart-buttons__buttons btn-group">
          <div class="cart-buttons__info">
            <span class="cart-buttons__info-text">total</span>
            <span class="cart-buttons__info-price">€${this.getTotalPrice().toFixed(2)}</span>
            <button type="submit" id="myStyleFofbuttonSubmite" class="cart-buttons__button btn-group__button button">order</button>
          </div>
<!--          <button type="submit" class="cart-buttons__button btn-group__button button">order</button> перенес кнопку внутрь div-->
        </div>
      </div>
    </form>`);
  }

  renderModal() {
    this._modal = new Modal();
    this._modal.setTitle('Your order');
    this._modalBody = document.createElement('div');

    this.cartItems.forEach(cartItem => {

      this._modalBody.append(this.renderProduct(cartItem.product, cartItem.count));
    });


    this._modalBody.append(this.renderOrderForm());
    this._modal.setBody(this._modalBody);
    this._modal.open();


    const cardCounetrButtons = this._modalBody.querySelectorAll('.cart-counter__button');

    cardCounetrButtons.forEach(cardCounetrButton => {
      cardCounetrButton.addEventListener('click', this._onClickCartCounter);
    });

    // this._modalBody.querySelector('.cart-form').onsubmit = this.onSubmit;
    this._modalBody.querySelector('.cart-form').addEventListener('submit', this.onSubmit);
  }

  _onClickCartCounter = (e) => {
    const productId = e.target.closest('.cart-product').dataset.productId;
    let count;
    if (e.target.closest('.cart-counter__button').classList.contains('cart-counter__button_plus')) {
      count = 1;
    }

    if (e.target.closest('.cart-counter__button').classList.contains('cart-counter__button_minus')) {
      count = -1;
    }

    this.updateProductCount(productId, count);

  }


  onProductUpdate(cartItem) {

    this.cartIcon.update(this);

    if (!document.body.classList.contains('is-modal-open')) {
      return;
    }

    if (this.isEmpty()) {
      this._modal.close();
    }

    let productCount = this._modalBody.querySelector(`[data-product-id="${cartItem.product.id}"] .cart-counter__count`);
    let productPrice = this._modalBody.querySelector(`[data-product-id="${cartItem.product.id}"] .cart-product__price`);
    let infoPrice = this._modalBody.querySelector(`.cart-buttons__info-price`);

    productCount.innerHTML = cartItem.count;

    if (cartItem.count === 0) {
      this._modalBody.querySelector(`[data-product-id="${cartItem.product.id}"] `).remove();
    }

    productPrice.innerHTML = `€${(cartItem.count * cartItem.product.price).toFixed(2)}`;

    infoPrice.innerHTML = `€${this.getTotalPrice().toFixed(2)}`;

  }

  onSubmit = (event) => {

    event.preventDefault();

    const formData = new FormData(this._modalBody.querySelector('.cart-form'));

    this._modalBody.querySelector('[type="submit"]').classList.add('is-loading');

    fetch('https://httpbin.org/post', {
      method: 'POST',
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          this.cartItems = [];
          this.cartIcon.update(this);
          this._modal.setTitle('Success!');
          const div = createElement(`
          <div class="modal__body-inner">
            <p>
              Order successful! Your order is being cooked :) <br>
              We’ll notify you about delivery time shortly.<br>
              <img src="/assets/images/delivery.gif">
            </p>
          </div>
          `);
          this._modal.setBody(div);
        }

      });


  };

  addEventListeners() {
    this.cartIcon.elem.onclick = () => this.renderModal();
  }


}

