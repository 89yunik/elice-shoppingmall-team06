import * as Api from '/api.js';

const tableInfo = document.querySelector('.table-info');

function template(data) {
  return `
    <div class="columns orders-item">
      <div class="column is-2" data-label="이름">
        <div data-show>${data.name}</div>
        <input name="name" data-modify class="input display-none" type="text" value="${data.name}">
      </div>
      <div class="column is-6 order-summary" data-label="설명">
        <div data-show>${data.description}</div>
        <input name="description" data-modify class="input display-none" type="text" value="${data.description}">
      </div>
      <div class="column is-2" data-label="수정">
        <button class="button btn-modify" data-show data-id="${data._id}">수정</button>
        <button class="button btn-confirm display-none" data-modify data-id="${data._id}">완료</button>
        <button class="button btn-cancel display-none" data-modify data-id="${data._id}">취소</button>
      </div>
      <div class="column is-2" data-label="삭제">
        <button class="button btn-delete" data-id="${data._id}">삭제</button>
      </div>
    </div>
  `;
}

function render() {
  getOrderData();
}
async function getOrderData() {
  const res = await Api.get('/api/categorylist');
  const html = res.map((item) => template(item)).join('');
  tableInfo.innerHTML = html;

  tableInfo.addEventListener('click', btnClickEvent);
}

async function btnClickEvent(e) {
  const btnModify = e.target.closest('.btn-modify');
  const btnCancel = e.target.closest('.btn-cancel');
  const btnConfirm = e.target.closest('.btn-confirm');
  const btnDelete = e.target.closest('.btn-delete');

  if (btnModify) {
    const targetColumn = btnModify.closest('.columns');
    toggleEvent(targetColumn);
  }
  if (btnCancel) {
    const targetColumn = btnCancel.closest('.columns');
    toggleEvent(targetColumn);
  }
  if (btnConfirm) {
    const targetId = btnConfirm.dataset.id;
    const data = {
      name: btnConfirm.closest('.columns').querySelector('input[name=name]').value,
      description: btnConfirm.closest('.columns').querySelector('input[name=description]').value,
    };
    const res = await Api.patch('/api/category', targetId, data);
    render();
  }
  if (btnDelete) {
    const targetId = btnDelete.dataset.id;
    const res = await Api.delete('/api/category', targetId);
    render();
  }
}

function toggleEvent(node) {
  node.querySelectorAll('[data-show]').forEach((item) => {
    item.classList.toggle('display-none');
  });
  node.querySelectorAll('[data-modify]').forEach((item) => {
    item.classList.toggle('display-none');
  });
}
render();
