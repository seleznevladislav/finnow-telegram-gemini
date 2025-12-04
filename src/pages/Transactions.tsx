
import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ChevronLeft, Search, Filter, Calendar, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import TransactionItem from "@/components/TransactionItem";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Transactions() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const accountFilter = searchParams.get('account') || 'all';

  // Sample transaction data grouped by date
  const allTransactionsByDate = [
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
        },
        {
          id: "t7",
          title: "Аптека 36.6",
          amount: 890,
          currency: "₽",
          date: new Date(2025, 3, 12),
          category: "Здоровье",
          type: "expense" as const,
          account: "Сбербанк •3151"
        },
        {
          id: "t8",
          title: "Яндекс Такси",
          amount: 450,
          currency: "₽",
          date: new Date(2025, 3, 12),
          category: "Транспорт",
          type: "expense" as const,
          account: "Т-Банк •1234"
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
        },
        {
          id: "t9",
          title: "Ozon",
          amount: 3200,
          currency: "₽",
          date: new Date(2025, 3, 11),
          category: "Покупки",
          type: "expense" as const,
          account: "Сбербанк •3151"
        },
        {
          id: "t10",
          title: "Магазин Пятёрочка",
          amount: 780,
          currency: "₽",
          date: new Date(2025, 3, 11),
          category: "Продукты",
          type: "expense" as const,
          account: "Альфа-Банк •4567"
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
          account: "Сбербанк •3151"
        },
        {
          id: "t6",
          title: "Перевод на накопительный счет",
          amount: 15000,
          currency: "₽",
          date: new Date(2025, 3, 10),
          category: "Переводы",
          type: "transfer" as const,
          account: "Сбербанк •3151"
        },
        {
          id: "t11",
          title: "ВкусВилл",
          amount: 1450,
          currency: "₽",
          date: new Date(2025, 3, 10),
          category: "Продукты",
          type: "expense" as const,
          account: "Альфа-Банк •4567"
        }
      ]
    },
    {
      date: "9 апреля 2025",
      transactions: [
        {
          id: "t12",
          title: "Кинотеатр Синема Парк",
          amount: 1200,
          currency: "₽",
          date: new Date(2025, 3, 9),
          category: "Развлечения",
          type: "expense" as const,
          account: "Т-Банк •1234"
        },
        {
          id: "t13",
          title: "Макдоналдс",
          amount: 650,
          currency: "₽",
          date: new Date(2025, 3, 9),
          category: "Рестораны",
          type: "expense" as const,
          account: "Альфа-Банк •4567"
        },
        {
          id: "t14",
          title: "Wildberries",
          amount: 2890,
          currency: "₽",
          date: new Date(2025, 3, 9),
          category: "Покупки",
          type: "expense" as const,
          account: "Сбербанк •3151"
        }
      ]
    },
    {
      date: "8 апреля 2025",
      transactions: [
        {
          id: "t15",
          title: "Spotify Premium",
          amount: 269,
          currency: "₽",
          date: new Date(2025, 3, 8),
          category: "Подписки",
          type: "expense" as const,
          account: "Т-Банк •1234"
        },
        {
          id: "t16",
          title: "Лента",
          amount: 3240,
          currency: "₽",
          date: new Date(2025, 3, 8),
          category: "Продукты",
          type: "expense" as const,
          account: "Альфа-Банк •4567"
        },
        {
          id: "t17",
          title: "Перевод от друга",
          amount: 5000,
          currency: "₽",
          date: new Date(2025, 3, 8),
          category: "Переводы",
          type: "income" as const,
          account: "Сбербанк •3151"
        }
      ]
    }
  ];

  // Фильтрация транзакций по выбранному счёту
  const transactionsByDate = useMemo(() => {
    if (accountFilter === 'all') {
      return allTransactionsByDate;
    }

    return allTransactionsByDate.map(group => ({
      ...group,
      transactions: group.transactions.filter(t => t.account === accountFilter)
    })).filter(group => group.transactions.length > 0);
  }, [accountFilter]);
  
  return (
    <div className="pb-20">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm px-4 pt-2 pb-3 flex items-center justify-between relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-gradient-to-r after:from-finance-blue/20 after:via-finance-purple/40 after:to-finance-blue/20">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => navigate('/')}
          >
            <ChevronLeft size={18} />
          </Button>
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-finance-blue to-finance-purple bg-clip-text text-transparent drop-shadow-sm">История операций</h1>
            {accountFilter !== 'all' && (
              <p className="text-xs text-muted-foreground">{accountFilter}</p>
            )}
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
        >
          <Calendar size={18} />
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
            <Select
              value={accountFilter}
              onValueChange={(value) => {
                if (value === 'all') {
                  setSearchParams({});
                } else {
                  setSearchParams({ account: value });
                }
              }}
            >
              <SelectTrigger className="neumorph">
                <SelectValue placeholder="Выберите счет" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все счета</SelectItem>
                <SelectItem value="Альфа-Банк •4567">Альфа-Банк •4567</SelectItem>
                <SelectItem value="Сбербанк •3151">Сбербанк •3151</SelectItem>
                <SelectItem value="Т-Банк •1234">Т-Банк •1234</SelectItem>
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
