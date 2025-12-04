import { useNavigate, useParams } from "react-router-dom";
import {
  ChevronLeft,
  Plus,
  ArrowUpRight,
  History,
  Info,
  CreditCard,
  FileText,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useSwipeable } from "react-swipeable";

interface Account {
  id: string;
  name: string;
  bankName: string;
  balance: number;
  currency: string;
  lastDigits?: string;
  cardType?: string;
  type?: "card" | "account";
}

const accounts = [
  {
    id: "1",
    name: "Основная карта",
    bankName: "Альфа-Банк",
    balance: 84590,
    currency: "₽",
    lastDigits: "4567",
    color: "bg-gradient-to-r from-finance-blue to-finance-purple",
    type: "card",
  },
  {
    id: "2",
    name: "Накопительный счет",
    bankName: "Сбербанк",
    balance: 125000,
    currency: "₽",
    lastDigits: "3151",
    color: "bg-gradient-to-r from-finance-green to-finance-blue",
    type: "account",
  },
  {
    id: "3",
    name: "Кредитная карта",
    bankName: "Т-Банк",
    balance: 45000,
    currency: "₽",
    lastDigits: "1234",
    color: "bg-gradient-to-r from-finance-yellow to-finance-red",
    type: "card",
  },
];

export default function AccountDetail() {
  const [direction, setDirection] = useState<"left" | "right">("left");

  const navigate = useNavigate();
  const { id } = useParams();
  const [account, setAccount] = useState<Account | null>(null);

  useEffect(() => {
    const found = accounts.find((a) => a.id === id);
    if (found) setAccount(found);
    else navigate("/accounts");
  }, [id, navigate]);

  // 👉 Свайп-обработчики
  const currentIndex = accounts.findIndex((a) => a.id === id);
  const goToAccount = (newIndex: number) => {
    if (newIndex > currentIndex) setDirection("left");
    else if (newIndex < currentIndex) setDirection("right");

    if (newIndex >= 0 && newIndex < accounts.length) {
      navigate(`/accounts/${accounts[newIndex].id}`);
    }
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (currentIndex < accounts.length - 1) {
        // Переход к следующей карте
        goToAccount(currentIndex + 1);
      } else {
        // Если последняя карта - возврат в список
        navigate("/accounts");
      }
    },
    onSwipedRight: () => {
      if (currentIndex > 0) {
        // Переход к предыдущей карте
        goToAccount(currentIndex - 1);
      } else {
        // Если первая карта - возврат в список
        navigate("/accounts");
      }
    },
    trackMouse: true,
  });

  if (!account) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Загрузка...
      </div>
    );
  }

  const cardNumber = account.lastDigits || "0000";
  const accountNumber = account.id.padStart(4, "0");

  return (
    <div
      {...handlers}
      className={`pb-20 bg-background min-h-screen relative overflow-x-hidden ${
        direction === "left" ? "animate-slide-left" : "animate-slide-right"
      }`}
    >
      {/* Header */}
      <div className="p-4 pt-4 h-[240px]">
        <Button
          variant="ghost"
          size="icon"
          className="mb-8"
          onClick={() => navigate("/accounts")}
        >
          <ChevronLeft size={24} />
        </Button>

        {/* Account Info */}
        <h1 className="text-xl font-medium">{account.name}</h1>
        {account.type == "account" && (
          <>
            <p className="text-muted-foreground text-xs">
              на минимальный остаток
            </p>
          </>
        )}
        <div className="mt-4 mb-2">
          <p className="text-4xl font-semibold">
            {account.balance.toLocaleString().replace(",", " ")}{" "}
            {account.currency}
          </p>
        </div>
        {account.type === "card" && (
          <>
            <p className="text-muted-foreground">К счёту привязана карта</p>
          </>
        )}
      </div>

      {/* Card Visual - with animation and dark theme */}
      <div
        key={account.id}
        className="absolute top-20 right-[-30px] animate-fly-in-tilt"
      >
        <div
          className={`${
            account.type === "card"
              ? account.bankName === "Т-Банк"
                ? "bg-gradient-to-br from-yellow-400 to-black"
                : "bg-red-600"
              : "bg-gradient-to-br from-[#1A1F2C] to-[#2A2F3C]"
          } rounded-lg w-32 h-40 flex flex-col justify-between p-3 shadow-lg overflow-hidden relative`}
        >
          {/* Card Logo */}
          <div className="h-12 flex items-center">
            {account.type === "account" ? (
              <img
                src="/lovable-uploads/db341864-dca3-4169-8d9d-9a47f75d9e8d.png"
                alt="Card Logo"
                className="w-16 h-auto object-contain"
              />
            ) : account.bankName === "Т-Банк" ? (
              <div className="pl-3 text-black">
                <div className="text-2xl font-bold leading-tight mt-[-16px]">T</div>
              </div>
            ) : (
              <div className="pl-3 text-black">
                <div className="text-2xl font-bold leading-tight mt-[-16px]">A</div>
                <div className="text-base font-bold leading-none mt-[-16px]">
                  __
                </div>
              </div>
            )}
          </div>

          {/* Card Number */}
          <div className="text-sm pl-3 text-white/80 font-mono mt-auto">
            {cardNumber}
          </div>

          {/* Decorative Elements */}
          <div className={`absolute -bottom-10 -left-10 w-32 h-32 rounded-full blur-xl ${
            account.bankName === "Т-Банк" ? "bg-yellow-400/20" : "bg-red-500/20"
          }`}></div>
          <div className={`absolute -top-10 -right-10 w-28 h-28 rounded-full blur-xl ${
            account.bankName === "Т-Банк" ? "bg-yellow-500/10" : "bg-red-600/10"
          }`}></div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-4 mt-8 grid grid-cols-2 gap-3">
        <Button
          className="bg-primary/90 text-primary-foreground hover:bg-primary/80 py-6 rounded-xl font-medium"
          size="lg"
        >
          <Plus size={20} className="mr-2" /> Пополнить
        </Button>
        <Button
          className="bg-primary/90 text-primary-foreground hover:bg-primary/80 py-6 rounded-xl font-medium"
          size="lg"
        >
          <ArrowUpRight size={20} className="mr-2" /> Оплатить
        </Button>
      </div>

      {/* Account Actions */}
      <div className="bg-background/95 mt-6 rounded-t-3xl p-4 border-t border-muted">
        <div className="space-y-2">
          <button
            className="account-action-btn"
            onClick={() => {
              const accountName = `${account.bankName} •${cardNumber}`;
              navigate(`/transactions?account=${encodeURIComponent(accountName)}`);
            }}
          >
            <History className="text-muted-foreground" size={20} />
            <span className="ml-4">История операций</span>
          </button>

          <button className="account-action-btn">
            <Info className="text-muted-foreground" size={20} />
            <span className="ml-4">О текущем счёте</span>
          </button>

          <button className="account-action-btn">
            <CreditCard className="text-muted-foreground" size={20} />
            <span className="ml-4">Добавить карту к счёту</span>
          </button>

          <div className="account-action-btn">
            <FileText className="text-muted-foreground" size={20} />
            <div className="ml-4">
              <div>Открыть реквизиты</div>
              <div className="text-muted-foreground text-sm">
                Текущий счёт •{cardNumber}
              </div>
            </div>
          </div>

          <button className="account-action-btn">
            <Settings className="text-muted-foreground" size={20} />
            <span className="ml-4">Настроить счёт для переводов</span>
          </button>
        </div>
      </div>
    </div>
  );
}
