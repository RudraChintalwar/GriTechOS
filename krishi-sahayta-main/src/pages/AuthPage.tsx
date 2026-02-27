import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Phone,
    Mail,
    ArrowRight,
    Leaf,
    Shield,
    Loader2,
    CheckCircle,
    Tractor,
    Settings,
    MapPin,
    Sprout,
    Wheat,
    Home,
    Users,
    CircleDot,
    ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
    useAuth,
    setupRecaptchaVerifier,
    sendOtp,
    verifyOtp,
    writeUserRoleAfterPhoneAuth,
} from "@/contexts/AuthContext";
import { RecaptchaVerifier, ConfirmationResult } from "firebase/auth";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSelector from "@/components/LanguageSelector";
import { db } from "@/lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { getDistrictName } from "@/i18n/districtTranslations";

type Role = "farmer" | "admin";
type AuthMethod = "phone" | "email";
type Step = "role" | "method" | "phone" | "otp" | "email" | "farmerProfile";

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

const AuthPage = () => {
    const [role, setRole] = useState<Role | null>(null);
    const [authMethod, setAuthMethod] = useState<AuthMethod | null>(null);
    const [step, setStep] = useState<Step>("role");
    const [isSignUp, setIsSignUp] = useState(false);

    // Phone auth
    const [phoneNumber, setPhoneNumber] = useState("");
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [confirmationResult, setConfirmationResult] =
        useState<ConfirmationResult | null>(null);
    const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);
    const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Email auth
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [adminCode, setAdminCode] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Farmer profile (collected during signup)
    const [profileSection, setProfileSection] = useState(0);
    const [profileData, setProfileData] = useState({
        district: "",
        farmerType: "",
        landOwnership: "",
        crops: [] as string[],
    });

    const navigate = useNavigate();
    const { user, userRole, signUpWithEmail, signInWithEmail } = useAuth();
    const { t, language } = useLanguage();

    // Redirect if logged in — but NOT if on profile step
    useEffect(() => {
        if (user && userRole && step !== "farmerProfile") {
            // Check if farmer already has profile
            if (userRole === "farmer") {
                const checkProfile = async () => {
                    try {
                        const snap = await getDoc(doc(db, "users", user.uid));
                        if (snap.exists() && snap.data().profile?.farmerType) {
                            navigate("/app", { replace: true });
                        } else if (!isSignUp) {
                            // Login but no profile — go to app anyway
                            navigate("/app", { replace: true });
                        } else {
                            // New signup — show profile step
                            setStep("farmerProfile");
                        }
                    } catch {
                        navigate("/app", { replace: true });
                    }
                };
                checkProfile();
            } else {
                navigate("/admin", { replace: true });
            }
        }
    }, [user, userRole]);

    // Set up reCAPTCHA verifier once on mount
    useEffect(() => {
        if (!recaptchaVerifierRef.current) {
            recaptchaVerifierRef.current = setupRecaptchaVerifier("recaptcha-container");
        }
        return () => {
            if (recaptchaVerifierRef.current) {
                recaptchaVerifierRef.current.clear();
                recaptchaVerifierRef.current = null;
            }
        };
    }, []);

    const handleRoleSelect = (selectedRole: Role) => {
        setRole(selectedRole);
        setStep("method");
        setError("");
    };

    const handleMethodSelect = (method: AuthMethod) => {
        setAuthMethod(method);
        setStep(method === "phone" ? "phone" : "email");
        setError("");
    };

    // ─── Phone OTP Flow ───
    const handleSendOtp = async () => {
        if (phoneNumber.length < 10) {
            setError(t("auth.invalidPhone"));
            return;
        }
        setLoading(true);
        setError("");
        try {
            const formattedNumber = phoneNumber.startsWith("+91")
                ? phoneNumber
                : `+91${phoneNumber}`;
            if (!recaptchaVerifierRef.current) {
                recaptchaVerifierRef.current = setupRecaptchaVerifier("recaptcha-container");
            }
            const result = await sendOtp(formattedNumber, recaptchaVerifierRef.current);
            setConfirmationResult(result);
            setStep("otp");
        } catch (err: any) {
            console.error("OTP send error:", err);
            if (recaptchaVerifierRef.current) {
                try { recaptchaVerifierRef.current.clear(); } catch { }
                recaptchaVerifierRef.current = null;
            }
            recaptchaVerifierRef.current = setupRecaptchaVerifier("recaptcha-container");

            if (err.code === "auth/too-many-requests") setError(t("auth.tooMany"));
            else if (err.code === "auth/invalid-phone-number") setError(t("auth.invalidNumber"));
            else if (err.code === "auth/quota-exceeded") setError(t("auth.quotaExceeded"));
            else setError(err.message || t("auth.otpFailed"));
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        const otpString = otp.join("");
        if (otpString.length !== 6) {
            setError(t("auth.invalidOtp"));
            return;
        }
        if (!confirmationResult) {
            setError(t("auth.sessionExpired"));
            setStep("phone");
            return;
        }
        setLoading(true);
        setError("");
        try {
            const result = await verifyOtp(confirmationResult, otpString);
            // Write role to Firestore
            const formattedNumber = phoneNumber.startsWith("+91") ? phoneNumber : `+91${phoneNumber}`;
            await writeUserRoleAfterPhoneAuth(
                result.uid,
                formattedNumber,
                role!,
                role === "admin" ? adminCode : undefined
            );
            // Auth state change will handle redirect via useEffect
        } catch (err: any) {
            console.error("OTP verify error:", err);
            if (err.message?.includes("admin code")) {
                setError(t("auth.invalidAdminCode"));
            } else if (err.code === "auth/invalid-verification-code") {
                setError(t("auth.invalidCode"));
            } else if (err.code === "auth/code-expired") {
                setError(t("auth.codeExpired"));
            } else {
                setError(t("auth.verifyFailed"));
            }
        } finally {
            setLoading(false);
        }
    };

    const handleOtpChange = (index: number, value: string) => {
        if (value.length > 1) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        if (value && index < 5) otpRefs.current[index + 1]?.focus();
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
        if (e.key === "Enter" && otp.join("").length === 6) handleVerifyOtp();
    };

    // ─── Email/Password Flow ───
    const handleEmailAuth = async () => {
        if (!email || !email.includes("@")) {
            setError(t("auth.emailRequired"));
            return;
        }
        if (password.length < 6) {
            setError(t("auth.passwordMin"));
            return;
        }
        setLoading(true);
        setError("");
        try {
            if (isSignUp) {
                await signUpWithEmail(
                    email,
                    password,
                    role!,
                    role === "admin" ? adminCode : undefined
                );
            } else {
                await signInWithEmail(email, password);
            }
            // Auth state change will handle redirect via useEffect
        } catch (err: any) {
            console.error("Email auth error:", err);
            if (err.message?.includes("admin code") || err.message?.includes("Access denied")) {
                setError(t("auth.invalidAdminCode"));
            } else if (err.code === "auth/email-already-in-use") {
                setError("Email already registered. Try signing in instead.");
            } else if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
                setError("Invalid email or password. Try again or sign up.");
            } else if (err.code === "auth/weak-password") {
                setError(t("auth.passwordMin"));
            } else {
                setError(err.message || "Authentication failed. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const goBack = () => {
        setError("");
        if (step === "method") { setStep("role"); setRole(null); }
        else if (step === "phone" || step === "email") { setStep("method"); setAuthMethod(null); }
        else if (step === "otp") {
            setStep("phone");
            setOtp(["", "", "", "", "", ""]);
            setConfirmationResult(null);
            if (recaptchaVerifierRef.current) {
                try { recaptchaVerifierRef.current.clear(); } catch { }
                recaptchaVerifierRef.current = null;
            }
            recaptchaVerifierRef.current = setupRecaptchaVerifier("recaptcha-container");
        }
    };

    const handleSaveProfile = async () => {
        if (!user) return;
        setLoading(true);
        try {
            await setDoc(
                doc(db, "users", user.uid),
                {
                    profile: {
                        district: profileData.district,
                        farmerType: profileData.farmerType,
                        landOwnership: profileData.landOwnership,
                        landSize: 0,
                        crops: profileData.crops,
                        requirements: [],
                    },
                    updatedAt: new Date().toISOString(),
                },
                { merge: true }
            );
            navigate("/app", { replace: true });
        } catch (err) {
            console.error("Error saving profile:", err);
            navigate("/app", { replace: true });
        } finally {
            setLoading(false);
        }
    };

    const profileCanProceed = () => {
        if (profileSection === 0) return profileData.district !== "";
        if (profileSection === 1) return profileData.farmerType !== "" && profileData.landOwnership !== "";
        if (profileSection === 2) return profileData.crops.length > 0;
        return false;
    };

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

    return (
        <div className="min-h-screen bg-background relative overflow-hidden">
            {/* Background decorations */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
                <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-accent/5 blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/3 blur-3xl" />
            </div>

            <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
                {/* Language selector — always visible top-right */}
                <div className="fixed top-4 right-4 z-50">
                    <LanguageSelector />
                </div>
                {/* Logo */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 mb-8"
                >
                    <motion.div
                        className="w-12 h-12 rounded-xl bg-gradient-accent flex items-center justify-center"
                        animate={{ rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 4, repeat: Infinity }}
                    >
                        <Leaf className="w-6 h-6 text-primary-foreground" />
                    </motion.div>
                    <span className="text-2xl font-bold font-display text-foreground">
                        GriTech OS
                    </span>
                </motion.div>

                {/* Auth Card */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="w-full max-w-md"
                >
                    <div className="glass-card p-8 relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-accent" />

                        <AnimatePresence mode="wait">
                            {/* ─── Step 1: Role Selection ─── */}
                            {step === "role" && (
                                <motion.div
                                    key="role"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <div className="text-center">
                                        <h2 className="text-2xl font-bold font-display text-foreground mb-2">
                                            {t("auth.chooseRole")}
                                        </h2>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <motion.button
                                            onClick={() => handleRoleSelect("farmer")}
                                            className="flex flex-col items-center gap-3 p-6 rounded-xl bg-muted/50 border-2 border-border hover:border-primary hover:bg-primary/5 transition-all"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <div className="w-14 h-14 rounded-full bg-green-500/10 flex items-center justify-center">
                                                <Tractor className="w-7 h-7 text-green-500" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-foreground">{t("auth.farmer")}</p>
                                                <p className="text-xs text-muted-foreground mt-1">{t("auth.farmerDesc")}</p>
                                            </div>
                                        </motion.button>

                                        <motion.button
                                            onClick={() => handleRoleSelect("admin")}
                                            className="flex flex-col items-center gap-3 p-6 rounded-xl bg-muted/50 border-2 border-border hover:border-primary hover:bg-primary/5 transition-all"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <div className="w-14 h-14 rounded-full bg-blue-500/10 flex items-center justify-center">
                                                <Settings className="w-7 h-7 text-blue-500" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-foreground">{t("auth.admin")}</p>
                                                <p className="text-xs text-muted-foreground mt-1">{t("auth.adminDesc")}</p>
                                            </div>
                                        </motion.button>
                                    </div>
                                </motion.div>
                            )}

                            {/* ─── Step 2: Auth Method Selection ─── */}
                            {step === "method" && (
                                <motion.div
                                    key="method"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <div className="text-center">
                                        <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-4 ${role === "admin" ? "bg-blue-500/10" : "bg-green-500/10"}`}>
                                            {role === "admin" ? <Settings className="w-6 h-6 text-blue-500" /> : <Tractor className="w-6 h-6 text-green-500" />}
                                        </div>
                                        <h2 className="text-2xl font-bold font-display text-foreground mb-2">
                                            {t("auth.chooseMethod")}
                                        </h2>
                                        <p className="text-sm text-muted-foreground">
                                            {role === "admin" ? t("auth.admin") : t("auth.farmer")}
                                        </p>
                                    </div>

                                    <div className="space-y-3">
                                        <motion.button
                                            onClick={() => handleMethodSelect("phone")}
                                            className="w-full flex items-center gap-4 p-4 rounded-xl bg-muted/50 border-2 border-border hover:border-primary hover:bg-primary/5 transition-all"
                                            whileHover={{ scale: 1.01 }}
                                            whileTap={{ scale: 0.99 }}
                                        >
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                <Phone className="w-5 h-5 text-primary" />
                                            </div>
                                            <span className="font-medium text-foreground">{t("auth.usePhone")}</span>
                                            <ArrowRight className="w-4 h-4 text-muted-foreground ml-auto" />
                                        </motion.button>

                                        <motion.button
                                            onClick={() => handleMethodSelect("email")}
                                            className="w-full flex items-center gap-4 p-4 rounded-xl bg-muted/50 border-2 border-border hover:border-primary hover:bg-primary/5 transition-all"
                                            whileHover={{ scale: 1.01 }}
                                            whileTap={{ scale: 0.99 }}
                                        >
                                            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                                                <Mail className="w-5 h-5 text-accent-foreground" />
                                            </div>
                                            <span className="font-medium text-foreground">{t("auth.useEmail")}</span>
                                            <ArrowRight className="w-4 h-4 text-muted-foreground ml-auto" />
                                        </motion.button>
                                    </div>

                                    <button onClick={goBack} className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors">
                                        {t("auth.backToRole")}
                                    </button>
                                </motion.div>
                            )}

                            {/* ─── Step 3a: Phone Number ─── */}
                            {step === "phone" && (
                                <motion.div
                                    key="phone"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <div className="text-center">
                                        <motion.div
                                            className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4"
                                            animate={{ scale: [1, 1.05, 1] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        >
                                            <Phone className="w-7 h-7 text-primary" />
                                        </motion.div>
                                        <h2 className="text-2xl font-bold font-display text-foreground mb-2">
                                            {t("auth.welcome")}
                                        </h2>
                                        <p className="text-muted-foreground text-sm">
                                            {t("auth.subtitle")}
                                        </p>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 p-4 rounded-xl bg-muted/50 border border-border focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent transition-all">
                                            <span className="text-muted-foreground font-medium text-sm whitespace-nowrap">🇮🇳 +91</span>
                                            <input
                                                type="tel"
                                                value={phoneNumber}
                                                onChange={(e) => {
                                                    setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 10));
                                                    setError("");
                                                }}
                                                placeholder={t("auth.phoneLabel")}
                                                className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none text-lg tracking-wider"
                                                maxLength={10}
                                            />
                                        </div>

                                        {/* Admin code for phone auth */}
                                        {role === "admin" && (
                                            <div className="flex items-center gap-2 p-4 rounded-xl bg-muted/50 border border-border focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent transition-all">
                                                <Shield className="w-4 h-4 text-muted-foreground" />
                                                <input
                                                    type="password"
                                                    value={adminCode}
                                                    onChange={(e) => { setAdminCode(e.target.value); setError(""); }}
                                                    placeholder={t("auth.adminCodePlaceholder")}
                                                    className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
                                                />
                                            </div>
                                        )}

                                        {error && (
                                            <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-red-400 text-center">
                                                {error}
                                            </motion.p>
                                        )}

                                        <motion.button
                                            id="sign-in-button"
                                            onClick={handleSendOtp}
                                            disabled={loading || phoneNumber.length < 10}
                                            className="w-full btn-hero py-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                            whileHover={!loading ? { scale: 1.02 } : {}}
                                            whileTap={!loading ? { scale: 0.98 } : {}}
                                        >
                                            {loading ? (
                                                <><Loader2 className="w-5 h-5 animate-spin" />{t("auth.sendingOtp")}</>
                                            ) : (
                                                <>{t("auth.sendOtp")}<ArrowRight className="w-5 h-5" /></>
                                            )}
                                        </motion.button>
                                    </div>

                                    <button onClick={goBack} className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors">
                                        {t("auth.backToMethod")}
                                    </button>
                                </motion.div>
                            )}

                            {/* ─── Step 3a-OTP: Verify ─── */}
                            {step === "otp" && (
                                <motion.div
                                    key="otp"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <div className="text-center">
                                        <motion.div
                                            className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4"
                                            animate={{ scale: [1, 1.05, 1] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        >
                                            <CheckCircle className="w-7 h-7 text-primary" />
                                        </motion.div>
                                        <h2 className="text-2xl font-bold font-display text-foreground mb-2">
                                            {t("auth.verifyTitle")}
                                        </h2>
                                        <p className="text-muted-foreground text-sm">
                                            {t("auth.verifySubtitle")} +91 {phoneNumber}
                                        </p>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex justify-center gap-3">
                                            {otp.map((digit, index) => (
                                                <input
                                                    key={index}
                                                    ref={(el) => (otpRefs.current[index] = el)}
                                                    type="text"
                                                    inputMode="numeric"
                                                    maxLength={1}
                                                    value={digit}
                                                    onChange={(e) => handleOtpChange(index, e.target.value.replace(/\D/g, ""))}
                                                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                                    className="w-12 h-14 rounded-xl bg-muted/50 border border-border text-center text-xl font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                                />
                                            ))}
                                        </div>

                                        {error && (
                                            <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-red-400 text-center">
                                                {error}
                                            </motion.p>
                                        )}

                                        <motion.button
                                            onClick={handleVerifyOtp}
                                            disabled={loading || otp.join("").length !== 6}
                                            className="w-full btn-hero py-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                            whileHover={!loading ? { scale: 1.02 } : {}}
                                            whileTap={!loading ? { scale: 0.98 } : {}}
                                        >
                                            {loading ? (
                                                <><Loader2 className="w-5 h-5 animate-spin" />{t("auth.verifying")}</>
                                            ) : (
                                                <>{t("auth.verify")}<ArrowRight className="w-5 h-5" /></>
                                            )}
                                        </motion.button>

                                        <button onClick={goBack} className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors">
                                            {t("auth.changePhone")}
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {/* ─── Step 3b: Email/Password ─── */}
                            {step === "email" && (
                                <motion.div
                                    key="email"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <div className="text-center">
                                        <motion.div
                                            className="w-16 h-16 mx-auto rounded-full bg-accent/10 flex items-center justify-center mb-4"
                                            animate={{ scale: [1, 1.05, 1] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        >
                                            <Mail className="w-7 h-7 text-accent-foreground" />
                                        </motion.div>
                                        <h2 className="text-2xl font-bold font-display text-foreground mb-2">
                                            {isSignUp ? t("auth.signUp") : t("auth.signIn")}
                                        </h2>
                                        <p className="text-muted-foreground text-sm">
                                            {role === "admin" ? t("auth.admin") : t("auth.farmer")}
                                        </p>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 p-4 rounded-xl bg-muted/50 border border-border focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent transition-all">
                                            <Mail className="w-4 h-4 text-muted-foreground" />
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                                                placeholder={t("auth.email")}
                                                className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
                                            />
                                        </div>

                                        <div className="flex items-center gap-2 p-4 rounded-xl bg-muted/50 border border-border focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent transition-all">
                                            <Shield className="w-4 h-4 text-muted-foreground" />
                                            <input
                                                type="password"
                                                value={password}
                                                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                                                placeholder={t("auth.password")}
                                                className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
                                            />
                                        </div>

                                        {/* Admin code — only on signup */}
                                        {role === "admin" && isSignUp && (
                                            <div className="flex items-center gap-2 p-4 rounded-xl bg-blue-500/5 border border-blue-500/20 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
                                                <Settings className="w-4 h-4 text-blue-400" />
                                                <input
                                                    type="password"
                                                    value={adminCode}
                                                    onChange={(e) => { setAdminCode(e.target.value); setError(""); }}
                                                    placeholder={t("auth.adminCodePlaceholder")}
                                                    className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
                                                />
                                            </div>
                                        )}

                                        {error && (
                                            <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-red-400 text-center">
                                                {error}
                                            </motion.p>
                                        )}

                                        <motion.button
                                            onClick={handleEmailAuth}
                                            disabled={loading || !email || password.length < 6}
                                            className="w-full btn-hero py-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                            whileHover={!loading ? { scale: 1.02 } : {}}
                                            whileTap={!loading ? { scale: 0.98 } : {}}
                                        >
                                            {loading ? (
                                                <><Loader2 className="w-5 h-5 animate-spin" />{isSignUp ? t("auth.signingUp") : t("auth.signingIn")}</>
                                            ) : (
                                                <>{isSignUp ? t("auth.signUp") : t("auth.signIn")}<ArrowRight className="w-5 h-5" /></>
                                            )}
                                        </motion.button>

                                        <button
                                            onClick={() => { setIsSignUp(!isSignUp); setError(""); }}
                                            className="w-full text-center text-sm text-primary hover:text-primary/80 transition-colors"
                                        >
                                            {isSignUp ? t("auth.haveAccount") : t("auth.noAccount")}
                                        </button>
                                    </div>

                                    <button onClick={goBack} className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors">
                                        {t("auth.backToMethod")}
                                    </button>
                                </motion.div>
                            )}

                            {/* ─── Step: Farmer Profile Collection ─── */}
                            {step === "farmerProfile" && (
                                <motion.div
                                    key="farmerProfile"
                                    initial={{ opacity: 0, x: 30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -30 }}
                                    className="space-y-5"
                                >
                                    <div className="text-center">
                                        <CheckCircle className="w-10 h-10 mx-auto text-green-400 mb-3" />
                                        <h2 className="text-xl font-bold font-display text-foreground">
                                            {t("auth.setupProfile")}
                                        </h2>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {t("auth.setupProfileDesc")}
                                        </p>
                                        <div className="flex justify-center gap-1.5 mt-3">
                                            {[0, 1, 2].map((i) => (
                                                <div
                                                    key={i}
                                                    className={`h-1 w-8 rounded-full transition-colors ${i <= profileSection ? "bg-primary" : "bg-muted"
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    <AnimatePresence mode="wait">
                                        {/* Sub-step 0: District */}
                                        {profileSection === 0 && (
                                            <motion.div key="p-district" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                                <p className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                                                    <MapPin className="w-4 h-4 text-primary" />
                                                    {t("profile.districtTitle")}
                                                </p>
                                                <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto custom-scrollbar pr-1">
                                                    {districts.map((d) => (
                                                        <button
                                                            key={d}
                                                            onClick={() => setProfileData({ ...profileData, district: d })}
                                                            className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${profileData.district === d
                                                                ? "bg-primary text-primary-foreground"
                                                                : "bg-muted/50 text-foreground hover:bg-muted"
                                                                }`}
                                                        >
                                                            {getDistrictName(d, language)}
                                                        </button>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}

                                        {/* Sub-step 1: Farmer type + Land */}
                                        {profileSection === 1 && (
                                            <motion.div key="p-type" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                                                <div>
                                                    <p className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                                                        <Tractor className="w-4 h-4 text-primary" />
                                                        {t("profile.farmerTypeTitle")}
                                                    </p>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        {farmerTypes.map((ft) => (
                                                            <button
                                                                key={ft.id}
                                                                onClick={() => setProfileData({ ...profileData, farmerType: ft.id })}
                                                                className={`p-3 rounded-lg text-left transition-all ${profileData.farmerType === ft.id
                                                                    ? "bg-primary text-primary-foreground"
                                                                    : "bg-muted/50 hover:bg-muted"
                                                                    }`}
                                                            >
                                                                <p className="text-sm font-medium">{ft.label}</p>
                                                                <p className={`text-xs mt-0.5 ${profileData.farmerType === ft.id ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{ft.description}</p>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                                                        <Home className="w-4 h-4 text-primary" />
                                                        {t("profile.landTitle")}
                                                    </p>
                                                    <div className="grid grid-cols-3 gap-2">
                                                        {landOptions.map((lo) => (
                                                            <button
                                                                key={lo.id}
                                                                onClick={() => setProfileData({ ...profileData, landOwnership: lo.id })}
                                                                className={`p-3 rounded-lg text-center transition-all ${profileData.landOwnership === lo.id
                                                                    ? "bg-primary text-primary-foreground"
                                                                    : "bg-muted/50 hover:bg-muted"
                                                                    }`}
                                                            >
                                                                <lo.icon className={`w-5 h-5 mx-auto mb-1 ${profileData.landOwnership === lo.id ? "" : "text-primary"}`} />
                                                                <p className="text-xs font-medium">{lo.label}</p>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}

                                        {/* Sub-step 2: Crops */}
                                        {profileSection === 2 && (
                                            <motion.div key="p-crops" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                                <p className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                                                    <Sprout className="w-4 h-4 text-primary" />
                                                    {t("profile.cropsTitle")}
                                                </p>
                                                <div className="grid grid-cols-4 gap-2">
                                                    {crops.map((crop) => {
                                                        const sel = profileData.crops.includes(crop.id);
                                                        return (
                                                            <button
                                                                key={crop.id}
                                                                onClick={() => {
                                                                    const newCrops = sel
                                                                        ? profileData.crops.filter((c) => c !== crop.id)
                                                                        : [...profileData.crops, crop.id];
                                                                    setProfileData({ ...profileData, crops: newCrops });
                                                                }}
                                                                className={`p-3 rounded-lg text-center transition-all ${sel
                                                                    ? "bg-primary text-primary-foreground"
                                                                    : "bg-muted/50 hover:bg-muted"
                                                                    }`}
                                                            >
                                                                <span className="text-2xl block">{crop.emoji}</span>
                                                                <p className="text-xs font-medium mt-1">{crop.label}</p>
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Profile step navigation */}
                                    <div className="flex gap-3 pt-2">
                                        {profileSection > 0 && (
                                            <button
                                                onClick={() => setProfileSection(profileSection - 1)}
                                                className="flex-1 px-4 py-2.5 rounded-xl bg-muted text-foreground text-sm font-medium hover:bg-muted/80 transition-colors"
                                            >
                                                {t("profile.back")}
                                            </button>
                                        )}
                                        {profileSection < 2 ? (
                                            <button
                                                onClick={() => setProfileSection(profileSection + 1)}
                                                disabled={!profileCanProceed()}
                                                className="flex-1 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-40 flex items-center justify-center gap-2"
                                            >
                                                {t("auth.next")}
                                                <ChevronRight className="w-4 h-4" />
                                            </button>
                                        ) : (
                                            <button
                                                onClick={handleSaveProfile}
                                                disabled={!profileCanProceed() || loading}
                                                className="flex-1 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-40 flex items-center justify-center gap-2"
                                            >
                                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                                                {t("auth.saveProfile")}
                                            </button>
                                        )}
                                    </div>

                                    <button
                                        onClick={() => navigate("/app", { replace: true })}
                                        className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {t("auth.skipProfile")}
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>

                {/* Trust badges */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-wrap justify-center gap-4 mt-8 text-xs text-muted-foreground"
                >
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/50">
                        {t("auth.encrypted")}
                    </span>
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/50">
                        {t("auth.maharashtra")}
                    </span>
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/50">
                        {t("auth.aiAssisted")}
                    </span>
                </motion.div>
            </div>

            {/* Invisible reCAPTCHA container */}
            <div id="recaptcha-container" />
        </div>
    );
};

export default AuthPage;
