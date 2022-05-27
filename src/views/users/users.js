import * as Api from '/api.js';

const tableInfo = document.querySelector('.table-info');

const sampleData = [
  {
    id: 14387916237,
    date: '2022 - 05 - 23',
    productName: '아이보리 니트',
    count: 1,
    price: 22000,
    status: 1,
  },
  {
    id: 324743743,
    date: '2022 - 05 - 24',
    productName: '보라색 니트',
    count: 3,
    price: 53000,
    status: 0,
  },
  {
    id: 8239238,
    date: '2022 - 05 - 01',
    productName: '검정 니트',
    count: 1,
    price: 50000,
    status: 2,
  },
];

render();
addAllEvents();

function addAllEvents() {}

function template(data) {
  return `
  <div class="columns orders-item">
    <div class="column is-2">${data.createdAt.slice(0, 10)}</div>
    <div class="column is-2">${data.email}</div>
    <div class="column is-2">
      <span class="tag">${data.type !== 'normal' ? '일반' : '소셜'}</span>
    </div>
    <div class="column is-2">${data.fullName}</div>
    <div class="column is-2">
      <div class="select">
        <select data-id="${data._id}" class="statusSelectBox has-background-link-light has-text-link">
          <option class="has-background-link-light has-text-link" ${
            data.role === 'basic-user' ? 'selected=""' : ''
          } value="basic-user">
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
  //todo: fetch data
  const userData = await Api.get('/api/userlist');
  console.log(userData);
  tableInfo.innerHTML = userData.map((item) => template(item)).join('');
  tableInfo.addEventListener('click', orderClickEvent);
  document.querySelector('.statusSelectBox').addEventListener('change', onChangeEvent);
}

async function onChangeEvent(e) {
  if (e.target.closest('.statusSelectBox')) {
    const role = e.target.closest('.statusSelectBox').value;
    const id = e.target.closest('.statusSelectBox').dataset.id;

    const data = {
      role,
    };

    // something api

    // const res = await Api.patch(`/api/users`, id, data);
    // console.log(res);

    render();
  }
}

function orderClickEvent(e) {
  if (e.target.closest('.button')) {
    console.log(e.target.closest('.button').dataset.id);
    // todo : fetch post delete data

    render();
  }
}
