import { useState } from "react";
import {
  Calendar,
  PieChart,
  BarChart2,
  LineChart,
  ChevronDown,
  Download,
  AlertTriangle,
  Lightbulb,
  TrendingDown,
  Receipt,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CSVImportExport from "@/components/CSVImportExport";
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";

export default function Analytics() {
  const [period, setPeriod] = useState("month");

  // Sample expense data by category
  const expensesByCategory = [
	{ name: "Продукты", value: 15800, color: "#7289da" },
	{ name: "Рестораны", value: 8400, color: "#a78bfa" },
	{ name: "Транспорт", value: 6200, color: "#34d399" },
	{ name: "Развлечения", value: 4500, color: "#fbbf24" },
	{ name: "Подписки", value: 2300, color: "#f87171" },
	{ name: "Прочее", value: 6050, color: "#9ca3af" },
  ];

  // Данные за неделю
  const weekData = [
    { day: "Пн", value: 4200 },
    { day: "Вт", value: 3800 },
    { day: "Ср", value: 5100 },
    { day: "Чт", value: 2800 },
    { day: "Пт", value: 7500 },
    { day: "Сб", value: 9600 },
    { day: "Вс", value: 6500 },
  ];

  // Данные за месяц (последние 4 недели)
  const monthData = [
    { name: "Нед 1", расходы: 8200, доходы: 21250 },
    { name: "Нед 2", расходы: 10500, доходы: 21250 },
    { name: "Нед 3", расходы: 12800, доходы: 21250 },
    { name: "Нед 4", расходы: 11750, доходы: 21250 },
  ];

  // Данные за год (12 месяцев)
  const yearData = [
    { name: "Янв", расходы: 32500, доходы: 85000 },
    { name: "Фев", расходы: 35800, доходы: 85000 },
    { name: "Мар", расходы: 38200, доходы: 87500 },
    { name: "Апр", расходы: 43250, доходы: 85000 },
    { name: "Май", расходы: 36900, доходы: 90000 },
    { name: "Июн", расходы: 41200, доходы: 90000 },
    { name: "Июл", расходы: 39800, доходы: 90000 },
    { name: "Авг", расходы: 42100, доходы: 90000 },
    { name: "Сен", расходы: 38900, доходы: 92000 },
    { name: "Окт", расходы: 44200, доходы: 92000 },
    { name: "Ноя", расходы: 40500, доходы: 92000 },
    { name: "Дек", расходы: 43250, доходы: 95000 },
  ];

  // Выбираем данные в зависимости от периода
  const getTrendData = () => {
    if (period === "week") {
      return weekData.map(item => ({ day: item.day, value: item.value }));
    } else if (period === "month") {
      return monthData.map(item => ({ day: item.name, value: item.расходы }));
    } else {
      return yearData.map(item => ({ day: item.name, value: item.расходы }));
    }
  };

  const getMonthlyData = () => {
    if (period === "week") {
      return weekData.map(item => ({ name: item.day, расходы: item.value, доходы: item.value * 2.5 }));
    } else if (period === "month") {
      return monthData;
    } else {
      return yearData;
    }
  };

  const trendData = getTrendData();
  const monthlyData = getMonthlyData();

  const totalExpenses = expensesByCategory.reduce(
    (sum, category) => sum + category.value,
    0
  );

  // Вычисляем суммы доходов и расходов в зависимости от периода
  const getPeriodTotals = () => {
    if (period === "week") {
      const expenses = weekData.reduce((sum, item) => sum + item.value, 0);
      const income = expenses * 2.5; // Примерное соотношение
      return { expenses, income };
    } else if (period === "month") {
      const expenses = monthData.reduce((sum, item) => sum + item.расходы, 0);
      const income = monthData.reduce((sum, item) => sum + item.доходы, 0);
      return { expenses, income };
    } else {
      const expenses = yearData.reduce((sum, item) => sum + item.расходы, 0);
      const income = yearData.reduce((sum, item) => sum + item.доходы, 0);
      return { expenses, income };
    }
  };

  const periodTotals = getPeriodTotals();

  // Форматируем текст периода для отображения
  const getPeriodLabel = () => {
    if (period === "week") return "недели";
    if (period === "month") return "месяца";
    return "года";
  };

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm px-4 pt-2 pb-3 flex items-center justify-between relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-gradient-to-r after:from-finance-blue/20 after:via-finance-purple/40 after:to-finance-blue/20">
        <div className="flex items-center">
          <h1 className="text-lg font-bold bg-gradient-to-r from-finance-blue to-finance-purple bg-clip-text text-transparent drop-shadow-sm">Аналитика</h1>
        </div>
        <div className="flex items-center">
          <Button
            variant="outline"
            size="sm"
            className="text-sm flex items-center gap-1"
          >
            Апрель 2025
            <ChevronDown size={14} />
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="p-4 animate-fade-in">
        {/* Period selector */}
        <div className="mb-6 flex justify-between items-center">
          <div className="flex">
            <Button
              variant={period === "week" ? "default" : "outline"}
              size="sm"
              className="rounded-r-none"
              onClick={() => setPeriod("week")}
            >
              Неделя
            </Button>
            <Button
              variant={period === "month" ? "default" : "outline"}
              size="sm"
              className="rounded-none border-x-0"
              onClick={() => setPeriod("month")}
            >
              Месяц
            </Button>
            <Button
              variant={period === "year" ? "default" : "outline"}
              size="sm"
              className="rounded-l-none"
              onClick={() => setPeriod("year")}
            >
              Год
            </Button>
          </div>
          <div className="flex gap-2">
            <CSVImportExport />
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              <Download size={14} />
              Отчет
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="neumorph p-4">
            <p className="text-xs text-muted-foreground">Расходы за {getPeriodLabel()}</p>
            <p className="text-lg font-semibold">
              {periodTotals.expenses.toLocaleString()} ₽
            </p>
            <p className="text-xs text-finance-red mt-1">
              {period === "week" ? "+12.5% с прошлой недели" : period === "month" ? "+8.2% с прошлого месяца" : "+5.3% с прошлого года"}
            </p>
          </div>
          <div className="neumorph p-4">
            <p className="text-xs text-muted-foreground">Доходы за {getPeriodLabel()}</p>
            <p className="text-lg font-semibold">
              {periodTotals.income.toLocaleString()} ₽
            </p>
            <p className="text-xs text-finance-green mt-1">
              {period === "week" ? "+5.0% с прошлой недели" : period === "month" ? "+0% с прошлого месяца" : "+8.2% с прошлого года"}
            </p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold text-base mb-3">Рекомендации</h3>

          {/* Блок — Рестораны */}
          <div className="neumorph px-3 py-3 rounded-xl shadow-sm mb-2.5 transition-all duration-300 hover:shadow-md bg-card text-card-foreground">
            <div className="flex justify-between items-start gap-2">
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-medium text-foreground mb-0.5">
                  Расходы на рестораны
                </h4>
                <p className="text-[11px] text-muted-foreground leading-snug">
                  <span className="text-finance-yellow font-medium">8,400₽</span> — на 15% выше среднего
                </p>
                <p className="text-[10px] text-muted-foreground/80 mt-0.5">
                  Готовьте дома чаще для экономии
                </p>
              </div>
              <AlertTriangle
                size={28}
                className="text-finance-yellow shrink-0"
              />
            </div>
          </div>

          {/* Блок — Налоговый вычет */}
          <div className="neumorph px-3 py-3 rounded-xl shadow-sm mb-2.5 transition-all duration-300 hover:shadow-md bg-card text-card-foreground">
            <div className="flex justify-between items-start gap-2">
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-medium text-foreground mb-0.5">
                  Налоговый вычет
                </h4>
                <p className="text-[11px] text-muted-foreground leading-snug">
                  Экономия <span className="text-finance-green font-medium">7,800₽</span> за медуслуги
                </p>
                <p className="text-[10px] text-muted-foreground/80 mt-0.5">
                  Оформите через налоговую
                </p>
              </div>
              <ShieldCheck
                size={28}
                className="text-finance-green shrink-0"
              />
            </div>
          </div>
        </div>

        {/* Analytics Tabs */}
        <Tabs defaultValue="expenses" className="mb-6">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="expenses">Расходы</TabsTrigger>
            <TabsTrigger value="income">Доходы</TabsTrigger>
            <TabsTrigger value="balance">Баланс</TabsTrigger>
          </TabsList>

          <TabsContent value="expenses">
            {/* Categories Pie Chart */}
            <div className="neumorph p-4 mb-4">
              <h3 className="font-medium mb-3">Расходы по категориям</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={expensesByCategory}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={3}
                      dataKey="value"
                      label={false}
                      animationBegin={0}
                      animationDuration={800}
                    >
                      {expensesByCategory.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.color}
                          stroke="#fff"
                          strokeWidth={2}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [`${value.toLocaleString()} ₽`, 'Сумма']}
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.98)",
                        borderRadius: "12px",
                        border: "none",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        padding: "12px",
                      }}
                      labelStyle={{ fontWeight: 600, marginBottom: 4 }}
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>

              {/* Category List */}
              <div className="mt-3">
                {expensesByCategory.map((category) => (
                  <div
                    key={category.name}
                    className="flex justify-between items-center mb-2"
                  >
                    <div className="flex items-center">
                      <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: category.color }}
                      ></div>
                      <span className="text-sm">{category.name}</span>
                    </div>
                    <div className="text-sm font-medium">
                      {category.value.toLocaleString()} ₽
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Weekly Trend */}
            <div className="neumorph p-4">
              <h3 className="font-medium mb-3">Динамика расходов</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.3} />
                    <XAxis
                      dataKey="day"
                      tick={{ fontSize: 11, fill: '#9ca3af' }}
                      axisLine={{ stroke: '#e5e7eb' }}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: '#9ca3af' }}
                      axisLine={{ stroke: '#e5e7eb' }}
                      tickLine={false}
                    />
                    <Tooltip
                      formatter={(value) => [`${value.toLocaleString()} ₽`, 'Расходы']}
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.98)",
                        borderRadius: "12px",
                        border: "none",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        padding: "12px",
                      }}
                      labelStyle={{ fontWeight: 600, marginBottom: 4 }}
                      itemStyle={{ color: '#EF4444', fontWeight: 500 }}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#EF4444"
                      strokeWidth={3}
                      fill="url(#expenseGradient)"
                      dot={false}
                      activeDot={{ r: 6, fill: '#EF4444', strokeWidth: 2, stroke: '#fff' }}
                      animationDuration={1000}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="income">
            {/* Income Bar Chart */}
            <div className="neumorph p-4">
              <h3 className="font-medium mb-3">Доходы по месяцам</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <defs>
                      <linearGradient id="incomeBarGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10B981" stopOpacity={1}/>
                        <stop offset="100%" stopColor="#10B981" stopOpacity={0.7}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.3} />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 11, fill: '#9ca3af' }}
                      axisLine={{ stroke: '#e5e7eb' }}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: '#9ca3af' }}
                      axisLine={{ stroke: '#e5e7eb' }}
                      tickLine={false}
                    />
                    <Tooltip
                      formatter={(value) => [`${value.toLocaleString()} ₽`, 'Доход']}
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.98)",
                        borderRadius: "12px",
                        border: "none",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        padding: "12px",
                      }}
                      labelStyle={{ fontWeight: 600, marginBottom: 4 }}
                      itemStyle={{ color: '#10B981', fontWeight: 500 }}
                    />
                    <Bar
                      dataKey="доходы"
                      fill="url(#incomeBarGradient)"
                      radius={[8, 8, 0, 0]}
                      animationDuration={800}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Income Sources */}
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Источники дохода</h4>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm">Зарплата</span>
                  <span className="text-sm font-medium">85,000 ₽</span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="balance">
            {/* Balance Comparison */}
            <div className="neumorph p-4">
              <h3 className="font-medium mb-3">Сравнение доходов и расходов</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <defs>
                      <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10B981" stopOpacity={1}/>
                        <stop offset="100%" stopColor="#10B981" stopOpacity={0.7}/>
                      </linearGradient>
                      <linearGradient id="expensesGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#EF4444" stopOpacity={1}/>
                        <stop offset="100%" stopColor="#EF4444" stopOpacity={0.7}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.3} />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 11, fill: '#9ca3af' }}
                      axisLine={{ stroke: '#e5e7eb' }}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: '#9ca3af' }}
                      axisLine={{ stroke: '#e5e7eb' }}
                      tickLine={false}
                    />
                    <Tooltip
                      formatter={(value) => `${value.toLocaleString()} ₽`}
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.98)",
                        borderRadius: "12px",
                        border: "none",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        padding: "12px",
                      }}
                      labelStyle={{ fontWeight: 600, marginBottom: 4 }}
                    />
                    <Legend
                      wrapperStyle={{ paddingTop: '10px' }}
                      iconType="circle"
                    />
                    <Bar
                      dataKey="доходы"
                      fill="url(#incomeGradient)"
                      radius={[8, 8, 0, 0]}
                      animationDuration={800}
                    />
                    <Bar
                      dataKey="расходы"
                      fill="url(#expensesGradient)"
                      radius={[8, 8, 0, 0]}
                      animationDuration={800}
                      animationBegin={400}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Savings */}
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Накопления</h4>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Апрель 2025</span>
                  <span className="text-sm font-medium text-finance-green">
                    +41,750 ₽
                  </span>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
