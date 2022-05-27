import * as Api from '/api.js';

const ordersContainer = document.getElementById('ordersContainer');
const tableInfo = document.querySelector('.table-info');

render();
addAllEvents();

function addAllEvents() {}

function template(data) {
  const arr = data.orderInfo.product;
  const orderInfo = arr.map((item) => `${item.name} / ${item.quantity}개`);
  console.log(data);
  return `
    <div class="columns orders-item" data-id="${data._id}">
      <div class="column is-2">${data.createdAt.slice(0, 10)}</div>
      <div class="column is-4 order-summary">${orderInfo.join('<br>')}</div>
      <div class="column is-2">${data.orderInfo.total}</div>
      <div class="column is-2">
        <div class="select">
          <select
            class="statusSelectBox"
            data-id="${data._id}"
          >
            <option class="has-background-danger-light has-text-danger" ${
              data.orderState === '상품 준비중' ? `selected = ''` : ''
            } value="상품 준비중">
              상품 준비중
            </option>
            <option class="has-background-primary-light has-text-primary" ${
              data.orderState === '상품 배송중' ? `selected = ''` : ''
            } value="상품 배송중">상품 배송중</option>
            <option class="has-background-grey-light" ${
              data.orderState === '배송완료' ? `selected = ''` : ''
            } value="배송완료">배송완료</option>
          </select>
        </div>
      </div>
      <div class="column is-2">
        <button class="button order-cancel" data-id="${data._id}">주문 취소</button>
      </div>
    </div>
  `;
}

function render() {
  getOrderData();
}

async function getOrderData() {
  //todo: fetch data
  const res = await Api.get('/api/orderlist');

  tableInfo.innerHTML = res.map((item) => template(item)).join('');
  tableInfo.addEventListener('click', orderClickEvent);
  if (document.querySelector('.statusSelectBox')) {
    document.querySelector('.statusSelectBox').addEventListener('change', onChangeEvent);
  }
}

async function onChangeEvent(e) {
  if (e.target.closest('.statusSelectBox')) {
    const data = {
      orderState: e.target.closest('.statusSelectBox').value,
    };
    const orderId = e.target.closest('.statusSelectBox').dataset.id;
    const res = await Api.patch('/api/order', orderId, data);
  }
}

async function orderClickEvent(e) {
  if (e.target.closest('.order-cancel')) {
    const targetId = e.target.closest('.order-cancel').dataset.id;
    const res = await Api.delete('/api/order', targetId);

    render();
  }
}
