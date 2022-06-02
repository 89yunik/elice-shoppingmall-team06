import * as Api from '/api.js';

const titleInput = document.getElementById('titleInput');
const descriptionInput = document.getElementById('descriptionInput');
const imageInput = document.getElementById('imageInput');
const addCategoryButton = document.getElementById('addCategoryButton');
const registerCategoryForm = document.getElementById('registerCategoryForm');

addAllElements();
addAllEvents();

async function addAllElements() {}

function addAllEvents() {
  // addCategoryButton.addEventListener('click', submitButtonEvent);
  registerCategoryForm.onsubmit = submitButtonEvent;
}

async function submitButtonEvent(e) {
  e.preventDefault();

  // const data = {
  //   name: titleInput.value,
  //   description: descriptionInput.value,
  //   imageUrl: 'http://test.com',
  // };
  const image = imageInput.files[0];

  const formData = new FormData();
  formData.append('image', image);
  formData.append('name', titleInput.value);
  formData.append('description', descriptionInput.value);

  try {
    const res = await Api.postForm('/api/categoryregister', formData);
    alert('성공적으로 등록되었습니다.');
    location.href = '/admin/category/';
  } catch (error) {
    console.log(error);
  }
}
