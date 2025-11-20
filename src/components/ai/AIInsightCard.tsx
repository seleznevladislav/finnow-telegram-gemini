import { ReactNode } from "react";
import { Sparkles } from "lucide-react";

interface AIInsightCardProps {
  title: string;
  icon?: ReactNode;
  variant?: "default" | "success" | "warning" | "info";
  children: ReactNode;
  className?: string;
}

export default function AIInsightCard({
  title,
  icon,
  variant = "default",
  children,
  className = "",
}: AIInsightCardProps) {
  const iconBgStyles = {
    default: "bg-primary/10",
    success: "bg-finance-green/10",
    warning: "bg-finance-yellow/10",
    info: "bg-finance-blue/10",
  };

  const iconColorStyles = {
    default: "text-primary",
    success: "text-finance-green",
    warning: "text-finance-yellow",
    info: "text-finance-blue",
  };

  return (
    <div
      className={`financial-card ${className} animate-fade-in`}
    >
      <div className="flex items-start gap-3 mb-3">
        <div
          className={`w-10 h-10 rounded-full ${iconBgStyles[variant]} flex items-center justify-center shrink-0 animate-icon-pop`}
        >
          {icon || <Sparkles size={20} className={iconColorStyles[variant]} />}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={14} className={iconColorStyles[variant]} />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Персональный инсайт
            </span>
          </div>
          <h3 className="font-semibold text-base">{title}</h3>
        </div>
      </div>
      <div className="ml-13">{children}</div>
    </div>
  );
}
