import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import AppNavbar from "@/components/app/AppNavbar";
import ProfileStep from "@/components/app/ProfileStep";
import MatchingStep from "@/components/app/MatchingStep";
import SchemesStep from "@/components/app/SchemesStep";
import ChatAssistant from "@/components/app/ChatAssistant";

const steps = [
  { id: 1, name: "Profile", description: "Tell us about yourself" },
  { id: 2, name: "Matching", description: "Finding your schemes" },
  { id: 3, name: "Schemes", description: "Your recommendations" },
];

export interface FarmerProfile {
  state: string;
  district: string;
  farmerType: string;
  landOwnership: string;
  landSize: number;
  crops: string[];
  requirements: string[];
}

const Dashboard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [profile, setProfile] = useState<FarmerProfile>({
    state: "",
    district: "",
    farmerType: "",
    landOwnership: "",
    landSize: 0,
    crops: [],
    requirements: [],
  });
  const [matchedSchemes, setMatchedSchemes] = useState<any[]>([]);
  const [isMatching, setIsMatching] = useState(false);

  const handleProfileComplete = (data: FarmerProfile) => {
    setProfile(data);
    setCurrentStep(2);
    setIsMatching(true);
    
    // Simulate matching process
    setTimeout(() => {
      setIsMatching(false);
      setMatchedSchemes(getMatchedSchemes(data));
      setCurrentStep(3);
    }, 3000);
  };

  const getMatchedSchemes = (data: FarmerProfile) => {
    // Rule-based matching logic
    const schemes = [];
    
    if (data.farmerType === "small" || data.farmerType === "marginal") {
      schemes.push({
        id: 1,
        name: "PM-KISAN",
        fullName: "Pradhan Mantri Kisan Samman Nidhi",
        benefit: "₹6,000/year",
        confidence: 95,
        category: "Income Support",
        description: "Direct income support of ₹6,000 per year in three installments",
        eligibility: ["Small/Marginal farmer", "Valid land records", "Aadhaar linked bank account"],
        howToApply: "Apply through CSC or PM-KISAN portal with land documents",
      });
    }
    
    if (data.requirements.includes("insurance")) {
      schemes.push({
        id: 2,
        name: "PMFBY",
        fullName: "Pradhan Mantri Fasal Bima Yojana",
        benefit: "Crop Insurance",
        confidence: 88,
        category: "Insurance",
        description: "Comprehensive crop insurance against natural calamities",
        eligibility: ["Crop cultivator", "Enrolled before sowing season", "Bank account required"],
        howToApply: "Apply through bank or CSC within enrollment window",
      });
    }
    
    if (data.requirements.includes("irrigation") && data.landOwnership === "owned") {
      schemes.push({
        id: 3,
        name: "PMKSY",
        fullName: "Pradhan Mantri Krishi Sinchayee Yojana",
        benefit: "Irrigation Subsidy",
        confidence: 82,
        category: "Irrigation",
        description: "Subsidy for micro-irrigation and water harvesting",
        eligibility: ["Land owner", "Agricultural land", "Valid land documents"],
        howToApply: "Apply through state agriculture department",
      });
    }
    
    if (data.requirements.includes("credit")) {
      schemes.push({
        id: 4,
        name: "KCC",
        fullName: "Kisan Credit Card",
        benefit: "Low-interest Loan",
        confidence: 90,
        category: "Credit",
        description: "Credit facility up to ₹3 lakh at 4% interest",
        eligibility: ["Farmer with land", "No loan default history", "Bank account"],
        howToApply: "Apply at any scheduled bank with land documents",
      });
    }
    
    if (data.crops.includes("wheat") || data.crops.includes("rice")) {
      schemes.push({
        id: 5,
        name: "MSP Procurement",
        fullName: "Minimum Support Price",
        benefit: "Guaranteed Price",
        confidence: 85,
        category: "Price Support",
        description: "Government procurement at minimum support price",
        eligibility: ["Cultivator of notified crops", "Registration on e-NAM"],
        howToApply: "Register at local APMC mandi",
      });
    }
    
    // Add some default schemes
    schemes.push({
      id: 6,
      name: "Soil Health Card",
      fullName: "Soil Health Card Scheme",
      benefit: "Free Soil Testing",
      confidence: 100,
      category: "Advisory",
      description: "Free soil testing and fertilizer recommendations",
      eligibility: ["Any farmer", "Agricultural land"],
      howToApply: "Contact local Krishi Vigyan Kendra",
    });
    
    return schemes;
  };

  return (
    <div className="min-h-screen bg-background">
      <AppNavbar currentStep={currentStep} steps={steps} />
      
      {/* Progress bar */}
      <div className="fixed top-20 left-0 right-0 z-40">
        <div className="container mx-auto px-4">
          <div className="h-1 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-accent"
              initial={{ width: "0%" }}
              animate={{ width: `${(currentStep / steps.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="pt-28 pb-20">
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
            >
              <ProfileStep 
                profile={profile}
                onComplete={handleProfileComplete} 
              />
            </motion.div>
          )}
          
          {currentStep === 2 && (
            <motion.div
              key="matching"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
            >
              <MatchingStep 
                profile={profile}
                isMatching={isMatching}
              />
            </motion.div>
          )}
          
          {currentStep === 3 && (
            <motion.div
              key="schemes"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
            >
              <SchemesStep 
                schemes={matchedSchemes}
                profile={profile}
                onBack={() => setCurrentStep(1)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* AI Assistant */}
      <ChatAssistant schemes={matchedSchemes} profile={profile} />
      
      {/* Background elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-64 h-64 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-accent/5 blur-3xl" />
      </div>
    </div>
  );
};

export default Dashboard;
