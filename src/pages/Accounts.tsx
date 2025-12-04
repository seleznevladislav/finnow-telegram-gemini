
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Wallet,
  CreditCard,
  DollarSign,
  PiggyBank,
  Search,
  Filter,
  History
} from "lucide-react";
import { Button } from "@/components/ui/button";
import AccountCard from "@/components/AccountCard";
import TransactionItem from "@/components/TransactionItem";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Accounts() {
  const navigate = useNavigate();

  // Sample account data
  const accounts = [
    {
      id: "1",
      name: "Основная карта",
      bankName: "Альфа-Банк",
      balance: 84590,
      currency: "₽",
      lastDigits: "4567",
      cardType: "Дебетовая"
    },
    {
      id: "2",
      name: "Накопительный счет",
      bankName: "Сбербанк",
      balance: 125000,
      currency: "₽",
    },
    {
      id: "3",
      name: "Кредитная карта",
      bankName: "Т-Банк",
      balance: 45000,
      currency: "₽",
      lastDigits: "1234",
      cardType: "Кредитная"
    },
    {
      id: "4",
      name: "Инвестиционный счет",
      bankName: "ВТБ",
      balance: 350000,
      currency: "₽",
    },
    {
      id: "5",
      name: "Валютный счет",
      bankName: "Т-Банк",
      balance: 2500,
      currency: "$",
    }
  ];
  
  const totalBalance = accounts.reduce((sum, account) => {
    // Simplified conversion for the example (assuming $1 = ₽90)
    const convertedAmount = account.currency === "$"
      ? account.balance * 90
      : account.balance;
    return sum + convertedAmount;
  }, 0);

  // Sample transaction data grouped by date
  const transactionsByDate = [
    {
      date: "12 апреля 2025",
      transactions: [
        {
          id: "t1",
          title: "Супермаркет Перекресток",
          amount: 2450,
          currency: "₽",
          date: new Date(2025, 3, 12),
          category: "Продукты",
          type: "expense" as const,
          account: "Альфа-Банк •4567"
        },
        {
          id: "t2",
          title: "АЗС Газпромнефть",
          amount: 1800,
          currency: "₽",
          date: new Date(2025, 3, 12),
          category: "Транспорт",
          type: "expense" as const,
          account: "Альфа-Банк •4567"
        }
      ]
    },
    {
      date: "11 апреля 2025",
      transactions: [
        {
          id: "t3",
          title: "Кафе Брускетта",
          amount: 1240,
          currency: "₽",
          date: new Date(2025, 3, 11),
          category: "Рестораны",
          type: "expense" as const,
          account: "Альфа-Банк •4567"
        },
        {
          id: "t4",
          title: "Netflix",
          amount: 799,
          currency: "₽",
          date: new Date(2025, 3, 11),
          category: "Подписки",
          type: "expense" as const,
          account: "Т-Банк •1234"
        }
      ]
    },
    {
      date: "10 апреля 2025",
      transactions: [
        {
          id: "t5",
          title: "Зарплата",
          amount: 85000,
          currency: "₽",
          date: new Date(2025, 3, 10),
          category: "Пополнения",
          type: "income" as const,
          account: "Сбербанк •7890"
        }
      ]
    }
  ];
  
  return (
    <div className="pb-20">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm px-4 pt-2 pb-3 flex items-center justify-between relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-gradient-to-r after:from-finance-blue/20 after:via-finance-purple/40 after:to-finance-blue/20">
        <div className="flex items-center">
          <h1 className="text-lg font-bold bg-gradient-to-r from-finance-blue to-finance-purple bg-clip-text text-transparent drop-shadow-sm">Счета и карты</h1>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
        >
          <Plus size={18} />
        </Button>
      </div>

      {/* Main content */}
      <div className="p-4 animate-fade-in">
        {/* Total Balance */}
        <div className="neumorph p-4 mb-6">
          <p className="text-sm text-muted-foreground mb-1">Общий баланс</p>
          <h2 className="text-2xl font-semibold">{totalBalance.toLocaleString()} ₽</h2>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-xs text-muted-foreground">Карты</p>
              <p className="font-medium">3</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Счета</p>
              <p className="font-medium">2</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Банки</p>
              <p className="font-medium">3</p>
            </div>
          </div>
        </div>
        
        {/* Search & Filter */}
        <div className="flex space-x-2 mb-4">
          <div className="neumorph-inset flex items-center px-4 py-2 flex-1">
            <Search size={18} className="text-muted-foreground mr-2" />
            <input 
              type="text" 
              placeholder="Поиск счетов..." 
              className="bg-transparent border-none outline-none w-full text-sm placeholder:text-muted-foreground"
            />
          </div>
          <Button variant="outline" size="icon" className="neumorph">
            <Filter size={18} />
          </Button>
        </div>
        
        {/* Account Tabs */}
        <Tabs defaultValue="all" className="mb-6">
          <TabsList className="grid grid-cols-5 mb-4">
            <TabsTrigger value="all">Все</TabsTrigger>
            <TabsTrigger value="cards">Карты</TabsTrigger>
            <TabsTrigger value="accounts">Счета</TabsTrigger>
            <TabsTrigger value="investments">Инвест.</TabsTrigger>
            <TabsTrigger value="history">История</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-3">
            {accounts.map((account) => (
              <AccountCard 
                key={account.id}
                {...account}
                onClick={() => navigate(`/accounts/${account.id}`)}
              />
            ))}
          </TabsContent>
          
          <TabsContent value="cards" className="space-y-3">
            {accounts
              .filter(account => account.lastDigits)
              .map((account) => (
                <AccountCard 
                  key={account.id}
                  {...account}
                  onClick={() => navigate(`/accounts/${account.id}`)}
                />
              ))}
          </TabsContent>
          
          <TabsContent value="accounts" className="space-y-3">
            {accounts
              .filter(account => !account.lastDigits && account.name !== "Инвестиционный счет")
              .map((account) => (
                <AccountCard 
                  key={account.id}
                  {...account}
                  onClick={() => navigate(`/accounts/${account.id}`)}
                />
              ))}
          </TabsContent>
          
          <TabsContent value="investments" className="space-y-3">
            {accounts
              .filter(account => account.name === "Инвестиционный счет")
              .map((account) => (
                <AccountCard
                  key={account.id}
                  {...account}
                  onClick={() => navigate(`/accounts/${account.id}`)}
                />
              ))}
          </TabsContent>

          <TabsContent value="history">
            <div>
              {transactionsByDate.map((group) => (
                <div key={group.date} className="mb-4">
                  <h2 className="font-medium text-sm mb-2">{group.date}</h2>
                  <div className="neumorph overflow-hidden rounded-2xl">
                    {group.transactions.map((transaction) => (
                      <TransactionItem
                        key={transaction.id}
                        {...transaction}
                        onClick={() => {}}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Quick Actions */}
        <div>
          <h2 className="font-semibold mb-3">Быстрые действия</h2>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="neumorph py-6 flex items-center justify-center">
              <CreditCard size={18} className="mr-2 text-finance-blue" />
              <span>Добавить карту</span>
            </Button>
            <Button variant="outline" className="neumorph py-6 flex items-center justify-center">
              <Wallet size={18} className="mr-2 text-finance-purple" />
              <span>Новый счет</span>
            </Button>
            <Button variant="outline" className="neumorph py-6 flex items-center justify-center">
              <PiggyBank size={18} className="mr-2 text-finance-green" />
              <span>Копилка</span>
            </Button>
            <Button variant="outline" className="neumorph py-6 flex items-center justify-center">
              <DollarSign size={18} className="mr-2 text-finance-yellow" />
              <span>Инвестиции</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
