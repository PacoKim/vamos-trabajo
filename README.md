# Automotive HW R&D Prep

자동차 전장 HW/회로설계 취업 준비를 위한 반응형 PWA입니다. PC에서는 전체 내용을 관리하고 모바일에서는 실행에 필요한 메뉴만 간단하게 표시합니다.

## 실행

```bash
npm install
npm run dev
```

같은 Wi-Fi의 휴대폰에서 보려면 `npm run dev -- --host 0.0.0.0`으로 실행하고 노트북의 로컬 IP와 포트로 접속합니다.

## 휴대폰에 설치

- Android Chrome: 메뉴 → 홈 화면에 추가 또는 앱 설치
- iPhone Safari: 공유 → 홈 화면에 추가

PWA는 HTTPS로 배포한 주소 또는 localhost에서 가장 안정적으로 설치됩니다.

## 저장과 백업

현재는 기기별 LocalStorage에 자동 저장합니다. Settings에서 JSON을 내보내고 다른 기기에서 가져올 수 있습니다. 실시간 동기화는 다음 단계에서 인증과 Supabase 저장소로 교체할 수 있습니다.

## 빌드

```bash
npm run build
npm run preview
```

`dist` 폴더를 Vercel, Netlify 등 정적 호스팅에 배포할 수 있습니다. AI 기능을 실제 API에 연결할 때 API 키는 프론트엔드가 아닌 서버에 보관해야 합니다.
