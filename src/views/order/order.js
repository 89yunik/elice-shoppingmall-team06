import * as Api from '/api.js';

document.querySelector('#searchAddressButton').addEventListener('click', findAddress);
document.querySelector('#checkoutButton').addEventListener('click', handleCheckoutButton);
document.querySelector('#subtitleCart').addEventListener('click', () => {
  window.location.href = '/cart';
});

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
  const iBought = checkWhatIBuy();

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

  for (let i = 0; i < cartItems.length; i++) {
    checkedId.forEach((item) => {
      if (cartItems[i]._id === item) {
        // productsTitle.push(`${cartItems[i].name} / ${cartItems[i].quantity}개`);
        // productsTotal += cartItems[i].price * cartItems[i].quantity;
        result.push(cartItems[i]);
      }
    });
  }
  return result;
}
checkWhatIBuy();

function makeListOfProductTitle() {
  const whatIBuy = checkWhatIBuy();
  let totalPrice = 0;

  document.querySelector('#productsTitle').innerHTML = '';
  whatIBuy.forEach((item) => {
    document.querySelector('#productsTitle').innerHTML += `${item.name} </br>`;
    totalPrice += item.price * item.quantity;
  });

  document.querySelector('#productsTotal').innerHTML = `${totalPrice}원`;
  document.querySelector('#orderTotal').innerHTML = totalPrice + 3000;
}

let userID;

function callUserApi() {
  let userApi = Api.get('http://localhost:5070/api/user').then((result) => {
    userID = result.email;
  });
}

// 장바구니의 체크된 부분만 주문
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
  //   console.log(productList);
  const userData = await Api.get('http://localhost:5070/api/user');
  //   console.log(userId);
  //   let userApi = await Api.get('http://localhost:5070/api/user').then((result) => {
  //     userID = result.email;
  //   });
  const data = {
    userId: userData._id,
    orderInfo: {
      product: productList,
      name: document.querySelector('#receiverName').value,
      phoneNumber: document.querySelector('#receiverPhoneNumber').value,
      address1: document.querySelector('#address1').value,
      address2: document.querySelector('#address2').value,
      requests: document.querySelector('#requestSelectBox').value,
    },
    orderState: '상품 준비중',
  };
  //   console.log(data);
  try {
    const res = await Api.post('/api/orderregister', data);
    console.log('데이터 확인' + res);
  } catch (error) {
    console.log(error);
  }
}

window.onload = () => {
  //   loadName(result.fullName);
  makeListOfProductTitle();
};
