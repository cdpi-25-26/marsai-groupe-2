import { createContext, useContext, useState } from "react";
import fr from "../locales/fr.json";
import en from "../locales/en.json";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState("fr");

  const translations = language === "fr" ? fr : en;

  const t = (key) => {
    const keys = key.split(".");
    let value = translations;

    keys.forEach(k => {
      value = value?.[k];
    });

    return value || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
