import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { TrendingUp, Droplets, Shield, Sprout } from "lucide-react";
import ScrollReveal from "../ScrollReveal";
import AnimatedCounter from "../AnimatedCounter";
import { useLanguage } from "@/contexts/LanguageContext";

const ImpactSection = () => {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const [sliderValue, setSliderValue] = useState(50);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  const metrics = [
    {
      icon: TrendingUp,
      label: t("impact.incomeLabel"),
      value: 40,
      suffix: "%",
      color: "from-emerald-500 to-green-500",
      description: t("impact.incomeDesc"),
    },
    {
      icon: Shield,
      label: t("impact.riskLabel"),
      value: 60,
      suffix: "%",
      color: "from-blue-500 to-cyan-500",
      description: t("impact.riskDesc"),
    },
    {
      icon: Sprout,
      label: t("impact.yieldLabel"),
      value: 25,
      suffix: "%",
      color: "from-lime-500 to-emerald-500",
      description: t("impact.yieldDesc"),
    },
    {
      icon: Droplets,
      label: t("impact.waterLabel"),
      value: 35,
      suffix: "%",
      color: "from-cyan-500 to-blue-500",
      description: t("impact.waterDesc"),
    },
  ];

  return (
    <section ref={containerRef} className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />

      {/* Radial glow */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, hsl(var(--primary) / 0.1) 0%, transparent 70%)",
          scale,
          opacity,
        }}
      />

      <div className="relative z-10 container mx-auto px-4">
        {/* Header */}
        <ScrollReveal className="text-center mb-16">
          <motion.div
            className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">
              {t("impact.badge")}
            </span>
          </motion.div>

          <h2 className="text-4xl md:text-6xl font-bold font-display mb-6">
            <span className="text-foreground">{t("impact.heading1")}</span>
            <span className="text-gradient">{t("impact.heading2")}</span>
          </h2>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t("impact.subtitle")}
          </p>
        </ScrollReveal>

        {/* Metrics grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {metrics.map((metric, index) => (
            <ScrollReveal key={index} delay={index * 0.1}>
              <motion.div
                className="glass-card p-6 text-center group"
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <motion.div
                  className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${metric.color} p-4 mb-4`}
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <metric.icon className="w-full h-full text-white" />
                </motion.div>

                <div className="text-4xl font-bold font-display text-foreground mb-2">
                  <AnimatedCounter
                    value={metric.value}
                    suffix={metric.suffix}
                  />
                </div>

                <h3 className="text-lg font-semibold text-foreground mb-1">
                  {metric.label}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {metric.description}
                </p>

                {/* Progress bar */}
                <div className="mt-4 impact-meter">
                  <motion.div
                    className="impact-meter-fill"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${metric.value}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, delay: 0.5 + index * 0.1 }}
                  />
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>

        {/* Interactive slider */}
        <ScrollReveal delay={0.4}>
          <motion.div
            className="glass-card p-8 max-w-3xl mx-auto"
            whileHover={{ scale: 1.01 }}
          >
            <h3 className="text-xl font-bold font-display text-foreground text-center mb-6">
              {t("impact.sliderTitle")}
            </h3>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">
                    {t("impact.adoptionRate")}
                  </span>
                  <span className="text-sm font-medium text-primary">
                    {sliderValue}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sliderValue}
                  onChange={(e) => setSliderValue(Number(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none bg-muted cursor-pointer
                    [&::-webkit-slider-thumb]:appearance-none
                    [&::-webkit-slider-thumb]:w-5
                    [&::-webkit-slider-thumb]:h-5
                    [&::-webkit-slider-thumb]:rounded-full
                    [&::-webkit-slider-thumb]:bg-primary
                    [&::-webkit-slider-thumb]:shadow-glow
                    [&::-webkit-slider-thumb]:cursor-pointer
                    [&::-webkit-slider-thumb]:transition-transform
                    [&::-webkit-slider-thumb]:hover:scale-110
                  "
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="glass-card p-4 rounded-xl text-center">
                  <p className="text-sm text-muted-foreground mb-1">
                    {t("impact.farmersBenefited")}
                  </p>
                  <p className="text-2xl font-bold text-gradient">
                    <AnimatedCounter
                      value={Math.round(sliderValue * 1.5 * 10000)}
                      duration={0.5}
                    />
                  </p>
                </div>
                <div className="glass-card p-4 rounded-xl text-center">
                  <p className="text-sm text-muted-foreground mb-1">
                    {t("impact.totalImpact")}
                  </p>
                  <p className="text-2xl font-bold text-gradient-gold">
                    ₹
                    <AnimatedCounter
                      value={Math.round(sliderValue * 2.5)}
                      suffix=" Cr"
                      duration={0.5}
                    />
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default ImpactSection;
