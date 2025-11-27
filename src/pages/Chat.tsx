import { useState, useRef, useEffect } from "react";
import {
  Send,
  Sparkles,
  TrendingUp,
  Wallet,
  CreditCard,
  AlertCircle,
  Lightbulb,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTelegram } from "@/hooks/useTelegram";
import { getChatResponse } from "@/services/ai";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const STORAGE_KEY = "finnow_chat_history";

// Загрузка истории из localStorage
const loadChatHistory = (userName?: string): Message[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Восстанавливаем Date объекты
      return parsed.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      }));
    }
  } catch (error) {
    console.error("Error loading chat history:", error);
  }

  // Возвращаем приветственное сообщение по умолчанию
  return [
    {
      id: "welcome",
      role: "assistant",
      content: `Привет, ${userName || "друг"}! 👋 Я ваш финансовый помощник. Могу помочь с:\n\n• Анализом трат и доходов\n• Советами по оптимизации бюджета\n• Выбором карты для покупок\n• Прогнозом расходов\n\nЗадайте мне любой вопрос!`,
      timestamp: new Date(),
    },
  ];
};

// Сохранение истории в localStorage
const saveChatHistory = (messages: Message[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  } catch (error) {
    console.error("Error saving chat history:", error);
  }
};

export default function Chat() {
  const { TG, user } = useTelegram();
  const [messages, setMessages] = useState<Message[]>(() =>
    loadChatHistory(user?.first_name)
  );
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Сохраняем историю при изменении сообщений
  useEffect(() => {
    saveChatHistory(messages);
  }, [messages]);

  useEffect(() => {
    TG.ready();

    // Расширяем viewport на весь экран для корректной работы с клавиатурой
    if (TG.expand && typeof TG.expand === 'function') {
      try {
        TG.expand();
      } catch (e) {
        console.log('expand not supported');
      }
    }

    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, TG]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      TG.HapticFeedback?.impactOccurred("light");

      // Получаем AI ответ
      const aiResponse = await getChatResponse(input.trim(), messages);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: aiResponse,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      TG.HapticFeedback?.notificationOccurred("success");
    } catch (error) {
      console.error("Error getting AI response:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Извините, произошла ошибка. Попробуйте еще раз.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      TG.HapticFeedback?.notificationOccurred("error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (question: string) => {
    setInput(question);
  };

  const quickActions = [
    {
      icon: <TrendingUp size={18} />,
      label: "Анализ расходов",
      question: "Проанализируй мои расходы за месяц",
      color: "text-finance-blue",
    },
    {
      icon: <CreditCard size={18} />,
      label: "Лучшая карта",
      question: "С какой карты лучше оплатить обед в ресторане?",
      color: "text-finance-purple",
    },
    {
      icon: <Wallet size={18} />,
      label: "Советы по экономии",
      question: "Как мне сэкономить деньги?",
      color: "text-finance-green",
    },
    {
      icon: <AlertCircle size={18} />,
      label: "Прогноз бюджета",
      question: "Хватит ли мне денег до конца месяца?",
      color: "text-finance-yellow",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen max-h-screen">
      {/* Header */}
      <div className="flex-shrink-0 sticky top-0 z-30 bg-background px-4 pt-20 pb-3 flex items-center justify-between border-b border-border">
        <div className="flex items-center">
          <Sparkles size={20} className="text-finance-purple mr-2" />
          <h1 className="text-xl font-semibold">AI Помощник</h1>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar pb-40">
        {messages.length === 1 && (
          <div className="mb-6">
            <p className="text-sm text-muted-foreground mb-3 text-center">
              Попробуйте быстрые вопросы:
            </p>
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((action, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickAction(action.question)}
                  className="neumorph p-3 flex flex-col items-start text-left transition-all hover:scale-[1.02]"
                >
                  <div className={`mb-1 ${action.color}`}>{action.icon}</div>
                  <span className="text-xs font-medium">{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                message.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "neumorph"
              }`}
            >
              {message.role === "assistant" && (
                <div className="flex items-center mb-2">
                  <Lightbulb size={16} className="text-finance-purple mr-1" />
                  <span className="text-xs font-medium text-finance-purple">
                    AI Советник
                  </span>
                </div>
              )}
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              <p
                className={`text-xs mt-1 ${
                  message.role === "user"
                    ? "text-primary-foreground/70"
                    : "text-muted-foreground"
                }`}
              >
                {message.timestamp.toLocaleTimeString("ru-RU", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="neumorph max-w-[80%] rounded-2xl px-4 py-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-finance-purple rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-finance-purple rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-finance-purple rounded-full animate-bounce"
                  style={{ animationDelay: "0.4s" }}
                ></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area - над контентом, но под навигацией */}
      <div className="fixed bottom-20 left-0 right-0 z-30 bg-background border-t border-border p-4 max-w-md mx-auto">
        <div className="flex items-end space-x-2">
          <div className="flex-1 neumorph-inset rounded-2xl px-4 py-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Задайте вопрос..."
              className="bg-transparent border-none outline-none w-full text-sm text-foreground placeholder:text-foreground/60 resize-none"
              rows={1}
              disabled={isLoading}
            />
          </div>
          <Button
            size="icon"
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoading}
            className="rounded-full h-10 w-10"
          >
            <Send size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
}
