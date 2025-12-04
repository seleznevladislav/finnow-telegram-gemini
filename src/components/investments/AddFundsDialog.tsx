import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Wallet, Check } from "lucide-react";
import { useInvestment } from "@/contexts/InvestmentContext";
import { useToast } from "@/hooks/use-toast";

interface AddFundsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const accounts = [
  {
    id: "1",
    name: "Основная карта",
    bankName: "Альфа-Банк",
    balance: 84590,
    lastDigits: "4567",
  },
  {
    id: "2",
    name: "Накопительный счет",
    bankName: "Сбербанк",
    balance: 125000,
    lastDigits: "3151",
  },
];

export default function AddFundsDialog({ isOpen, onClose }: AddFundsDialogProps) {
  const [selectedAccount, setSelectedAccount] = useState(accounts[0].id);
  const [amount, setAmount] = useState("");
  const { addFunds } = useInvestment();
  const { toast } = useToast();

  const selectedAccountData = accounts.find(acc => acc.id === selectedAccount);
  const amountNum = parseFloat(amount) || 0;
  const isValidAmount = amountNum > 0 && selectedAccountData && amountNum <= selectedAccountData.balance;

  const handleSubmit = () => {
    if (!isValidAmount || !selectedAccountData) return;

    addFunds(selectedAccount, selectedAccountData.name, amountNum);

    toast({
      title: "Средства добавлены",
      description: `${amountNum.toLocaleString()} ₽ из ${selectedAccountData.bankName} доступны для инвестирования`,
    });

    setAmount("");
    onClose();
  };

  const handleQuickAmount = (percentage: number) => {
    if (!selectedAccountData) return;
    const quickAmount = Math.floor(selectedAccountData.balance * percentage);
    setAmount(quickAmount.toString());
  };

  // Обязательные траты в этом месяце (моковые данные)
  const essentialExpenses = [
    { category: "Аренда", amount: 35000 },
    { category: "Коммунальные", amount: 4500 },
    { category: "Продукты", amount: 12000 },
    { category: "Транспорт", amount: 3000 },
  ];
  const totalEssential = essentialExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xs">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <Wallet className="text-finance-blue" size={18} />
            Добавить средства
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Обязательные траты */}
          <div className="neumorph-inset p-3 rounded-lg">
            <p className="text-xs font-medium mb-2 text-muted-foreground">Обязательные траты в месяц</p>
            <div className="space-y-1.5 mb-2">
              {essentialExpenses.map((exp) => (
                <div key={exp.category} className="flex justify-between text-xs">
                  <span className="text-muted-foreground">{exp.category}</span>
                  <span className="font-medium">{exp.amount.toLocaleString()} ₽</span>
                </div>
              ))}
            </div>
            <div className="pt-2 border-t border-border flex justify-between text-xs">
              <span className="font-medium">Итого:</span>
              <span className="font-semibold text-finance-red">{totalEssential.toLocaleString()} ₽</span>
            </div>
          </div>

          {/* Выбор счета */}
          <div>
            <Label className="text-xs font-medium mb-2 block text-muted-foreground">Выберите счет</Label>
            <RadioGroup value={selectedAccount} onValueChange={setSelectedAccount}>
              {accounts.map(account => {
                const availableAfterExpenses = account.balance - totalEssential;
                return (
                  <div
                    key={account.id}
                    className={`flex items-center justify-between p-2.5 rounded-lg border-2 transition-all cursor-pointer ${
                      selectedAccount === account.id
                        ? 'border-finance-blue bg-finance-blue/5'
                        : 'border-border hover:border-finance-blue/50'
                    }`}
                    onClick={() => setSelectedAccount(account.id)}
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value={account.id} id={account.id} />
                      <div>
                        <p className="font-medium text-xs">{account.name}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {account.bankName} •{account.lastDigits}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-xs">
                        {account.balance.toLocaleString()} ₽
                      </p>
                      {availableAfterExpenses > 0 && (
                        <p className="text-[10px] text-finance-green">
                          ~{availableAfterExpenses.toLocaleString()} ₽ свободно
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </RadioGroup>
          </div>

          {/* Ввод суммы */}
          <div>
            <Label htmlFor="amount" className="text-xs font-medium mb-2 block text-muted-foreground">
              Сумма для инвестирования
            </Label>
            <Input
              id="amount"
              type="number"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="text-base font-semibold h-10"
            />
            {selectedAccountData && amountNum > selectedAccountData.balance && (
              <p className="text-[10px] text-finance-red mt-1">
                Недостаточно средств на счете
              </p>
            )}
          </div>

          {/* Быстрый выбор суммы */}
          <div>
            <Label className="text-xs font-medium mb-2 block text-muted-foreground">Быстрый выбор</Label>
            <div className="grid grid-cols-4 gap-2">
              {[0.25, 0.5, 0.75, 1].map((percentage) => (
                <Button
                  key={percentage}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAmount(percentage)}
                  className="text-[11px] h-8"
                >
                  {percentage === 1 ? 'Всё' : `${percentage * 100}%`}
                </Button>
              ))}
            </div>
          </div>

          {/* Информация */}
          {isValidAmount && (
            <div className="neumorph p-2.5 rounded-lg">
              <p className="text-[10px] text-muted-foreground mb-0.5">
                Будет доступно для инвестирования:
              </p>
              <p className="text-base font-semibold text-finance-green">
                {amountNum.toLocaleString()} ₽
              </p>
            </div>
          )}

          {/* Кнопки */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 h-9 text-sm"
            >
              Отмена
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!isValidAmount}
              className="flex-1 h-9 text-sm"
            >
              <Check size={14} className="mr-1" />
              Добавить
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
