import jwt from 'jsonwebtoken';
function viewhandler(req, res, next) {
  console.log(req.headers);
  // request 헤더로부터 authorization bearer 토큰을 받음.
  const userToken = req.headers['authorization']?.split(' ')[1];

  // 이 토큰은 jwt 토큰 문자열이거나, 혹은 "null" 문자열이거나, undefined임.
  // 토큰이 "null" 일 경우, login_required 가 필요한 서비스 사용을 제한함.
  if (!userToken || userToken === 'null') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.write(`<script>alert('로그인 해주세요🥲')</script>`, `utf-8`);
    res.write(`<script>window.location='http://localhost:5070/login'</script>`);

    return;
  }

  // 해당 token 이 정상적인 token인지 확인
  try {
    const secretKey = process.env.JWT_SECRET_KEY || 'secret-key';
    const jwtDecoded = jwt.verify(userToken, secretKey);

    const { role } = jwtDecoded;
    if (role === 'admin') {
      next();
    } else {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.write(`<script>alert('관리자만 접근 가능합니다.🥲')</script>`, `utf-8`);
    }
  } catch (error) {
    // jwt.verify 함수가 에러를 발생시키는 경우는 토큰이 정상적으로 decode 안되었을 경우임.
    // 403 코드로 JSON 형태로 프론트에 전달함.
    res.status(403).json({
      result: 'forbidden-approach',
      reason: '정상적인 토큰이 아닙니다.',
    });

    return;
  }
}

export { viewhandler };
