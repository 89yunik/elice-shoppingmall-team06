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
