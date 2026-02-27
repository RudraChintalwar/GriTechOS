import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, Sprout, Tractor, Droplets, Shield,
  CreditCard, Home, Users, ChevronRight, Wheat,
  Leaf, CircleDot, AlertTriangle,
} from "lucide-react";
import { FarmerProfile } from "@/pages/Dashboard";
import { useLanguage } from "@/contexts/LanguageContext";
import FloatingCard from "../FloatingCard";
import { toast } from "sonner";
import { getDistrictName } from "@/i18n/districtTranslations";

interface ProfileStepProps {
  profile: FarmerProfile;
  savedProfile?: FarmerProfile | null;
  onComplete: (data: FarmerProfile) => void;
  isUpdateProfileMode?: boolean;
}

const districts = [
  "Ahmednagar", "Akola", "Amravati", "Aurangabad", "Beed",
  "Bhandara", "Buldhana", "Chandrapur", "Dhule", "Gadchiroli",
  "Gondia", "Hingoli", "Jalgaon", "Jalna", "Kolhapur",
  "Latur", "Mumbai City", "Mumbai Suburban", "Nagpur", "Nanded",
  "Nandurbar", "Nashik", "Osmanabad", "Palghar", "Parbhani",
  "Pune", "Raigad", "Ratnagiri", "Sangli", "Satara",
  "Sindhudurg", "Solapur", "Thane", "Wardha", "Washim",
  "Yavatmal",
];

