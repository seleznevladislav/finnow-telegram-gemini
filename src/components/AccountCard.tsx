
import { CreditCard, ExternalLink } from "lucide-react";

interface AccountCardProps {
  name: string;
  bankName: string;
  balance: number;
  currency: string;
  cardType?: string;
  lastDigits?: string;
  color?: string;
  onClick?: () => void;
  id: string;
}

export default function AccountCard({
  id,
  name,
  bankName,
  balance,
  currency,
  cardType = "Дебетовая",
  lastDigits,
  color = "bg-gradient-to-r from-finance-blue to-finance-purple",
  onClick,
}: AccountCardProps) {
  return (
    <div
      className="financial-card mb-3 w-full overflow-hidden cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-medium mb-1">{name}</h3>
          <p className="text-sm text-muted-foreground">{bankName}</p>
        </div>
        {lastDigits ? (
          <div className="flex items-center">
            <CreditCard size={16} className="mr-1" />
            <span className="text-xs">•••• {lastDigits}</span>
          </div>
        ) : (
          <span className="text-xs px-2 py-1 rounded-full bg-muted">{cardType}</span>
        )}
      </div>
      
      <div className="mt-4 flex items-end justify-between">
        <div>
          <p className="text-2xl font-semibold">
            {balance.toLocaleString()} {currency}
          </p>
        </div>
        <button className="text-primary flex items-center text-sm">
          <span className="mr-1">Детали</span>
          <ExternalLink size={14} />
        </button>
      </div>
    </div>
  );
}
