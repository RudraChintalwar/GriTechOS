import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AppNavbar from "@/components/app/AppNavbar";
import ProfileStep from "@/components/app/ProfileStep";
import MatchingStep from "@/components/app/MatchingStep";
import SchemesStep from "@/components/app/SchemesStep";
import ChatAssistant from "@/components/app/ChatAssistant";
import { schemesData } from "@/data/schemesData";
import { matchSchemes, MatchedScheme } from "@/lib/schemeEngine";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { db } from "@/lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";



export interface FarmerProfile {
  district: string;
  farmerType: string;
  landOwnership: string;
  landSize: number;
  crops: string[];
  requirements: string[];
}

const Dashboard = () => {
  const { t, language } = useLanguage();

  const steps = [
    { id: 1, name: t("dashboard.profile"), description: t("dashboard.profileDesc") },
    { id: 2, name: t("dashboard.matching"), description: t("dashboard.matchingDesc") },
    { id: 3, name: t("dashboard.schemes"), description: t("dashboard.schemesDesc") },
  ];

  const [currentStep, setCurrentStep] = useState(1);
  const [profile, setProfile] = useState<FarmerProfile>({
    district: "",
    farmerType: "",
    landOwnership: "",
    landSize: 0,
    crops: [],
    requirements: [],
  });
  const [matchedSchemes, setMatchedSchemes] = useState<MatchedScheme[]>([]);
  const [isMatching, setIsMatching] = useState(false);
  const { user } = useAuth();


  // Load saved profile on mount
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      try {
        const profileRef = doc(db, "users", user.uid);
        const profileSnap = await getDoc(profileRef);
        if (profileSnap.exists()) {
          const savedProfile = profileSnap.data().profile as FarmerProfile;
          if (savedProfile && savedProfile.farmerType) {
            setProfile(savedProfile);
          }
        }
      } catch (err) {
        console.error("Error loading profile:", err);
      }
    };
    loadProfile();
  }, [user]);

  // Re-run matching when language changes (to update scheme text)
  useEffect(() => {
    if (currentStep === 3 && profile.farmerType) {
      const results = matchSchemes(profile, schemesData, language);
      setMatchedSchemes(results);
    }
  }, [language]);

  const handleProfileComplete = async (data: FarmerProfile) => {
    setProfile(data);
    setCurrentStep(2);
    setIsMatching(true);

    // Save profile to Firestore
    if (user) {
      try {
        await setDoc(
          doc(db, "users", user.uid),
          {
            profile: data,
            phoneNumber: user.phoneNumber,
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        );
      } catch (err) {
        console.error("Error saving profile:", err);
      }
    }

    // Run real rule-based matching
    setTimeout(() => {
      const results = matchSchemes(data, schemesData, language);
      setIsMatching(false);
      setMatchedSchemes(results);
      setCurrentStep(3);
    }, 2500);
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
              <MatchingStep profile={profile} isMatching={isMatching} />
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
