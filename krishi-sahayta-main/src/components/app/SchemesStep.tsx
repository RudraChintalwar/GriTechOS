import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle, ChevronDown, ChevronRight, ExternalLink, 
  HelpCircle, Printer, Share2, Star, ArrowLeft, RefreshCw
} from "lucide-react";
import { FarmerProfile } from "@/pages/Dashboard";
import FloatingCard from "../FloatingCard";

interface Scheme {
  id: number;
  name: string;
  fullName: string;
  benefit: string;
  confidence: number;
  category: string;
  description: string;
  eligibility: string[];
  howToApply: string;
}

interface SchemesStepProps {
  schemes: Scheme[];
  profile: FarmerProfile;
  onBack: () => void;
}

const categoryColors: Record<string, string> = {
  "Income Support": "from-emerald-500 to-green-500",
  "Insurance": "from-purple-500 to-pink-500",
  "Irrigation": "from-cyan-500 to-blue-500",
  "Credit": "from-amber-500 to-orange-500",
  "Price Support": "from-rose-500 to-red-500",
  "Advisory": "from-teal-500 to-emerald-500",
};

const SchemesStep = ({ schemes, profile, onBack }: SchemesStepProps) => {
  const [expandedScheme, setExpandedScheme] = useState<number | null>(null);
  const [showExplainer, setShowExplainer] = useState<number | null>(null);

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return "text-green-400";
    if (confidence >= 70) return "text-yellow-400";
    return "text-orange-400";
  };

  return (
    <div className="container mx-auto px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-4xl font-bold font-display mb-2"
            >
              <span className="text-gradient">{schemes.length} Schemes</span>
              <span className="text-foreground"> Found</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground"
            >
              Personalized recommendations based on your profile
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex gap-2"
          >
            <motion.button
              onClick={onBack}
              className="glass-card px-4 py-2 rounded-lg flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">Update Profile</span>
            </motion.button>
            <motion.button
              className="glass-card px-4 py-2 rounded-lg flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print</span>
            </motion.button>
            <motion.button
              className="glass-card px-4 py-2 rounded-lg flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Share</span>
            </motion.button>
          </motion.div>
        </div>

        {/* Schemes grid */}
        <div className="space-y-4">
          {schemes.map((scheme, index) => (
            <motion.div
              key={scheme.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <FloatingCard
                className={`
                  p-0 overflow-hidden transition-all duration-300
                  ${expandedScheme === scheme.id ? 'ring-2 ring-primary' : ''}
                `}
              >
                {/* Main card content */}
                <div
                  className="p-6 cursor-pointer"
                  onClick={() => setExpandedScheme(
                    expandedScheme === scheme.id ? null : scheme.id
                  )}
                >
                  <div className="flex items-start gap-4">
                    {/* Confidence indicator */}
                    <div className="relative flex-shrink-0">
                      <svg className="w-16 h-16 -rotate-90">
                        <circle
                          cx="32"
                          cy="32"
                          r="28"
                          fill="none"
                          stroke="hsl(var(--muted))"
                          strokeWidth="4"
                        />
                        <motion.circle
                          cx="32"
                          cy="32"
                          r="28"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="4"
                          strokeLinecap="round"
                          className={getConfidenceColor(scheme.confidence)}
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: scheme.confidence / 100 }}
                          transition={{ duration: 1, delay: 0.3 + index * 0.1 }}
                          style={{
                            strokeDasharray: 176,
                            strokeDashoffset: 176 - (176 * scheme.confidence) / 100,
                          }}
                        />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-foreground">
                        {scheme.confidence}%
                      </span>
                    </div>

                    {/* Scheme info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`
                          px-2 py-0.5 rounded text-xs font-medium text-white
                          bg-gradient-to-r ${categoryColors[scheme.category] || 'from-gray-500 to-gray-600'}
                        `}>
                          {scheme.category}
                        </span>
                        {scheme.confidence >= 90 && (
                          <span className="flex items-center gap-1 text-xs text-yellow-400">
                            <Star className="w-3 h-3 fill-current" />
                            Top Match
                          </span>
                        )}
                      </div>
                      
                      <h3 className="text-xl font-bold font-display text-foreground mb-1">
                        {scheme.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2 truncate">
                        {scheme.fullName}
                      </p>
                      
                      <div className="flex items-center gap-4">
                        <span className="text-lg font-bold text-gradient">
                          {scheme.benefit}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowExplainer(showExplainer === scheme.id ? null : scheme.id);
                          }}
                          className="flex items-center gap-1 text-sm text-primary hover:text-primary/80"
                        >
                          <HelpCircle className="w-4 h-4" />
                          Why am I eligible?
                        </button>
                      </div>
                    </div>

                    {/* Expand icon */}
                    <motion.div
                      animate={{ rotate: expandedScheme === scheme.id ? 180 : 0 }}
                      className="text-muted-foreground"
                    >
                      <ChevronDown className="w-6 h-6" />
                    </motion.div>
                  </div>

                  {/* Eligibility explainer */}
                  <AnimatePresence>
                    {showExplainer === scheme.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 p-4 rounded-xl bg-primary/10 border border-primary/20"
                      >
                        <p className="text-sm font-medium text-primary mb-2">
                          You match because:
                        </p>
                        <ul className="space-y-1">
                          <li className="flex items-center gap-2 text-sm text-foreground">
                            <CheckCircle className="w-4 h-4 text-primary" />
                            Your farmer type: <span className="capitalize">{profile.farmerType}</span>
                          </li>
                          <li className="flex items-center gap-2 text-sm text-foreground">
                            <CheckCircle className="w-4 h-4 text-primary" />
                            Location: {profile.state}
                          </li>
                          <li className="flex items-center gap-2 text-sm text-foreground">
                            <CheckCircle className="w-4 h-4 text-primary" />
                            Land ownership: <span className="capitalize">{profile.landOwnership}</span>
                          </li>
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Expanded content */}
                <AnimatePresence>
                  {expandedScheme === scheme.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t border-border"
                    >
                      <div className="p-6 space-y-6">
                        {/* Description */}
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground mb-2">
                            About This Scheme
                          </h4>
                          <p className="text-foreground">{scheme.description}</p>
                        </div>

                        {/* Eligibility */}
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground mb-2">
                            Eligibility Criteria
                          </h4>
                          <ul className="space-y-2">
                            {scheme.eligibility.map((criteria, i) => (
                              <li key={i} className="flex items-center gap-2 text-foreground">
                                <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                                {criteria}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* How to apply */}
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground mb-2">
                            How to Apply
                          </h4>
                          <p className="text-foreground">{scheme.howToApply}</p>
                        </div>

                        {/* Action buttons */}
                        <div className="flex flex-wrap gap-3 pt-4">
                          <motion.button
                            className="btn-hero py-3 px-6 text-sm flex items-center gap-2"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            Apply Now
                            <ExternalLink className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            className="btn-secondary py-3 px-6 text-sm"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            Learn More
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </FloatingCard>
            </motion.div>
          ))}
        </div>

        {/* Summary card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: schemes.length * 0.1 + 0.2 }}
          className="mt-8"
        >
          <FloatingCard className="p-6 bg-gradient-to-br from-primary/10 to-accent/10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold font-display text-foreground mb-1">
                  Total Potential Benefit
                </h3>
                <p className="text-sm text-muted-foreground">
                  Combined value of all eligible schemes
                </p>
              </div>
              <div className="text-3xl font-bold text-gradient">
                ₹6,000+ /year
              </div>
            </div>
          </FloatingCard>
        </motion.div>
      </div>
    </div>
  );
};

export default SchemesStep;
