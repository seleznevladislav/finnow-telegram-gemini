
import { TrendingDown, TrendingUp } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number | string;
  currency?: string;
  change?: number;
  icon?: React.ReactNode;
  onClick?: () => void;
}

export default function StatCard({
  title,
  value,
  currency,
  change,
  icon,
  onClick,
}: StatCardProps) {
  return (
    <div 
      className="financial-card cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-2">
        <p className="text-sm text-muted-foreground">{title}</p>
        {icon}
      </div>
      <p className="text-xl font-semibold">
        {typeof value === "number" 
          ? value.toLocaleString()
          : value
        }
        {currency && ` ${currency}`}
      </p>
      
      {change !== undefined && (
        <div className="flex items-center mt-2">
          {change >= 0 ? (
            <>
              <TrendingUp size={14} className="mr-1 text-finance-green" />
              <span className="text-xs text-finance-green">+{change}%</span>
            </>
          ) : (
            <>
              <TrendingDown size={14} className="mr-1 text-finance-red" />
              <span className="text-xs text-finance-red">{change}%</span>
            </>
          )}
          <span className="text-xs text-muted-foreground ml-1">с прошлого месяца</span>
        </div>
      )}
    </div>
  );
}
