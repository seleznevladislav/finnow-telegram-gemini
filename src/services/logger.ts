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

  console.log('🔍 Проверка настроек логирования:', {
    hasUrl: !!googleScriptUrl,
    url: googleScriptUrl ? `${googleScriptUrl.substring(0, 30)}...` : 'не настроен',
    env: import.meta.env.MODE,
  });

  if (!googleScriptUrl) {
    console.warn('⚠️ VITE_GOOGLE_SCRIPT_URL не настроен - логирование пропущено');
    console.warn('💡 Добавьте переменную окружения VITE_GOOGLE_SCRIPT_URL в .env или настройках Netlify');
    return;
  }

  const payload = {
    type: 'user_login',
    ...event,
  };

  console.log('📤 Отправка лога в Google Sheets:', {
    url: `${googleScriptUrl.substring(0, 50)}...`,
    payload,
  });

  try {
    const response = await fetch(googleScriptUrl, {
      method: 'POST',
      mode: 'no-cors', // Google Apps Script требует no-cors mode
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    // В режиме no-cors мы не можем прочитать response, но запрос отправится
    console.log('✅ Лог входа пользователя отправлен (no-cors mode - ответ недоступен)', {
      userId: event.userId,
      username: event.username,
      timestamp: event.timestamp,
      platform: event.platform,
    });
  } catch (error) {
    console.error('❌ Ошибка отправки лога:', error);
    console.error('📋 Детали ошибки:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      name: error instanceof Error ? error.name : 'Unknown',
    });
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
