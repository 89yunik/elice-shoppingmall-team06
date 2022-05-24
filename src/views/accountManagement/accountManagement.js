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
  { title: '주문조회', subtitle: '지난 주문 내역을 확인, 취소할 수 있습니다.' },
  { title: '회원정보관리', subtitle: '회원 정보를 확인, 수정할 수 있습니다.' },
  {
    title: '제품판매',
    subtitle: '제품 정보를 등록하여, 판매를 시작할 수 있습니다.',
  },
  {
    title: '회원탈퇴',
    subtitle: '모든 정보를 안전하게 삭제한 후 탈퇴할 수 있습니다.',
  },
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
