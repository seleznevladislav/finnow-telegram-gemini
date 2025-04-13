
import { ShoppingBag, CreditCard, TrendingUp, TrendingDown, Calendar } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";

interface TransactionItemProps {
  id: string;
  title: string;
  amount: number;
  currency: string;
  date: Date;
  category: string;
  merchant?: {
    name: string;
    logo?: string;
  };
  type: "expense" | "income" | "transfer";
  account?: string;
  onClick?: () => void;
}

export default function TransactionItem({
  title,
  amount,
  currency,
  date,
  category,
  merchant,
  type,
  account,
  onClick,
}: TransactionItemProps) {
  const getIcon = () => {
    switch (type) {
      case "income":
        return <TrendingUp size={20} className="text-finance-green" />;
      case "expense":
        return <ShoppingBag size={20} className="text-finance-red" />;
      case "transfer":
        return <CreditCard size={20} className="text-finance-blue" />;
      default:
        return <ShoppingBag size={20} />;
    }
  };

  const getAmountColor = () => {
    switch (type) {
      case "income":
        return "text-finance-green";
      case "expense":
        return "text-finance-red";
      default:
        return "";
    }
  };

  const formattedDate = formatDistanceToNow(date, { 
    addSuffix: true, 
    locale: ru 
  });

  return (
    <div 
      className="p-3 border-b border-border flex items-center justify-between cursor-pointer hover:bg-muted/20 transition-colors"
      onClick={onClick}
    >
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-full neumorph flex items-center justify-center mr-3">
          {getIcon()}
        </div>
        <div>
          <h3 className="font-medium text-sm">{title}</h3>
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            <Calendar size={12} className="mr-1" />
            <span>{formattedDate}</span>
            {account && (
              <>
                <span className="mx-1">•</span>
                <span>{account}</span>
              </>
            )}
          </div>
        </div>
      </div>
      <div className={`text-right ${getAmountColor()}`}>
        <p className="font-semibold">
          {type === "expense" ? "-" : type === "income" ? "+" : ""}
          {amount.toLocaleString()} {currency}
        </p>
        <p className="text-xs text-muted-foreground mt-1">{category}</p>
      </div>
    </div>
  );
}
