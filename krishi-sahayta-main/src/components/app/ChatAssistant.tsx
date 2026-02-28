import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Send, Mic, MicOff,
  Sparkles, Bot, ChevronRight,
} from "lucide-react";
import { FarmerProfile } from "@/types";
import { useLanguage } from "@/contexts/LanguageContext";

// ── Structured response types ──────────────────────────
interface TextSection { heading: string; type: "text"; content: string }
interface ListSection { heading: string; type: "list"; items: string[] }
interface TableSection { heading: string; type: "table"; rows: { label: string; value: string }[] }
interface StepsSection { heading: string; type: "steps"; items: string[] }
type Section = TextSection | ListSection | TableSection | StepsSection;

interface StructuredReply {
  title: string;
  summary: string;
  sections: Section[];
  tip?: string;
}

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;           // plain text (for user messages)
  structured?: StructuredReply; // parsed JSON (for assistant messages)
  timestamp: Date;
}

interface ChatAssistantProps {
  schemes: any[];
  profile: FarmerProfile;
}

// Web Speech API typings
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

// ── Render a single structured section ──────────────────
const RenderSection = ({ section }: { section: Section }) => {
  switch (section.type) {
    case "text":
      return (
        <div className="mb-3">
          {section.heading && <p className="font-semibold text-sm text-primary mb-1">{section.heading}</p>}
          <p className="text-sm text-foreground/90 whitespace-pre-line">{section.content}</p>
        </div>
      );
    case "list":
      return (
        <div className="mb-3">
          {section.heading && <p className="font-semibold text-sm text-primary mb-1">{section.heading}</p>}
          <ul className="space-y-1 pl-1">
            {section.items.map((item, i) => (
              <li key={i} className="text-sm text-foreground/90 flex gap-2 items-start">
                <span className="text-primary mt-0.5">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      );
    case "table":
      return (
        <div className="mb-3">
          {section.heading && <p className="font-semibold text-sm text-primary mb-1">{section.heading}</p>}
          <div className="rounded-lg overflow-hidden border border-border/50">
            {section.rows.map((row, i) => (
              <div key={i} className={`flex text-xs ${i % 2 === 0 ? "bg-muted/30" : ""}`}>
                <span className="font-medium px-2 py-1.5 w-1/3 text-foreground/70">{row.label}</span>
                <span className="px-2 py-1.5 flex-1 text-foreground/90">{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      );
    case "steps":
      return (
        <div className="mb-3">
          {section.heading && <p className="font-semibold text-sm text-primary mb-1">{section.heading}</p>}
          <ol className="space-y-1.5 pl-1">
            {section.items.map((item, i) => (
              <li key={i} className="text-sm text-foreground/90 flex gap-2 items-start">
                <span className="w-5 h-5 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center flex-shrink-0 mt-0.5 font-bold">{i + 1}</span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
        </div>
      );
    default:
      return null;
  }
};

// ── Render a full structured reply ──────────────────────
const StructuredMessage = ({ data }: { data: StructuredReply }) => (
  <div>
    {data.title && <p className="font-bold text-sm mb-1">{data.title}</p>}
    {data.summary && <p className="text-sm text-foreground/80 mb-2">{data.summary}</p>}
    {data.sections?.map((section, i) => (
      <RenderSection key={i} section={section} />
    ))}
    {data.tip && (
      <div className="mt-2 px-2 py-1.5 rounded-lg bg-accent/10 border border-accent/20 text-xs text-accent-foreground flex gap-1.5 items-start">
        <span>💡</span>
        <span>{data.tip}</span>
      </div>
    )}
  </div>
);

const ChatAssistant = ({ schemes, profile }: ChatAssistantProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { t, language } = useLanguage();

  const getWelcomeMsg = useCallback(() => {
    return t("chat.welcome", { count: schemes.length });
  }, [schemes.length, language]);

  const [messages, setMessages] = useState<Message[]>([
    { id: 1, role: "assistant", content: getWelcomeMsg(), timestamp: new Date() },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const quickQuestions = [
    t("chat.q1"),
    t("chat.q2"),
    t("chat.q3"),
    t("chat.q4"),
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (schemes.length > 0) {
      setMessages([{ id: 1, role: "assistant", content: getWelcomeMsg(), timestamp: new Date() }]);
    }
  }, [schemes.length, language]);

  // ─── Voice Input via Web Speech API ───
  const speechLangMap: Record<string, string> = { en: "en-IN", hi: "hi-IN", mr: "mr-IN" };

  const startListening = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = speechLangMap[language] || "en-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      setInputValue((prev) => prev + transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognition.start();
    recognitionRef.current = recognition;
    setIsListening(true);
  }, [language]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
  }, []);

  const toggleListening = () => isListening ? stopListening() : startListening();

  useEffect(() => {
    return () => { if (recognitionRef.current) recognitionRef.current.stop(); };
  }, []);

  // ─── AI Response ───
  const getAIResponse = async (
    history: { role: string; content: string }[]
  ): Promise<{ structured?: StructuredReply; raw: string }> => {
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history.map((m) => ({ role: m.role, content: m.content })),
          schemes,
          profile,
          language,
        }),
      });

      if (!response.ok) throw new Error("API request failed");
      const data = await response.json();

      if (data.reply && typeof data.reply === "object" && data.reply.sections) {
        return { structured: data.reply, raw: data.raw || "" };
      }
      // Fallback — reply is plain string (old format)
      return { raw: typeof data.reply === "string" ? data.reply : JSON.stringify(data.reply) };
    } catch (error) {
      console.error("Chat API error:", error);
      const lastMsg = history[history.length - 1]?.content || "";
      return { raw: getFallbackResponse(lastMsg) };
    }
  };

  const getFallbackResponse = (question: string): string => {
    const lowerQ = question.toLowerCase();
    if (lowerQ.includes("pm-kisan") || lowerQ.includes("kisan")) return t("chat.fallbackKisan");
    if (lowerQ.includes("document") || lowerQ.includes("कागज") || lowerQ.includes("कागदपत्र")) return t("chat.fallbackDocs");
    return t("chat.fallbackGeneral", { count: schemes.length });
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputValue("");
    setIsTyping(true);

    // Build conversation history for API (skip welcome message, include all turns)
    const chatHistory = updatedMessages
      .filter((m) => m.role === "user" || (m.role === "assistant" && m.content))
      .map((m) => ({
        role: m.role,
        content: m.structured
          ? (m.structured.summary || m.content)
          : m.content,
      }));

    const { structured, raw } = await getAIResponse(chatHistory);

    const response: Message = {
      id: messages.length + 2,
      role: "assistant",
      content: raw,
      structured,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, response]);
    setIsTyping(false);
  };

  const handleQuickQuestion = (question: string) => {
    setInputValue(question);
  };

  // Auto-send when inputValue is set by quick question
  useEffect(() => {
    if (inputValue && messages.length <= 2) {
      // Only auto-send for quick questions (when chat is fresh)
    }
  }, []);

  return (
    <>
      {/* Floating orb button */}
      <motion.button
        data-chat-trigger
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 ${isOpen ? "hidden" : "flex"}`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          className="relative"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            className="absolute inset-0 rounded-full bg-primary/30"
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-glow-lg">
            <Sparkles className="w-7 h-7 text-primary-foreground" />
          </div>
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-accent text-primary-foreground text-xs flex items-center justify-center font-bold">!</span>
        </motion.div>
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 w-[400px] max-w-[calc(100vw-48px)]"
          >
            <div className="glass-card overflow-hidden shadow-2xl rounded-2xl">
              {/* Header */}
              <div className="bg-gradient-to-r from-primary to-accent p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white">{t("chat.title")}</h3>
                      <p className="text-xs text-white/80">{t("chat.subtitle")}</p>
                    </div>
                  </div>
                  <motion.button
                    onClick={() => setIsOpen(false)}
                    className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>

              {/* Messages */}
              <div className="h-[380px] overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`max-w-[90%] rounded-2xl p-3 ${message.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-muted text-foreground rounded-bl-sm"
                      }`}>
                      {/* Render structured or plain text */}
                      {message.role === "assistant" && message.structured ? (
                        <StructuredMessage data={message.structured} />
                      ) : (
                        <p className="text-sm whitespace-pre-line">{message.content}</p>
                      )}
                      <span className={`text-xs mt-1 block ${message.role === "user" ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                        {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  </motion.div>
                ))}

                {isTyping && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                    <div className="bg-muted rounded-2xl px-4 py-3 rounded-bl-sm">
                      <div className="flex gap-1">
                        {[...Array(3)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="w-2 h-2 rounded-full bg-muted-foreground"
                            animate={{ scale: [1, 1.3, 1] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick questions */}
              {messages.length <= 2 && (
                <div className="px-4 pb-2">
                  <p className="text-xs text-muted-foreground mb-2">{t("chat.quickQ")}:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {quickQuestions.map((q) => (
                      <button
                        key={q}
                        onClick={() => handleQuickQuestion(q)}
                        className="text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors flex items-center gap-1"
                      >
                        <ChevronRight className="w-3 h-3" />
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="p-4 border-t border-border">
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSend()}
                      placeholder={t("chat.placeholder")}
                      className="w-full px-4 py-3 rounded-full bg-muted text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    />
                  </div>

                  <motion.button
                    onClick={toggleListening}
                    className={`w-11 h-11 rounded-full flex items-center justify-center transition-colors ${isListening ? "bg-red-500 text-white animate-pulse" : "bg-muted text-muted-foreground hover:text-foreground"}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title={isListening ? t("chat.stopVoice") : t("chat.startVoice")}
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </motion.button>

                  <motion.button
                    onClick={handleSend}
                    disabled={!inputValue.trim() || isTyping}
                    className="w-11 h-11 rounded-full bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-50"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Send className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatAssistant;
