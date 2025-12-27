import { createContext } from "react";

export type Language = "he" | "en";

export type LanguageContextType ={
    language: Language
    changeLanguage: (lang: Language) => void
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);