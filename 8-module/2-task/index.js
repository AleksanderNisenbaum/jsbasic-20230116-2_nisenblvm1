import createElement from '../../assets/lib/create-element.js';
import ProductCard from '../../6-module/2-task/index.js';

export default class ProductGrid {

  _newFilters = {
    category: ''
  };
  constructor(products) {
    this.products = products;
    this.filters = {};




    let productsContainer = `
      <div class="products-grid">
        <div class="products-grid__inner">
        </div>
      </div>
    `;

    this._container = createElement(productsContainer);

    // products.forEach(product => {
    //   card = new ProductCard(product);
    //   this.elem.querySelector('.products-grid__inner').append(card.elem);

    // });

    this.updateFilter(this.filters);


  }



  updateFilter(filters) {

    // this._newFilters.noNuts = (typeof (filters.noNuts) !== 'undefined') ? filters.noNuts : this._newFilters.noNuts;
    // this._newFilters.vegeterianOnly = (typeof (filters.vegeterianOnly) !== 'undefined') ? filters.vegeterianOnly : this._newFilters.vegeterianOnly;
    // this._newFilters.maxSpiciness = (typeof (filters.maxSpiciness) !== 'undefined') ? filters.maxSpiciness : this._newFilters.maxSpiciness;
    // this._newFilters.category = (typeof (filters.category) !== 'undefined') ? filters.category : this._newFilters.category;

    this._newFilters = Object.assign(this._newFilters, filters);

    this._newFilters.category = (typeof (this._newFilters.category) === 'undefined') ? '' : this._newFilters.category;


    this.elem.querySelector('.products-grid__inner').innerHTML = '';
    let card;
    this.products.forEach(product => {

      if (this._newFilters.noNuts && product.nuts) {
        return;
      }

      if (this._newFilters.vegeterianOnly && !product.vegeterian) {
        return;
      }

      if (product.spiciness > this._newFilters.maxSpiciness ) {
        return;
      }

      if ((this._newFilters.category !== "") && (product.category !== this._newFilters.category)) {
        return;
      }

      card = new ProductCard(product);
      this.elem.querySelector('.products-grid__inner').append(card.elem);

    });

  }

  get elem() {
    return this._container;
  }


}
