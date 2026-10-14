import React, { useState, useMemo } from "react";

/* ─────────────────────────────────────────────
   두산위브더제니스 부천 · 전 주택형 자금계획
   입주자모집공고 제2026000382호 (2026.08.12 승인)
   분양가 · 세대수 · 옵션가 전부 공고문 원문 추출
   ───────────────────────────────────────────── */

const MOVE_IN_PUB = "2032-02-15";

/* 최종 갱신 시각 — 빌드 시점에 esbuild --define:__BUILD_AT__ 로 주입한다.
   런타임 시계를 쓰면 열어볼 때마다 값이 바뀌어 '갱신 시각'의 뜻이 사라진다. */
const BUILD_AT = (typeof __BUILD_AT__ !== "undefined" && __BUILD_AT__) || "";

const TYPES = {
  "59A": {
    key: "59A", full: "059.9400A", line: "101~104동 2, 5호",
    exc: 59.94, sup: 87.4908, supply: 321, general: 145,
    closet: "침실2", singleGlass: false,
    floors: [
      { key: "2", label: "2층", units: 8, price: 743_000_000 },
      { key: "3-5", label: "3~5층", units: 24, price: 768_000_000 },
      { key: "6-9", label: "6~9층", units: 32, price: 784_000_000 },
      { key: "10-19", label: "10~19층", units: 80, price: 826_000_000 },
      { key: "20-29", label: "20~29층", units: 68, price: 851_000_000 },
      { key: "30-39", label: "30~39층", units: 78, price: 867_000_000 },
      { key: "40-49", label: "40~49층", units: 31, price: 875_000_000 },
    ],
  },
  "59B": {
    key: "59B", full: "059.9800B", line: "105·106동 2, 5호",
    exc: 59.98, sup: 86.2636, supply: 170, general: 77,
    closet: "침실3", singleGlass: false,
    floors: [
      { key: "2", label: "2층", units: 4, price: 733_000_000 },
      { key: "3-5", label: "3~5층", units: 12, price: 758_000_000 },
      { key: "6-9", label: "6~9층", units: 16, price: 774_000_000 },
      { key: "10-19", label: "10~19층", units: 40, price: 815_000_000 },
      { key: "20-29", label: "20~29층", units: 34, price: 839_000_000 },
      { key: "30-39", label: "30~39층", units: 40, price: 855_000_000 },
      { key: "40-49", label: "40~49층", units: 24, price: 864_000_000 },
    ],
  },
  "74A": {
    key: "74A", full: "074.9500A", line: "105·106동 3, 4호",
    exc: 74.95, sup: 109.7215, supply: 156, general: 72,
    closet: "침실3", singleGlass: true,
    floors: [
      { key: "2", label: "2층", units: 4, price: 896_000_000 },
      { key: "3-5", label: "3~5층", units: 12, price: 926_000_000 },
      { key: "6-9", label: "6~9층", units: 16, price: 946_000_000 },
      { key: "10-19", label: "10~19층", units: 39, price: 995_000_000 },
      { key: "20-29", label: "20~29층", units: 31, price: 1_025_000_000 },
      { key: "30-39", label: "30~39층", units: 39, price: 1_045_000_000 },
      { key: "40-49", label: "40~49층", units: 15, price: 1_055_000_000 },
    ],
  },
  "74B": {
    key: "74B", full: "074.9900B", line: "105·106동 1, 6호",
    exc: 74.99, sup: 108.6643, supply: 160, general: 72,
    closet: "침실2", singleGlass: false,
    floors: [
      { key: "2", label: "2층", units: 4, price: 862_000_000 },
      { key: "3-5", label: "3~5층", units: 12, price: 891_000_000 },
      { key: "6-9", label: "6~9층", units: 16, price: 910_000_000 },
      { key: "10-19", label: "10~19층", units: 39, price: 958_000_000 },
      { key: "20-29", label: "20~29층", units: 34, price: 987_000_000 },
      { key: "30-39", label: "30~39층", units: 39, price: 1_006_000_000 },
      { key: "40-49", label: "40~49층", units: 16, price: 1_015_000_000 },
    ],
  },
  "84A": {
    key: "84A", full: "084.9500A", line: "101~104동 3, 4호",
    exc: 84.95, sup: 123.7198, supply: 105, general: 49,
    closet: "침실3", singleGlass: true,
    floors: [
      { key: "2", label: "2층", units: 8, price: 1_011_000_000 },
      { key: "3-5", label: "3~5층", units: 24, price: 1_045_000_000 },
      { key: "6-9", label: "6~9층", units: 32, price: 1_067_000_000 },
      { key: "10-19", label: "10~19층", units: 33, price: 1_123_000_000 },
      { key: "30-39", label: "30~39층", units: 1, price: 1_179_000_000 },
      { key: "40-49", label: "40~49층", units: 7, price: 1_182_000_000 },
    ],
  },
  "84B": {
    key: "84B", full: "084.9400B", line: "101~104동 1, 6호",
    exc: 84.94, sup: 122.0067, supply: 246, general: 110,
    closet: "침실2", singleGlass: false,
    floors: [
      { key: "2", label: "2층", units: 8, price: 954_000_000 },
      { key: "3-5", label: "3~5층", units: 24, price: 985_000_000 },
      { key: "6-9", label: "6~9층", units: 32, price: 1_007_000_000 },
      { key: "10-19", label: "10~19층", units: 80, price: 1_060_000_000 },
      { key: "20-29", label: "20~29층", units: 67, price: 1_091_000_000 },
      { key: "30-39", label: "30~39층", units: 28, price: 1_113_000_000 },
      { key: "40-49", label: "40~49층", units: 7, price: 1_123_000_000 },
    ],
  },
};

const TYPE_KEYS = ["59A", "59B", "74A", "74B", "84A", "84B"];

/* 납부일정 — 계약금 1·2차는 계약 시기에 따라 사람마다 다르다.
   최초 입주자모집공고(제2026000382호)는 계약금 2차를 2026.10.07.로,
   같은 단지의 무순위(사후) 공고(제2026910241호, 2026.09.16.)는 2026.10.30.로 적고 있다.
   계약금 1차는 양쪽 모두 "계약 시"이므로 계약일을 직접 넣어야 한다.
   중도금 회차일은 두 공고가 동일하지만, 「주택공급에 관한 규칙」 제60조에 따라
   건축공정에 맞춰 변동될 수 있다.                                                  */
const SCHEDULE_PUB = [
  { id: "d1", label: "계약금 1차", date: "2026-09-15", kind: "fixed", amount: 10_000_000, note: "계약 시" },
  { id: "d2", label: "계약금 2차", date: "2026-10-07", kind: "balance5" },
  { id: "m1", label: "중도금 1차", date: "2026-11-20", kind: "mid" },
  { id: "opt", label: "유상옵션 계약금", date: "2026-12-15", kind: "optdown", note: "시점 추정" },
  { id: "m2", label: "중도금 2차", date: "2027-12-10", kind: "mid" },
  { id: "m3", label: "중도금 3차", date: "2029-03-12", kind: "mid" },
  { id: "m4", label: "중도금 4차", date: "2030-06-10", kind: "mid" },
  { id: "m5", label: "중도금 5차", date: "2030-10-10", kind: "mid" },
  { id: "m6", label: "중도금 6차", date: "2031-05-12", kind: "mid" },
  { id: "bal", label: "잔금", date: "2032-02-15", kind: "final", note: "입주지정일" },
];

// 계약 시기별 프리셋 — 두 공고문에 실제로 적힌 날짜
const SCHED_PRESETS = {
  first: {
    label: "최초 공고 기준",
    desc: "2026.08.12. 최초 입주자모집공고 · 계약금 2차 2026.10.07.",
    patch: { d1: "2026-09-15", d2: "2026-10-07" },
  },
  unsun: {
    label: "무순위 공고 기준",
    desc: "2026.09.16. 무순위(사후) 공고 · 계약체결 2026.10.01. · 계약금 2차 2026.10.30.",
    patch: { d1: "2026-10-01", d2: "2026-10-30" },
  },
};

/* ── 유상옵션 (VAT 포함 · 계약금 10% + 잔금 90%) ──
   p: [59A, 59B, 74A, 74B, 84A, 84B] 순서, 단위 원
   단일 숫자 = 전타입 동일가                        */
const px = (v) => (Array.isArray(v)
  ? Object.fromEntries(TYPE_KEYS.map((k, i) => [k, v[i]]))
  : Object.fromEntries(TYPE_KEYS.map((k) => [k, v])));

const OPTIONS = [
  { id: "balcony", name: "발코니 확장", group: "필수", locked: true,
    p: px([22_200_000, 22_900_000, 26_500_000, 26_200_000, 28_900_000, 29_300_000]),
    note: "미선택 시 나머지 유상옵션 선택 불가" },

  { id: "ac2", name: "시스템에어컨 2개소 (거실+침실1)", group: "설비", excl: "ac",
    p: px([3_760_000, 3_760_000, 3_870_000, 3_870_000, 4_050_000, 4_050_000]) },
  { id: "ac4", name: "시스템에어컨 4개소 (+침실2·3)", group: "설비", excl: "ac",
    p: px([6_780_000, 6_780_000, 7_050_000, 7_050_000, 7_230_000, 7_230_000]) },
  { id: "vent", name: "욕실 복합환풍기 + 드레스룸 제습기", group: "설비", p: px(2_900_000),
    note: "천장 매립 · 사후시공 곤란" },

  { id: "ind", name: "빌트인 인덕션 (LG)", group: "주방", p: px(1_400_000),
    note: "선택 시 가스쿡탑·타공 미시공" },
  { id: "oven", name: "빌트인 전기오븐 (LG)", group: "주방", p: px(850_000),
    note: "미선택 시 배선·배관 미시공" },
  { id: "dish", name: "빌트인 식기세척기 (삼성)", group: "주방", p: px(1_300_000),
    note: "미선택 시 배관 미시공" },
  { id: "fridge", name: "냉장고+김치냉장고+키큰장 (LG)", group: "주방", p: px(7_900_000),
    note: "입주까지 5년 5개월 · 가전은 구형이 됨" },

  { id: "door", name: "현관 중문 3연동", group: "마감", p: px(2_700_000),
    note: "사후 시공가 150~250만원" },
  { id: "closet", name: "붙박이장", group: "마감",
    p: px([2_300_000, 2_300_000, 2_400_000, 2_400_000, 2_500_000, 2_500_000]) },
  { id: "film", name: "창호 단열필름", group: "마감",
    p: px([1_900_000, 1_900_000, 2_100_000, 2_500_000, 2_100_000, 3_200_000]) },
  { id: "screen", name: "안전 방충망", group: "마감",
    p: px([1_900_000, 2_050_000, 2_350_000, 2_500_000, 2_150_000, 3_200_000]) },
  { id: "coat", name: "발코니 탄성코트", group: "마감", p: px(1_000_000),
    note: "사후 시공가 20~40만원" },

  { id: "up_liv", name: "UP&UP 거실 (아트월+시트판넬+월패드)", group: "업그레이드",
    p: px([5_800_000, 5_800_000, 8_500_000, 6_800_000, 8_400_000, 6_800_000]) },
  { id: "up_light", name: "UP&UP 조명", group: "업그레이드",
    p: px([5_500_000, 5_100_000, 5_900_000, 5_800_000, 6_100_000, 6_500_000]) },
  { id: "up_kit", name: "UP&UP 주방", group: "업그레이드",
    p: px([8_800_000, 7_800_000, 7_900_000, 7_800_000, 8_900_000, 13_400_000]),
    note: "사후 공사 규모가 큰 편" },
  { id: "up_bath", name: "UP&UP 욕실 (공용+부부)", group: "업그레이드", p: px(4_700_000) },
  { id: "up_dress", name: "UP&UP 드레스룸", group: "업그레이드",
    p: px([2_800_000, 2_700_000, 3_400_000, 5_600_000, 4_300_000, 5_700_000]) },
  { id: "up_alpha", name: "UP&UP 알파룸", group: "업그레이드", only: ["84B"], p: px(6_500_000) },
];

