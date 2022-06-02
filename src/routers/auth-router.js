import { Router } from 'express';
import is from '@sindresorhus/is';
import qs from 'qs';
import { userService } from '../services';
import axios from 'axios';
import jwt from 'jsonwebtoken';
const authRouter = Router();

// auth/kakao로 들어온 것 처리
authRouter.get('/kakao', async (req, res, next) => {
  let token, user;
  // kakao 토큰 발급
  try {
    token = await axios({
      method: 'POST',
      url: 'https://kauth.kakao.com/oauth/token',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      data: qs.stringify({
        grant_type: 'authorization_code',
        client_id: process.env.KAKAO_CLIENT_ID,
        client_secret: process.env.KAKAO_CLIENT_SECRET,
        redirectUri: process.env.KAKAO_REDIRECT_URI,
        code: req.query.code,
      }),
    });
  } catch (err) {
    res.status(401).json({ error: `${err.message}` });
  }
  //accesstotken 확인
  try {
    user = await axios({
      method: 'GET',
      url: 'https://kapi.kakao.com/v2/user/me',
      headers: {
        Authorization: `Bearer ${token.data.access_token}`,
      },
    });
  } catch (err) {
    res.status(401).json({ error: `${err.message}` });
  }
  console.log(user.data);
  // 시크릿키
  const secretKey = process.env.JWT_SECRET_KEY || 'secret-key';
  // 중복가입자인지 확인
  try {
    const userData = await userService.duplicationUser(user.data.kakao_account.email);
    if (userData) {
      // 로그인 성공 -> JWT 웹 토큰 생성
      // 2개 프로퍼티를 jwt 토큰에 담음
      const suctoken = jwt.sign({ userId: userData._id, role: userData.role }, secretKey);
      res.cookie('token', suctoken);
      res.redirect('http://localhost:5070/auth');
    } else {
      const userInfo = {
        email: user.data.kakao_account.email,
        fullName: user.data.properties.nickname,
        userType: 'kakao',
        Oauth_refresh_token: token.data.refresh_token,
      };
      // DB 추가
      const newUser = await userService.addKakaoUser(userInfo);
      // 로그인 성공 -> JWT 웹 토큰 생성
      // 2개 프로퍼티를 jwt 토큰에 담음
      const suctoken = jwt.sign({ userId: newUser._id, role: newUser.role }, secretKey);
      res.cookie('token', suctoken);
      res.redirect('http://localhost:5070/auth');
    }
  } catch (err) {
    res.status(401).json({ error: `${err.message}` });
  }
});

export { authRouter };
