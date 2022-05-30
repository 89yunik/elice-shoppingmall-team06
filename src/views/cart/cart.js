const DELIVERY_FEE = 3000;

document.querySelector('#allSelectCheckbox').addEventListener('click', clickCheckAllButton);
document.querySelector('#cartProductsContainer').addEventListener('click', checkWhatIClick);
document.querySelector('#partialDeleteLabel .help').addEventListener('click', clickPartialDeleteLabel);
document.querySelector('#purchaseButton').addEventListener('click', moveToOrderPage);

//구매하기 버튼 클릭시
function moveToOrderPage() {
  if (JSON.parse(sessionStorage.getItem('order')).length) window.location.href = '/order';
}

//sessionStorage 'cart'에 따른 요소 만들기
function makeCartLists(data) {
  const id = data._id;
  const quantity = data.quantity;
  const template = document.createElement('template');
  template.innerHTML = `<div class="cart-product-item" id="productItem-${id}" data-id="${id}">
    <label class="checkbox">
      <input type="checkbox" id="checkbox-${id}" checked class="check-item" />
    </label>
    <button class="delete-button" id="delete-${id}">
      <span class="icon">
        <i class="fas fa-trash-can" aria-hidden="true"></i>
      </span>
    </button>
    <figure class="image is-96x96">
      <img
        id="image-${id}"
        src="./sampleData/images/sodong.png"
        alt="product-image"
      />
    </figure>
    <div class="content">
      <p id="title-${id}">${data.name}</p>
      <div class="quantity">
        <button
          class="button is-rounded"
          id="minus-${id}"
          disabled=""
        >
          <span class="icon is-small">
            <i class="fas fa-thin fa-minus" aria-hidden="true"></i>
          </span>
        </button>
        <input
          class="input"
          id="quantityInput-${id}"
          type="number"
          min="1"
          max="99"
          value="${quantity}"
        />
        <button class="button is-rounded" id="plus-${id}">
          <span class="icon">
            <i class="fas fa-lg fa-plus" aria-hidden="true"></i>
          </span>
        </button>
      </div>
    </div>
    <div class="calculation">
      <p id="unitPrice-${id}">${data.price}원</p>
      <p>
        <span class="icon">
          <i class="fas fa-thin fa-xmark" aria-hidden="true"></i>
        </span>
      </p>
      <p id="quantity-${id}">${quantity}</p>
      <p>
        <span class="icon">
          <i class="fas fa-thin fa-equals" aria-hidden="true"></i>
        </span>
      </p>
      <p id="total-${id}">${data.price * quantity}원</p>
    </div>
  </div>`;
  return template.content;
}

//'cart'에 있는 내용 화면에 나타내기
function displayCartLIsts() {
  const cartProductsContainer = document.querySelector('#cartProductsContainer');
  const cartStorage = JSON.parse(sessionStorage.getItem('cart'));
  let documentFragment = document.createDocumentFragment();

  cartStorage.forEach((item) => {
    documentFragment.appendChild(makeCartLists(item));
  });
  cartProductsContainer.appendChild(documentFragment);
}

//전체선택버튼
function clickCheckAllButton(event) {
  const checkboxes = document.querySelectorAll('.check-item');
  const orderStorage = JSON.parse(sessionStorage.getItem('order'));

  let orderArr = [];

  checkboxes.forEach((item) => {
    item.checked = event.target.checked;
    const id = item.closest('.cart-product-item').dataset.id;
    if (event.target.checked) {
      orderArr.push(id);
    }
  });
  sessionStorage.setItem('order', JSON.stringify(orderArr));
  calculateOrderTotalPrice();
}

//주문가격 계산하기
function calculateOrderTotalPrice() {
  const orderStorage = JSON.parse(sessionStorage.getItem('order'));
  const cartStorage = JSON.parse(sessionStorage.getItem('cart'));

  const intersectItems = orderStorage.map((orderId) => cartStorage.find((cart) => cart._id === orderId));

  let productsTotalPrice = 0;
  intersectItems.forEach((item) => {
    productsTotalPrice += item.quantity * item.price;
  });
  document.querySelector('#productsTotal').innerHTML = productsTotalPrice;
  document.querySelector('#orderTotal').innerHTML = productsTotalPrice + DELIVERY_FEE;
  return productsTotalPrice;
}

