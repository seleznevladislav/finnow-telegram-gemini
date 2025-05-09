
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ChevronLeft, 
  Calendar, 
  PieChart, 
  BarChart2, 
  LineChart,
  ChevronDown,
  Download,
  AlertTriangle,
  Lightbulb,
  TrendingDown,
  Receipt
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Line
} from "recharts";

export default function Analytics() {
  const navigate = useNavigate();
  const [period, setPeriod] = useState("month");
  
  // Sample expense data by category
  const expensesByCategory = [
    { name: "Продукты", value: 15800, color: "#4F6AF0" },
    { name: "Рестораны", value: 8400, color: "#8B5CF6" },
    { name: "Транспорт", value: 6200, color: "#10B981" },
    { name: "Развлечения", value: 4500, color: "#F59E0B" },
    { name: "Подписки", value: 2300, color: "#EF4444" },
    { name: "Прочее", value: 6050, color: "#6B7280" },
  ];
  
  // Sample monthly data
  const monthlyData = [
    { name: "Янв", расходы: 32500, доходы: 85000 },
    { name: "Фев", расходы: 35800, доходы: 85000 },
    { name: "Мар", расходы: 38200, доходы: 87500 },
    { name: "Апр", расходы: 43250, доходы: 85000 },
    { name: "Май", расходы: 36900, доходы: 90000 },
    { name: "Июн", расходы: 41200, доходы: 90000 },
  ];
  
  // Sample trend data
  const trendData = [
    { day: "Пн", value: 4200 },
    { day: "Вт", value: 3800 },
    { day: "Ср", value: 5100 },
    { day: "Чт", value: 2800 },
    { day: "Пт", value: 7500 },
    { day: "Сб", value: 9600 },
    { day: "Вс", value: 6500 },
  ];
  
  const totalExpenses = expensesByCategory.reduce((sum, category) => sum + category.value, 0);
  
  return (
    <div className="pb-20">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-background px-4 py-3 flex items-center justify-between border-b border-border">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className="mr-2"
            onClick={() => navigate('/')}
          >
            <ChevronLeft size={20} />
          </Button>
          <h1 className="text-xl font-semibold">Аналитика</h1>
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
          <Button 
            variant="outline" 
            size="sm"
            className="flex items-center gap-1"
          >
            <Download size={14} />
            Отчет
          </Button>
        </div>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="neumorph p-4">
            <p className="text-xs text-muted-foreground">Расходы</p>
            <p className="text-lg font-semibold">{totalExpenses.toLocaleString()} ₽</p>
            <p className="text-xs text-finance-red mt-1">+8.2% с прошлого месяца</p>
          </div>
          <div className="neumorph p-4">
            <p className="text-xs text-muted-foreground">Доходы</p>
            <p className="text-lg font-semibold">85,000 ₽</p>
            <p className="text-xs text-finance-green mt-1">+0% с прошлого месяца</p>
          </div>
        </div>
        
        {/* Recommendations */}
        <div className="mb-6">
          <h3 className="font-medium mb-3">Рекомендации</h3>
          <div className="neumorph p-5 mb-3">
            <div className="flex justify-between items-start mb-2">
              <h4 className="text-sm font-medium">Оптимизируйте расходы на рестораны</h4>
              <AlertTriangle size={24} className="text-finance-yellow shrink-0 ml-2" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Ваши расходы на рестораны составляют <span className="highlight-text">8,400 ₽</span>, что на <span className="highlight-text">15%</span> выше среднего. 
              Рассмотрите возможность готовить дома чаще.
            </p>
          </div>
          <div className="neumorph p-5">
            <div className="flex justify-between items-start mb-2">
              <h4 className="text-sm font-medium">Налоговый вычет</h4>
              <Lightbulb size={24} className="text-finance-green shrink-0 ml-2" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Вы имеете право на налоговый вычет за медицинские услуги. 
              Потенциальная экономия: <span className="highlight-text">7,800 ₽</span>.
            </p>
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
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {expensesByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value.toLocaleString()} ₽`} />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
              
              {/* Category List */}
              <div className="mt-3">
                {expensesByCategory.map((category) => (
                  <div key={category.name} className="flex justify-between items-center mb-2">
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
                  <RechartsLineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip formatter={(value) => `${value.toLocaleString()} ₽`} />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#4F6AF0"
                      activeDot={{ r: 8 }}
                    />
                  </RechartsLineChart>
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
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => `${value.toLocaleString()} ₽`} />
                    <Bar dataKey="доходы" fill="#10B981" />
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
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => `${value.toLocaleString()} ₽`} />
                    <Legend />
                    <Bar dataKey="доходы" fill="#10B981" />
                    <Bar dataKey="расходы" fill="#EF4444" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              {/* Savings */}
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Накопления</h4>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Апрель 2025</span>
                  <span className="text-sm font-medium text-finance-green">+41,750 ₽</span>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
