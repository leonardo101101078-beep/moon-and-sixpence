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
