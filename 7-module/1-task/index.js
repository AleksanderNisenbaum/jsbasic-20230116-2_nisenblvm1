import createElement from '../../assets/lib/create-element.js';

export default class RibbonMenu {
  elem = null;
  categories = [];

  constructor(categories) {
    this.categories = categories;

    // this.#render();
    this.elem = createElement(this.#template());

    // document.querySelector('.container').addEventListener('click', this.#onClick);
    this.elem.addEventListener('click', this.#onClick);
    this.elem.querySelector('.ribbon__inner').addEventListener('click', this.#onClickLink);


    this.elem.querySelector('.ribbon__inner').firstElementChild.classList.add('ribbon__item_active');
  }
  #onClick = (event) => {

    let ribbonInner = document.querySelector('.ribbon__inner');

    let offsetWidth = ribbonInner.offsetWidth;
    console.log(offsetWidth);

    if(event.target.classList.contains("ribbon__arrow_left") || event.target.closest(".ribbon__arrow_left")) {
      ribbonInner.scrollBy(-350, 0);
    }
    if(event.target.classList.contains("ribbon__arrow_right") || event.target.closest(".ribbon__arrow_right")) {
      ribbonInner.scrollBy(350, 0);
    }

    // ribbonInner.scrollWidth - ribbonInner.scrollLeft - ribbonInner.clientWidth
    async function f() {
      let promise = new Promise((resolve, reject) => {
        setTimeout(() => resolve(ribbonInner.scrollLeft), 450);
      });
      let result = await promise;
      console.log("scrollLeft " + result);

      let promise1 = new Promise((resolve, reject) => {
        setTimeout(() => resolve(ribbonInner.scrollWidth - ribbonInner.scrollLeft - ribbonInner.clientWidth), 500);
      });
      let result1 = await promise1;
      console.log("scrollRight " + result1);

      let btnRight = document.querySelector('.ribbon__arrow_right');
      let btnLeft = document.querySelector('.ribbon__arrow_left');

      if(result1 === 0){btnRight.classList.remove('ribbon__arrow_visible');
        btnLeft.classList.add('ribbon__arrow_visible');
      }
      else if(result === 0){btnRight.classList.add('ribbon__arrow_visible');
        btnLeft.classList.remove('ribbon__arrow_visible');
      }
      else{btnRight.classList.add('ribbon__arrow_visible');
        btnLeft.classList.add('ribbon__arrow_visible');
      }
    }
    f();
  }
  #onClickLink = (event) => {

    if(event.target.classList.contains("ribbon__item")){
      // event.target.preventDefault();

      let links = document.querySelectorAll('.ribbon__item');
      let arrayLinks = Array.from(links);
      for (let i in arrayLinks) {
        console.log(arrayLinks[i]);
        if (arrayLinks[i].classList.contains('ribbon__item_active')) {
          arrayLinks[i].classList.remove('ribbon__item_active');

        }

      }
      event.target.classList.add('ribbon__item_active');

      let category = event.target.dataset;
      console.log("category.id-> " + category.id);
      let myEvent = new CustomEvent('ribbon-select', { // имя события должно быть именно 'ribbon-select'
        detail: category.id, // уникальный идентификатора категории из её объекта
        bubbles: true // это событие всплывает - это понадобится в дальнейшем
      });
      // document.querySelector('.ribbon').dispatchEvent(myEvent);
      this.elem.dispatchEvent(myEvent);


    }

  }

  #template(){
   return`<div class="ribbon">
    <!--Кнопка прокрутки влево-->
    <button class="ribbon__arrow ribbon__arrow_left">
      <img src="/assets/images/icons/angle-icon.svg" alt="icon">
    </button>
<!--Ссылки на категории-->
    <nav class="ribbon__inner">
    ${this.categories.map(categorie =>
     `<a href="#" class="ribbon__item" data-id=${categorie.id}>${categorie.name}</a>`).join('')}
    </nav>
<!--Кнопка прокрутки вправо-->
    <button class="ribbon__arrow ribbon__arrow_right ribbon__arrow_visible">
      <img src="/assets/images/icons/angle-icon.svg" alt="icon">
    </button>
  </div>`;
  }
  // #render() {
  //   const wrapper = document.createElement('div');
  //   wrapper.innerHTML = this.#template();
  //   this.elem = wrapper.firstElementChild;
  // }
}
