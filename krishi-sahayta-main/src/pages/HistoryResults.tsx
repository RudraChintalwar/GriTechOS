import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { db } from "@/lib/firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { FarmerProfile } from "@/types";
import { SchemeData } from "@/data/schemesData";
import { matchSchemes, MatchedScheme } from "@/lib/schemeEngine";
import AppNavbar from "@/components/app/AppNavbar";
import SchemesStep from "@/components/app/SchemesStep";
import ChatAssistant from "@/components/app/ChatAssistant";

const HistoryResults = () => {
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();
    const { t, language } = useLanguage();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<FarmerProfile>({
        district: "", farmerType: "", landOwnership: "", landSize: 0, crops: [], requirements: [],
    });
    const [matchedSchemes, setMatchedSchemes] = useState<MatchedScheme[]>([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const load = async () => {
            if (!user || !id) return;
            try {
                // Load the search history entry
                const histDoc = await getDoc(doc(db, "users", user.uid, "searchHistory", id));
                if (!histDoc.exists()) {
                    setError("Search history entry not found.");
                    setLoading(false);
                    return;
                }
                const criteria = histDoc.data().criteria as FarmerProfile;
                setProfile(criteria);

                // Load all schemes
                const schemesSnap = await getDocs(collection(db, "schemes"));
                const allSchemes = schemesSnap.docs.map((d) => d.data() as SchemeData);

                // Re-run matching
                const results = matchSchemes(criteria, allSchemes, language);
                setMatchedSchemes(results);
            } catch (err) {
                console.error("Error loading history results:", err);
                setError("Failed to load results.");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [user, id, language]);

    const steps = [
        { id: 1, name: t("userDash.searchHistory"), description: t("userDash.searchDesc") },
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
                <p className="text-muted-foreground">{error}</p>
                <button
                    onClick={() => navigate("/app")}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium"
                >
                    {t("profile.back")}
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <AppNavbar currentStep={1} steps={steps} />

            <main className="pt-28 pb-20">
                <SchemesStep
                    schemes={matchedSchemes}
                    profile={profile}
                    onBack={() => navigate("/app")}
                />
            </main>

            <ChatAssistant schemes={matchedSchemes} profile={profile} />

            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-1/4 -left-32 w-64 h-64 rounded-full bg-primary/5 blur-3xl" />
                <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-accent/5 blur-3xl" />
            </div>
        </div>
    );
};

export default HistoryResults;
