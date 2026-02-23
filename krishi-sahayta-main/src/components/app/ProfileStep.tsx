import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MapPin, Sprout, Tractor, Droplets, Shield, 
  CreditCard, Home, Users, ChevronRight, Wheat,
  Leaf, Apple, CircleDot
} from "lucide-react";
import { FarmerProfile } from "@/pages/Dashboard";
import FloatingCard from "../FloatingCard";

interface ProfileStepProps {
  profile: FarmerProfile;
  onComplete: (data: FarmerProfile) => void;
}

const states = [
  "Maharashtra", "Madhya Pradesh", "Uttar Pradesh", "Punjab", 
  "Haryana", "Rajasthan", "Gujarat", "Karnataka", "Tamil Nadu", "Andhra Pradesh"
];

const farmerTypes = [
  { id: "marginal", label: "Marginal", icon: Sprout, description: "< 1 hectare" },
  { id: "small", label: "Small", icon: Leaf, description: "1-2 hectares" },
  { id: "medium", label: "Medium", icon: Tractor, description: "2-10 hectares" },
  { id: "large", label: "Large", icon: Wheat, description: "> 10 hectares" },
];

const landOptions = [
  { id: "owned", label: "Owned Land", icon: Home },
  { id: "leased", label: "Leased Land", icon: Users },
  { id: "both", label: "Both", icon: CircleDot },
];

const crops = [
  { id: "wheat", label: "Wheat", emoji: "🌾" },
  { id: "rice", label: "Rice", emoji: "🍚" },
  { id: "cotton", label: "Cotton", emoji: "🌿" },
  { id: "sugarcane", label: "Sugarcane", emoji: "🎋" },
  { id: "vegetables", label: "Vegetables", emoji: "🥬" },
  { id: "fruits", label: "Fruits", emoji: "🍎" },
  { id: "pulses", label: "Pulses", emoji: "🫘" },
  { id: "oilseeds", label: "Oilseeds", emoji: "🌻" },
];

const requirements = [
  { id: "credit", label: "Credit/Loan", icon: CreditCard, color: "from-blue-500 to-cyan-500" },
  { id: "insurance", label: "Insurance", icon: Shield, color: "from-purple-500 to-pink-500" },
  { id: "irrigation", label: "Irrigation", icon: Droplets, color: "from-cyan-500 to-blue-500" },
  { id: "subsidy", label: "Subsidy", icon: Sprout, color: "from-green-500 to-emerald-500" },
];

