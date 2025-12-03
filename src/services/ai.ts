// AI сервис для FinNow - интеграция с HuggingFace и получение рыночных данных
import { OpenAI } from "openai";

interface Message {
  role: "user" | "assistant";
  content: string;
}

// Интерфейсы для рыночных данных
interface CryptoPrice {
  symbol: string;
  name: string;
  current_price: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
}

interface CurrencyRate {
  currency: string;
  rate: number;
}

interface StockPrice {
  ticker: string;           // Тикер акции (например, SBER, GAZP, YNDX)
  name: string;             // Полное название компании
  price: number;            // Текущая цена
  change: number;           // Изменение цены
  changePercent: number;    // Изменение в процентах
  volume: number;           // Объём торгов
}

interface BondPrice {
  ticker: string;           // Тикер облигации
  name: string;             // Название облигации
  price: number;            // Текущая цена
  faceValue: number;        // Номинал
  yield: number;            // Доходность к погашению (%)
  couponRate: number;       // Купонная ставка (%)
  maturityDate?: string;    // Дата погашения
}

// Кэш для котировок (5 минут)
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

let cryptoCache: CacheEntry<CryptoPrice[]> | null = null;
let currencyCache: CacheEntry<CurrencyRate[]> | null = null;
let stocksCache: CacheEntry<StockPrice[]> | null = null;
let bondsCache: CacheEntry<BondPrice[]> | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 минут

function isCacheValid<T>(cache: CacheEntry<T> | null): boolean {
  if (!cache) return false;
  return Date.now() - cache.timestamp < CACHE_DURATION;
}

// Получение котировок криптовалют (CoinGecko API)
async function getCryptoPrices(): Promise<CryptoPrice[]> {
  if (isCacheValid(cryptoCache)) return cryptoCache!.data;

  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,tether,binancecoin&order=market_cap_desc&sparkline=false'
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const prices = data.map((coin: any) => ({
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      current_price: coin.current_price,
      price_change_24h: coin.price_change_24h,
      price_change_percentage_24h: coin.price_change_percentage_24h,
    }));

    cryptoCache = { data: prices, timestamp: Date.now() };
    return prices;
  } catch (error) {
    console.error('Ошибка получения криптовалютных котировок:', error);
    if (cryptoCache) return cryptoCache.data;
    return [];
  }
}

// Получение курсов валют (Exchangerate API)
async function getCurrencyRates(): Promise<CurrencyRate[]> {
  if (isCacheValid(currencyCache)) return currencyCache!.data;

  try {
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const currencies = ['EUR', 'RUB', 'CNY', 'JPY'];
    const rates = currencies.map(currency => ({
      currency,
      rate: data.rates[currency],
    }));

    currencyCache = { data: rates, timestamp: Date.now() };
    return rates;
  } catch (error) {
    console.error('Ошибка получения курсов валют:', error);
    if (currencyCache) return currencyCache.data;
    return [];
  }
}

// Флаг для использования реального MOEX API через Netlify Functions
const USE_REAL_MOEX_API = import.meta.env.VITE_USE_NETLIFY_MOEX === 'true';

const getNetlifyFunctionsUrl = () => {
  if (import.meta.env.VITE_NETLIFY_FUNCTIONS_URL) {
    return import.meta.env.VITE_NETLIFY_FUNCTIONS_URL;
  }

  if (typeof window !== 'undefined') {
    if (window.location.hostname !== 'localhost') {
      return `${window.location.origin}/.netlify/functions`;
    }
    return 'http://localhost:8888/.netlify/functions';
  }

  return '/.netlify/functions';
};

