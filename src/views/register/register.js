import * as Api from '/api.js';
import { validateEmail } from '/useful-functions.js';

(function () {
  // 요소(element), input 혹은 상수
  const fullNameInput = document.querySelector('#fullNameInput');
  const emailInput = document.querySelector('#emailInput');
  const passwordInput = document.querySelector('#passwordInput');
  const passwordConfirmInput = document.querySelector('#passwordConfirmInput');
  const submitButton = document.querySelector('#submitButton');
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
    submitButton.addEventListener('click', handleSubmit);
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

      if (timeRemaining < 0) {
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
      const res = await Api.post('/api/authNumber', data);
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
      const res = await Api.post('/api/mailAuth', data);
      requestEmailButton.innerHTML = '재전송';
      requestEmailButton.disabled = false;

      Timer(180, countText);
    } catch (error) {
      requestEmailButton.innerHTML = '인증번호 요청';
      requestEmailButton.disabled = false;
      alert(`${error} 올바른 이메일을 입력해주세요.`);
    }
  }

  // 회원가입 진행
  async function handleSubmit(e) {
    e.preventDefault();
    const fullName = fullNameInput.value;
    const email = emailInput.value;
    const password = passwordInput.value;
    const passwordConfirm = passwordConfirmInput.value;

    // 잘 입력했는지 확인
    const isFullNameValid = fullName.length >= 2;
    const isEmailValid = validateEmail(email);
    const isPasswordValid = password.length >= 4;
    const isPasswordSame = password === passwordConfirm;

    if (!isFullNameValid || !isPasswordValid) {
      return alert('이름은 2글자 이상, 비밀번호는 4글자 이상이어야 합니다.');
    }

    if (!isEmailValid) {
      return alert('이메일 형식이 맞지 않습니다.');
    }
    // console.log(certificationFunc.getCerti);
    if (!certificationFunc.getCerti()) {
      return alert('이메일 인증을 해주세요.');
    }

    if (!isPasswordSame) {
      return alert('비밀번호가 일치하지 않습니다.');
    }

    // 회원가입 api 요청
    try {
      const data = { fullName, email, password };
      console.log(data);

      await Api.post('/api/register', data);

      alert(`정상적으로 회원가입되었습니다.`);

      // 로그인 페이지 이동
      window.location.href = '/login';
    } catch (err) {
      alert(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err}`);
    }
  }
})();
// App();
