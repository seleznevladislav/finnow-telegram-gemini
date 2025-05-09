
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Search, Filter, Calendar, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import TransactionItem from "@/components/TransactionItem";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Transactions() {
  const navigate = useNavigate();
  
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
          date: new Date(2025, 3, 12), // April 12, 2025
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
        },
        {
          id: "t6",
          title: "Перевод на накопительный счет",
          amount: 15000,
          currency: "₽",
          date: new Date(2025, 3, 10),
          category: "Переводы",
          type: "transfer" as const,
          account: "Сбербанк •7890"
        }
      ]
    }
  ];
  
  return (
    <div className="pb-20">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-background px-4 py-3 flex items-center justify-between border-b border-border">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className="mr-2"
            onClick={() => navigate('/')}
          >
            <ChevronLeft size={20} />
          </Button>
          <h1 className="text-xl font-semibold">История операций</h1>
        </div>
        <Button 
          variant="ghost" 
          size="icon"
          className="rounded-full"
        >
          <Calendar size={20} />
        </Button>
      </div>
      
      {/* Main content */}
      <div className="animate-fade-in">
        {/* Filters */}
        <div className="p-4">
          {/* Search & Filter */}
          <div className="flex space-x-2 mb-4">
            <div className="neumorph-inset flex items-center px-4 py-2 flex-1">
              <Search size={18} className="text-muted-foreground mr-2" />
              <input 
                type="text" 
                placeholder="Поиск транзакций..." 
                className="bg-transparent border-none outline-none w-full text-sm placeholder:text-muted-foreground"
              />
            </div>
            <Button variant="outline" size="icon" className="neumorph">
              <Filter size={18} />
            </Button>
          </div>
          
          {/* Quick Filters */}
          <div className="flex space-x-2 mb-4 overflow-x-auto py-1 no-scrollbar">
            <Button variant="outline" size="sm" className="neumorph whitespace-nowrap">
              Все операции
            </Button>
            <Button variant="outline" size="sm" className="neumorph whitespace-nowrap">
              Расходы
            </Button>
            <Button variant="outline" size="sm" className="neumorph whitespace-nowrap">
              Доходы
            </Button>
            <Button variant="outline" size="sm" className="neumorph whitespace-nowrap">
              Переводы
            </Button>
          </div>
          
          {/* Account Filter */}
          <div className="mb-4">
            <Select defaultValue="all">
              <SelectTrigger className="neumorph">
                <SelectValue placeholder="Выберите счет" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все счета</SelectItem>
                <SelectItem value="1">Альфа-Банк •4567</SelectItem>
                <SelectItem value="2">Сбербанк •7890</SelectItem>
                <SelectItem value="3">Альфа-Банк •1234</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Transactions List */}
        <div>
          {transactionsByDate.map((group) => (
            <div key={group.date} className="mb-4">
              <h2 className="font-medium text-sm px-4 mb-2">{group.date}</h2>
              <div className="neumorph mx-4 overflow-hidden rounded-2xl">
                {group.transactions.map((transaction) => (
                  <TransactionItem 
                    key={transaction.id}
                    {...transaction}
                    onClick={() => navigate(`/transactions/${transaction.id}`)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
