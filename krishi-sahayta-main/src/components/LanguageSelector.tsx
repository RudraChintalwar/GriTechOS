import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Globe } from "lucide-react";
import { useLanguage, Language } from "@/contexts/LanguageContext";

const languages: { id: Language; label: string; flag: string }[] = [
    { id: "en", label: "English", flag: "🇬🇧" },
    { id: "hi", label: "हिंदी", flag: "🇮🇳" },
    { id: "mr", label: "मराठी", flag: "🇮🇳" },
];

interface LanguageSelectorProps {
    variant?: "default" | "compact";
}

const LanguageSelector = ({ variant = "default" }: LanguageSelectorProps) => {
    const { language, setLanguage, t } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [dropdownPos, setDropdownPos] = useState({ top: 0, right: 0 });

    // Calculate dropdown position relative to viewport
    const updatePosition = useCallback(() => {
        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setDropdownPos({
                top: rect.bottom + 8,
                right: window.innerWidth - rect.right,
            });
        }
    }, []);

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                buttonRef.current && !buttonRef.current.contains(e.target as Node) &&
                dropdownRef.current && !dropdownRef.current.contains(e.target as Node)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Recalculate position on scroll/resize
    useEffect(() => {
        if (isOpen) {
            updatePosition();
            window.addEventListener("scroll", updatePosition, true);
            window.addEventListener("resize", updatePosition);
            return () => {
                window.removeEventListener("scroll", updatePosition, true);
                window.removeEventListener("resize", updatePosition);
            };
        }
    }, [isOpen, updatePosition]);

    const current = languages.find((l) => l.id === language)!;

    const handleToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!isOpen) updatePosition();
        setIsOpen(!isOpen);
    };

    return (
        <>
            <motion.button
                ref={buttonRef}
                onClick={handleToggle}
                className={`
          flex items-center gap-2 rounded-full transition-all
          ${variant === "compact"
                        ? "w-10 h-10 justify-center glass-card text-muted-foreground hover:text-foreground"
                        : "px-3 py-2 glass-card text-sm text-muted-foreground hover:text-foreground"
                    }
        `}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title={t("lang.label")}
            >
                <Globe className="w-4 h-4" />
                {variant !== "compact" && (
                    <span className="hidden sm:inline">{current.label}</span>
                )}
            </motion.button>

            {/* Portal dropdown — renders outside navbar DOM to avoid overflow:hidden clipping */}
            {createPortal(
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            ref={dropdownRef}
                            initial={{ opacity: 0, y: -8, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -8, scale: 0.95 }}
                            transition={{ duration: 0.15 }}
                            className="fixed min-w-[160px] rounded-xl overflow-hidden shadow-2xl border border-border bg-background/95 backdrop-blur-xl"
                            style={{
                                top: dropdownPos.top,
                                right: dropdownPos.right,
                                zIndex: 9999,
                            }}
                        >
                            {languages.map((lang) => (
                                <button
                                    key={lang.id}
                                    onClick={() => {
                                        setLanguage(lang.id);
                                        setIsOpen(false);
                                    }}
                                    className={`
                      w-full flex items-center gap-3 px-4 py-3 text-sm transition-all
                      ${language === lang.id
                                            ? "bg-primary/20 text-primary font-medium"
                                            : "text-foreground hover:bg-muted"
                                        }
                    `}
                                >
                                    <span className="text-lg">{lang.flag}</span>
                                    <span>{lang.label}</span>
                                    {language === lang.id && (
                                        <motion.span
                                            layoutId="lang-check"
                                            className="ml-auto text-primary"
                                        >
                                            ✓
                                        </motion.span>
                                    )}
                                </button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </>
    );
};

export default LanguageSelector;