// Получение котировок акций MOEX (через Netlify Functions или моки)
async function getStockPrices(): Promise<StockPrice[]> {
  if (isCacheValid(stocksCache)) return stocksCache!.data;

  // Моковые данные (обновлены 4 декабря 2024)
  const mockStocks: StockPrice[] = [
    {
      ticker: 'SBER',
      name: 'Сбербанк',
      price: 300.00,
      change: 6.50,
      changePercent: 2.21,
      volume: 1234567890,
    },
    {
      ticker: 'GAZP',
      name: 'Газпром',
      price: 125.00,
      change: -2.80,
      changePercent: -2.19,
      volume: 987654321,
    },
    {
      ticker: 'YDEX',
      name: 'Яндекс',
      price: 4145.00,
      change: 85.00,
      changePercent: 2.09,
      volume: 234567890,
    },
    {
      ticker: 'LKOH',
      name: 'ЛУКОЙЛ',
      price: 5430.00,
      change: -105.00,
      changePercent: -1.90,
      volume: 456789012,
    },
    {
      ticker: 'GMKN',
      name: 'Норникель',
      price: 131.00,
      change: 1.04,
      changePercent: 0.80,
      volume: 345678901,
    },
  ];

  if (!USE_REAL_MOEX_API) {
    stocksCache = { data: mockStocks, timestamp: Date.now() };
    return mockStocks;
  }

  try {
    const functionsUrl = getNetlifyFunctionsUrl();
    const response = await fetch(`${functionsUrl}/moex-stocks`);

    if (!response.ok) throw new Error(`Function error: ${response.status}`);

    const result = await response.json();
    if (!result.success || !result.data) throw new Error('Invalid response');

    const stocks: StockPrice[] = result.data;
    stocksCache = { data: stocks, timestamp: Date.now() };
    return stocks;
  } catch (error) {
    console.error('Ошибка получения котировок акций:', error);
    if (stocksCache) return stocksCache.data;
    stocksCache = { data: mockStocks, timestamp: Date.now() };
    return mockStocks;
  }
}

// Получение котировок облигаций MOEX (через Netlify Functions или моки)
async function getBondPrices(): Promise<BondPrice[]> {
  if (isCacheValid(bondsCache)) return bondsCache!.data;

  // Моковые данные (обновлены 4 декабря 2024)
  const mockBonds: BondPrice[] = [
    {
      ticker: 'SU26238RMFS4',
      name: 'ОФЗ 26238',
      price: 59.00,
      faceValue: 1000,
      yield: 13.92,
      couponRate: 7.5,
      maturityDate: '2028-07-19',
    },
    {
      ticker: 'SU26240RMFS9',
      name: 'ОФЗ 26240',
      price: 61.79,
      faceValue: 1000,
      yield: 14.48,
      couponRate: 6.9,
      maturityDate: '2036-07-30',
    },
    {
      ticker: 'SU26241RMFS7',
      name: 'ОФЗ 26241',
      price: 80.19,
      faceValue: 1000,
      yield: 14.54,
      couponRate: 6.1,
      maturityDate: '2032-11-17',
    },
  ];

  if (!USE_REAL_MOEX_API) {
    bondsCache = { data: mockBonds, timestamp: Date.now() };
    return mockBonds;
  }

  try {
    const functionsUrl = getNetlifyFunctionsUrl();
    const response = await fetch(`${functionsUrl}/moex-bonds`);

    if (!response.ok) throw new Error(`Function error: ${response.status}`);

    const result = await response.json();
    if (!result.success || !result.data) throw new Error('Invalid response');

    const bonds: BondPrice[] = result.data;
    bondsCache = { data: bonds, timestamp: Date.now() };
    return bonds;
  } catch (error) {
    console.error('Ошибка получения котировок облигаций:', error);
    if (bondsCache) return bondsCache.data;
    bondsCache = { data: mockBonds, timestamp: Date.now() };
    return mockBonds;
  }
}

// Получение текущей даты и времени
function getCurrentDateTime(): string {
  const now = new Date();
  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'Europe/Moscow',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };
  return now.toLocaleString('ru-RU', options);
}

// Моковые финансовые данные пользователя (в будущем будут из реального API)
const getUserFinancialContext = () => {
  const accounts = [
    {
      name: "Альфа-Банк •4567",
      type: "Дебетовая карта",
      balance: 84590,
      currency: "₽",
      benefits: "Кэшбэк 5% на рестораны в апреле",
    },
    {
      name: "Т-Банк •1234",
      type: "Кредитная карта",
      balance: 45000,
      currency: "₽",
      benefits: "Кэшбэк 10% на такси и доставку в апреле",
    },
    {
      name: "Сбербанк •7890",
      type: "Накопительный счет",
      balance: 125000,
      currency: "₽",
      benefits: "8% годовых",
    },
  ];

  const recentTransactions = [
    {
      title: "Супермаркет Перекресток",
      amount: 2450,
      category: "Продукты",
      date: "12 апреля",
    },
    {
      title: "АЗС Газпромнефть",
      amount: 1800,
      category: "Транспорт",
      date: "12 апреля",
    },
    {
      title: "Кафе Брускетта",
      amount: 1240,
      category: "Рестораны",
      date: "11 апреля",
    },
    { title: "Netflix", amount: 799, category: "Подписки", date: "11 апреля" },
    {
      title: "Зарплата",
      amount: 85000,
      category: "Доход",
      date: "10 апреля",
    },
  ];

  const monthlyStats = {
    totalBalance: 254590,
    expenses: 43250,
    income: 85000,
    savings: 41750,
    topCategory: "Рестораны (8,400₽ - на 15% выше среднего)",
  };

  return { accounts, recentTransactions, monthlyStats };
};

