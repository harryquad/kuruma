// 車の税金・保険の共通計算（2026年10月時点）
const num = id => Math.max(0, Number(document.getElementById(id).value) || 0);
const MAN = 10000;

// 自動車税（種別割）の年額。[排気量の上限cc, 2019年10月以降に新規登録, 2019年9月以前に新規登録, 13年超の重課]
const CAR_TAX = [
  [1000, 25000, 29500, 33900], [1500, 30500, 34500, 39600], [2000, 36000, 39500, 45400],
  [2500, 43500, 45000, 51700], [3000, 50000, 51000, 58600], [3500, 57000, 58000, 66700],
  [4000, 65500, 66500, 76400], [4500, 75500, 76500, 87900], [6000, 87000, 88000, 101200],
  [Infinity, 110000, 111000, 127600],
];

/**
 * 年間の自動車税・軽自動車税
 * p = { kind: "normal"|"kei", cc, regYear, regMonth, fuel: "gas"|"diesel"|"hybrid"|"ev" }
 * 13年超の重課：ガソリン車・ハイブリッド以外は新規登録から13年（ディーゼルは11年）を超えた年度から
 */
function annualCarTax(p, fiscalYear) {
  const age = yearsSince(p.regYear, p.regMonth, fiscalYear);
  const heavyAge = p.fuel === "diesel" ? 11 : 13;
  const heavy = p.fuel !== "hybrid" && p.fuel !== "ev" && age > heavyAge;
  if (p.kind === "kei") {
    if (heavy) return { tax: 12900, note: "13年超の重課" };
    const newer = p.regYear > 2015 || (p.regYear === 2015 && p.regMonth >= 4);
    return { tax: newer ? 10800 : 7200, note: newer ? "2015年4月以降に新規検査" : "2015年3月以前に新規検査" };
  }
  const row = CAR_TAX.find(r => (p.fuel === "ev" ? 1000 : p.cc) <= r[0]);
  if (heavy) return { tax: row[3], note: "13年超の重課（約15%増）" };
  const newer = p.regYear > 2019 || (p.regYear === 2019 && p.regMonth >= 10);
  return { tax: newer ? row[1] : row[2], note: newer ? "2019年10月以降に新規登録" : "2019年9月以前に新規登録" };
}

// 4月1日時点で、新規登録から何年経過しているか（年度で判定）
function yearsSince(regYear, regMonth, fiscalYear) {
  const regFY = regMonth >= 4 ? regYear : regYear - 1;
  return fiscalYear - regFY;
}

/**
 * 自動車重量税（自家用・継続検査・2年分）
 * kind, weight(kg), age（新規登録からの年数）, eco: エコカー（本則税率）
 */
function weightTax2y(kind, weight, age, eco) {
  if (kind === "kei") return eco ? 5000 : age >= 18 ? 8800 : age >= 13 ? 8200 : 6600;
  const units = Math.max(1, Math.ceil(weight / 500));
  const per = eco ? 5000 : age >= 18 ? 12600 : age >= 13 ? 11400 : 8200;
  return units * per;
}

// 自賠責保険料（本土・離島以外、24か月）。2026年11月1日以降に始まる契約から改定
function jibaiseki24(kind, start = new Date()) {
  const after = start >= new Date(2026, 10, 1);
  if (kind === "kei") return after ? 18660 : 17540;
  return after ? 18560 : 17650;
}

// 検査手数料（印紙代など）の目安
const inspectionFee = (kind, shop) => (shop === "user" ? (kind === "kei" ? 2200 : 2300) : 1800);

// 元利均等返済の毎月の返済額
function monthlyPayment(principal, annualRate, months) {
  if (months <= 0) return 0;
  const r = annualRate / 12;
  if (!r) return principal / months;
  return principal * r / (1 - Math.pow(1 + r, -months));
}
