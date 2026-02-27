import { motion } from "framer-motion";
import { useState } from "react";
import { Globe, Mic, Volume2, MessageCircle } from "lucide-react";
import ScrollReveal from "../ScrollReveal";
import FloatingCard from "../FloatingCard";
import { useLanguage } from "@/contexts/LanguageContext";

const languages = [
  { code: "en", name: "English", native: "English" },
  { code: "hi", name: "Hindi", native: "हिंदी" },
  { code: "mr", name: "Marathi", native: "मराठी" },
  { code: "ta", name: "Tamil", native: "தமிழ்" },
  { code: "te", name: "Telugu", native: "తెలుగు" },
  { code: "bn", name: "Bengali", native: "বাংলা" },
  { code: "gu", name: "Gujarati", native: "ગુજરાતી" },
  { code: "kn", name: "Kannada", native: "ಕನ್ನಡ" },
];

const greetings: Record<string, string> = {
  en: "Hello! How can I help you today?",
  hi: "नमस्ते! आप किस प्रकार की सहायता चाहते हैं?",
  mr: "नमस्कार! मी तुम्हाला कशी मदत करू शकतो?",
  ta: "வணக்கம்! நான் உங்களுக்கு எப்படி உதவ முடியும்?",
  te: "నమస్కారం! నేను మీకు ఎలా సహాయం చేయగలను?",
  bn: "নমস্কার! আমি আপনাকে কীভাবে সাহায্য করতে পারি?",
  gu: "નમસ્તે! હું તમને કેવી રીતે મદદ કરી શકું?",
  kn: "ನಮಸ್ಕಾರ! ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?",
};

const VoiceSection = () => {
  const [selectedLang, setSelectedLang] = useState("hi");
  const [isListening, setIsListening] = useState(false);
  const { t } = useLanguage();

  return (
    <section className="relative py-32 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />

      {/* Floating orbs */}
      <motion.div
        className="absolute top-20 left-10 w-64 h-64 rounded-full bg-primary/10 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-accent/10 blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <div className="relative z-10 container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Content */}
          <ScrollReveal direction="left">
            <div className="space-y-8">
              <motion.div
                className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full"
                whileHover={{ scale: 1.05 }}
              >
                <Globe className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">
                  {t("voice.badge")}
                </span>
              </motion.div>

              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display">
                <span className="text-foreground">{t("voice.heading1")}</span>
                <span className="text-gradient">{t("voice.heading2")}</span>
                <br />
                <span className="text-foreground">{t("voice.heading3")}</span>
                <span className="text-muted-foreground">
                  {t("voice.heading4")}
                </span>
              </h2>

              <p className="text-xl text-muted-foreground max-w-lg">
                {t("voice.paragraph")}
              </p>

              {/* Language selector */}
              <div className="flex flex-wrap gap-2">
                {languages.map((lang) => (
                  <motion.button
                    key={lang.code}
                    onClick={() => setSelectedLang(lang.code)}
                    className={`
                      px-4 py-2 rounded-full text-sm font-medium transition-all
                      ${
                        selectedLang === lang.code
                          ? "bg-primary text-primary-foreground shadow-glow"
                          : "glass-card text-muted-foreground hover:text-foreground"
                      }
                    `}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {lang.native}
                  </motion.button>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Right: Voice demo */}
          <ScrollReveal direction="right" delay={0.2}>
            <div className="relative">
              {/* Voice orb */}
              <motion.div
                className="relative mx-auto w-64 h-64"
                animate={isListening ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 1, repeat: Infinity }}
              >
                {/* Outer glow rings */}
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute inset-0 rounded-full border border-primary/20"
                    animate={{
                      scale: isListening ? [1, 1.5 + i * 0.3] : 1,
                      opacity: isListening ? [0.5, 0] : 0.2,
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.3,
                    }}
                  />
                ))}

                {/* Main orb */}
                <motion.button
                  onClick={() => setIsListening(!isListening)}
                  className={`
                    absolute inset-8 rounded-full flex items-center justify-center
                    transition-all duration-300
                    ${
                      isListening
                        ? "bg-gradient-accent shadow-glow-lg"
                        : "glass-card hover:shadow-glow"
                    }
                  `}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isListening ? (
                    <Volume2 className="w-16 h-16 text-primary-foreground" />
                  ) : (
                    <Mic className="w-16 h-16 text-primary" />
                  )}
                </motion.button>

                {/* Voice waveform */}
                {isListening && (
                  <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-1">
                    {[...Array(9)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-1 bg-primary rounded-full"
                        animate={{
                          height: [12, 32, 16, 48, 12],
                        }}
                        transition={{
                          duration: 0.8,
                          repeat: Infinity,
                          delay: i * 0.1,
                        }}
                      />
                    ))}
                  </div>
                )}
              </motion.div>

              {/* Demo text */}
              <motion.p
                className="text-center mt-20 text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {isListening ? (
                  <span className="text-primary">{t("voice.listening")}</span>
                ) : (
                  t("voice.tapToStart")
                )}
              </motion.p>

              {/* Sample conversation */}
              <FloatingCard className="mt-8 p-4" delay={0.3}>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <MessageCircle className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {t("voice.botName")}
                    </p>
                    <p className="text-foreground">
                      {greetings[selectedLang] || greetings["en"]}
                    </p>
                  </div>
                </div>
              </FloatingCard>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default VoiceSection;
