import { Router } from 'express';
import is from '@sindresorhus/is';
import { redisClient } from '../app';
// 폴더에서 import하면, 자동으로 폴더의 index.js에서 가져옴
import { loginRequired } from '../middlewares';
import { userService, mailer } from '../services';
import jwt from 'jsonwebtoken';

const userRouter = Router();

// 회원 유저 아이디값으로 탈퇴를 진행함.
userRouter.post('/user', loginRequired, async (req, res, next) => {
  try {
    const { currentPassword } = req.body;
    // currentPassword 없을 시, 진행 불가
    if (!currentPassword) {
      throw new Error('정보를 변경하려면, 현재의 비밀번호가 필요합니다.');
    }

    const userToken = req.headers['authorization']?.split(' ')[1];
    const secretKey = process.env.JWT_SECRET_KEY || 'secret-key';
    const jwtDecoded = jwt.verify(userToken, secretKey);
    const _id = jwtDecoded.userId;
    // body data로부터, 확인용으로 사용할 현재 비밀번호를 추출함.

    const userInfoRequired = { _id, currentPassword };
    const deleteUserInfo = await userService.delUser(userInfoRequired);
    res.status(200).json(deleteUserInfo);
  } catch (error) {
    // jwt.verify 함수가 에러를 발생시키는 경우는 토큰이 정상적으로 decode 안되었을 경우임.
    // 403 코드로 JSON 형태로 프론트에 전달함.
    res.status(403).json({
      result: 'forbidden-approach',
      reason: '정상적인 토큰이 아닙니다.',
    });
  }
});
// 요청이 들어오면 로그인이 되어있는지 미들웨어로 확인후 '단일'유저 정보를 json으로 보내줌
userRouter.get('/user', loginRequired, async (req, res, next) => {
  const userToken = req.headers['authorization']?.split(' ')[1];

  try {
    const secretKey = process.env.JWT_SECRET_KEY || 'secret-key';
    const jwtDecoded = jwt.verify(userToken, secretKey);
    const _id = jwtDecoded.userId;

    // 라우터에서 req.currentUserId를 통해 유저의 id에 접근 가능하게 됨

    const userdata = await userService.getUser(_id);
    res.status(200).json(userdata);
  } catch (error) {
    // jwt.verify 함수가 에러를 발생시키는 경우는 토큰이 정상적으로 decode 안되었을 경우임.
    // 403 코드로 JSON 형태로 프론트에 전달함.
    res.status(403).json({
      result: 'forbidden-approach',
      reason: '정상적인 토큰이 아닙니다.',
    });
  }
});

