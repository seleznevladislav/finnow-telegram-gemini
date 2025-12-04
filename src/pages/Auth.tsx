import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Fingerprint, AlertCircle, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useTelegram } from "@/hooks/useTelegram";

export default function Auth() {
  const navigate = useNavigate();
  const { TG } = useTelegram();
  const { login, loginWithBiometrics, setupPin, hasPin, hasBiometrics, isAuthenticated } = useAuth();

  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [isSettingUp, setIsSettingUp] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    TG.ready();
    TG.expand();

    // Если нет PIN, переходим в режим настройки
    if (!hasPin) {
      setIsSettingUp(true);
    }
  }, [TG, hasPin]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handlePinInput = (digit: string) => {
    if (isSettingUp) {
      if (pin.length < 4) {
        setPin(pin + digit);
        TG.HapticFeedback?.impactOccurred("light");
      } else if (confirmPin.length < 4) {
        const newConfirmPin = confirmPin + digit;
        setConfirmPin(newConfirmPin);
        TG.HapticFeedback?.impactOccurred("light");

        // Проверяем совпадение после ввода 4-го символа
        if (newConfirmPin.length === 4) {
          if (pin === newConfirmPin) {
            setupPin(pin);
            TG.HapticFeedback?.notificationOccurred("success");
            navigate("/");
          } else {
            setError("PIN-коды не совпадают");
            setShake(true);
            setTimeout(() => {
              setPin("");
              setConfirmPin("");
              setError("");
              setShake(false);
            }, 1000);
            TG.HapticFeedback?.notificationOccurred("error");
          }
        }
      }
    } else {
      if (pin.length < 4) {
        const newPin = pin + digit;
        setPin(newPin);
        TG.HapticFeedback?.impactOccurred("light");

        // Проверяем PIN после ввода 4-го символа
        if (newPin.length === 4) {
          if (login(newPin)) {
            TG.HapticFeedback?.notificationOccurred("success");
            navigate("/");
          } else {
            setError("Неверный PIN-код");
            setShake(true);
            setTimeout(() => {
              setPin("");
              setError("");
              setShake(false);
            }, 1000);
            TG.HapticFeedback?.notificationOccurred("error");
          }
        }
      }
    }
  };

  const handleDelete = () => {
    if (isSettingUp && confirmPin.length > 0) {
      setConfirmPin(confirmPin.slice(0, -1));
    } else if (pin.length > 0) {
      setPin(pin.slice(0, -1));
    }
    TG.HapticFeedback?.impactOccurred("light");
  };

  const handleBiometricAuth = async () => {
    setIsLoading(true);
    TG.HapticFeedback?.impactOccurred("medium");

    const success = await loginWithBiometrics();

    if (success) {
      TG.HapticFeedback?.notificationOccurred("success");
      navigate("/");
    } else {
      setError("Ошибка биометрической аутентификации");
      TG.HapticFeedback?.notificationOccurred("error");
      setTimeout(() => setError(""), 2000);
    }

    setIsLoading(false);
  };

  const getCurrentPin = () => {
    if (isSettingUp) {
      return pin.length < 4 ? pin : confirmPin;
    }
    return pin;
  };

  const currentPinLength = getCurrentPin().length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-finance-blue/10 via-background to-finance-purple/10 flex flex-col items-center justify-center p-6">
      {/* Logo */}
      <div className="mb-12 text-center">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-finance-blue to-finance-purple flex items-center justify-center shadow-xl">
          <Lock size={40} className="text-white" />
        </div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-finance-blue to-finance-purple bg-clip-text text-transparent">
          Finnow
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {isSettingUp
            ? pin.length < 4
              ? "Создайте PIN-код"
              : "Повторите PIN-код"
            : "Введите PIN-код"}
        </p>
      </div>

      {/* PIN Display */}
      <div className={`mb-8 ${shake ? 'animate-shake' : ''}`}>
        <div className="flex gap-4 justify-center">
          {[0, 1, 2, 3].map((index) => (
            <div
              key={index}
              className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
                index < currentPinLength
                  ? "bg-gradient-to-r from-finance-blue to-finance-purple border-finance-blue scale-110"
                  : "border-muted-foreground/30"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 flex items-center gap-2 text-finance-red text-sm animate-fade-in">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Biometric Button */}
      {hasBiometrics && !isSettingUp && (
        <Button
          variant="outline"
          onClick={handleBiometricAuth}
          disabled={isLoading}
          className="mb-8 neumorph flex items-center gap-2"
        >
          <Fingerprint size={20} className="text-finance-purple" />
          <span>{isLoading ? "Проверка..." : "Войти с Face ID"}</span>
        </Button>
      )}

      {/* PIN Pad */}
      <div className="w-full max-w-xs">
        <div className="grid grid-cols-3 gap-4 mb-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
            <button
              key={digit}
              onClick={() => handlePinInput(digit.toString())}
              className="neumorph h-16 rounded-2xl font-semibold text-lg transition-all active:scale-95 hover:bg-muted/50"
            >
              {digit}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div />
          <button
            onClick={() => handlePinInput("0")}
            className="neumorph h-16 rounded-2xl font-semibold text-lg transition-all active:scale-95 hover:bg-muted/50"
          >
            0
          </button>
          <button
            onClick={handleDelete}
            className="neumorph h-16 rounded-2xl font-semibold text-lg transition-all active:scale-95 hover:bg-muted/50 flex items-center justify-center"
          >
            ⌫
          </button>
        </div>
      </div>

      {/* Setup Progress */}
      {isSettingUp && pin.length === 4 && confirmPin.length === 4 && pin === confirmPin && (
        <div className="mt-8 flex items-center gap-2 text-finance-green text-sm animate-fade-in">
          <Check size={16} />
          <span>PIN-код создан!</span>
        </div>
      )}
    </div>
  );
}
