import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Trash2, Edit3, X, Save, Loader2 } from "lucide-react";
import { db } from "@/lib/firebase";
import {
    collection,
    getDocs,
    doc,
    updateDoc,
    deleteDoc,
    query,
    orderBy,
} from "firebase/firestore";
import { toast } from "sonner";

interface UserData {
    id: string;
    email?: string;
    phoneNumber?: string;
    role: string;
    createdAt: string;
    updatedAt?: string;
    profile?: {
        district?: string;
        farmerType?: string;
        landOwnership?: string;
        crops?: string[];
    };
}

const AdminUsers = () => {
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [editingUser, setEditingUser] = useState<UserData | null>(null);
    const [editForm, setEditForm] = useState({ district: "", farmerType: "", role: "" });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
            const snap = await getDocs(q);
            setUsers(snap.docs.map((d) => ({ id: d.id, ...d.data() })) as UserData[]);
        } catch (err) {
            console.error("Error fetching users:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (user: UserData) => {
        setEditingUser(user);
        setEditForm({
            district: user.profile?.district || "",
            farmerType: user.profile?.farmerType || "",
            role: user.role,
        });
    };

    const handleSaveEdit = async () => {
        if (!editingUser) return;
        try {
            await updateDoc(doc(db, "users", editingUser.id), {
                role: editForm.role,
                "profile.district": editForm.district,
                "profile.farmerType": editForm.farmerType,
                updatedAt: new Date().toISOString(),
            });
            toast.success("User updated successfully");
            setEditingUser(null);
            fetchUsers();
        } catch (err) {
            console.error("Error updating user:", err);
            toast.error("Failed to update user");
        }
    };

    const handleDelete = async (userId: string) => {
        if (!confirm("Are you sure you want to delete this user? This cannot be undone.")) return;
        try {
            await deleteDoc(doc(db, "users", userId));
            toast.success("User deleted");
            setUsers(users.filter((u) => u.id !== userId));
        } catch (err) {
            console.error("Error deleting user:", err);
            toast.error("Failed to delete user");
        }
    };

    const filtered = users.filter((u) => {
        const term = search.toLowerCase();
        return (
            (u.email?.toLowerCase().includes(term) || false) ||
            (u.phoneNumber?.includes(term) || false) ||
            (u.profile?.district?.toLowerCase().includes(term) || false) ||
            u.role.toLowerCase().includes(term)
        );
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold font-display text-foreground">Users</h2>
                    <p className="text-muted-foreground text-sm mt-1">{users.length} registered users</p>
                </div>
                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search users..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    />
                </div>
            </div>

            {/* Users table */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border bg-muted/30">
                                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">User</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Role</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">District</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden lg:table-cell">Joined</th>
                                <th className="text-right px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {filtered.map((user) => (
                                <tr key={user.id} className="hover:bg-muted/20 transition-colors">
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-medium text-foreground truncate max-w-[200px]">
                                            {user.email || user.phoneNumber || user.id.slice(0, 12)}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {user.profile?.farmerType || "No profile"}
                                        </p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${user.role === "admin"
                                                ? "bg-blue-500/10 text-blue-400"
                                                : "bg-green-500/10 text-green-400"
                                            }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 hidden md:table-cell">
                                        <span className="text-sm text-muted-foreground">
                                            {user.profile?.district || "—"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 hidden lg:table-cell">
                                        <span className="text-sm text-muted-foreground">
                                            {user.createdAt
                                                ? new Date(user.createdAt).toLocaleDateString()
                                                : "—"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => handleEdit(user)}
                                                className="p-2 rounded-lg hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
                                                title="Edit"
                                            >
                                                <Edit3 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user.id)}
                                                className="p-2 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                                        No users found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit modal */}
            <AnimatePresence>
                {editingUser && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
                        onClick={() => setEditingUser(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                            className="bg-card border border-border rounded-xl p-6 w-full max-w-md space-y-4"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center">
                                <h3 className="font-bold text-foreground">Edit User</h3>
                                <button onClick={() => setEditingUser(null)} className="text-muted-foreground hover:text-foreground">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <label className="text-xs text-muted-foreground mb-1 block">Role</label>
                                    <select
                                        value={editForm.role}
                                        onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                    >
                                        <option value="farmer">Farmer</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs text-muted-foreground mb-1 block">District</label>
                                    <input
                                        type="text"
                                        value={editForm.district}
                                        onChange={(e) => setEditForm({ ...editForm, district: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-muted-foreground mb-1 block">Farmer Type</label>
                                    <select
                                        value={editForm.farmerType}
                                        onChange={(e) => setEditForm({ ...editForm, farmerType: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                    >
                                        <option value="">—</option>
                                        <option value="marginal">Marginal</option>
                                        <option value="small">Small</option>
                                        <option value="medium">Medium</option>
                                        <option value="large">Large</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={handleSaveEdit}
                                    className="flex-1 btn-hero py-2.5 text-sm flex items-center justify-center gap-2"
                                >
                                    <Save className="w-4 h-4" />
                                    Save
                                </button>
                                <button
                                    onClick={() => setEditingUser(null)}
                                    className="flex-1 btn-secondary py-2.5 text-sm"
                                >
                                    Cancel
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminUsers;
