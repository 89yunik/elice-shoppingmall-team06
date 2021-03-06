import * as Api from '/api.js';

const ordersContainer = document.getElementById('ordersContainer');
const tableInfo = document.querySelector('.table-info');
const level = document.querySelector('.level');
render();
addAllEvents();

function addAllEvents() {}

function levelTemplate(data) {
  return `
    <div class="level-item has-text-centered">
      <div>
        <p class="heading">총 주문수</p>
        <p class="title" id="ordersCount">${data.length}</p>
      </div>
    </div>
    <div class="level-item has-text-centered">
      <div>
        <p class="heading">상품 준비중</p>
        <p class="title" id="prepareCount">${data.filter((item) => item.orderState === '상품 준비중').length}</p>
      </div>
    </div>
    <div class="level-item has-text-centered">
      <div>
        <p class="heading">상품 배송중</p>
        <p class="title" id="deliveryCount">${data.filter((item) => item.orderState === '상품 배송중').length}</p>
      </div>
    </div>
    <div class="level-item has-text-centered">
      <div>
        <p class="heading">배송완료</p>
        <p class="title" id="completeCount">${data.filter((item) => item.orderState === '배송완료').length}</p>
      </div>
    </div>
  `;
}

function tableTemplate(data) {
  console.log(data);
  const arr = data.orderInfo.product;
  const orderInfo = arr.map((item) => `${item.name} / ${item.quantity}개`);
  return `
    <div class="columns orders-item" data-id="${data._id}">
      <div class="column is-1" data-label="날짜">${data.createdAt.slice(0, 10)}</div>
      <div class="column is-2 order-summary" data-label="수령자 이름 / 연락처">${data.orderInfo.name} / ${
    data.orderInfo.phoneNumber
  }</div>
      <div class="column is-2 order-summary"  data-label="배송지 정보">${data.orderInfo.address1} ${
    data.orderInfo.address2
  }</div>
      <div class="column is-2 order-summary"  data-label="주문내용">${orderInfo.join('<br>')}</div>
      <div class="column is-1"  data-label="주문총액">${data.orderInfo.total}</div>
      <div class="column is-2"  data-label="상태관리">
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
            <option class="has-background-primary-light " ${
              data.orderState === '상품 배송중' ? `selected = ''` : ''
            } value="상품 배송중">상품 배송중</option>
            <option class="has-background-grey-light" ${
              data.orderState === '배송완료' ? `selected = ''` : ''
            } value="배송완료">배송완료</option>
          </select>
        </div>
      </div>
      <div class="column is-1"  data-label="취소">
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
  level.innerHTML = levelTemplate(res);
  tableInfo.innerHTML = res.map((item) => tableTemplate(item)).join('');
  tableInfo.addEventListener('click', orderClickEvent);
  tableInfo.addEventListener('change', onChangeEvent);
}

async function onChangeEvent(e) {
  const selectBox = e.target.closest('.statusSelectBox');
  if (selectBox) {
    const data = {
      orderState: selectBox.value,
    };
    const orderId = selectBox.dataset.id;
    const res = await Api.patch('/api/order', orderId, data);
    render();
  }
}

async function orderClickEvent(e) {
  if (e.target.closest('.order-cancel')) {
    const targetId = e.target.closest('.order-cancel').dataset.id;
    const res = await Api.delete('/api/order', targetId);

    render();
  }
}
