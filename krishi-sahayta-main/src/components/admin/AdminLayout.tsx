import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    LayoutDashboard,
    Users,
    FileText,
    LogOut,
    Menu,
    X,
    Leaf,
    ChevronRight,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
    { path: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
    { path: "/admin/users", label: "Users", icon: Users },
    { path: "/admin/schemes", label: "Schemes", icon: FileText },
];

const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { user, signOut } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await signOut();
        navigate("/auth", { replace: true });
    };

    return (
        <div className="min-h-screen bg-background flex">
            {/* Sidebar overlay on mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed md:sticky top-0 left-0 z-50 h-screen w-64 bg-card border-r border-border flex flex-col transition-transform md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                {/* Logo */}
                <div className="flex items-center gap-3 px-6 py-5 border-b border-border">
                    <div className="w-9 h-9 rounded-lg bg-gradient-accent flex items-center justify-center">
                        <Leaf className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                        <p className="font-bold text-foreground text-sm">GriTech OS</p>
                        <p className="text-xs text-muted-foreground">Admin Panel</p>
                    </div>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="ml-auto md:hidden text-muted-foreground"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Nav links */}
                <nav className="flex-1 px-3 py-4 space-y-1">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.end}
                            onClick={() => setSidebarOpen(false)}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                }`
                            }
                        >
                            <item.icon className="w-5 h-5" />
                            {item.label}
                            <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100" />
                        </NavLink>
                    ))}
                </nav>

                {/* User & logout */}
                <div className="px-3 py-4 border-t border-border space-y-2">
                    <div className="px-4 py-2">
                        <p className="text-xs text-muted-foreground">Signed in as</p>
                        <p className="text-sm font-medium text-foreground truncate">
                            {user?.email || user?.phoneNumber || "Admin"}
                        </p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all"
                    >
                        <LogOut className="w-5 h-5" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 flex flex-col min-h-screen">
                {/* Top bar */}
                <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border px-6 py-4 flex items-center gap-4">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="md:hidden text-muted-foreground hover:text-foreground"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    <h1 className="text-lg font-bold font-display text-foreground">
                        Admin Panel
                    </h1>
                </header>

                {/* Page content */}
                <main className="flex-1 p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
