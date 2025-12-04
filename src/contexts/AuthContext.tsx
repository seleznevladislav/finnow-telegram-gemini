import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  hasBiometrics: boolean;
  login: (pin: string) => boolean;
  loginWithBiometrics: () => Promise<boolean>;
  logout: () => void;
  setupPin: (pin: string) => void;
  hasPin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY_PIN = "finnow_pin";
const STORAGE_KEY_AUTH = "finnow_authenticated";
const STORAGE_KEY_BIOMETRICS = "finnow_biometrics_enabled";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasPin, setHasPin] = useState(false);
  const [hasBiometrics, setHasBiometrics] = useState(false);

  useEffect(() => {
    // Проверяем наличие PIN
    const storedPin = localStorage.getItem(STORAGE_KEY_PIN);
    setHasPin(!!storedPin);

    // Проверяем поддержку биометрии
    const checkBiometrics = async () => {
      // Проверяем наличие Web Authentication API
      if (window.PublicKeyCredential) {
        try {
          const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
          const biometricsEnabled = localStorage.getItem(STORAGE_KEY_BIOMETRICS) === "true";
          setHasBiometrics(available && biometricsEnabled);
        } catch (error) {
          console.log("Biometrics not available:", error);
          setHasBiometrics(false);
        }
      }
    };

    checkBiometrics();

    // Сбрасываем авторизацию при загрузке (для безопасности)
    localStorage.removeItem(STORAGE_KEY_AUTH);
    setIsAuthenticated(false);
  }, []);

  const login = (pin: string): boolean => {
    const storedPin = localStorage.getItem(STORAGE_KEY_PIN);
    if (storedPin === pin) {
      setIsAuthenticated(true);
      localStorage.setItem(STORAGE_KEY_AUTH, "true");
      return true;
    }
    return false;
  };

  const loginWithBiometrics = async (): Promise<boolean> => {
    try {
      // Симуляция биометрической аутентификации
      // В продакшене здесь был бы реальный вызов Web Authentication API
      return new Promise((resolve) => {
        setTimeout(() => {
          setIsAuthenticated(true);
          localStorage.setItem(STORAGE_KEY_AUTH, "true");
          resolve(true);
        }, 1000);
      });
    } catch (error) {
      console.error("Biometric authentication failed:", error);
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem(STORAGE_KEY_AUTH);
  };

  const setupPin = (pin: string) => {
    localStorage.setItem(STORAGE_KEY_PIN, pin);
    localStorage.setItem(STORAGE_KEY_BIOMETRICS, "true");
    setHasPin(true);
    setHasBiometrics(true);
    setIsAuthenticated(true);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        hasBiometrics,
        login,
        loginWithBiometrics,
        logout,
        setupPin,
        hasPin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
