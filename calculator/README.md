# 두산위브더제니스 부천 자금계획 계산기

입주자모집공고 제2026000382호(2026.08.12. 부천시청 주거정비과 승인)를 토대로 만든
**참고용** 계산기입니다. 세부 일정·옵션 금액·중도금 금리 및 이자는 실제와 다를 수 있으며,
판단은 반드시 공급계약서 원문과 금융기관·사업주체의 공식 안내로 확인하십시오.

공개 주소: https://zenithbc.github.io/calculator/

## 파일

| 파일 | 설명 |
|---|---|
| `index.html` | 배포본. React를 포함해 전부 인라인된 단일 파일이라 외부 의존성이 없습니다. |
| `app.jsx` | 원본 소스. 수정은 이 파일에서 하고 아래 명령으로 다시 빌드합니다. |

저장소 루트에 `.nojekyll`을 두어 GitHub Pages가 Jekyll 처리 없이 파일을 그대로
서빙합니다. 따라서 `index.html`에는 front matter를 넣지 마십시오.

## 다시 빌드하기

```bash
cd calculator
npm i --no-save esbuild@0.24.0 react@18.3.1 react-dom@18.3.1

cat > entry.jsx <<'ENTRY'
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./app.jsx";
createRoot(document.getElementById("root")).render(<App />);
ENTRY

STAMP=$(TZ=Asia/Seoul date '+%Y-%m-%d %H:%M KST')
npx esbuild entry.jsx --bundle --minify --format=iife --target=es2019 --charset=utf8 \
  --define:process.env.NODE_ENV='"production"' \
  --define:__BUILD_AT__="\"$STAMP\"" \
  --outfile=bundle.js
```

`--charset=utf8`을 빼면 한글이 `\uXXXX`로 이스케이프되어 파일이 약 13KB 커지고
내용 검색도 어려워집니다.

푸터 우측의 '최종 갱신' 시각은 `__BUILD_AT__`로 주입합니다. 런타임 시계를 쓰면 열어볼
때마다 값이 바뀌어 갱신 시각의 뜻이 사라지므로 빌드 시점을 박아 넣습니다. 이 define을
빼고 빌드하면 시각이 표시되지 않습니다.

그 다음 `index.html`의 `<script>` ... `</script>` 사이 내용을 `bundle.js`로 교체합니다.
`entry.jsx`, `bundle.js`, `node_modules`는 커밋하지 않습니다.

## 계산 근거

- 분양가·층별 세대수·납부일정·주택형별 옵션가 — 입주자모집공고 제2026000382호 원문
- 계약금 2차 일자 차이 — 무순위(사후) 공고 제2026910241호(2026.09.16.)
- 인지세 — 공고문에 실린 기재금액별 표, 사업주체(또는 은행)와 계약자 각 50%
- 중도금 대출 보증료 — HUG 주택구입자금보증 연 0.130% 단일요율
  (`보증금액 × 요율 × 보증기간/365`)
- 취득세 — 전용 85㎡ 이하 현행 세율, 지방교육세 포함

중도상환수수료는 기본 0%로 두었습니다. 대환이 아닌 자기자금 상환은 통상 면제이나
반드시 대출 약정서에서 확인해야 합니다.

## 유입 경로 제한

**현재 임시로 꺼져 있습니다.** `app.jsx`의 `ENTRY_GATE_ON`을 `true`로 바꾸고 다시
빌드하면 켜집니다. 네이버 카페가 외부 링크에 referrer를 붙이는지 확인한 뒤 켜십시오.
붙이지 않는다면 켜는 순간 정상 경로까지 전부 막힙니다.

켜면 협의회 카페를 통한 접근만 계산기를 보여주고, 그 외에는 안내 화면만 나옵니다
(허용 도메인은 `ENTRY_ALLOW`). 한 번 통과하면 `sessionStorage`에 기억하므로
새로고침이나 탭 복원에서 referrer가 사라져도 같은 세션이면 다시 막히지 않습니다.

이것은 보안 장치가 아닙니다. 정적 호스팅이라 서버에서 Referer를 볼 수 없고,
`document.referrer`는 위조할 수 있으며, 페이지 내용 전체가 HTML에 들어 있어
소스 보기나 JavaScript 비활성화로 우회됩니다. 링크가 맥락 없이 퍼지는 것을
늦추는 용도로만 보십시오.

## 커밋 신원

이 저장소는 협의회 명의로만 커밋합니다. `.git/config`에 `user.name`과
`user.email`을 레포 로컬로 지정해 두었으니, 개인 계정 정보가 섞이지 않도록
`--global` 설정에 의존하지 마십시오.