// Системный промпт для AI помощника (с актуальными данными)
const getSystemPrompt = async () => {
  const context = getUserFinancialContext();

  // Получаем актуальные данные из интернета
  const currentDateTime = getCurrentDateTime();
  const cryptoPrices = await getCryptoPrices();
  const currencyRates = await getCurrencyRates();
  const stockPrices = await getStockPrices();
  const bondPrices = await getBondPrices();

  // Формируем секцию с актуальными данными
  let marketDataSection = `\n**АКТУАЛЬНЫЕ ДАННЫЕ (${currentDateTime}):**\n\n`;

  if (cryptoPrices.length > 0) {
    marketDataSection += `Криптовалюты:\n`;
    cryptoPrices.forEach(crypto => {
      const changeSign = crypto.price_change_percentage_24h >= 0 ? '+' : '';
      marketDataSection += `- ${crypto.name} (${crypto.symbol}): $${crypto.current_price.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})} (${changeSign}${crypto.price_change_percentage_24h.toFixed(2)}% за 24ч)\n`;
    });
    marketDataSection += '\n';
  }

  if (currencyRates.length > 0) {
    marketDataSection += `Курсы валют (к USD):\n`;
    currencyRates.forEach(rate => {
      marketDataSection += `- 1 USD = ${rate.rate.toFixed(2)} ${rate.currency}\n`;
    });
    marketDataSection += '\n';
  }

  if (stockPrices.length > 0) {
    marketDataSection += `Российские акции (MOEX):\n`;
    stockPrices.forEach(stock => {
      const changeSign = stock.changePercent >= 0 ? '+' : '';
      marketDataSection += `- ${stock.name} (${stock.ticker}): ${stock.price.toFixed(2)}₽ (${changeSign}${stock.changePercent.toFixed(2)}%)\n`;
    });
    marketDataSection += '\n';
  }

  if (bondPrices.length > 0) {
    marketDataSection += `Облигации федерального займа (ОФЗ):\n`;
    bondPrices.forEach(bond => {
      marketDataSection += `- ${bond.name}: ${bond.price.toFixed(2)}% от номинала, доходность ${bond.yield.toFixed(2)}% годовых\n`;
    });
    marketDataSection += '\n';
  }

  return `Ты - умный финансовый помощник в приложении FinNow. Твоя задача - помогать пользователю управлять личными финансами.

${marketDataSection}
**КОНТЕКСТ О ПОЛЬЗОВАТЕЛЕ:**

Счета и карты:
${context.accounts.map((acc) => `- ${acc.name} (${acc.type}): ${acc.balance.toLocaleString()}${acc.currency}, ${acc.benefits}`).join("\n")}

Недавние транзакции:
${context.recentTransactions.map((t) => `- ${t.title}: ${t.amount}₽ (${t.category}, ${t.date})`).join("\n")}

Статистика за месяц:
- Общий баланс: ${context.monthlyStats.totalBalance.toLocaleString()}₽
- Расходы: ${context.monthlyStats.expenses.toLocaleString()}₽
- Доходы: ${context.monthlyStats.income.toLocaleString()}₽
- Сбережения: ${context.monthlyStats.savings.toLocaleString()}₽
- Топ категория: ${context.monthlyStats.topCategory}

**ПРАВИЛА:**
1. Отвечай ТОЛЬКО на русском языке
2. Давай конкретные персонализированные советы на основе данных пользователя
3. Будь кратким и по делу (макс. 3-4 предложения)
4. При вопросах о выборе карты - учитывай кэшбэк и категории месяца
5. Используй эмодзи для дружелюбности (но не переборщи)
6. Если вопрос не по финансам - вежливо напомни, что ты финансовый помощник
7. У тебя есть доступ к актуальным данным: криптовалюты, курсы валют, акции (MOEX), облигации (ОФЗ)
8. При вопросах об инвестициях давай взвешенные рекомендации с учетом рисков и доходности
9. Всегда предупреждай о рисках инвестиций (акции могут падать, облигации имеют инфляционный риск)
10. ВАЖНО: Используй ТОЛЬКО данные из раздела "АКТУАЛЬНЫЕ ДАННЫЕ" выше - там указана точная дата и время. НЕ выдумывай другие даты!

**ПРИМЕРЫ ОТВЕТОВ:**

Вопрос: "С какой карты лучше оплатить обед в ресторане?"
Ответ: "🍽️ Используйте Альфа-Банк •4567 - там сейчас кэшбэк 5% на рестораны! Это вернёт вам часть денег. У вас есть 84,590₽ на этой карте."

Вопрос: "Какой сейчас курс биткоина?"
Ответ: "₿ Bitcoin сейчас торгуется около $93,676 (+2.01% за 24ч). Если думаете об инвестициях - помните про риски и не вкладывайте больше, чем можете позволить потерять."

Вопрос: "Как сэкономить деньги?"
Ответ: "💰 Заметил, что на рестораны вы тратите 8,400₽ - это на 15% выше среднего. Попробуйте готовить дома 2-3 раза в неделю. Потенциальная экономия: ~2,500₽/месяц!"

Вопрос: "Стоит ли покупать акции Сбербанка?"
Ответ: "📈 Сбербанк (SBER) сейчас торгуется по 300₽ (+2.21%). Это голубая фишка с хорошими дивидендами. Подходит для долгосрочных инвестиций. Помните: акции могут падать, инвестируйте только свободные средства."

Вопрос: "Что лучше - акции или облигации?"
Ответ: "⚖️ Зависит от вашей цели. ОФЗ дают ~14% годовых с низким риском - для сбережений. Акции рискованнее, но потенциал выше - для роста капитала. Оптимально: 60-70% облигации, 30-40% акции для баланса."

Вопрос: "Какая доходность у облигаций сейчас?"
Ответ: "📊 ОФЗ сейчас дают доходность 14-15% годовых из-за высокой ключевой ставки ЦБ. Это выше, чем вклады в банках, и риск минимален - государство гарантирует выплаты. Хороший вариант для части сбережений."

Теперь отвечай на вопросы пользователя!`;
};

