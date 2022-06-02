import * as Api from '/api.js';
// 메인페이지 최신상품 목록--------------------
async function getItems() {
  let items = await Api.get('/api/productlist');
  let itemsReverse = items.reverse();
  const list = document.querySelector('.list-wrap');
  getCategories();
  for (let i = 0; i < 6; i++) {
    const text = `
    <li class="item" id="${itemsReverse[i]._id}">
      <a href="/product/detail/${itemsReverse[i]._id}" class="item-wrap">
        <div class="item-img">
          <img src="${itemsReverse[i].imageUrl}" alt="">
        </div>
        <div class="item-text">
          <p class="name">${itemsReverse[i].name}</p>
          <p class="price">${itemsReverse[i].price}원</p>
          <p class="description">${itemsReverse[i].descriptionSummary}</p>
        </div>
      </a>
    </li>`;
    list.innerHTML = list.innerHTML + text;
  }
}
getItems();

// 상품목록 아이콘------------------------
let categoryList = [];

//HTML Display
function displayIcons(categories, type) {
  const category = document.querySelector('.category-list > .wrap');
  if (type) {
    category.innerHTML = categories
      .filter((val) => val.type === type)
      .map(parseToHTML)
      .join('');
  } else category.innerHTML = categories.map(parseToHTML2).join('');
}

// innerHTML
function parseToHTML2(category) {
  return `
    <li>
      <a href="/product/list/${category._id}">
        <img src="${category.imageUrl}" alt="">
        <p>${category.name}</p>
      </a>
    </li>
  `;
}

async function getCategories() {
  let categories = await Api.get('/api/categorylist');
  categories.forEach((category) => categoryList.push(category));
  displayIcons(categories);
}
