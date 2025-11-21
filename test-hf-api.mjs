import dotenv from 'dotenv';
import { OpenAI } from 'openai';

dotenv.config();

const HF_API_KEY = process.env.VITE_HF_API_KEY || 'your_huggingface_api_key_here';
const HF_MODEL = 'meta-llama/Llama-3.1-8B-Instruct';

// Тестовое сообщение пользователя
const USER_MESSAGE = "С какой карты лучше оплатить обед в ресторане?";

// Системный промпт (упрощенная версия)
const SYSTEM_PROMPT = `Ты - финансовый помощник. У пользователя есть 3 карты:
1. Альфа-Банк (кэшбэк 5% на рестораны)
2. Т-Банк (кэшбэк 10% на такси и доставку)
3. Сбербанк (накопительный счет 8% годовых)

Отвечай кратко на русском языке (максимум 2-3 предложения).`;

async function testHF() {
  try {
    console.log('Инициализация HuggingFace Inference через OpenAI SDK...');
    console.log('Модель:', HF_MODEL);
    console.log('API: OpenAI-совместимый (HuggingFace Router)');
    console.log('Вопрос:', USER_MESSAGE);
    console.log('\n---\n');

    // Создаём клиент OpenAI, настроенный на HuggingFace Router
    const client = new OpenAI({
      baseURL: 'https://router.huggingface.co/v1',
      apiKey: HF_API_KEY,
    });

    // Формируем сообщения для chatCompletion API
    const messages = [
      {
        role: "system",
        content: SYSTEM_PROMPT,
      },
      {
        role: "user",
        content: USER_MESSAGE,
      },
    ];

    // Выполняем запрос к модели
    const response = await client.chat.completions.create({
      model: HF_MODEL,
      messages: messages,
      max_tokens: 300,
      temperature: 0.5,
      top_p: 0.7,
    });

    console.log('✅ Успешный ответ от HuggingFace API:');
    console.log('Full response:', JSON.stringify(response, null, 2));

    const aiResponse = response.choices?.[0]?.message?.content || "";
    console.log('\n📝 Ответ AI:', aiResponse);
  } catch (error) {
    console.error('❌ Ошибка при запросе к HuggingFace API:');
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', await error.response.text());
    }
  }
}

testHF();