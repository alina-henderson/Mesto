import './index.css';
import Card from '../components/Card.js';
import FormValidator from '../components/FormValidator.js';
import Section from '../components/Section.js';
import Popup from '../components/Popup.js';
import UserInfo from '../components/UserInfo.js';
import PopupWithForm from '../components/PopupWithForm.js';
import PicturePopup from '../components/PicturePopup.js';
import Api from '../components/Api';

const initialCards = [
  {
    name: 'Архыз',
    link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/arkhyz.jpg',
    alt: 'Фото Архыз'
  },
  {
    name: 'Челябинская область',
    link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/chelyabinsk-oblast.jpg',
    alt: 'Фото Челябинская область'
  },
  {
    name: 'Иваново',
    link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/ivanovo.jpg',
    alt: 'Фото Иваново'
  },
  {
    name: 'Камчатка',
    link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/kamchatka.jpg',
    alt: 'Фото Камчатка'
  },
  {
    name: 'Холмогорский район',
    link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/kholmogorsky-rayon.jpg',
    alt: 'Фото Холмогорский район'
  },
  {
    name: 'Байкал',
    link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/baikal.jpg',
    alt: 'Фото Байкал'
  }
];


// const element = document.querySelector('.elements');
const popups = document.querySelectorAll('.popup');

//for edit button
const buttonEdit = document.querySelector('.profile__edit-button');
const popupEdit = document.querySelector('.popup_edit');
const formEdit = popupEdit.querySelector('.form_edit');
const nameInput = popupEdit.querySelector('.form__input_value_name');
const occupationInput = popupEdit.querySelector('.form__input_value_occupation');
const nameValue = document.querySelector('.profile__name');
const occupationValue = document.querySelector('.profile__occupation');

//for add button
const buttonAdd = document.querySelector('.profile__add-button');
const popupAdd = document.querySelector('.popup_add');
const formAdd = popupAdd.querySelector('.form_add');
const titleInput = popupAdd.querySelector('.form__input_value_title');
const linkInput = popupAdd.querySelector('.form__input_value_image-link');
const titleValue = document.querySelector('.element__title');
const linkValue = document.querySelector('.element__picture');
const buttonSave = popupAdd.querySelector('.popup__button_add');



//card container
const template = '.template';

const api = new Api({
  url: 'https://mesto.nomoreparties.co/v1/cohort-42',
  headers: {
    authorization: 'f25ee209-d794-409d-8eae-29ba78e4618b',
    'Content-Type': 'application/json'
  }
});



// api.setUserInfo()
//   .then(data => {
//     const userInfo = new UserInfo(data)
//     userInfo.getUserInfo()
//   })
//   .catch(err => console.log(`Ошибка: ${err.status}`));



const createCard = (item) => {
  const newCard = new Card('.template', item.name, item.link, item.alt, () => picturePopup.open(item));
  const cardsElement = newCard.getView();
  return cardsElement;
}

const cardList = new Section({
  items: initialCards.reverse(),
  renderer: (item) => {
    cardList.addItem(createCard(item));
  }
}, '.elements');
cardList.renderItems(initialCards);

// add a new picture card
const submitAddCardForm = (data) => {
  cardList.addItem(createCard(data))
}

// User info
const userInfo = new UserInfo({
  nameSelector: '.profile__name',
  occupationSelector: '.profile__occupation',
  avatarSelector: '.profile__image'
});

// Load profile from the server
const getServerUserInfo = api.getUserInfo()
  .then((userData) => {
    console.log('then result', userData)
    userInfo.setUserInfo(userData)
  })
  .catch((err) => {
    console.log(`Ошибка загрузки информации о пользователе с сервера ${err}`)
  });
  console.log('const result', getServerUserInfo)


function submitFormEditHandler(data) {
  userInfo.setUserInfo(data); //insert data from setUserInfo
}

// each popup gets its own sample from PopupWithForm
const picturePopup = new PicturePopup('.popup_pic');
const addPicturePopup = new PopupWithForm('.popup_add', submitAddCardForm);
const editProfilePopup = new PopupWithForm('.popup_edit', submitFormEditHandler);


const enableValidation = ({
  formSelector: '.form',
  inputSelector: '.form__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'form__input_type_error',
  errorMessageClass: 'form__error_visible'
});

const formEditValidator = new FormValidator(enableValidation, popupEdit);
const formAddValidator = new FormValidator(enableValidation, popupAdd);
formEditValidator.enableValidation();
formAddValidator.enableValidation();


// EventListeners
picturePopup.setEventListeners()
addPicturePopup.setEventListeners()
editProfilePopup.setEventListeners()

buttonAdd.addEventListener('click', () => {
  formAddValidator.resetValidation();
  addPicturePopup.open();
});

buttonEdit.addEventListener('click', () => {
  const updatedUserInfo = userInfo.getUserInfo();
  // fill out form with user's data
  nameInput.value = updatedUserInfo.name;
  occupationInput.value = updatedUserInfo.occupation;
  formEditValidator.resetValidation();
  editProfilePopup.open();
});