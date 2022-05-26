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

async function submitButtonEvent(e) {
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
  const data = {
    name: titleInput.value,
    company: manufacturerInput.value,
    descriptionSummary: shortDescriptionInput.value,
    descriptionDetail: detailDescriptionInput.value,
    imageUrl: 'https://test.com/', // 수정예정
    stock: inventoryInput.value,
    price: priceInput.value,
    keywords: ['test1', 'test2'],
  };

  try {
    const res = await Api.post('/api/productregister', data);
    alert('성공적으로 등록되었습니다.');
    location.href = '/account/add/';
  } catch (error) {
    console.log(error);
  }
}
