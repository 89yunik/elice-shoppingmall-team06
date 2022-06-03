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
const addKeywordButton = document.getElementById('addKeywordButton');
const submitButton = document.getElementById('submitButton');
const registerProductForm = document.getElementById('registerProductForm');

const searchKeywordArr = [];
addAllElements();
addAllEvents();

async function addAllElements() {
  getCategoryData();
}

function categoaryTemplate(data) {
  return `
  <option value="${data._id}" class="notification is-primary is-light">
    ${data.name}
  </option>
  `;
}

async function getCategoryData() {
  const categoryData = await Api.get('/api/categorylist');
  categorySelectBox.insertAdjacentHTML('beforeend', categoryData.map((item) => categoaryTemplate(item)).join(''));
}

function addAllEvents() {
  registerProductForm.onsubmit = submitButtonEvent;
  addKeywordButton.addEventListener('click', addKeywordButtonEvent);
  searchKeywordInput.addEventListener('keyup', searchKeywordInputEvent);
}

function searchKeywordInputEvent(e) {
  e.preventDefault();
  if (e.key === 'enter') {
    addKeywordButton.click();
  }
}

function addKeywordButtonEvent(e) {
  e.preventDefault();
  searchKeywordArr.push(searchKeywordInput.value);
  searchKeywordInput.value = '';

  keywordsRender();
}

function keywordsRender() {
  keywordContainer.innerHTML = searchKeywordArr.map((item, i) => keywordsTemplate(item, i)).join('');

  keywordContainer.addEventListener('click', isDeleteEvent);
}

function keywordsTemplate(data, i) {
  return `
    <div class="control" id="aoreow">
      <div class="tags has-addons">
        <span class="tag is-link is-light">${data}</span>
        <a class="tag is-link is-light is-delete" data-i =${i}></a>
      </div>
    </div>
  `;
}

function isDeleteEvent(e) {
  e.preventDefault();
  const targetIndex = e.target.closest('.is-delete').dataset.i;

  searchKeywordArr.splice(targetIndex, 1);

  keywordsRender();
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

  const image = imageInput.files[0];

  const formData = new FormData();
  formData.append('image', image);
  formData.append('name', titleInput.value);
  formData.append('brand', manufacturerInput.value);
  formData.append('category', categorySelectBox.value);
  formData.append('descriptionSummary', shortDescriptionInput.value);
  formData.append('descriptionDetail', detailDescriptionInput.value);
  formData.append('stock', inventoryInput.value);
  formData.append('price', priceInput.value);
  formData.append('keywords', searchKeywordArr);

  try {
    const res = await Api.postForm('/api/productregister', formData);
    alert('성공적으로 등록되었습니다.');
    location.href = '/admin/product/add/';
  } catch (error) {
    console.log(error);
  }
}
