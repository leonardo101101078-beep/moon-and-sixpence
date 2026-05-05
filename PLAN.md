# 實作執行計畫

## Step 1 — 專案初始化

```bash
npm create vite@latest . -- --template react
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm install -D vite-plugin-pwa workbox-window
npm install react-router-dom@6 recharts xlsx
```

設定 `src/styles/index.css`：
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

更新 `tailwind.config.js` content：
```js
content: ['./index.html', './src/**/*.{js,jsx}']
```

## Step 2 — vite.config.js（PWA）

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon-192.png', 'icon-512.png'],
      manifest: {
        name: '支出記錄',
        short_name: '支出',
        description: '個人支出追蹤小幫手',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      }
    })
  ]
})
```

加入 `public/icon-192.png` 和 `public/icon-512.png`（任意正方形圖示）。

## Step 3 — utils/storage.js

```js
export const getItem = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback }
  catch { return fallback }
}
export const setItem = (key, value) =>
  localStorage.setItem(key, JSON.stringify(value))
```

## Step 4 — utils/tagConfig.js

```js
export const TAGS = ['飲食','房租','衣物','飲品','雜貨','社交','醫療','手機','訂閱','交通','旅行','其他']

export const TAG_COLORS = {
  飲食: '#FF6384', 房租: '#36A2EB', 衣物: '#FFCE56',
  飲品: '#4BC0C0', 雜貨: '#9966FF', 社交: '#FF9F40',
  醫療: '#FF6384', 手機: '#C9CBCF', 訂閱: '#7BC8A4',
  交通: '#5C85D6', 旅行: '#F5A623', 其他: '#B0B0B0'
}
```

## Step 5 — utils/dateHelpers.js

- `toMonthKey(date)` → `"YYYY-MM"`
- `formatDate(dateStr)` → 本地化顯示（如 `5月3日`）
- `groupByDate(expenses)` → `Map<dateStr, Expense[]>` 依日期降序分組

## Step 6 — Hooks

### hooks/useExpenses.js
- state 初始化自 `getItem('expenses', [])`
- `addExpense(data)` → 加入陣列後存回
- `removeExpense(id)` → 過濾後存回
- `getExpensesForMonth(monthKey)` → 過濾 `expense.date.startsWith(monthKey)`

### hooks/useBudget.js
- state 初始化自 `getItem('budgets', {})`
- `getBudget(monthKey)` → `budgets[monthKey] ?? 0`
- `setBudget(monthKey, amount)` → 更新 map 後存回

### hooks/useFixedExpenses.js
- state 初始化自 `getItem('fixedExpenses', [])`
- `addFixed(data)` / `removeFixed(id)`

## Step 7 — App.jsx + BottomTabBar

```jsx
// App.jsx
import { HashRouter, Routes, Route } from 'react-router-dom'
import ExpenseList from './pages/ExpenseList'
import Overview from './pages/Overview'
import BottomTabBar from './components/layout/BottomTabBar'

export default function App() {
  return (
    <HashRouter>
      <div className="flex flex-col h-screen">
        <main className="flex-1 overflow-y-auto pb-16">
          <Routes>
            <Route path="/" element={<ExpenseList />} />
            <Route path="/overview" element={<Overview />} />
          </Routes>
        </main>
        <BottomTabBar />
      </div>
    </HashRouter>
  )
}
```

`BottomTabBar`：使用 `useLocation` + `NavLink`，兩個 tab（支出列表 `/`、總覽 `/overview`），固定底部，active 狀態加深顏色。

## Step 8 — 頁面 1 元件

### components/expense/TagChips.jsx
- 接受 `selected`（string）、`onSelect`（fn）
- 渲染 12 個 TAGS chip，selected 的填充背景色（TAG_COLORS）

### components/expense/ExpenseForm.jsx
- 受控表單：`{ date, amount, currency, note, tag }`
- `date` 預設 `new Date().toISOString().slice(0,10)`
- `currency` select：SGD/USD/EUR/GBP/JPY/CNY/HKD/MYR/AUD/TWD
- `TagChips` 嵌入其中
- submit 呼叫 `addExpense` 後重置表單（date 保持今天）

### components/expense/BudgetHeader.jsx
- 顯示 `[monthTotal] / [budget]`
- 點擊預算數字切換為 `<input type="number">`，blur/Enter 呼叫 `setBudget`
- 下方進度條：`w-[X%]`，超過 80% 轉橘，超過 100% 轉紅

### components/expense/ExpenseItem.jsx
- 顯示：tag 色點、備註、金額 + 幣值
- 右側刪除按鈕（確認後呼叫 `removeExpense`）

### components/expense/ExpenseListGroup.jsx
- 接受 `expenses`，呼叫 `groupByDate`
- 每組渲染 sticky 日期 header + 各 `ExpenseItem`

### pages/ExpenseList.jsx
- `selectedMonth` state（預設 `toMonthKey(new Date())`）
- 上下箭頭切換月份
- 組合以上所有元件

## Step 9 — 頁面 2 元件

### components/overview/DonutChart.jsx
- 接受 `expenses`（當月）
- 依 tag 加總金額
- 使用 Recharts `PieChart` + `Pie`（`innerRadius={60}`, `outerRadius={90}`）
- `Tooltip` 顯示 tag + 金額 + 百分比
- 自定義 `Legend`（色塊 + tag 名 + 金額）

### components/overview/FixedExpenseForm.jsx
- 欄位：`dayOfMonth`（1–31）、`name`、`amount`、`currency`、`note`
- submit 呼叫 `addFixed`

### components/overview/FixedExpenseItem.jsx
- 顯示：日期 badge、名稱、金額幣值、備註、刪除按鈕

### components/overview/FixedExpenseList.jsx
- 列表 + 「+」展開 `FixedExpenseForm`

### components/overview/ExportButton.jsx
- 按鈕呼叫 `exportExcel(expenses, fixedExpenses)`

### pages/Overview.jsx
- 組合以上元件

## Step 10 — utils/exportExcel.js

```js
import * as XLSX from 'xlsx'

export function exportExcel(expenses, fixedExpenses) {
  const wb = XLSX.utils.book_new()

  const expRows = [...expenses]
    .sort((a, b) => b.date.localeCompare(a.date))
    .map(e => ({ 日期: e.date, 金額: e.amount, 幣值: e.currency, 標籤: e.tag, 備註: e.note }))
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(expRows), 'Expenses')

  const fixRows = fixedExpenses.map(f => ({
    扣款日: f.dayOfMonth, 項目: f.name, 金額: f.amount, 幣值: f.currency, 備註: f.note
  }))
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(fixRows), 'Fixed Expenses')

  XLSX.writeFile(wb, `expenses-${new Date().toISOString().slice(0, 10)}.xlsx`)
}
```

## Step 11 — 驗證

```bash
npm run build && npm run preview
```

- [ ] 新增支出後 BudgetHeader 總額即時更新
- [ ] 點擊預算可 inline 編輯，刷新後仍保留
- [ ] 標籤 chip 選中樣式正確，支出列表顯示 tag 色點
- [ ] 支出列表依日期降序分組
- [ ] 刷新頁面資料不遺失
- [ ] 總覽甜甜圈圖比例與顏色正確
- [ ] 固定支出可新增 / 刪除
- [ ] 匯出 Excel 含兩個 sheets
- [ ] Chrome DevTools → Application → Manifest 正常解析
- [ ] 可加到主畫面（iOS Safari / Chrome Android）
