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
                src="https://s3.us-west-2.amazonaws.com/secure.notion-static.com/ba0f48e5-4712-45eb-bda3-1431830b2627/%EC%86%8C%EB%8F%99%EC%9D%B4%EB%84%A4%EB%A1%9C%EA%B3%A0_%281%29.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20220601%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20220601T054439Z&X-Amz-Expires=86400&X-Amz-Signature=22f5da23ddad679a37db9004effd517996958cfd7d174e135d51d66a4c27aa90&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22%25EC%2586%258C%25EB%258F%2599%25EC%259D%25B4%25EB%2584%25A4%25EB%25A1%259C%25EA%25B3%25A0%2520%281%29.png%22&x-id=GetObject"
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
                  src="https://s3.us-west-2.amazonaws.com/secure.notion-static.com/ba0f48e5-4712-45eb-bda3-1431830b2627/%EC%86%8C%EB%8F%99%EC%9D%B4%EB%84%A4%EB%A1%9C%EA%B3%A0_%281%29.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20220601%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20220601T054439Z&X-Amz-Expires=86400&X-Amz-Signature=22f5da23ddad679a37db9004effd517996958cfd7d174e135d51d66a4c27aa90&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22%25EC%2586%258C%25EB%258F%2599%25EC%259D%25B4%25EB%2584%25A4%25EB%25A1%259C%25EA%25B3%25A0%2520%281%29.png%22&x-id=GetObject"
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