const availOptions = (t) => OPTIONS.filter((o) => !o.only || o.only.includes(t));

const BALANCED = ["balcony", "ac2", "vent", "ind", "oven", "dish", "screen"];

const optLabel = (o, t) => {
  if (o.id === "closet") return `${TYPES[t].closet} 붙박이장`;
  return o.name;
};
const optNote = (o, t) => {
  if ((o.id === "film" || o.id === "screen") && TYPES[t].singleGlass)
    return "거실 외부단창·주방창 제외";
  if (o.id === "film" || o.id === "screen") return "주방창 등 일부 실 제외";
  if (o.id === "closet" && (t === "74A" || t === "84A"))
    return "침실2 코너 벽선반+책상은 무상선택";
  return o.note;
};

/* ── helpers ───────────────────────────────── */

const won = (n) => {
  const v = Math.round(n);
  const sign = v < 0 ? "−" : "";
  const a = Math.abs(v);
  const eok = Math.floor(a / 1e8);
  const man = Math.round((a % 1e8) / 1e4);
  if (eok && man) return `${sign}${eok}억 ${man.toLocaleString()}만`;
  if (eok) return `${sign}${eok}억`;
  return `${sign}${man.toLocaleString()}만`;
};

const monthsBetween = (a, b) => {
  const d1 = new Date(a), d2 = new Date(b);
  return (d2.getFullYear() - d1.getFullYear()) * 12 + (d2.getMonth() - d1.getMonth())
    + (d2.getDate() - d1.getDate()) / 30.44;
};

const fmtDate = (s) => { const [y, m] = s.split("-"); return `${y}.${m}`; };

// 취득세: 전용 85㎡ 이하 (농특세 비과세), 지방교육세 포함
const acqTaxRate = (base) => {
  const eok = base / 1e8;
  let r;
  if (eok <= 6) r = 0.01;
  else if (eok <= 9) r = ((eok * 2) / 3 - 3) / 100;
  else r = 0.03;
  return r * 1.1;
};

/* 인지세 — 공고문 기재 표 (기재금액별 총액, 사업주체·계약자 각 50%)
   1천만 이하 비과세 / 3천만 이하 2만 / 5천만 이하 4만 / 1억 이하 7만
   10억 이하 15만 / 10억 초과 35만                                    */
const stampTotal = (a) =>
  a <= 10_000_000 ? 0
  : a <= 30_000_000 ? 20_000
  : a <= 50_000_000 ? 40_000
  : a <= 100_000_000 ? 70_000
  : a <= 1_000_000_000 ? 150_000
  : 350_000;

const monthlyPayment = (principal, annualRate, years) => {
  const i = annualRate / 12, n = years * 12;
  if (i === 0) return principal / n;
  return (principal * i) / (1 - Math.pow(1 + i, -n));
};

const pickFloor = (t, key) => {
  const fl = TYPES[t].floors;
  return fl.find((f) => f.key === key) || fl.find((f) => f.key === "10-19") || fl[0];
};

/* ── 핵심 계산 (타입 비교에도 재사용) ────────── */

function compute(typeKey, floorKey, pickedIds, P) {
  const T = TYPES[typeKey];
  const floor = pickFloor(typeKey, floorKey);
  const price = floor.price;

  const opts = availOptions(typeKey).filter((o) => o.locked || pickedIds.includes(o.id));
  const optTotal = opts.reduce((s, o) => s + o.p[typeKey], 0);
  // 발코니 확장만 분양계약 시 계약금을 함께 납부, 나머지 유상옵션은 별도 계약
  const balcony = OPTIONS.find((o) => o.id === "balcony").p[typeKey];
  const extraOpt = optTotal - balcony;

  const down1 = 10_000_000;
  const down2 = price * 0.05 - down1;
  const midEach = price * 0.10;
  const midTotal = price * 0.60;
  const final = price * 0.35;

  /* 중도금 대출 실행 범위
     집단대출은 한 번 약정한 뒤 회차 순서대로 인출하므로, 중간 회차만 골라 자납하고
     그 뒤 회차에서 다시 인출하는 식의 교차 실행은 불가능하다. 반면 앞쪽 회차를 자납한 뒤
     그 다음 회차부터 대출을 실행하는 것은 가능하다. 따라서 대출 회차는 연속 구간
     [loanFrom, loanTo]이고, 그 앞과 뒤가 자납 구간이 된다.
     여기에 한도(midCap)가 걸리면 초과분은 구간 내 뒤 회차로 밀린다.                   */
  const capTotal = P.midCapOn ? Math.min(midTotal, P.midCap * 1e8) : midTotal;
  const nLoan = Math.max(0, P.loanTo - P.loanFrom + 1);
  let left = Math.min(capTotal, nLoan * midEach);
  let interest = 0, gFee = 0;
  const interestRows = P.sched.filter((s) => s.kind === "mid").map((r, i) => {
    const m = monthsBetween(r.date, P.moveIn);
    const n = i + 1;
    const financed = (n >= P.loanFrom && n <= P.loanTo) ? Math.min(midEach, left) : 0;
    left -= financed;
    const it = (financed * (P.rate / 100) * m) / 12;
    // 보증료 = 보증금액 × 요율 × 보증기간 / 365 (실행 시 일시납)
    const fee = (financed * (P.gRate / 100) * m) / 12;
    interest += it; gFee += fee;
    return { ...r, n, months: m, financed, self: midEach - financed, interest: it, fee };
  });
  const midLoan = interestRows.reduce((s, r) => s + r.financed, 0);
  const midSelf = midTotal - midLoan;
  const midSelfBy = Object.fromEntries(interestRows.map((r) => [r.id, r.self]));
  const feeBy = Object.fromEntries(interestRows.map((r) => [r.id, r.fee]));
  const firstLoanId = (interestRows.find((r) => r.financed > 0) || {}).id || null;

  /* 중도상환 — 회차 단위로만 처리된다는 전제.
     상환일 기준으로 이미 실행된 회차만 상환 대상이고, 어느 회차를 고르든 남은 기간이
     같으므로 절감액은 상환 원금에만 비례한다(앞 회차부터 상환하는 것으로 표기).
     보증료는 선납이므로 잔여기간분이 환급되고, 중도상환수수료는 별도로 발생한다.     */
  const paid = interestRows.filter((r) => r.financed > 1e4);
  const eligible = paid.filter((r) => new Date(r.date) <= new Date(P.preDate));
  const preMonths = Math.max(0, monthsBetween(P.preDate, P.moveIn));
  const preOn = P.preOn && eligible.length > 0 && preMonths > 0;
  const preRows = preOn ? eligible.slice(0, Math.min(P.preN, eligible.length)) : [];
  const preIds = new Set(preRows.map((r) => r.id));
  const prePrincipal = preRows.reduce((s, r) => s + r.financed, 0);
  const preIntSaved = preRows.reduce((s, r) => s + (r.financed * (P.rate / 100) * preMonths) / 12, 0);
  const preFeeBack = preRows.reduce((s, r) => s + (r.financed * (P.gRate / 100) * preMonths) / 12, 0);
  // 정액: 원금 × 요율 / 잔존기간 비례: 원금 × 요율 × 잔존기간 ÷ 해당 회차 대출기간
  const preFee = preRows.reduce((s, r) => s + r.financed * (P.preRate / 100)
    * (P.preMode === "slide" ? Math.min(1, preMonths / r.months) : 1), 0);

  interest -= preIntSaved;
  gFee -= preFeeBack;
  const midOutstanding = midLoan - prePrincipal;

  // 회차별 표에 상환 후 순액을 반영
  const rows = interestRows.map((r) => {
    if (!preIds.has(r.id)) return { ...r, repaid: false, netInterest: r.interest, netFee: r.fee };
    return {
      ...r, repaid: true,
      netInterest: r.interest - (r.financed * (P.rate / 100) * preMonths) / 12,
      netFee: r.fee - (r.financed * (P.gRate / 100) * preMonths) / 12,
    };
  });
  const settledInterest = P.settle ? interest : 0;

  // 인지세 — 각 증서별로 사업주체(또는 은행)와 계약자가 50:50
  const stampHome = stampTotal(price) / 2;        // 분양계약서 (소유권 이전 증서)
  const stampBalc = stampTotal(balcony) / 2;      // 발코니 확장 계약서 (도급 증서)
  const stampLoan = stampTotal(midLoan) / 2;      // 중도금 대출약정서 (금전소비대차 증서)
  const stamps = stampHome + stampBalc + stampLoan;

  const taxBase = price + optTotal;
  const acqRate = acqTaxRate(taxBase);
  const acqTax = taxBase * acqRate;

  const grandTotal = price + optTotal + acqTax + settledInterest + gFee + stamps + preFee;
  const maxLoan = Math.min(P.loanCap * 1e8, price * (P.ltv / 100));
  const equityNeeded = grandTotal - maxLoan;

  const flow = P.sched.map((s0) => {
    const s = s0.kind === "final" ? { ...s0, date: P.moveIn } : s0;
    let amount = 0, self = 0, loan = 0; const extra = [];
    if (s.kind === "fixed") {
      amount = down1 + balcony * 0.1 + stampHome + stampBalc; self = amount;
      extra.push(`발코니 확장 계약금 ${won(balcony * 0.1)}`,
        `인지세 ${Math.round((stampHome + stampBalc) / 1e4).toLocaleString()}만`);
    } else if (s.kind === "balance5") { amount = down2; self = down2; }
    else if (s.kind === "optdown") {
      amount = extraOpt * 0.1; self = amount;
      if (amount > 0) extra.push("발코니 확장 외 유상옵션 10%");
    } else if (s.kind === "mid") {
      const first = s.id === firstLoanId;
      const side = feeBy[s.id] + (first ? stampLoan : 0);
      amount = midEach + side;
      self = midSelfBy[s.id] + side;
      loan = midEach - midSelfBy[s.id];
      if (loan <= 1e4) extra.push("자납");
      else extra.push(`보증료 ${Math.round(feeBy[s.id] / 1e4).toLocaleString()}만`
        + (first ? ` · 대출약정 인지세 ${Math.round(stampLoan / 1e4).toLocaleString()}만` : ""));
    } else {
      const optRest = optTotal * 0.9;
      amount = final + optRest + acqTax + settledInterest;
      loan = Math.min(Math.max(0, maxLoan - midOutstanding), amount);
      self = amount - loan;
      extra.push(`옵션 잔금 ${won(optRest)}`, `취득세 ${won(acqTax)}`);
      if (settledInterest > 0) extra.push(`중도금 이자 ${won(settledInterest)}`);
    }
    return { ...s, amount, self, loan, extra };
  });

  if (preOn && prePrincipal > 0) {
    const net = prePrincipal + preFee - preFeeBack;
    flow.push({
      id: "pre", label: "중도금 중도상환", date: P.preDate, kind: "prepay",
      note: `${preRows.length}회차`,
      amount: net, self: net, loan: -prePrincipal,
      extra: [`원금 ${won(prePrincipal)}`,
        ...(preFee > 1e3 ? [`중도상환수수료 ${won(preFee)}`] : []),
        ...(preFeeBack > 1e3 ? [`보증료 환급 −${won(preFeeBack)}`] : [])],
    });
  }
  flow.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));

  let bal = P.equityNow * 1e8;
  let prev = P.sched[0].date;
  const path = flow.map((f) => {
    bal += Math.max(0, monthsBetween(prev, f.date)) * P.monthlySave * 1e4;
    bal -= f.self; prev = f.date;
    return { id: f.id, balance: bal };
  });

  return {
    T, floor, price, optTotal, down1, down2, midEach, midTotal, final,
    interest, settledInterest, interestRows: rows, midLoan, midSelf, midOutstanding,
    gFee, stamps, stampHome, stampBalc, stampLoan,
    preOn, preRows, preIds, prePrincipal, preIntSaved, preFeeBack, preFee,
    preMonths, preEligible: eligible.length, prePaidCount: paid.length,
    acqTax, acqRate, grandTotal, maxLoan, equityNeeded,
    flow, path, endBalance: bal,
    mp: monthlyPayment(maxLoan, P.payRate / 100, 30),
    perPyeong: grandTotal / (T.sup / 3.3058),
    perExcM: grandTotal / T.exc,
  };
}


