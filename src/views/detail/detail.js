import * as Api from '/api.js'

// url id 분리
const url = window.location.href
const urlSplit = url.split("/")
const urlId = urlSplit[urlSplit.length-2]

//fetch 받아오기
async function getItems(){
	let item = await Api.get(`/api/product/${urlId}`);
	parseToHTML(item)
	return
}
getItems();

//데이터 -> HTML 변환 
function parseToHTML(item){
	const category = document.querySelector('.category');
	const title = document.querySelector('.title');
	const price = document.querySelector('.price');
	const description = document.querySelector('.description');
	const detailImg = document.querySelector('.detail-image > .wrap')
	
	category.innerHTML = `${item.name}`;
	title.innerHTML = `${item.name}`;
	price.innerHTML = `${item.price}원`;
	description.innerHTML = `${item.descriptionDetail}`;
	detailImg.innerHTML = `<img src="${item.imageUrl}" alt="">`

	const productInfo = {
		"_id":`${item._id}`,
		"name":`${item.name}`,
		"price":`${item.price}`,
		"quantity":1,
		"imageUrl":`${item.imageUrl}`
	}

	//장바구니 추가
	const cartBtn = document.querySelector(".add-to-cart")
	
	async function addToCart(e) {
		e.preventDefault();
		const sessionArr = JSON.parse(localStorage.getItem("cart")) || [];
		const getCart = sessionStorage.getItem("cart")
		const parseCart = JSON.parse(getCart)

		const nameArr = JSON.parse(localStorage.getItem("name")) || [];
		const getName = sessionStorage.getItem("name")
		const parseName = JSON.parse(getName)

		const orderArr = JSON.parse(localStorage.getItem("order")) || [];

		if(parseCart !== null){
			for(let i=0; i<parseName.length; i++){
				sessionArr.push((parseCart[i]))
				nameArr.push(parseName[i])
				orderArr.push(parseCart[i]["_id"])
			}
		}

		// object 형태의 객체는 indexof가 먹히지 않아 stringify로 변환해줌
		let SAmap = nameArr.map(JSON.stringify)

		if(SAmap.indexOf(JSON.stringify(productInfo._id)) >= 0 ){
			alert("해당 제품이 장바구니에 있습니다.")
		}
		else {
			sessionArr.push(productInfo)
			nameArr.push(productInfo._id)
			orderArr.push(productInfo._id)
			alert("장바구니에 추가되었습니다.")
		}
		sessionStorage.setItem("cart", JSON.stringify(sessionArr))
		sessionStorage.setItem("name", JSON.stringify(nameArr))
		sessionStorage.setItem("order", JSON.stringify(orderArr))
	}
	cartBtn.addEventListener("click", addToCart)
}


// 바로 구매하기
let quickBtn = document.querySelector(".quick-buy")

async function quickBuy(e) {
	e.preventDefault();
	let item = await Api.get(`/api/product/${urlId}`);
	location.href=`/order/order.html`+`?id=${item._id}&quantity=1`;
}

quickBtn.addEventListener("click", quickBuy)




