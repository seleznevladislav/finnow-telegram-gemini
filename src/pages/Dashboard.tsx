import { useNavigate } from "react-router-dom";
import {
  Bell,
  ChevronRight,
  CreditCard,
  Plus,
  Search,
  Wallet,
  DollarSign,
  ArrowUpDown,
  BarChart2,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";
import StatCard from "@/components/StatCard";
import AccountCard from "@/components/AccountCard";
import TransactionItem from "@/components/TransactionItem";
import { useTelegram } from "@/hooks/useTelegram";
import { useEffect } from "react";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useTelegram();

  // Вывод данных о пользователе в консоль (для отладки)
  useEffect(() => {
    if (user) {
      console.log("Telegram user data:", user);
    } else {
      console.log("Telegram user data not available");
    }
  }, [user]);

  // Sample account data
  const accounts = [
    {
      id: "1",
      name: "Основная карта",
      bankName: "Альфа-Банк",
      balance: 84590,
      currency: "₽",
      lastDigits: "4567",
      color: "bg-gradient-to-r from-finance-blue to-finance-purple",
    },
    {
      id: "2",
      name: "Накопительный счет",
      bankName: "Сбербанк",
      balance: 125000,
      currency: "₽",
      color: "bg-gradient-to-r from-finance-green to-finance-blue",
    },
  ];

  // Sample recent transactions
  const recentTransactions = [
    {
      id: "t1",
      title: "Супермаркет Перекресток",
      amount: 2450,
      currency: "₽",
      date: new Date(2025, 3, 12), // April 12, 2025
      category: "Продукты",
      type: "expense" as const,
      account: "Альфа-Банк •4567",
    },
    {
      id: "t2",
      title: "Зарплата",
      amount: 85000,
      currency: "₽",
      date: new Date(2025, 3, 10), // April 10, 2025
      category: "Пополнения",
      type: "income" as const,
      account: "Сбербанк •7890",
    },
    {
      id: "t3",
      title: "Кафе Брускетта",
      amount: 1240,
      currency: "₽",
      date: new Date(2025, 3, 11), // April 11, 2025
      category: "Рестораны",
      type: "expense" as const,
      account: "Альфа-Банк •4567",
    },
  ];

  // Получаем имя пользователя из Telegram или используем запасной вариант
  const userName = user?.first_name || "Пользователь";

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-background px-4 py-3 flex items-center justify-between border-b border-border">
        <div>
          <p className="text-muted-foreground text-sm">Привет,</p>
          <h1 className="text-xl font-semibold">{userName}</h1>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="rounded-full relative">
            <Bell size={20} />
            <span className="absolute top-0 right-0 w-2 h-2 bg-finance-red rounded-full"></span>
          </Button>
          <ThemeToggle />
        </div>
      </div>

      {/* Main content */}
      <div className="p-4 animate-fade-in">
        {/* Search */}
        <div className="mb-6">
          <div className="flex items-center px-4 py-2 rounded-xl bg-muted/20 shadow-sm transition focus-within:ring-2 focus-within:ring-primary">
            <Search size={18} className="text-muted-foreground mr-2" />
            <input
              type="text"
              placeholder="Поиск транзакций, счетов..."
              className="bg-transparent border-none outline-none w-full text-sm placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <StatCard
            title="Баланс"
            value={209590}
            currency="₽"
            change={5.2}
            icon={<Wallet size={18} className="text-primary" />}
          />
          <StatCard
            title="Расходы (Апр.)"
            value={43250}
            currency="₽"
            change={-2.8}
            icon={<DollarSign size={18} className="text-finance-red" />}
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-muted/30 flex items-center justify-center rounded-full mb-1">
              <ArrowUpDown size={20} className="text-finance-blue" />
            </div>
            <span className="text-xs">Перевод</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-muted/30 flex items-center justify-center rounded-full mb-1">
              <CreditCard size={20} className="text-finance-purple" />
            </div>
            <span className="text-xs">Оплата</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-muted/30 flex items-center justify-center rounded-full mb-1">
              <BarChart2 size={20} className="text-finance-green" />
            </div>
            <span className="text-xs">Отчеты</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-muted/30 flex items-center justify-center rounded-full mb-1">
              <Calendar size={20} className="text-finance-yellow" />
            </div>
            <span className="text-xs">Платежи</span>
          </div>
        </div>

        {/* Accounts */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">Мои счета</h2>
            <Button
              variant="ghost"
              size="sm"
              className="text-primary"
              onClick={() => navigate("/accounts")}
            >
              <span>Все</span>
              <ChevronRight size={16} />
            </Button>
          </div>

          <div className="space-y-3">
            {accounts.map((account) => (
              <AccountCard
                key={account.id}
                {...account}
                onClick={() => navigate(`/accounts/${account.id}`)}
              />
            ))}
            <Button
              variant="outline"
              className="w-full neumorph flex items-center justify-center py-6"
            >
              <Plus size={18} className="mr-2" />
              <span>Добавить счет</span>
            </Button>
          </div>
        </div>

        {/* Recent Transactions */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">Последние операции</h2>
            <Button
              variant="ghost"
              size="sm"
              className="text-primary"
              onClick={() => navigate("/transactions")}
            >
              <span>Все</span>
              <ChevronRight size={16} />
            </Button>
          </div>

          <div className="neumorph overflow-hidden rounded-2xl">
            {recentTransactions.map((transaction) => (
              <TransactionItem
                key={transaction.id}
                {...transaction}
                onClick={() => navigate(`/transactions/${transaction.id}`)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
