import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import InvestmentSuggestion from "./InvestmentSuggestion";
import SpendingAlert from "./SpendingAlert";
import SavingOpportunity from "./SavingOpportunity";
import { useSwipeable } from "react-swipeable";
import { useState, useEffect } from "react";

interface AIInsightsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  availableAmount?: number;
  totalBalance?: number;
  monthlyExpenses?: number;
}

export default function AIInsightsSheet({
  isOpen,
  onClose,
  availableAmount = 101340,
  totalBalance = 209590,
  monthlyExpenses = 43250,
}: AIInsightsSheetProps) {
  const [isClosing, setIsClosing] = useState(false);

  // Обработка свайпа вниз для закрытия
  const handlers = useSwipeable({
    onSwipedDown: () => {
      handleClose();
    },
    preventScrollOnSwipe: false,
    trackMouse: false,
  });

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  };

  // Сброс состояния при открытии
  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
    }
  }, [isOpen]);

  if (!isOpen && !isClosing) return null;

  // Расчеты для инвестиций
  const bondPrice = 1050;
  const bondQuantity = Math.floor(availableAmount / bondPrice);
  const investmentAmount = bondQuantity * bondPrice;
  const expectedProfit = Math.floor(investmentAmount * 0.125 * 2.1); // 12.5% за 2.1 года

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 ${isClosing ? 'animate-fade-out' : 'animate-fade-in'}`}
        onClick={handleClose}
      />

      {/* Bottom Sheet */}
      <div
        {...handlers}
        className={`fixed inset-x-0 bottom-0 z-50 bg-background rounded-t-3xl shadow-2xl max-h-[85vh] overflow-hidden ${isClosing ? 'animate-slide-down' : 'animate-slide-up'}`}
      >
        {/* Handle - можно свайпать вниз */}
        <div className="sticky top-0 z-10 bg-background pt-6 pb-2 px-4 border-b border-border">
          <div className="w-12 h-1.5 bg-muted rounded-full mx-auto mb-3" />
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Персональные инсайты</h2>
              <p className="text-sm text-muted-foreground">
                На основе анализа ваших финансов
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="rounded-full"
            >
              <X size={20} />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(85vh-96px)] custom-scrollbar">
          <div className="p-4 space-y-4 pb-8">
            {/* Investment Suggestion */}
            <InvestmentSuggestion
              availableAmount={availableAmount}
              suggestion={{
                name: "ОФЗ 26238",
                type: "Облигация государства РФ",
                price: bondPrice,
                quantity: bondQuantity,
                totalCost: investmentAmount,
                yield: 12.5,
                timeframe: "2.1 года",
                profit: expectedProfit,
                riskLevel: "low",
              }}
              partnerAppUrl="https://www.tbank.ru/invest/"
              onLearnMore={() => console.log("Подробнее об облигации")}
            />

            {/* Spending Alert */}
            <SpendingAlert
              category="Рестораны"
              currentAmount={6200}
              normalAmount={3350}
              percentChange={85}
              trigger="🕘 19:00-22:00 (усталость после работы)"
              potentialSaving={2850}
              onShowDetails={() => console.log("Показать детали привычек")}
            />

            {/* Saving Opportunities */}
            <SavingOpportunity
              opportunities={[
                {
                  id: "1",
                  title: "Кэшбэк Альфа-Банк",
                  amount: 2400,
                  type: "cashback",
                  description:
                    "Накопленный кэшбэк на карте Альфа-Банк готов к выводу",
                  urgency: {
                    daysLeft: 12,
                    message: "Сгорит через 12 дней",
                  },
                  action: {
                    label: "Вывести кэшбэк",
                    handler: () => console.log("Вывести кэшбэк"),
                  },
                },
                {
                  id: "2",
                  title: "Налоговый вычет за медицину",
                  amount: 7800,
                  type: "tax_deduction",
                  description:
                    "Вы имеете право на налоговый вычет за медицинские услуги. Нужна справка из клиники.",
                  action: {
                    label: "Инструкция по получению",
                    handler: () => console.log("Показать инструкцию"),
                  },
                },
              ]}
            />
          </div>
        </div>
      </div>
    </>
  );
}
