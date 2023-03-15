import Carousel from '../../6-module/3-task/index.js';
import slides from '../../6-module/3-task/slides.js';

import RibbonMenu from '../../7-module/1-task/index.js';
import categories from '../../7-module/1-task/categories.js';

import StepSlider from '../../7-module/4-task/index.js';
import ProductsGrid from '../../8-module/2-task/index.js';

import CartIcon from '../../8-module/1-task/index.js';
import Cart from '../../8-module/4-task/index.js';

export default class Main {

  constructor() {
  }

  async render() {
    // ... ваш код
    try {
      this.carousel = new Carousel(slides);//возможно нужно писать this.carousel!?
      let carouselHolder = document.body.querySelector('[data-carousel-holder]');
      carouselHolder.append(this.carousel.elem);

      this.ribbonMenu = new RibbonMenu(categories);
      let ribbonHolder = document.body.querySelector('[data-ribbon-holder]');
      ribbonHolder.append(this.ribbonMenu.elem);

      this.stepSlider = new StepSlider({
        steps: 5,
        value: 3,
      });
      let stepSliderHolder = document.body.querySelector('[data-slider-holder]');
      stepSliderHolder.append(this.stepSlider.elem);

      let cartIcon = new CartIcon();
      let cartIconHolder = document.body.querySelector('[data-cart-icon-holder]');
      cartIconHolder.append(cartIcon.elem);

      this.cart = new Cart(cartIcon);

      const response = await fetch('products.json');
      this.products = await response.json();

      this.productGrid = new ProductsGrid(this.products);
      let productGridHolder = document.body.querySelector('[data-products-grid-holder]');
      productGridHolder.innerHTML = '';
      productGridHolder.append(this.productGrid.elem);

      console.log("this.stepSlider.value-> " + this.stepSlider.value);
      console.log("this.ribbonMenu.categories[0].id-> " + this.ribbonMenu.categories[0].id);

      this.productGrid.updateFilter({
        noNuts: document.getElementById('nuts-checkbox').checked,
        vegeterianOnly: document.getElementById('vegeterian-checkbox').checked,
        maxSpiciness: this.stepSlider.value,
        category: this.ribbonMenu.categories[0].id
      });
      document.body.addEventListener('product-add', this.onProductAdd);
      document.body.addEventListener('slider-change', this.onSliderChange);
      document.body.addEventListener('ribbon-select', this.onRibbonSelect);
      document.querySelector('#nuts-checkbox').addEventListener('change', this.onNutCheckboxChange);
      document.querySelector('#vegeterian-checkbox').addEventListener('change', this.onVegetarianCheckboxChange);



    } catch (error) {
      console.log("Error was found");
    }
  }

  onProductAdd = (e) => {
    this.products.forEach(product => {
      if (product.id === e.detail) {
        console.log(e.detail);
        this.cart.addProduct(product);
      }
    });
  }
  onSliderChange = (e) => {
    this.productGrid.updateFilter({
      maxSpiciness: e.detail // значение остроты из события 'slider-change'
    });
  }
  onRibbonSelect = (e) => {
    this.productGrid.updateFilter({
      category: e.detail // категория из события 'ribbon-select'
    });
  }
  onNutCheckboxChange = (e) => {
    this.productGrid.updateFilter({
      noNuts: e.target.checked // новое значение чекбокса
    });
  }
  onVegetarianCheckboxChange = (e) => {
    this.productGrid.updateFilter({
      vegeterianOnly: e.target.checked // новое значение чекбокса
    });
  }

}
