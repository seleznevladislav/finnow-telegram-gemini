/**
 * Сервис логирования событий в Google Sheets
 * Отправляет логи через Google Apps Script Web App
 */

export interface UserLoginEvent {
  timestamp: string;
  userId?: number;
  username?: string;
  firstName?: string;
  lastName?: string;
  languageCode?: string;
  isPremium?: boolean;
  platform?: string;
  isMobile?: boolean;
}

/**
 * Отправляет лог события входа пользователя в Google Sheets
 */
export async function logUserLogin(event: UserLoginEvent): Promise<void> {
  const googleScriptUrl = import.meta.env.VITE_GOOGLE_SCRIPT_URL;

  if (!googleScriptUrl) {
    console.warn('⚠️ VITE_GOOGLE_SCRIPT_URL не настроен - логирование пропущено');
    return;
  }

  try {
    const response = await fetch(googleScriptUrl, {
      method: 'POST',
      mode: 'no-cors', // Google Apps Script требует no-cors mode
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'user_login',
        ...event,
      }),
    });

    // В режиме no-cors мы не можем прочитать response, но запрос отправится
    console.log('✅ Лог входа пользователя отправлен', {
      userId: event.userId,
      timestamp: event.timestamp,
    });
  } catch (error) {
    console.error('❌ Ошибка отправки лога:', error);
    // Не пробрасываем ошибку дальше, чтобы не ломать UX
  }
}

/**
 * Создает объект события входа из данных Telegram пользователя
 */
export function createLoginEvent(
  user: any,
  platform?: string,
  isMobile?: boolean
): UserLoginEvent {
  return {
    timestamp: new Date().toISOString(),
    userId: user?.id,
    username: user?.username,
    firstName: user?.first_name,
    lastName: user?.last_name,
    languageCode: user?.language_code,
    isPremium: user?.is_premium || false,
    platform: platform || 'unknown',
    isMobile: isMobile || false,
  };
}
