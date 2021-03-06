import Popup from "./Popup.js";

export default class PopupConfirmation extends Popup {
  constructor(popupSelector, submitForm) {
    super(popupSelector);
    this._submitForm = submitForm;
    this._form = this._popup.querySelector('.popup__content_confirm');
  }

  open(item) {
    super.open();
    this._element = item;
  }

  // setSubmitHanlder(callback) {
  //   this._submitForm = callback;
  // }

  setAction(action) {
    this._actionCallback = action;
  }

  setEventListeners() {
     super.setEventListeners();
    this._form.addEventListener('submit', (evt) => {
      evt.preventDefault();
      //this._submitForm();
      this._actionCallback();
    });
  }
};