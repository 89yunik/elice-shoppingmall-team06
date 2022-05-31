import { Router } from 'express';
import is from '@sindresorhus/is';
// 폴더에서 import하면, 자동으로 폴더의 index.js에서 가져옴
import { orderService } from '../services';
import { loginRequired } from '../middlewares';
import jwt from 'jsonwebtoken';
const orderRouter = Router();
//해당 사용자 주문 조회 API
orderRouter.get('/order', loginRequired, async (req, res, next) => {
  try {
    const userToken = req.headers['authorization']?.split(' ')[1];
    const secretKey = process.env.JWT_SECRET_KEY || 'secret-key';
    const jwtDecoded = jwt.verify(userToken, secretKey);
    const userId = jwtDecoded.userId;
    // 라우터에서 req.currentUserId를 통해 유저의 id에 접근 가능하게 됨
    const orderdata = await orderService.getOrder(userId);
    res.status(200).json(orderdata);
  } catch (error) {
    // jwt.verify 함수가 에러를 발생시키는 경우는 토큰이 정상적으로 decode 안되었을 경우임.
    // 403 코드로 JSON 형태로 프론트에 전달함.
    res.status(403).json({
      result: 'forbidden-approach',
      reason: '정상적인 토큰이 아닙니다.',
    });
  }
});

// 오더 등록 api (아래는 /orderregister이지만, 실제로는 /api/orderregister로 요청해야 함.)
orderRouter.post('/orderregister', loginRequired, async (req, res, next) => {
  try {
    // Content-Type: application/json 설정을 안 한 경우, 에러를 만들도록 함.
    // application/json 설정을 프론트에서 안 하면, body가 비어 있게 됨.
    if (is.emptyObject(req.body)) {
      throw new Error('headers의 Content-Type을 application/json으로 설정해주세요');
    }

    // req (request)의 body 에서 데이터 가져오기
    const newOrderData = req.body;

    // 위 데이터를 제품 db에 추가하기
    const newOrder = await orderService.addOrder(newOrderData);

    // 추가된 제품의 db 데이터를 프론트에 다시 보내줌
    // 물론 프론트에서 안 쓸 수도 있지만, 편의상 일단 보내 줌
    res.status(201).json(newOrder);
  } catch (error) {
    next(error);
  }
});

// 주문 전체 목록을 가져옴 (배열 형태임)(관리자만가능)
orderRouter.get('/orderlist', loginRequired, async function (req, res, next) {
  try {
    const userToken = req.headers['authorization']?.split(' ')[1];
    const secretKey = process.env.JWT_SECRET_KEY || 'secret-key';
    const jwtDecoded = jwt.verify(userToken, secretKey);
    const role = jwtDecoded.role;
    // admin만 접근 가능하게 만듬.
    if (role === 'admin') {
      const orders = await orderService.getOrders();
      res.status(200).json(orders);
    } else {
      res.status(403).json({ result: 'forbidden-approach', reason: 'admin이 아닙니다.' });
    }
  } catch (error) {
    next(error);
  }
});

// 오더 수정 api
// (예를 들어 /api/orders/abc12345 로 요청하면 req.params.categoryId는 'abc12345' 문자열로 됨)
orderRouter.patch('/order/:_id', loginRequired, async function (req, res, next) {
  try {
    const userToken = req.headers['authorization']?.split(' ')[1];
    const secretKey = process.env.JWT_SECRET_KEY || 'secret-key';
    const jwtDecoded = jwt.verify(userToken, secretKey);
    const role = jwtDecoded.role;
    // admin만 접근 가능하게 만듬.
    // content-type 을 application/json 로 프론트에서
    // 설정 안 하고 요청하면, body가 비어 있게 됨.
    if (is.emptyObject(req.body)) {
      throw new Error('headers의 Content-Type을 application/json으로 설정해주세요');
    }
    if (role === 'admin') {
      // params로부터 id를 가져옴
      const { _id } = req.params;

      // body data 로부터 업데이트할 오더 정보를 추출함.
      // 위 데이터가 undefined가 아니라면, 즉, 프론트에서 업데이트를 위해
      // 보내주었다면, 업데이트용 객체에 삽입함.
      const toUpdate = req.body || {};

      // 제품 정보를 업데이트함.
      const updatedOrderInfo = await orderService.setOrder(_id, toUpdate);

      // 업데이트 이후의 유저 데이터를 프론트에 보내 줌
      res.status(200).json(updatedOrderInfo);
    } else {
      res.status(403).json({ result: 'forbidden-approach', reason: 'admin이 아닙니다.' });
    }
  } catch (error) {
    next(error);
  }
});

// 오더 삭제 api
orderRouter.delete('/order/:_id', loginRequired, async function (req, res, next) {
  try {
    const { _id } = req.params;
    // 삭제할 카테고리 id를 얻음
    const order = await orderService.deleteOrder(_id);
    // 오더 정보를 JSON 형태로 프론트에 보냄
    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
});

export { orderRouter };
