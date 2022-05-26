//order, cart 크기 비교해서 전체선택 버튼 조건
//1. 처음 렌더링할때 storage에서 order를 가져와서 빈배열이면 다 넣어주고, 아니면 그에 맞게...

let itemStorage = [];

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

document.querySelector('#allSelectCheckbox').checked = true;
document.querySelector('.cart-products-container').addEventListener('click', (e) => {
  //개별 삭제
  if(e.target.classList.contains('fa-trash-can')) {
    // const deleteItemTarget = e.target.parentElement.parentElement.parentElement;
    const deleteItemTarget = e.target.closest('.cart-product-item');
    
    const id = deleteItemTarget.id.substring(12);
    itemStorage = itemStorage.filter(item => item._id !== id);
    sessionStorage.setItem('cart', JSON.stringify(itemStorage));
    deleteItemTarget.remove();
  }

  //plus 버튼  
  if(e.target.classList.contains('fa-plus')) {
    // console.log(e.target.closest('.input').value);
    let count;
    let newItemStorage = [];
    // document.querySelector('.quantity .input').value = count;    
    
    const productNode = e.target.closest('.cart-product-item');
    const newCal = productNode.querySelector('.calculation');
    let updateProductPriceSum = 0;
    JSON.parse(sessionStorage.getItem('cart')).forEach(item => {
      if(productNode.id.includes(item._id)) {
        count = parseInt(item.quantity);
        count++;
        item.quantity = count;
        console.log(item);
      }

      updateProductPriceSum+= (item.price * item.quantity);

      newItemStorage.push(item);
      sessionStorage.setItem('cart', JSON.stringify(newItemStorage))
    })
    document.querySelector('#productsTotal').innerText = updateProductPriceSum;
    document.querySelector('#orderTotal').innerHTML = updateProductPriceSum + 3000;
    console.log(productNode.querySelector('.input'));
    // count = productNode.querySelector('.input').value;
    
    productNode.querySelector('.input').value = count;
    
    // productNode.closest('')

    for (let i = 0; i < newCal.childNodes.length; i++) {
      if(typeof (newCal.childNodes[i].id) === 'string' && newCal.childNodes[i].id.includes('quantity')) {
        newCal.childNodes[i].innerText = count;
      }
      if(typeof (newCal.childNodes[i].id) === 'string' && newCal.childNodes[i].id.includes('total')) {
        JSON.parse(sessionStorage.getItem('cart')).forEach(item => {
          if  (newCal.childNodes[i].id.includes(item._id)) {
            newCal.childNodes[i].innerText = parseInt(item.price)*count;
          }
        })
      }
    }

  }
});





const savedCartItems = sessionStorage.getItem('cart');
const totalPriceExceptDelivery = document.querySelector('#productsTotal');
const totalPrice = document.querySelector('.total-price')


  

const parsedCartItems = JSON.parse(savedCartItems);

let productPriceSum = 0;
function newLoading() {
  parsedCartItems.forEach(element => {
  // let count = document.querySelector('.quantity .input').value;
  // console.log(count.value);
  const quantity = element.quantity;
  makeCartList(element,quantity);
  productPriceSum += (element.price*quantity);
  
  });
}

if(savedCartItems !== null) {
  let orderStorage = []
  itemStorage = parsedCartItems;
  parsedCartItems.forEach(item => {
    orderStorage.push(item._id);
  })
  
  sessionStorage.setItem('order', JSON.stringify(orderStorage));
  newLoading();
  
  
}



  const checkItems = document.querySelectorAll('.check-item')
  totalPriceExceptDelivery.innerHTML = productPriceSum;
  totalPrice.innerHTML = parseInt(totalPriceExceptDelivery.innerText) + 3000;
  // console.log
  
  function handleOrderSessionStorage(event) {
    let mainOrderStorage = JSON.parse(sessionStorage.getItem('order'));
    let test;
    const id = event.target.id.substring(9);
      if(event.target.checked) {
        mainOrderStorage.push(id);
      } else if(!event.target.checked) {
        // mainOrderStorage = mainOrderStorage.filter(item => item !== id);
        mainOrderStorage = mainOrderStorage.filter(item => item !== id);
      }
      sessionStorage.setItem('order', JSON.stringify(mainOrderStorage))

      
    }
  //전체 선택
  document.querySelector('#allSelectCheckbox').addEventListener('click', (event) => {
    const checkboxes = document.querySelectorAll('.check-item');
    console.log(checkboxes);
    const originStorage = JSON.parse(sessionStorage.getItem('order'));
    let testArr = [];
    
    checkboxes.forEach(item => {
      item.checked = event.target.checked
      const id = item.id.split('-')[1]
      if(event.target.checked) {
        testArr.push(id);
      } 

    });
    sessionStorage.setItem('order', JSON.stringify(testArr));

  })

  checkItems.forEach(element => {
    element.addEventListener('click', (event) => {
      handleOrderSessionStorage(event)
      // event.target.checked = false;
    })
  })


