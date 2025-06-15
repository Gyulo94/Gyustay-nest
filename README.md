<div align="center">
  <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FbanxOZ%2FbtsOrYNCyXX%2Fpgs6xN7m4PH3wvf0gQyzg0%2Fimg.png" alt="GyuStay">
</div>

## **요약**

- 프로젝트 설명 :
    - 나만의 숙소를 공유하고, 숙소를 검색하고, 예약할 수 있는 프로젝트

## **사용 기술**

- **언어**
    - TypeScript

- **프레임워크**
    - Next.js
    - NestJS

- **라이브러리**
    - React
    - Auth.js
    - Zustand
    - React Query
    - Shadcn UI
    - PrismaORM
    - Zod
    - Toss Payments

- **DB**
    - PostgreSQL
    - Redis

- **인프라**
    - Ubuntu 20.24
    - Nginx
    - docker

## 기술스택 채택 이유

**TypeScript** - 타입스크립트를 사용한 이유는 프론트와 백엔드 모두 사용할 수 있다는 점에서 혼자 개인 프로젝트에 가장 적합하다고 생각하였습니다. 추후에는 백엔드를 Java로 마이그레이션을 하는 것도 학습에 좋을 것 같아서 할 의향이 있습니다.

**Next.Js** - 서버사이드 렌더링을 통해, 정적 페이지를 필요에 따라 간편하게 구성할 수 있고, 외부 API를 서버액션을 통해 통신하고, 일부 간단한 기능들을 백엔드 대신해서 처리함으로 써, 백엔드에 부하를 줄일 수 있다고 판단하여 이 프레임워크를 선택하게 되었습니다.

**Zustand** - Dialog(모달)이나 여러 컴포넌트에서 공통적으로 공유할 상태나 데이터들을 관리할 수 있는 상태관리 라이브러리가 필요했고, Redux보다 20배이상 작고, Recoil보다는 약 39배 정도 번들 크기가 작으며 (압축시 기준), Redux에 비해 필요한 보일러 플레이트가 적다보니, 가독성과 유지보수성에 있어서 더 유리하다 싶어서 선택하였습니다.

**React Query** - 클라이언트 사이드에서 쿼리 키값으로 서버 상태관리를 간편하게 할 수 있고, 무한 스크롤을 구현함에 있어서 편리하여 선택하였습니다.

**Auth.js** - 인증 / 인가를 클라이언트에서 구현함에 있어서 서버로 부터 받은 유저정보를 HttpOnly 쿠키로 세션관리를 용이하게 할 수 있으며, OAuth 프로바이더를 제공함으로써, 클라이언트에서 Oauth 구현을 간편하게 할 수 있으므로, 선택하게 되었습니다.

**Shadcn UI** - 퍼블리싱할 때, UI 라이브러리를 사용하게되면, 조금 더 기능 부분에 집중할 수 있고, MUI는 모든 컴포넌트를 받기 때문에, 사용하지 않는 컴포넌트들 때문에, 용량이 큰데 비해, Shadcn UI는 필요한 컴포넌트만 개별적으로 받을 수 있고, 커스터마이징도 매우 편하기 때문에 선택하게 되었습니다.

**Zod** - 서버로 데이터를 요청할 때, 유효성 검사를 쉽게 할 수 있으며, 유효성 검사를 위해 작성한 코드들을 데이터 타입으로도 사용할 수 있어서, 유효성 검사와 타입, 두 마리의 토끼를 잡을 수 있다는 생각으로 선택하게 되었습니다.

**Toss Payments** - 결제모듈이 필요했고, 토스 페이먼츠 개발자 센터에 Docs로 간편하게 모듈을 적용해 볼 수 있어서 선택하게 되었습니다.

**TailwindCSS** - 별도의 css 파일을 만들지 않아도 되고, 문법이 매우 직관적이며, 반응형을 구현함에 있어서 매우 용이하기 때문에 선택하게 되었습니다.

**NestJS** - Express도 물론 훌륭한 프레임워크이지만, 사실 Express로 구성하게 됬을 때, 직접 서버를 구성을 한다든지, 구조와 체계가 제대로 잡혀있지 않기 때문에, 빠르게 api 테스트 구성함에 있어서는 매우 유리하지만, 만약 협업을 하는데 있어서는 구조가 명확하게 잡힌 NestJS가 더 좋다고 생각하게 되어 선택하게 되었습니다. 또 Spring Boot와 크게 다르지 않아, Spring Boot로 마이그레이션함에 있어서 유리하다고 판단하였습니다.

**PostgreSQL** - 테이블의 ID 데이터 타입을 주로 UUID를 사용하는데, PostgreSQL은 UUID 타입이 별도로 존재하며, 객체 관계형 데이터베이스(ORDBMS)로써 다양한 강력한 타입들을 지원해주기 때문에, 타입을 조금 더 유연하고, 성능적으로도 유리하게 데이터를 관리할 수 있다고 생각하여 선택하게 되었습니다.

**Redis** - 회원가입을 할 때, 이메일 인증을 위해 선택하게 되었습니다. 물론 Redis없이 회원가입을 완료하고, 이메일 인증을 유도하는 식으로도 할 수 있지만, 그렇게 하게되면, 이메일 인증을 했는지, 안했는지를 관리해줘야 했기 때문에, 그렇게 하지 않고, 회원가입 할 때, Redis를 사용하여 이메일 인증을 먼저하고, 이메일 인증 완료 후에 나머지 정보드를 입력하여 회원가입을 하게되면, 이메일 인증 여부를 별도로 관리해주지 않아도 되서 선택하게 되었습니다.

**PrismaORM** - TypeORM보다 코드작성이 매우 직관적이고 생산성이 좋으며, 타입 관리에 매우 좋아서 선택하게 되었습니다.

## ERD

![image.png](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FFwdY8%2FbtsOBatCl5c%2Fc6CfAwUy9cbSVkjYLPm80k%2Fimg.png)

## 프로젝트 API 명세

[GyuStay](https://documenter.getpostman.com/view/29786479/2sB2x3nDMz#e48ed1fc-8507-4b8b-acd5-1dcb44945385)

## 화면 설계

https://www.figma.com/board/JAIXzpX8FHOMEJLOra0dJS/Untitled?node-id=0-1&p=f&t=8RlOyZ1WMBeoYEaK-0

## 노션 URL
https://www.notion.so/GyuStay-20a63ffb6b3180db9f40d35c8467fe6d

## 깃허브 URL

프론트엔드

https://github.com/Gyulo94/Gyustay-next

백엔드

https://github.com/Gyulo94/Gyustay-nest

## 배포 URL

[GyuStay](https://gyustay.vercel.app/)
