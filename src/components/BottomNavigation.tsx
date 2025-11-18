import { Home, CreditCard, BarChart2, MessageSquare, PlusCircle } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useTelegram } from "@/hooks/useTelegram";

export default function BottomNavigation() {
  const location = useLocation();
  const { TG } = useTelegram();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const vibrate = () => {
    try {
      TG.HapticFeedback.impactOccurred("light");
    } catch (e) {
      console.warn("Haptic feedback not supported or failed:", e);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 bg-background border-t border-border flex items-center justify-around px-2 pb-6 z-40">
      <Link
        to="/"
        onClick={vibrate}
        className={`flex flex-col items-center justify-center w-16 py-1 ${
          isActive("/") ? "text-primary" : "text-muted-foreground"
        }`}
      >
        <Home size={30} />
      </Link>

      <Link
        to="/accounts"
        onClick={vibrate}
        className={`flex flex-col items-center justify-center w-16 py-1 ${
          isActive("/accounts") ? "text-primary" : "text-muted-foreground"
        }`}
      >
        <CreditCard size={32} />
      </Link>

      <div className="relative -mt-10">
        <button
          onClick={vibrate}
          className="w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-md"
        >
          <PlusCircle size={32} className="text-white" />
        </button>
      </div>

      <Link
        to="/chat"
        onClick={vibrate}
        className={`flex flex-col items-center justify-center w-16 py-1 ${
          isActive("/chat") ? "text-primary" : "text-muted-foreground"
        }`}
      >
        <MessageSquare size={32} />
      </Link>

      <Link
        to="/analytics"
        onClick={vibrate}
        className={`flex flex-col items-center justify-center w-16 py-1 ${
          isActive("/analytics") ? "text-primary" : "text-muted-foreground"
        }`}
      >
        <BarChart2 size={32} />
      </Link>
    </div>
  );
}
