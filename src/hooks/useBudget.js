import { useEffect, useState } from 'react'
import { getItem, setItem } from '../utils/storage'

const STORAGE_KEY = 'budgets'

export function useBudget() {
  const [budgets, setBudgets] = useState(() => getItem(STORAGE_KEY, {}))

  useEffect(() => {
    setItem(STORAGE_KEY, budgets)
  }, [budgets])

  function getBudget(monthKey) {
    return Number(budgets[monthKey] ?? 0)
  }

  function setBudget(monthKey, amount) {
    const normalizedAmount = Number.isFinite(amount) ? Math.max(amount, 0) : 0

    setBudgets((currentBudgets) => ({
      ...currentBudgets,
      [monthKey]: normalizedAmount,
    }))
  }

  return {
    budgets,
    getBudget,
    setBudget,
  }
}
