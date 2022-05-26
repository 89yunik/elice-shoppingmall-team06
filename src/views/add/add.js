import * as Api from '/api.js';

const titleInput = document.getElementById('titleInput');
const categorySelectBox = document.getElementById('categorySelectBox');
const manufacturerInput = document.getElementById('manufacturerInput');
const shortDescriptionInput = document.getElementById('shortDescriptionInput');
const detailDescriptionInput = document.getElementById('detailDescriptionInput');
const imageInput = document.getElementById('imageInput');
const inventoryInput = document.getElementById('inventoryInput');
const priceInput = document.getElementById('priceInput');
const searchKeywordInput = document.getElementById('searchKeywordInput');
const keywordContainer = document.getElementById('keywordContainer');
const submitButton = document.getElementById('submitButton');

addAllElements();
addAllEvents();

async function addAllElements() {}

function addAllEvents() {
  submitButton.addEventListener('click', submitButtonEvent);
}

function submitButtonEvent(e) {
  e.preventDefault();
  if (!titleInput.value) {
    titleInput.focus();
    return;
  }

  if (!categorySelectBox.value) {
    categorySelectBox.focus();
    return;
  }

  if (!manufacturerInput.value) {
    manufacturerInput.focus();
    return;
  }

  if (!shortDescriptionInput.value) {
    shortDescriptionInput.focus();
    return;
  }

  if (!inventoryInput.value) {
    inventoryInput.focus();
    return;
  }

  if (!priceInput.value) {
    priceInput.focus();
    return;
  }
  alert(priceInput.value);
}
