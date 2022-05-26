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
}
function passwordToggleEvent(e) {
  passwordInput.disabled = !e.target.checked;
  passwordConfirmInput.disabled = !e.target.checked;
}
function addressToggleEvent(e) {
  postalCodeInput.disabled = !e.target.checked;
  address1Input.disabled = !e.target.checked;
  address2Input.disabled = !e.target.checked;
}
function phoneNumberToggleEvent(e) {
  phoneNumberInput.disabled = !e.target.checked;
}
