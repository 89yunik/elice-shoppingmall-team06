let itemStorage = [];
let orderStorage = [];

function makeCartList(data, sameProductCount) {
  const id = data._id;
  const cartProducts = document.querySelector('#cartProductsContainer');
  const cartItem = `<div class="cart-product-item" id="productItem-${data._id}">
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
        value="${sameProductCount}"
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
    <p id="quantity-${id}">${sameProductCount}</p>
    <p>
      <span class="icon">
        <i class="fas fa-thin fa-equals" aria-hidden="true"></i>
      </span>
    </p>
    <p id="total-${id}">${data.price * sameProductCount}원</p>
  </div>
</div>`
cartProducts.insertAdjacentHTML('beforeend', cartItem);

}

document.querySelector('.cart-products-container').addEventListener('click', (e) => {
  //개별 삭제
  if(e.target.classList.contains('fa-trash-can')) {
    const deleteItemTarget = e.target.parentElement.parentElement.parentElement;
    const id = deleteItemTarget.id.substring(12);
    itemStorage = itemStorage.filter(item => item._id !== id);
    sessionStorage.setItem('cart', JSON.stringify(itemStorage));
    deleteItemTarget.remove();
  }
});

// 왜 
// if(e.target.classList.contains('delete-button')) {
//   console.log('delete');
// }
// 하면 작동하지 않지?

//전체 선택
document.querySelector('#allSelectCheckbox').addEventListener('click', (e) => {
  const checkboxes = document.querySelectorAll('.check-item');
  for(let i = 0; i< checkboxes.length; i++) {
    checkboxes[i].checked = e.target.checked;
  }
})


const savedCartItems = sessionStorage.getItem('cart');
const totalPriceExceptDelivery = document.querySelector('#productsTotal');
const totalPrice = document.querySelector('.total-price')


if(savedCartItems !== null) {
  const parsedCartItems = JSON.parse(savedCartItems);
  itemStorage = parsedCartItems;
  let productPriceSum = 0;
  parsedCartItems.forEach(element => {
    makeCartList(element, 1);
    productPriceSum += element.price;
  });
  totalPriceExceptDelivery.innerHTML = productPriceSum;
  totalPrice.innerHTML = parseInt(totalPriceExceptDelivery.innerText) + 3000;
}

