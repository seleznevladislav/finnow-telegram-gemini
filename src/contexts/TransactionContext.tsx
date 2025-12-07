import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Transaction } from "@/utils/csv";

interface TransactionContextType {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  importTransactions: (transactions: Transaction[], replace?: boolean) => void;
  clearTransactions: () => void;
  getTransactionsByType: (type: 'income' | 'expense') => Transaction[];
  getTransactionsByCategory: () => { category: string; total: number; count: number }[];
  getTotalIncome: () => number;
  getTotalExpenses: () => number;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

const STORAGE_KEY = 'finnow_transactions';

// Транзакции по умолчанию (демо данные)
const defaultTransactions: Transaction[] = [
  {
    id: 'demo_1',
    date: '2025-01-15',
    description: 'Покупка продуктов в Пятёрочке',
    amount: -1500,
    category: 'Продукты',
    type: 'expense',
    account: 'Основная карта',
  },
  {
    id: 'demo_2',
    date: '2025-01-20',
    description: 'Зарплата',
    amount: 85000,
    category: 'Доход',
    type: 'income',
    account: 'Основная карта',
  },
  {
    id: 'demo_3',
    date: '2025-01-22',
    description: 'Оплата Яндекс.Музыка',
    amount: -299,
    category: 'Подписки',
    type: 'expense',
    account: 'Основная карта',
  },
  {
    id: 'demo_4',
    date: '2025-01-25',
    description: 'Ресторан "Теремок"',
    amount: -850,
    category: 'Рестораны',
    type: 'expense',
    account: 'Основная карта',
  },
  {
    id: 'demo_5',
    date: '2025-02-01',
    description: 'Покупка в Магните',
    amount: -2300,
    category: 'Продукты',
    type: 'expense',
    account: 'Основная карта',
  },
  {
    id: 'demo_6',
    date: '2025-02-05',
    description: 'Яндекс.Такси',
    amount: -450,
    category: 'Транспорт',
    type: 'expense',
    account: 'Основная карта',
  },
  {
    id: 'demo_7',
    date: '2025-02-10',
    description: 'Кинотеатр',
    amount: -1200,
    category: 'Развлечения',
    type: 'expense',
    account: 'Основная карта',
  },
  {
    id: 'demo_8',
    date: '2025-02-15',
    description: 'Покупка продуктов',
    amount: -1800,
    category: 'Продукты',
    type: 'expense',
    account: 'Основная карта',
  },
];

export function TransactionProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return defaultTransactions;
      }
    }
    return defaultTransactions;
  });

  // Сохранение в localStorage при изменении
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
    setTransactions(prev => [...prev, newTransaction]);
  };

  const importTransactions = (newTransactions: Transaction[], replace = false) => {
    if (replace) {
      setTransactions(newTransactions);
    } else {
      setTransactions(prev => [...prev, ...newTransactions]);
    }
  };

  const clearTransactions = () => {
    setTransactions([]);
  };

  const getTransactionsByType = (type: 'income' | 'expense') => {
    return transactions.filter(t => t.type === type);
  };

  const getTransactionsByCategory = () => {
    const categoryMap = new Map<string, { total: number; count: number }>();

    transactions.forEach(t => {
      if (t.type === 'expense') {
        const existing = categoryMap.get(t.category) || { total: 0, count: 0 };
        categoryMap.set(t.category, {
          total: existing.total + Math.abs(t.amount),
          count: existing.count + 1,
        });
      }
    });

    return Array.from(categoryMap.entries()).map(([category, data]) => ({
      category,
      total: data.total,
      count: data.count,
    })).sort((a, b) => b.total - a.total);
  };

  const getTotalIncome = () => {
    return transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getTotalExpenses = () => {
    return Math.abs(transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0));
  };

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        addTransaction,
        importTransactions,
        clearTransactions,
        getTransactionsByType,
        getTransactionsByCategory,
        getTotalIncome,
        getTotalExpenses,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransactions() {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error("useTransactions must be used within TransactionProvider");
  }
  return context;
}
