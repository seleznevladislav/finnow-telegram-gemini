import { useState, useRef } from "react";
import { Upload, Download, FileSpreadsheet, AlertCircle, CheckCircle2, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTransactions } from "@/contexts/TransactionContext";
import { importTransactionsFromCSV, exportTransactionsToCSV, generateSampleCSV } from "@/utils/csv";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function CSVImportExport() {
  const { transactions, importTransactions } = useTransactions();
  const [isOpen, setIsOpen] = useState(false);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [replaceMode, setReplaceMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setError(null);
    setSuccess(null);

    try {
      const importedTransactions = await importTransactionsFromCSV(file);
      importTransactions(importedTransactions, replaceMode);

      setSuccess(
        `Успешно импортировано ${importedTransactions.length} транзакций! ${
          replaceMode ? 'Старые данные заменены.' : 'Данные добавлены к существующим.'
        }`
      );

      // Очищаем input для возможности повторной загрузки того же файла
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      setTimeout(() => {
        setSuccess(null);
        setIsOpen(false);
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка импорта CSV');
    } finally {
      setImporting(false);
    }
  };

  const handleExport = () => {
    try {
      exportTransactionsToCSV(transactions);
      setSuccess(`Экспортировано ${transactions.length} транзакций!`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Ошибка экспорта CSV');
    }
  };

  const handleDownloadSample = () => {
    generateSampleCSV();
    setSuccess('Пример CSV скачан!');
    setTimeout(() => setSuccess(null), 3000);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <FileSpreadsheet size={14} />
            CSV
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Работа с CSV файлами</DialogTitle>
            <DialogDescription>
              Импортируйте или экспортируйте транзакции в формате CSV
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Статус сообщения */}
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-finance-red/10 text-finance-red text-sm">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-finance-green/10 text-finance-green text-sm">
                <CheckCircle2 size={16} />
                <span>{success}</span>
              </div>
            )}

            {/* Экспорт */}
            <div className="neumorph p-4 rounded-xl space-y-3">
              <h4 className="font-semibold flex items-center gap-2">
                <Download size={16} />
                Экспорт данных
              </h4>
              <p className="text-sm text-muted-foreground">
                Скачайте текущие транзакции ({transactions.length} шт.) в формате CSV
              </p>
              <Button
                onClick={handleExport}
                className="w-full"
                variant="outline"
              >
                <Download size={16} className="mr-2" />
                Скачать CSV
              </Button>
            </div>

            {/* Импорт */}
            <div className="neumorph p-4 rounded-xl space-y-3">
              <h4 className="font-semibold flex items-center gap-2">
                <Upload size={16} />
                Импорт данных
              </h4>
              <p className="text-sm text-muted-foreground">
                Загрузите CSV файл с транзакциями
              </p>

              {/* Режим импорта */}
              <div className="flex gap-2">
                <button
                  onClick={() => setReplaceMode(false)}
                  className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    !replaceMode
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                  }`}
                >
                  Добавить к текущим
                </button>
                <button
                  onClick={() => setReplaceMode(true)}
                  className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    replaceMode
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                  }`}
                >
                  Заменить все
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="hidden"
                id="csv-upload"
              />
              <label htmlFor="csv-upload">
                <Button
                  className="w-full"
                  disabled={importing}
                  asChild
                >
                  <span>
                    <Upload size={16} className="mr-2" />
                    {importing ? 'Загрузка...' : 'Выбрать CSV файл'}
                  </span>
                </Button>
              </label>
            </div>

            {/* Пример CSV */}
            <div className="neumorph p-4 rounded-xl space-y-3">
              <h4 className="font-semibold flex items-center gap-2">
                <FileDown size={16} />
                Пример CSV
              </h4>
              <p className="text-sm text-muted-foreground">
                Скачайте пример файла, чтобы увидеть правильный формат
              </p>
              <Button
                onClick={handleDownloadSample}
                className="w-full"
                variant="outline"
              >
                <FileDown size={16} className="mr-2" />
                Скачать пример
              </Button>
            </div>

            {/* Формат файла */}
            <div className="neumorph-inset p-3 rounded-lg">
              <p className="text-xs font-medium mb-2">Формат CSV:</p>
              <code className="text-xs text-muted-foreground block bg-muted/30 p-2 rounded">
                date,description,amount,category,type,account
                <br />
                2025-01-15,"Покупка",-1500,"Продукты",expense,"Карта"
              </code>
              <ul className="text-xs text-muted-foreground mt-2 space-y-1">
                <li>• date: дата в формате YYYY-MM-DD</li>
                <li>• amount: сумма (отрицательная для расходов)</li>
                <li>• type: "income" или "expense"</li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
