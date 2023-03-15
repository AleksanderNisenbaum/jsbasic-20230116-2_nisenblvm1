import createElement from '../../assets/lib/create-element.js';

export default class Carousel {
  elem = null;
  #slides = [];


  constructor(slides) {
    this.#slides = slides;


    // this.#render();
    this.elem = createElement(this.#template());

    this.count = 0;

    this.maxCountToLeft = (this.#slides.length - 1);
    this.btnRight = this.elem.querySelector('.carousel__arrow_right');
    this.btnLeft = this.elem.querySelector('.carousel__arrow_left');
    this.btnLeft.style.display = 'none';


    this.elem.addEventListener('click', this.#moveCarousel);

    this.elem.addEventListener('click', this.#onClick);
  }


  #onClick = (event) => {
    if(event.target.closest('.carousel__button')){
      let slide = event.target.closest('.carousel__button')
        .closest('.carousel__caption')
        .closest('.carousel__slide').dataset;

      console.log(slide.id);

      let myEvent = new CustomEvent("product-add", {
        detail: slide.id, // Уникальный идентификатора товара из объекта товара
        bubbles: true
      });
      this.elem.dispatchEvent(myEvent);
      // document.querySelector('.carousel').dispatchEvent(myEvent);
    }

  }

  #moveCarousel = (event) => {
    let offsetWidth = this.elem.querySelector('.carousel__inner').offsetWidth;

    if (event.target === this.btnRight || event.target.closest('.carousel__arrow_right')) {

      console.log(this.elem.querySelector('.carousel__inner').offsetWidth);

      this.elem.querySelector('.carousel__inner').style.transform = `translateX(${this.count = this.count - offsetWidth}px)`;
      if(this.count === (-offsetWidth * this.maxCountToLeft)){this.btnRight.style.display = 'none'}
      else{
        this.btnRight.style.display = '';
        this.btnLeft.style.display = '';
      }

    } else if (event.target === this.btnLeft || event.target.closest('.carousel__arrow_left')) {

      this.elem.querySelector('.carousel__inner').style.transform = `translateX(${this.count = this.count + offsetWidth}px)`;
      if(this.count === 0){this.btnLeft.style.display = 'none'}
      else{
        this.btnLeft.style.display = '';
        this.btnRight.style.display = '';
      }
    }
  }

  #template(){
    return`<div class="carousel">
    <!--Кнопки переключения-->
    <div class="carousel__arrow carousel__arrow_right">
      <img src="/assets/images/icons/angle-icon.svg" alt="icon">
    </div>
    <div class="carousel__arrow carousel__arrow_left">
      <img src="/assets/images/icons/angle-left-icon.svg" alt="icon">
    </div>

    <div class="carousel__inner">

     ${this.#slides.map(slide =>
        `<div class="carousel__slide" data-id=${slide.id}>
        <img src="/assets/images/carousel/${slide.image}" class="carousel__img" alt="slide">
          <div class="carousel__caption">
            <span class="carousel__price">€${slide.price.toFixed(2)}</span>
            <div class="carousel__title">${slide.name}</div>
            <button type="button" class="carousel__button">
              <img src="/assets/images/icons/plus-icon.svg" alt="icon">
            </button>
          </div>
      </div>`).join('')}

      </div>
  </div>`;
  }
  // #render() {
  //   const wrapper = document.createElement('div');
  //   wrapper.innerHTML = this.#template();
  //   this.elem = wrapper.firstElementChild;
  // }

}
