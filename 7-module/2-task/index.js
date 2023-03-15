import createElement from '../../assets/lib/create-element.js';

export default class Modal {
  elem = null;

  constructor() {
    this.elem = createElement(this.#template());

    // this.elem.querySelector('.modal__close').addEventListener('click', this.close);
    this.elem.querySelector(".modal__close").addEventListener('click', this.close);
    document.addEventListener('keydown', this.closeEscPush);
  }
  open = () => {
    document.body.append(this.elem);
    document.body.classList.add("is-modal-open");
  }
  setTitle = (modal_title) => {
    this.elem.querySelector('.modal__title').textContent = modal_title;
  }
  setBody = (node) => {
    // '<div>Тело модального окна</div>'
    this.elem.querySelector('.modal__body').firstChild.remove();
    this.elem.querySelector('.modal__body').append(node);
  }

  close = () => {
    this.elem.remove();
    document.body.classList.remove('is-modal-open');
  }
  closeEscPush = (event) => {
    if(event.code === 'Escape'){
      this.elem.remove();
      document.body.classList.remove('is-modal-open');
    }
  }
  #template(){
    return `<div class="modal">
    <!--Прозрачная подложка перекрывающая интерфейс-->
    <div class="modal__overlay"></div>

    <div class="modal__inner">
      <div class="modal__header">
        <!--Кнопка закрытия модального окна-->
        <button type="button" class="modal__close">
          <img src="/assets/images/icons/cross-icon.svg" alt="close-icon" />
        </button>

        <h3 class="modal__title">

        </h3>
      </div>

      <div class="modal__body">
<!--        A сюда нужно добавлять содержимое тела модального окна-->
      </div>
    </div>

  </div>`;
    }
}
