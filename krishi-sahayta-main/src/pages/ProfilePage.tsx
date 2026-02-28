import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import AppNavbar from "@/components/app/AppNavbar";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { toast } from "sonner";
import {
    MapPin,
    Tractor,
    Home,
    Users,
    CircleDot,
    Sprout,
    Save,
    ArrowLeft,
    Loader2
} from "lucide-react";
import districtTranslations, { getDistrictName } from "@/i18n/districtTranslations";
import { FarmerProfile } from "@/types";

const ProfilePage = () => {
    const { t, language } = useLanguage();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState<FarmerProfile>({
        district: "",
        farmerType: "",
        landOwnership: "",
        landSize: 0,
        crops: [],
        requirements: [],
    });

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

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user) return;
            try {
                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists() && docSnap.data().profile) {
                    setFormData(docSnap.data().profile);
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [user]);

    const handleToggleCrop = (cropId: string) => {
        setFormData(prev => ({
            ...prev,
            crops: prev.crops.includes(cropId)
                ? prev.crops.filter(id => id !== cropId)
                : [...prev.crops, cropId]
        }));
    };

    const handleSave = async () => {
        if (!user) return;
        setSaving(true);
        try {
            await setDoc(doc(db, "users", user.uid), {
                profile: formData,
                updatedAt: new Date().toISOString()
            }, { merge: true });
            toast.success(t("profile.updateProfileDesc") || "Profile updated successfully!");
            navigate("/app");
        } catch (error) {
            console.error("Error saving profile:", error);
            toast.error("Failed to save profile. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <AppNavbar currentStep={1} steps={[{ id: 1, name: "Profile", description: "Manage your profile" }]} />

            <main className="container mx-auto px-4 py-8 mt-24 max-w-3xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 flex items-center justify-between"
                >
                    <div>
                        <button
                            onClick={() => navigate("/app")}
                            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            {t("profile.back")}
                        </button>
                        <h1 className="text-3xl md:text-4xl font-bold font-display">
                            {t("profile.updateProfile")}
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            Update your personal farmer profile details
                        </p>
                    </div>
                </motion.div>

                <div className="space-y-8">
                    {/* Section 1: Location */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="glass-card p-6"
                    >
                        <h2 className="text-xl font-bold font-display mb-4 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-primary" />
                            {t("profile.districtTitle")}
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {Object.keys(districtTranslations).map((districtId) => (
                                <button
                                    key={districtId}
                                    onClick={() => setFormData(prev => ({ ...prev, district: districtId }))}
                                    className={`p-3 rounded-xl border text-left transition-all ${formData.district === districtId
                                        ? "border-primary bg-primary/10 text-primary"
                                        : "border-border bg-card/50 hover:border-primary/50 text-foreground"
                                        }`}
                                >
                                    <span className="text-sm font-medium">
                                        {getDistrictName(districtId, language)}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </motion.div>

                    {/* Section 2: Farmer Type */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="glass-card p-6"
                    >
                        <h2 className="text-xl font-bold font-display mb-4 flex items-center gap-2">
                            <Tractor className="w-5 h-5 text-primary" />
                            {t("profile.farmerTypeTitle")}
                        </h2>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium mb-3 text-foreground">
                                    Land Ownership
                                </label>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    {landOptions.map((option) => (
                                        <button
                                            key={option.id}
                                            onClick={() => setFormData(prev => ({ ...prev, landOwnership: option.id }))}
                                            className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${formData.landOwnership === option.id
                                                ? "border-primary bg-primary/10 text-primary"
                                                : "border-border bg-card/50 hover:border-primary/50 text-muted-foreground"
                                                }`}
                                        >
                                            <option.icon className="w-6 h-6" />
                                            <span className="text-sm font-medium">{option.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-3 text-foreground">
                                    Farmer Category
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {[
                                        { id: "marginal", label: t("profile.marginal"), desc: t("profile.marginalDesc") },
                                        { id: "small", label: t("profile.small"), desc: t("profile.smallDesc") },
                                        { id: "medium", label: t("profile.medium"), desc: t("profile.mediumDesc") },
                                        { id: "large", label: t("profile.large"), desc: t("profile.largeDesc") }
                                    ].map((type) => (
                                        <button
                                            key={type.id}
                                            onClick={() => setFormData(prev => ({ ...prev, farmerType: type.id }))}
                                            className={`p-4 rounded-xl border text-left transition-all ${formData.farmerType === type.id
                                                ? "border-primary bg-primary/10"
                                                : "border-border bg-card/50 hover:border-primary/50"
                                                }`}
                                        >
                                            <div className={`font-medium mb-1 ${formData.farmerType === type.id ? "text-primary" : "text-foreground"}`}>
                                                {type.label}
                                            </div>
                                            <div className="text-xs text-muted-foreground">{type.desc}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Section 3: Crops */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="glass-card p-6"
                    >
                        <h2 className="text-xl font-bold font-display mb-4 flex items-center gap-2">
                            <Sprout className="w-5 h-5 text-primary" />
                            {t("profile.cropsTitle")}
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {crops.map((crop) => {
                                const isSelected = formData.crops.includes(crop.id);
                                return (
                                    <button
                                        key={crop.id}
                                        onClick={() => handleToggleCrop(crop.id)}
                                        className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${isSelected
                                            ? "border-primary bg-primary/10"
                                            : "border-border bg-card/50 hover:border-primary/50"
                                            }`}
                                    >
                                        <span className="text-2xl" role="img" aria-label={crop.label}>
                                            {crop.emoji}
                                        </span>
                                        <span className={`text-sm font-medium ${isSelected ? "text-primary" : "text-muted-foreground"}`}>
                                            {crop.label}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>

                    {/* Action Button */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="flex justify-end pt-4"
                    >
                        <button
                            onClick={handleSave}
                            disabled={saving || !formData.district || !formData.farmerType || formData.crops.length === 0}
                            className="px-8 py-3 rounded-xl bg-primary text-primary-foreground font-semibold flex items-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50"
                        >
                            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                            {t("auth.saveProfile")}
                        </button>
                    </motion.div>
                </div>
            </main>
        </div>
    );
};

export default ProfilePage;
