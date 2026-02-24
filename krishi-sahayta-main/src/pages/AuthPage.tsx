import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Phone,
    ArrowRight,
    Leaf,
    Shield,
    Loader2,
    CheckCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth, setupRecaptchaVerifier, sendOtp, verifyOtp } from "@/contexts/AuthContext";
import { RecaptchaVerifier, ConfirmationResult } from "firebase/auth";

const AuthPage = () => {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [step, setStep] = useState<"phone" | "otp">("phone");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [confirmationResult, setConfirmationResult] =
        useState<ConfirmationResult | null>(null);
    const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);
    const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
    const navigate = useNavigate();
    const { user } = useAuth();

    // Redirect if already logged in
    useEffect(() => {
        if (user) {
            navigate("/app", { replace: true });
        }
    }, [user, navigate]);

    // Set up reCAPTCHA verifier once on mount
    // Per Firebase docs: create RecaptchaVerifier before signInWithPhoneNumber
    useEffect(() => {
        if (!recaptchaVerifierRef.current) {
            recaptchaVerifierRef.current = setupRecaptchaVerifier("recaptcha-container");
        }

        return () => {
            // Clean up the verifier on unmount
            if (recaptchaVerifierRef.current) {
                recaptchaVerifierRef.current.clear();
                recaptchaVerifierRef.current = null;
            }
        };
    }, []);

    const handleSendOtp = async () => {
        if (phoneNumber.length < 10) {
            setError("Please enter a valid 10-digit phone number");
            return;
        }

        setLoading(true);
        setError("");

        try {
            // Format phone number with country code (+91 for India)
            const formattedNumber = phoneNumber.startsWith("+91")
                ? phoneNumber
                : `+91${phoneNumber}`;

            // Per Firebase docs: pass phone number and RecaptchaVerifier to signInWithPhoneNumber
            if (!recaptchaVerifierRef.current) {
                recaptchaVerifierRef.current = setupRecaptchaVerifier("recaptcha-container");
            }

            const result = await sendOtp(formattedNumber, recaptchaVerifierRef.current);
            // SMS sent — store confirmationResult to use with confirm(code)
            setConfirmationResult(result);
            setStep("otp");
        } catch (err: any) {
            console.error("OTP send error:", err);

            // Per Firebase docs: reset reCAPTCHA on error so user can try again
            if (recaptchaVerifierRef.current) {
                try {
                    recaptchaVerifierRef.current.clear();
                } catch (e) {
                    // ignore clear errors
                }
                recaptchaVerifierRef.current = null;
            }
            // Re-create verifier for next attempt
            recaptchaVerifierRef.current = setupRecaptchaVerifier("recaptcha-container");

            if (err.code === "auth/too-many-requests") {
                setError("Too many attempts. Please try again later.");
            } else if (err.code === "auth/invalid-phone-number") {
                setError("Invalid phone number. Please check and try again.");
            } else if (err.code === "auth/quota-exceeded") {
                setError("SMS quota exceeded. Please try again later.");
            } else {
                setError(err.message || "Failed to send OTP. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        const otpString = otp.join("");
        if (otpString.length !== 6) {
            setError("Please enter a valid 6-digit OTP");
            return;
        }

        if (!confirmationResult) {
            setError("Session expired. Please request a new OTP.");
            setStep("phone");
            return;
        }

        setLoading(true);
        setError("");

        try {
            // Per Firebase docs: call confirmationResult.confirm(code)
            await verifyOtp(confirmationResult, otpString);
            // User signed in successfully — onAuthStateChanged will trigger redirect
            navigate("/app", { replace: true });
        } catch (err: any) {
            console.error("OTP verify error:", err);
            if (err.code === "auth/invalid-verification-code") {
                setError("Invalid OTP. Please check and try again.");
            } else if (err.code === "auth/code-expired") {
                setError("OTP expired. Please request a new one.");
            } else {
                setError("Verification failed. Please try again.");
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

        // Auto-focus next input
        if (value && index < 5) {
            otpRefs.current[index + 1]?.focus();
        }
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
        if (e.key === "Enter" && otp.join("").length === 6) {
            handleVerifyOtp();
        }
    };

    return (
        <div className="min-h-screen bg-background relative overflow-hidden">
            {/* Background decorations */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
                <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-accent/5 blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/3 blur-3xl" />
            </div>

            <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
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
                        {/* Decorative top gradient */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-accent" />

                        <AnimatePresence mode="wait">
                            {step === "phone" ? (
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
                                            Welcome, Farmer!
                                        </h2>
                                        <p className="text-muted-foreground text-sm">
                                            Enter your phone number to get started with personalized
                                            scheme recommendations
                                        </p>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="relative">
                                            <div className="flex items-center gap-2 p-4 rounded-xl bg-muted/50 border border-border focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent transition-all">
                                                <span className="text-muted-foreground font-medium text-sm whitespace-nowrap">
                                                    🇮🇳 +91
                                                </span>
                                                <input
                                                    type="tel"
                                                    value={phoneNumber}
                                                    onChange={(e) => {
                                                        const val = e.target.value
                                                            .replace(/\D/g, "")
                                                            .slice(0, 10);
                                                        setPhoneNumber(val);
                                                        setError("");
                                                    }}
                                                    placeholder="Enter 10-digit number"
                                                    className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none text-lg tracking-wider"
                                                    maxLength={10}
                                                />
                                            </div>
                                        </div>

                                        {error && (
                                            <motion.p
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="text-sm text-red-400 text-center"
                                            >
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
                                                <>
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                    Sending OTP...
                                                </>
                                            ) : (
                                                <>
                                                    Send OTP
                                                    <ArrowRight className="w-5 h-5" />
                                                </>
                                            )}
                                        </motion.button>
                                    </div>

                                    <div className="flex items-center gap-2 justify-center text-xs text-muted-foreground">
                                        <Shield className="w-3.5 h-3.5" />
                                        <span>Your data is securely handled via Firebase Auth</span>
                                    </div>
                                </motion.div>
                            ) : (
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
                                            Verify OTP
                                        </h2>
                                        <p className="text-muted-foreground text-sm">
                                            Enter the 6-digit code sent to +91 {phoneNumber}
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
                                                    onChange={(e) =>
                                                        handleOtpChange(
                                                            index,
                                                            e.target.value.replace(/\D/g, "")
                                                        )
                                                    }
                                                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                                    className="w-12 h-14 rounded-xl bg-muted/50 border border-border text-center text-xl font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                                />
                                            ))}
                                        </div>

                                        {error && (
                                            <motion.p
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="text-sm text-red-400 text-center"
                                            >
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
                                                <>
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                    Verifying...
                                                </>
                                            ) : (
                                                <>
                                                    Verify & Continue
                                                    <ArrowRight className="w-5 h-5" />
                                                </>
                                            )}
                                        </motion.button>

                                        <button
                                            onClick={() => {
                                                setStep("phone");
                                                setOtp(["", "", "", "", "", ""]);
                                                setError("");
                                                setConfirmationResult(null);
                                                // Re-create verifier for new attempt
                                                if (recaptchaVerifierRef.current) {
                                                    try {
                                                        recaptchaVerifierRef.current.clear();
                                                    } catch (e) { }
                                                    recaptchaVerifierRef.current = null;
                                                }
                                                recaptchaVerifierRef.current =
                                                    setupRecaptchaVerifier("recaptcha-container");
                                            }}
                                            className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            ← Change phone number
                                        </button>
                                    </div>
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
                        🔒 Encrypted
                    </span>
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/50">
                        🏛️ Maharashtra Govt. Schemes
                    </span>
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/50">
                        🤖 AI Assisted
                    </span>
                </motion.div>
            </div>

            {/* Invisible reCAPTCHA container — Firebase will render here */}
            <div id="recaptcha-container" />
        </div>
    );
};

export default AuthPage;
