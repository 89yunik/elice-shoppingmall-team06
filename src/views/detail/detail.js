// 페이지 로딩 시 한번 리로딩 - 뒤로가기 버튼 클릭 시 남아있는 캐시로 인한 오류 보완
$(window).bind("pageshow", function(event) {
	if (event.originalEvent.persisted) {
			document.location.reload();
	}
});

// url id 분리
const url = window.location.href
const urlSplit = url.split("/")
const urlId = urlSplit[urlSplit.length-2]
const sessionArr = [];
const testArr = [];
const sessionId = [];


//fetch 받아오기
async function getItems(){
	return fetch(`/api/products/${urlId}`)
		.then(res=>res.json())
}

const af = sessionStorage.getItem("cart")
const fa = JSON.parse(af)
const sd = sessionStorage.getItem("productName")
const ds = JSON.parse(sd)
if(fa !== null){
	for(let i=0; i<fa.length; i++){
		sessionArr.push(fa[i])
		testArr.push(ds[i])
	}
}

// for(let i=0; i<sessionArr.length; i++){
// 	const SSname = fa[i]._id;
// 	const SSprice = fa[i].price;
// 	const SSquantity = fa[i].quantity;
// }

// const productInfo = [{
// 	"name":SSname,
// 	"price":SSprice
// }]


//데이터 -> HTML 변환 
function parseToHTML(item){
	const category = document.querySelector('.category');
	const title = document.querySelector('.title');
	const price = document.querySelector('.price');
	const description = document.querySelector('.description');
	
	category.innerHTML = `${item.name}`;
	title.innerHTML = `${item.name}`;
	price.innerHTML = `${item.price}`;
	description.innerHTML = `${item.descriptionDetail}`;


	//장바구니 추가
	const cart = document.querySelector(".add-to-cart")

	
	async function addToCart(e) {
		e.preventDefault();
		
		const productInfo = {
			"name":`${item.name}`,
			"price":`${item.price}`,
			"quantity":1
		}
		// console.log(JSON.stringify(productInfo.name))
			// if(sessionArr[i].name === `${item.name}`){
			// 	alert("해당 제품이 장바구니에 있습니다.")
			// }
			

		// if(bbbb.indexOf(JSON.stringify(productInfo)) >= 0 ){
		// 	alert("해당 제품이 장바구니에 있습니다.")
		// }
		if(testArr.indexOf(productInfo.name) >= 0 ){
			alert("해당 제품이 장바구니에 있습니다.")
		}
		else {
			sessionArr.push(productInfo)
			testArr.push(productInfo.name)
			alert("장바구니에 추가되었습니다.")
		}
		

		sessionStorage.setItem("cart", JSON.stringify(sessionArr))
		sessionStorage.setItem("productName", JSON.stringify(testArr))
	}
	cart.addEventListener("click", addToCart)
}


// 페이지 로드시 목록 자동추가
window.onload = ()=>{
	getItems()
		.then(item => {
			parseToHTML(item);
		});
	
};



