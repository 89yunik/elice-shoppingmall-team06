const DELIVERY_FEE = 3000;
document.querySelector('#allSelectCheckbox').addEventListener('click', clickCheckAllButton);
document.querySelector('.cart-only-product').addEventListener('click', checkWhatIClick);
document.querySelector('#purchaseButton').addEventListener('click', moveToOrderPage);
document.querySelector('#partialDeleteLabel .help').addEventListener('click', clickPartialDeleteLabel);

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
          class="button btn-minus is-rounded"
          id="minus-${id}"
          ${quantity <= 0 ? "disabled = ''" : ''}
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
        <button class="button btn-plus is-rounded" id="plus-${id}">
          <span class="icon">
            <i class="fas fa-lg fa-plus" aria-hidden="true"></i>
          </span>
        </button>
      </div>
    </div>
    <div class="calculation">
      <p id="unitPrice-${id}">${data.price}</p><p>원</p>
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
      <p id="total-${id}">${data.price * quantity}</p><p>원</p>
    </div>
  </div>`;
  return template.content;
}

//'cart'에 있는 내용 화면에 나타내기
function displayCartLIsts() {
  const cartProductsContainer = document.querySelector('.cart-only-product');
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

  return productsTotalPrice; // 리턴 ??
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
  const isPlus = event.closest('.btn-plus');
  const cartProductItem = event.closest('.cart-product-item');
  const targetId = cartProductItem.dataset.id;

  const cartStorage = JSON.parse(sessionStorage.getItem('cart'));

  const quantityInput = cartProductItem.querySelector(`#quantityInput-${targetId}`);
  const quantity = cartProductItem.querySelector(`#quantity-${targetId}`);
  const total = cartProductItem.querySelector(`#total-${targetId}`);
  const priceValue = Number(cartProductItem.querySelector(`#unitPrice-${targetId}`).innerText);

  const quantityInputValue = Number(quantityInput.value);
  const newQuantityInput = isPlus ? quantityInputValue + 1 : quantityInputValue - 1;

  if (newQuantityInput > 0) {
    cartProductItem.querySelector(`#minus-${targetId}`).disabled = false;
    quantityInput.value = newQuantityInput;
    quantity.innerHTML = newQuantityInput;
    total.innerHTML = newQuantityInput * priceValue;
  } else {
    cartProductItem.querySelector(`#minus-${targetId}`).disabled = true;
    quantityInput.value = 0;
    quantity.innerHTML = 0;
    total.innerHTML = 0 * priceValue;
  }

  sessionStorage.setItem(
    'cart',
    JSON.stringify(
      cartStorage.map((item) => {
        if (item._id === targetId) {
          item.quantity = newQuantityInput > 0 ? newQuantityInput : 0;
        }
        return item;
      }),
    ),
  );

  calculateOrderTotalPrice();
}

//실시간으로 상품계산 바뀌게(결제정보 x)
function calculateImmediatelyCart(id, item) {
  console.log(item.quantity);
  document.querySelector(`#total-${id}`).innerHTML = item.quantity * parseInt(item.price);
  document.querySelector(`#quantity-${id}`).innerHTML = item.quantity;
}

//수량 입력후 enter 입력시
function enterItemQuantity(event) {
  let cartStorage = JSON.parse(sessionStorage.getItem('cart'));
  const id = event.closest('.cart-product-item').dataset.id;
  console.log(event);

  sessionStorage.setItem('cart', JSON.stringify(cartStorage));
  // calculateImmediatelyCart();
}

//trashcan button 클릭시
function clickTrashCanButton(event) {
  const cartProductItem = event.closest('.cart-product-item');
  const id = cartProductItem.dataset.id;

  const cartStorage = JSON.parse(sessionStorage.getItem('cart')).filter((item) => item._id !== id);
  const orderStorage = JSON.parse(sessionStorage.getItem('order')).filter((item) => item !== id);

  sessionStorage.setItem('cart', JSON.stringify(cartStorage));
  sessionStorage.setItem('order', JSON.stringify(orderStorage));

  deleteNameStorageItem(id);
  cartProductItem.remove();
}

function deleteNameStorageItem(item) {
  let nameStorage = JSON.parse(sessionStorage.getItem('name'));
  nameStorage = nameStorage.filter((element) => element != item);
  sessionStorage.setItem('name', JSON.stringify(nameStorage));
}

//선택삭제 버튼 클릭시
function clickPartialDeleteLabel(event) {
  let orderStorage = JSON.parse(sessionStorage.getItem('order'));
  let cartStorage = JSON.parse(sessionStorage.getItem('cart'));

  orderStorage.forEach((item) => {
    document.querySelector(`#productItem-${item}`).remove();
    cartStorage = cartStorage.filter((element) => element._id !== item);
    orderStorage = orderStorage.filter((element) => element != element);
    deleteNameStorageItem(item);
    console.log(cartStorage);
  });
  console.log(orderStorage);
  sessionStorage.setItem('order', JSON.stringify(orderStorage));
  sessionStorage.setItem('cart', JSON.stringify(cartStorage));
  calculateOrderTotalPrice();
}

//어떤 버튼 클릭했는지 확인하기
function checkWhatIClick(event) {
  if (event.target.classList.contains('check-item')) checkingCheckBox(event.target);
  else if (event.target.closest('.btn-minus') || event.target.closest('.btn-plus')) {
    clickHandleQuantityButton(event.target);
  } else if (event.target.classList.contains('fa-trash-can')) clickTrashCanButton(event.target);

  event.target.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') enterItemQuantity(event.target);
  });
}

function App() {
  displayCartLIsts();
  calculateOrderTotalPrice();
  checkingAllCheckBox();

  //로딩 시 체크박스
  const cartStorage = JSON.parse(sessionStorage.getItem('cart'));

  if (cartStorage.length !== 0) {
    const orderStorage = JSON.parse(sessionStorage.getItem('order'));

    cartStorage.forEach((item) => {
      if (orderStorage.includes(item._id)) document.querySelector(`#checkbox-${item._id}`).checked = true;
      else document.querySelector(`#checkbox-${item._id}`).checked = false;
    });
  }
}

App();
