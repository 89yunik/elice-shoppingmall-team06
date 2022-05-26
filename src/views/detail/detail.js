// url id 분리
const url = window.location.href
const urlSplit = url.split("/")
const urlId = urlSplit[urlSplit.length-2]



//fetch 받아오기
async function getItems(){
	return fetch(`/api/productlist/${urlId}`)
		.then(res=>res.json())
}

//데이터 -> HTML 변환 
function parseToHTML(item){
	const category = document.querySelector('.category');
	const title = document.querySelector('.title');
	const price = document.querySelector('.price');
	const description = document.querySelector('.description');

	category.innerHTML = `${item.name}`;
	title.innerHTML = `${item.name}`;
	price.innerHTML = `${item.price}`;
	description.innerHTML = `${item.description}`;
}

// 페이지 로드시 목록 자동추가
window.onload = ()=>{
	getItems()
	.then(item => {
		parseToHTML(item);
	});
};



