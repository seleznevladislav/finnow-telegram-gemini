/**
 * Утилиты для A/B тестирования
 * Детерминированное разделение пользователей на группы на основе хеш-функции
 */

/**
 * Варианты A/B теста
 */
export enum ABTestVariant {
  A = "A", // Контрольная группа - без AI блока
  B = "B", // Тестовая группа - с AI блоком
}

/**
 * Простая хеш-функция для строки
 * Возвращает число от 0 до 99 (для процентного распределения)
 */
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash) % 100;
}

/**
 * Определяет вариант A/B теста для пользователя
 * @param userId - ID пользователя из Telegram
 * @param splitPercentage - процент пользователей в группе B (по умолчанию 50%)
 * @returns Вариант теста (A или B)
 */
export function getABTestVariant(
  userId: number | string,
  splitPercentage: number = 50
): ABTestVariant {
  // Преобразуем userId в строку для хеширования
  const userIdStr = String(userId);

  // Получаем хеш от 0 до 99
  const hash = simpleHash(userIdStr);

  // Если хеш меньше splitPercentage, пользователь в группе B
  // Иначе в группе A
  const variant = hash < splitPercentage ? ABTestVariant.B : ABTestVariant.A;

  console.log(`[AB Test] User ${userId} -> hash: ${hash} -> variant: ${variant}`);

  return variant;
}

/**
 * Проверяет, находится ли пользователь в тестовой группе B (с AI блоком)
 * @param userId - ID пользователя из Telegram
 * @returns true, если пользователь должен видеть AI блок
 */
export function shouldShowAIInsight(userId: number | string): boolean {
  return getABTestVariant(userId) === ABTestVariant.B;
}

/**
 * Проверяет, находится ли пользователь в контрольной группе A (без AI блока)
 * @param userId - ID пользователя из Telegram
 * @returns true, если пользователь НЕ должен видеть AI блок
 */
export function isControlGroup(userId: number | string): boolean {
  return getABTestVariant(userId) === ABTestVariant.A;
}
