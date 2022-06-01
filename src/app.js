import cors from 'cors';
import express from 'express';
import { viewsRouter, userRouter, productRouter, categoryRouter, orderRouter } from './routers';
import { errorHandler } from './middlewares';
import morgan from 'morgan';
import * as redis from 'redis';
const app = express();
// CORS 에러 방지
app.use(cors());
app.use(morgan('dev'));

const redisClient = redis.createClient({ url: `${process.env.REDIS_URL}` });
redisClient.connect();
redisClient.on('error', (err) => {
  console.log(err);
});
redisClient.on('ready', () => {
  console.log('정상적으로 Redis 서버에 연결되었습니다.');
});

// Content-Type: application/json 형태의 데이터를 인식하고 핸들링할 수 있게 함.
app.use(express.json());

// Content-Type: application/x-www-form-urlencoded 형태의 데이터를 인식하고 핸들링할 수 있게 함.
app.use(express.urlencoded({ extended: false }));

// html, css, js 라우팅
app.use(viewsRouter);

// api 라우팅
// 아래처럼 하면, userRouter 에서 '/login' 으로 만든 것이 실제로는 앞에 /api가 붙어서
// /api/login 으로 요청을 해야 하게 됨. 백엔드용 라우팅을 구분하기 위함임.
app.use('/api', userRouter);
app.use('/api', productRouter);
app.use('/api', categoryRouter);
app.use('/api', orderRouter);

// 순서 중요 (errorHandler은 다른 일반 라우팅보다 나중에 있어야 함)
// 그래야, 에러가 났을 때 next(error) 했을 때 여기로 오게 됨
app.use(errorHandler);
// public 폴더 접근
app.use(express.static('public'));
export { app, redisClient };
