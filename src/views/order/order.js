/*
[] total을 구할 때 상품의 가격이랑 수량을 곱해햐 하는데 수량은 api에 없어서 sessionStorage에서 값을 불러와야됨.
-> 계산하기 위해서 api와 sessionStorage를 둘 다 실행해야 하고 API에 저장하는 함수에 사용하기 위해서
    total을 전역변수로 사용해야 하는 문제
*/

import * as Api from '/api.js';
import { deleteNameStorageItem } from './../useful-functions.js';

const MAIN_PAGE_URL = 'http://localhost:5070';

document.querySelector('#searchAddressButton').addEventListener('click', findAddress);
document.querySelector('#checkoutButton').addEventListener('click', handleCheckoutButton);
document.querySelector('#subtitleCart').addEventListener('click', () => {
  window.location.href = '/cart';
});

// $(window).on('beforeunload', function () {
//   sessionStorage.removeItem('quick');
// });

function findAddress() {
  new daum.Postcode({
    oncomplete: function (data) {
      // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.

      // 각 주소의 노출 규칙에 따라 주소를 조합한다.
      // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
      var addr = ''; // 주소 변수
      var extraAddr = ''; // 참고항목 변수

      //사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
      if (data.userSelectedType === 'R') {
        // 사용자가 도로명 주소를 선택했을 경우
        addr = data.roadAddress;
      } else {
        // 사용자가 지번 주소를 선택했을 경우(J)
        addr = data.jibunAddress;
      }

      // 사용자가 선택한 주소가 도로명 타입일때 참고항목을 조합한다.
      if (data.userSelectedType === 'R') {
        // 법정동명이 있을 경우 추가한다. (법정리는 제외)
        // 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
        if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
          extraAddr += data.bname;
        }
        // 건물명이 있고, 공동주택일 경우 추가한다.
        if (data.buildingName !== '' && data.apartment === 'Y') {
          extraAddr += extraAddr !== '' ? ', ' + data.buildingName : data.buildingName;
        }
        // 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
        if (extraAddr !== '') {
          extraAddr = ' (' + extraAddr + ')';
        }
        console.log(extraAddr);
        // 조합된 참고항목을 해당 필드에 넣는다.
        // document.getElementById("sample6_extraAddress").value = extraAddr;
      } else {
        // document.getElementById("sample6_extraAddress").value = '';
      }
      const fullAdress = addr + extraAddr;
      // 우편번호와 주소 정보를 해당 필드에 넣는다.
      document.getElementById('postalCode').value = data.zonecode;
      document.getElementById('address1').value = fullAdress;
      // 커서를 상세주소 필드로 이동한다.
      document.getElementById('address2').focus();
    },
  }).open();
}

function loadName(fullName) {
  document.querySelector('#receiverName').value = fullName;
}

function clearSessionStorage() {
  const orderStorage = JSON.parse(sessionStorage.getItem('order'));
  let cartStorage = JSON.parse(sessionStorage.getItem('cart'));

  orderStorage.forEach((item) => {
    cartStorage = cartStorage.filter((element) => element._id !== item);
    deleteNameStorageItem(item);
  });
  console.log(orderStorage);
  sessionStorage.setItem('cart', JSON.stringify(cartStorage));

  // const iBought = checkWhatIBuy();

  sessionStorage.removeItem('order');

  // const check = checkWhatIBuy();
  // console.log((check));
}

async function handleCheckoutButton() {
  if (!document.querySelector('#receiverPhoneNumber').value) {
    return alert('전화번호를 입력해주세요.');
  }

  if (!document.querySelector('#postalCode').value) {
    return alert('우편번호를 입력해주세요.');
  }

  if (!document.querySelector('#address2').value) {
    return alert('상세주소를 입력해주세요.');
  }

  if (!document.querySelector('#address2').value) {
    return alert('상세주소를 입력해주세요.');
  }

  await makeApiOderRegisterData();

  clearSessionStorage();

  window.location.href = '/order/complete';
}

