import { NavLink } from 'react-router-dom'

const TABS = [
  { to: '/', label: '支出列表', hint: '記下今天' },
  { to: '/overview', label: '總覽', hint: '查看分布' },
]

function linkClassName(isActive) {
  return [
    'flex-1 rounded-[22px] px-4 py-3 text-left transition',
    isActive
      ? 'bg-stone-900 text-white shadow-[0_18px_35px_rgba(28,25,23,0.18)]'
      : 'bg-stone-100/90 text-stone-500 hover:bg-white hover:text-stone-800',
  ].join(' ')
}

export default function BottomTabBar() {
  return (
    <nav className="sticky bottom-4 z-20 mt-4 card p-2">
      <div className="flex gap-2">
        {TABS.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) => linkClassName(isActive)}
          >
            {({ isActive }) => (
              <div className="space-y-1">
                <p className="text-sm font-semibold tracking-[-0.02em]">{tab.label}</p>
                <p className={isActive ? 'text-xs text-white/70' : 'text-xs text-stone-400'}>
                  {tab.hint}
                </p>
              </div>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