// Функция для получения ответа от AI (через Hugging Face Inference API)
export const getChatResponse = async (
  userMessage: string,
  conversationHistory: Message[]
): Promise<string> => {
  try {
    // Используем Llama-3.1-8B-Instruct - мощная модель от Meta с отличной поддержкой различных языков
    // Работает через HuggingFace Router API (совместимый с OpenAI SDK)
    const HF_API_KEY = import.meta.env.VITE_HF_API_KEY || "hf_demo_key";
    const HF_MODEL = "meta-llama/Llama-3.1-8B-Instruct";

    // Если API ключ не настроен, используем fallback
    if (HF_API_KEY === "hf_demo_key" || !HF_API_KEY) {
      console.info("💡 HF API key не настроен - используются локальные ответы на основе ключевых слов");
      return getFallbackResponse(userMessage);
    }

    // Создаём клиент OpenAI, настроенный на HuggingFace Router
    // ВАЖНО: dangerouslyAllowBrowser нужен для работы в браузере (Telegram Mini App)
    // Для production рекомендуется создать бэкенд endpoint для проксирования запросов
    const client = new OpenAI({
      baseURL: "https://router.huggingface.co/v1",
      apiKey: HF_API_KEY,
      dangerouslyAllowBrowser: true,
    });

    // Формируем системный промпт с актуальными данными из интернета
    const systemPrompt = await getSystemPrompt();

    // Берем последние 4 сообщения для контекста
    const recentHistory = conversationHistory
      .filter(msg => msg.id !== "welcome")
      .slice(-4);

    // Формируем сообщения для chatCompletion API
    const messages: any[] = [
      {
        role: "system",
        content: systemPrompt,
      },
      // Добавляем историю диалога
      ...recentHistory.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      // Добавляем текущий вопрос пользователя
      {
        role: "user",
        content: userMessage,
      },
    ];

    console.log("Sending to HF API:", {
      model: HF_MODEL,
      messagesCount: messages.length
    });

    // Запрос к Hugging Face через OpenAI SDK
    const response = await client.chat.completions.create({
      model: HF_MODEL,
      messages: messages,
      max_tokens: 300,
      temperature: 0.5,
      top_p: 0.7,
      stream: false, // Пока без streaming для простоты
    });

    console.log("HF API response:", response);

    // Извлекаем текст ответа из chatCompletion
    const aiResponse = response.choices?.[0]?.message?.content || "";

    if (!aiResponse || aiResponse.length < 3) {
      console.warn("Empty AI response, using fallback");
      return getFallbackResponse(userMessage);
    }

    return aiResponse.trim();
  } catch (error) {
    console.warn("AI service error:", error);
    console.info("💡 Используются локальные ответы на основе ключевых слов");
    return getFallbackResponse(userMessage);
  }
};

