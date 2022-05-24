// 아래는 현재 home.html 페이지에서 쓰이는 코드는 아닙니다.
// 다만, 앞으로 ~.js 파일을 작성할 때 아래의 코드 구조를 참조할 수 있도록,
// 코드 예시를 남겨 두었습니다.

import * as Api from '/api.js';
import { randomId, logout } from '/useful-functions.js';
import Menu from './component/Menu.js';
// 요소(element), input 혹은 상수

const logoutBtn = document.querySelector('.logout-btn');
logoutBtn.addEventListener('click', logout);

const exampleMenuList = [
  { name: '주문조회' },
  { name: '회원정보관리' },
  { name: '제품판매' },
  { name: '회원탈퇴' },
];
export default function accountManagement() {
  const $app = document.querySelector('.div-container');
  this.state = {
    menuList: exampleMenuList,
  };

  this.setState = (nextState) => {
    this.state = nextState;
    menu.setState(this.state.menuList);
  };

  const menu = new Menu({
    $app,
    initialState: this.state.menuList,
  });

  const init_app = () => {
    this.setState({
      ...this.state,
      menuList: exampleMenuList,
    });
  };

  init_app();
}

new accountManagement();
