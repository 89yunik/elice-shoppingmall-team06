import { Router } from 'express';
import is from '@sindresorhus/is';
// 폴더에서 import하면, 자동으로 폴더의 index.js에서 가져옴
import { categoryService } from '../services';

const categoryRouter = Router();

// 카테고리 등록 api (아래는 /categoryregister이지만, 실제로는 /api/categoryregister로 요청해야 함.)
categoryRouter.post('/categoryregister', async (req, res, next) => {
  try {
    // Content-Type: application/json 설정을 안 한 경우, 에러를 만들도록 함.
    // application/json 설정을 프론트에서 안 하면, body가 비어 있게 됨.
    if (is.emptyObject(req.body)) {
      throw new Error('headers의 Content-Type을 application/json으로 설정해주세요');
    }

    // 위 데이터를 카테고리 db에 추가하기
    const newCategory = await categoryService.addCategory(req.body);
    // 추가된 카테고리의 db 데이터를 프론트에 다시 보내줌
    // 물론 프론트에서 안 쓸 수도 있지만, 편의상 일단 보내 줌
    res.status(201).json(newCategory);
  } catch (error) {
    next(error);
  }
});

// 카테고리 목록 api
// 전체 카테고리 목록을 가져옴 (배열 형태임)
categoryRouter.get('/categorylist', async function (req, res, next) {
  try {
    // 전체 카테고리 목록을 얻음
    const categories = await categoryService.getCategories();
    // 카테고리 목록(배열)을 JSON 형태로 프론트에 보냄
    res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
});

// 카테고리 수정 api
// (예를 들어 /api/category/abc12345 로 요청하면 req.params._id는 'abc12345' 문자열로 됨)
categoryRouter.patch('/category/:_id', async function (req, res, next) {
  try {
    // content-type 을 application/json 로 프론트에서
    // 설정 안 하고 요청하면, body가 비어 있게 됨.
    if (is.emptyObject(req.body)) {
      throw new Error('headers의 Content-Type을 application/json으로 설정해주세요');
    }

    // body data 로부터 업데이트할 사용자 정보를 추출함.
    // 위 데이터가 undefined가 아니라면, 즉, 프론트에서 업데이트를 위해
    // 보내주었다면, 업데이트용 객체에 삽입함.

    // 카테고리 정보를 업데이트함.
    const updatedCategoryInfo = await categoryService.setCategory(req.params._id, req.body);

    // 업데이트 이후의 유저 데이터를 프론트에 보내 줌
    res.status(200).json(updatedCategoryInfo);
  } catch (error) {
    next(error);
  }
});

// 카테고리 삭제 api
categoryRouter.delete('/category/:_id', async function (req, res, next) {
  try {
    // 삭제할 카테고리 _id를 얻음
    const category = await categoryService.deleteCategory(req.params._id);
    // 카테고리 정보를 JSON 형태로 프론트에 보냄
    res.status(200).json(category);
  } catch (error) {
    next(error);
  }
});

export { categoryRouter };