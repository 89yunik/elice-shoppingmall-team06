let navbarM = document.querySelector('.navbar-end-m');
let navbarBurger = document.querySelector('.navbar-burger');
let navbarBG = document.querySelector('.navber-m-bg');
navbarBurger.addEventListener('click', function () {
  navbarM.classList.toggle('on');
});
navbarBG.addEventListener('click', function () {
  navbarM.classList.toggle('on');
});

async function get(endpoint, params = '') {
  const apiUrl = `${endpoint}/${params}`;
  console.log(`%cGET 요청: ${apiUrl} `, 'color: #a25cd1;');

  const res = await fetch(apiUrl, {
    // JWT 토큰을 헤더에 담아 백엔드 서버에 보냄.
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem('token')}`,
    },
  });

  // 응답 코드가 4XX 계열일 때 (400, 403 등)
  if (!res.ok) {
    const errorContent = await res.json();
    const { reason } = errorContent;

    throw new Error(reason);
  }

  const result = await res.json();

  return result;
}

function logoutBtnEvent(e) {
  e.preventDefault();
  sessionStorage.removeItem('token');
  alert('성공적으로 로그아웃 됐습니다.');
  location.href = '/';
}

async function initPage() {
  const navbar = document.getElementById('navbar');
  const navbarM = document.getElementById('navbar-m');
  const pathname = window.location.pathname;
  const isAdminPath = pathname.search('admin') !== -1;
  const isAccountPath = pathname.search('account') !== -1;
  try {
    if (!sessionStorage.getItem('token')) {
      if (isAdminPath || isAccountPath) {
        alert('잘못된 접근입니다. 로그인해주세요.');
        location.href = '/login';
      }

      navbar.innerHTML = `
          <li class="login-btn"><a href="/login">로그인</a></li>
          <li><a href="/register">회원가입</a></li>
          <li><a href="/resetPassword">비밀번호 찾기</a></li>
          <li>
          <a href="/cart" aria-current="page">
          <span class="icon">
          <i class="fas fa-cart-shopping"></i>
          </span>
          <span>카트</span>
          </a>
          </li>
          `;
      navbarM.innerHTML = `
          <li class="login-btn"><a href="/login">로그인</a></li>
          <li><a href="/register">회원가입</a></li>
          <li><a href="/resetPassword">비밀번호 찾기</a></li>
          <li>
            <a href="/cart" aria-current="page">
              <span class="icon">
                <i class="fas fa-cart-shopping"></i>
              </span>
              <span>카트</span>
            </a>
          </li>
        `;
      return;
    }

    const userData = await get('/api/user');

    if (userData) {
      if (userData.role === 'basic-user') {
        if (isAdminPath) {
          sessionStorage.removeItem('token');
          alert('잘못된 접근입니다. 관리자계정으로 로그인해주세요.');
          location.href = '/login';
        }

        navbar.innerHTML = `
            <li class="account-management"><a href="/account">계정관리</a></li>
            <li class="logout-btn"><a  href="#">로그아웃</a></li>
            <li>
              <a href="/cart" aria-current="page">
                <span class="icon">
                  <i class="fas fa-cart-shopping"></i>
                </span>
                <span>카트</span>
              </a>
            </li>
          `;
        navbarM.innerHTML = `
            <li class="account-management"><a href="/account">계정관리</a></li>
            <li class="logout-btn-m"><a  href="#">로그아웃</a></li>
            <li>
              <a href="/cart" aria-current="page">
                <span class="icon">
                  <i class="fas fa-cart-shopping"></i>
                </span>
                <span>카트</span>
              </a>
            </li>
          `;
      } else if (userData.role === 'admin') {
        navbar.innerHTML = `
            <li class="admin"><a href="/admin">관리자</a></li>
            <li class="account-management"><a href="/account">계정관리</a></li>
            <li class="logout-btn"><a  href="#">로그아웃</a></li>
            <li>
              <a href="/cart" aria-current="page">
                <span class="icon">
                  <i class="fas fa-cart-shopping"></i>
                </span>
                <span>카트</span>
              </a>
            </li>
          `;
        navbarM.innerHTML = `
            <li class="admin"><a href="/admin">관리자</a></li>
            <li class="account-management"><a href="/account">계정관리</a></li>
            <li class="logout-btn-m"><a  href="#">로그아웃</a></li>
            <li>
              <a href="/cart" aria-current="page">
                <span class="icon">
                  <i class="fas fa-cart-shopping"></i>
                </span>
                <span>카트</span>
              </a>
            </li>
          `;
      }
      const logoutBtn = document.querySelector('.logout-btn');
      const logoutBtnM = document.querySelector('.logout-btn-m');
      logoutBtn.addEventListener('click', logoutBtnEvent);
      logoutBtnM.addEventListener('click', logoutBtnEvent);
    }
  } catch (error) {
    sessionStorage.removeItem('token');
    alert('잘못된 토큰입니다. 다시 로그인해주세요.');
    location.href = '/login';
  }
}
initPage();

// top버튼
let topBtn = document.querySelector('.top-btn');

topBtn.addEventListener('click', (e) => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
