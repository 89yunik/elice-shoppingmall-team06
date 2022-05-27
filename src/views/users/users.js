import * as Api from '/api.js';

const tableInfo = document.querySelector('.table-info');

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
  const userData = await Api.get('/api/userlist');

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