/* 유입 경로 제한 — 협의회 카페를 통한 접근만 허용한다.

   한계를 분명히 해 둔다. 정적 호스팅이라 서버에서 Referer를 볼 수 없고 브라우저가
   알려주는 document.referrer만 읽을 수 있다. referrer는 위조할 수 있고 이 파일의
   내용은 전부 HTML에 들어 있으므로, 소스 보기나 JS 비활성화로 우회된다.
   즉 보안 장치가 아니라 링크가 맥락 없이 퍼지는 것을 늦추는 장치다.

   한 번 통과하면 세션 동안 기억한다. 새로고침이나 탭 복원에서 referrer가 사라져도
   같은 세션이면 다시 막히지 않게 하기 위한 것이다.                              */
const ENTRY_ALLOW = ["cafe.naver.com", "naver.me"];
const CAFE_URL = "https://cafe.naver.com/zenithbc";
const PASS_KEY = "zenithbc:entry-ok";

const readPass = () => {
  try { return sessionStorage.getItem(PASS_KEY) === "1"; } catch { return false; }
};
const writePass = () => {
  try { sessionStorage.setItem(PASS_KEY, "1"); } catch { /* 사생활 보호 모드 등 */ }
};

function referrerAllowed() {
  if (typeof document === "undefined" || typeof window === "undefined") return false;
  const r = document.referrer;
  if (!r) return false;
  try {
    const h = new URL(r).hostname;
    if (h === window.location.hostname) return true; // 같은 사이트 내 이동
    return ENTRY_ALLOW.some((d) => h === d || h.endsWith("." + d));
  } catch {
    return false;
  }
}

function entryAllowed() {
  if (referrerAllowed()) { writePass(); return true; }
  return readPass();
}

function Gate() {
  return (
    <div className="root">
      <style>{GATE_CSS}</style>
      <div className="gate">
        <div className="gbox">
          <h1>올바른 경로로 접근해 주십시오.</h1>
          <p>
            이 자금계획 계산기는 <b>두산위브더제니스 부천 입주예정자 협의회</b>를 통해서만
            공유되는 자료입니다. 협의회 카페의 안내 글에서 링크를 눌러 들어와 주시기 바랍니다.
          </p>
          <p>
            주소를 직접 입력하거나 즐겨찾기·메신저로 전달받은 링크로는 열리지 않습니다.
            자료의 전제와 한계를 함께 읽으셔야 하는 참고자료이기 때문입니다.
          </p>
          <a className="gbtn" href={CAFE_URL}>협의회 카페로 이동</a>
          <p className="gfoot">
            입주자모집공고 제2026000382호를 토대로 작성된 참고자료이며 실제와 다를 수
            있습니다. 투자자문이 아닙니다.
          </p>
        </div>
      </div>
    </div>
  );
}

const GATE_CSS = `
  .root { --paper:#FAFAF8; --ink:#16233B; --ink2:#5C6B82; --ink3:#8A97A8;
    --rule:#CBD5E1; --hi:#1F4E79;
    background:var(--paper); color:var(--ink); min-height:100vh;
    font-family:-apple-system,BlinkMacSystemFont,"Apple SD Gothic Neo","Malgun Gothic",
                "Noto Sans KR",system-ui,sans-serif;
    font-size:14px; line-height:1.5; -webkit-font-smoothing:antialiased; }
  .root * { box-sizing:border-box; }
  .gate { display:flex; align-items:center; justify-content:center;
    min-height:100vh; padding:40px 16px; }
  .gbox { max-width:460px; border:1px solid var(--rule); background:#fff;
    padding:30px 28px 24px; }
  .gbox h1 { margin:0 0 16px; font-size:17px; font-weight:650; letter-spacing:-0.02em;
    padding-bottom:14px; border-bottom:2px solid var(--ink); }
  .gbox p { margin:0 0 13px; font-size:13px; line-height:1.75; color:var(--ink2); }
  .gbox b { color:var(--ink); font-weight:650; }
  .gbtn { display:inline-block; margin:6px 0 18px; padding:9px 18px;
    background:var(--hi); color:#fff; text-decoration:none; font-size:13px;
    font-weight:600; }
  .gbtn:hover { background:var(--ink); }
  .gfoot { font-size:11px !important; color:var(--ink3) !important; line-height:1.65 !important;
    margin:0 !important; padding-top:14px; border-top:1px solid var(--rule); }
`;

/* ── component ─────────────────────────────── */

export default function App() {
  const [ok] = useState(entryAllowed);
  return ok ? <Calculator /> : <Gate />;
}

