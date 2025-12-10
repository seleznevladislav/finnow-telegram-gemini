import { Sparkles, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { logAIInsightShown, logAIInsightClicked } from "@/lib/analytics";

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

  // Логируем показ компонента при монтировании (для AB теста)
  useEffect(() => {
    logAIInsightShown();
  }, []);

  // Обработчик клика с логированием
  const handleClick = () => {
    logAIInsightClicked();
    onClick?.();
  };

  return (
    <div
      className="relative overflow-hidden neumorph rounded-xl cursor-pointer group p-4"
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-finance-blue/10 via-finance-purple/10 to-finance-green/10 opacity-50 group-hover:opacity-70 transition-opacity" />

      {/* Content */}
      <div className="relative z-10 flex items-center gap-3">
        {/* AI Icon */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-finance-blue to-finance-purple flex items-center justify-center shrink-0 animate-pulse">
          <Sparkles size={20} className="text-white" />
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-[11px] font-medium text-primary uppercase tracking-wide">
               AI Инсайт
            </span>
            <span className="text-[11px] px-1.5 py-0.5 bg-finance-green/20 text-finance-green rounded-full font-medium">
              +{savingsAmount.toLocaleString('ru-RU')}₽
            </span>
          </div>
          <p className="text-xs font-medium leading-snug line-clamp-2">
            Доступно для инвестиций после всех платежей
          </p>
        </div>

        {/* Arrow */}
        <ChevronRight
          size={18}
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
