import * as Api from '/api.js';
import { logout } from '/useful-functions.js';

const submitButton = document.getElementById('submitButton');
const modal = document.getElementById('modal');
const deleteCompleteButton = document.getElementById('deleteCompleteButton');
const deleteCancelButton = document.getElementById('deleteCancelButton');

const passwordInput = document.getElementById('passwordInput');

addAllElements();
addAllEvents();

async function addAllElements() {}

function addAllEvents() {
  submitButton.addEventListener('click', submitButtonEvent);
  deleteCancelButton.addEventListener('click', deleteCancelButtonEvent);
  deleteCompleteButton.addEventListener('click', deleteCompleteButtonEvent);
}

function deleteCompleteButtonEvent(e) {
  e.preventDefault();
  //something logic ex) api;
  const data = {
    currentPassword: passwordInput.value,
  };
  try {
    const res = Api.post('/api/user', data);
    // if(res)
    logout();
    location.href = '/';
  } catch (error) {
    console.log(error);
  }
}

function submitButtonEvent(e) {
  e.preventDefault();
  openModal(modal);
}
function deleteCancelButtonEvent(e) {
  e.preventDefault();
  closeModal(modal);
}

(document.querySelectorAll('[data-close]') || []).forEach(($close) => {
  const $target = $close.closest('.modal');

  $close.addEventListener('click', () => {
    closeModal($target);
  });
});

document.onkeydown = function (evt) {
  evt = evt;
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
