// Утилиты для работы с CSV файлами

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
  account: string;
}

/**
 * Экспорт транзакций в CSV
 */
export function exportTransactionsToCSV(transactions: Transaction[]): void {
  const headers = ['date', 'description', 'amount', 'category', 'type', 'account'];
  const csvContent = [
    headers.join(','),
    ...transactions.map(t => [
      t.date,
      `"${t.description.replace(/"/g, '""')}"`, // Экранируем кавычки
      t.amount,
      `"${t.category}"`,
      t.type,
      `"${t.account}"`,
    ].join(','))
  ].join('\n');

  // Создаем Blob с BOM для корректной кодировки UTF-8 в Excel
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `finnow_transactions_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Импорт транзакций из CSV
 */
export async function importTransactionsFromCSV(file: File): Promise<Transaction[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n').filter(line => line.trim());

        if (lines.length < 2) {
          reject(new Error('CSV файл пустой или содержит только заголовки'));
          return;
        }

        // Пропускаем заголовок
        const dataLines = lines.slice(1);

        const transactions: Transaction[] = dataLines.map((line, index) => {
          // Парсим CSV с учетом кавычек
          const values = parseCSVLine(line);

          if (values.length < 6) {
            throw new Error(`Строка ${index + 2}: недостаточно колонок`);
          }

          const [date, description, amountStr, category, type, account] = values;
          const amount = parseFloat(amountStr);

          if (isNaN(amount)) {
            throw new Error(`Строка ${index + 2}: некорректная сумма "${amountStr}"`);
          }

          if (type !== 'income' && type !== 'expense') {
            throw new Error(`Строка ${index + 2}: тип должен быть "income" или "expense"`);
          }

          return {
            id: `csv_${Date.now()}_${index}`,
            date: date.trim(),
            description: description.trim(),
            amount,
            category: category.trim(),
            type: type.trim() as 'income' | 'expense',
            account: account.trim(),
          };
        });

        resolve(transactions);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error('Ошибка чтения файла'));
    };

    reader.readAsText(file, 'UTF-8');
  });
}

/**
 * Парсинг строки CSV с учетом кавычек
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Двойная кавычка внутри кавычек - это экранированная кавычка
        current += '"';
        i++; // Пропускаем следующую кавычку
      } else {
        // Переключаем режим кавычек
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // Разделитель вне кавычек
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current);
  return result;
}

/**
 * Генерация примера CSV для скачивания
 */
export function generateSampleCSV(): void {
  const sampleData: Transaction[] = [
    {
      id: '1',
      date: '2025-01-15',
      description: 'Покупка продуктов в Пятёрочке',
      amount: -1500,
      category: 'Продукты',
      type: 'expense',
      account: 'Основная карта',
    },
    {
      id: '2',
      date: '2025-01-20',
      description: 'Зарплата',
      amount: 85000,
      category: 'Доход',
      type: 'income',
      account: 'Основная карта',
    },
    {
      id: '3',
      date: '2025-01-22',
      description: 'Оплата Яндекс.Музыка',
      amount: -299,
      category: 'Подписки',
      type: 'expense',
      account: 'Основная карта',
    },
    {
      id: '4',
      date: '2025-01-25',
      description: 'Ресторан "Теремок"',
      amount: -850,
      category: 'Рестораны',
      type: 'expense',
      account: 'Основная карта',
    },
  ];

  exportTransactionsToCSV(sampleData);
}
