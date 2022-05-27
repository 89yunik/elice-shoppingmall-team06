import * as Api from '/api.js';

const titleInput = document.getElementById('titleInput');
const descriptionInput = document.getElementById('descriptionInput');
const imageInput = document.getElementById('imageInput');
const addCategoryButton = document.getElementById('addCategoryButton');

addAllElements();
addAllEvents();

async function addAllElements() {}

function addAllEvents() {
  addCategoryButton.addEventListener('click', submitButtonEvent);
}

async function submitButtonEvent(e) {
  e.preventDefault();

  const data = {
    name: titleInput.value,
    description: descriptionInput.value,
    imageUrl: 'http://test.com',
  };

  try {
    const res = await Api.post('/api/categoryregister', data);
    alert('성공적으로 등록되었습니다.');
    location.href = '/category/add/';
  } catch (error) {
    console.log(error);
  }
}
