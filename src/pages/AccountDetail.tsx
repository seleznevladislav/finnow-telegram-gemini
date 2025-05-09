
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, Plus, ArrowUpRight, History, Info, CreditCard, Share2, FileText, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

// Define the account type
interface Account {
  id: string;
  name: string;
  bankName: string;
  balance: number;
  currency: string;
  lastDigits?: string;
  cardType?: string;
}

export default function AccountDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [account, setAccount] = useState<Account | null>(null);
  
  useEffect(() => {
    // In a real app, this would be an API call
    // For now, we'll simulate fetching account data from localStorage
    const fetchAccount = () => {
      // These are the same accounts used in Dashboard.tsx
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
        }
      ];
      
      const foundAccount = accounts.find(acc => acc.id === id);
      
      if (foundAccount) {
        setAccount(foundAccount);
      } else {
        // Redirect to accounts page if account not found
        navigate('/accounts');
      }
    };
    
    fetchAccount();
  }, [id, navigate]);
  
  // Show loading state while fetching account
  if (!account) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span>Загрузка...</span>
      </div>
    );
  }
  
  const cardNumber = account.lastDigits || "0000";
  const accountNumber = account.id.padStart(4, '0');
  
  return (
    <div className="pb-20 bg-background min-h-screen">
      {/* Header */}
      <div className="p-4">
        <Button 
          variant="ghost" 
          size="icon"
          className="mb-8"
          onClick={() => navigate('/accounts')}
        >
          <ChevronLeft size={24} />
        </Button>
        
        {/* Account Info */}
        <h1 className="text-xl font-medium">{account.name}</h1>
        <div className="mt-4 mb-2">
          <p className="text-4xl font-semibold">{account.balance.toLocaleString().replace(',', ' ')} {account.currency}</p>
        </div>
        {account.lastDigits && (
          <p className="text-muted-foreground">К счёту привязана карта</p>
        )}
      </div>
      
      {/* Card Visual */}
      <div className="absolute top-20 right-3">
        <div className="bg-red-600 rounded-lg w-24 h-32 flex flex-col justify-between p-3">
          <div className="text-2xl font-bold text-center text-black">A</div>
          <div className="text-sm text-center text-black">{cardNumber}</div>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="px-4 mt-8 grid grid-cols-2 gap-3">
        <Button 
          className="bg-primary/90 text-primary-foreground hover:bg-primary/80 py-6 rounded-xl font-medium" 
          size="lg"
        >
          <Plus size={20} className="mr-2" /> Пополнить
        </Button>
        <Button 
          className="bg-primary/90 text-primary-foreground hover:bg-primary/80 py-6 rounded-xl font-medium" 
          size="lg"
        >
          <ArrowUpRight size={20} className="mr-2" /> Оплатить
        </Button>
      </div>
      
      {/* Account Actions */}
      <div className="bg-background/95 mt-6 rounded-t-3xl p-4 border-t border-muted">
        <div className="space-y-2">
          <button className="account-action-btn">
            <History className="text-muted-foreground" size={20} /> 
            <span className="ml-4">История операций</span>
          </button>
          
          <button className="account-action-btn">
            <Info className="text-muted-foreground" size={20} /> 
            <span className="ml-4">О текущем счёте</span>
          </button>
          
          <button className="account-action-btn">
            <CreditCard className="text-muted-foreground" size={20} /> 
            <span className="ml-4">Добавить карту к счёту</span>
          </button>
          
          <button className="account-action-btn">
            <Share2 className="text-muted-foreground" size={20} /> 
            <span className="ml-4">Поделиться счётом</span>
          </button>
          
          <div className="account-action-btn">
            <FileText className="text-muted-foreground" size={20} /> 
            <div className="ml-4">
              <div>Открыть реквизиты</div>
              <div className="text-muted-foreground text-sm">Текущий счёт •{accountNumber.substring(accountNumber.length - 4)}</div>
            </div>
          </div>
          
          <button className="account-action-btn">
            <Settings className="text-muted-foreground" size={20} /> 
            <span className="ml-4">Настроить счёт для переводов</span>
          </button>
        </div>
      </div>
    </div>
  );
}
