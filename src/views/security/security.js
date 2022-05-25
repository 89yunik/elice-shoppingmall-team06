import * as Api from '/api.js';
import { randomId, logout } from '/useful-functions.js';

addAllElements();
addAllEvents();
const addressToggle = document.getElementById('addressToggle');

// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {
  getUserData();
}

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllEvents() {}

function clickToggleBtn() {}

async function getUserData() {
  // 예시 URI입니다. 현재 주어진 프로젝트 코드에는 없는 URI입니다.
  const example = [
    {
      email: 'asdf@example.com',
      name: '김지호',
      password: 'asdf',
      postalCode: '001',
      address1: '경기도',
      address2: '상세상세',
      number: '01020203030',
    },
  ];

  // const data = await Api.get('/user');

  const data = example;

  const securityTitle = document.getElementById('securityTitle');
  const fullNameInput = document.getElementById('fullNameInput');
  const passwordInput = document.getElementById('passwordInput');
  const passwordConfirmInput = document.getElementById('passwordConfirmInput');
  const postalCodeInput = document.getElementById('postalCodeInput');
  const address1Input = document.getElementById('address1Input');
  const address2Input = document.getElementById('address2Input');
  const phoneNumberInput = document.getElementById('phoneNumberInput');

  securityTitle.innerHTML = `회원정보 관리 ${data[0].email}`;
  fullNameInput.value = `${data[0].name}`;
  postalCodeInput.value = `${data[0].postalCode}`;
  address1Input.value = `${data[0].address1}`;
  address2Input.value = `${data[0].address2}`;
  phoneNumberInput.value = `${data[0].number}`;
}
