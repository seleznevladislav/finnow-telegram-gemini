import { Sparkles, ChevronRight } from "lucide-react";
import { useState } from "react";

interface AIInsightTriggerProps {
  savingsAmount: number;
  insightText: string;
  onClick?: () => void;
}

export default function AIInsightTrigger({
  savingsAmount,
  insightText,
  onClick,
}: AIInsightTriggerProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative overflow-hidden financial-card cursor-pointer group"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-finance-blue/10 via-finance-purple/10 to-finance-green/10 opacity-50 group-hover:opacity-70 transition-opacity" />

      {/* Content */}
      <div className="relative z-10 flex items-center gap-3">
        {/* AI Icon */}
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-finance-blue to-finance-purple flex items-center justify-center shrink-0 animate-pulse">
          <Sparkles size={24} className="text-white" />
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-1">
            <span className="text-xs font-medium text-primary uppercase tracking-wide">
               Рекоммендация
            </span>
            <span className="text-xs px-1.5 py-0.5 bg-finance-green/20 text-finance-green rounded-full font-medium whitespace-nowrap">
              +{savingsAmount.toLocaleString('ru-RU')} ₽
            </span>
          </div>
          <p className="text-sm font-medium leading-snug">
            {insightText}
          </p>
        </div>

        {/* Arrow */}
        <ChevronRight
          size={20}
          className={`shrink-0 text-muted-foreground transition-transform ${
            isHovered ? "translate-x-1" : ""
          }`}
        />
      </div>

      {/* Shine effect on hover */}
      <div
        className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full transition-transform duration-700 ${
          isHovered ? "translate-x-full" : ""
        }`}
      />
    </div>
  );
}
