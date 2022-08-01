import './index.css';
import Card from '../components/Card.js';
import FormValidator from '../components/FormValidator.js';
import Section from '../components/Section.js';
import Popup from '../components/Popup.js';
import UserInfo from '../components/UserInfo.js';
import PopupWithForm from '../components/PopupWithForm.js';
import PicturePopup from '../components/PicturePopup.js';
import Api from '../components/Api.js';
import PopupConfirmation from '../components/PopupConfirmation.js';

// const initialCards = [
//   {
//     name: 'Архыз',
//     link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/arkhyz.jpg',
//     alt: 'Фото Архыз'
//   },
//   {
//     name: 'Челябинская область',
//     link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/chelyabinsk-oblast.jpg',
//     alt: 'Фото Челябинская область'
//   },
//   {
//     name: 'Иваново',
//     link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/ivanovo.jpg',
//     alt: 'Фото Иваново'
//   },
//   {
//     name: 'Камчатка',
//     link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/kamchatka.jpg',
//     alt: 'Фото Камчатка'
//   },
//   {
//     name: 'Холмогорский район',
//     link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/kholmogorsky-rayon.jpg',
//     alt: 'Фото Холмогорский район'
//   },
//   {
//     name: 'Байкал',
//     link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/baikal.jpg',
//     alt: 'Фото Байкал'
//   }
// ];


// const element = document.querySelector('.elements');
const popups = document.querySelectorAll('.popup');

//for edit button
const buttonEdit = document.querySelector('.profile__edit-button');
const popupEdit = document.querySelector('.popup_edit');
// const formEdit = popupEdit.querySelector('.form_edit');
const nameInput = popupEdit.querySelector('.form__input_value_name');
const occupationInput = popupEdit.querySelector('.form__input_value_occupation');
// const nameValue = document.querySelector('.profile__name');
// const occupationValue = document.querySelector('.profile__occupation');

//for add button
const buttonAdd = document.querySelector('.profile__add-button');
const popupAdd = document.querySelector('.popup_add');
// const formAdd = popupAdd.querySelector('.form_add');
// const titleInput = popupAdd.querySelector('.form__input_value_title');
// const linkInput = popupAdd.querySelector('.form__input_value_image-link');
// const titleValue = document.querySelector('.element__title');
// const linkValue = document.querySelector('.element__picture');
// const buttonSave = popupAdd.querySelector('.popup__button_add');

//button to save changes in profile data
const buttonSaveProfile = popupEdit.querySelector('.popup__button_edit');

//change avatar
const popupAvatar = document.querySelector('.popup_avatar');
const buttonAvatarChange = document.querySelector ('.profile__image-cropper');
const buttonSaveAvatar = popupAvatar.querySelector('.popup__button_avatar');
// const formAvatar = document.querySelector ('.form_avatar');

// //card container
// const template = '.template';

const api = new Api({
  url: 'https://mesto.nomoreparties.co/v1/cohort-42',
  headers: {
    authorization: 'f25ee209-d794-409d-8eae-29ba78e4618b',
    'Content-Type': 'application/json'
  }
});


Promise.all([api.getUserInfo(), api.getInitialCards()])
  .then(([user, cards]) => {
    userInfo.setUserInfo({
      name: user.name,
      occupation: user.about,
      avatar: user.avatar
    });
    userInfo.setUserID(user._id);
    // render cards
    cardList.renderItems(cards.reverse());
  })
  .catch((err) => {
    console.log(`Невозможно загрузить информацию с сервера ${err}`);
  });



  const createCard = (cardsData) => {
    const dataUserId = userInfo.getUserID();
    const newCard = new Card('.template', cardsData.name, cardsData.link, cardsData.alt, cardsData.likes, cardsData._id, dataUserId, cardsData.owner._id, () => picturePopup.open(cardsData), () => {
      popupConfirm.open(cardsData);
      popupConfirm.setAction(() => {
        api.deleteCard(cardsData._id)
            .then(() => {
              newCard.removeCard();
              popupConfirm.close();
            })
            .catch((err) => {
              console.log(`Невозможно удалить карточку ${err}`);
            });
      })
    },

    () => {
      if (!newCard.getIsLike()) {
        api.addLikeCard(cardsData._id)
          .then((res) => {
            newCard.handleLike(res);
          })
          .catch((error) => {
            console.log(`Ошибка проставления лайка ${error}`);
          });
      } else {
        api.deleteLikeCard(cardsData._id)
          .then((res) => {
            newCard.handleLike(res);
          })
          .catch((error) => {
            console.log(`Ошибка удаления лайка ${error}`);
          });
      }

    });
    const cardsElement = newCard.getView();
    return cardsElement;
  }

