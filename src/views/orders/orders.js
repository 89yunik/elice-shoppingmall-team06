import * as Api from '/api.js';

function template() {
  return `
    <div class="columns orders-item" id="order-628f15c7ae629ef7dc9d8ab6">
      <div class="column is-2">2022-05-26</div>
      <div class="column is-6 order-summary">아이보리 니트 / 1개</div>
      <div class="column is-2">상품 준비중</div>
      <div class="column is-2">
        <button class="button" id="deleteButton-628f15c7ae629ef7dc9d8ab6">주문 취소</button>
      </div>
    </div>
  `;
}

function render() {
  getOrderData();
}
async function getOrderData() {
  // const res = await Api.get('/api/order');
  // console.log(res);
}

render();
