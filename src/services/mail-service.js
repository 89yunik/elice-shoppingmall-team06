import nodemailer from 'nodemailer';

let tranporter = nodemailer.createTransport({
  // 사용하고자 하는 서비스, gmail계정으로 전송할 예정이기에 'gmail'
  service: 'gmail',
  // host를 gmail로 설정
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    // Gmail 주소 입력
    user: process.env.NODEMAILER_USER,
    // Gmail 패스워드 입력
    pass: process.env.NODEMAILER_PASS,
  },
});

async function mailer(email) {
  let generatedAuthNumber = Math.random().toString(36).slice(2);
  let info = await tranporter.sendMail({
    // 보내는 곳의 이름과, 메일 주소를 입력
    from: `"elice 6 Team" <${process.env.NODEMAILER_USER}>`,
    // 받는 곳의 메일 주소를 입력
    to: email,
    // 보내는 메일의 제목을 입력
    subject: '강아지 쇼핑몰 6팀 인증 넘버',
    // 보내는 메일의 내용을 입력
    // text: 일반 text로 작성된 내용
    // html: html로 작성된 내용
    html: `<h2>🐕 강아지 쇼핑몰 6팀 인증</h2>🎫 인증번호: <b>${generatedAuthNumber}</b><h3>🤫절대 타인에게 보여주지 마세요!</h3>`,
  });
  console.log('Message sent: %s', info.messageId);
  return { generatedAuthNumber };
}

export { mailer };