// User info
const userInfo = new UserInfo({
  nameSelector: '.profile__name',
  occupationSelector: '.profile__occupation',
  avatarSelector: '.profile__image'
});


// // Load profile from the server
// const getServerUserInfo = api.getUserInfo()
//   .then((userData) => {
//     userInfo.setUserInfo(userData)
//   })
//   .catch((err) => {
//     console.log(`Ошибка загрузки информации о пользователе с сервера ${err}`)
//   });

const cardList = new Section({
  renderer: (item) => {
    cardList.addItem(createCard(item));
  }
}, '.elements');

//edit profile/submit form
const submitFormEditHandler = (profileData) => {
  api.editProfile(profileData)
    .then((response) => {
      userInfo.setUserInfo(profileData);
      buttonSaveProfile.textContent = 'Сохранение...';
      popupEdit.close();
    })
    .catch((error) => {
      console.log(`Ошибка редактирования профиля ${error}`)
    })

};

// add a new picture card
const submitAddCardForm = (inputData) => {
  // buttonAdd.textContent = 'Создание...';
  api.addCard(inputData)
    .then((res) => {
      cardList.addItem(createCard(res, userInfo._id))
      addPicturePopup.close();
    })
    .catch((err) => {
      console.log(`Невозможно добавить карточку ${err}`);
    })
}

// submit form to change avatar
// function submitAvatarForm (inputValues) {
//   buttonAvatarChange.textContent = 'Сохранение...'
//   api.patchAvatar(inputValues.url)
//       .then((res) => {
//           userInfo.setUserInfo ({
//               name: res.name,
//               occupation: res.about,
//               avatar: res.avatar,
//           });
//           popupAvatar.close();
//       })
//       .catch((err) => {
//           console.log(`Невозможно загрузить аватар на сервер ${err}`);
//       })
//       .finally(() => {
//         buttonAvatarChange.textContent = 'Сохранить';
//       });
// }
debugger
const submitAvatarForm = (newAvatar) => {

  api.patchAvatar(newAvatar)
    .then((response) => {
      console.log('response', response);
      
      userInfo.setUserInfo({
        // nameSelector: response.name,
        // occupationSelector: response.about,
        // avatarSelector: response.avatar,
        // newNameSelector: response.name,
        // newOccupationSelector: response.about,
        // newAvatarSelector: response.avatar
        name: response.name,
        occupation: response.about,
        avatar: response.avatar
      });
      // buttonSaveAvatar.textContent = 'Сохранение...';
      popupAvatarUpdate.close();
    })
    .catch((error) => {
      console.log(`Ошибка обновления аватара ${error}`);
    })
    .finally(() => {
      buttonSaveAvatar.textContent = 'Сохранить';
    });
};

function addLikeToCard(card) {
  if (!card.getIsLike()) {
    api.handleLike(card.id)
      .then((res) => {
        card.likeCard(res)
      })
      .catch((err) => {
        console.log(`Невозможно поставить лайк карточке ${err}`);
      });
  } else {
    api.deleteLikeCard(card.id)
      .then((res) => {
        card.likeCard(res)
      })
      .catch((err) => {
        console.log(`Невозможно убрать лайк у карточки ${err}`);
      });
  }

}


// each popup gets its own sample from PopupWithForm
const picturePopup = new PicturePopup('.popup_pic');
const addPicturePopup = new PopupWithForm('.popup_add', submitAddCardForm);
const editProfilePopup = new PopupWithForm('.popup_edit', submitFormEditHandler);
const popupConfirm = new PopupConfirmation('.popup_confirm');
const popupAvatarUpdate = new PopupWithForm ('.popup_avatar', submitAvatarForm);



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
const formAvatarValidator = new FormValidator(enableValidation, popupAvatar);


formEditValidator.enableValidation();
formAddValidator.enableValidation();
formAvatarValidator.enableValidation();


// EventListeners
picturePopup.setEventListeners();
addPicturePopup.setEventListeners();
editProfilePopup.setEventListeners();
popupConfirm.setEventListeners();
popupAvatarUpdate.setEventListeners()

buttonAdd.addEventListener('click', () => {
  formAddValidator.resetValidation();
  addPicturePopup.open();
});

buttonEdit.addEventListener('click', () => {
  const updatedUserInfo = userInfo.getUserInfo();
  // fill out form with user's data
  nameInput.value = updatedUserInfo.name;
  occupationInput.value = updatedUserInfo.about;
  formEditValidator.resetValidation();
  editProfilePopup.open();
});


buttonAvatarChange.addEventListener ('click', function() {
  formAvatarValidator.resetValidation();
  popupAvatarUpdate.open();
});