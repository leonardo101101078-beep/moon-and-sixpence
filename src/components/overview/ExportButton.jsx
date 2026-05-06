import { exportExcel } from '../../utils/exportExcel'

export default function ExportButton({
  expenses,
  fixedExpenses,
  selectedMonth,
  budget,
}) {
  return (
    <button
      type="button"
      className="primary-button w-full"
      onClick={async () => {
        await exportExcel({
          expenses,
          fixedExpenses,
          selectedMonth,
          budget,
        })
      }}
    >
      匯出 Excel
    </button>
  )
}
