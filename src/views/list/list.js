let itemList = [];

//fetch 받아오기
async function getItems(){
	// return fetch('./list.json')
	// .then(res=>res.json());
	return fetch('/api/productlist')
		.then(res=>res.json())
}

//HTML Display
function displayItems(items, type){
	const ul = document.querySelector('.section-wrap');
	if(type){
		ul.innerHTML = items.filter(val=>val.type === type).map(parseToHTML).join('');
	}
	else ul.innerHTML = items.map(parseToHTML).join('');

}

//데이터 -> HTML 변환 
function parseToHTML(item){
	return `
		<li class="item" id="${item._id}">
			<a href="/productlist/:productId" class="item-wrap">
				<div class="item-img">
					<img src="https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/happy-and-cheerful-dog-playing-fetch-with-toy-bone-royalty-free-image-1590068781.jpg?crop=0.668xw:1.00xh;0,0&resize=640:*" alt="">
				</div>
				<div class="item-text">
					<p class="name">${item.name}</p>
					<p class="price">${item.price}</p>
					<p class="description">${item.description}</p>
				</div>
			</a>
		</li>
	`;
}

// 페이지 로드시 목록 자동추가
window.onload = ()=>{
	getItems()
	.then(items => {
		items.forEach(item => itemList.push(item));
		displayItems(itemList);
	});
};