import { useContext } from "react";
import { LanguageContext } from "../services/LanguageContext";

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error("useLanguage must be LanguageProvider");
    }
    return context;
}
