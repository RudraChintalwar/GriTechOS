import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowDown, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Scene3D from "../Scene3D";
import ParticleField from "../ParticleField";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";

const HeroSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);

  const problemCards = [
    { text: t("hero.problem1"), delay: 0 },
    { text: t("hero.problem2"), delay: 0.2 },
    { text: t("hero.problem3"), delay: 0.4 },
    { text: t("hero.problem4"), delay: 0.6 },
    { text: t("hero.problem5"), delay: 0.8 },
  ];

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background layers */}
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="noise-overlay" />
      <ParticleField />
      <Scene3D />

      {/* Radial glow */}
      <div className="absolute inset-0 bg-gradient-glow pointer-events-none" />

      {/* Animated grid lines */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(to right, hsl(var(--primary) / 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--primary) / 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }} />
      </div>

      <motion.div
        style={{ y, opacity, scale }}
        className="relative z-10 container mx-auto px-4 text-center"
      >
        {/* Floating problem cards */}
        <div className="absolute inset-0 pointer-events-none">
          {problemCards.map((card, index) => (
            <motion.div
              key={card.text}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{
                opacity: [0, 1, 1, 0],
                scale: [0.5, 1, 1, 0.5],
                x: Math.sin(index * 1.5) * 200,
                y: Math.cos(index * 1.5) * 100,
              }}
              transition={{
                duration: 4,
                delay: card.delay,
                repeat: Infinity,
                repeatDelay: 2,
              }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${30 + (index % 3) * 20}%`,
                top: `${20 + Math.floor(index / 2) * 30}%`,
              }}
            >
              <div className="glass-card px-6 py-3 text-muted-foreground text-sm font-medium glitch">
                {card.text}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="space-y-8"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">
              {t("hero.badge")}
            </span>
          </motion.div>

          {/* Main headline */}
          <div className="space-y-4">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-5xl md:text-7xl lg:text-8xl font-bold font-display leading-tight"
            >
              <span className="text-foreground">{t("hero.title1")}</span>
              <br />
              <span className="text-gradient">
                {t("hero.title2")}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto"
            >
              {t("hero.subtitle")}
            </motion.p>
          </div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8"
          >
            <motion.button
              onClick={() => navigate(user ? "/app" : "/auth")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="btn-hero group"
            >
              <span className="relative z-10 flex items-center gap-2">
                {t("hero.cta")}
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.span>
              </span>
            </motion.button>

            {user && (
              <motion.button
                onClick={() => navigate("/profile")}
                className="px-8 py-4 rounded-full glass-card hover:bg-white/10 text-foreground font-semibold flex items-center gap-2 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                {t("profile.updateProfile")}
              </motion.button>
            )}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center gap-2 text-muted-foreground"
          >
            <span className="text-sm">{t("hero.scroll")}</span>
            <ArrowDown className="w-5 h-5" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
