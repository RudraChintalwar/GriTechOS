import {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from "react";
import {
    User,
    RecaptchaVerifier,
    signInWithPhoneNumber,
    ConfirmationResult,
    onAuthStateChanged,
    signOut as firebaseSignOut,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const signOut = async () => {
        await firebaseSignOut(auth);
    };

    return (
        <AuthContext.Provider value={{ user, loading, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

/**
 * Sets up invisible reCAPTCHA verifier on a DOM element.
 * Must be called ONCE before signInWithPhoneNumber.
 * Per Firebase docs: create RecaptchaVerifier with size: 'invisible'.
 */
export function setupRecaptchaVerifier(elementId: string): RecaptchaVerifier {
    const verifier = new RecaptchaVerifier(auth, elementId, {
        size: "invisible",
        callback: () => {
            // reCAPTCHA solved — signInWithPhoneNumber will proceed
        },
        "expired-callback": () => {
            // reCAPTCHA expired — user needs to solve again
            console.warn("reCAPTCHA expired. Please try again.");
        },
    });
    return verifier;
}

/**
 * Sends OTP to the given phone number.
 * phoneNumber must include country code, e.g. "+919876543210"
 */
export async function sendOtp(
    phoneNumber: string,
    appVerifier: RecaptchaVerifier
): Promise<ConfirmationResult> {
    const confirmationResult = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        appVerifier
    );
    return confirmationResult;
}

/**
 * Verifies the OTP code using the ConfirmationResult from sendOtp.
 */
export async function verifyOtp(
    confirmationResult: ConfirmationResult,
    code: string
): Promise<User> {
    const result = await confirmationResult.confirm(code);
    return result.user;
}