const ProfileStep = ({ profile, onComplete }: ProfileStepProps) => {
  const [currentSection, setCurrentSection] = useState(0);
  const [formData, setFormData] = useState<FarmerProfile>(profile);
  const [avatar, setAvatar] = useState(1);

  const sections = [
    { title: "Location", subtitle: "Where is your farm?" },
    { title: "Farmer Type", subtitle: "Tell us about your land" },
    { title: "Crops", subtitle: "What do you grow?" },
    { title: "Requirements", subtitle: "What support do you need?" },
  ];

  const updateAvatar = () => {
    const filled = [
      formData.state,
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
      case 0: return formData.state !== "";
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
            <span className="text-foreground">Build Your </span>
            <span className="text-gradient">Farmer Profile</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground"
          >
            {sections[currentSection].subtitle}
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
                  {/* Avatar stages */}
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
                  
                  {/* Progress ring */}
                  <svg className="absolute inset-0 w-full h-full -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="60"
                      fill="none"
                      stroke="hsl(var(--muted))"
                      strokeWidth="4"
                    />
                    <motion.circle
                      cx="64"
                      cy="64"
                      r="60"
                      fill="none"
                      stroke="hsl(var(--primary))"
                      strokeWidth="4"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: (currentSection + 1) / sections.length }}
                      transition={{ duration: 0.5 }}
                      style={{ pathLength: (currentSection + 1) / sections.length }}
                      strokeDasharray="377"
                      strokeDashoffset={377 - (377 * (currentSection + 1)) / sections.length}
                    />
                  </svg>
                </motion.div>
                
                <h3 className="font-display font-bold text-foreground mb-1">
                  Your Profile
                </h3>
                <p className="text-sm text-muted-foreground">
                  {currentSection + 1} of {sections.length} complete
                </p>

                {/* Summary */}
                <div className="mt-6 space-y-2 text-left">
                  {formData.state && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span className="text-foreground">{formData.state}</span>
                    </div>
                  )}
                  {formData.farmerType && (
                    <div className="flex items-center gap-2 text-sm">
                      <Tractor className="w-4 h-4 text-primary" />
                      <span className="text-foreground capitalize">{formData.farmerType} Farmer</span>
                    </div>
                  )}
                  {formData.crops.length > 0 && (
                    <div className="flex items-center gap-2 text-sm">
                      <Sprout className="w-4 h-4 text-primary" />
                      <span className="text-foreground">{formData.crops.length} crops selected</span>
                    </div>
                  )}
                </div>
              </div>
            </FloatingCard>
          </div>

          {/* Form sections */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {/* Section 0: Location */}
              {currentSection === 0 && (
                <motion.div
                  key="location"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <FloatingCard className="p-6">
                    <h3 className="text-lg font-display font-bold mb-4 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-primary" />
                      Select Your State
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {states.map((state) => (
                        <motion.button
                          key={state}
                          onClick={() => setFormData({ ...formData, state })}
                          className={`
                            p-4 rounded-xl text-left transition-all
                            ${formData.state === state 
                              ? 'bg-primary text-primary-foreground shadow-glow' 
                              : 'glass-card hover:bg-muted text-foreground'
                            }
                          `}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <span className="font-medium">{state}</span>
                        </motion.button>
                      ))}
                    </div>
                  </FloatingCard>
                </motion.div>
              )}

              {/* Section 1: Farmer Type */}
              {currentSection === 1 && (
                <motion.div
                  key="type"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <FloatingCard className="p-6">
                    <h3 className="text-lg font-display font-bold mb-4 flex items-center gap-2">
                      <Tractor className="w-5 h-5 text-primary" />
                      Farmer Type
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {farmerTypes.map((type) => (
                        <motion.button
                          key={type.id}
                          onClick={() => setFormData({ ...formData, farmerType: type.id })}
                          className={`
                            p-6 rounded-xl text-left transition-all
                            ${formData.farmerType === type.id 
                              ? 'bg-primary text-primary-foreground shadow-glow' 
                              : 'glass-card hover:bg-muted'
                            }
                          `}
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <type.icon className={`w-8 h-8 mb-3 ${formData.farmerType === type.id ? '' : 'text-primary'}`} />
                          <p className="font-bold">{type.label}</p>
                          <p className={`text-sm ${formData.farmerType === type.id ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                            {type.description}
                          </p>
                        </motion.button>
                      ))}
                    </div>
                  </FloatingCard>

                  <FloatingCard className="p-6">
                    <h3 className="text-lg font-display font-bold mb-4 flex items-center gap-2">
                      <Home className="w-5 h-5 text-primary" />
                      Land Ownership
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                      {landOptions.map((option) => (
                        <motion.button
                          key={option.id}
                          onClick={() => setFormData({ ...formData, landOwnership: option.id })}
                          className={`
                            p-4 rounded-xl text-center transition-all
                            ${formData.landOwnership === option.id 
                              ? 'bg-primary text-primary-foreground shadow-glow' 
                              : 'glass-card hover:bg-muted'
                            }
                          `}
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

              {/* Section 2: Crops */}
              {currentSection === 2 && (
                <motion.div
                  key="crops"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <FloatingCard className="p-6">
                    <h3 className="text-lg font-display font-bold mb-4 flex items-center gap-2">
                      <Sprout className="w-5 h-5 text-primary" />
                      Select Your Crops
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Choose all crops you cultivate
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {crops.map((crop) => {
                        const isSelected = formData.crops.includes(crop.id);
                        return (
                          <motion.button
                            key={crop.id}
                            onClick={() => {
                              const newCrops = isSelected
                                ? formData.crops.filter(c => c !== crop.id)
                                : [...formData.crops, crop.id];
                              setFormData({ ...formData, crops: newCrops });
                            }}
                            className={`
                              p-6 rounded-xl text-center transition-all
                              ${isSelected 
                                ? 'bg-primary text-primary-foreground shadow-glow' 
                                : 'glass-card hover:bg-muted'
                              }
                            `}
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

              {/* Section 3: Requirements */}
              {currentSection === 3 && (
                <motion.div
                  key="requirements"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <FloatingCard className="p-6">
                    <h3 className="text-lg font-display font-bold mb-4 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-primary" />
                      What Do You Need?
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Select all types of support you're looking for
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      {requirements.map((req) => {
                        const isSelected = formData.requirements.includes(req.id);
                        return (
                          <motion.button
                            key={req.id}
                            onClick={() => {
                              const newReqs = isSelected
                                ? formData.requirements.filter(r => r !== req.id)
                                : [...formData.requirements, req.id];
                              setFormData({ ...formData, requirements: newReqs });
                            }}
                            className={`
                              p-6 rounded-xl text-left transition-all relative overflow-hidden
                              ${isSelected 
                                ? 'bg-gradient-to-br ' + req.color + ' text-white shadow-glow' 
                                : 'glass-card hover:bg-muted'
                              }
                            `}
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <req.icon className={`w-10 h-10 mb-3 ${isSelected ? 'text-white' : 'text-primary'}`} />
                            <p className="font-bold text-lg">{req.label}</p>
                            
                            {isSelected && (
                              <motion.div
                                className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                              >
                                ✓
                              </motion.div>
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
                className={`
                  px-6 py-3 rounded-full font-medium flex items-center gap-2
                  ${currentSection > 0 
                    ? 'glass-card text-foreground hover:bg-muted' 
                    : 'opacity-0 pointer-events-none'
                  }
                `}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                ← Back
              </motion.button>

              <motion.button
                onClick={handleNext}
                disabled={!canProceed()}
                className={`
                  btn-hero flex items-center gap-2
                  ${!canProceed() ? 'opacity-50 cursor-not-allowed' : ''}
                `}
                whileHover={canProceed() ? { scale: 1.05 } : {}}
                whileTap={canProceed() ? { scale: 0.98 } : {}}
              >
                {currentSection === sections.length - 1 ? 'Find My Schemes' : 'Continue'}
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