// Простой калькулятор для математических выражений
const calculateMath = (expression: string): number | null => {
  try {
    // Убираем пробелы и проверяем, что это математическое выражение
    const cleaned = expression.replace(/\s/g, '');
    // Разрешаем только цифры и математические операции
    if (!/^[0-9+\-*/().]+$/.test(cleaned)) {
      return null;
    }
    // Используем Function вместо eval для безопасности
    const result = new Function('return ' + cleaned)();
    return typeof result === 'number' && !isNaN(result) ? result : null;
  } catch {
    return null;
  }
};

// Fallback ответы на основе ключевых слов (когда AI API недоступен)
const getFallbackResponse = (userMessage: string): string => {
  const message = userMessage.toLowerCase();
  const context = getUserFinancialContext();

  // Проверяем, не математический ли это вопрос
  const mathMatch = userMessage.match(/(?:сколько|что|чему равн[оа]|посчитай|вычисли|реши)?\s*(?:будет)?\s*([0-9+\-*/().]+)\s*(?:\?|=)?/i);
  if (mathMatch && mathMatch[1]) {
    const result = calculateMath(mathMatch[1]);
    if (result !== null) {
      return `🧮 ${mathMatch[1]} = ${result}`;
    }
  }

  if (
    message.includes("карт") &&
    (message.includes("ресторан") ||
      message.includes("кафе") ||
      message.includes("обед"))
  ) {
    return `🍽️ Рекомендую Альфа-Банк •4567 - там сейчас кэшбэк 5% на рестораны! Это вернёт вам часть денег. Баланс: ${context.accounts[0].balance.toLocaleString()}₽.`;
  }

  if (
    message.includes("карт") &&
    (message.includes("такси") || message.includes("доставк"))
  ) {
    return `🚕 Для такси и доставки используйте Т-Банк •1234 - кэшбэк 10%! Это значительная экономия. Доступно: ${context.accounts[1].balance.toLocaleString()}₽.`;
  }

  if (message.includes("эконом") || message.includes("сбереч")) {
    return `💰 Заметил, что на рестораны вы тратите 8,400₽/мес - это на 15% выше среднего. Попробуйте готовить дома 2-3 раза в неделю. Потенциальная экономия: ~2,500₽/месяц!`;
  }

  if (
    message.includes("анализ") ||
    message.includes("расход") ||
    message.includes("трат")
  ) {
    return `📊 За апрель вы потратили ${context.monthlyStats.expenses.toLocaleString()}₽. Топ категория: ${context.monthlyStats.topCategory}. Ваш коэффициент сбережений: 49% - отлично! Продолжайте в том же духе.`;
  }

  if (
    message.includes("хватит") ||
    message.includes("денег") ||
    message.includes("конец месяца")
  ) {
    return `✅ При текущем темпе трат у вас хватит денег до конца месяца. Общий баланс: ${context.monthlyStats.totalBalance.toLocaleString()}₽. Вы откладываете ~49% дохода - это здорово!`;
  }

  if (message.includes("прогноз") || message.includes("будущ")) {
    return `🔮 При текущих тратах (${context.monthlyStats.expenses.toLocaleString()}₽/мес) к концу месяца у вас будет ~${(context.monthlyStats.totalBalance - context.monthlyStats.expenses + context.monthlyStats.income).toLocaleString()}₽. Вы на правильном пути!`;
  }

  if (
    message.includes("налог") ||
    message.includes("вычет") ||
    message.includes("льгот")
  ) {
    return `🏛️ Вы можете получить налоговый вычет за медицинские услуги. Проверьте чеки за год - потенциальная экономия до 15,600₽ (13% от расходов). Оформляется через налоговую.`;
  }

  if (message.includes("карт") && message.includes("лучш")) {
    return `💳 У вас 3 карты:\n• Альфа-Банк (5% на рестораны)\n• Т-Банк (10% на такси/доставку)\n• Сбербанк (8% годовых)\n\nИспользуйте карту по категории покупки для максимального кэшбэка!`;
  }

  // Вопросы об инвестициях, акциях и облигациях
  if (
    message.includes("акци") ||
    message.includes("сбербанк") ||
    message.includes("газпром") ||
    message.includes("яндекс")
  ) {
    return `📈 Актуальные котировки российских акций (4 дек 2024): Сбербанк 300₽, Газпром 125₽, Яндекс 4145₽. Акции подходят для долгосрочных инвестиций (3-5 лет). Помните: они могут падать на 20-40%, инвестируйте только свободные средства!`;
  }

  if (
    message.includes("облигаци") ||
    message.includes("офз") ||
    message.includes("бонд")
  ) {
    return `📊 ОФЗ (облигации федерального займа) — надёжный инструмент с доходностью 14-15% годовых из-за высокой ключевой ставки ЦБ. Риск минимален — государство гарантирует выплаты. Отличная альтернатива банковским вкладам.`;
  }

  if (
    message.includes("инвестиц") ||
    message.includes("инвестир") ||
    message.includes("вложи") ||
    message.includes("куда вложить")
  ) {
    return `💼 Для начала инвестиций рекомендую:\n• 60-70% в ОФЗ (стабильность, 14-15% годовых)\n• 30-40% в голубые фишки (рост, дивиденды)\n• Горизонт от 3 лет\n\nВаш накопительный счёт (125,000₽) хорошо подходит для старта!`;
  }

  if (
    (message.includes("что") || message.includes("куда")) &&
    (message.includes("лучше") || message.includes("выгодн")) &&
    (message.includes("деньги") || message.includes("средства"))
  ) {
    return `💡 С вашими сбережениями (${context.monthlyStats.savings.toLocaleString()}₽/мес) есть варианты:\n• Накопительный счёт: 8% без риска\n• ОФЗ: 14-15%, низкий риск\n• Акции: потенциально больше, но с риском\n\nРекомендую диверсификацию!`;
  }

  if (
    message.includes("риск") &&
    (message.includes("акци") || message.includes("инвест"))
  ) {
    return `⚠️ Риски инвестиций:\n• Акции могут упасть на 20-40%\n• Не вкладывайте деньги на срок <3 лет\n• Диверсифицируйте (разные компании)\n• Инвестируйте только свободные средства\n\nНачните с 10-20% от сбережений.`;
  }

  // Дефолтный ответ
  return `Понял ваш вопрос! 🤔 Могу помочь с:\n• Выбором карты для покупок\n• Анализом расходов\n• Советами по экономии\n• Прогнозом бюджета\n• Рекомендациями по инвестициям\n\nУточните, что именно вас интересует?`;
};

