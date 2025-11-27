import { Gift, Clock, ChevronRight, CreditCard, FileText, Tv, Smartphone, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import AIInsightCard from "./AIInsightCard";

interface Opportunity {
  id: string;
  title: string;
  amount: number;
  type: "cashback" | "tax_deduction" | "subscription" | "tariff";
  description: string;
  urgency?: {
    daysLeft: number;
    message: string;
  };
  action: {
    label: string;
    handler?: () => void;
  };
}

interface SavingOpportunityProps {
  opportunities: Opportunity[];
}

export default function SavingOpportunity({
  opportunities,
}: SavingOpportunityProps) {
  const totalSaving = opportunities.reduce((sum, opp) => sum + opp.amount, 0);

  const getOpportunityIcon = (type: Opportunity["type"]) => {
    const iconClass = "text-primary";
    switch (type) {
      case "cashback":
        return <CreditCard size={24} className={iconClass} />;
      case "tax_deduction":
        return <FileText size={24} className={iconClass} />;
      case "subscription":
        return <Tv size={24} className={iconClass} />;
      case "tariff":
        return <Smartphone size={24} className={iconClass} />;
      default:
        return <DollarSign size={24} className={iconClass} />;
    }
  };

  const getTypeLabel = (type: Opportunity["type"]) => {
    switch (type) {
      case "cashback":
        return "Кэшбэк";
      case "tax_deduction":
        return "Налоговый вычет";
      case "subscription":
        return "Подписка";
      case "tariff":
        return "Тариф";
      default:
        return "Экономия";
    }
  };

  return (
    <AIInsightCard
      title="Забытые деньги"
      icon={<Gift size={20} className="text-finance-green" />}
      variant="success"
    >
      <div className="space-y-4">
        {/* Общая сумма */}
        <div className="bg-slate-100 dark:bg-card/50 border border-border p-4 rounded-xl text-center">
          <p className="text-sm text-muted-foreground mb-1">
            Можно получить/сэкономить
          </p>
          <p className="text-3xl font-bold text-finance-green">
            {totalSaving.toLocaleString()} ₽
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Найдено возможностей: {opportunities.length}
          </p>
        </div>

        {/* Список возможностей */}
        <div className="space-y-3">
          {opportunities.map((opportunity) => (
            <div
              key={opportunity.id}
              className="bg-slate-100 dark:bg-card/50 border border-border p-4 rounded-xl space-y-3"
            >
              <div className="flex items-start gap-3">
                <div className="shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  {getOpportunityIcon(opportunity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="font-semibold text-sm">{opportunity.title}</h4>
                    <span className="text-base font-bold text-finance-green shrink-0">
                      {opportunity.amount.toLocaleString()} ₽
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground px-2 py-0.5 bg-muted/30 rounded-full">
                    {getTypeLabel(opportunity.type)}
                  </span>
                </div>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed">
                {opportunity.description}
              </p>

              {/* Срочность */}
              {opportunity.urgency && (
                <div className="flex items-center gap-2 p-2 bg-yellow-50 dark:bg-finance-yellow/10 border border-finance-yellow/30 rounded-lg">
                  <Clock size={14} className="text-finance-yellow shrink-0" />
                  <p className="text-xs text-finance-yellow font-medium">
                    {opportunity.urgency.message}
                  </p>
                </div>
              )}

              {/* Действие */}
              <Button
                onClick={opportunity.action.handler}
                variant="outline"
                size="sm"
                className="w-full justify-between"
              >
                <span>{opportunity.action.label}</span>
                <ChevronRight size={14} />
              </Button>
            </div>
          ))}
        </div>

        {/* Итоговое действие */}
        <div className="bg-gradient-to-r from-green-100 to-blue-100 dark:from-finance-green/10 dark:to-finance-blue/10 p-4 rounded-xl border border-finance-green/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Действуй сейчас</span>
            <span className="text-xs text-muted-foreground">
              Экономия за год
            </span>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              Не упускай эти возможности
            </p>
            <p className="text-lg font-bold text-finance-green">
              {(totalSaving * 12).toLocaleString()} ₽
            </p>
          </div>
        </div>
      </div>
    </AIInsightCard>
  );
}
