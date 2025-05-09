
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
  type?: 'card' | 'account';
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
		  type: 'card',
        },
        {
          id: "2",
          name: "Накопительный счет",
          bankName: "Сбербанк",
          balance: 125000,
          currency: "₽",
          color: "bg-gradient-to-r from-finance-green to-finance-blue",
		  type: 'account'
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
      <div className="p-4 h-[220px]">
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
		{account.type == 'account' && (
			<>
			  <p className="text-muted-foreground text-xs">на минимальный остаток</p>
			</>
        )}
        <div className="mt-4 mb-2">
          <p className="text-4xl font-semibold">{account.balance.toLocaleString().replace(',', ' ')} {account.currency}</p>
        </div>
        {account.lastDigits && (
			<>
			  <p className="text-muted-foreground">К счёту привязана карта</p>
			</>
        )}
		 
      </div>
      
      {/* Card Visual - with animation and dark theme */}
      <div className="absolute top-20 right-[-30px] animate-slide-in-right">
        <div className="bg-gradient-to-br from-[#1A1F2C] to-[#2A2F3C] rounded-lg w-32 h-40 flex flex-col justify-between p-3 shadow-lg overflow-hidden relative">
          {/* Card Logo */}
          <div className="h-12 flex items-center">
            <img 
              src="/lovable-uploads/db341864-dca3-4169-8d9d-9a47f75d9e8d.png" 
              alt="Card Logo" 
              className="w-16 h-auto object-contain"
            />
          </div>
          
          {/* Card Number */}
          <div className="text-sm pl-3 text-white/80 font-mono mt-auto">
            {cardNumber}
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-red-500/20 blur-xl"></div>
          <div className="absolute -top-10 -right-10 w-28 h-28 rounded-full bg-red-600/10 blur-xl"></div>
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
