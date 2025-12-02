import { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface InvestmentAccount {
  accountId: string;
  accountName: string;
  amount: number;
  dateAdded: Date;
}

export type RiskLevel = 'low' | 'medium' | 'high';

export interface InvestmentInstrument {
  id: string;
  name: string;
  type: string; // "Облигации", "Акции", "Крипто", "ETF" и т.д.
  allocation: number; // процент от общей суммы
  amount: number; // сумма в рублях
  expectedYield: number; // ожидаемая доходность в %
  description: string;
  riskLevel: RiskLevel;
}

export interface InvestmentPlan {
  riskLevel: RiskLevel;
  instruments: InvestmentInstrument[];
  totalAmount: number;
  expectedYield: number; // средняя доходность портфеля
  timeframe: string; // "1 год", "2 года" и т.д.
  aiReasoning: string; // аргументация от AI
  generatedAt: Date;
}

interface InvestmentContextType {
  totalAvailable: number;
  accounts: InvestmentAccount[];
  riskLevel: RiskLevel | null;
  investmentPlan: InvestmentPlan | null;
  addFunds: (accountId: string, accountName: string, amount: number) => void;
  removeFunds: (accountId: string) => void;
  clearAllFunds: () => void;
  setRiskLevel: (level: RiskLevel) => void;
  setInvestmentPlan: (plan: InvestmentPlan) => void;
  clearPlan: () => void;
}

const InvestmentContext = createContext<InvestmentContextType | undefined>(undefined);

export function InvestmentProvider({ children }: { children: ReactNode }) {
  const [accounts, setAccounts] = useState<InvestmentAccount[]>(() => {
    // Загрузка из localStorage при инициализации
    const saved = localStorage.getItem('investmentAccounts');
    return saved ? JSON.parse(saved) : [];
  });

  const [riskLevel, setRiskLevel] = useState<RiskLevel | null>(() => {
    const saved = localStorage.getItem('investmentRiskLevel');
    return saved ? (saved as RiskLevel) : null;
  });

  const [investmentPlan, setInvestmentPlan] = useState<InvestmentPlan | null>(() => {
    const saved = localStorage.getItem('investmentPlan');
    return saved ? JSON.parse(saved) : null;
  });

  const totalAvailable = accounts.reduce((sum, acc) => sum + acc.amount, 0);

  // Сохранение в localStorage при изменении
  useEffect(() => {
    localStorage.setItem('investmentAccounts', JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    if (riskLevel) {
      localStorage.setItem('investmentRiskLevel', riskLevel);
    } else {
      localStorage.removeItem('investmentRiskLevel');
    }
  }, [riskLevel]);

  useEffect(() => {
    if (investmentPlan) {
      localStorage.setItem('investmentPlan', JSON.stringify(investmentPlan));
    } else {
      localStorage.removeItem('investmentPlan');
    }
  }, [investmentPlan]);

  const addFunds = (accountId: string, accountName: string, amount: number) => {
    setAccounts(prev => {
      // Проверяем, есть ли уже средства с этого счета
      const existingIndex = prev.findIndex(acc => acc.accountId === accountId);

      if (existingIndex >= 0) {
        // Обновляем существующую запись
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          amount: updated[existingIndex].amount + amount,
          dateAdded: new Date(),
        };
        return updated;
      } else {
        // Добавляем новую запись
        return [...prev, {
          accountId,
          accountName,
          amount,
          dateAdded: new Date(),
        }];
      }
    });
  };

  const removeFunds = (accountId: string) => {
    setAccounts(prev => prev.filter(acc => acc.accountId !== accountId));
  };

  const clearAllFunds = () => {
    setAccounts([]);
    setRiskLevel(null);
    setInvestmentPlan(null);
  };

  const clearPlan = () => {
    setInvestmentPlan(null);
  };

  return (
    <InvestmentContext.Provider
      value={{
        totalAvailable,
        accounts,
        riskLevel,
        investmentPlan,
        addFunds,
        removeFunds,
        clearAllFunds,
        setRiskLevel,
        setInvestmentPlan,
        clearPlan,
      }}
    >
      {children}
    </InvestmentContext.Provider>
  );
}

export function useInvestment() {
  const context = useContext(InvestmentContext);
  if (context === undefined) {
    throw new Error("useInvestment must be used within InvestmentProvider");
  }
  return context;
}