function Calculator() {
  const [typeKey, setTypeKey] = useState(null);
  const [floorKey, setFloorKey] = useState(null);
  const [picked, setPicked] = useState([]);
  const [rate, setRate] = useState(4.9);
  const [settle, setSettle] = useState(true);
  const [gRate, setGRate] = useState(0.13);
  const [loanFrom, setLoanFrom] = useState(1);
  const [loanTo, setLoanTo] = useState(6);
  const [blocked, setBlocked] = useState(null);
  const [preOn, setPreOn] = useState(false);
  const [preDate, setPreDate] = useState("2030-01-15");
  const [preN, setPreN] = useState(1);
  const [preRate, setPreRate] = useState(0);
  const [preMode, setPreMode] = useState("slide");
  const [sched, setSched] = useState(SCHEDULE_PUB);
  const [moveIn, setMoveIn] = useState(MOVE_IN_PUB);
  const [schedOpen, setSchedOpen] = useState(false);
  const [midCapOn, setMidCapOn] = useState(false);
  const [midCap, setMidCap] = useState(6.0);
  const [loanCap, setLoanCap] = useState(6.0);
  const [ltv, setLtv] = useState(70);
  const [equityNow, setEquityNow] = useState(0);
  const [monthlySave, setMonthlySave] = useState(0);
  const [payRate, setPayRate] = useState(4.5);
  const [tab, setTab] = useState("flow");

  const P = { sched, moveIn, rate, gRate, loanFrom, loanTo, preOn, preDate, preN, preRate, preMode, settle, midCapOn, midCap, loanCap, ltv, equityNow, monthlySave, payRate };
  const ready = !!typeKey && !!floorKey;
  const avail = typeKey ? availOptions(typeKey) : [];
  const floors = typeKey ? TYPES[typeKey].floors : [];
  const floorMissing = ready && !floors.some((f) => f.key === floorKey);

  // 전액 대출(6회차)과의 비교 기준선
  const base = useMemo(() => (ready ? compute(typeKey, floorKey, picked, { ...P, loanFrom: 1, loanTo: 6, preOn: false }) : null),
    [typeKey, floorKey, picked, rate, gRate, settle, midCapOn, midCap, loanCap, ltv, equityNow, monthlySave, payRate]);

  const calc = useMemo(() => (ready ? compute(typeKey, floorKey, picked, P) : null),
    [typeKey, floorKey, picked, sched, moveIn, rate, gRate, loanFrom, loanTo, preOn, preDate, preN, preRate, preMode, settle, midCapOn, midCap, loanCap, ltv, equityNow, monthlySave, payRate]);

  const cross = useMemo(() => (ready
    ? TYPE_KEYS.map((t) => ({ t, ...compute(t, floorKey, picked, P) }))
    : null),
    [typeKey, floorKey, picked, sched, moveIn, rate, gRate, loanFrom, loanTo, preOn, preDate, preN, preRate, preMode, settle, midCapOn, midCap, loanCap, ltv, equityNow, monthlySave, payRate]);

  const nLoanSel = Math.max(0, loanTo - loanFrom + 1);

  const setDate = (id, date) => {
    if (!date) return;
    setSched((prev) => prev.map((r) => (r.id === id ? { ...r, date } : r)));
  };
  const applyPreset = (k) => {
    const { patch } = SCHED_PRESETS[k];
    setSched((prev) => prev.map((r) => (patch[r.id] ? { ...r, date: patch[r.id] } : r)));
  };
  const resetSched = () => { setSched(SCHEDULE_PUB); setMoveIn(MOVE_IN_PUB); };
  const edited = sched.some((r, i) => r.date !== SCHEDULE_PUB[i].date) || moveIn !== MOVE_IN_PUB;

  // 입력 검증 — 순서가 뒤집히거나 범위를 벗어난 날짜
  const schedErrors = (() => {
    const e = [];
    const get = (id) => sched.find((r) => r.id === id).date;
    const mids = sched.filter((r) => r.kind === "mid");
    if (get("d2") < get("d1")) e.push("계약금 2차가 계약금 1차보다 앞섭니다.");
    for (let i = 1; i < mids.length; i++) {
      if (mids[i].date <= mids[i - 1].date) {
        e.push(`중도금 ${i + 1}차가 ${i}차보다 앞서거나 같습니다.`);
        break;
      }
    }
    if (moveIn <= mids[mids.length - 1].date) e.push("입주지정일이 중도금 6차보다 앞섭니다.");
    if (get("d1") > mids[0].date) e.push("계약금 1차가 중도금 1차보다 늦습니다.");
    if (preOn && (preDate < mids[0].date || preDate > moveIn))
      e.push("중도상환일이 중도금 1차 실행일과 입주지정일 사이를 벗어났습니다.");
    return e;
  })();

  // 대출 구간은 연속 유지 — 양 끝에서만 늘이거나 줄일 수 있다
  const clickTranche = (n) => {
    setBlocked(null);
    if (nLoanSel === 0) { setLoanFrom(n); setLoanTo(n); return; }
    const isLoan = n >= loanFrom && n <= loanTo;
    if (!isLoan) {
      if (n < loanFrom) setLoanFrom(n);
      else setLoanTo(n);
      return;
    }
    if (n === loanFrom && n === loanTo) { setLoanFrom(1); setLoanTo(0); return; }
    if (n === loanFrom) { setLoanFrom(n + 1); return; }
    if (n === loanTo) { setLoanTo(n - 1); return; }
    setBlocked(n);
  };

  const toggle = (opt) => {
    if (opt.locked) return;
    setPicked((prev) => {
      let next = prev.includes(opt.id) ? prev.filter((x) => x !== opt.id) : [...prev, opt.id];
      if (opt.excl && !prev.includes(opt.id)) {
        const sib = OPTIONS.filter((o) => o.excl === opt.excl && o.id !== opt.id).map((o) => o.id);
        next = next.filter((x) => !sib.includes(x));
      }
      return next;
    });
  };

  const maxFlow = calc ? Math.max(...calc.flow.map((f) => f.amount)) : 0;
  const groups = [...new Set(avail.map((o) => o.group))];
  const maxCross = cross ? Math.max(...cross.map((c) => c.grandTotal)) : 0;

  return (
    <div className="root">
      <style>{`
        .root {
          --paper:#FAFAF8; --ink:#16233B; --ink2:#5C6B82; --ink3:#8A97A8;
          --band:#E4EBF3; --rule:#CBD5E1; --rule2:#E7EBF0;
          --debit:#9B3A2F; --credit:#26614A; --hi:#1F4E79;
          background:var(--paper); color:var(--ink); padding:22px 18px 40px;
          font-family:-apple-system,BlinkMacSystemFont,"Apple SD Gothic Neo","Malgun Gothic",
                      "Noto Sans KR",system-ui,sans-serif;
          font-size:14px; line-height:1.5; -webkit-font-smoothing:antialiased;
        }
        .root * { box-sizing:border-box; }
        .num { font-variant-numeric:tabular-nums; letter-spacing:-0.01em; }
        .wrap { max-width:960px; margin:0 auto; }

        .masthead { border-bottom:2px solid var(--ink); padding-bottom:10px; margin-bottom:20px;
          display:flex; justify-content:space-between; align-items:flex-end; gap:12px; flex-wrap:wrap; }
        .masthead h1 { margin:0; font-size:19px; font-weight:650; letter-spacing:-0.02em; }
        .masthead p { margin:4px 0 0; font-size:12px; color:var(--ink2); }

        .headline { display:grid; grid-template-columns:repeat(3,1fr); gap:1px;
          background:var(--rule); border:1px solid var(--rule); margin-bottom:22px; }
        .hcell { background:var(--paper); padding:14px 14px 12px; }
        .hcell .k { font-size:11.5px; color:var(--ink2); margin-bottom:5px; }
        .hcell .v { font-size:24px; font-weight:650; letter-spacing:-0.03em; }
        .hcell .s { font-size:11.5px; color:var(--ink3); margin-top:3px; }
        .hcell.accent { background:#F3F6FA; }
        .hcell.accent .v { color:var(--hi); }

        .panel { border:1px solid var(--rule); margin-bottom:20px; background:#fff; }
        .phead { background:var(--band); padding:8px 13px; font-size:12.5px; font-weight:600;
          border-bottom:1px solid var(--rule); display:flex; justify-content:space-between;
          align-items:center; gap:10px; }
        .pbody { padding:14px 13px; overflow-x:auto; }
        table { min-width:min-content; }

        .ctrl { display:grid; grid-template-columns:repeat(auto-fit,minmax(190px,1fr)); gap:14px 20px; }
        .field label { display:block; font-size:11.5px; color:var(--ink2); margin-bottom:5px; }
        .field .val { font-size:13px; font-weight:600; }
        input[type=range]{ width:100%; accent-color:var(--hi); margin:3px 0 0; }
        input[type=number]{ width:100%; padding:5px 7px; border:1px solid var(--rule);
          background:#fff; font:inherit; font-variant-numeric:tabular-nums; color:var(--ink); }

        .row { display:flex; flex-wrap:wrap; gap:5px; }
        .fbtn { border:1px solid var(--rule); background:#fff; padding:6px 9px; font:inherit;
          font-size:12px; cursor:pointer; color:var(--ink2); text-align:left; }
        .fbtn.on { background:var(--ink); color:#fff; border-color:var(--ink); font-weight:600; }
        .fbtn .u { font-size:10.5px; opacity:.65; margin-left:5px; }

        .tbtn { border:1px solid var(--rule); background:#fff; font:inherit; cursor:pointer;
          padding:7px 10px; color:var(--ink2); line-height:1.3; }
        .tbtn .t1 { font-size:13px; font-weight:600; display:block; }
        .tbtn .t2 { font-size:10.5px; opacity:.7; font-variant-numeric:tabular-nums; }
        .tbtn.on { background:var(--ink); color:#fff; border-color:var(--ink); }

        .tr { border:1px solid var(--rule); background:#fff; font:inherit; cursor:pointer;
          padding:6px 10px; line-height:1.3; text-align:center; min-width:62px; }
        .tr .t1 { font-size:12px; display:block; font-weight:600; }
        .tr .t2 { font-size:11px; display:block; font-weight:600; }
        .tr .t3 { font-size:9.5px; display:block; opacity:.75; margin-top:1px; }
        .tr.loan { border-color:#8FA6BE; background:#EEF3F8; color:var(--hi); }
        .tr.selfpay { border-color:var(--debit); background:#FBF3F2; color:var(--debit); }
        .tr.lock { cursor:not-allowed; border-style:dashed; border-color:var(--rule);
          background:repeating-linear-gradient(135deg,#F4F6F9 0 5px,#EAEEF3 5px 10px);
          color:var(--ink3); }
        .tr.lock .t2 { font-weight:400; }

        .dates { display:grid; grid-template-columns:repeat(auto-fit,minmax(168px,1fr));
          gap:10px 14px; }
        .dcell label { display:block; font-size:11.5px; color:var(--ink2); margin-bottom:4px; }
        .dcell label .chip { margin-left:4px; }

        .sub { margin-top:18px; border:1px solid var(--rule); background:var(--paper);
          padding:0 13px 13px; }
        .subh { display:flex; justify-content:space-between; align-items:center; gap:10px;
          margin:0 -13px 0; padding:8px 13px; background:var(--band);
          border-bottom:1px solid var(--rule); font-size:12.5px; font-weight:600; }
        input[type=date]{ width:100%; padding:5px 7px; border:1px solid var(--rule);
          background:#fff; font:inherit; font-variant-numeric:tabular-nums; color:var(--ink); }
        .fbtn:disabled { opacity:.35; cursor:not-allowed; }

        .alert { margin-top:8px; border:1.5px solid var(--debit); background:#FBF3F2;
          border-left-width:5px; padding:9px 12px; font-size:12px; line-height:1.65;
          color:#52301F; }
        .alert b { font-weight:650; color:#7A2B21; }

        .tabs { display:flex; border-bottom:1px solid var(--rule); }
        .tab { padding:8px 14px; font:inherit; font-size:12.5px; background:none; border:none;
          border-bottom:2px solid transparent; cursor:pointer; color:var(--ink2); margin-bottom:-1px; }
        .tab.on { color:var(--ink); font-weight:600; border-bottom-color:var(--ink); }

        table { width:100%; border-collapse:collapse; font-size:12.5px; }
        th { text-align:left; font-weight:600; color:var(--ink2); font-size:11.5px;
          padding:6px 8px; border-bottom:1px solid var(--rule); }
        td { padding:7px 8px; border-bottom:1px solid var(--rule2); vertical-align:top; }
        td.r, th.r { text-align:right; }
        tr.total td { border-top:1.5px solid var(--ink); border-bottom:none; font-weight:650;
          padding-top:9px; }
        tr.hl td { background:#F3F6FA; }

        .bar { height:7px; background:var(--rule2); position:relative; min-width:60px; }
        .bar i { position:absolute; top:0; bottom:0; left:0; display:block; }
        .bar .self { background:var(--debit); }
        .bar .loan { background:#B9C7D6; }

        .chip { display:inline-block; font-size:10.5px; padding:1px 5px; border:1px solid var(--rule);
          color:var(--ink2); margin-left:5px; }
        .note { font-size:11px; color:var(--ink3); margin-top:2px; }

        .optgrid { display:grid; grid-template-columns:repeat(auto-fit,minmax(290px,1fr)); gap:0 22px; }
        .opt { display:flex; gap:8px; padding:6px 0; border-bottom:1px solid var(--rule2);
          cursor:pointer; align-items:flex-start; }
        .opt.lock { cursor:default; opacity:.9; }
        .opt input { margin:2px 0 0; accent-color:var(--hi); }
        .opt .n { flex:1; font-size:12.5px; }
        .opt .p { font-size:12.5px; font-variant-numeric:tabular-nums; color:var(--ink2); white-space:nowrap; }
        .gtitle { font-size:11.5px; color:var(--ink2); font-weight:600; margin:12px 0 3px;
          padding-bottom:3px; border-bottom:1px solid var(--rule); }
        .presets { display:flex; gap:6px; flex-wrap:wrap; }
        .pbtn { border:1px solid var(--rule); background:#fff; font:inherit; font-size:11.5px;
          padding:3px 8px; cursor:pointer; color:var(--ink2); }

        .verdict { padding:11px 13px; border-left:3px solid var(--hi); background:#F3F6FA;
          font-size:12.5px; margin-top:14px; }
        .verdict.warn { border-left-color:var(--debit); background:#FBF3F2; }
        .verdict b { font-weight:650; }

        .foot { font-size:11px; color:var(--ink3); line-height:1.65; margin-top:18px;
          border-top:1px solid var(--rule); padding-top:11px; }

        .disc { margin-top:26px; border:1.5px solid var(--debit); background:#FBF3F2;
          padding:0 0 14px; }
        .disc .dh { background:var(--debit); color:#fff; font-size:12.5px; font-weight:650;
          padding:7px 14px; letter-spacing:-0.01em; }
        .disc p { margin:12px 14px 0; font-size:11.5px; line-height:1.7; color:#52301F; }
        .disc ul { margin:8px 14px 0; padding-left:16px; }
        .disc li { font-size:11.5px; line-height:1.7; color:#52301F; margin-bottom:5px; }
        .disc b { font-weight:650; color:#7A2B21; }

        .sitefoot { margin-top:16px; padding-top:11px; border-top:1px solid var(--rule);
          display:flex; justify-content:space-between; align-items:baseline; gap:10px;
          flex-wrap:wrap; font-size:11.5px; color:var(--ink3); }
        .sitefoot a { color:var(--ink2); text-decoration:none;
          border-bottom:1px solid var(--rule); }
        .sitefoot a:hover { color:var(--hi); border-bottom-color:var(--hi); }
        @media (max-width:620px){
          .headline { grid-template-columns:1fr; }
          .hcell .v { font-size:21px; }
        }
      `}</style>

      <div className="wrap">
        <div className="masthead">
          <div>
            <h1>두산위브더제니스 부천 · 전 주택형 자금계획</h1>
            <p>전 6개 주택형 · 1,728세대 중 일반분양 1,158세대 · 입주예정 2032년 2월 ·
              입주자모집공고 제2026000382호</p>
          </div>
        </div>

        {ready && (
          <div className="headline">
            <div className="hcell">
              <div className="k">분양가 · {typeKey} {calc.floor.label}</div>
              <div className="v num">{won(calc.price)}</div>
              <div className="s">{TYPES[typeKey].line} · 해당 {calc.floor.units}세대</div>
            </div>
            <div className="hcell">
              <div className="k">실질 총 소요</div>
              <div className="v num">{won(calc.grandTotal)}</div>
              <div className="s">
                확장·옵션·취득세{calc.settledInterest > 0 ? "·중도금이자" : ""}·보증료·인지세 포함 ·
                공급 평당 {Math.round(calc.perPyeong / 1e4).toLocaleString()}만
              </div>
            </div>
            <div className="hcell accent">
              <div className="k">필요 자기자본</div>
              <div className="v num">{won(calc.equityNeeded)}</div>
              <div className="s">잔금 대출 {won(calc.maxLoan)} 가정</div>
            </div>
          </div>
        )}

        <div className="panel">
          <div className="phead">
            <span>주택형 · 층</span>
            {typeKey && (
              <span className="note" style={{ margin: 0 }}>
                전용 {TYPES[typeKey].exc}㎡ · 공급 {TYPES[typeKey].sup.toFixed(2)}㎡
                ({(TYPES[typeKey].sup / 3.3058).toFixed(1)}평) ·
                총공급 {TYPES[typeKey].supply}세대 (일반 {TYPES[typeKey].general})
              </span>
            )}
          </div>
          <div className="pbody">
            <div className="row" style={{ marginBottom: typeKey ? 12 : 0 }}>
              {TYPE_KEYS.map((t) => (
                <button key={t} className={`tbtn ${t === typeKey ? "on" : ""}`}
                  onClick={() => { setTypeKey(t); if (!TYPES[t].floors.some((f) => f.key === floorKey)) setFloorKey(null); }}>
                  <span className="t1">{t}</span>
                  <span className="t2">전용 {TYPES[t].exc}㎡</span>
                </button>
              ))}
            </div>

            {typeKey && (
              <div className="row">
                {floors.map((f) => (
                  <button key={f.key} className={`fbtn ${f.key === floorKey ? "on" : ""}`}
                    onClick={() => setFloorKey(f.key)}>
                    {f.label}<span className="u num">{won(f.price)}</span>
                  </button>
                ))}
              </div>
            )}

            {!ready && (
              <div className="note" style={{ marginTop: 10 }}>
                {typeKey
                  ? "층 구간을 고르면 납부 일정과 총 소요액이 계산됩니다."
                  : "주택형과 층 구간을 고르면 납부 일정과 총 소요액이 계산됩니다. 84A는 20~29층 구간이 없습니다."}
              </div>
            )}

            {floorMissing && (
              <div className="note" style={{ marginTop: 8, color: "var(--debit)" }}>
                {typeKey}에는 {floorKey.replace("-", "~")}층 구간이 없습니다
                (공고문상 해당 세대 없음) — {calc.floor.label}로 계산했습니다.
              </div>
            )}
            {ready && (
              <div className="note" style={{ marginTop: 8 }}>
                중도금 60% = {won(calc.midTotal)} · 회차당 {won(calc.midEach)} × 6회
                {calc.midSelf > 1e4
                  ? ` · 대출 한도 ${midCap}억을 ${won(calc.midSelf)} 초과 → 한도까지 회차 순서대로 실행되고 초과분은 뒤 회차에서 현금 납부`
                  : " · 6회차 전액 대출 실행"}
              </div>
            )}
          </div>
        </div>

        {ready && (<>

        <div className="panel">
          <div className="phead">대출·금리 조건</div>
          <div className="pbody">
            <div className="ctrl">
              <div className="field">
                <label>중도금 대출 금리</label>
                <div className="val num">{rate.toFixed(2)}%</div>
                <input type="range" min="3" max="8" step="0.1" value={rate}
                  onChange={(e) => setRate(+e.target.value)} />
                <div className="note">현재 4.9% 고정 협의 중 · 확정 조건 아님</div>
              </div>
              <div className="field">
                <label>중도금 대출 보증료율 (연 %)</label>
                <input type="number" step="0.01" value={gRate}
                  onChange={(e) => setGRate(+e.target.value || 0)} />
                <div className="note">
                  HUG 주택구입자금보증 연 0.130% 단일요율 기준 · 보증기관은 은행이 지정
                </div>
              </div>
              <div className="field">
                <label>중도금 대출 한도</label>
                <div style={{ display: "flex", gap: 5, marginTop: 2 }}>
                  <button className={`fbtn ${!midCapOn ? "on" : ""}`} onClick={() => setMidCapOn(false)}>
                    60% 전액
                  </button>
                  <button className={`fbtn ${midCapOn ? "on" : ""}`} onClick={() => setMidCapOn(true)}>
                    한도 지정
                  </button>
                  {midCapOn && (
                    <input type="number" step="0.5" value={midCap} style={{ width: 70 }}
                      onChange={(e) => setMidCap(+e.target.value || 0)} />
                  )}
                </div>
                <div className="note">
                  집단대출은 분양가 60% 전액 실행 · 수도권 6억 한도는 잔금 주담대에만 적용
                </div>
              </div>
              <div className="field" style={{ gridColumn: "1 / -1" }}>
                <label>회차별 대출 / 자납 — 대출 구간의 양 끝만 바꿀 수 있습니다</label>
                <div className="row" style={{ marginTop: 2 }}>
                  {[1, 2, 3, 4, 5, 6].map((n) => {
                    const isLoan = n >= loanFrom && n <= loanTo;
                    const interior = isLoan && n > loanFrom && n < loanTo;
                    return (
                      <button key={n} aria-disabled={interior}
                        className={`tr ${isLoan ? "loan" : "selfpay"} ${interior ? "lock" : ""}`}
                        onClick={() => clickTranche(n)}
                        title={interior
                          ? `${n}차는 대출 구간 중간이라 자납으로 바꿀 수 없습니다`
                          : `${n}차를 ${isLoan ? "자납" : "대출"}으로 바꿉니다`}>
                        <span className="t1">{n}차</span>
                        <span className="t2">{isLoan ? "대출" : "자납"}</span>
                        <span className="t3">{interior ? "변경 불가" : "변경 가능"}</span>
                      </button>
                    );
                  })}
                  <button className="fbtn" onClick={() => { setBlocked(null); setLoanFrom(1); setLoanTo(6); }}>
                    전액 대출
                  </button>
                  <button className="fbtn" onClick={() => { setBlocked(null); setLoanFrom(1); setLoanTo(0); }}>
                    전액 자납
                  </button>
                </div>
                {blocked && (
                  <div className="alert">
                    <b>{blocked}차는 바꿀 수 없습니다 — 통상적으로 불가능한 방식입니다.</b>
                    집단대출은 한 번 약정한 뒤 회차 순서대로 인출하므로,
                    중간 회차만 골라 자납하고 그 다음 회차에서 다시 인출할 수 없습니다
                    (예: 2차 자납 후 3차 대출 재개 — 불가).
                    바꿀 수 있는 것은 구간의 양 끝인 <b>{loanFrom}차</b>
                    {loanFrom !== loanTo && <> 또는 <b>{loanTo}차</b></>}뿐입니다.
                  </div>
                )}
                <div className="note">
                  <b style={{ color: "var(--ink2)" }}>
                    현재 {[1, 2, 3, 4, 5, 6].map((n) => (n >= loanFrom && n <= loanTo ? "대출" : "자납")).join(" · ")}
                  </b>
                  {nLoanSel > 0
                    ? ` → ${loanFrom}차~${loanTo}차 ${nLoanSel}회 대출, 자납 ${6 - nLoanSel}회`
                    : " → 6회차 전부 자납"}
                  <br />
                  대출 회차는 연속이어야 합니다. 앞 회차를 자납한 뒤 그 다음 회차부터 대출을
                  실행하는 것과 뒤 회차를 자납하는 것은 가능하지만, 중간 회차만 빼는 것은
                  불가능하므로 구간 중간은 잠겨 있습니다.
                </div>
                {nLoanSel > 0 && loanFrom > 1 && loanTo < 6 && (
                  <div className="alert" style={{ borderLeftColor: "var(--ink3)", borderColor: "var(--rule)", background: "#F4F6F9" }}>
                    앞({loanFrom - 1}회)과 뒤({6 - loanTo}회) 양쪽을 자납하는 구성입니다.
                    규칙상 대출 구간은 연속이지만, 실무에서는 약정을 늦게 맺고 중간에 인출을
                    끊는 조합이라 은행이 받아 주는지 미리 확인하셔야 합니다.
                  </div>
                )}
              </div>
              <div className="field">
                <label>잔금 주담대 한도 (억)</label>
                <input type="number" step="0.5" value={loanCap}
                  onChange={(e) => setLoanCap(+e.target.value || 0)} />
                <div className="note">수도권 주담대 한도</div>
              </div>
              <div className="field">
                <label>LTV (%)</label>
                <input type="number" step="5" value={ltv}
                  onChange={(e) => setLtv(+e.target.value || 0)} />
              </div>
              <div className="field">
                <label>중도금 이자 처리</label>
                <div style={{ display: "flex", gap: 5, marginTop: 2 }}>
                  <button className={`fbtn ${settle ? "on" : ""}`} onClick={() => setSettle(true)}>후불 · 계약자 부담</button>
                  <button className={`fbtn ${!settle ? "on" : ""}`} onClick={() => setSettle(false)}>무이자</button>
                </div>
                <div className="note">공고문에 무이자 조항 없음 · 후불제가 기준</div>
              </div>
              <div className="field">
                <label>입주 후 주담대 금리 (30년 원리금균등)</label>
                <div className="val num">
                  {payRate.toFixed(2)}% · 월 {Math.round(calc.mp / 1e4).toLocaleString()}만원
                </div>
                <input type="range" min="3" max="8" step="0.1" value={payRate}
                  onChange={(e) => setPayRate(+e.target.value)} />
              </div>
            </div>
            {settle && calc.interest > 0 && (
              <div className="verdict warn">
                중도금 이자 <b className="num">{won(calc.interest)}</b>가 잔금에 더해집니다.
                금리 1%p당 약 <b className="num">{won(calc.interest / rate)}</b>씩 움직이고,
                이 금액은 HUG 분양보증 대상이 아닙니다.
              </div>
            )}
            {nLoanSel < 6 && (
              <div className="verdict">
                {nLoanSel === 0
                  ? "중도금 6회차를 전부 자납"
                  : `${loanFrom}차~${loanTo}차만 대출하고 나머지 ${6 - nLoanSel}회를 자납`}하면
                이자·보증료·대출약정 인지세로 <b className="num">
                  {won((base.interest + base.gFee + base.stampLoan)
                    - (calc.interest + calc.gFee + calc.stampLoan))}
                </b>을 덜 냅니다. 대신 입주 전에 <b className="num">{won(calc.midSelf)}</b>를
                현금으로 먼저 넣어야 합니다. 자납은 그 돈으로 연
                <b className="num"> {(rate + gRate).toFixed(2)}%</b>의 확정 수익을 얻는 것과
                같습니다(이자 {rate.toFixed(2)}% + 보증료 {gRate}%). 세후로 이보다 높은 수익을
                확실하게 낼 수 있다면 대출을 그대로 두는 편이 낫습니다.
              </div>
            )}
          </div>
        </div>

        <div className="panel">
          <div className="phead">
            <span>납부 일정 조정{edited && <span className="chip">수정됨</span>}</span>
            <div style={{ display: "flex", gap: 5 }}>
              {edited && <button className="pbtn" onClick={resetSched}>공고문 기준으로 되돌리기</button>}
              <button className="pbtn" onClick={() => setSchedOpen(!schedOpen)}>
                {schedOpen ? "접기" : "펼치기"}
              </button>
            </div>
          </div>
          <div className="pbody">
            {!schedOpen && (
              <div className="note" style={{ margin: 0 }}>
                계약금 1·2차 납부일은 계약 시기에 따라 사람마다 다릅니다.
                본인 공급계약서의 날짜로 바꿔 계산하려면 펼쳐 주세요.
                {edited && " 현재 공고문 기준에서 수정된 일정으로 계산하고 있습니다."}
              </div>
            )}
            {schedOpen && (<>
              <div className="presets" style={{ marginBottom: 10 }}>
                {Object.entries(SCHED_PRESETS).map(([k, v]) => (
                  <button key={k} className="pbtn" onClick={() => applyPreset(k)} title={v.desc}>
                    {v.label}
                  </button>
                ))}
              </div>
              <div className="dates">
                {sched.filter((r) => r.kind !== "final").map((r) => (
                  <div className="dcell" key={r.id}>
                    <label>
                      {r.label}
                      {r.note && <span className="chip">{r.note}</span>}
                      {r.date !== SCHEDULE_PUB.find((x) => x.id === r.id).date && (
                        <span className="chip" style={{ borderColor: "var(--hi)", color: "var(--hi)" }}>수정</span>
                      )}
                    </label>
                    <input type="date" value={r.date} onChange={(e) => setDate(r.id, e.target.value)} />
                  </div>
                ))}
                <div className="dcell">
                  <label>
                    입주지정일 · 잔금
                    {moveIn !== MOVE_IN_PUB && (
                      <span className="chip" style={{ borderColor: "var(--hi)", color: "var(--hi)" }}>수정</span>
                    )}
                  </label>
                  <input type="date" value={moveIn} onChange={(e) => e.target.value && setMoveIn(e.target.value)} />
                </div>
              </div>

              {schedErrors.length > 0 && (
                <div className="alert">
                  <b>날짜 순서를 확인해 주세요.</b>
                  {schedErrors.map((m, i) => <div key={i}>· {m}</div>)}
                  이 상태로도 계산은 되지만 이자 기간이 음수가 되거나 납부 순서가 뒤바뀔 수 있습니다.
                </div>
              )}

              <div className="note" style={{ marginTop: 10 }}>
                <b style={{ color: "var(--ink2)" }}>공고문에 적힌 값</b> —
                최초 입주자모집공고(2026.08.12.)는 계약금 1차를 "계약 시", 2차를 2026.10.07.로,
                같은 단지 무순위(사후) 공고(2026.09.16.)는 계약체결 2026.10.01., 계약금 2차를
                2026.10.30.로 적고 있습니다. 중도금 1~6차와 입주지정일은 두 공고가 같습니다.
                선착순 임의공급 계약자의 계약금 2차 납부일은 공고문에 없으므로 계약서를 보셔야 합니다.
                <br />
                중도금 회차일은 「주택공급에 관한 규칙」 제60조에 따라 건축공정에 맞춰 변동될 수
                있고, 납입일이 공휴일이면 익일 은행 영업일이 기준입니다.
                유상옵션 계약금일은 공고문에 없어 2026.12.15.로 가정한 값입니다.
                날짜를 바꾸면 이자·보증료·중도상환 절감액과 저축 시뮬레이션이 모두 다시 계산됩니다.
              </div>
            </>)}
          </div>
        </div>

        <div className="panel">
          <div className="phead">
            <span>유상옵션 · {typeKey}</span>
            <span className="num" style={{ fontWeight: 650 }}>{won(calc.optTotal)}</span>
          </div>
          <div className="pbody">
            <div className="presets" style={{ marginBottom: 4 }}>
              <button className="pbtn" onClick={() => setPicked([])}>확장만</button>
              <button className="pbtn" onClick={() => setPicked(BALANCED)}>필수 위주</button>
              <button className="pbtn"
                onClick={() => setPicked(avail.map((o) => o.id).filter((id) => id !== "ac2"))}>
                전체 선택
              </button>
            </div>
            <div className="optgrid">
              {groups.map((g) => (
                <div key={g}>
                  <div className="gtitle">{g}</div>
                  {avail.filter((o) => o.group === g).map((o) => {
                    const n = optNote(o, typeKey);
                    return (
                      <label key={o.id} className={`opt ${o.locked ? "lock" : ""}`}>
                        <input type="checkbox" checked={picked.includes(o.id) || !!o.locked}
                          disabled={o.locked} onChange={() => toggle(o)} />
                        <span className="n">
                          {optLabel(o, typeKey)}
                          {n && <div className="note">{n}</div>}
                        </span>
                        <span className="p">{(o.p[typeKey] / 1e4).toLocaleString()}만</span>
                      </label>
                    );
                  })}
                </div>
              ))}
            </div>
            <div className="note" style={{ marginTop: 10 }}>
              전 항목 VAT 포함 · 계약금 10% + 잔금 90%(입주 시).
              발코니 확장 계약금만 분양계약 시 함께 납부하고, 나머지 유상옵션은 별도 계약이라
              계약금 납부 시점이 아직 공지되지 않았습니다 — 2026년 12월로 추정해 넣었습니다.
              발코니 확장을 선택하지 않으면 나머지 유상옵션을 고를 수 없습니다.
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="tabs">
            <button className={`tab ${tab === "flow" ? "on" : ""}`} onClick={() => setTab("flow")}>납부 일정</button>
            <button className={`tab ${tab === "cross" ? "on" : ""}`} onClick={() => setTab("cross")}>타입 비교</button>
            <button className={`tab ${tab === "int" ? "on" : ""}`} onClick={() => setTab("int")}>중도금 이자</button>
            <button className={`tab ${tab === "save" ? "on" : ""}`} onClick={() => setTab("save")}>저축 시뮬레이션</button>
          </div>
          <div className="pbody">
            {tab === "flow" && (
              <table>
                <thead>
                  <tr>
                    <th>시점</th><th>구분</th><th className="r">납부액</th>
                    <th className="r">자기자본</th><th style={{ width: "24%" }}>구성</th>
                  </tr>
                </thead>
                <tbody>
                  {calc.flow.map((f) => (
                    <tr key={f.id}>
                      <td className="num">{fmtDate(f.date)}</td>
                      <td>
                        {f.label}{f.note && <span className="chip">{f.note}</span>}
                        {f.extra.length > 0 && <div className="note">{f.extra.join(" · ")}</div>}
                      </td>
                      <td className="r num">{f.amount > 1e4 ? won(f.amount) : "—"}</td>
                      <td className="r num" style={{ color: f.self > 1e4 ? "var(--debit)" : "var(--ink3)" }}>
                        {f.self > 1e4 ? won(f.self) : "—"}
                      </td>
                      <td>
                        <div className="bar">
                          <i className="loan" style={{ width: `${(f.amount / maxFlow) * 100}%` }} />
                          <i className="self" style={{ width: `${(f.self / maxFlow) * 100}%` }} />
                        </div>
                      </td>
                    </tr>
                  ))}
                  <tr className="total">
                    <td colSpan={2}>합계</td>
                    <td className="r num">{won(calc.grandTotal)}</td>
                    <td className="r num">{won(calc.equityNeeded)}</td>
                    <td />
                  </tr>
                </tbody>
              </table>
            )}

            {tab === "cross" && (
              <>
                <table>
                  <thead>
                    <tr>
                      <th>주택형</th>
                      <th className="r">분양가</th>
                      <th className="r">옵션</th>
                      <th className="r">취득세</th>
                      <th className="r">중도금이자</th>
                      <th className="r">보증료·인지세</th>
                      <th className="r">실질 총액</th>
                      <th className="r">공급 평당</th>
                      <th style={{ width: "14%" }} />
                    </tr>
                  </thead>
                  <tbody>
                    {cross.map((c) => (
                      <tr key={c.t} className={c.t === typeKey ? "hl" : ""}
                        style={{ cursor: "pointer" }} onClick={() => setTypeKey(c.t)}>
                        <td>
                          <b style={{ fontWeight: c.t === typeKey ? 650 : 400 }}>{c.t}</b>
                          <div className="note">{c.floor.label} · 전용 {c.T.exc}㎡</div>
                        </td>
                        <td className="r num">{won(c.price)}</td>
                        <td className="r num">{won(c.optTotal)}</td>
                        <td className="r num">{won(c.acqTax)}</td>
                        <td className="r num">{c.settledInterest > 0 ? won(c.settledInterest) : "—"}</td>
                        <td className="r num">{won(c.gFee + c.stamps)}</td>
                        <td className="r num" style={{ fontWeight: 650 }}>{won(c.grandTotal)}</td>
                        <td className="r num">{Math.round(c.perPyeong / 1e4).toLocaleString()}만</td>
                        <td>
                          <div className="bar">
                            <i className="loan" style={{ width: `${(c.grandTotal / maxCross) * 100}%` }} />
                            <i className="self" style={{ width: `${(c.equityNeeded / maxCross) * 100}%` }} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="note" style={{ marginTop: 10 }}>
                  같은 층 구간({floorKey.replace("-", "~")}층)·같은 옵션 조합·같은 금리 조건으로 맞춘 비교입니다.
                  84A는 20~29층 구간이 없어 10~19층으로 계산됩니다.
                  막대의 진한 부분은 필요 자기자본, 연한 부분은 실질 총액입니다.
                </div>
                <div className="verdict">
                  공급 평당가는 {
                    (() => {
                      const s = [...cross].sort((a, b) => a.perPyeong - b.perPyeong);
                      return `${s[0].t} ${Math.round(s[0].perPyeong / 1e4).toLocaleString()}만원이 가장 낮고 ${s[5].t} ${Math.round(s[5].perPyeong / 1e4).toLocaleString()}만원이 가장 높습니다`;
                    })()
                  }. 같은 평형 안에서 A·B 타입 차이는 분양가보다 옵션가에서 더 벌어지는 구간이 있습니다
                  (84B 주방 업그레이드 1,340만원 대 84A 890만원).
                </div>
              </>
            )}

            {tab === "int" && (
              <>
                <table>
                  <thead>
                    <tr>
                      <th>회차</th><th className="r">실행일</th><th className="r">회차 납부액</th>
                      <th className="r">대출 실행</th><th className="r">현금</th>
                      <th className="r">입주까지</th><th className="r">이자</th>
                      <th className="r">보증료</th>
                    </tr>
                  </thead>
                  <tbody>
                    {calc.interestRows.map((r) => (
                      <tr key={r.id} className={r.repaid ? "hl" : ""}>
                        <td>
                          {r.label}
                          {r.repaid && <span className="chip">상환</span>}
                        </td>
                        <td className="r num">{r.date.replace(/-/g, ".")}</td>
                        <td className="r num">{won(calc.midEach)}</td>
                        <td className="r num">{r.financed > 1e4 ? won(r.financed) : "—"}</td>
                        <td className="r num" style={{ color: r.self > 1e4 ? "var(--debit)" : "var(--ink3)" }}>
                          {r.self > 1e4 ? won(r.self) : "—"}
                        </td>
                        <td className="r num">
                          {(r.repaid ? calc.preMonths : r.months).toFixed(1)}개월
                          {r.repaid && <div className="note">원래 {r.months.toFixed(1)}개월</div>}
                        </td>
                        <td className="r num">
                          {won(r.netInterest)}
                          {r.repaid && <div className="note">−{won(r.interest - r.netInterest)}</div>}
                        </td>
                        <td className="r num" style={{ color: "var(--debit)" }}>
                          {won(r.netFee)}
                          {r.repaid && <div className="note">환급 −{won(r.fee - r.netFee)}</div>}
                        </td>
                      </tr>
                    ))}
                    <tr className="total">
                      <td colSpan={2}>{rate.toFixed(2)}% 기준 누계</td>
                      <td className="r num">{won(calc.midTotal)}</td>
                      <td className="r num">{won(calc.midLoan)}</td>
                      <td className="r num">{calc.midSelf > 1e4 ? won(calc.midSelf) : "—"}</td>
                      <td className="r num">
                        {calc.interestRows.reduce((s, r) => s + (r.repaid ? calc.preMonths : r.months), 0).toFixed(0)}개월
                      </td>
                      <td className="r num">{won(calc.interest)}</td>
                      <td className="r num">{won(calc.gFee)}</td>
                    </tr>
                  </tbody>
                </table>

                <div className="sub">
                  <div className="subh">
                    <span>중도상환 가정</span>
                    <div style={{ display: "flex", gap: 5 }}>
                      <button className={`fbtn ${!preOn ? "on" : ""}`} onClick={() => setPreOn(false)}>미적용</button>
                      <button className={`fbtn ${preOn ? "on" : ""}`} onClick={() => setPreOn(true)}>적용</button>
                    </div>
                  </div>
                  {preOn && (
                    <div className="pbody" style={{ padding: "12px 0 0" }}>
                      <div className="ctrl">
                        <div className="field">
                          <label>중도상환일</label>
                          <input type="date" value={preDate} min="2026-11-20" max="2032-02-15"
                            onChange={(e) => setPreDate(e.target.value)} />
                          <div className="note">
                            입주까지 {calc.preMonths.toFixed(1)}개월 남은 시점 ·
                            상환 가능 회차 {calc.preEligible}개 (이미 실행된 회차만)
                          </div>
                        </div>
                        <div className="field">
                          <label>상환 회차 수 — 회차 단위로만 처리</label>
                          <div className="row" style={{ marginTop: 2 }}>
                            {Array.from({ length: Math.max(1, calc.preEligible) }, (_, i) => i + 1).map((k) => (
                              <button key={k} disabled={k > calc.preEligible}
                                className={`fbtn ${k === Math.min(preN, calc.preEligible) ? "on" : ""}`}
                                onClick={() => setPreN(k)}>{k}회차</button>
                            ))}
                          </div>
                          <div className="note">
                            어느 회차를 상환해도 남은 기간이 같아 절감액은 원금에만 비례합니다
                            (앞 회차부터 상환하는 것으로 표기).
                          </div>
                        </div>
                        <div className="field">
                          <label>중도상환수수료율 (%)</label>
                          <input type="number" step="0.1" min="0" value={preRate}
                            onChange={(e) => setPreRate(+e.target.value || 0)} />
                          <div className="note">
                            대환이 아닌 자기자금 상환은 통상 면제라 0%를 기본값으로 두었습니다.
                            <b style={{ color: "var(--debit)" }}> 반드시 대출 약정서에서 확인해야 합니다.</b>
                          </div>
                        </div>
                        <div className="field">
                          <label>수수료 산정 방식</label>
                          <div style={{ display: "flex", gap: 5, marginTop: 2 }}>
                            <button className={`fbtn ${preMode === "slide" ? "on" : ""}`}
                              onClick={() => setPreMode("slide")}>잔존기간 비례</button>
                            <button className={`fbtn ${preMode === "flat" ? "on" : ""}`}
                              onClick={() => setPreMode("flat")}>정액</button>
                          </div>
                          <div className="note">
                            비례: 원금 × 요율 × 잔존기간 ÷ 대출기간 (통상 방식)
                          </div>
                        </div>
                      </div>

                      {calc.prePrincipal > 0 ? (
                        <>
                          <table style={{ marginTop: 14 }}>
                            <tbody>
                              <tr>
                                <td>상환 원금 · {calc.preRows.length}회차</td>
                                <td className="r num" style={{ color: "var(--debit)" }}>
                                  {won(calc.prePrincipal)}
                                </td>
                              </tr>
                              <tr>
                                <td>절감 이자 ({rate.toFixed(2)}% × {calc.preMonths.toFixed(1)}개월)</td>
                                <td className="r num" style={{ color: "var(--credit)" }}>
                                  −{won(calc.preIntSaved)}
                                </td>
                              </tr>
                              <tr>
                                <td>보증료 환급 (잔여기간분)</td>
                                <td className="r num" style={{ color: "var(--credit)" }}>
                                  −{won(calc.preFeeBack)}
                                </td>
                              </tr>
                              <tr>
                                <td>중도상환수수료 ({preRate}% · {preMode === "slide" ? "비례" : "정액"})</td>
                                <td className="r num" style={{ color: "var(--debit)" }}>
                                  {calc.preFee > 1e3 ? `+${won(calc.preFee)}` : "없음"}
                                </td>
                              </tr>
                              <tr className="total">
                                <td>순 절감액</td>
                                <td className="r num" style={{
                                  color: calc.preIntSaved + calc.preFeeBack - calc.preFee > 0
                                    ? "var(--credit)" : "var(--debit)",
                                }}>
                                  {won(calc.preIntSaved + calc.preFeeBack - calc.preFee)}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                          <div className="verdict">
                            {fmtDate(preDate)}에 <b className="num">{won(calc.prePrincipal)}</b>을 넣어
                            <b className="num"> {won(calc.preIntSaved + calc.preFeeBack - calc.preFee)}</b>을
                            절감합니다 — 상환액 대비 연
                            <b className="num"> {(((calc.preIntSaved + calc.preFeeBack - calc.preFee)
                              / calc.prePrincipal) / (calc.preMonths / 12) * 100).toFixed(2)}%
                            </b>의 확정 수익에 해당합니다.
                            입주 시 중도금 대출 잔액은 {won(calc.midLoan)}에서
                            <b className="num"> {won(calc.midOutstanding)}</b>로 줄어듭니다.
                          </div>
                          <div className="note" style={{ marginTop: 8 }}>
                            상환 원금은 그 시점에 현금으로 나가므로 납부 일정과 저축 시뮬레이션에도
                            반영되어 있습니다. 다만 잔금 단계에서 주담대 한도가 그만큼 비므로,
                            입주 시 한도를 다시 채워 쓰면 최종 자기자본은 순 절감액만큼만 줄어듭니다.
                          </div>
                        </>
                      ) : (
                        <div className="note" style={{ marginTop: 12, color: "var(--debit)" }}>
                          선택한 상환일({fmtDate(preDate)}) 기준으로 상환할 수 있는 실행 회차가 없습니다.
                          대출을 실행한 회차의 실행일 이후, 입주지정일 이전으로 날짜를 잡아 주세요.
                        </div>
                      )}
                    </div>
                  )}
                  {!preOn && (
                    <div className="note" style={{ marginTop: 8 }}>
                      여력이 생겼을 때 실행한 중도금 대출을 회차 단위로 미리 상환하는 경우를
                      계산합니다. 상환일과 수수료율을 넣으면 절감 이자·보증료 환급·수수료를 반영해
                      납부 일정까지 다시 계산됩니다.
                    </div>
                  )}
                </div>

                <div className="verdict">
                  이자는 후불로 입주 시 한 번에 내지만, <b>보증료는 회차별 대출 실행 시 일시납</b>이라
                  그 시점에 현금이 필요합니다. 여기에 대출약정서 인지세
                  <b className="num"> {Math.round(calc.stampLoan / 1e4).toLocaleString()}만원</b>이
                  1회차에 더해집니다(은행과 각 50%).
                </div>
                <div className="note" style={{ marginTop: 10 }}>
                  회차별 실행일부터 입주지정일({fmtDate(moveIn)})까지 단리 누적.
                  보증료는 보증금액 × 요율 × 보증기간/365로 계산했고, 중도상환 시 잔여기간분은 환급 대상입니다.
                  대출은 한도까지 회차 순서대로 실행되므로, 한도를 넘는 구간에서는
                  초과분이 마지막 회차 쪽에 몰려 그 시점에 현금으로 납부하게 됩니다.
                  초과분을 전 회차에 균등 분산하면 이자가 과소 계산되므로 순차 실행으로 잡았습니다.
                  공고문에 금리 변경 시 이의 제기 불가 조항이 있으므로 상방 위험은 계약자 부담입니다.
                </div>
              </>
            )}

            {tab === "save" && (
              <>
                <div className="ctrl" style={{ marginBottom: 14 }}>
                  <div className="field">
                    <label>현재 자기자본 (억)</label>
                    <input type="number" step="0.5" value={equityNow}
                      onChange={(e) => setEquityNow(+e.target.value || 0)} />
                  </div>
                  <div className="field">
                    <label>월 저축액 (만원)</label>
                    <input type="number" step="50" value={monthlySave}
                      onChange={(e) => setMonthlySave(+e.target.value || 0)} />
                  </div>
                </div>
                <table>
                  <thead>
                    <tr><th>시점</th><th>구분</th><th className="r">자기자본 유출</th><th className="r">잔고</th></tr>
                  </thead>
                  <tbody>
                    {calc.flow.map((f, i) => (
                      <tr key={f.id}>
                        <td className="num">{fmtDate(f.date)}</td>
                        <td>{f.label}</td>
                        <td className="r num" style={{ color: f.self > 1e4 ? "var(--debit)" : "var(--ink3)" }}>
                          {f.self > 1e4 ? `−${won(f.self)}` : "—"}
                        </td>
                        <td className="r num" style={{
                          fontWeight: 600,
                          color: calc.path[i].balance < 0 ? "var(--debit)" : "var(--credit)",
                        }}>
                          {won(calc.path[i].balance)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className={`verdict ${calc.endBalance < 0 ? "warn" : ""}`}>
                  {equityNow === 0 && monthlySave === 0 ? (
                    <>위 두 칸에 본인의 자기자본과 월 저축액을 넣으면 시점별 잔고가 계산됩니다.
                      기본값은 비워 두었습니다.</>
                  ) : calc.endBalance >= 0 ? (
                    <>잔금을 치르고 <b className="num">{won(calc.endBalance)}</b>가 남습니다.
                      입주 후 월 상환액은 <b className="num">
                        {Math.round(calc.mp / 1e4).toLocaleString()}만원
                      </b> ({payRate.toFixed(2)}% · 30년)입니다.</>
                  ) : (
                    <><b className="num">{won(-calc.endBalance)}</b>가 부족합니다.
                      층·타입·옵션 또는 월 저축액을 조정해 보세요.</>
                  )}
                </div>
                <div className="note" style={{ marginTop: 8 }}>
                  투자수익 0%, 소득·지출 변동 없음을 가정합니다.
                  출산·육아기 저축률 하락과 투자수익을 함께 보려면 월별 시뮬레이션 쪽을 쓰시는 편이 낫습니다.
                </div>
              </>
            )}
          </div>
        </div>

        <div className="panel">
          <div className="phead">비교 참고</div>
          <div className="pbody">
            <table>
              <tbody>
                <tr>
                  <td>실질 총액 · 공급면적 평당</td>
                  <td className="r num">{Math.round(calc.perPyeong / 1e4).toLocaleString()}만원</td>
                </tr>
                <tr>
                  <td>실질 총액 · 전용 ㎡당</td>
                  <td className="r num">{Math.round(calc.perExcM / 1e4).toLocaleString()}만원</td>
                </tr>
                <tr>
                  <td>취득세 (전용 85㎡ 이하 · 지방교육세 포함)</td>
                  <td className="r num">{won(calc.acqTax)} · {(calc.acqRate * 100).toFixed(2)}%</td>
                </tr>
                <tr>
                  <td>중도금 대출 보증료 (연 {gRate}%)
                    <div className="note">회차별 실행 시 일시납</div>
                  </td>
                  <td className="r num">{won(calc.gFee)}</td>
                </tr>
                <tr>
                  <td>인지세 계약자 부담분
                    <div className="note">
                      분양계약서 {Math.round(calc.stampHome / 1e4).toLocaleString()}만 ·
                      발코니 확장 {Math.round(calc.stampBalc / 1e4).toLocaleString()}만 ·
                      대출약정 {Math.round(calc.stampLoan / 1e4).toLocaleString()}만
                    </div>
                  </td>
                  <td className="r num">{Math.round(calc.stamps / 1e4).toLocaleString()}만원</td>
                </tr>
                <tr>
                  <td>힐스테이트 소사역 84㎡ 실거래 (2026.02, 21층)
                    <div className="note">전용 84.9㎡ 가정 · 전용 ㎡당 1,119만원</div>
                  </td>
                  <td className="r num">9억 5,000만</td>
                </tr>
                <tr>
                  <td>전용 ㎡당 차액</td>
                  <td className="r num" style={{
                    color: calc.perExcM > 11_190_000 ? "var(--debit)" : "var(--credit)",
                  }}>
                    {calc.perExcM > 11_190_000 ? "+" : "−"}
                    {Math.round(Math.abs(calc.perExcM - 11_190_000) / 1e4).toLocaleString()}만원
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="note" style={{ marginTop: 8 }}>
              힐스테이트 소사역은 2025년 6월 입주로, 본 단지 입주 시점에는 7년차가 됩니다.
              평당·㎡당 비교는 면적 차이를 보정하지만 층·향·동 위치 차이는 보정하지 않습니다.
            </div>
          </div>
        </div>

        </>)}

        <div className="disc">
          <div className="dh">참고자료 고지 — 반드시 읽어 주십시오</div>
          <p>
            <b>이 자료는 입주자모집공고 제2026000382호(2026.08.12. 부천시청 주거정비과 승인)만을
            토대로 작성된 참고자료이며, 실제와 다를 수 있습니다.</b> 계약·대출·납부에 관한 어떠한
            판단도 이 자료만으로 하지 마시고, 반드시 공급계약서 원문과 금융기관·사업주체의 공식
            안내로 확인하십시오.
          </p>
          <p>
            특히 다음 항목은 <b>확정된 값이 아닙니다.</b>
          </p>
          <ul>
            <li><b>세부 일정</b> — 중도금 회차별 납부일은 공고문상 건축공정에 따라 변동될 수 있고
              (「주택공급에 관한 규칙」 제60조), 입주예정일 2032년 2월도 추후 통보 사항입니다. 계약금 1·2차 납부일은 계약 시기에 따라 사람마다 다르므로 ‹납부 일정 조정›에서 본인 계약서의 날짜로 바꿔 계산하십시오.
              유상옵션 계약금 납부 시점은 공고문에 없어 <b>2026년 12월로 임의 가정</b>했습니다.</li>
            <li><b>옵션 금액</b> — 공고문 공개 금액이며, 실제 유상옵션 계약은 그 총액 범위 내에서
              사업주체가 정한 기준에 따라 별도 체결됩니다. 품목·사양·구성이 변경될 수 있습니다.</li>
            <li><b>중도금 대출 금리와 이자</b> — 4.9% 고정은 <b>협의 중인 조건으로 확정이 아니며</b>,
              실제로는 변동금리로 재산정될 수 있습니다. 공고문에 금리 변경 시 이의를 제기할 수 없다는
              조항이 있어 상방 위험은 계약자가 부담합니다. 이 자료의 이자는 단리 누적 추정치로,
              실제 청구액과 다릅니다.</li>
            <li><b>보증료</b> — HUG 주택구입자금보증 연 0.130% 단일요율을 적용했습니다. 보증기관과
              요율은 은행이 정하며, 공고문은 보증수수료·인지대 등 제반 경비를 계약자 부담으로만
              규정하고 금액을 명시하지 않습니다.</li>
            <li><b>취득세</b> — 현행 세율 기준 추정입니다. 입주 시점인 2032년의 세제는 달라질 수
              있습니다.</li>
            <li><b>잔금 대출</b> — 한도·LTV·금리 모두 입력값에 따른 가정이며, 입주 시점의 규제와
              심사 결과에 따라 결정됩니다. 잔금 대출에 수반되는 보증료·인지세·근저당 설정비용은
              이 자료에 반영되지 않았습니다.</li>
          </ul>
          <p>
            층별 세대수는 특별공급을 포함한 해당 구간 총 공급세대수입니다.
            유상옵션 계약서의 인지세는 공고문에 규정이 없어 반영하지 않았습니다.
            작성자는 이 자료의 정확성을 보증하지 않으며, 이 자료를 근거로 한 판단의 결과에 대하여
            책임을 지지 않습니다. <b>투자자문이 아닙니다.</b>
          </p>
        </div>

        <div className="sitefoot">
          <a href="https://cafe.naver.com/zenithbc" target="_blank" rel="noopener noreferrer">
            두산위브더제니스 부천 입주예정자 협의회
          </a>
          {BUILD_AT && <span className="num">최종 갱신 {BUILD_AT}</span>}
        </div>
      </div>
    </div>
  );
}
