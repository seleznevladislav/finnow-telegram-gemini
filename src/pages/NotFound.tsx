
import { useLocation, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "@/components/ui/use-toast";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
    
    // Show toast notification
    toast({
      title: "Страница не найдена",
      description: "Перенаправление на главную страницу",
      variant: "destructive",
    });
  }, [location.pathname]);

  // Instead of showing 404 page, redirect to the dashboard
  return <Navigate to="/" replace />;
};

export default NotFound;
