# 月亮與六便士

個人記帳 PWA。管理好六便士，才能追月亮。

## 功能

- 支出新增 / 刪除，依日期分組顯示
- 月預算 inline 編輯
- 標籤分類（12 個預設標籤）
- 總覽甜甜圈圖
- 固定支出管理
- Excel 匯出
- PWA（可安裝至手機主畫面）
- 所有資料存於 localStorage，無後端

## 技術棧

- React 18 + Vite 5
- Tailwind CSS v3
- react-router-dom v6（HashRouter）
- Recharts（甜甜圈圖）
- SheetJS / xlsx（匯出）
- vite-plugin-pwa + Workbox

## 本地開發

```bash
npm install
npm run dev
```

## 建置

```bash
npm run build
```
