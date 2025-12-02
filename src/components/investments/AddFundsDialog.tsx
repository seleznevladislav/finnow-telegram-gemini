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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="text-finance-blue" size={20} />
            Добавить средства для инвестиций
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Выбор счета */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Выберите счет</Label>
            <RadioGroup value={selectedAccount} onValueChange={setSelectedAccount}>
              {accounts.map(account => (
                <div
                  key={account.id}
                  className={`flex items-center justify-between p-3 rounded-lg border-2 transition-all cursor-pointer ${
                    selectedAccount === account.id
                      ? 'border-finance-blue bg-finance-blue/5'
                      : 'border-border hover:border-finance-blue/50'
                  }`}
                  onClick={() => setSelectedAccount(account.id)}
                >
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value={account.id} id={account.id} />
                    <div>
                      <p className="font-medium text-sm">{account.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {account.bankName} •{account.lastDigits}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm">
                      {account.balance.toLocaleString()} ₽
                    </p>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Ввод суммы */}
          <div>
            <Label htmlFor="amount" className="text-sm font-medium mb-2 block">
              Сумма для инвестирования
            </Label>
            <Input
              id="amount"
              type="number"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="text-lg font-semibold"
            />
            {selectedAccountData && amountNum > selectedAccountData.balance && (
              <p className="text-xs text-finance-red mt-1">
                Недостаточно средств на счете
              </p>
            )}
          </div>

          {/* Быстрый выбор суммы */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Быстрый выбор</Label>
            <div className="grid grid-cols-4 gap-2">
              {[0.25, 0.5, 0.75, 1].map((percentage) => (
                <Button
                  key={percentage}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAmount(percentage)}
                  className="text-xs"
                >
                  {percentage === 1 ? 'Всё' : `${percentage * 100}%`}
                </Button>
              ))}
            </div>
          </div>

          {/* Информация */}
          {isValidAmount && (
            <div className="neumorph p-3 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">
                После добавления будет доступно:
              </p>
              <p className="text-lg font-semibold text-finance-green">
                {amountNum.toLocaleString()} ₽
              </p>
            </div>
          )}

          {/* Кнопки */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Отмена
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!isValidAmount}
              className="flex-1"
            >
              <Check size={16} className="mr-1" />
              Добавить
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
