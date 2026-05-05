import { useEffect, useState } from 'react'
import { getItem, setItem } from '../utils/storage'

const STORAGE_KEY = 'expenses'

export function useExpenses() {
  const [expenses, setExpenses] = useState(() => getItem(STORAGE_KEY, []))

  useEffect(() => {
    setItem(STORAGE_KEY, expenses)
  }, [expenses])

  function addExpense(data) {
    const nextExpense = {
      id: crypto.randomUUID(),
      date: data.date,
      amount: Number(data.amount),
      currency: data.currency,
      note: data.note.trim(),
      tag: data.tag,
    }

    setExpenses((currentExpenses) => [nextExpense, ...currentExpenses])
  }

  function removeExpense(id) {
    setExpenses((currentExpenses) =>
      currentExpenses.filter((expense) => expense.id !== id),
    )
  }

  return {
    expenses,
    addExpense,
    removeExpense,
  }
}
