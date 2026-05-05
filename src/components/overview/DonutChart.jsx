import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { TAG_COLORS, TAGS } from '../../utils/tagConfig'

function formatAmount(amount) {
  return new Intl.NumberFormat('en-SG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

function CustomTooltip({ active, payload, totalAmount }) {
  if (!active || !payload?.length) {
    return null
  }

  const currentItem = payload[0].payload
  const percentage = totalAmount > 0 ? (currentItem.value / totalAmount) * 100 : 0

  return (
    <div className="rounded-2xl border border-white/70 bg-white/95 px-3 py-2 shadow-lg">
      <p className="text-sm font-semibold text-stone-900">{currentItem.name}</p>
      <p className="text-xs text-stone-500">
        {formatAmount(currentItem.value)} · {percentage.toFixed(1)}%
      </p>
    </div>
  )
}

export default function DonutChart({ expenses, monthLabel }) {
  const chartData = TAGS.map((tag) => {
    const total = expenses
      .filter((expense) => expense.tag === tag)
      .reduce((sum, expense) => sum + expense.amount, 0)

    return {
      name: tag,
      value: Number(total.toFixed(2)),
      color: TAG_COLORS[tag],
    }
  }).filter((item) => item.value > 0)

  const totalAmount = chartData.reduce((sum, item) => sum + item.value, 0)

  return (
    <section className="card p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="section-title">分類總覽</p>
          <p className="subtle-text">{monthLabel} 的支出分布</p>
        </div>
        <div className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
          {chartData.length} 類
        </div>
      </div>

      {chartData.length === 0 ? (
        <div className="mt-6 rounded-[24px] bg-stone-50 p-6 text-center">
          <p className="text-sm font-medium text-stone-700">這個月份還沒有可視化資料</p>
          <p className="mt-2 text-sm text-stone-500">新增幾筆支出後，圓環圖會自動出現。</p>
        </div>
      ) : (
        <>
          <div className="relative mt-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  innerRadius={68}
                  outerRadius={100}
                  paddingAngle={3}
                  strokeWidth={0}
                >
                  {chartData.map((item) => (
                    <Cell key={item.name} fill={item.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip totalAmount={totalAmount} />} />
              </PieChart>
            </ResponsiveContainer>

            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-xs uppercase tracking-[0.24em] text-stone-400">總支出</p>
              <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-stone-950">
                {formatAmount(totalAmount)}
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            {chartData.map((item) => {
              const share = totalAmount > 0 ? (item.value / totalAmount) * 100 : 0

              return (
                <div
                  key={item.name}
                  className="flex items-center justify-between rounded-[18px] bg-stone-50/90 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                      aria-hidden="true"
                    />
                    <span className="text-sm font-medium text-stone-700">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-stone-900">{formatAmount(item.value)}</p>
                    <p className="text-xs text-stone-500">{share.toFixed(1)}%</p>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}
    </section>
  )
}