function checkWhatIBuy() {
  const checkedId = JSON.parse(sessionStorage.getItem('order'));
  const cartItems = JSON.parse(sessionStorage.getItem('cart'));
  let productsTitle = [];
  let productsTotal = 0;
  let result = [];
  // console.log(quickStorage);
  if (sessionStorage.getItem('quick') === null) {
    for (let i = 0; i < cartItems.length; i++) {
      checkedId.forEach((item) => {
        if (cartItems[i]._id === item) {
          // productsTitle.push(`${cartItems[i].name} / ${cartItems[i].quantity}개`);
          // productsTotal += cartItems[i].price * cartItems[i].quantity;
          result.push(cartItems[i]);
        }
      });
    }
  } else {
    result.push(JSON.parse(sessionStorage.getItem('quick')));
  }
  return result;
}

let totalPrice = 0;

function makeListOfProductTitle(orderList) {
  const whatIBuy = checkWhatIBuy();
  console.log(whatIBuy);

  orderList.forEach((item) => {
    let quantity;
    whatIBuy.map((ele) => {
      if (ele._id === item._id) quantity = ele.quantity;
    });

    console.log(quantity, item.price);
    document.querySelector('#productsTitle').innerHTML += `${item.name} / ${quantity} </br>`;
    totalPrice += item.price * quantity;
  });

  document.querySelector('#productsTotal').innerHTML = `${totalPrice}원`;
  document.querySelector('#orderTotal').innerHTML = parseInt(totalPrice) + 3000;

  console.log(totalPrice);
}

async function makeApiOderRegisterData() {
  const whatIBuy = checkWhatIBuy();
  const productList = [];

  whatIBuy.forEach((item) => {
    const product = {
      name: item.name,
      quantity: item.quantity,
    };
    productList.push(product);
  });
  console.log(productList);

  const userApi = await Api.get(`${MAIN_PAGE_URL}/api/user`);
  // const orderApi = await Api.get(`${MAIN_PAGE_URL}`/api/product/${orderIds[i]})
  console.log(userApi);
  const data = {
    userId: userApi._id,
    orderInfo: {
      product: productList,
      name: userApi.fullName,
      phoneNumber: document.querySelector('#receiverPhoneNumber').value,
      address1: document.querySelector('#address1').value,
      address2: document.querySelector('#address2').value,
      requests: document.querySelector('#requestSelectBox').value,
      total: totalPrice,
    },
    orderState: '상품 준비중',
  };
  console.log(data);
  try {
    const res = await Api.post('/api/orderregister', data);
  } catch (error) {
    console.log(error);
  }
}

function getUrlParameters() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const order = urlParams.getAll('id');
  return order;
}

async function checkItemsInApi(orderIds) {
  let productApi = [];
  for (let i = 0; i < orderIds.length; i++) {
    productApi.push(await Api.get(`${MAIN_PAGE_URL}/api/product/${orderIds[i]}`));
  }
  // orderIds.forEach( (id) => {
  //   productApi = await Api.get(`${MAIN_PAGE_URL}/api/product/${id}`);
  // });
  //async await는 forEach문 안에서 작동이 원활하게 되지 않는다.
  //forEach문에서 productApi를 저장하고 밖에서 출력하면 undefine가 나온다.

  return productApi;
}

//window.onload랑 함수를 만들어서 실행하는거랑 차이점이 뭐지?
// window.onload = () => {
//   const Ids = getUrlParameters();

//   console.log(checkItemsInApi(Ids));

//   Api.get(`${MAIN_PAGE_URL}/api/user`).then((result) => {
//     loadName(result.fullName);
//   });
//   // makeListOfProductTitle();
//   // checkWhatIBuy();
// };
async function App() {
  const Ids = getUrlParameters();
  const itemsApi = await checkItemsInApi(Ids);
  makeListOfProductTitle(itemsApi);
  // console.log(itemsApi);
  const memberInfo = await Api.get(`${MAIN_PAGE_URL}/api/user`);
  loadName(memberInfo.fullName);
}

App();
