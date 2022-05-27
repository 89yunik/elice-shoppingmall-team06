import * as Api from '/api.js';

const ordersContainer = document.getElementById('ordersContainer');
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
    <div class="columns orders-item" id="${data.id}">
      <div class="column is-2">${data.date}</div>
      <div class="column is-4 order-summary">${data.productName} / ${data.count}개</div>
      <div class="column is-2">${data.price}</div>
      <div class="column is-2">
        <div class="select">
          <select
            class="statusSelectBox"
            data-id="${data.id}"
          >
            <option class="has-background-danger-light has-text-danger" ${
              data.status === 0 ? `selected = ''` : ''
            } value="상품 준비중">
              상품 준비중
            </option>
            <option class="has-background-primary-light has-text-primary" ${
              data.status === 1 ? `selected = ''` : ''
            } value="상품 배송중">상품 배송중</option>
            <option class="has-background-grey-light" ${
              data.status === 2 ? `selected = ''` : ''
            } value="배송완료">배송완료</option>
          </select>
        </div>
      </div>
      <div class="column is-2">
        <button class="button order-cancel" data-id="${data.id}">주문 취소</button>
      </div>
    </div>
  `;
}

function render() {
  getOrderData();
}

function getOrderData() {
  //todo: fetch data
  tableInfo.innerHTML = sampleData.map((item) => template(item)).join('');
  tableInfo.addEventListener('click', orderClickEvent);
  document.querySelector('.statusSelectBox').addEventListener('change', onChangeEvent);
}

function onChangeEvent(e) {
  if (e.target.closest('.statusSelectBox')) {
    console.log(e.target.closest('.statusSelectBox').value);
    console.log(e.target.closest('.statusSelectBox').dataset.id);

    // todo: something fetch api
  }
}

function orderClickEvent(e) {
  // todo : fetch post delete data
  if (e.target.closest('.order-cancel')) {
    const index = sampleData.find((item) => item.id === e.target.closest('.order-cancel').dataset.id);
    sampleData.splice(index, 1);

    render();
  }
}
