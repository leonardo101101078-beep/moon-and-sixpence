import { Suspense, lazy } from 'react'
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import BottomTabBar from './components/layout/BottomTabBar'
import { useBudget } from './hooks/useBudget'
import { useExpenses } from './hooks/useExpenses'
import { useFixedExpenses } from './hooks/useFixedExpenses'

const ExpenseList = lazy(() => import('./pages/ExpenseList'))
const Overview = lazy(() => import('./pages/Overview'))

function PageFallback() {
  return (
    <section className="card p-5">
      <p className="section-title">載入中</p>
      <p className="mt-2 subtle-text">正在準備頁面資料與圖表。</p>
    </section>
  )
}

function App() {
  const expenseStore = useExpenses()
  const budgetStore = useBudget()
  const fixedExpenseStore = useFixedExpenses()

  return (
    <HashRouter>
      <div className="min-h-screen px-4 py-6">
        <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-md flex-col">
          <main className="flex-1 pb-28">
            <Suspense fallback={<PageFallback />}>
              <Routes>
                <Route
                  path="/"
                  element={
                    <ExpenseList
                      expenses={expenseStore.expenses}
                      addExpense={expenseStore.addExpense}
                      removeExpense={expenseStore.removeExpense}
                      getBudget={budgetStore.getBudget}
                      setBudget={budgetStore.setBudget}
                    />
                  }
                />
                <Route
                  path="/overview"
                  element={
                    <Overview
                      expenses={expenseStore.expenses}
                      getBudget={budgetStore.getBudget}
                      fixedExpenses={fixedExpenseStore.fixedExpenses}
                      addFixedExpense={fixedExpenseStore.addFixedExpense}
                      removeFixedExpense={fixedExpenseStore.removeFixedExpense}
                    />
                  }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </main>
          <BottomTabBar />
        </div>
      </div>
    </HashRouter>
  )
}

export default App
