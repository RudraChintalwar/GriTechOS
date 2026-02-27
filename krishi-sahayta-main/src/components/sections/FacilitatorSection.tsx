import { motion } from "framer-motion";
import { useState } from "react";
import { Users, UserCheck, Printer, Share2, ArrowRight } from "lucide-react";
import ScrollReveal from "../ScrollReveal";
import FloatingCard from "../FloatingCard";
import { useLanguage } from "@/contexts/LanguageContext";

const FacilitatorSection = () => {
  const { t } = useLanguage();
  const [activeMode, setActiveMode] = useState<"farmer" | "csc">("farmer");

  return (
    <section className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-earth" />

      <div className="relative z-10 container mx-auto px-4">
        {/* Header */}
        <ScrollReveal className="text-center mb-16">
          <motion.div
            className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <Users className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">
              {t("facilitator.badge")}
            </span>
          </motion.div>

          <h2 className="text-4xl md:text-6xl font-bold font-display mb-6">
            <span className="text-foreground">{t("facilitator.title1")}</span>
            <span className="text-gradient">{t("facilitator.title2")}</span>
          </h2>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t("facilitator.subtitle")}
          </p>
        </ScrollReveal>

        {/* Mode toggle */}
        <div className="flex justify-center mb-12">
          <div className="glass-card p-2 rounded-full inline-flex">
            <motion.button
              onClick={() => setActiveMode("farmer")}
              className={`
                px-6 py-3 rounded-full text-sm font-medium transition-all
                ${activeMode === "farmer"
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
                }
              `}
              whileTap={{ scale: 0.95 }}
            >
              {t("facilitator.farmerMode")}
            </motion.button>
            <motion.button
              onClick={() => setActiveMode("csc")}
              className={`
                px-6 py-3 rounded-full text-sm font-medium transition-all
                ${activeMode === "csc"
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
                }
              `}
              whileTap={{ scale: 0.95 }}
            >
              {t("facilitator.cscMode")}
            </motion.button>
          </div>
        </div>

        {/* Split screen demo */}
        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Farmer Mode Card */}
          <FloatingCard
            className={`p-8 transition-all duration-500 ${activeMode === "farmer" ? 'ring-2 ring-primary' : 'opacity-60'}`}
            delay={0.1}
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center">
                    <UserCheck className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold font-display text-foreground">{t("facilitator.farmerMode")}</h3>
                    <p className="text-sm text-muted-foreground">{t("facilitator.selfService")}</p>
                  </div>
                </div>
                {activeMode === "farmer" && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-3 h-3 rounded-full bg-primary"
                  />
                )}
              </div>

              <div className="space-y-4">
                <div className="glass-card p-4 rounded-xl">
                  <p className="text-sm text-muted-foreground mb-2">{t("facilitator.touchTargets")}</p>
                  <div className="flex gap-2">
                    {["🌾", "🌽", "🍚"].map((emoji) => (
                      <motion.div
                        key={emoji}
                        className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center text-2xl"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {emoji}
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="glass-card p-4 rounded-xl">
                  <p className="text-sm text-muted-foreground mb-2">{t("facilitator.voiceNav")}</p>
                  <div className="flex items-center gap-2">
                    <div className="h-2 flex-1 rounded-full bg-primary/20">
                      <motion.div
                        className="h-full rounded-full bg-primary"
                        initial={{ width: 0 }}
                        animate={{ width: activeMode === "farmer" ? "70%" : "0%" }}
                        transition={{ duration: 1 }}
                      />
                    </div>
                    <span className="text-xs text-primary">{t("voice.listening")}</span>
                  </div>
                </div>

                <div className="glass-card p-4 rounded-xl">
                  <p className="text-sm text-muted-foreground mb-2">{t("facilitator.simpleLang")}</p>
                  <p className="text-foreground">"आपको प्रति वर्ष ₹6,000 मिलेंगे"</p>
                </div>
              </div>
            </div>
          </FloatingCard>

          {/* CSC Mode Card */}
          <FloatingCard
            className={`p-8 transition-all duration-500 ${activeMode === "csc" ? 'ring-2 ring-primary' : 'opacity-60'}`}
            delay={0.2}
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold font-display text-foreground">{t("facilitator.cscMode")}</h3>
                    <p className="text-sm text-muted-foreground">{t("facilitator.assisted")}</p>
                  </div>
                </div>
                {activeMode === "csc" && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-3 h-3 rounded-full bg-primary"
                  />
                )}
              </div>

              <div className="space-y-4">
                <div className="glass-card p-4 rounded-xl">
                  <p className="text-sm text-muted-foreground mb-2">{t("facilitator.batch")}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-foreground font-medium">12 {t("facilitator.farmers")}</span>
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground font-medium">47 {t("facilitator.schemes")}</span>
                  </div>
                </div>

                <div className="glass-card p-4 rounded-xl">
                  <p className="text-sm text-muted-foreground mb-2">{t("facilitator.quickActions")}</p>
                  <div className="flex gap-2">
                    <motion.button
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted text-foreground text-sm"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Printer className="w-4 h-4" />
                      {t("facilitator.print")}
                    </motion.button>
                    <motion.button
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted text-foreground text-sm"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Share2 className="w-4 h-4" />
                      {t("facilitator.share")}
                    </motion.button>
                  </div>
                </div>

                <div className="glass-card p-4 rounded-xl">
                  <p className="text-sm text-muted-foreground mb-2">{t("facilitator.summary")}</p>
                  <div className="border border-border rounded-lg p-3 bg-background/50">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">{t("facilitator.farmerId")}</span>
                      <span className="text-foreground">MH-2024-001</span>
                    </div>
                    <div className="flex justify-between text-xs mt-1">
                      <span className="text-muted-foreground">{t("facilitator.eligible")}</span>
                      <span className="text-primary font-bold">5</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FloatingCard>
        </div>
      </div>
    </section>
  );
};

export default FacilitatorSection;
