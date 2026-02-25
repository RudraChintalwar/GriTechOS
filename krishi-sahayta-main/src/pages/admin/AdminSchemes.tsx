import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus,
    Search,
    Trash2,
    Edit3,
    X,
    Save,
    Loader2,
    ExternalLink,
} from "lucide-react";
import { db } from "@/lib/firebase";
import {
    collection,
    getDocs,
    doc,
    setDoc,
    deleteDoc,
} from "firebase/firestore";
import { SchemeData } from "@/data/schemesData";
import { toast } from "sonner";

interface SchemeDoc extends SchemeData {
    firestoreId?: string;
}

const emptyScheme: Omit<SchemeDoc, "scheme_id"> = {
    scheme_name: "",
    state: "Maharashtra",
    category: "",
    farmer_type: [],
    land_ownership_required: false,
    crop_type: ["All"],
    benefit: "",
    eligibility: "",
    required_documents: [],
    application_link: "",
};

const categories = [
    "Income Support",
    "Insurance",
    "Irrigation",
    "Solar",
    "Machinery",
    "Horticulture",
    "Development",
    "Livestock",
    "Credit",
    "Advisory",
];

const farmerTypeOptions = ["All", "Small", "Marginal", "Medium", "Large"];

const AdminSchemes = () => {
    const [schemes, setSchemes] = useState<SchemeDoc[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [form, setForm] = useState<any>({ ...emptyScheme });
    const [docInput, setDocInput] = useState("");

    useEffect(() => {
        fetchSchemes();
    }, []);

    const fetchSchemes = async () => {
        try {
            const snap = await getDocs(collection(db, "schemes"));
            setSchemes(
                snap.docs.map((d) => ({
                    firestoreId: d.id,
                    ...d.data(),
                })) as SchemeDoc[]
            );
        } catch (err) {
            console.error("Error fetching schemes:", err);
        } finally {
            setLoading(false);
        }
    };

    const openAddForm = () => {
        const maxId = schemes.reduce((max, s) => Math.max(max, s.scheme_id || 0), 0);
        setForm({ ...emptyScheme, scheme_id: maxId + 1 });
        setEditingId(null);
        setDocInput("");
        setShowForm(true);
    };

    const openEditForm = (scheme: SchemeDoc) => {
        setForm({ ...scheme });
        setEditingId(scheme.scheme_id);
        setDocInput(scheme.required_documents?.join(", ") || "");
        setShowForm(true);
    };

    const handleSave = async () => {
        if (!form.scheme_name || !form.category) {
            toast.error("Scheme name and category are required");
            return;
        }

        const docs = docInput
            .split(",")
            .map((d: string) => d.trim())
            .filter(Boolean);
        const data = {
            ...form,
            required_documents: docs,
            farmer_type: form.farmer_type.length ? form.farmer_type : ["All"],
        };

        try {
            const docId = String(form.scheme_id);
            await setDoc(doc(db, "schemes", docId), data);
            toast.success(editingId ? "Scheme updated!" : "Scheme added!");
            setShowForm(false);
            fetchSchemes();
        } catch (err) {
            console.error("Save error:", err);
            toast.error("Failed to save scheme");
        }
    };

    const handleDelete = async (scheme: SchemeDoc) => {
        if (!confirm(`Delete "${scheme.scheme_name}"? This cannot be undone.`)) return;
        try {
            await deleteDoc(doc(db, "schemes", String(scheme.scheme_id)));
            toast.success("Scheme deleted");
            setSchemes(schemes.filter((s) => s.scheme_id !== scheme.scheme_id));
        } catch (err) {
            console.error("Delete error:", err);
            toast.error("Failed to delete");
        }
    };

    const toggleFarmerType = (type: string) => {
        const current: string[] = form.farmer_type || [];
        if (current.includes(type)) {
            setForm({ ...form, farmer_type: current.filter((t: string) => t !== type) });
        } else {
            setForm({ ...form, farmer_type: [...current, type] });
        }
    };

    const filtered = schemes.filter((s) => {
        const term = search.toLowerCase();
        return (
            s.scheme_name.toLowerCase().includes(term) ||
            s.category?.toLowerCase().includes(term) ||
            s.benefit?.toLowerCase().includes(term)
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
                    <h2 className="text-2xl font-bold font-display text-foreground">Schemes</h2>
                    <p className="text-muted-foreground text-sm mt-1">{schemes.length} schemes available</p>
                </div>
                <button
                    onClick={openAddForm}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Add Scheme
                </button>
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search schemes..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
            </div>

            {/* Schemes table */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border bg-muted/30">
                                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">ID</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Scheme</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">Category</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden lg:table-cell">Benefit</th>
                                <th className="text-right px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {filtered.map((scheme) => (
                                <tr key={scheme.scheme_id} className="hover:bg-muted/20 transition-colors">
                                    <td className="px-6 py-4 text-sm text-muted-foreground">{scheme.scheme_id}</td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-medium text-foreground">{scheme.scheme_name}</p>
                                        <p className="text-xs text-muted-foreground truncate max-w-[250px]">
                                            {scheme.application_link}
                                        </p>
                                    </td>
                                    <td className="px-6 py-4 hidden md:table-cell">
                                        <span className="text-xs px-2.5 py-1 rounded-full bg-accent/10 text-accent-foreground font-medium">
                                            {scheme.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 hidden lg:table-cell">
                                        <p className="text-sm text-muted-foreground truncate max-w-[200px]">{scheme.benefit}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => openEditForm(scheme)}
                                                className="p-2 rounded-lg hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
                                                title="Edit"
                                            >
                                                <Edit3 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(scheme)}
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
                                        No schemes found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add/Edit modal */}
            <AnimatePresence>
                {showForm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
                        onClick={() => setShowForm(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                            className="bg-card border border-border rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto space-y-4 custom-scrollbar"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center">
                                <h3 className="font-bold text-foreground text-lg">
                                    {editingId ? "Edit Scheme" : "Add New Scheme"}
                                </h3>
                                <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-3">
                                {/* Scheme Name */}
                                <div>
                                    <label className="text-xs text-muted-foreground mb-1 block">Scheme Name *</label>
                                    <input
                                        type="text"
                                        value={form.scheme_name}
                                        onChange={(e) => setForm({ ...form, scheme_name: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                        placeholder="e.g., PM-KISAN Samman Nidhi"
                                    />
                                </div>

                                {/* Category */}
                                <div>
                                    <label className="text-xs text-muted-foreground mb-1 block">Category *</label>
                                    <select
                                        value={form.category}
                                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                    >
                                        <option value="">Select category</option>
                                        {categories.map((c) => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Benefit */}
                                <div>
                                    <label className="text-xs text-muted-foreground mb-1 block">Benefit</label>
                                    <input
                                        type="text"
                                        value={form.benefit}
                                        onChange={(e) => setForm({ ...form, benefit: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                        placeholder="e.g., ₹6,000 per year"
                                    />
                                </div>

                                {/* Eligibility */}
                                <div>
                                    <label className="text-xs text-muted-foreground mb-1 block">Eligibility</label>
                                    <textarea
                                        value={form.eligibility}
                                        onChange={(e) => setForm({ ...form, eligibility: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                                        rows={2}
                                        placeholder="Who is eligible?"
                                    />
                                </div>

                                {/* Farmer Type */}
                                <div>
                                    <label className="text-xs text-muted-foreground mb-1 block">Farmer Type</label>
                                    <div className="flex flex-wrap gap-2">
                                        {farmerTypeOptions.map((ft) => (
                                            <button
                                                key={ft}
                                                type="button"
                                                onClick={() => toggleFarmerType(ft)}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${form.farmer_type?.includes(ft)
                                                        ? "bg-primary text-primary-foreground border-primary"
                                                        : "bg-muted/50 text-muted-foreground border-border hover:border-primary"
                                                    }`}
                                            >
                                                {ft}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Land required */}
                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        checked={form.land_ownership_required}
                                        onChange={(e) => setForm({ ...form, land_ownership_required: e.target.checked })}
                                        className="w-4 h-4 rounded border-border"
                                    />
                                    <label className="text-sm text-foreground">Land ownership required</label>
                                </div>

                                {/* Required Documents */}
                                <div>
                                    <label className="text-xs text-muted-foreground mb-1 block">
                                        Required Documents (comma-separated)
                                    </label>
                                    <input
                                        type="text"
                                        value={docInput}
                                        onChange={(e) => setDocInput(e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                        placeholder="Aadhaar Card, Land Record, Bank Passbook"
                                    />
                                </div>

                                {/* Application Link */}
                                <div>
                                    <label className="text-xs text-muted-foreground mb-1 block flex items-center gap-1">
                                        <ExternalLink className="w-3 h-3" />
                                        Application/Registration Link
                                    </label>
                                    <input
                                        type="url"
                                        value={form.application_link}
                                        onChange={(e) => setForm({ ...form, application_link: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={handleSave}
                                    className="flex-1 btn-hero py-2.5 text-sm flex items-center justify-center gap-2"
                                >
                                    <Save className="w-4 h-4" />
                                    {editingId ? "Update Scheme" : "Add Scheme"}
                                </button>
                                <button
                                    onClick={() => setShowForm(false)}
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

export default AdminSchemes;
