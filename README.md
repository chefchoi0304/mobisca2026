# 비전홀 3D 목업 (현대모비스 전사CA 성과공유회)

빌드 과정이 없는 정적 사이트입니다. three.js는 jsDelivr CDN에서 불러옵니다.

```
index.html      화면 구성(상단 버튼, 규격 패널)
main.js         3D 장면 (공간, 부스, 메인홀, 리셉션, 시점)
assets/led.jpg      LED 월 화면 이미지
assets/archive.jpg  아카이브월 그래픽
vercel.json     캐시 설정 (없어도 동작)
```

## 로컬에서 미리 보기
브라우저 보안 정책 때문에 index.html을 더블클릭하면 모듈이 열리지 않습니다. 폴더에서 간단한 서버를 켜서 확인하세요.

```
npx serve .        # 또는  python -m http.server 8000
```

## Vercel 배포 – 방법 A: CLI (가장 빠름)
1. Node.js 설치 (https://nodejs.org)
2. 이 폴더에서 터미널을 열고:
```
npx vercel login
npx vercel          # 미리보기 배포 (질문에는 기본값으로 Enter)
npx vercel --prod   # 운영 주소로 배포
```
- Framework Preset: Other, Build Command: 없음, Output Directory: `.` (기본값 그대로)

## Vercel 배포 – 방법 B: GitHub 연동
1. GitHub에 새 저장소를 만들고 이 폴더의 파일을 올립니다.
2. https://vercel.com/new 에서 저장소를 Import
3. Framework Preset은 **Other**, Build/Output 설정은 비워둔 채 Deploy
4. 이후 GitHub에 파일을 올리면 자동으로 다시 배포됩니다.

## 수정 포인트 (main.js)
- 천장고·단차: `HALL_Y`, `ZC`, `HALL_CEIL`
- 부스 위치: `top`, `west`, `bot` 배열 / 스탠바이미 부스: `SB`
- 부스 활동명: `IDX`
- 사업장 월 크기: `booth({... W:2.0, H:2.2})`
- 시점 카메라: `VIEWS`
- 리셉션 시점: recep
- URL 끝에 `#shot-bird` 처럼 붙이면 UI 없이 해당 시점만 보여줍니다 (bird / booth / hall / detail / recep).

※ 치수는 1층 평면도(A12-002) 기준, 천장고·기둥·LED 크기는 2025년 사진으로 추정한 값입니다.
