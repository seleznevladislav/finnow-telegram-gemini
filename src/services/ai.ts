// Hugging Face Inference API для работы с AI моделями
// Используем бесплатный доступ к ChatGPT-совместимым моделям

interface Message {
  role: "user" | "assistant";
  content: string;
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

// Системный промпт для AI помощника
const getSystemPrompt = () => {
  const context = getUserFinancialContext();

  return `Ты - умный финансовый помощник в приложении FinNow. Твоя задача - помогать пользователю управлять личными финансами.

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

**ПРИМЕРЫ ОТВЕТОВ:**

Вопрос: "С какой карты лучше оплатить обед в ресторане?"
Ответ: "🍽️ Используйте Альфа-Банк •4567 - там сейчас кэшбэк 5% на рестораны! Это вернёт вам часть денег. У вас есть 84,590₽ на этой карте."

Вопрос: "Как сэкономить деньги?"
Ответ: "💰 Заметил, что на рестораны вы тратите 8,400₽ - это на 15% выше среднего. Попробуйте готовить дома 2-3 раза в неделю. Потенциальная экономия: ~2,500₽/месяц!"

Вопрос: "Хватит ли денег до конца месяца?"
Ответ: "✅ При текущих тратах (43,250₽/мес) у вас хватит денег. Баланс на картах: 129,590₽, плюс накопления 125,000₽. Вы откладываете ~49% дохода - отлично!"

Теперь отвечай на вопросы пользователя!`;
};

// Функция для получения ответа от AI (через Hugging Face Inference API)
export const getChatResponse = async (
  userMessage: string,
  conversationHistory: Message[]
): Promise<string> => {
  try {
    // Используем Hugging Face Inference API
    const HF_API_KEY = import.meta.env.VITE_HF_API_KEY || "hf_demo_key";
    const HF_MODEL = "mistralai/Mixtral-8x7B-Instruct-v0.1";

    // Если API ключ не настроен, используем fallback
    if (HF_API_KEY === "hf_demo_key" || !HF_API_KEY) {
      console.warn("HF API key not configured, using fallback");
      return getFallbackResponse(userMessage);
    }

    // Формируем промпт в формате Mixtral Instruct
    // Формат: <s>[INST] system_prompt + user_message [/INST] assistant_response</s> [INST] user_message [/INST]
    const systemPrompt = getSystemPrompt();

    let prompt = "";

    // Берем последние 3 сообщения для контекста (не включая welcome)
    const recentHistory = conversationHistory
      .filter(msg => msg.id !== "welcome")
      .slice(-3);

    if (recentHistory.length === 0) {
      // Первое сообщение - включаем системный промпт
      prompt = `<s>[INST] ${systemPrompt}\n\n${userMessage} [/INST]`;
    } else {
      // Есть история - формируем диалог
      prompt = "<s>";

      for (let i = 0; i < recentHistory.length; i++) {
        const msg = recentHistory[i];
        if (msg.role === "user") {
          if (i === 0) {
            // Первое сообщение в истории - добавляем системный промпт
            prompt += `[INST] ${systemPrompt}\n\n${msg.content} [/INST]`;
          } else {
            prompt += `[INST] ${msg.content} [/INST]`;
          }
        } else if (msg.role === "assistant") {
          prompt += ` ${msg.content}</s> `;
        }
      }

      // Добавляем текущий вопрос пользователя
      prompt += `<s>[INST] ${userMessage} [/INST]`;
    }

    console.log("Sending to HF API:", { model: HF_MODEL, promptLength: prompt.length });

    // Запрос к Hugging Face Inference API
    const response = await fetch(
      `https://api-inference.huggingface.co/models/${HF_MODEL}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 350,
            temperature: 0.7,
            top_p: 0.95,
            repetition_penalty: 1.1,
            return_full_text: false,
            do_sample: true,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`HF API error: ${response.status}`, errorText);
      throw new Error(`HF API error: ${response.status}`);
    }

    const data = await response.json();
    console.log("HF API response:", data);

    // Извлекаем текст ответа
    let aiResponse = "";
    if (Array.isArray(data) && data[0]?.generated_text) {
      aiResponse = data[0].generated_text;
    } else if (data.generated_text) {
      aiResponse = data.generated_text;
    } else if (data.error) {
      console.error("HF API error:", data.error);
      throw new Error(data.error);
    } else {
      console.error("Unexpected response format:", data);
      throw new Error("Unexpected response format");
    }

    // Очищаем ответ от тегов и лишнего текста
    aiResponse = aiResponse
      .replace(/<s>/g, "")
      .replace(/<\/s>/g, "")
      .replace(/\[INST\].*?\[\/INST\]/gs, "")
      .trim();

    if (!aiResponse || aiResponse.length < 3) {
      console.warn("Empty AI response, using fallback");
      return getFallbackResponse(userMessage);
    }

    return aiResponse;
  } catch (error) {
    console.error("AI service error:", error);
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

  // Дефолтный ответ
  return `Понял ваш вопрос! 🤔 Могу помочь с:\n• Выбором карты для покупок\n• Анализом расходов\n• Советами по экономии\n• Прогнозом бюджета\n\nУточните, что именно вас интересует?`;
};
