import * as Api from '/api.js';

const tableInfo = document.querySelector('.table-info');
const level = document.querySelector('.level');
render();
addAllEvents();

function addAllEvents() {}

function levelTemplate(data) {
  return `
    <div class="level-item has-text-centered">
      <div>
        <p class="heading">총회원수</p>
        <p class="title" id="usersCount">${data.length}</p>
      </div>
    </div>
    <div class="level-item has-text-centered">
      <div>
        <p class="heading">회원</p>
        <p class="title" id="adminCount">${data.filter((item) => item.role === 'basic-user').length}</p>
      </div>
    </div>
    <div class="level-item has-text-centered">
      <div>
        <p class="heading">관리자</p>
        <p class="title" id="adminCount">${data.filter((item) => item.role === 'admin').length}</p>
      </div>
    </div>
    <div class="level-item has-text-centered">
      <div>
        <p class="heading">OAuth가입자수</p>
        <p class="title" id="OAuthCount">${data.filter((item) => item.userType !== 'normal').length}</p>
      </div>
    </div>
  `;
}

function tableTemplate(data) {
  let userType = '';
  switch (data.userType) {
    case 'normal':
      userType = '일반';
      break;
    case 'kakao':
      userType = '카카오';
      break;
    case 'google':
      userType = '구글';
      break;
    default:
      userType = '일반';
      break;
  }
  return `
  <div class="columns orders-item">
    <div class="column is-2">${data.createdAt.slice(0, 10)}</div>
    <div class="column is-2">${data.email}</div>
    <div class="column is-2">
      <span class="tag">${userType}</span>
    </div>
    <div class="column is-2">${data.fullName}</div>
    <div class="column is-2">
      <div class="select">
        <select data-id="${data._id}" class="statusSelectBox  ">
          <option class=" " ${data.role === 'basic-user' ? 'selected=""' : ''} value="basic-user">
            일반사용자
          </option>
          <option class="has-background-danger-light has-text-danger" ${
            data.role === 'admin' ? 'selected=""' : ''
          } value="admin">관리자</option>
        </select>
      </div>
    </div>
    <div class="column is-2">
      <button class="button" data-id="${data._id}">회원정보 삭제</button>
    </div>
  </div>
  `;
}

function render() {
  getData();
}

async function getData() {
  const userData = await Api.get('/api/userlist');
  level.innerHTML = levelTemplate(userData);
  tableInfo.innerHTML = userData.map((item) => tableTemplate(item)).join('');
  tableInfo.addEventListener('click', orderClickEvent);
  tableInfo.addEventListener('change', onChangeEvent);
}

async function onChangeEvent(e) {
  const selectBox = e.target.closest('.statusSelectBox');
  if (selectBox) {
    const role = selectBox.value;
    const id = selectBox.dataset.id;

    const data = {
      role,
    };

    const res = await Api.patch('/api/admin', `${id}/${role}`);

    render();
  }
}

async function orderClickEvent(e) {
  if (e.target.closest('.button')) {
    const targetId = e.target.closest('.button').dataset.id;
    // todo : fetch post delete data
    const res = await Api.delete('/api/admin', targetId);

    render();
  }
}