// Redis 메일인증 라우터
userRouter.post('/mailAuth', async (req, res, next) => {
  try {
    const mailAuth = await mailer(req.body.email);
    const redisSave = await redisClient.setEx(
      req.body.email,
      process.env.DEFAULT_EXPIRATION,
      mailAuth.generatedAuthNumber,
    );
    console.log(redisSave);
    res.status(200).json({ success: '메일발송성공' });
  } catch (err) {
    console.log(err);
    res.status(401).json({ error: '메일을 보내는것에 실패하였습니다.' });
  }
});
// Redis 인증번호 확인 라우터
userRouter.post('/authNumber', async (req, res, next) => {
  try {
    const redisGet = await redisClient.get(req.body.email, (err, reply) => {});
    if (req.body.authNumber === redisGet) {
      res.status(200).json({ success: '번호인증성공' });
    } else {
      res.status(401).json({ error: '유효기간이지났거나 인증번호가 다릅니다.' });
    }
  } catch (err) {
    res.status(401).json({ error: '인증에 문제가 생겨 실패했습니다.' });
  }
});
// 회원가입 api (아래는 /register이지만, 실제로는 /api/register로 요청해야 함.)
userRouter.post('/register', async (req, res, next) => {
  try {
    // Content-Type: application/json 설정을 안 한 경우, 에러를 만들도록 함.
    // application/json 설정을 프론트에서 안 하면, body가 비어 있게 됨.
    if (is.emptyObject(req.body)) {
      throw new Error('headers의 Content-Type을 application/json으로 설정해주세요');
    }

    // req (request)의 body 에서 데이터 가져오기
    const { fullName, email, password } = req.body;
    // 위 데이터를 유저 db에 추가하기
    const newUser = await userService.addUser({
      fullName,
      email,
      password,
    });

    // 추가된 유저의 db 데이터를 프론트에 다시 보내줌
    // 물론 프론트에서 안 쓸 수도 있지만, 편의상 일단 보내 줌
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
});

// 로그인 api (아래는 /login 이지만, 실제로는 /api/login로 요청해야 함.)
userRouter.post('/login', async function (req, res, next) {
  try {
    // application/json 설정을 프론트에서 안 하면, body가 비어 있게 됨.
    if (is.emptyObject(req.body)) {
      throw new Error('headers의 Content-Type을 application/json으로 설정해주세요');
    }

    // req (request) 에서 데이터 가져오기
    const email = req.body.email;
    const password = req.body.password;

    // 로그인 진행 (로그인 성공 시 jwt 토큰을 프론트에 보내 줌)
    const userToken = await userService.getUserToken({ email, password });

    // jwt 토큰을 프론트에 보냄 (jwt 토큰은, 문자열임)
    res.status(200).json(userToken);
  } catch (error) {
    next(error);
  }
});

// 전체 유저 목록을 가져옴 (배열 형태임)
// 미들웨어로 loginRequired 를 썼음 (이로써, jwt 토큰이 없으면 사용 불가한 라우팅이 됨)
userRouter.get('/userlist', loginRequired, async function (req, res, next) {
  try {
    // 전체 사용자 목록을 얻음
    const users = await userService.getUsers();

    // 사용자 목록(배열)을 JSON 형태로 프론트에 보냄
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
});

// 사용자 정보 수정
// (예를 들어 /api/users/abc12345 로 요청하면 req.params.userId는 'abc12345' 문자열로 됨)
userRouter.patch('/users/:_id', loginRequired, async function (req, res, next) {
  try {
    // content-type 을 application/json 로 프론트에서
    // 설정 안 하고 요청하면, body가 비어 있게 됨.
    if (is.emptyObject(req.body)) {
      throw new Error('headers의 Content-Type을 application/json으로 설정해주세요');
    }

    // params로부터 id를 가져옴
    const { _id } = req.params;

    // body data 로부터 업데이트할 사용자 정보를 추출함.
    const { fullName, password, address, phoneNumber, role, currentPassword } = req.body;

    // currentPassword 없을 시, 진행 불가
    if (!currentPassword) {
      throw new Error('정보를 변경하려면, 현재의 비밀번호가 필요합니다.');
    }

    const userInfoRequired = { _id, currentPassword };

    // 위 데이터가 undefined가 아니라면, 즉, 프론트에서 업데이트를 위해
    // 보내주었다면, 업데이트용 객체에 삽입함.
    const toUpdate = {
      ...(fullName && { fullName }),
      ...(password && { password }),
      ...(address && { address }),
      ...(phoneNumber && { phoneNumber }),
      ...(role && { role }),
    };

    // 사용자 정보를 업데이트함.
    const updatedUserInfo = await userService.setUser(userInfoRequired, toUpdate);

    // 업데이트 이후의 유저 데이터를 프론트에 보내 줌
    res.status(200).json(updatedUserInfo);
  } catch (error) {
    next(error);
  }
});
//회원 권한 수정 api
//jwt token으로 로그인된 계정이 admin인지 확인. 맞을 경우 userId의 role 변경
userRouter.patch('/admin/:_id/:newRole', loginRequired, async (req, res, next) => {
  try {
    const userToken = req.headers['authorization']?.split(' ')[1];
    const secretKey = process.env.JWT_SECRET_KEY || 'secret-key';
    const { role } = jwt.verify(userToken, secretKey);
    if (role !== 'admin') {
      throw new Error('admin이 아닙니다.');
    }
    const { _id, newRole } = req.params;
    // 권한을 수정할 유저 id를 얻음
    const user = await userService.setUserRoleByAdmin(_id, { role: newRole });
    // 유저 정보를 JSON 형태로 프론트에 보냄
    res.status(200).json(user);
    res.status(200).json();
  } catch (error) {
    next(error);
  }
});

//회원 정보 삭제 api
//jwt token으로 로그인된 계정이 admin인지 확인. 맞을 경우 userId=_id에 해당하는 값을 삭제
userRouter.delete('/admin/:_id', loginRequired, async (req, res, next) => {
  try {
    const userToken = req.headers['authorization']?.split(' ')[1];
    const secretKey = process.env.JWT_SECRET_KEY || 'secret-key';
    const { role } = jwt.verify(userToken, secretKey);
    if (role !== 'admin') {
      throw new Error('admin이 아닙니다.');
    }
    const { _id } = req.params;
    // 삭제할 유저 id를 얻음
    const user = await userService.delUserByAdmin(_id);
    // 유저 정보를 JSON 형태로 프론트에 보냄
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
});
export { userRouter };
