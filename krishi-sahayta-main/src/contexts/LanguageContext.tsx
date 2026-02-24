import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { translations, Language, TranslationStrings } from "@/i18n/translations";

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguageState] = useState<Language>(() => {
        const saved = localStorage.getItem("agrodbt-language");
        return (saved as Language) || "en";
    });

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem("agrodbt-language", lang);
    };

    const t = useCallback(
        (key: string, params?: Record<string, string | number>): string => {
            let value = translations[language][key] || translations["en"][key] || key;

            // Replace {param} placeholders
            if (params) {
                Object.entries(params).forEach(([k, v]) => {
                    value = value.replace(`{${k}}`, String(v));
                });
            }

            return value;
        },
        [language]
    );

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
}

export type { Language };
