import * as Api from '/api.js';
import { randomId, logout } from '/useful-functions.js';

const fullNameToggle = document.getElementById('fullNameToggle');
const passwordToggle = document.getElementById('passwordToggle');
const addressToggle = document.getElementById('addressToggle');
const phoneNumberToggle = document.getElementById('phoneNumberToggle');
const checkbox = document.querySelector('.checkbox');

const securityTitle = document.getElementById('securityTitle');
const fullNameInput = document.getElementById('fullNameInput');
const passwordInput = document.getElementById('passwordInput');
const passwordConfirmInput = document.getElementById('passwordConfirmInput');
const postalCodeInput = document.getElementById('postalCodeInput');
const address1Input = document.getElementById('address1Input');
const address2Input = document.getElementById('address2Input');
const phoneNumberInput = document.getElementById('phoneNumberInput');
const currentPasswordInput = document.getElementById('currentPasswordInput');
const searchAddressButton = document.getElementById('searchAddressButton');

const saveButton = document.getElementById('saveButton');
const modal = document.getElementById('modal');
const modalCloseButton = document.getElementById('modalCloseButton');
const saveCompleteButton = document.getElementById('saveCompleteButton');

addAllElements();
addAllEvents();

async function addAllElements() {
  getUserData();
}

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllEvents() {
  // switchToggle.addEventListener('click', toggleEvent);
  fullNameToggle.addEventListener('click', fullNameToggleEvent);
  passwordToggle.addEventListener('click', passwordToggleEvent);
  addressToggle.addEventListener('click', addressToggleEvent);
  phoneNumberToggle.addEventListener('click', phoneNumberToggleEvent);
  saveButton.addEventListener('click', saveButtonEvent);
  modalCloseButton.addEventListener('click', modalCloseButtonEvent);
  saveCompleteButton.addEventListener('click', saveCompleteButtonEvent);
  searchAddressButton.addEventListener('click', findAddress);
}

let userData = {};
async function getUserData() {
  userData = await Api.get('/api/user');

  securityTitle.innerHTML = `(${userData.email})`;
  fullNameInput.value = `${userData.fullName}`;

  if (userData.address) {
    postalCodeInput.value = `${userData.address.postalCode}`;
    address1Input.value = `${userData.address.address1}`;
    address2Input.value = `${userData.address.address2}`;
  }
  if (userData.phoneNumber) {
    phoneNumberInput.value = `${userData.phoneNumber}`;
  }
}

function fullNameToggleEvent(e) {
  e.preventDefault();
  const target = e.target;
  const isToggle = e.target.classList.contains('on');

  fullNameInput.disabled = isToggle;
  target.setAttribute('aria-checked', !isToggle);
  fullNameInput.focus();
  target.classList.toggle('on');
}

function passwordToggleEvent(e) {
  e.preventDefault();
  const target = e.target;
  const isToggle = e.target.classList.contains('on');

  passwordInput.disabled = isToggle;
  passwordConfirmInput.disabled = isToggle;
  passwordInput.focus();

  target.setAttribute('aria-checked', !isToggle);
  target.classList.toggle('on');
}

function addressToggleEvent(e) {
  e.preventDefault();
  const target = e.target;
  const isToggle = e.target.classList.contains('on');

  postalCodeInput.disabled = isToggle;
  address1Input.disabled = isToggle;
  address2Input.disabled = isToggle;
  searchAddressButton.disabled = isToggle;
  postalCodeInput.focus();

  target.setAttribute('aria-checked', !isToggle);
  target.classList.toggle('on');
}

function phoneNumberToggleEvent(e) {
  e.preventDefault();
  const target = e.target;
  const isToggle = e.target.classList.contains('on');

  phoneNumberInput.disabled = isToggle;
  phoneNumberInput.focus();

  target.setAttribute('aria-checked', !isToggle);
  target.classList.toggle('on');
}

function saveButtonEvent(e) {
  e.preventDefault();
  openModal(modal);
}
function modalCloseButtonEvent(e) {
  e.preventDefault();
  closeModal(modal);
}

async function saveCompleteButtonEvent(e) {
  e.preventDefault();
  const isFullNameValid = fullNameInput.value.length >= 2;
  const isPasswordValid = passwordInput.value.length >= 4 || passwordInput.value.length === 0;
  const isPasswordSame = passwordInput.value === passwordConfirmInput.value;

  if (!isFullNameValid || !isPasswordValid) {
    closeModal(modal);
    return alert('이름은 2글자 이상, 비밀번호는 4글자 이상이어야 합니다.');
  }

  if (!isPasswordSame) {
    closeModal(modal);
    return alert('비밀번호가 일치하지 않습니다.');
  }

  const data = {
    fullName: fullNameInput.value,
    address: {
      postalCode: postalCodeInput.value,
      address1: address1Input.value,
      address2: address2Input.value,
    },
    phoneNumber: phoneNumberInput.value,
    currentPassword: currentPasswordInput.value,
  };

  if (passwordInput.value.length !== 0) {
    data['password'] = passwordInput.value;
  }
  try {
    const res = await Api.patch('/api/users', userData._id, data);
    location.href = '/account/security/';
  } catch (error) {
    console.log(error);
  }
}

(
  document.querySelectorAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button') || []
).forEach(($close) => {
  const $target = $close.closest('.modal');

  $close.addEventListener('click', () => {
    closeModal($target);
  });
});

document.onkeydown = function (evt) {
  evt = evt || window.event;
  if (evt.keyCode == 27) {
    closeModal(modal);
  }
};

function openModal($el) {
  $el.classList.add('is-active');
}

function closeModal($el) {
  $el.classList.remove('is-active');
}

//주소 검색
function findAddress(e) {
  e.preventDefault();
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
      document.getElementById('postalCodeInput').value = data.zonecode;
      document.getElementById('address1Input').value = fullAdress;
      // 커서를 상세주소 필드로 이동한다.
      document.getElementById('address2Input').focus();
    },
  }).open();
}
