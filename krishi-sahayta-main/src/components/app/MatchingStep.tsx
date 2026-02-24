import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Brain, Zap, CheckCircle, Database, Search } from "lucide-react";
import { FarmerProfile } from "@/pages/Dashboard";
import { useLanguage } from "@/contexts/LanguageContext";

interface MatchingStepProps {
  profile: FarmerProfile;
  isMatching: boolean;
}

const MatchingStep = ({ profile, isMatching }: MatchingStepProps) => {
  const [currentStage, setCurrentStage] = useState(0);
  const [completedStages, setCompletedStages] = useState<number[]>([]);
  const { t } = useLanguage();

  const matchingStages = [
    { icon: Database, label: t("matching.stage1"), duration: 800 },
    { icon: Search, label: t("matching.stage2"), duration: 1000 },
    { icon: Brain, label: t("matching.stage3"), duration: 800 },
    { icon: CheckCircle, label: t("matching.stage4"), duration: 400 },
  ];

  useEffect(() => {
    if (isMatching) {
      let totalDelay = 0;
      matchingStages.forEach((stage, index) => {
        setTimeout(() => {
          setCurrentStage(index);
        }, totalDelay);

        setTimeout(() => {
          setCompletedStages(prev => [...prev, index]);
        }, totalDelay + stage.duration);

        totalDelay += stage.duration;
      });
    }
  }, [isMatching]);

  return (
    <div className="container mx-auto px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Animated brain visualization */}
        <motion.div
          className="relative w-64 h-64 mx-auto mb-12"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute inset-0 rounded-full border-2 border-primary/20"
              style={{ margin: i * 20 }}
              animate={{ rotate: 360, scale: [1, 1.05, 1] }}
              transition={{
                rotate: { duration: 10 + i * 5, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity, delay: i * 0.3 },
              }}
            />
          ))}

          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-glow-lg">
              <Brain className="w-16 h-16 text-primary-foreground" />
            </div>
          </motion.div>

          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 rounded-full bg-primary/60"
              style={{
                left: `${50 + 45 * Math.cos((i * Math.PI * 2) / 8)}%`,
                top: `${50 + 45 * Math.sin((i * Math.PI * 2) / 8)}%`,
              }}
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
            />
          ))}

          <svg className="absolute inset-0 w-full h-full">
            {[...Array(8)].map((_, i) => (
              <motion.line
                key={i}
                x1="50%" y1="50%"
                x2={`${50 + 45 * Math.cos((i * Math.PI * 2) / 8)}%`}
                y2={`${50 + 45 * Math.sin((i * Math.PI * 2) / 8)}%`}
                stroke="hsl(var(--primary))" strokeWidth="1" strokeOpacity="0.3"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              />
            ))}
          </svg>
        </motion.div>

        <motion.h2
          className="text-3xl md:text-4xl font-bold font-display mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="text-gradient">{t("matching.analyzing")}</span>
          <span className="text-foreground"> {t("matching.yourProfile")}</span>
        </motion.h2>

        <motion.p
          className="text-muted-foreground mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {t("matching.engineDesc")}
        </motion.p>

        <div className="space-y-4 text-left">
          {matchingStages.map((stage, index) => {
            const isActive = currentStage === index;
            const isCompleted = completedStages.includes(index);

            return (
              <motion.div
                key={stage.label}
                className={`glass-card p-4 flex items-center gap-4 transition-all ${isActive ? 'ring-2 ring-primary' : ''} ${isCompleted ? 'bg-primary/10' : ''}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isCompleted ? 'bg-primary text-primary-foreground' : isActive ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                  {isCompleted ? <CheckCircle className="w-5 h-5" /> : <stage.icon className="w-5 h-5" />}
                </div>

                <div className="flex-1">
                  <p className={`font-medium ${isCompleted || isActive ? 'text-foreground' : 'text-muted-foreground'}`}>{stage.label}</p>
                </div>

                {isActive && !isCompleted && (
                  <motion.div className="flex gap-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 rounded-full bg-primary"
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
                      />
                    ))}
                  </motion.div>
                )}

                {isCompleted && (
                  <motion.span className="text-primary text-sm" initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}>✓</motion.span>
                )}
              </motion.div>
            );
          })}
        </div>

        <motion.div
          className="mt-8 glass-card p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex flex-wrap gap-2 justify-center">
            <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm">
              {profile.district || t("profile.maharashtra")}
            </span>
            <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm capitalize">
              {profile.farmerType} {t("profile.farmer")}
            </span>
            <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm">
              {profile.crops.length} {t("profile.cropsLabel")}
            </span>
            <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm">
              {profile.requirements.length} {t("profile.reqLabel")}
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MatchingStep;
