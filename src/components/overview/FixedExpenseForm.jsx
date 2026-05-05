import { useState } from 'react'
import { CURRENCY_OPTIONS } from '../../utils/currencyOptions'

const INITIAL_FORM = {
  dayOfMonth: '1',
  name: '',
  amount: '',
  currency: 'SGD',
  note: '',
}

export default function FixedExpenseForm({ onSubmit }) {
  const [form, setForm] = useState(INITIAL_FORM)

  function updateField(field, value) {
    setForm((currentForm) => ({ ...currentForm, [field]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (!form.name || !form.amount || Number(form.amount) <= 0) {
      window.alert('請填寫名稱並輸入大於 0 的金額。')
      return
    }

    const normalizedDay = Number(form.dayOfMonth)

    if (!Number.isInteger(normalizedDay) || normalizedDay < 1 || normalizedDay > 31) {
      window.alert('扣款日需介於 1 到 31。')
      return
    }

    onSubmit({
      ...form,
      dayOfMonth: normalizedDay,
      amount: Number(form.amount),
    })

    setForm(INITIAL_FORM)
  }

  return (
    <form className="space-y-3 rounded-[24px] bg-stone-50/90 p-4" onSubmit={handleSubmit}>
      <div className="grid grid-cols-2 gap-3">
        <label className="space-y-2">
          <span className="text-sm font-medium text-stone-600">扣款日</span>
          <input
            className="input"
            type="number"
            min="1"
            max="31"
            value={form.dayOfMonth}
            onChange={(event) => updateField('dayOfMonth', event.target.value)}
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-stone-600">幣值</span>
          <select
            className="input"
            value={form.currency}
            onChange={(event) => updateField('currency', event.target.value)}
          >
            {CURRENCY_OPTIONS.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="space-y-2">
        <span className="text-sm font-medium text-stone-600">名稱</span>
        <input
          className="input"
          type="text"
          placeholder="Netflix、房租、電話費..."
          value={form.name}
          onChange={(event) => updateField('name', event.target.value)}
        />
      </label>

      <label className="space-y-2">
        <span className="text-sm font-medium text-stone-600">金額</span>
        <input
          className="input"
          type="number"
          min="0"
          step="0.01"
          inputMode="decimal"
          placeholder="10.98"
          value={form.amount}
          onChange={(event) => updateField('amount', event.target.value)}
        />
      </label>

      <label className="space-y-2">
        <span className="text-sm font-medium text-stone-600">備註</span>
        <input
          className="input"
          type="text"
          placeholder="自動扣款備註"
          value={form.note}
          onChange={(event) => updateField('note', event.target.value)}
        />
      </label>

      <button type="submit" className="primary-button w-full">
        新增固定支出
      </button>
    </form>
  )
}
