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
    subject: '소동이네 쇼핑몰 이메일 인증번호 발송',
    // 보내는 메일의 내용을 입력
    // text: 일반 text로 작성된 내용
    // html: html로 작성된 내용
    html: `<div style="padding: 70px 0; background: #f7f8f9">
    <div style="margin: 0 auto; width: 680px; color: #000">
        <h2 style="margin-bottom: 15px">
            <img
                src="https://shopping-mall-racer.s3.ap-northeast-2.amazonaws.com/logo.png"
            />
        </h2>
        <div
            style="
                padding: 30px 90px;
                text-align: center;
                border: 1px solid #dfdfdf;
                background: #fff;
            "
        >
            <h3
                style="
                    margin-bottom: 35px;
                    font-size: 30px;
                    font-weight: 600;
                    color: #ff7800;
                "
            >
                이메일 인증번호 발송
            </h3>
            <div style="padding: 10px 0 20px; border-top: 1px solid #333">
                <p style="font-size: 18px; font-weight: 600; line-height: 20px">
                    안녕하세요. 소동이네 쇼핑몰입니다.
                </p>
                <p style="font-size: 14px; font-weight: 600; line-height: 20px">
                    아래 인증 번호를 확인하시고 진행해주세요
                </p>
            </div>
            <div style="padding: 20px 30px; background: #ff7800">
                🎫 인증번호: <b>${generatedAuthNumber}</b>
            </div>
            <h3>🤫절대 타인에게 보여주지 마세요!</h3>
        </div>
        <div
            style="
                padding: 30px 95px 0;
                font-size: 12px;
                font-family: 'Dotum';
                line-height: 20px;
            "
        >
            <address style="margin-bottom: 15px; font-style: normal">
                소동이네 서울특별시 소동구 소동란로 119 타워 7층<br />
                TEL. 02-7777-7777~9
            </address>
            <div style="text-align: center">
                COPYRIGHT 2022 소동이네 ALL RIGHT RESERVED.
            </div>
        </div>
    </div>
</div>`,
  });
  console.log('Message sent: %s', info.messageId);
  return { generatedAuthNumber };
}
async function passwordMailer(email) {
  let generatedAuthNumber = Math.random().toString(36).slice(2);
  let info = await tranporter.sendMail({
    // 보내는 곳의 이름과, 메일 주소를 입력
    from: `"elice 6 Team" <${process.env.NODEMAILER_USER}>`,
    // 받는 곳의 메일 주소를 입력
    to: email,
    // 보내는 메일의 제목을 입력
    subject: '소동이네 쇼핑몰 임시 비밀번호 발송',
    // 보내는 메일의 내용을 입력
    // text: 일반 text로 작성된 내용
    // html: html로 작성된 내용
    html: `<div style="padding: 70px 0; background: #f7f8f9">
      <div style="margin: 0 auto; width: 680px; color: #000">
          <h2 style="margin-bottom: 15px">
              <img
                  src="https://shopping-mall-racer.s3.ap-northeast-2.amazonaws.com/logo.png"
              />
          </h2>
          <div
              style="
                  padding: 30px 90px;
                  text-align: center;
                  border: 1px solid #dfdfdf;
                  background: #fff;
              "
          >
              <h3
                  style="
                      margin-bottom: 35px;
                      font-size: 30px;
                      font-weight: 600;
                      color: #ff7800;
                  "
              >
                  임시 비밀번호 발송
              </h3>
              <div style="padding: 10px 0 20px; border-top: 1px solid #333">
                  <p style="font-size: 18px; font-weight: 600; line-height: 20px">
                      안녕하세요. 소동이네 쇼핑몰입니다.
                  </p>
                  <p style="font-size: 14px; font-weight: 600; line-height: 20px">
                      아래 임시비밀번호를 확인하시고 반드시 비밀번호 변경해주세요! 
                  </p>
              </div>
              <div style="padding: 20px 30px; background: #ff7800">
                  🔐 임시 비밀번호: <b>${generatedAuthNumber}</b>
              </div>
              <h3>🤫절대 타인에게 보여주지 마세요!</h3>
          </div>
          <div
              style="
                  padding: 30px 95px 0;
                  font-size: 12px;
                  font-family: 'Dotum';
                  line-height: 20px;
              "
          >
              <address style="margin-bottom: 15px; font-style: normal">
                  소동이네 서울특별시 소동구 소동란로 119 타워 7층<br />
                  TEL. 02-7777-7777~9
              </address>
              <div style="text-align: center">
                  COPYRIGHT 2022 소동이네 ALL RIGHT RESERVED.
              </div>
          </div>
      </div>
  </div>`,
  });
  console.log('Message sent: %s', info.messageId);
  return { generatedAuthNumber };
}
export { mailer, passwordMailer };
