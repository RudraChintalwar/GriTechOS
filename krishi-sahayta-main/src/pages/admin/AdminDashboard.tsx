import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, FileText, TrendingUp, Clock } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";

interface StatCard {
    label: string;
    value: string | number;
    icon: React.ElementType;
    color: string;
}

interface RecentUser {
    id: string;
    email?: string;
    phoneNumber?: string;
    role: string;
    createdAt: string;
}

const AdminDashboard = () => {
    const [stats, setStats] = useState<StatCard[]>([]);
    const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Fetch users
                const usersSnap = await getDocs(collection(db, "users"));
                const totalUsers = usersSnap.size;
                const farmers = usersSnap.docs.filter(d => d.data().role === "farmer").length;
                const admins = usersSnap.docs.filter(d => d.data().role === "admin").length;

                // Fetch schemes
                const schemesSnap = await getDocs(collection(db, "schemes"));
                const totalSchemes = schemesSnap.size;

                setStats([
                    { label: "Total Users", value: totalUsers, icon: Users, color: "from-blue-500 to-cyan-500" },
                    { label: "Farmers", value: farmers, icon: TrendingUp, color: "from-green-500 to-emerald-500" },
                    { label: "Admins", value: admins, icon: Users, color: "from-purple-500 to-pink-500" },
                    { label: "Total Schemes", value: totalSchemes || "Not seeded", icon: FileText, color: "from-orange-500 to-amber-500" },
                ]);

                // Recent users
                const recentQuery = query(
                    collection(db, "users"),
                    orderBy("createdAt", "desc"),
                    limit(5)
                );
                const recentSnap = await getDocs(recentQuery);
                setRecentUsers(
                    recentSnap.docs.map((d) => ({
                        id: d.id,
                        ...d.data(),
                    })) as RecentUser[]
                );
            } catch (err) {
                console.error("Error fetching stats:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold font-display text-foreground">Dashboard</h2>
                <p className="text-muted-foreground text-sm mt-1">Overview of your AgroDBT platform</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-card border border-border rounded-xl p-6"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                                <stat.icon className="w-5 h-5 text-white" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* Recent Users */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-border flex items-center gap-2">
                    <Clock className="w-5 h-5 text-muted-foreground" />
                    <h3 className="font-bold text-foreground">Recent Users</h3>
                </div>
                <div className="divide-y divide-border">
                    {recentUsers.length === 0 ? (
                        <p className="px-6 py-8 text-center text-muted-foreground">No users yet</p>
                    ) : (
                        recentUsers.map((u) => (
                            <div key={u.id} className="px-6 py-4 flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-foreground">
                                        {u.email || u.phoneNumber || u.id}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {new Date(u.createdAt).toLocaleDateString()} · {u.role}
                                    </p>
                                </div>
                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${u.role === "admin"
                                        ? "bg-blue-500/10 text-blue-400"
                                        : "bg-green-500/10 text-green-400"
                                    }`}>
                                    {u.role}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
