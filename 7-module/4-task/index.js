import createElement from "../../assets/lib/create-element.js";

export default class StepSlider {
  elem = null;
  config = {};

  constructor({ steps, value = 0 }) {
    this.config.steps = steps;
    this.config.value = value;

    this.elem = createElement(this.#template());

    this.elem.addEventListener("pointerdown", this.#pointerDown);


  }
   #pointerDown = (event) => {
     let thumb = this.elem.querySelector('.slider__thumb');
     thumb.ondragstart = () => false;

     document.addEventListener('pointermove', this.pointerMove);
     document.addEventListener('pointerup', this.pointerUp);
     //все что ниже до конца функции это логика по отображению прогресса при нажатии без перетаскивания ползунка
     let left = event.clientX - this.elem.getBoundingClientRect().left;
     let leftRelative = left / this.elem.offsetWidth;
     let segments = this.config.steps - 1;
     let approximateValue = leftRelative * segments;
     this.config.value = Math.round(approximateValue);
     let valuePercents = this.config.value / segments * 100;
     console.log("значение в процентах для отображенеия позиции ползунка " + valuePercents);

     // let thumb = this.elem.querySelector('.slider__thumb');
     let progress = this.elem.querySelector('.slider__progress');

     let leftPercents = valuePercents; // Значение в процентах от 0 до 100

     thumb.style.left = `${leftPercents}%`;
     progress.style.width = `${leftPercents}%`;

     this.elem.querySelector('.slider__value').textContent = this.config.value;

     let spans = document.querySelectorAll('.slider__steps span');
     let arrayLinks = Array.from(spans);
     for (let i in arrayLinks){
       arrayLinks[i].classList.remove('slider__step-active');
     }
     arrayLinks[this.config.value].classList.add('slider__step-active');
   }

   pointerUp = (event) => {
    this.elem.classList.remove('slider_dragging');

      document.removeEventListener('pointermove', this.pointerMove);
      document.pointerUp = null;

     let myEvent = new CustomEvent('slider-change', { // имя события должно быть именно 'slider-change'
       detail: this.config.value, // значение 0, 1, 2, 3, 4
       bubbles: true // событие всплывает - это понадобится в дальнейшем
     });
     this.elem.dispatchEvent(myEvent);
    };

  pointerMove = (event) => {
    this.elem.classList.add('slider_dragging');

    let left = event.clientX - this.elem.getBoundingClientRect().left;
    let leftRelative = left / this.elem.offsetWidth;

    if (leftRelative < 0) {
      leftRelative = 0;
    }
    if (leftRelative > 1) {
      leftRelative = 1;
    }

    let leftPercents = leftRelative * 100;

    let thumb = this.elem.querySelector('.slider__thumb');
    let progress = this.elem.querySelector('.slider__progress');

    thumb.style.left = `${leftPercents}%`;
    progress.style.width = `${leftPercents}%`;

    let segments = this.config.steps - 1;
    let approximateValue = leftRelative * segments;

    this.config.value = Math.round(approximateValue);
    console.log(this.config.value);

    this.elem.querySelector('.slider__value').textContent = this.config.value;

    let spans = document.querySelectorAll('.slider__steps span');
    let arrayLinks = Array.from(spans);
    for (let i in arrayLinks){
      arrayLinks[i].classList.remove('slider__step-active');
    }
    arrayLinks[this.config.value].classList.add('slider__step-active');

  };


  #template(){
    return (`<div class="slider">
<!--Ползунок слайдера с активным значением-->
    <div class="slider__thumb" style="left: 50%;">
      <span class="slider__value"></span>
    </div>

    <!--Заполненная часть слайдера-->
    <div class="slider__progress" style="width: 50%;"></div>

    <!--Шаги слайдера-->
    <div class="slider__steps">
    <span class="slider__step-active"></span>
       ${this.#spanCreate(this.config.steps - 1)}


    </div>
  </div>`);
  }

  #spanCreate(num){
    let str = "";
    while(num > 0){str += "<span></span>";
      num--;
    }
    return(str);
  }




}
