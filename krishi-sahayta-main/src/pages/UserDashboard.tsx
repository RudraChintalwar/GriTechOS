import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
    Search, UserCog, Bot, MapPin, Tractor, Sprout,
    Clock, ChevronRight, Leaf, LogOut, Loader2, Trash2,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { db } from "@/lib/firebase";
import { doc, getDoc, collection, getDocs, query, orderBy, limit, deleteDoc } from "firebase/firestore";
import { FarmerProfile, SearchHistoryEntry } from "@/types";
import { SchemeData } from "@/data/schemesData";
import { resolveI18n } from "@/lib/schemeEngine";
import { getDistrictName } from "@/i18n/districtTranslations";
import ChatAssistant from "@/components/app/ChatAssistant";
import LanguageSelector from "@/components/LanguageSelector";

const UserDashboard = () => {
    const { t, language } = useLanguage();
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const [profile, setProfile] = useState<FarmerProfile | null>(null);
    const [history, setHistory] = useState<SearchHistoryEntry[]>([]);
    const [allSchemes, setAllSchemes] = useState<SchemeData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            if (!user) return;
            try {
                // Load profile
                const snap = await getDoc(doc(db, "users", user.uid));
                if (snap.exists() && snap.data().profile) {
                    setProfile(snap.data().profile as FarmerProfile);
                }

                // Load search history (latest 10)
                const histQ = query(
                    collection(db, "users", user.uid, "searchHistory"),
                    orderBy("timestamp", "desc"),
                    limit(10)
                );
                const histSnap = await getDocs(histQ);
                setHistory(
                    histSnap.docs.map((d) => ({ id: d.id, ...d.data() } as SearchHistoryEntry))
                );

                // Load all schemes for translating history names
                const schemesSnap = await getDocs(collection(db, "schemes"));
                setAllSchemes(schemesSnap.docs.map((d) => d.data() as SchemeData));
            } catch (err) {
                console.error("Error loading dashboard data:", err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [user]);

    const handleDeleteHistory = async (entryId: string) => {
        if (!user) return;
        try {
            await deleteDoc(doc(db, "users", user.uid, "searchHistory", entryId));
            setHistory((prev) => prev.filter((h) => h.id !== entryId));
        } catch (err) {
            console.error("Error deleting history:", err);
        }
    };

    const handleSignOut = async () => {
        await signOut();
        navigate("/");
    };

    // Resolve a translated scheme name using current language
    const getTranslatedSchemeName = (schemeId: string | undefined, fallbackName: string) => {
        if (allSchemes.length === 0) return fallbackName;

        // 1. Try by scheme_id first (new entries)
        if (schemeId) {
            const scheme = allSchemes.find((s) => String(s.scheme_id) === String(schemeId));
            if (scheme) return resolveI18n(scheme, language as any).name;
        }

        // 2. Fallback: match saved name against all language variants (old entries)
        const scheme = allSchemes.find((s) => {
            if (s.scheme_name === fallbackName) return true;
            if (s.i18n) {
                for (const lang of ["en", "hi", "mr"] as const) {
                    if (s.i18n[lang]?.name === fallbackName) return true;
                }
            }
            return false;
        });
        if (scheme) return resolveI18n(scheme, language as any).name;

        return fallbackName;
    };

    const formatDate = (ts: string) => {
        const d = new Date(ts);
        return d.toLocaleDateString(language === "hi" ? "hi-IN" : language === "mr" ? "mr-IN" : "en-IN", {
            day: "numeric", month: "short", year: "numeric",
            hour: "2-digit", minute: "2-digit",
        });
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
            {/* Top navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/50">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                            <Leaf className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-display font-bold text-lg text-foreground">GriTech OS</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <LanguageSelector />
                        <button
                            onClick={handleSignOut}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="hidden sm:inline">{t("userDash.signOut")}</span>
                        </button>
                    </div>
                </div>
            </nav>

            <main className="container mx-auto px-4 pt-24 pb-20 max-w-5xl">
                {/* Welcome header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10"
                >
                    <h1 className="text-3xl md:text-4xl font-bold font-display mb-2">
                        {t("userDash.welcome")} <span className="text-gradient">👋</span>
                    </h1>
                    <p className="text-foreground/70 text-lg">
                        {t("userDash.subtitle")}
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Left column: Profile card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="lg:col-span-1"
                    >
                        <div className="glass-card p-6 h-full border-primary/20">
                            <div className="flex items-center justify-between mb-5">
                                <h2 className="text-lg font-bold font-display flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500/20 to-green-500/20 flex items-center justify-center">
                                        <span className="text-xl">👨‍🌾</span>
                                    </div>
                                    {t("userDash.myProfile")}
                                </h2>
                                <button
                                    onClick={() => navigate("/profile")}
                                    className="text-xs text-primary hover:underline flex items-center gap-1"
                                >
                                    <UserCog className="w-3 h-3" />
                                    {t("userDash.edit")}
                                </button>
                            </div>

                            {profile ? (
                                <div className="space-y-4">
                                    {profile.district && (
                                        <div className="flex items-start gap-3">
                                            <MapPin className="w-4 h-4 text-emerald-500 mt-0.5" />
                                            <div>
                                                <p className="text-xs text-muted-foreground">{t("userDash.district")}</p>
                                                <p className="text-sm font-medium text-foreground">
                                                    {getDistrictName(profile.district, language)}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                    {profile.farmerType && (
                                        <div className="flex items-start gap-3">
                                            <Tractor className="w-4 h-4 text-blue-500 mt-0.5" />
                                            <div>
                                                <p className="text-xs text-muted-foreground">{t("userDash.farmerType")}</p>
                                                <p className="text-sm font-medium text-foreground capitalize">
                                                    {t(`profile.${profile.farmerType}`)}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                    {profile.crops.length > 0 && (
                                        <div className="flex items-start gap-3">
                                            <Sprout className="w-4 h-4 text-green-500 mt-0.5" />
                                            <div>
                                                <p className="text-xs text-muted-foreground">{t("userDash.crops")}</p>
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                    {profile.crops.map((c) => (
                                                        <span key={c} className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-medium">
                                                            {t(`profile.${c}`)}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-6">
                                    <p className="text-sm text-muted-foreground mb-3">{t("userDash.noProfile")}</p>
                                    <button
                                        onClick={() => navigate("/profile")}
                                        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium"
                                    >
                                        {t("userDash.setupProfile")}
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Right column: Quick actions + history */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Quick Actions */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <h2 className="text-lg font-bold font-display mb-4">{t("userDash.quickActions")}</h2>
                            <div className="grid sm:grid-cols-3 gap-4">
                                <motion.button
                                    onClick={() => navigate("/app/search")}
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="glass-card p-5 text-left group cursor-pointer"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                        <Search className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="font-semibold text-foreground mb-1">{t("userDash.searchSchemes")}</h3>
                                    <p className="text-xs text-muted-foreground">{t("userDash.searchDesc")}</p>
                                </motion.button>

                                <motion.button
                                    onClick={() => navigate("/profile")}
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="glass-card p-5 text-left group cursor-pointer"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                        <UserCog className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="font-semibold text-foreground mb-1">{t("userDash.updateProfile")}</h3>
                                    <p className="text-xs text-muted-foreground">{t("userDash.updateDesc")}</p>
                                </motion.button>

                                <motion.button
                                    onClick={() => {
                                        // Trigger the floating chat by finding the chat button
                                        const chatBtn = document.querySelector('[data-chat-trigger]') as HTMLButtonElement;
                                        if (chatBtn) chatBtn.click();
                                    }}
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="glass-card p-5 text-left group cursor-pointer"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                        <Bot className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="font-semibold text-foreground mb-1">{t("userDash.askAI")}</h3>
                                    <p className="text-xs text-muted-foreground">{t("userDash.askDesc")}</p>
                                </motion.button>
                            </div>
                        </motion.div>

                        {/* Search History */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <h2 className="text-lg font-bold font-display mb-4 flex items-center gap-2">
                                <Clock className="w-5 h-5 text-amber-500" />
                                {t("userDash.searchHistory")}
                            </h2>

                            {history.length > 0 ? (
                                <div className="space-y-3">
                                    {history.map((entry, idx) => (
                                        <motion.div
                                            key={entry.id || idx}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.05 * idx }}
                                            className="glass-card p-4 flex items-center justify-between group hover:border-primary/30 transition-colors"
                                        >
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-sm font-medium text-foreground">
                                                        {getDistrictName(entry.criteria.district, language)}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground">•</span>
                                                    <span className="text-xs text-muted-foreground capitalize">
                                                        {t(`profile.${entry.criteria.farmerType}`)}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                                    <span>{entry.resultCount} {t("userDash.schemesFound")}</span>
                                                    <span>•</span>
                                                    <span>{formatDate(entry.timestamp)}</span>
                                                </div>
                                                {entry.topSchemes.length > 0 && (
                                                    <div className="flex flex-wrap gap-1 mt-2">
                                                        {entry.topSchemes.map((name, i) => (
                                                            <span key={i} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-medium">
                                                                {getTranslatedSchemeName(entry.topSchemeIds?.[i], name)}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2 ml-3">
                                                <button
                                                    onClick={() => handleDeleteHistory(entry.id!)}
                                                    className="p-2 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all"
                                                    title={t("userDash.delete")}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => navigate(`/app/history/${entry.id}`)}
                                                    className="p-2 rounded-lg text-primary/70 hover:text-primary hover:bg-primary/10 transition-colors"
                                                >
                                                    <ChevronRight className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="glass-card p-8 text-center">
                                    <Search className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
                                    <p className="text-muted-foreground text-sm">{t("userDash.noHistory")}</p>
                                    <button
                                        onClick={() => navigate("/app/search")}
                                        className="mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors"
                                    >
                                        {t("userDash.startSearch")}
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </main>

            {/* Chat Assistant */}
            <ChatAssistant schemes={[]} profile={profile || { district: "", farmerType: "", landOwnership: "", landSize: 0, crops: [], requirements: [] }} />

            {/* Background decoration */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-1/4 -left-32 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl" />
                <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-green-500/10 blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
            </div>
        </div>
    );
};

export default UserDashboard;
