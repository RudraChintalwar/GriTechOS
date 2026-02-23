import { motion } from "framer-motion";
import { Leaf, ArrowRight, Play } from "lucide-react";
import { Link } from "react-router-dom";
import ScrollReveal from "../ScrollReveal";

const CTASection = () => {
  return (
    <section className="relative py-32 overflow-hidden">
      {/* Background - bright green farmland gradient */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/10 to-primary/20" />
        
        {/* Animated particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-primary/30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Radial glow */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, hsl(var(--primary) / 0.2) 0%, transparent 60%)',
        }}
        animate={{
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      <div className="relative z-10 container mx-auto px-4 text-center">
        <ScrollReveal>
          <motion.div
            className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full mb-8"
            whileHover={{ scale: 1.05 }}
          >
            <Leaf className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">
              Ready to Transform Agriculture
            </span>
          </motion.div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold font-display mb-8">
            <span className="text-foreground">Let schemes find </span>
            <br />
            <span className="text-gradient">the farmer.</span>
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12">
            GriTech OS transforms government schemes from static PDFs 
            into a living digital experience for India's farmers.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.3}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/app">
              <motion.button
                className="btn-hero group text-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="relative z-10 flex items-center gap-3">
                  Enter GriTech OS
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.span>
                </span>
              </motion.button>
            </Link>

            <motion.button
              className="btn-secondary flex items-center gap-3 text-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Play className="w-5 h-5" />
              Watch How It Works
            </motion.button>
          </div>
        </ScrollReveal>

        {/* Stats */}
        <ScrollReveal delay={0.4} className="mt-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { value: "2000+", label: "Schemes Indexed" },
              { value: "28", label: "States Covered" },
              { value: "12", label: "Languages" },
              { value: "100%", label: "Free Access" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <p className="text-3xl md:text-4xl font-bold text-gradient mb-2">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default CTASection;
