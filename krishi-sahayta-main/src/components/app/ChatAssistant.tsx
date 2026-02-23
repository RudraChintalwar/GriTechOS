import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageCircle, X, Send, Mic, Volume2, 
  Sparkles, User, Bot, ChevronDown
} from "lucide-react";
import { FarmerProfile } from "@/pages/Dashboard";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatAssistantProps {
  schemes: any[];
  profile: FarmerProfile;
}

const quickQuestions = [
  "How do I apply for PM-KISAN?",
  "What documents do I need?",
  "When will I receive the benefit?",
  "Am I eligible for crop insurance?",
];

const ChatAssistant = ({ schemes, profile }: ChatAssistantProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "assistant",
      content: `नमस्ते! 🙏 I'm Krishi Saathi, your farming assistant. I found ${schemes.length} schemes for you. How can I help you today?`,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getAIResponse = (question: string): string => {
    const lowerQ = question.toLowerCase();
    
    if (lowerQ.includes("pm-kisan") || lowerQ.includes("kisan")) {
      return "To apply for PM-KISAN:\n\n1. Visit pmkisan.gov.in or your nearest CSC\n2. Carry Aadhaar card, bank passbook, and land records\n3. Fill the registration form\n4. Get your land verified by Patwari\n\nYou'll receive ₹2,000 every 4 months directly to your bank account!";
    }
    
    if (lowerQ.includes("document") || lowerQ.includes("कागज")) {
      return "For most schemes, you'll need:\n\n📄 Aadhaar Card\n📄 Bank Passbook (with Aadhaar linked)\n📄 Land Records (Khatauni/7/12)\n📄 Passport Photo\n📄 Caste Certificate (if applicable)\n\nWould you like specific documents for any scheme?";
    }
    
    if (lowerQ.includes("insurance") || lowerQ.includes("बीमा")) {
      return "Based on your profile, you're eligible for PMFBY (Crop Insurance).\n\n✅ Premium: Only 2% for Kharif, 1.5% for Rabi\n✅ Coverage: Full insured amount\n✅ Deadline: Before sowing season\n\nVisit your bank or CSC to enroll!";
    }
    
    if (lowerQ.includes("when") || lowerQ.includes("कब")) {
      return "Benefit timelines vary:\n\n💰 PM-KISAN: Every 4 months (April, August, December)\n🌾 PMFBY: Within 2 months of claim\n💳 KCC: Instant after approval\n\nWant to track a specific application?";
    }
    
    if (lowerQ.includes("apply") || lowerQ.includes("आवेदन")) {
      return "You can apply through:\n\n🏛️ CSC (Common Service Center) - Easiest option\n🌐 Official scheme portals online\n🏦 Your bank branch (for KCC, PMFBY)\n📱 Mobile apps where available\n\nNeed help with a specific scheme?";
    }
    
    return "I understand you're asking about government schemes. Based on your profile as a " + 
           profile.farmerType + " farmer in " + profile.state + 
           ", I've found " + schemes.length + " schemes for you.\n\n" +
           "You can ask me about:\n• How to apply\n• Required documents\n• Eligibility criteria\n• Benefit amounts\n\nHow can I help?";
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const response: Message = {
        id: messages.length + 2,
        role: "assistant",
        content: getAIResponse(inputValue),
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, response]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickQuestion = (question: string) => {
    setInputValue(question);
    setTimeout(() => handleSend(), 100);
  };

  return (
    <>
      {/* Floating orb button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className={`
          fixed bottom-6 right-6 z-50
          ${isOpen ? 'hidden' : 'flex'}
        `}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          className="relative"
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {/* Glow rings */}
          <motion.div
            className="absolute inset-0 rounded-full bg-primary/30"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-glow-lg">
            <Sparkles className="w-7 h-7 text-primary-foreground" />
          </div>
          
          {/* Notification badge */}
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-accent text-primary-foreground text-xs flex items-center justify-center font-bold">
            !
          </span>
        </motion.div>
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-48px)]"
          >
            <div className="glass-card overflow-hidden shadow-2xl">
              {/* Header */}
              <div className="bg-gradient-to-r from-primary to-accent p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white">Krishi Saathi</h3>
                      <p className="text-xs text-white/80">Your farming assistant</p>
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
              <div className="h-80 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`
                      max-w-[85%] rounded-2xl p-3
                      ${message.role === "user" 
                        ? "bg-primary text-primary-foreground rounded-br-sm" 
                        : "bg-muted text-foreground rounded-bl-sm"
                      }
                    `}>
                      <p className="text-sm whitespace-pre-line">{message.content}</p>
                      <span className={`text-xs mt-1 block ${message.role === "user" ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </motion.div>
                ))}

                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2"
                  >
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
                  <p className="text-xs text-muted-foreground mb-2">Quick questions:</p>
                  <div className="flex flex-wrap gap-2">
                    {quickQuestions.slice(0, 2).map((q) => (
                      <button
                        key={q}
                        onClick={() => handleQuickQuestion(q)}
                        className="text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                      >
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
                      placeholder="Ask about schemes..."
                      className="w-full px-4 py-3 rounded-full bg-muted text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  
                  <motion.button
                    onClick={() => setIsListening(!isListening)}
                    className={`
                      w-12 h-12 rounded-full flex items-center justify-center transition-colors
                      ${isListening ? 'bg-red-500 text-white' : 'bg-muted text-muted-foreground hover:text-foreground'}
                    `}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isListening ? <Volume2 className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  </motion.button>
                  
                  <motion.button
                    onClick={handleSend}
                    disabled={!inputValue.trim()}
                    className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-50"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Send className="w-5 h-5" />
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
