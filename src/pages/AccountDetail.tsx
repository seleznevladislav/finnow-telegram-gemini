
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, Plus, ArrowUpRight, History, Info, CreditCard, Share2, FileText, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AccountDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  // Mock data for the current account
  const account = {
    id: id || "1",
    name: "Текущий счёт",
    balance: 41710.36,
    cardAttached: true,
    cardNumber: "3151",
    accountNumber: "0535",
  };
  
  return (
    <div className="pb-20 bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="p-4">
        <Button 
          variant="ghost" 
          size="icon"
          className="mb-8 text-white"
          onClick={() => navigate('/accounts')}
        >
          <ChevronLeft size={24} />
        </Button>
        
        {/* Account Info */}
        <h1 className="text-xl font-medium text-white">{account.name}</h1>
        <div className="mt-4 mb-2">
          <p className="text-4xl font-semibold text-white">{account.balance.toLocaleString().replace(',', ' ')} ₽</p>
        </div>
        {account.cardAttached && (
          <p className="text-gray-400">К счёту привязана карта</p>
        )}
      </div>
      
      {/* Card Visual */}
      <div className="absolute top-20 right-3">
        <div className="bg-red-600 rounded-lg w-24 h-32 flex flex-col justify-between p-3">
          <div className="text-2xl font-bold text-center text-black">A</div>
          <div className="text-sm text-center text-black">{account.cardNumber}</div>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="px-4 mt-8 grid grid-cols-2 gap-3">
        <Button 
          className="bg-white text-black hover:bg-gray-200 py-6 rounded-xl font-medium" 
          size="lg"
        >
          <Plus size={20} className="mr-2" /> Пополнить
        </Button>
        <Button 
          className="bg-white text-black hover:bg-gray-200 py-6 rounded-xl font-medium" 
          size="lg"
        >
          <ArrowUpRight size={20} className="mr-2" /> Оплатить
        </Button>
      </div>
      
      {/* Account Actions */}
      <div className="bg-black mt-6 rounded-t-3xl p-4">
        <div className="space-y-2">
          <button className="account-action-btn">
            <History className="text-gray-400" size={20} /> 
            <span className="ml-4">История операций</span>
          </button>
          
          <button className="account-action-btn">
            <Info className="text-gray-400" size={20} /> 
            <span className="ml-4">О текущем счёте</span>
          </button>
          
          <button className="account-action-btn">
            <CreditCard className="text-gray-400" size={20} /> 
            <span className="ml-4">Добавить карту к счёту</span>
          </button>
          
          <button className="account-action-btn">
            <Share2 className="text-gray-400" size={20} /> 
            <span className="ml-4">Поделиться счётом</span>
          </button>
          
          <div className="account-action-btn">
            <FileText className="text-gray-400" size={20} /> 
            <div className="ml-4">
              <div>Открыть реквизиты</div>
              <div className="text-gray-500 text-sm">Текущий счёт ••0535</div>
            </div>
          </div>
          
          <button className="account-action-btn">
            <Settings className="text-gray-400" size={20} /> 
            <span className="ml-4">Настроить счёт для переводов</span>
          </button>
        </div>
      </div>
    </div>
  );
}
