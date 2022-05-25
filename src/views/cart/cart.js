function makeCartList(data, sameProductCount) {
  const id = data._id;
  const cartItem = `<div class="cart-product-item" id="productItem-">
  <label class="checkbox">
    <input type="checkbox" id="checkbox-${id}" checked="" />
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
const cartProducts = document.querySelector('#cartProductsContainer');
cartProducts.insertAdjacentHTML('beforeend', cartItem);
}


const savedCartItems = sessionStorage.getItem('cart');

if(savedCartItems !== null) {
  const parsedCartItems = JSON.parse(savedCartItems);
  parsedCartItems.forEach(element => {
    makeCartList(element, 1);
  });
}

