import * as Api from '/api.js';

// url id 분리
const url = window.location.href;
const urlSplit = url.split('/');
const urlId = urlSplit[urlSplit.length - 2];

//fetch 받아오기
async function getItems() {
  let item = await Api.get(`/api/product/${urlId}`);
  let cate = await Api.get(`/api/categorylist`);

  const categoryName = document.querySelector('.category');
  let cateName = '';
  cate.forEach((category) => {
    if (category._id === item.category) {
      cateName = category.name;
      categoryName.innerHTML = `${cateName}`;
    }
  });
  parseToHTML(item);
  return;
}
getItems();

//데이터 -> HTML 변환
function parseToHTML(item) {
  const title = document.querySelector('.title');
  const price = document.querySelector('.price');
  const description = document.querySelector('.description');
  const detailImg = document.querySelector('.detail-image > .wrap');

  title.innerHTML = `${item.name}`;
  price.innerHTML = `${item.price}원`;
  description.innerHTML = `${item.descriptionDetail}`;
  detailImg.innerHTML = `<img src="${item.imageUrl}" alt="">`;

  const productInfo = {
    _id: `${item._id}`,
    name: `${item.name}`,
    price: `${item.price}`,
    quantity: 1,
    imageUrl: `${item.imageUrl}`,
  };

  //장바구니 추가
  const cartBtn = document.querySelector('.add-to-cart');

  async function addToCart(e) {
    e.preventDefault();

    const sessionArr = JSON.parse(sessionStorage.getItem('cart')) || [];
    const getCart = sessionStorage.getItem('cart') || [];
    let parseCart = [];
    if (getCart.length !== 0) {
      parseCart = JSON.parse(getCart);
    }

    const nameArr = JSON.parse(sessionStorage.getItem('name')) || [];
    const getName = sessionStorage.getItem('name');
    let parseName = [];
    if (getName) {
      let parseName = JSON.parse(getName);
    }

    const orderArr = JSON.parse(sessionStorage.getItem('order')) || [];

    if (parseCart !== null) {
      for (let i = 0; i < parseName.length; i++) {
        sessionArr.push(parseCart[i]);
        nameArr.push(parseName[i]);
        orderArr.push(parseCart[i]['_id']);
      }
    }

    // object 형태의 객체는 indexof가 먹히지 않아 stringify로 변환해줌
    let SAmap = nameArr.map(JSON.stringify);

    if (SAmap.indexOf(JSON.stringify(productInfo._id)) >= 0) {
      alert('해당 제품이 장바구니에 있습니다.');
    } else {
      sessionArr.push(productInfo);
      nameArr.push(productInfo._id);
      orderArr.push(productInfo._id);
      let parseCartNum = Number(parseCart.length);
      parseCartNum++;
      let cartQuantity = document.querySelectorAll('#navbar .cart-quantity');
      let cartQuantityM = document.querySelectorAll('#navbar-m .cart-quantity');
      cartQuantity.forEach((i) => {
        i.innerText = parseCartNum;
      });
      cartQuantityM.forEach((i) => {
        i.innerText = parseCartNum;
      });
      alert('장바구니에 추가되었습니다.');
    }
    sessionStorage.setItem('cart', JSON.stringify(sessionArr));
    sessionStorage.setItem('name', JSON.stringify(nameArr));
    sessionStorage.setItem('order', JSON.stringify(orderArr));
  }
  cartBtn.addEventListener('click', addToCart);
}

// 바로 구매하기
let quickBtn = document.querySelector('.quick-buy');

function loginCheck() {
  if (!sessionStorage.getItem('token')) {
    alert('로그인이 필요합니다');
    sessionStorage.setItem('lastUrl', window.location.href);
    return '/login';
  }
  return '/order/order.html';
}

async function quickBuy(e) {
  e.preventDefault();
  let item = await Api.get(`/api/product/${urlId}`);
  const myUrl = loginCheck();
  if (myUrl === 'login') {
    location.href = `${myUrl}`;
  } else {
    location.href = `${myUrl}` + `?id=${item._id}&quantity=1`;
  }
}

quickBtn.addEventListener('click', quickBuy);