//개별 체크박스를 체크하였을 때
function checkingCheckBox(event) {
  const id = event.closest('.cart-product-item').dataset.id;
  let orderStorage = JSON.parse(sessionStorage.getItem('order'));
  if (orderStorage.includes(id)) {
    orderStorage = orderStorage.filter((element) => element !== id);
  } else {
    orderStorage.push(id);
  }
  sessionStorage.setItem('order', JSON.stringify(orderStorage));
  checkingAllCheckBox();
  calculateOrderTotalPrice();
}

//체크박스 하나라도 해제되면 전체체크박스도 해제
function checkingAllCheckBox() {
  let allSelectCheckbox = document.querySelector('#allSelectCheckbox');
  if (JSON.parse(sessionStorage.getItem('cart')).length === JSON.parse(sessionStorage.getItem('order')).length) {
    allSelectCheckbox.checked = true;
  } else allSelectCheckbox.checked = false;
}

//plus, minus 버튼 클릭시
function clickHandleQuantityButton(event) {
  console.log(event);
  const cartProductItem = event.closest('.cart-product-item');
  const id = cartProductItem.dataset.id;

  let cartStorage = JSON.parse(sessionStorage.getItem('cart'));

  cartStorage.forEach((item) => {
    if (item._id === id) {
      item.quantity = event.classList.contains('fa-plus') ? ++item.quantity : --item.quantity;

      cartProductItem.querySelector(`#quantityInput-${id}`).value = item.quantity;
      cartProductItem.querySelector(`#minus-${id}`).disabled = false;
    }
  });

  sessionStorage.setItem('cart', JSON.stringify(cartStorage));

  calculateOrderTotalPrice();
}

//trashcan button 클릭시
function clickTrashCanButton(event) {
  const cartProductItem = event.closest('.cart-product-item');
  const id = cartProductItem.dataset.id;

  let cartStorage = JSON.parse(sessionStorage.getItem('cart')).filter((item) => item._id !== id);
  sessionStorage.setItem('cart', JSON.stringify(cartStorage));

  cartProductItem.remove();
}

//선택삭제 버튼 클릭시
function clickPartialDeleteLabel(event) {
  const orderStorage = JSON.parse(sessionStorage.getItem('order'));
  let cartStorage = JSON.parse(sessionStorage.getItem('cart'));

  orderStorage.forEach((item) => {
    document.querySelector(`#productItem-${item}`).remove();
    cartStorage = cartStorage.filter((element) => element._id !== item);
    console.log(cartStorage);
  });
  sessionStorage.setItem('cart', JSON.stringify(cartStorage));
  calculateOrderTotalPrice();
}

//어떤 버튼 클릭했는지 확인하기
function checkWhatIClick(event) {
  if (event.target.classList.contains('check-item')) checkingCheckBox(event.target);
  else if (event.target.classList.contains('fa-plus') || event.target.classList.contains('fa-minus')) {
    clickHandleQuantityButton(event.target);
  } else if (event.target.classList.contains('fa-trash-can')) clickTrashCanButton(event.target);
}

//로딩 시 체크박스
function checkOrderStorageAndCheckBox() {}

function App() {
  displayCartLIsts();
  calculateOrderTotalPrice();
  checkingAllCheckBox();

  // const cartStorage = JSON.parse(sessionStorage.getItem('cart'));
  // if (cartStorage.length !== 0) {
  //   const orderStorage = JSON.parse(sessionStorage.getItem('order'));

  //   cartStorage.forEach((item) => {
  //     if (orderStorage.includes(item._id)) document.querySelector(`#checkbox-${item._id}`).checked = true;
  //     else document.querySelector(`#checkbox-${item._id}`).checked = false;
  //   });
  // }
}

App();
