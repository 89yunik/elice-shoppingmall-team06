import * as Api from '/api.js';

const submitButton = document.getElementById('submitButton');
const modal = document.getElementById('modal');
const deleteCompleteButton = document.getElementById('deleteCompleteButton');
const deleteCancelButton = document.getElementById('deleteCancelButton');

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

  location.href = '/';
}

function submitButtonEvent(e) {
  e.preventDefault();
  openModal(modal);
}
function deleteCancelButtonEvent(e) {
  e.preventDefault();
  closeModal(modal);
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
