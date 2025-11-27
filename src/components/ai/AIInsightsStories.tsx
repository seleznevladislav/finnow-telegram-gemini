import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import InvestmentSuggestion from "./InvestmentSuggestion";
import SpendingAlert from "./SpendingAlert";
import SavingOpportunity from "./SavingOpportunity";
import { useSwipeable } from "react-swipeable";
import { useState, useEffect, useRef } from "react";

interface AIInsightsStoriesProps {
  isOpen: boolean;
  onClose: () => void;
  availableAmount?: number;
  totalBalance?: number;
  monthlyExpenses?: number;
}

export default function AIInsightsStories({
  isOpen,
  onClose,
  availableAmount = 101340,
  totalBalance = 209590,
  monthlyExpenses = 43250,
}: AIInsightsStoriesProps) {
  const [currentStory, setCurrentStory] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const storyTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const STORY_DURATION = 6000; // 6 секунд на каждый инсайт
  const PROGRESS_INTERVAL = 50; // Обновление прогресса каждые 50мс

  const totalStories = 3;

  // Расчеты для инвестиций
  const bondPrice = 1050;
  const bondQuantity = Math.floor(availableAmount / bondPrice);
  const investmentAmount = bondQuantity * bondPrice;
  const expectedProfit = Math.floor(investmentAmount * 0.125 * 2.1);

  // Очистка таймеров
  const clearTimers = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    if (storyTimeoutRef.current) {
      clearTimeout(storyTimeoutRef.current);
      storyTimeoutRef.current = null;
    }
  };

  // Переход к следующему инсайту
  const goToNextStory = () => {
    if (currentStory < totalStories - 1) {
      setCurrentStory(currentStory + 1);
      setProgress(0);
    } else {
      // Закрытие после последнего инсайта
      handleClose();
    }
  };

  // Переход к предыдущему инсайту
  const goToPreviousStory = () => {
    if (currentStory > 0) {
      setCurrentStory(currentStory - 1);
      setProgress(0);
    }
  };

  // Закрытие панели
  const handleClose = () => {
    setIsClosing(true);
    clearTimers();
    setTimeout(() => {
      setIsClosing(false);
      setCurrentStory(0);
      setProgress(0);
      onClose();
    }, 300);
  };

  // Обработка свайпов
  const handlers = useSwipeable({
    onSwipedLeft: () => goToNextStory(),
    onSwipedRight: () => goToPreviousStory(),
    onSwipedDown: () => handleClose(),
    preventScrollOnSwipe: false,
    trackMouse: false,
    trackTouch: true,
  });

  // Обработка кликов по зонам (левая/правая часть экрана)
  const handleScreenClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;

    // Игнорируем клики по кнопкам и интерактивным элементам
    if (
      target.closest('button') ||
      target.closest('a') ||
      target.closest('[role="button"]')
    ) {
      return;
    }

    const screenWidth = window.innerWidth;
    const clickX = e.clientX;

    // Левая треть экрана - предыдущий
    if (clickX < screenWidth / 3) {
      goToPreviousStory();
    }
    // Правая треть экрана - следующий
    else if (clickX > (screenWidth * 2) / 3) {
      goToNextStory();
    }
  };

  // Автоматическое переключение и прогресс
  useEffect(() => {
    if (!isOpen || isPaused || isClosing) {
      clearTimers();
      return;
    }

    // Обновление прогресса
    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        const increment = (PROGRESS_INTERVAL / STORY_DURATION) * 100;
        const newProgress = prev + increment;

        if (newProgress >= 100) {
          return 100;
        }
        return newProgress;
      });
    }, PROGRESS_INTERVAL);

    // Переключение на следующий инсайт
    storyTimeoutRef.current = setTimeout(() => {
      goToNextStory();
    }, STORY_DURATION);

    return () => {
      clearTimers();
    };
  }, [currentStory, isOpen, isPaused, isClosing]);

  // Сброс состояния при открытии
  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
      setCurrentStory(0);
      setProgress(0);
      setIsPaused(false);
    } else {
      clearTimers();
    }
  }, [isOpen]);

  if (!isOpen && !isClosing) return null;

  const stories = [
    // Story 1: Investment Suggestion
    <div key="investment" className="h-full overflow-y-auto custom-scrollbar p-4 pb-20">
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
    </div>,

    // Story 2: Spending Alert
    <div key="spending" className="h-full overflow-y-auto custom-scrollbar p-4 pb-20">
      <SpendingAlert
        category="Рестораны"
        currentAmount={6200}
        normalAmount={3350}
        percentChange={85}
        trigger="🕘 19:00-22:00 (усталость после работы)"
        potentialSaving={2850}
        onShowDetails={() => console.log("Показать детали привычек")}
      />
    </div>,

    // Story 3: Saving Opportunity
    <div key="saving" className="h-full overflow-y-auto custom-scrollbar p-4 pb-20">
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
    </div>,
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/95 z-50 ${isClosing ? 'animate-fade-out' : 'animate-fade-in'}`}
        onClick={handleClose}
      />

      {/* Stories Container */}
      <div
        {...handlers}
        className={`fixed inset-0 z-50 ${isClosing ? 'animate-fade-out' : 'animate-fade-in'}`}
        onClick={handleScreenClick}
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* Header with Progress Bars */}
        <div className="fixed top-0 left-0 right-0 z-50 pt-20 px-4 pb-2 bg-gradient-to-b from-black/90 via-black/60 to-transparent">
          {/* Progress Indicators */}
          <div className="flex gap-1 mb-4">
            {Array.from({ length: totalStories }).map((_, index) => (
              <div
                key={index}
                className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden"
              >
                <div
                  className="h-full bg-white rounded-full transition-all"
                  style={{
                    width:
                      index < currentStory
                        ? "100%"
                        : index === currentStory
                        ? `${progress}%`
                        : "0%",
                  }}
                />
              </div>
            ))}
          </div>

          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">
                Персональные инсайты
              </h2>
              <p className="text-xs text-white/70">
                {currentStory + 1} из {totalStories}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="rounded-full bg-white/10 hover:bg-white/20 text-white"
            >
              <X size={20} />
            </Button>
          </div>
        </div>

        {/* Story Content */}
        <div className="h-full pt-36">
          {stories[currentStory]}
        </div>

        {/* Navigation Hints (invisible tap zones) */}
        <div className="fixed inset-0 z-40 flex pointer-events-none">
          <div className="w-1/3 h-full" />
          <div className="w-1/3 h-full" />
          <div className="w-1/3 h-full" />
        </div>
      </div>
    </>
  );
}
