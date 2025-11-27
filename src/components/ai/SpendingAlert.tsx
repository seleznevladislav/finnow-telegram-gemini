import { AlertTriangle, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import AIInsightCard from "./AIInsightCard";

interface SpendingAlertProps {
  category: string;
  currentAmount: number;
  normalAmount: number;
  percentChange: number;
  trigger?: string;
  potentialSaving: number;
  onShowDetails?: () => void;
}

export default function SpendingAlert({
  category,
  currentAmount,
  normalAmount,
  percentChange,
  trigger,
  potentialSaving,
  onShowDetails,
}: SpendingAlertProps) {
  return (
    <AIInsightCard
      title={`Перерасход: ${category}`}
      icon={<AlertTriangle size={20} className="text-finance-yellow" />}
      variant="warning"
    >
      <div className="space-y-4">
        {/* Сравнение */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {category} в этом месяце
            </span>
            <span className="font-semibold text-lg">
              {currentAmount.toLocaleString()} ₽
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Обычно</span>
            <span className="text-sm">{normalAmount.toLocaleString()} ₽</span>
          </div>

          {/* Прогресс бар */}
          <div className="relative h-2 bg-muted/30 rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-finance-yellow rounded-full transition-all"
              style={{ width: `${Math.min(percentChange, 100)}%` }}
            />
          </div>

          <div className="flex items-center justify-end gap-2">
            <span className="text-sm text-finance-yellow font-semibold">
              +{percentChange}%
            </span>
            <span className="text-xs text-muted-foreground">от обычного</span>
          </div>
        </div>

        {/* Триггер */}
        {trigger && (
          <div className="bg-slate-100 dark:bg-card/50 border border-border p-3 rounded-xl">
            <p className="text-xs text-muted-foreground mb-1">
              Основной триггер
            </p>
            <p className="text-sm font-medium">{trigger}</p>
          </div>
        )}

        {/* Визуализация сравнения */}
        <div className="bg-slate-100 dark:bg-card/50 border border-border p-4 rounded-xl">
          <p className="text-xs text-muted-foreground mb-3">
            Динамика за 3 месяца
          </p>
          <div className="flex items-end justify-between gap-2 h-20">
            <div className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full bg-finance-blue/30 rounded-t-lg transition-all hover:bg-finance-blue/50"
                style={{ height: "40%" }}
              />
              <span className="text-xs text-muted-foreground">Мар</span>
            </div>
            <div className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full bg-finance-blue/30 rounded-t-lg transition-all hover:bg-finance-blue/50"
                style={{ height: "50%" }}
              />
              <span className="text-xs text-muted-foreground">Фев</span>
            </div>
            <div className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full bg-finance-yellow rounded-t-lg transition-all hover:bg-finance-yellow/80"
                style={{ height: "100%" }}
              />
              <span className="text-xs font-medium">Апр</span>
            </div>
          </div>
        </div>

        {/* Потенциальная экономия */}
        <div className="bg-green-50 dark:bg-finance-green/10 p-3 rounded-lg border border-finance-green/30">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              💰 Потенциал экономии
            </span>
            <span className="font-semibold text-finance-green">
              {potentialSaving.toLocaleString()} ₽/мес
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {(potentialSaving * 12).toLocaleString()} ₽/год
          </p>
        </div>

        {/* Действие */}
        <Button
          onClick={onShowDetails}
          variant="outline"
          className="w-full justify-between"
        >
          <span>Посмотреть привычки</span>
          <ChevronRight size={16} />
        </Button>
      </div>
    </AIInsightCard>
  );
}
