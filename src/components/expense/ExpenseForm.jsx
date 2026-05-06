import { useState } from 'react'
import TagChips from './TagChips'
import { CURRENCY_OPTIONS } from '../../utils/currencyOptions'
import { getLocalDateString } from '../../utils/dateHelpers'
import { TAGS } from '../../utils/tagConfig'

function createInitialFormState() {
  return {
    date: getLocalDateString(),
    amount: '',
    currency: 'SGD',
    note: '',
    tag: TAGS[0],
  }
}

export default function ExpenseForm({ onSubmit }) {
  const [form, setForm] = useState(createInitialFormState)

  function updateField(field, value) {
    setForm((currentForm) => ({ ...currentForm, [field]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (!form.date || !form.amount || Number(form.amount) <= 0) {
      window.alert('請填寫日期並輸入大於 0 的金額。')
      return
    }

    onSubmit({
      ...form,
      amount: Number(form.amount),
    })

    setForm(createInitialFormState())
  }

  return (
    <form className="card space-y-4 p-5" onSubmit={handleSubmit}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="section-title">新增支出</p>
          <p className="subtle-text">快速記下今天花在哪裡。</p>
        </div>
        <div className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
          local
        </div>
      </div>

      <div className="space-y-4 pr-3">
        <label className="space-y-2">
          <span className="text-sm font-medium text-stone-600">日期</span>
          <input
            className="input"
            type="date"
            value={form.date}
            onChange={(event) => updateField('date', event.target.value)}
          />
        </label>

        <div className="grid grid-cols-[minmax(0,1fr)_120px] gap-3">
          <label className="space-y-2">
            <span className="text-sm font-medium text-stone-600">金額</span>
            <input
              className="input"
              type="number"
              min="0"
              step="0.01"
              inputMode="decimal"
              placeholder="12.50"
              value={form.amount}
              onChange={(event) => updateField('amount', event.target.value)}
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
          <span className="text-sm font-medium text-stone-600">備註</span>
          <input
            className="input"
            type="text"
            maxLength="60"
            placeholder="午餐、超市、車資..."
            value={form.note}
            onChange={(event) => updateField('note', event.target.value)}
          />
        </label>
      </div>

      <div className="space-y-2">
        <span className="text-sm font-medium text-stone-600">標籤</span>
        <TagChips selected={form.tag} onSelect={(tag) => updateField('tag', tag)} />
      </div>

      <button type="submit" className="primary-button w-full">
        新增支出
      </button>
    </form>
  )
}
