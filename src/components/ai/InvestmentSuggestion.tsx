import { TrendingUp, Info, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import AIInsightCard from "./AIInsightCard";

interface InvestmentSuggestionProps {
  availableAmount: number;
  suggestion: {
    name: string;
    type: string;
    price: number;
    quantity: number;
    totalCost: number;
    yield: number;
    timeframe: string;
    profit: number;
    riskLevel: "low" | "medium" | "high";
  };
  partnerAppUrl?: string;
  onLearnMore?: () => void;
}

export default function InvestmentSuggestion({
  availableAmount,
  suggestion,
  partnerAppUrl = "https://www.tbank.ru/invest/",
  onLearnMore,
}: InvestmentSuggestionProps) {
  const riskColors = {
    low: "text-finance-green",
    medium: "text-finance-yellow",
    high: "text-finance-red",
  };

  const riskLabels = {
    low: "Низкий",
    medium: "Средний",
    high: "Высокий",
  };

  return (
    <AIInsightCard
      title="Можно инвестировать"
      icon={<TrendingUp size={20} className="text-finance-green" />}
      variant="success"
    >
      <div className="space-y-4">
        {/* Доступная сумма */}
        <div className="bg-slate-100 dark:bg-card/50 border border-border p-4 rounded-xl">
          <p className="text-xs text-muted-foreground mb-1">
            Доступно для инвестиций
          </p>
          <p className="text-lg font-semibold mb-2">
            {availableAmount.toLocaleString()} ₽
          </p>
          <div className="text-xs text-muted-foreground space-y-1.5">
            <div className="flex justify-between">
              <span>Всего на счетах:</span>
              <span>209,590₽</span>
            </div>
            <div className="flex justify-between">
              <span>− Обяз. платежи:</span>
              <span>15,000₽</span>
            </div>
            <div className="flex justify-between">
              <span>− Резерв:</span>
              <span>50,000₽</span>
            </div>
            <div className="flex justify-between">
              <span>− Расходы месяца:</span>
              <span>43,250₽</span>
            </div>
          </div>
        </div>

        {/* Рекомендация */}
        <div className="bg-slate-100 dark:bg-card/50 border border-border p-4 rounded-xl space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-semibold text-base mb-1">
                {suggestion.name}
              </h4>
              <p className="text-xs text-muted-foreground">{suggestion.type}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">
                {suggestion.price.toLocaleString()} ₽
              </p>
              <p className="text-xs text-muted-foreground">за 1 шт</p>
            </div>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

          {/* Характеристики */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Доходность</p>
              <p className="text-base font-semibold text-finance-green">
                {suggestion.yield}%
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Срок</p>
              <p className="text-base font-semibold">{suggestion.timeframe}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Риск</p>
              <p
                className={`text-base font-semibold ${
                  riskColors[suggestion.riskLevel]
                }`}
              >
                {riskLabels[suggestion.riskLevel]}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Количество</p>
              <p className="text-base font-semibold">
                {suggestion.quantity} шт
              </p>
            </div>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

          {/* Прогноз */}
          <div className="bg-green-50 dark:bg-finance-green/10 border border-finance-green/30 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">
                Сумма инвестиции
              </span>
              <span className="font-semibold">
                {suggestion.totalCost.toLocaleString()} ₽
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Через {suggestion.timeframe}
              </span>
              <div className="flex items-center gap-1">
                <span className="font-semibold">
                  {(suggestion.totalCost + suggestion.profit).toLocaleString()}{" "}
                  ₽
                </span>
                <span className="text-sm text-finance-green font-medium">
                  +{suggestion.profit.toLocaleString()} ₽
                </span>
              </div>
            </div>
          </div>

          {/* Сравнение */}
          <div className="bg-slate-50 dark:bg-card/30 border border-border p-4 rounded-lg">
            <p className="text-xs text-muted-foreground mb-2">
              Альтернатива:
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm">Оставить на карте</span>
              <span className="text-sm text-finance-red font-medium">
                -11.2% (инфляция)
              </span>
            </div>
          </div>
        </div>

        {/* Действия */}
        <div className="flex gap-2">
          <Button
            onClick={() => window.open(partnerAppUrl, '_blank')}
            className="flex-1 bg-finance-green hover:bg-finance-green/90"
          >
            <ExternalLink size={18} className="mr-2" />
            Открыть в Т-Инвестициях
          </Button>
          <Button
            onClick={onLearnMore}
            variant="outline"
            size="icon"
            className="shrink-0"
          >
            <Info size={18} />
          </Button>
        </div>

        {/* Подсказка */}
        <div className="flex items-start gap-2 text-xs text-muted-foreground">
          <Info size={14} className="shrink-0 mt-0.5" />
          <p>
            Расчет основан на балансе ваших счетов (Альфа-Банк: 84,590₽ + Сбербанк: 125,000₽) минус обязательные расходы и резервный фонд
          </p>
        </div>
      </div>
    </AIInsightCard>
  );
}
