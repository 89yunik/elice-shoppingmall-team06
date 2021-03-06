import * as Api from '/api.js';
import { validateEmail } from '/useful-functions.js';

// 요소(element), input 혹은 상수
const emailInput = document.querySelector('#emailInput');
const passwordInput = document.querySelector('#passwordInput');
const submitButton = document.querySelector('#submitButton');
const kakaoButton = document.querySelector('#kakaoButton');
const googleButton = document.querySelector('#googleButton');
addAllElements();
addAllEvents();

// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {}

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllEvents() {
  submitButton.addEventListener('click', handleSubmit);
  kakaoButton.addEventListener('click', handleKakao);
  googleButton.addEventListener('click', handleGoogle);
}
// 카카오 로그인 진행
function handleKakao(e) {
  e.preventDefault();
  const KAKAO_CLIENT_ID = '06dc428dd314134d1b3b571b4e6da637';
  const KAKAO_REDIRECT_URI = 'http://kdt-sw2-seoul-team06.elicecoding.com/auth/kakao';

  window.location.href = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${KAKAO_REDIRECT_URI}&response_type=code`;
}
// google 로그인 진행
function handleGoogle(e) {
  e.preventDefault();
  const GOOGLE_CLIENT_ID = '988474744821-rr2buu1eg6d35947ldt3aap2j9vs428q.apps.googleusercontent.com';
  const GOOGLE_REDIRECT_URI = 'http://kdt-sw2-seoul-team06.elicecoding.com/auth/google';
  window.location.href = `https://accounts.google.com/o/oauth2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_REDIRECT_URI}&response_type=code&scope=https://www.googleapis.com/auth/userinfo.email`;
}
// 로그인 진행
async function handleSubmit(e) {
  e.preventDefault();

  const email = emailInput.value;
  const password = passwordInput.value;

  // 잘 입력했는지 확인
  const isEmailValid = validateEmail(email);
  const isPasswordValid = password.length >= 4;

  if (!isEmailValid || !isPasswordValid) {
    return alert('비밀번호가 4글자 이상인지, 이메일 형태가 맞는지 확인해 주세요.');
  }

  // 로그인 api 요청
  try {
    const data = { email, password };

    const result = await Api.post('/api/login', data);
    const token = result.token;

    // 로그인 성공, 토큰을 세션 스토리지에 저장
    // 물론 다른 스토리지여도 됨
    sessionStorage.setItem('token', token);

    alert(`정상적으로 로그인되었습니다.`);

    // 로그인 성공

    // 기본 페이지로 이동
    window.location.href = '/';
  } catch (err) {
    console.error(err.stack);
    alert(`${err.message}`);
  }
}
