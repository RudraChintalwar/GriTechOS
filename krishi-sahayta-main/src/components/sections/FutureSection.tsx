import { motion } from "framer-motion";
import { Mic, MapPin, Globe, Bot, Lock, Sparkles } from "lucide-react";
import ScrollReveal from "../ScrollReveal";

const futureFeatures = [
  {
    icon: Mic,
    title: "Voice-Only Navigation",
    description: "Complete hands-free experience",
    status: "coming",
  },
  {
    icon: MapPin,
    title: "Regional Expansion",
    description: "All 28 states + UTs covered",
    status: "coming",
  },
  {
    icon: Globe,
    title: "Real-Time APIs",
    description: "Live government data sync",
    status: "planned",
  },
  {
    icon: Bot,
    title: "AI Verification",
    description: "Automated eligibility checks",
    status: "planned",
  },
];

const FutureSection = () => {
  return (
    <section className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background to-card/30" />
      
      {/* Animated grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(to right, hsl(var(--primary) / 0.2) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--primary) / 0.2) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }} />
      </div>

      <div className="relative z-10 container mx-auto px-4">
        {/* Header */}
        <ScrollReveal className="text-center mb-16">
          <motion.div
            className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-muted-foreground">
              Roadmap
            </span>
          </motion.div>

          <h2 className="text-4xl md:text-6xl font-bold font-display mb-6">
            <span className="text-foreground">The future is </span>
            <span className="text-gradient">being built</span>
          </h2>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            GriTech OS is just getting started. Here's what's on the horizon.
          </p>
        </ScrollReveal>

        {/* Future cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {futureFeatures.map((feature, index) => (
            <ScrollReveal key={feature.title} delay={index * 0.1}>
              <motion.div
                className="locked-card group relative"
                whileHover={{ y: -5 }}
              >
                {/* Lock icon */}
                <div className="absolute top-4 right-4">
                  <Lock className="w-4 h-4 text-primary/50" />
                </div>

                {/* Status badge */}
                <div className={`
                  absolute -top-2 -left-2 px-3 py-1 rounded-full text-xs font-medium
                  ${feature.status === 'coming' 
                    ? 'bg-primary/20 text-primary' 
                    : 'bg-muted text-muted-foreground'
                  }
                `}>
                  {feature.status === 'coming' ? 'Coming Soon' : 'Planned'}
                </div>

                <motion.div
                  className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 p-3 mb-4"
                  animate={{
                    boxShadow: [
                      '0 0 0 hsl(var(--primary) / 0)',
                      '0 0 20px hsl(var(--primary) / 0.3)',
                      '0 0 0 hsl(var(--primary) / 0)',
                    ],
                  }}
                  transition={{ duration: 3, repeat: Infinity, delay: index * 0.5 }}
                >
                  <feature.icon className="w-full h-full text-primary" />
                </motion.div>

                <h3 className="text-lg font-bold font-display text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>

                {/* Shimmer overlay */}
                <motion.div
                  className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                >
                  <motion.div
                    className="absolute inset-0"
                    style={{
                      background: 'linear-gradient(90deg, transparent, hsl(var(--primary) / 0.1), transparent)',
                    }}
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </motion.div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>

        {/* Notify button */}
        <ScrollReveal delay={0.5} className="text-center mt-12">
          <motion.button
            className="btn-secondary inline-flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Sparkles className="w-4 h-4" />
            Get Early Access
          </motion.button>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default FutureSection;
