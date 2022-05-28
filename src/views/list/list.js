// 주소 뒤 카테고리 단어 추출
const url = window.location.href
const stringUrl = decodeURI(url);
const urlSplit = stringUrl.split("/")
const urlId = urlSplit[urlSplit.length-2]
console.log(urlId)

// 카테고리 리스트
fetch('/api/categorylist')
	.then(res => res.json())
	.then(datas => {
		datas.forEach(data => {
			let categoryId = data.name;
			let itemList = [];
			// 카테고리명과 주소 뒤에 붙는 단어가 같을 시 해당 객체에서 카테고리 id 추출
			if(categoryId === urlId){
				categoryId = data._id
				// 추출한 카테고리 id를 이용하여 다시한번 카테고리에 해당하는 제품목록
				return fetch(`/api/productlist/${categoryId}`)
					.then(res=>res.json())
					.then(items => {
						items.forEach(item => itemList.push(item));
						displayItems(itemList);

						//HTML Display
						function displayItems(items){
							const ul = document.querySelector('.section-wrap');
							ul.innerHTML = items.map(parseToHTML).join('');
						}

						//데이터 -> HTML 변환 
						function parseToHTML(item){
							return `
								<li class="item" id="${item._id}">
									<a href="/product/detail/${item._id}" class="item-wrap">
										<div class="item-img">
											<img src="https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/happy-and-cheerful-dog-playing-fetch-with-toy-bone-royalty-free-image-1590068781.jpg?crop=0.668xw:1.00xh;0,0&resize=640:*" alt="">
										</div>
										<div class="item-text">
											<p class="name">${item.name}</p>
											<p class="price">${item.price}</p>
											<p class="description">${item.descriptionSummary}</p>
										</div>
									</a>
								</li>
							`;
						}

					});
			}
		});
	})
	

	

	