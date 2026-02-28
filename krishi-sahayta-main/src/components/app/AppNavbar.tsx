import { motion } from "framer-motion";
import { Leaf, ArrowLeft, LogOut, Phone } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSelector from "@/components/LanguageSelector";

interface Step {
  id: number;
  name: string;
  description: string;
}

interface AppNavbarProps {
  currentStep: number;
  steps: Step[];
}

const AppNavbar = ({ currentStep, steps }: AppNavbarProps) => {
  const { user, signOut } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 glass-card border-0 border-b border-border/50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Back button & Logo */}
          <div className="flex items-center gap-4">
            <Link to="/app">
              <motion.div
                className="w-10 h-10 rounded-xl glass-card flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft className="w-5 h-5" />
              </motion.div>
            </Link>

            <Link to="/app" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <Leaf className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold font-display text-foreground hidden sm:block">
                GriTech OS
              </span>
            </Link>
          </div>

          {/* Step indicators */}
          <div className="flex items-center gap-2">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <motion.div
                  className={`
                    flex items-center gap-2 px-3 py-1.5 rounded-full text-sm
                    ${currentStep >= step.id
                      ? 'bg-primary/20 text-primary'
                      : 'bg-muted text-muted-foreground'
                    }
                  `}
                  animate={{
                    scale: currentStep === step.id ? 1.05 : 1,
                  }}
                >
                  <span className={`
                    w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold
                    ${currentStep >= step.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted-foreground/30 text-muted-foreground'
                    }
                  `}>
                    {step.id}
                  </span>
                  <span className="hidden md:block">{step.name}</span>
                </motion.div>

                {index < steps.length - 1 && (
                  <div className={`
                    w-8 h-0.5 mx-1
                    ${currentStep > step.id ? 'bg-primary' : 'bg-muted'}
                  `} />
                )}
              </div>
            ))}
          </div>

          {/* Language + User info & Logout */}
          <div className="flex items-center gap-2">
            <LanguageSelector variant="compact" />
            <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground mr-2">
              <Phone className="w-3.5 h-3.5" />
              <span>{user?.phoneNumber || t("profile.farmer")}</span>
            </div>
            <motion.button
              onClick={handleLogout}
              className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-muted-foreground hover:text-red-400 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title={t("common.logout")}
            >
              <LogOut className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default AppNavbar;
