import { useState } from "react";
import { LanguageContext } from "../services/LanguageContext";

type Language = "he" | "en"
type cmpProp = {
    children: React.ReactNode
}

export const LanguageProvider = ({ children }: cmpProp) => {
    const [language, setLanguage] = useState<Language>("en");

    const changeLanguage = (lang: Language) => {
        setLanguage(lang);
    };

    return (
        <LanguageContext.Provider value={{ language, changeLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
}