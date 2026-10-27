# 비전홀 3D 목업 (현대모비스 전사CA 성과공유회 · 최종본 10/27)

빌드 과정이 없는 정적 사이트입니다. three.js는 jsDelivr CDN에서 불러옵니다.

```
index.html      화면 구성(상단 시점 버튼, 천장 · 오픈 전 차단 토글)
main.js         3D 장면 (부스존 · 플레이존 · 메인홀 · 동측 로비)
assets/         부스 백월 16 · 사업장 A · B · LED · 리셉션 · 아카이브월 · X배너 이미지
vercel.json     캐시 설정 (없어도 동작)
```

## 최종본 반영 내용
- 메인홀 원탁 19개: 스크린 앞 1~6조 · 7~12조(지그재그) · 13~19조, 우측 벽면 다과 · 콘솔
- 부스존: 조직 16 + 사업장 A · B, 도장 테이블은 백월 옆, 파이텍스 보양, 오픈 전 차단봉 (‘오픈 전 차단 보기’ 버튼)
- 스탠바이미 12대: 01 · 02 · 03 · 05 · 07 · 08 · 09 · 10 · 11 · 12 · 15 · 16번 부스
- 플레이존: 홀인원 퍼팅 · 100g 맞히기 (게임별 1세트) + 게임 설명 X배너
- 동측 로비: 리셉션 백월 · 안내데스크, 아카이브월 (허니콤 4,000 × 2,200), 실내 X배너

## 로컬에서 미리 보기
index.html을 더블클릭하면 모듈이 열리지 않습니다. 폴더에서 간단한 서버를 켜서 확인하세요.

```
npx serve .        # 또는  python -m http.server 8000
```

## Vercel 배포 – 방법 A: CLI
```
npx vercel login
npx vercel          # 미리보기 배포
npx vercel --prod   # 운영 주소로 배포 (기존 프로젝트면 같은 주소가 갱신됩니다)
```
- Framework Preset: Other, Build Command 없음, Output Directory `.`

## Vercel 배포 – 방법 B: GitHub 연동
기존 저장소에 이 폴더의 파일을 덮어써서 올리면 자동으로 다시 배포됩니다.

## 수정 포인트 (main.js)
- 원탁 배치: `tables` · 스탠바이미 부스: `SB`
- 시점 카메라: `VIEWS` — URL 끝에 `#shot-bird` 처럼 붙이면 UI 없이 해당 시점만 보여줍니다 (bird / booth / hall / detail / recep / play / biz / arc / sign / entry / pre)

※ 치수는 1층 CAD 평면도와 10/12 답사 실측 기준입니다.