const ProfileStep = ({ profile, savedProfile, onComplete, isUpdateProfileMode }: ProfileStepProps) => {
  const [currentSection, setCurrentSection] = useState(0);
  const [formData, setFormData] = useState<FarmerProfile>(profile);
  const [avatar, setAvatar] = useState(1);
  const { t, language } = useLanguage();

  // Mismatch detection — show toast when value differs from saved profile
  const lastCheckedRef = useRef<Record<string, string>>({});

  const checkMismatch = (field: keyof FarmerProfile) => {
    if (!savedProfile || !savedProfile.farmerType || isUpdateProfileMode) return;
    const saved = savedProfile[field];
    const current = formData[field];
    let differs = false;
    if (Array.isArray(saved) && Array.isArray(current)) {
      differs = current.length > 0 && JSON.stringify([...saved].sort()) !== JSON.stringify([...current].sort());
    } else {
      differs = saved !== current && current !== "" && current !== 0;
    }
    // Build a signature of current value to avoid repeat toasts for same selection
    const sig = JSON.stringify(current);
    if (differs && lastCheckedRef.current[field] !== sig) {
      lastCheckedRef.current[field] = sig;

      // Build a display string for the SAVED profile value
      let savedValue = "";
      if (field === "district") {
        savedValue = getDistrictName(savedProfile.district, language);
      } else if (field === "farmerType") {
        savedValue = t(`profile.${savedProfile.farmerType}`);
      } else if (field === "landOwnership") {
        savedValue = t(`profile.${savedProfile.landOwnership}`);
      } else if (field === "crops" && Array.isArray(saved)) {
        savedValue = (saved as string[]).map(c => t(`profile.${c}`)).join(", ");
      }

      toast.warning(`${t("profile.mismatchWarning")}\n${t("profile.savedProfile")}: ${savedValue}`, {
        duration: 5000,
        icon: "⚠️",
      });
    } else if (!differs) {
      delete lastCheckedRef.current[field];
    }
  };

  // Fire mismatch check whenever formData changes
  useEffect(() => {
    checkMismatch("district");
    checkMismatch("farmerType");
    checkMismatch("landOwnership");
    checkMismatch("crops");
  }, [formData]);

  const farmerTypes = [
    { id: "marginal", label: t("profile.marginal"), icon: Sprout, description: t("profile.marginalDesc") },
    { id: "small", label: t("profile.small"), icon: Leaf, description: t("profile.smallDesc") },
    { id: "medium", label: t("profile.medium"), icon: Tractor, description: t("profile.mediumDesc") },
    { id: "large", label: t("profile.large"), icon: Wheat, description: t("profile.largeDesc") },
  ];

  const landOptions = [
    { id: "owned", label: t("profile.owned"), icon: Home },
    { id: "leased", label: t("profile.leased"), icon: Users },
    { id: "both", label: t("profile.both"), icon: CircleDot },
  ];

  const crops = [
    { id: "wheat", label: t("profile.wheat"), emoji: "🌾" },
    { id: "rice", label: t("profile.rice"), emoji: "🍚" },
    { id: "cotton", label: t("profile.cotton"), emoji: "🌿" },
    { id: "sugarcane", label: t("profile.sugarcane"), emoji: "🎋" },
    { id: "vegetables", label: t("profile.vegetables"), emoji: "🥬" },
    { id: "fruits", label: t("profile.fruits"), emoji: "🍎" },
    { id: "pulses", label: t("profile.pulses"), emoji: "🫘" },
    { id: "oilseeds", label: t("profile.oilseeds"), emoji: "🌻" },
  ];

  const requirements = [
    { id: "credit", label: t("profile.credit"), icon: CreditCard, color: "from-blue-500 to-cyan-500" },
    { id: "insurance", label: t("profile.insurance"), icon: Shield, color: "from-purple-500 to-pink-500" },
    { id: "irrigation", label: t("profile.irrigation"), icon: Droplets, color: "from-cyan-500 to-blue-500" },
    { id: "subsidy", label: t("profile.subsidy"), icon: Sprout, color: "from-green-500 to-emerald-500" },
  ];

  const sections = [
    { title: t("profile.districtTitle"), subtitle: t("profile.districtSubtitle") },
    { title: t("profile.farmerTypeTitle"), subtitle: t("profile.farmerTypeSubtitle") },
    { title: t("profile.cropsTitle"), subtitle: t("profile.cropsSubtitle") },
    { title: t("profile.reqTitle"), subtitle: t("profile.reqSubtitle") },
  ];

  const currentSections = isUpdateProfileMode ? sections.slice(0, 3) : sections;

  useEffect(() => {
    if (currentSection >= currentSections.length) {
      setCurrentSection(Math.max(0, currentSections.length - 1));
    }
  }, [currentSections.length, currentSection]);

  const updateAvatar = () => {
    const filled = [
      formData.district,
      formData.farmerType,
      formData.crops.length > 0,
      formData.requirements.length > 0,
    ].filter(Boolean).length;
    setAvatar(filled + 1);
  };

  const handleNext = () => {
    updateAvatar();
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
    } else {
      onComplete(formData);
    }
  };

  const canProceed = () => {
    switch (currentSection) {
      case 0: return formData.district !== "";
      case 1: return formData.farmerType !== "" && formData.landOwnership !== "";
      case 2: return formData.crops.length > 0;
      case 3: return formData.requirements.length > 0;
      default: return false;
    }
  };

  return (
    <div className="container mx-auto px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold font-display mb-4"
          >
            <span className="text-foreground">
              {isUpdateProfileMode ? t("profile.updateProfile") : t("profile.title")} {isUpdateProfileMode ? "" : " "}
            </span>
            {!isUpdateProfileMode && (
              <span className="text-gradient">{t("profile.titleHighlight")}</span>
            )}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground"
          >
            {currentSections[currentSection]?.subtitle}
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Avatar Preview */}
          <div className="lg:col-span-1">
            <FloatingCard className="p-6 sticky top-32">
              <div className="text-center">
                <motion.div
                  className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4 relative"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <motion.div
                    className="text-6xl"
                    key={avatar}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring" }}
                  >
                    {avatar === 1 && "👤"}
                    {avatar === 2 && "👨‍🌾"}
                    {avatar === 3 && "🧑‍🌾"}
                    {avatar === 4 && "👨‍🌾"}
                    {avatar >= 5 && "🌟"}
                  </motion.div>

                  <svg className="absolute inset-0 w-full h-full -rotate-90">
                    <circle cx="64" cy="64" r="60" fill="none" stroke="hsl(var(--muted))" strokeWidth="4" />
                    <motion.circle
                      cx="64" cy="64" r="60" fill="none"
                      stroke="hsl(var(--primary))" strokeWidth="4" strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: (currentSection + 1) / currentSections.length }}
                      transition={{ duration: 0.5 }}
                      style={{ pathLength: (currentSection + 1) / currentSections.length }}
                      strokeDasharray="377"
                      strokeDashoffset={377 - (377 * (currentSection + 1)) / currentSections.length}
                    />
                  </svg>
                </motion.div>

                <h3 className="font-display font-bold text-foreground mb-1">
                  {t("profile.yourProfile")}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {currentSection + 1} {t("common.of")} {currentSections.length} {t("profile.complete")}
                </p>

                <div className="mt-6 space-y-2 text-left">
                  {formData.district && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span className="text-foreground">{getDistrictName(formData.district, language)}, {t("profile.maharashtra")}</span>
                    </div>
                  )}
                  {formData.farmerType && (
                    <div className="flex items-center gap-2 text-sm">
                      <Tractor className="w-4 h-4 text-primary" />
                      <span className="text-foreground capitalize">{formData.farmerType} {t("profile.farmer")}</span>
                    </div>
                  )}
                  {formData.crops.length > 0 && (
                    <div className="flex items-center gap-2 text-sm">
                      <Sprout className="w-4 h-4 text-primary" />
                      <span className="text-foreground">{formData.crops.length} {t("profile.cropsSelected")}</span>
                    </div>
                  )}
                </div>
              </div>
            </FloatingCard>
          </div>

          {/* Form sections */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {currentSection === 0 && (
                <motion.div key="district" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <FloatingCard className="p-6">
                    <h3 className="text-lg font-display font-bold mb-4 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-primary" />
                      {t("profile.districtTitle")}
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {districts.map((district) => (
                        <motion.button
                          key={district}
                          onClick={() => setFormData({ ...formData, district })}
                          className={`p-4 rounded-xl text-left transition-all ${formData.district === district ? 'bg-primary text-primary-foreground shadow-glow' : 'glass-card hover:bg-muted text-foreground'}`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <span className="font-medium">{getDistrictName(district, language)}</span>
                        </motion.button>
                      ))}
                    </div>
                  </FloatingCard>
                </motion.div>
              )}

              {currentSection === 1 && (
                <motion.div key="type" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <FloatingCard className="p-6">
                    <h3 className="text-lg font-display font-bold mb-4 flex items-center gap-2">
                      <Tractor className="w-5 h-5 text-primary" />
                      {t("profile.farmerTypeTitle")}
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {farmerTypes.map((type) => (
                        <motion.button
                          key={type.id}
                          onClick={() => setFormData({ ...formData, farmerType: type.id })}
                          className={`p-6 rounded-xl text-left transition-all ${formData.farmerType === type.id ? 'bg-primary text-primary-foreground shadow-glow' : 'glass-card hover:bg-muted'}`}
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <type.icon className={`w-8 h-8 mb-3 ${formData.farmerType === type.id ? '' : 'text-primary'}`} />
                          <p className="font-bold">{type.label}</p>
                          <p className={`text-sm ${formData.farmerType === type.id ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>{type.description}</p>
                        </motion.button>
                      ))}
                    </div>
                  </FloatingCard>

                  <FloatingCard className="p-6">
                    <h3 className="text-lg font-display font-bold mb-4 flex items-center gap-2">
                      <Home className="w-5 h-5 text-primary" />
                      {t("profile.landTitle")}
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                      {landOptions.map((option) => (
                        <motion.button
                          key={option.id}
                          onClick={() => setFormData({ ...formData, landOwnership: option.id })}
                          className={`p-4 rounded-xl text-center transition-all ${formData.landOwnership === option.id ? 'bg-primary text-primary-foreground shadow-glow' : 'glass-card hover:bg-muted'}`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <option.icon className={`w-6 h-6 mx-auto mb-2 ${formData.landOwnership === option.id ? '' : 'text-primary'}`} />
                          <p className="font-medium text-sm">{option.label}</p>
                        </motion.button>
                      ))}
                    </div>
                  </FloatingCard>
                </motion.div>
              )}

              {currentSection === 2 && (
                <motion.div key="crops" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <FloatingCard className="p-6">
                    <h3 className="text-lg font-display font-bold mb-4 flex items-center gap-2">
                      <Sprout className="w-5 h-5 text-primary" />
                      {t("profile.cropsTitle")}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">{t("profile.cropsChoose")}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {crops.map((crop) => {
                        const isSelected = formData.crops.includes(crop.id);
                        return (
                          <motion.button
                            key={crop.id}
                            onClick={() => {
                              const newCrops = isSelected ? formData.crops.filter(c => c !== crop.id) : [...formData.crops, crop.id];
                              setFormData({ ...formData, crops: newCrops });
                            }}
                            className={`p-6 rounded-xl text-center transition-all ${isSelected ? 'bg-primary text-primary-foreground shadow-glow' : 'glass-card hover:bg-muted'}`}
                            whileHover={{ scale: 1.05, rotate: [0, -5, 5, 0] }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <span className="text-4xl block mb-2">{crop.emoji}</span>
                            <p className="font-medium">{crop.label}</p>
                          </motion.button>
                        );
                      })}
                    </div>
                  </FloatingCard>
                </motion.div>
              )}

              {currentSection === 3 && (
                <motion.div key="requirements" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <FloatingCard className="p-6">
                    <h3 className="text-lg font-display font-bold mb-4 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-primary" />
                      {t("profile.reqTitle")}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">{t("profile.reqChoose")}</p>
                    <div className="grid grid-cols-2 gap-4">
                      {requirements.map((req) => {
                        const isSelected = formData.requirements.includes(req.id);
                        return (
                          <motion.button
                            key={req.id}
                            onClick={() => {
                              const newReqs = isSelected ? formData.requirements.filter(r => r !== req.id) : [...formData.requirements, req.id];
                              setFormData({ ...formData, requirements: newReqs });
                            }}
                            className={`p-6 rounded-xl text-left transition-all relative overflow-hidden ${isSelected ? 'bg-gradient-to-br ' + req.color + ' text-white shadow-glow' : 'glass-card hover:bg-muted'}`}
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <req.icon className={`w-10 h-10 mb-3 ${isSelected ? 'text-white' : 'text-primary'}`} />
                            <p className="font-bold text-lg">{req.label}</p>
                            {isSelected && (
                              <motion.div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center" initial={{ scale: 0 }} animate={{ scale: 1 }}>✓</motion.div>
                            )}
                          </motion.button>
                        );
                      })}
                    </div>
                  </FloatingCard>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex justify-between items-center mt-8">
              <motion.button
                onClick={() => currentSection > 0 && setCurrentSection(currentSection - 1)}
                className={`px-6 py-3 rounded-full font-medium flex items-center gap-2 ${currentSection > 0 ? 'glass-card text-foreground hover:bg-muted' : 'opacity-0 pointer-events-none'}`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {t("profile.back")}
              </motion.button>

              <motion.button
                onClick={handleNext}
                disabled={!canProceed()}
                className={`btn-hero flex items-center gap-2 ${!canProceed() ? 'opacity-50 cursor-not-allowed' : ''}`}
                whileHover={canProceed() ? { scale: 1.05 } : {}}
                whileTap={canProceed() ? { scale: 0.98 } : {}}
              >
                {isUpdateProfileMode ? t("auth.saveProfile") : currentSection === currentSections.length - 1 ? t("profile.findSchemes") : t("profile.continue")}
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileStep;
