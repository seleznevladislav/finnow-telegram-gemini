import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, TrendingUp, Sparkles, ChevronLeft, Info, Shield, Zap, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useInvestment } from "@/contexts/InvestmentContext";
import { RiskLevel } from "@/contexts/InvestmentContext";
import AddFundsDialog from "@/components/investments/AddFundsDialog";
import { generateInvestmentPlan } from "@/services/ai";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function Investments() {
  const navigate = useNavigate();
  const {
    totalAvailable,
    accounts,
    riskLevel,
    investmentPlan,
    setRiskLevel,
    setInvestmentPlan
  } = useInvestment();

  const [isAddFundsOpen, setIsAddFundsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedRisk, setSelectedRisk] = useState<RiskLevel | null>(riskLevel);
  const [chartPeriod, setChartPeriod] = useState<'month' | 'year' | 'all'>('month');

  // Автоматическая генерация плана при выборе риска
  useEffect(() => {
    if (totalAvailable > 0 && riskLevel && !investmentPlan && !isGenerating) {
      handleGeneratePlan();
    }
  }, [riskLevel, totalAvailable]);

  const handleGeneratePlan = async () => {
    if (!riskLevel || totalAvailable === 0) return;

    setIsGenerating(true);
    try {
      const plan = await generateInvestmentPlan(totalAvailable, riskLevel);
      setInvestmentPlan({
        ...plan,
        riskLevel,
        totalAmount: totalAvailable,
        generatedAt: new Date(),
      });
    } catch (error) {
      console.error("Ошибка генерации плана:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRiskSelect = () => {
    if (!selectedRisk) return;
    setRiskLevel(selectedRisk);
  };

  // Данные для графика прогноза
  const profitData = investmentPlan ? (() => {
    const periods = chartPeriod === 'month' ? 12 : chartPeriod === 'year' ? 5 : 25;
    const isMonthly = chartPeriod === 'month';
    const isYearly = chartPeriod === 'year';

    return Array.from({ length: periods + 1 }, (_, i) => {
      const timeValue = isMonthly ? i : isYearly ? i : i;
      const profitMultiplier = isMonthly ? i / 12 : isYearly ? i : i / 12;
      const profit = investmentPlan.totalAmount * (investmentPlan.expectedYield / 100) * profitMultiplier;

      return {
        month: isMonthly ? `${i}м` : isYearly ? `${i}г` : `${i}м`,
        value: Math.floor(investmentPlan.totalAmount + profit),
      };
    });
  })() : [];

  // Данные для pie chart (распределение)
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
  const pieData = investmentPlan?.instruments.map((inst, idx) => ({
    name: inst.name,
    value: inst.allocation,
    color: COLORS[idx % COLORS.length],
  })) || [];

  const riskOptions = [
    {
      value: 'low' as RiskLevel,
      label: 'Низкий риск',
      icon: Shield,
      color: 'text-finance-green',
      bgColor: 'bg-finance-green/10',
      description: 'Консервативный портфель. Основа - облигации (70-80%), минимальная волатильность.',
      expectedYield: '10-13%',
    },
    {
      value: 'medium' as RiskLevel,
      label: 'Средний риск',
      icon: Target,
      color: 'text-finance-blue',
      bgColor: 'bg-finance-blue/10',
      description: 'Сбалансированный портфель. Облигации + акции (50/50), умеренный рост.',
      expectedYield: '14-18%',
    },
    {
      value: 'high' as RiskLevel,
      label: 'Высокий риск',
      icon: Zap,
      color: 'text-finance-red',
      bgColor: 'bg-finance-red/10',
      description: 'Агрессивный портфель. Акции + крипто (80%), высокая волатильность.',
      expectedYield: '20-40%',
    },
  ];

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm px-4 pt-2 pb-3 flex items-center justify-between relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-gradient-to-r after:from-finance-green/20 after:via-finance-blue/40 after:to-finance-green/20">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => navigate("/")}
          >
            <ChevronLeft size={18} />
          </Button>
          <h1 className="text-lg font-bold bg-gradient-to-r from-finance-green to-finance-blue bg-clip-text text-transparent drop-shadow-sm">Инвестиции</h1>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsAddFundsOpen(true)}
          className="flex items-center gap-1 text-xs h-8"
        >
          <Plus size={14} />
          Добавить
        </Button>
      </div>

      <div className="p-4 animate-fade-in space-y-6">
        {/* Доступные средства */}
        <div className="neumorph p-5 rounded-xl">
          <p className="text-sm text-muted-foreground mb-1">
            Доступно для инвестирования
          </p>
          <p className="text-3xl font-bold mb-3">
            {totalAvailable.toLocaleString()} ₽
          </p>
          {accounts.length > 0 ? (
            <div className="text-xs text-muted-foreground space-y-1">
              {accounts.map(acc => (
                <div key={acc.accountId} className="flex justify-between">
                  <span>{acc.accountName}</span>
                  <span className="font-medium">{acc.amount.toLocaleString()} ₽</span>
                </div>
              ))}
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAddFundsOpen(true)}
              className="w-full"
            >
              <Plus size={14} className="mr-1" />
              Добавить средства
            </Button>
          )}
        </div>

        {/* Если нет средств - призыв к действию */}
        {totalAvailable === 0 && (
          <div className="text-center py-12">
            <TrendingUp size={48} className="text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Начните инвестировать</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Добавьте средства, чтобы AI составил персональный план инвестиций
            </p>
            <Button onClick={() => setIsAddFundsOpen(true)}>
              <Plus size={16} className="mr-1" />
              Добавить средства
            </Button>
          </div>
        )}

        {/* Выбор уровня риска */}
        {totalAvailable > 0 && !riskLevel && !isGenerating && (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-1">Выберите уровень риска</h3>
              <p className="text-sm text-muted-foreground">
                AI составит персональный портфель с учетом ваших предпочтений
              </p>
            </div>

            <RadioGroup value={selectedRisk || ""} onValueChange={(val) => setSelectedRisk(val as RiskLevel)}>
              <div className="space-y-3">
                {riskOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <div key={option.value} className="relative">
                      <RadioGroupItem
                        value={option.value}
                        id={option.value}
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor={option.value}
                        className={`neumorph p-4 rounded-xl cursor-pointer block transition-all ${
                          selectedRisk === option.value
                            ? 'ring-2 ring-primary'
                            : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`${option.bgColor} p-2 rounded-lg`}>
                            <Icon size={20} className={option.color} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <p className="font-semibold">{option.label}</p>
                              <span className={`text-sm font-medium ${option.color}`}>
                                {option.expectedYield}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {option.description}
                            </p>
                          </div>
                        </div>
                      </Label>
                    </div>
                  );
                })}
              </div>
            </RadioGroup>

            <Button
              onClick={handleRiskSelect}
              disabled={!selectedRisk}
              className="w-full"
            >
              <Sparkles size={16} className="mr-2" />
              Сгенерировать план инвестиций
            </Button>
          </div>
        )}

        {/* Загрузка плана */}
        {isGenerating && (
          <div className="neumorph p-8 rounded-xl text-center">
            <div className="animate-pulse mb-4">
              <Sparkles size={48} className="text-finance-purple mx-auto mb-2" />
            </div>
            <h3 className="font-semibold mb-2">AI генерирует план...</h3>
            <p className="text-sm text-muted-foreground">
              Анализируем рынок и подбираем оптимальные инструменты для вас
            </p>
          </div>
        )}

        {/* Готовый план инвестиций */}
        {investmentPlan && !isGenerating && (
          <>
            {/* Аргументация от AI */}
            <div className="neumorph p-5 rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={18} className="text-finance-purple" />
                <h3 className="font-semibold">Рекомендация от AI</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {investmentPlan.aiReasoning}
              </p>
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  Ожидаемая доходность портфеля
                </span>
                <span className="font-semibold text-finance-green">
                  {investmentPlan.expectedYield}% годовых
                </span>
              </div>
            </div>

            {/* Распределение портфеля (Pie Chart) */}
            <div className="neumorph p-5 rounded-xl">
              <h3 className="font-semibold mb-4">Распределение портфеля</h3>
              <div className="h-48 mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Легенда */}
              <div className="space-y-2">
                {investmentPlan.instruments.map((inst, idx) => (
                  <div key={inst.id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                      />
                      <span>{inst.name}</span>
                    </div>
                    <span className="font-medium">{inst.allocation}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Детали инструментов */}
            <div className="space-y-3">
              <h3 className="font-semibold">Инструменты портфеля</h3>
              {investmentPlan.instruments.map((inst, idx) => (
                <div key={inst.id} className="neumorph p-4 rounded-xl">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold">{inst.name}</h4>
                      <p className="text-xs text-muted-foreground">{inst.type}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-finance-blue">
                        {inst.amount.toLocaleString()} ₽
                      </p>
                      <p className="text-xs text-muted-foreground">{inst.allocation}%</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{inst.description}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Доходность</span>
                    <span className="font-medium text-finance-green">
                      {inst.expectedYield}% годовых
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* График прогноза доходности */}
            <div className="neumorph p-5 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Прогноз доходности</h3>
                <div className="flex gap-1">
                  <button
                    onClick={() => setChartPeriod('month')}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                      chartPeriod === 'month'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    Месяц
                  </button>
                  <button
                    onClick={() => setChartPeriod('year')}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                      chartPeriod === 'year'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    Год
                  </button>
                  <button
                    onClick={() => setChartPeriod('all')}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                      chartPeriod === 'all'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    Все
                  </button>
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={profitData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 10 }}
                      interval={chartPeriod === 'month' ? 1 : chartPeriod === 'year' ? 0 : 3}
                    />
                    <YAxis
                      tick={{ fontSize: 10 }}
                      tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                    />
                    <Tooltip
                      formatter={(value) => `${value.toLocaleString()} ₽`}
                      contentStyle={{
                        backgroundColor: "#FFFFFF",
                        borderRadius: "8px",
                        border: "none",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#10B981"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 space-y-1">
                <p className="text-xs text-muted-foreground text-center">
                  * Прогноз на {chartPeriod === 'month' ? '12 месяцев' : chartPeriod === 'year' ? '5 лет' : '25 месяцев'}
                </p>
                <p className="text-xs text-muted-foreground text-center">
                  Прогноз не является гарантией доходности
                </p>
              </div>
            </div>

            {/* Действия */}
            <div className="space-y-2">
              <Button
                className="w-full"
                onClick={() => window.open("https://www.tbank.ru/invest/", "_blank")}
              >
                <TrendingUp size={18} className="mr-2" />
                Открыть в Т-Инвестициях
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setRiskLevel(null);
                  setInvestmentPlan(null);
                }}
              >
                Создать новый план
              </Button>
            </div>

            {/* Информация */}
            <div className="neumorph-inset p-4 rounded-lg">
              <div className="flex gap-2">
                <Info size={16} className="text-muted-foreground shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Инвестиции сопряжены с рисками. Доходность в прошлом не гарантирует
                  доходность в будущем. Перед принятием решения проконсультируйтесь
                  со специалистом.
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      <AddFundsDialog
        isOpen={isAddFundsOpen}
        onClose={() => setIsAddFundsOpen(false)}
      />
    </div>
  );
}
