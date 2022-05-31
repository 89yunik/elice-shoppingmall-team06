import * as Api from '/api.js';
// 메인페이지 최신상품 목록--------------------
async function getItems(){
	let items = await Api.get('/api/productlist')
  const list = document.querySelector(".list-wrap")
  for(let i=0; i<6; i++){
    const text = `
    <li class="item" id="${items[i]._id}">
      <a href="/product/detail/${items[i]._id}" class="item-wrap">
        <div class="item-img">
          <img src="https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/happy-and-cheerful-dog-playing-fetch-with-toy-bone-royalty-free-image-1590068781.jpg?crop=0.668xw:1.00xh;0,0&resize=640:*" alt="">
        </div>
        <div class="item-text">
          <p class="name">${items[i].name}</p>
          <p class="price">${items[i].price}원</p>
          <p class="description">${items[i].descriptionSummary}</p>
        </div>
      </a>
    </li>`
    list.innerHTML=list.innerHTML+text;
  };
  getCategories()
}
getItems()

// 상품목록 아이콘------------------------
let categoryList = [];

//HTML Display
function displayIcons(categories, type){
	const category = document.querySelector('.category > .wrap');
	if(type){
		category.innerHTML = categories.filter(val=>val.type === type).map(parseToHTML).join('');
	}
	else category.innerHTML = categories.map(parseToHTML2).join('');

}

// innerHTML
function parseToHTML2(category) {
  return `
    <li><a href="/product/list/${category._id}">${category.name}</a></li>
  `
}

async function getCategories(){
  let categories = await Api.get('/api/categorylist')
  categories.forEach(category => categoryList.push(category));
  displayIcons(categories);
}

// let imgSection = document.querySelector(".img-section")





// // 아래는 현재 home.html 페이지에서 쓰이는 코드는 아닙니다.
// // 다만, 앞으로 ~.js 파일을 작성할 때 아래의 코드 구조를 참조할 수 있도록,
// // 코드 예시를 남겨 두었습니다.

// import * as Api from '/api.js';
// import { randomId, logout } from '/useful-functions.js';

// // 요소(element), input 혹은 상수
// const landingDiv = document.querySelector('#landingDiv');
// const greetingDiv = document.querySelector('#greetingDiv');
// const logoutBtn = document.querySelector('.logout-btn');

// addAllElements();
// addAllEvents();

// // html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
// async function addAllElements() {
//   insertTextToLanding();
//   insertTextToGreeting();
// }

// // 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
// function addAllEvents() {
//   landingDiv.addEventListener('click', alertLandingText);
//   greetingDiv.addEventListener('click', alertGreetingText);
//   logoutBtn.addEventListener('click', logout);
// }

// function insertTextToLanding() {
//   landingDiv.insertAdjacentHTML(
//     'beforeend',
//     `
//       <h2>n팀 쇼핑몰의 랜딩 페이지입니다. 자바스크립트 파일에서 삽입되었습니다.</h2>
//     `,
//   );
// }

// function insertTextToGreeting() {
//   greetingDiv.insertAdjacentHTML(
//     'beforeend',
//     `
//       <h1>반갑습니다! 자바스크립트 파일에서 삽입되었습니다.</h1>
//     `,
//   );
// }

// function alertLandingText() {
//   alert('n팀 쇼핑몰입니다. 안녕하세요.');
// }

// function alertGreetingText() {
//   alert('n팀 쇼핑몰에 오신 것을 환영합니다');
// }

// async function getDataFromApi() {
//   // 예시 URI입니다. 현재 주어진 프로젝트 코드에는 없는 URI입니다.
//   const data = await Api.get('/api/user/data');
//   const random = randomId();

//   console.log({ data });
//   console.log({ random });
// }