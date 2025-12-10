/**
 * Система аналитики для AB тестирования
 * Логирует события в Google Sheets через Google Apps Script
 */

import WebApp from "@twa-dev/sdk";

// Типы событий для AB тестирования
export enum ABTestEvent {
  AI_INSIGHT_SHOWN = "ai_insight_shown", // Показ AI блока
  AI_INSIGHT_CLICKED = "ai_insight_clicked", // Клик на AI блок (переход в инвестиции)
  ANALYTICS_MODULE_VISITED = "analytics_module_visited", // Посещение модуля Аналитики
  INVESTMENTS_MODULE_VISITED = "investments_module_visited", // Посещение модуля Инвестиций
}

// Интерфейс данных события
interface AnalyticsEventData {
  event: ABTestEvent;
  timestamp: string;
  userId: number | string;
  username?: string;
  firstName?: string;
  lastName?: string;
  platform?: string;
  languageCode?: string;
  isPremium: boolean;
  // Дополнительные параметры для конкретных событий
  metadata?: Record<string, any>;
}

// URL Google Apps Script Web App (используем существующий из logger.ts)
const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL;

// Флаг для включения/отключения аналитики
const ANALYTICS_ENABLED = import.meta.env.VITE_ANALYTICS_ENABLED !== "false";

/**
 * Получает данные о пользователе из Telegram WebApp
 */
function getUserData() {
  const user = WebApp.initDataUnsafe?.user;

  if (!user) {
    console.warn("Telegram user data not available");
    return {
      userId: "unknown",
      username: undefined,
      firstName: undefined,
      lastName: undefined,
      platform: WebApp.platform || "unknown",
      languageCode: WebApp.initDataUnsafe?.user?.language_code || "ru",
      isPremium: false,
    };
  }

  return {
    userId: user.id,
    username: user.username,
    firstName: user.first_name,
    lastName: user.last_name,
    platform: WebApp.platform || "unknown",
    languageCode: user.language_code || "ru",
    isPremium: user.is_premium || false,
  };
}

/**
 * Отправляет событие в Google Sheets (на страницу "AB testing")
 */
async function sendEventToGoogleSheets(eventData: AnalyticsEventData) {
  if (!ANALYTICS_ENABLED) {
    console.log("[Analytics] Disabled, skipping event:", eventData.event);
    return;
  }

  if (!GOOGLE_SCRIPT_URL) {
    console.warn("[Analytics] Google Script URL not configured");
    return;
  }

  // Добавляем тип события для маршрутизации в Google Script
  const payload = {
    type: "ab_testing", // Помечаем как AB тестирование для отдельной страницы
    ...eventData,
  };

  try {
    await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors", // Google Apps Script требует no-cors
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    console.log("✅ [AB Testing] Event sent:", eventData.event, {
      userId: eventData.userId,
      timestamp: eventData.timestamp,
    });
  } catch (error) {
    console.error("❌ [AB Testing] Failed to send event:", error);
  }
}

/**
 * Логирует событие аналитики
 */
export async function logEvent(
  event: ABTestEvent,
  metadata?: Record<string, any>
) {
  const userData = getUserData();
  const timestamp = new Date().toISOString();

  const eventData: AnalyticsEventData = {
    event,
    timestamp,
    ...userData,
    metadata,
  };

  // Логируем в консоль для отладки
  console.log("[Analytics] Logging event:", eventData);

  // Отправляем в Google Sheets
  await sendEventToGoogleSheets(eventData);
}

/**
 * Логирует показ AI блока (AIInsightTrigger)
 */
export function logAIInsightShown() {
  logEvent(ABTestEvent.AI_INSIGHT_SHOWN);
}

/**
 * Логирует клик по AI блоку (переход в модуль инвестиций)
 */
export function logAIInsightClicked() {
  logEvent(ABTestEvent.AI_INSIGHT_CLICKED);
}

/**
 * Логирует посещение модуля Аналитики
 */
export function logAnalyticsModuleVisited() {
  logEvent(ABTestEvent.ANALYTICS_MODULE_VISITED);
}

/**
 * Логирует посещение модуля Инвестиций
 */
export function logInvestmentsModuleVisited() {
  logEvent(ABTestEvent.INVESTMENTS_MODULE_VISITED);
}
