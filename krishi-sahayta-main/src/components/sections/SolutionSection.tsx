import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { User, Brain, Search, FileText, CheckCircle, Zap } from "lucide-react";
import FloatingCard from "../FloatingCard";
import ScrollReveal from "../ScrollReveal";

const workflowSteps = [
  {
    icon: User,
    title: "Farmer Profile",
    description: "Simple inputs through visual selection",
    details: ["Location mapping", "Crop selection", "Land details", "Requirements"],
    color: "from-emerald-500 to-green-500",
  },
  {
    icon: Brain,
    title: "Eligibility Intelligence",
    description: "Smart rules match your profile",
    details: ["Rule-based matching", "Real-time processing", "No complex forms", "Instant results"],
    color: "from-lime-500 to-emerald-500",
  },
  {
    icon: Search,
    title: "Scheme Discovery",
    description: "Only relevant schemes appear",
    details: ["Personalized results", "Ranked by relevance", "Filter by category", "Smart suggestions"],
    color: "from-green-500 to-teal-500",
  },
  {
    icon: FileText,
    title: "Simple Explanations",
    description: "Benefits in clear language",
    details: ["No jargon", "Visual guides", "Step-by-step help", "Multilingual support"],
    color: "from-teal-500 to-cyan-500",
  },
];

const SolutionSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);

  return (
    <section ref={containerRef} className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/50 to-background" />
      
      {/* Animated connection lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg className="absolute w-full h-full opacity-20">
          <motion.path
            d="M0,200 Q400,100 800,200 T1600,200"
            stroke="url(#gradient)"
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--primary))" />
              <stop offset="100%" stopColor="hsl(var(--accent))" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="relative z-10 container mx-auto px-4">
        {/* Section header */}
        <ScrollReveal className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full mb-6"
          >
            <Zap className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-muted-foreground">
              The Solution
            </span>
          </motion.div>
          
          <h2 className="text-4xl md:text-6xl font-bold font-display mb-6">
            <span className="text-foreground">Intelligence that </span>
            <span className="text-gradient">works for you</span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Four simple steps to discover every scheme you're eligible for
          </p>
        </ScrollReveal>

        {/* Workflow cards - Horizontal scroll on mobile, grid on desktop */}
        <div className="relative">
          {/* Desktop grid */}
          <div className="hidden lg:grid grid-cols-4 gap-6">
            {workflowSteps.map((step, index) => (
              <FloatingCard
                key={step.title}
                delay={index * 0.15}
                glowing={index === 1}
                className="p-8"
              >
                {/* Step number */}
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-gradient-accent flex items-center justify-center text-primary-foreground font-bold text-sm">
                  {index + 1}
                </div>
                
                {/* Icon */}
                <motion.div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} p-4 mb-6`}
                  whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                >
                  <step.icon className="w-full h-full text-white" />
                </motion.div>
                
                {/* Content */}
                <h3 className="text-xl font-bold font-display mb-2 text-foreground">
                  {step.title}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {step.description}
                </p>
                
                {/* Details */}
                <ul className="space-y-2">
                  {step.details.map((detail) => (
                    <li key={detail} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-primary" />
                      {detail}
                    </li>
                  ))}
                </ul>
                
                {/* Connection line to next */}
                {index < workflowSteps.length - 1 && (
                  <div className="absolute top-1/2 -right-3 w-6 h-px bg-gradient-to-r from-primary to-transparent" />
                )}
              </FloatingCard>
            ))}
          </div>

          {/* Mobile horizontal scroll */}
          <div className="lg:hidden overflow-x-auto pb-8 -mx-4 px-4 custom-scrollbar">
            <motion.div 
              className="flex gap-6"
              style={{ width: "fit-content" }}
            >
              {workflowSteps.map((step, index) => (
                <FloatingCard
                  key={step.title}
                  delay={index * 0.1}
                  className="p-6 w-72 flex-shrink-0"
                >
                  <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-gradient-accent flex items-center justify-center text-primary-foreground font-bold text-sm">
                    {index + 1}
                  </div>
                  
                  <motion.div
                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${step.color} p-3 mb-4`}
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                  >
                    <step.icon className="w-full h-full text-white" />
                  </motion.div>
                  
                  <h3 className="text-lg font-bold font-display mb-2 text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {step.description}
                  </p>
                  
                  <ul className="space-y-1">
                    {step.details.slice(0, 2).map((detail) => (
                      <li key={detail} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <CheckCircle className="w-3 h-3 text-primary" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </FloatingCard>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Bottom accent */}
        <ScrollReveal delay={0.5} className="mt-16 text-center">
          <motion.div
            className="inline-flex items-center gap-3 glass-card px-6 py-4 rounded-2xl"
            whileHover={{ scale: 1.02 }}
          >
            <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
            <span className="text-muted-foreground">
              Processing <span className="text-foreground font-semibold">2,000+</span> government schemes in real-time
            </span>
          </motion.div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default SolutionSection;
