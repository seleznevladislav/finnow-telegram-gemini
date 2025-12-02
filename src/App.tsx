
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Accounts from "./pages/Accounts";
import AccountDetail from "./pages/AccountDetail";
import Transactions from "./pages/Transactions";
import Analytics from "./pages/Analytics";
import Chat from "./pages/Chat";
import Investments from "./pages/Investments";
import BottomNavigation from "./components/BottomNavigation";
import { useTelegram } from "./hooks/useTelegram";
import { logUserLogin, createLoginEvent } from "./services/logger";
import { InvestmentProvider } from "./contexts/InvestmentContext";

const queryClient = new QueryClient();

const App = () => {
  const { isMobile, TG, user, platform } = useTelegram();

  useEffect(() => {
    // Отключаем вертикальные свайпы, чтобы приложение не закрывалось при свайпе вниз
    // Это особенно важно для Mini App, которые имеют свои скроллируемые области
    if (TG?.disableVerticalSwipes) {
      TG.disableVerticalSwipes();
      console.log('🔒 Вертикальные свайпы отключены - приложение не будет закрываться при свайпе вниз');
    }

    // Cleanup: при размонтировании компонента можно включить свайпы обратно (опционально)
    // return () => {
    //   if (TG?.enableVerticalSwipes) {
    //     TG.enableVerticalSwipes();
    //   }
    // };
  }, [TG]);

  // Логирование входа пользователя в Google Sheets
  useEffect(() => {
    if (user) {
      const loginEvent = createLoginEvent(user, platform, isMobile);
      logUserLogin(loginEvent);
      console.log('📊 Событие входа пользователя залогировано:', {
        userId: user.id,
        username: user.username,
        platform,
      });
    }
  }, [user, platform, isMobile]);

  return (
    <QueryClientProvider client={queryClient}>
      <InvestmentProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className={`max-w-md mx-auto min-h-screen pb-16 routeContainer ${isMobile ? 'pt-20' : ''}`}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/accounts" element={<Accounts />} />
                <Route path="/accounts/:id" element={<AccountDetail />} />
                <Route path="/transactions" element={<Transactions />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/investments" element={<Investments />} />

                {/* Add redirects for invalid routes */}
                <Route path="/404" element={<NotFound />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
              <BottomNavigation />
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </InvestmentProvider>
    </QueryClientProvider>
  );
};

export default App;
