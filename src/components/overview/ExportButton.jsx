import { exportExcel } from '../../utils/exportExcel'

export default function ExportButton({ expenses, fixedExpenses }) {
  return (
    <button
      type="button"
      className="primary-button w-full"
      onClick={async () => {
        await exportExcel(expenses, fixedExpenses)
      }}
    >
      匯出 Excel
    </button>
  )
}
