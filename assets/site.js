// 車のお金サイトのツール一覧（このサイト専用。ほかのサイトとは別管理）
const TOOLS = [
  { path: "/kuruma/", name: "車の維持費 計算", desc: "税金・保険・ガソリン・車検・駐車場まで、年間と月あたりの維持費を計算" },
  { path: "/kuruma/jidoushazei/", name: "自動車税・軽自動車税 計算", desc: "排気量と登録年から税額を計算。13年超の重課や月割の還付も" },
  { path: "/kuruma/shaken/", name: "車検費用 計算", desc: "重量税・自賠責・印紙代の法定費用と、車検の総額の目安" },
  { path: "/kuruma/gasoline/", name: "ガソリン代 計算", desc: "走行距離と燃費から、月・年のガソリン代と車同士の比較" },
  { path: "/kuruma/norikae/", name: "乗り換え 損得 計算", desc: "今の車に乗り続けるか、買い替えるか。年数ごとの総額を比較" },
  { path: "/kuruma/lease/", name: "カーリース vs 購入 比較", desc: "カーリース・現金購入・ローン購入の総額を比べる" },
  { path: "/kuruma/loan/", name: "カーローン 計算", desc: "毎月の返済額と利息の総額。残価設定ローンにも対応" },
];

const yen = n => Math.round(n).toLocaleString("ja-JP") + "円";

document.addEventListener("DOMContentLoaded", () => {
  const el = document.getElementById("related");
  if (!el) return;
  const here = location.pathname.replace(/index\.html$/, "");
  el.innerHTML = `<h2>ほかのツール</h2><ul class="tools">${TOOLS.filter(t => t.path !== here)
    .map(t => `<li><a href="${t.path}"><b>${t.name}</b><span>${t.desc}</span></a></li>`).join("")}</ul>`;
});
