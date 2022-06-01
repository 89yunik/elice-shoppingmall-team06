import { Router } from 'express';
import is from '@sindresorhus/is';
// 폴더에서 import하면, 자동으로 폴더의 index.js에서 가져옴
import { productService } from '../services';
import { uploadFile } from '../s3';
import multer from 'multer';

const productRouter = Router();
const upload = multer({ dest: 'public/images' });

// 제품 등록 api (아래는 /productregister이지만, 실제로는 /api/productregister로 요청해야 함.)
productRouter.post('/productregister', upload.single('image'), async (req, res, next) => {
  try {
    // s3에 이미지 업로드
    const file = req.file;
    if (file) {
      const result = await uploadFile(file);
      req.body.imageUrl = await result.Location;
    }
    if (req.body.image) {
      delete req.body.image;
    }
    // 위 데이터를 제품 db에 추가하기
    const newProduct = await productService.addProduct(req.body);
    // 추가된 제품의 db 데이터를 프론트에 다시 보내줌
    // 물론 프론트에서 안 쓸 수도 있지만, 편의상 일단 보내 줌
    res.status(201).json(newProduct);
  } catch (error) {
    next(error);
  }
});

// 제품 목록 api
// 전체 제품 목록을 가져옴 (배열 형태임)
productRouter.get('/productlist', async function (req, res, next) {
  try {
    // 전체 제품 목록을 얻음
    const products = await productService.getProducts();
    // 제품 목록(배열)을 JSON 형태로 프론트에 보냄
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
});

//카테고리별 제품 목록 api
//category에 해당하는 제품 목록을 가져옴
productRouter.get('/productlist/:category', async function (req, res, next) {
  try {
    // category에 해당하는 제품 목록을 얻음
    const { category } = req.params;
    const products = await productService.getProductsByCategory(category);
    // 제품 목록(배열)을 JSON 형태로 프론트에 보냄
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
});

//제품 상세 api
//_id에 해당하는 제품 정보를 가져옴
productRouter.get('/product/:_id', async function (req, res, next) {
  try {
    const product = await productService.getProductById(req.params._id);
    // 제품 정보를 JSON 형태로 프론트에 보냄
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
});

// 제품 수정 api
// (예를 들어 /api/product/abc12345 로 요청하면 req.params._id는 'abc12345' 문자열로 됨)
productRouter.patch('/product/:_id', async function (req, res, next) {
  try {
    // content-type 을 application/json 로 프론트에서
    // 설정 안 하고 요청하면, body가 비어 있게 됨.
    if (is.emptyObject(req.body)) {
      throw new Error('headers의 Content-Type을 application/json으로 설정해주세요');
    }

    // body data 로부터 업데이트할 사용자 정보를 추출함.
    // 위 데이터가 undefined가 아니라면, 즉, 프론트에서 업데이트를 위해
    // 보내주었다면, 업데이트용 객체에 삽입함.
    // 제품 정보를 업데이트함.
    const updatedProductInfo = await productService.setProduct(req.params._id, req.body);

    // 업데이트 이후의 제품 데이터를 프론트에 보내 줌
    res.status(200).json(updatedProductInfo);
  } catch (error) {
    next(error);
  }
});

// 제품 삭제 api
productRouter.delete('/product/:_id', async function (req, res, next) {
  try {
    const product = await productService.deleteProduct(req.params._id);
    // 제품 정보를 JSON 형태로 프론트에 보냄
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
});

export { productRouter };
