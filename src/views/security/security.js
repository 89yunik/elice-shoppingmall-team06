import * as Api from '/api.js';
import { randomId, logout } from '/useful-functions.js';

const fullNameToggle = document.getElementById('fullNameToggle');
const passwordToggle = document.getElementById('passwordToggle');
const addressToggle = document.getElementById('addressToggle');
const phoneNumberToggle = document.getElementById('phoneNumberToggle');

const securityTitle = document.getElementById('securityTitle');
const fullNameInput = document.getElementById('fullNameInput');
const passwordInput = document.getElementById('passwordInput');
const passwordConfirmInput = document.getElementById('passwordConfirmInput');
const postalCodeInput = document.getElementById('postalCodeInput');
const address1Input = document.getElementById('address1Input');
const address2Input = document.getElementById('address2Input');
const phoneNumberInput = document.getElementById('phoneNumberInput');

const saveButton = document.getElementById('saveButton');
const modal = document.getElementById('modal');
const modalCloseButton = document.getElementById('modalCloseButton');
const saveCompleteButton = document.getElementById('saveCompleteButton');

addAllElements();
addAllEvents();

async function addAllElements() {
  getUserData();
}

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllEvents() {
  // switchToggle.addEventListener('click', toggleEvent);
  fullNameToggle.addEventListener('click', fullNameToggleEvent);
  passwordToggle.addEventListener('click', passwordToggleEvent);
  addressToggle.addEventListener('click', addressToggleEvent);
  phoneNumberToggle.addEventListener('click', phoneNumberToggleEvent);
  saveButton.addEventListener('click', saveButtonEvent);
  modalCloseButton.addEventListener('click', modalCloseButtonEvent);
  saveCompleteButton.addEventListener('click', saveCompleteButtonEvent);
}

async function getUserData() {
  const data = await Api.get('/api/user');

  securityTitle.innerHTML = `회원정보 관리 (${data.email})`;
  fullNameInput.value = `${data.fullName}`;

  if (data.address) {
    postalCodeInput.value = `${data.address.postalCode}`;
    address1Input.value = `${data.address.address1}`;
    address2Input.value = `${data.address.address2}`;
  }
  if (data.phoneNumber) {
    phoneNumberInput.value = `${data.phoneNumber}`;
  }
}

function fullNameToggleEvent(e) {
  fullNameInput.disabled = !e.target.checked;
  fullNameInput.focus();
}

function passwordToggleEvent(e) {
  passwordInput.disabled = !e.target.checked;
  passwordConfirmInput.disabled = !e.target.checked;
  passwordInput.focus();
}

function addressToggleEvent(e) {
  postalCodeInput.disabled = !e.target.checked;
  address1Input.disabled = !e.target.checked;
  address2Input.disabled = !e.target.checked;
  postalCodeInput.focus();
}

function phoneNumberToggleEvent(e) {
  phoneNumberInput.disabled = !e.target.checked;
  phoneNumberInput.focus();
}

function saveButtonEvent(e) {
  e.preventDefault();
  openModal(modal);
}
function modalCloseButtonEvent(e) {
  e.preventDefault();
  closeModal(modal);
}

function saveCompleteButtonEvent(e) {
  e.preventDefault();
  const isFullNameValid = fullNameInput.value.length >= 2;
  const isPasswordValid = passwordInput.value.length >= 4 || passwordInput.value.length === 0;
  const isPasswordSame = passwordInput.value === passwordConfirmInput.value;

  if (!isFullNameValid || !isPasswordValid) {
    closeModal(modal);
    return alert('이름은 2글자 이상, 비밀번호는 4글자 이상이어야 합니다.');
  }

  if (!isPasswordSame) {
    closeModal(modal);
    return alert('비밀번호가 일치하지 않습니다.');
  }

  const data = {
    fullName: fullNameInput.value,
    postalCode: postalCodeInput.value,
    address1: address1Input.value,
    address2: address2Input.value,
    phoneNumber: phoneNumberInput.value,
  };

  if (passwordInput.value.length !== 0) {
    data['password'] = passwordInput.value;
  }

  //todo: 수정 api 호출
  console.log(data);
}

(
  document.querySelectorAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button') || []
).forEach(($close) => {
  const $target = $close.closest('.modal');

  $close.addEventListener('click', () => {
    closeModal($target);
  });
});

document.onkeydown = function (evt) {
  evt = evt || window.event;
  if (evt.keyCode == 27) {
    closeModal(modal);
  }
};

function openModal($el) {
  $el.classList.add('is-active');
}

function closeModal($el) {
  $el.classList.remove('is-active');
}
