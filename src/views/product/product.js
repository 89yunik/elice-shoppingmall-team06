import * as Api from '/api.js';

const tableInfo = document.querySelector('.table-info');

function template(data) {
  return `
    <div class="columns orders-item">
      <div class="column is-2">
        <div data-show>${data.name}</div>
        <input name="name" data-modify class="input display-none" type="text" value="${data.name}">
      </div>
      <div class="column is-2 order-summary">
        <div data-show>${data.descriptionSummary}</div>
        <input name="descriptionSummary" data-modify class="input display-none" type="text" value="${data.descriptionSummary}">
      </div>
      <div class="column is-2 order-summary">
        <div data-show>${data.stock}</div>
        <input name="stock" data-modify class="input display-none" type="text" value="${data.stock}">
      </div>
      <div class="column is-2 order-summary">
        <div data-show>${data.price}</div>
        <input name="price" data-modify class="input display-none" type="text" value="${data.price}">
      </div>
      <div class="column is-2">
        <button class="button btn-modify" data-show data-id="${data._id}">수정</button>
        <button class="button btn-confirm display-none" data-modify data-id="${data._id}">완료</button>
        <button class="button btn-cancel display-none" data-modify data-id="${data._id}">취소</button>
      </div>
      <div class="column is-1">
        <button class="button btn-delete" data-id="${data._id}">삭제</button>
      </div>
    </div>
  `;
}

function render() {
  getOrderData();
}
async function getOrderData() {
  const res = await Api.get('/api/productlist');
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
    const columns = btnConfirm.closest('.columns');
    const data = {
      name: columns.querySelector('input[name=name]').value,
      descriptionSummary: columns.querySelector('input[name=descriptionSummary]').value,
      stock: columns.querySelector('input[name=stock]').value,
      price: columns.querySelector('input[name=price]').value,
    };
    const res = await Api.patch('/api/product', targetId, data);
    render();
  }
  if (btnDelete) {
    const targetId = btnDelete.dataset.id;
    const res = await Api.delete('/api/product', targetId);
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
