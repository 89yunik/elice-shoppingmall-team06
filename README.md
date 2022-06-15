# 🐶 소동이네 프로젝트

![image](/public/images/showcase.jpg)

> 애견용품들을 조회하고 👀, <br>장바구니에 추가하고 🧸,<br>
> 또 주문을 할 수 있는 쇼핑몰 웹 서비스 제작 프로젝트입니다. <br />

### http://kdt-sw2-seoul-team06.elicecoding.com/
(현재 보안 이슈로 .env 파일을 수정하여 관련 기능이 동작하지 않습니다.)
<br>

\*\* 핵심 기능은 하기입니다. <br>

1. 회원가입, 로그인, 회원정보 수정/삭제 등 **유저 정보 관련 CRUD**
2. 유저들 중 관리자가 존재하여 관련 기능 사용 가능함.
   - 제품 추가/수정/삭제 등 **제품 관련 CRUD**
   - 카테고리 추가/조회/수정/삭제 등 **제품 카테고리 관련 CRUD**
   - **주문 상태 수정 및 삭제**가 가능함.

3. **제품 목록**을 조회 및, **제품 상세 정보**를 조회 가능함.
4. 장바구니에 제품을 추가할 수 있으며, **장바구니에서 CRUD** 작업이 가능함.
   - 장바구니는 서버 DB가 아닌, 프론트 단에서 저장 및 관리됨 (sessionStorage)
5. 장바구니에서 주문을 진행하며, **주문 완료 후 조회 및 삭제**가 가능함.

## 서비스 구성도
![image](https://user-images.githubusercontent.com/78011716/173219153-bf36d2d8-66de-4dc0-9e06-52fca2600a6a.png)

## 주요 사용 기술

### 1. 프론트엔드

<img src="https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=HTML5&logoColor=white"/>
<img src="https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=CSS3&logoColor=white"/>
<img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=JavaScript&logoColor=white"/>

### 2. 백엔드

<img src="https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=Node.js&logoColor=white"/>
<img src="https://img.shields.io/badge/express-000000?style=flat-square&logo=express&logoColor=white"/>
<img src="https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=MongoDB&logoColor=white"/>
<img src="https://img.shields.io/badge/Amazon S3-569A31?style=flat-square&logo=Amazon S3&logoColor=white"/>
<img src="https://img.shields.io/badge/Redis-DC382D?style=flat-square&logo=Redis&logoColor=white"/>
<img src="https://img.shields.io/badge/NGINX-009639?style=flat-square&logo=NGINX&logoColor=white"/>
<img src="https://img.shields.io/badge/PM2-2B037A?style=flat-square&logo=PM2&logoColor=white"/>

## 폴더 구조

- 프론트: `src/views` 폴더
- 백: src/views 이외 폴더 전체
- 실행: **프론트, 백 동시에, express로 실행**

## 설치 방법

1. **.env 파일 설정 (MONGODB_URL 환경변수를, 개인 로컬 혹은 Atlas 서버 URL로 설정해야 함)**

2. express 실행

```bash
# npm 을 쓰는 경우
npm install
npm run start

# yarn 을 쓰는 경우
yarn
yarn start
```

<br>

---

본 프로젝트에서 제공하는 모든 코드 등의는 저작권법에 의해 보호받는 ㈜엘리스의 자산이며, 무단 사용 및 도용, 복제 및 배포를 금합니다.
Copyright 2022 엘리스 Inc. All rights reserved.
