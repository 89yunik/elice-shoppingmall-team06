//쿠기 값 삭제
const deleteCookie = (key) => {
  document.cookie = key + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
};

//쿠기 값 가져오기
const getCookieValue = (key) => {
  let cookieKey = key + '=';
  let result = '';
  const cookieArr = document.cookie.split(';');

  for (let i = 0; i < cookieArr.length; i++) {
    if (cookieArr[i][0] === ' ') {
      cookieArr[i] = cookieArr[i].substring(1);
    }

    if (cookieArr[i].indexOf(cookieKey) === 0) {
      result = cookieArr[i].slice(cookieKey.length, cookieArr[i].length);
      return result;
    }
  }
  return result;
};
sessionStorage.setItem('token', getCookieValue('token'));

const tokenCheck = sessionStorage.getItem('token');
if (tokenCheck) {
  window.location.href = '/';
} else {
  alert('카카오 로그인에 실패하였습니다. 다시 시도 해주세요');

  window.location.href = '/';
}

// 로그인 성공

// 기본 페이지로 이동
