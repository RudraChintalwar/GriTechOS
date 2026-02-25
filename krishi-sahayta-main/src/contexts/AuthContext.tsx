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
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    ConfirmationResult,
    onAuthStateChanged,
    signOut as firebaseSignOut,
} from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

export type UserRole = "farmer" | "admin" | null;

const ADMIN_CODE = "AgroDBT7898";

interface AuthContextType {
    user: User | null;
    userRole: UserRole;
    loading: boolean;
    signOut: () => Promise<void>;
    signUpWithEmail: (
        email: string,
        password: string,
        role: "farmer" | "admin",
        adminCode?: string
    ) => Promise<void>;
    signInWithEmail: (email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [userRole, setUserRole] = useState<UserRole>(null);
    const [loading, setLoading] = useState(true);

    // Fetch role from Firestore whenever user changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                try {
                    const userDoc = await getDoc(doc(db, "users", currentUser.uid));
                    if (userDoc.exists()) {
                        setUserRole(userDoc.data().role || "farmer");
                    } else {
                        // First-time user without Firestore doc — default farmer
                        setUserRole("farmer");
                    }
                } catch (err) {
                    console.error("Error fetching user role:", err);
                    setUserRole("farmer");
                }
            } else {
                setUserRole(null);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const signOut = async () => {
        await firebaseSignOut(auth);
        setUserRole(null);
    };

    /**
     * Sign up with email & password.
     * Validates admin code if role is admin.
     * Creates Firestore user doc with role.
     */
    const signUpWithEmail = async (
        email: string,
        password: string,
        role: "farmer" | "admin",
        adminCode?: string
    ) => {
        // Validate admin code
        if (role === "admin") {
            if (!adminCode || adminCode !== ADMIN_CODE) {
                throw new Error("Invalid admin code. Access denied.");
            }
        }

        const result = await createUserWithEmailAndPassword(auth, email, password);

        // Write user doc to Firestore
        await setDoc(doc(db, "users", result.user.uid), {
            role,
            email,
            phoneNumber: null,
            profile: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        });

        setUserRole(role);
    };

    /**
     * Sign in with email & password.
     * Fetches role from Firestore after login.
     */
    const signInWithEmail = async (email: string, password: string) => {
        const result = await signInWithEmailAndPassword(auth, email, password);

        // Fetch role
        const userDoc = await getDoc(doc(db, "users", result.user.uid));
        if (userDoc.exists()) {
            setUserRole(userDoc.data().role || "farmer");
        } else {
            setUserRole("farmer");
        }
    };

    return (
        <AuthContext.Provider
            value={{ user, userRole, loading, signOut, signUpWithEmail, signInWithEmail }}
        >
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
 */
export function setupRecaptchaVerifier(elementId: string): RecaptchaVerifier {
    const verifier = new RecaptchaVerifier(auth, elementId, {
        size: "invisible",
        callback: () => { },
        "expired-callback": () => {
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

/**
 * Write or update user role in Firestore after phone OTP login.
 * If user doc exists, merges. If not, creates.
 */
export async function writeUserRoleAfterPhoneAuth(
    uid: string,
    phoneNumber: string,
    role: "farmer" | "admin",
    adminCode?: string
): Promise<void> {
    // Validate admin code if admin
    if (role === "admin") {
        if (!adminCode || adminCode !== ADMIN_CODE) {
            throw new Error("Invalid admin code. Access denied.");
        }
    }

    // Check if user already exists
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
        // Existing user — update
        await setDoc(
            doc(db, "users", uid),
            {
                phoneNumber,
                updatedAt: new Date().toISOString(),
            },
            { merge: true }
        );
    } else {
        // New user — create
        await setDoc(doc(db, "users", uid), {
            role,
            email: null,
            phoneNumber,
            profile: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        });
    }
}
