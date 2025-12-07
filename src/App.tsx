
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Accounts from "./pages/Accounts";
import AccountDetail from "./pages/AccountDetail";
import Transactions from "./pages/Transactions";
import Analytics from "./pages/Analytics";
import Chat from "./pages/Chat";
import Investments from "./pages/Investments";
import Auth from "./pages/Auth";
import BottomNavigation from "./components/BottomNavigation";
import ProtectedRoute from "./components/ProtectedRoute";
import { useTelegram } from "./hooks/useTelegram";
import { logUserLogin, createLoginEvent } from "./services/logger";
import { InvestmentProvider } from "./contexts/InvestmentContext";
import { AuthProvider } from "./contexts/AuthContext";
import { TransactionProvider } from "./contexts/TransactionContext";

const queryClient = new QueryClient();

function NavigationWrapper() {
  const location = useLocation();
  const shouldShowNavigation = location.pathname !== '/auth';

  if (!shouldShowNavigation) return null;
  return <BottomNavigation />;
}

function AppContent() {
  const location = useLocation();
  const { isMobile } = useTelegram();
  const isAuthPage = location.pathname === '/auth';

  // Автоматически скроллим вверх при переходе на новую страницу
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  return (
    <div className={`max-w-md mx-auto min-h-screen ${isAuthPage ? '' : 'pb-16 routeContainer'} ${isMobile && !isAuthPage ? 'pt-20' : ''}`}>
      <Routes>
        {/* Auth Route - доступен без авторизации */}
        <Route path="/auth" element={<Auth />} />

        {/* Protected Routes - требуют авторизацию */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/accounts"
          element={
            <ProtectedRoute>
              <Accounts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/accounts/:id"
          element={
            <ProtectedRoute>
              <AccountDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/transactions"
          element={
            <ProtectedRoute>
              <Transactions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />
        <Route
          path="/investments"
          element={
            <ProtectedRoute>
              <Investments />
            </ProtectedRoute>
          }
        />

        {/* Add redirects for invalid routes */}
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <NavigationWrapper />
    </div>
  );
}

const App = () => {
  const { TG, user, platform, isMobile } = useTelegram();

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
      <AuthProvider>
        <TransactionProvider>
          <InvestmentProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <AppContent />
              </BrowserRouter>
            </TooltipProvider>
          </InvestmentProvider>
        </TransactionProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
