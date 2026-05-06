# 記帳小幫手 PWA

## 專案概述
個人記帳 PWA，兩頁架構：支出列表 + 總覽。無後端，所有資料存於 localStorage。

## 技術棧
- **框架**: React 18 + Vite 5
- **樣式**: Tailwind CSS v3
- **路由**: react-router-dom v6（HashRouter）
- **圖表**: Recharts（甜甜圈圖）
- **匯出**: SheetJS (xlsx)
- **PWA**: vite-plugin-pwa + Workbox

## 檔案結構

```
src/
├── main.jsx
├── App.jsx                          # HashRouter + BottomTabBar
├── pages/
│   ├── ExpenseList.jsx              # 頁面 1：支出列表
│   └── Overview.jsx                 # 頁面 2：總覽
├── components/
│   ├── layout/
│   │   └── BottomTabBar.jsx         # 底部兩欄導航
│   ├── expense/
│   │   ├── BudgetHeader.jsx         # 總額 / 預算（inline 編輯）
│   │   ├── ExpenseForm.jsx          # 新增支出表單
│   │   ├── TagChips.jsx             # 可點擊標籤列
│   │   ├── ExpenseListGroup.jsx     # 依日期分組列表
│   │   └── ExpenseItem.jsx          # 單筆支出 row
│   └── overview/
│       ├── DonutChart.jsx
│       ├── FixedExpenseList.jsx
│       ├── FixedExpenseItem.jsx
│       ├── FixedExpenseForm.jsx
│       └── ExportButton.jsx
├── hooks/
│   ├── useExpenses.js
│   ├── useBudget.js
│   └── useFixedExpenses.js
└── utils/
    ├── storage.js                   # localStorage getItem/setItem 封裝
    ├── tagConfig.js                 # TAGS 陣列 + TAG_COLORS map
    ├── dateHelpers.js               # 日期格式化、分組、monthKey
    └── exportExcel.js               # SheetJS 匯出邏輯
```

## 資料模型（localStorage）

### `expenses` → `Expense[]`
```jsonc
{
  "id": "string (crypto.randomUUID())",
  "date": "YYYY-MM-DD",
  "amount": 12.50,
  "currency": "SGD",   // 純顯示標記，不換算
  "note": "string",
  "tag": "飲食"        // 12 個預設標籤之一
}
```

### `budgets` → `{ [YYYY-MM]: number }`
```jsonc
{ "2026-05": 3000 }
```

### `fixedExpenses` → `FixedExpense[]`
```jsonc
{
  "id": "string",
  "dayOfMonth": 1,     // 1–31
  "name": "Netflix",
  "amount": 10.98,
  "currency": "SGD",
  "note": "string"
}
```

## 標籤設定（utils/tagConfig.js）
12 個標籤：飲食、房租、衣物、飲品、雜貨、社交、醫療、手機、訂閱、交通、旅行、其他
每個標籤有對應顏色，用於圖表與標籤 chip 樣式。

## 幣值選項
SGD（預設）、USD、EUR、GBP、JPY、CNY、HKD、MYR、AUD、TWD

## PWA 設定
- `public/icon-192.png` 和 `public/icon-512.png` 為必要 PWA 圖示
- `vite.config.js` 使用 `VitePWA({ registerType: 'autoUpdate', manifest: { name: '支出記錄', display: 'standalone' } })`
- 使用 HashRouter 避免靜態部署的 SPA 路由問題
- 目前 `vite.config.js` 已改為相對路徑 `base: './'`，避免本機預覽時資源指向錯誤子路徑

## 目前進度

### 已完成
- 已完成 React 18 + Vite 5 + Tailwind CSS v3 專案初始化
- 已完成兩頁結構：`支出列表` 與 `總覽`
- 已完成 `HashRouter` 路由與底部 `BottomTabBar`
- 已完成 localStorage 資料層：
  - `expenses`
  - `budgets`
  - `fixedExpenses`
- 已完成支出列表功能：
  - 新增支出
  - 刪除支出
  - 月份切換
  - 依日期分組顯示
  - 月預算 inline 編輯
- 已完成總覽功能：
  - 當月支出甜甜圈圖
  - 固定支出新增 / 刪除
  - Excel 匯出
- 已完成 PWA 基本設定與 manifest 輸出
- 已完成網站圖示整合：
  - `public/favicon.svg`
  - `public/favicon-16x16.png`
  - `public/favicon-32x32.png`
  - `public/apple-touch-icon.png`
  - `public/icon-192.png`
  - `public/icon-512.png`
- 已完成首頁與總覽頁文案更新：
  - 支出列表主標題改為 `月亮與六便士`
  - 支出列表說明改為 `管理好六便士，才能追月亮`
  - 總覽頁主標題改為 `總覽`
- 已完成支出列表與總覽頁精簡化調整：
  - 支出列表頁首右上角 `筆數` 卡片已移除
  - 總覽頁首右上角 `類別數` 卡片已移除
  - 總覽頁主標下方說明句已移除
  - 預算卡中的年月份、支出說明句、`進度` 文字已移除
  - 預算卡主金額改為負號格式顯示
  - 新增支出表單改為 `日期 → 金額 / 幣值 → 備註 → 標籤`
  - 本月紀錄中的幣值已改為顯示在金額後方
- 已完成新增支出表單欄位對齊優化：
  - `日期`、`金額 / 幣值`、`備註` 現在共用同一內容寬度
  - 表單輸入區右邊界已對齊，版面更整齊
- 已完成 Excel 匯出摘要增強：
  - 保留 `Expenses` 與 `Fixed Expenses`
  - 新增 `Summary` sheet
  - `Summary` 會帶出目前總覽月份與當月預算
  - `Summary` 會列出 `SGD` 類別總和
  - 非 `SGD` 項目會在同一張 `Summary` sheet 中分開列出，不混入分類總和

### 最近更新
- 已修正本機預覽空白頁問題：
  - 原因是先前 `base` 固定為 `/moon-and-sixpence/`，導致 localhost 預覽抓錯資源路徑
  - 已改為相對路徑輸出，`dist/index.html` 與 `manifest.webmanifest` 現在會使用 `./...`
- 已確認專案本身可正常渲染：
  - 使用 headless Chrome 驗證 `http://127.0.0.1:5173/#/` 可正常顯示首頁內容
  - `http://127.0.0.1:4173/#/` 若仍空白，較可能是 in-app browser 當前分頁的快取 / 狀態問題，而非專案程式碼錯誤
- 已完成總覽頁匯出資料串接：
  - `Overview` 會把目前 `selectedMonth` 與該月份 `budget` 傳給匯出按鈕
  - `exportExcel` 已從舊的兩參數形式擴充為接收摘要所需資料

### 已驗證
- `npm run build` 可通過
- Headless Chrome 可正常渲染首頁預覽畫面
- favicon、PWA icon 與 iOS `apple-touch-icon` 已接入頁面與 manifest
- `dist/index.html` 與 `dist/manifest.webmanifest` 已確認改為相對資源路徑
- 新的 `Summary` 匯出邏輯已接入並通過建置驗證
