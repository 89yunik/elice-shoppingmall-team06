import * as Api from '/api.js';
import { validateEmail } from '/useful-functions.js';

(function () {
  // 요소(element), input 혹은 상수
  const requestEmailButton = document.getElementById('requestEmailButton');
  const verifyInput = document.querySelector('#verifyInput');
  const verifyButton = document.getElementById('verifyButton');
  const countText = document.querySelector('#countText');

  addAllElements();
  addAllEvents();

  // html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
  async function addAllElements() {}

  // 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
  function addAllEvents() {
    requestEmailButton.addEventListener('click', handleRequestEmail);
    verifyButton.addEventListener('click', handleVerify);
  }

  const certificationFunc = (() => {
    let isCerti = false;
    function setIsCerti(bool) {
      isCerti = bool;
      if (isCerti) {
        countText.style.display = 'none';
        emailInput.disabled = true;
        requestEmailButton.disabled = true;
        verifyInput.disabled = true;
        verifyButton.disabled = true;

        verifyButton.innerHTML = '인증 완료';
        alert('메일로 임시 비밀번호가 전송되었습니다.');
        location.href = '/login';
      }
    }
    return {
      noCerti: () => setIsCerti(false),
      yesCerti: () => setIsCerti(true),
      getCerti: () => isCerti,
    };
  })();

  function paddedFormat(num) {
    return num < 10 ? '0' + num : num;
  }

  let count = 0;

  function Timer(duration, ele) {
    let timeRemaining = duration;
    let min = 0;
    let sec = 0;

    if (count) clearInterval(count);

    count = setInterval(() => {
      timeRemaining -= 1;

      min = Math.floor(timeRemaining / 60);
      sec = Number(timeRemaining % 60);

      countText.innerHTML = `${paddedFormat(min)} : ${paddedFormat(sec)}`;

      if (timeRemaining <= 0) {
        certificationFunc.noCerti();
        verifyButton.disabled = true;
        clearInterval(count);
      }
    }, 1000);
  }

  async function handleVerify(e) {
    e.preventDefault();

    const data = {
      email: emailInput.value,
      authNumber: verifyInput.value,
    };

    try {
      const res = await Api.post('/api/passwordAuth', data);
      clearInterval(count);
      certificationFunc.yesCerti();
    } catch (error) {
      alert(error);
    }
  }

  async function handleRequestEmail(e) {
    e.preventDefault();

    const data = {
      email: emailInput.value,
    };

    try {
      certificationFunc.noCerti();
      requestEmailButton.innerHTML = '인증번호 전송중';
      requestEmailButton.disabled = true;
      verifyButton.disabled = false;
      const res = await Api.post('/api/passwordUser', data);
      requestEmailButton.innerHTML = '재전송';
      requestEmailButton.disabled = false;

      Timer(180, countText);
    } catch (error) {
      requestEmailButton.innerHTML = '인증번호 요청';
      requestEmailButton.disabled = false;
      alert(`${error} 올바른 이메일을 입력해주세요.`);
    }
  }
})();
