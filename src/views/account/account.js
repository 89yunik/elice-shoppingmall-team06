// 아래는 현재 home.html 페이지에서 쓰이는 코드는 아닙니다.
// 다만, 앞으로 ~.js 파일을 작성할 때 아래의 코드 구조를 참조할 수 있도록,
// 코드 예시를 남겨 두었습니다.

import * as Api from '/api.js';
import { randomId, logout } from '/useful-functions.js';
import Menu from './component/Menu.js';
// 요소(element), input 혹은 상수

const logoutBtn = document.querySelector('.logout-btn');
logoutBtn.addEventListener('click', logout);
