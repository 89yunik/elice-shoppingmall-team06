import * as Api from '/api.js';

const tableInfo = document.querySelector('.table-info');

function template(data) {
  const arr = data.orderInfo.product;
  const orderInfo = arr.map((item) => `${item.name} / ${item.quantity}개`);
  return `
    <div class="columns orders-item">
      <div class="column is-2" data-label="날짜">${data.createdAt.slice(0, 10)}</div>
      <div class="column is-6 order-summary" data-label="주문정보">${orderInfo.join('<br>')}</div>
      <div class="column is-2" data-label="상태">${data.orderState}</div>
      <div class="column is-2" data-label="신청">
        <button class="button" data-id="${data._id}">주문 취소</button>
      </div>
    </div>
  `;
}

function render() {
  getOrderData();
}
async function getOrderData() {
  const res = await Api.get('/api/order');
  const html = res.map((item) => template(item)).join('');
  tableInfo.innerHTML = html;

  tableInfo.addEventListener('click', cancelClickEvent);
}

async function cancelClickEvent(e) {
  if (e.target.closest('.button')) {
    const targetId = e.target.closest('.button').dataset.id;
    const res = await Api.delete('/api/order', targetId);

    render();
  }
}

render();