// Функция для получения AI-совета по инвестициям
export const getInvestmentAdvice = async (amount: number, bondYield: number, timeframe: number): Promise<string> => {
  const HF_API_KEY = import.meta.env.VITE_HF_API_KEY || "hf_demo_key";
  const HF_MODEL = "meta-llama/Llama-3.1-8B-Instruct";

  // Если API ключ не настроен, используем fallback
  if (HF_API_KEY === "hf_demo_key" || !HF_API_KEY) {
    return getFallbackInvestmentAdvice(amount, bondYield, timeframe);
  }

  try {
    const client = new OpenAI({
      baseURL: "https://router.huggingface.co/v1",
      apiKey: HF_API_KEY,
      dangerouslyAllowBrowser: true,
    });

    const expectedProfit = Math.floor(amount * (bondYield / 100) * timeframe);

    const prompt = `Пользователь планирует инвестировать ${amount.toLocaleString()} рублей в ОФЗ 26238 (облигации федерального займа РФ) с доходностью ${bondYield}% годовых на срок ${timeframe} года. Ожидаемая прибыль: ${expectedProfit.toLocaleString()} рублей.

Как финансовый советник, дай краткую позитивную оценку этого плана (2-3 предложения):
- Почему ОФЗ - разумный выбор для консервативного инвестора
- Что важно учесть при таком вложении
- Как можно диверсифицировать портфель

Твой ответ должен поддерживать решение и быть конструктивным. Используй эмодзи 💼 в начале.`;

    const response = await client.chat.completions.create({
      model: HF_MODEL,
      messages: [
        {
          role: "system",
          content: "Ты опытный финансовый советник который помогает людям принимать взвешенные инвестиционные решения. Ты позитивный, конструктивный и даешь практичные советы на русском языке. Ты поддерживаешь разумные консервативные решения."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 250,
      temperature: 0.7,
      top_p: 0.9,
    });

    const aiResponse = response.choices?.[0]?.message?.content || "";

    if (!aiResponse || aiResponse.length < 10) {
      return getFallbackInvestmentAdvice(amount, bondYield, timeframe);
    }

    return aiResponse.trim();
  } catch (error) {
    console.error("Ошибка получения AI-совета:", error);
    return getFallbackInvestmentAdvice(amount, bondYield, timeframe);
  }
};

// Fallback совет по инвестициям
const getFallbackInvestmentAdvice = (amount: number, bondYield: number, timeframe: number): string => {
  const expectedProfit = Math.floor(amount * (bondYield / 100) * timeframe);

  return `💼 ОФЗ с доходностью ${bondYield}% - надёжный выбор для консервативного инвестора. За ${timeframe} года вы заработаете ~${expectedProfit.toLocaleString()}₽. При текущей высокой ключевой ставке ЦБ это отличная доходность. Рекомендация: это хорошая база портфеля (60-70%), остальное можно вложить в более доходные, но рискованные инструменты.`;
};

// Типы для плана инвестиций
export type RiskLevel = 'low' | 'medium' | 'high';

export interface InvestmentInstrument {
  id: string;
  name: string;
  type: string;
  allocation: number;
  amount: number;
  expectedYield: number;
  description: string;
  riskLevel: RiskLevel;
}

export interface GeneratedInvestmentPlan {
  instruments: InvestmentInstrument[];
  expectedYield: number;
  timeframe: string;
  aiReasoning: string;
}

// Функция для генерации персонального плана инвестиций через AI
export const generateInvestmentPlan = async (
  amount: number,
  riskLevel: RiskLevel
): Promise<GeneratedInvestmentPlan> => {
  const HF_API_KEY = import.meta.env.VITE_HF_API_KEY || "hf_demo_key";
  const HF_MODEL = "meta-llama/Llama-3.1-8B-Instruct";

  // Если API ключ не настроен, используем fallback
  if (HF_API_KEY === "hf_demo_key" || !HF_API_KEY) {
    return getFallbackInvestmentPlan(amount, riskLevel);
  }

  try {
    const client = new OpenAI({
      baseURL: "https://router.huggingface.co/v1",
      apiKey: HF_API_KEY,
      dangerouslyAllowBrowser: true,
    });

    const riskDescriptions = {
      low: "низкий (консервативный, защита капитала)",
      medium: "средний (сбалансированный, умеренный рост)",
      high: "высокий (агрессивный, максимальный доход)"
    };

    const prompt = `Создай персональный план инвестиций для российского инвестора.

Параметры:
- Сумма: ${amount.toLocaleString()} рублей
- Уровень риска: ${riskDescriptions[riskLevel]}

Составь диверсифицированный портфель из 3-4 инструментов. Используй:
- Для низкого риска: ОФЗ (60-80%), корпоративные облигации (20-30%), акции голубых фишек (0-10%)
- Для среднего риска: ОФЗ/облигации (40-50%), акции (40-50%), золото/ETF (10%)
- Для высокого риска: акции роста (50-60%), крипто (20-30%), венчур/ETF (20%)

Верни ТОЛЬКО валидный JSON в таком формате (без дополнительного текста):
{
  "instruments": [
    {
      "name": "Название инструмента",
      "type": "Тип (Облигации/Акции/Крипто/ETF)",
      "allocation": число от 0 до 100 (процент),
      "expectedYield": число (ожидаемая доходность в % годовых),
      "description": "Краткое описание (1 предложение)"
    }
  ],
  "expectedYield": число (средняя доходность портфеля в %),
  "timeframe": "строка (рекомендуемый срок инвестирования)",
  "aiReasoning": "Краткая аргументация выбора (2-3 предложения)"
}

Важно: allocation должны в сумме давать 100. Используй реальные российские инструменты.`;

    const response = await client.chat.completions.create({
      model: HF_MODEL,
      messages: [
        {
          role: "system",
          content: "Ты финансовый советник для российского рынка. Возвращай ТОЛЬКО валидный JSON, без дополнительного текста или markdown."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 800,
      temperature: 0.7,
      top_p: 0.9,
    });

    const aiResponse = response.choices?.[0]?.message?.content || "";

    if (!aiResponse || aiResponse.length < 10) {
      return getFallbackInvestmentPlan(amount, riskLevel);
    }

    // Парсим JSON из ответа
    try {
      // Извлекаем JSON из ответа (может быть обернут в ```json```)
      let jsonStr = aiResponse.trim();
      const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        jsonStr = jsonMatch[0];
      }

      const parsed = JSON.parse(jsonStr);

      // Валидация и добавление недостающих полей
      if (!parsed.instruments || !Array.isArray(parsed.instruments)) {
        throw new Error("Invalid instruments array");
      }

      const instruments: InvestmentInstrument[] = parsed.instruments.map((inst: any, idx: number) => ({
        id: `inst-${Date.now()}-${idx}`,
        name: inst.name || "Неизвестный инструмент",
        type: inst.type || "Другое",
        allocation: Number(inst.allocation) || 0,
        amount: Math.floor(amount * (Number(inst.allocation) || 0) / 100),
        expectedYield: Number(inst.expectedYield) || 0,
        description: inst.description || "",
        riskLevel: riskLevel,
      }));

      return {
        instruments,
        expectedYield: Number(parsed.expectedYield) || 10,
        timeframe: parsed.timeframe || "1-2 года",
        aiReasoning: parsed.aiReasoning || "Этот портфель подобран с учетом вашего уровня риска.",
      };
    } catch (parseError) {
      console.error("Ошибка парсинга AI ответа:", parseError);
      console.log("AI ответ:", aiResponse);
      return getFallbackInvestmentPlan(amount, riskLevel);
    }
  } catch (error) {
    console.error("Ошибка генерации плана:", error);
    return getFallbackInvestmentPlan(amount, riskLevel);
  }
};

// Fallback план инвестиций
const getFallbackInvestmentPlan = (amount: number, riskLevel: RiskLevel): GeneratedInvestmentPlan => {
  const plans = {
    low: {
      instruments: [
        {
          id: "ofz-1",
          name: "ОФЗ 26238",
          type: "Облигации",
          allocation: 70,
          amount: Math.floor(amount * 0.7),
          expectedYield: 12.5,
          description: "Государственные облигации РФ с фиксированной доходностью",
          riskLevel: 'low' as RiskLevel,
        },
        {
          id: "corp-bonds-1",
          name: "Корпоративные облигации",
          type: "Облигации",
          allocation: 25,
          amount: Math.floor(amount * 0.25),
          expectedYield: 14.0,
          description: "Облигации надежных российских компаний (Газпром, Сбербанк)",
          riskLevel: 'low' as RiskLevel,
        },
        {
          id: "stocks-1",
          name: "Акции голубых фишек",
          type: "Акции",
          allocation: 5,
          amount: Math.floor(amount * 0.05),
          expectedYield: 15.0,
          description: "Акции крупнейших компаний ММВБ (Сбербанк, Газпром, Лукойл)",
          riskLevel: 'low' as RiskLevel,
        },
      ],
      expectedYield: 12.8,
      timeframe: "2-3 года",
      aiReasoning: "Консервативный портфель ориентирован на защиту капитала и стабильный доход. 95% в облигациях обеспечивают надежность, небольшая доля акций добавляет потенциал роста.",
    },
    medium: {
      instruments: [
        {
          id: "ofz-2",
          name: "ОФЗ и корп. облигации",
          type: "Облигации",
          allocation: 45,
          amount: Math.floor(amount * 0.45),
          expectedYield: 13.0,
          description: "Смесь государственных и корпоративных облигаций для стабильности",
          riskLevel: 'medium' as RiskLevel,
        },
        {
          id: "stocks-2",
          name: "Российские акции",
          type: "Акции",
          allocation: 40,
          amount: Math.floor(amount * 0.4),
          expectedYield: 18.0,
          description: "Диверсифицированный портфель акций ММВБ с потенциалом роста",
          riskLevel: 'medium' as RiskLevel,
        },
        {
          id: "gold-etf-1",
          name: "Золото / ETF",
          type: "ETF",
          allocation: 15,
          amount: Math.floor(amount * 0.15),
          expectedYield: 8.0,
          description: "Защитный актив для хеджирования рисков",
          riskLevel: 'medium' as RiskLevel,
        },
      ],
      expectedYield: 14.5,
      timeframe: "1-2 года",
      aiReasoning: "Сбалансированный портфель сочетает надежность облигаций с потенциалом роста акций. Золото служит защитой от волатильности рынка.",
    },
    high: {
      instruments: [
        {
          id: "growth-stocks-1",
          name: "Акции роста",
          type: "Акции",
          allocation: 50,
          amount: Math.floor(amount * 0.5),
          expectedYield: 25.0,
          description: "Акции быстрорастущих технологических компаний и второго эшелона",
          riskLevel: 'high' as RiskLevel,
        },
        {
          id: "crypto-1",
          name: "Криптовалюты",
          type: "Крипто",
          allocation: 30,
          amount: Math.floor(amount * 0.3),
          expectedYield: 40.0,
          description: "BTC и ETH для высокой доходности при повышенном риске",
          riskLevel: 'high' as RiskLevel,
        },
        {
          id: "tech-etf-1",
          name: "Технологические ETF",
          type: "ETF",
          allocation: 20,
          amount: Math.floor(amount * 0.2),
          expectedYield: 20.0,
          description: "Фонды технологических компаний для диверсификации",
          riskLevel: 'high' as RiskLevel,
        },
      ],
      expectedYield: 28.0,
      timeframe: "6-12 месяцев",
      aiReasoning: "Агрессивный портфель нацелен на максимальную доходность. Высокая доля акций роста и криптовалют дает потенциал значительного увеличения капитала, но требует готовности к волатильности.",
    },
  };

  return plans[riskLevel];
};
