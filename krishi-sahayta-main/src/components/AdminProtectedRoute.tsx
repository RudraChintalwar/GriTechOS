import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface AdminProtectedRouteProps {
    children: React.ReactNode;
}

const AdminProtectedRoute = ({ children }: AdminProtectedRouteProps) => {
    const { user, userRole, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                    <Loader2 className="w-8 h-8 text-primary" />
                </motion.div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/auth" replace />;
    }

    if (userRole !== "admin") {
        return <Navigate to="/app" replace />;
    }

    return <>{children}</>;
};

export default AdminProtectedRoute;
