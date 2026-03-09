/**
 * useFestivalConfig — Context, Provider, and hook
 * Manages festival configuration in localStorage with /defaultConfig.json fallback.
 */

import { createContext, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "festivalConfig";

const FestivalConfigContext = createContext(null);

export function FestivalConfigProvider({ children }) {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load config on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setConfig(JSON.parse(stored));
        setLoading(false);
        return;
      } catch {
        // Corrupted data — fall through to fetch default
      }
    }

    // Fetch default config from public folder
    fetch("/defaultConfig.json")
      .then((r) => r.json())
      .then((data) => {
        setConfig(data);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      })
      .catch(() => {
        // Ultimate fallback: empty config with all sections visible
        const fallback = { general: {}, navbar: {} };
        setConfig(fallback);
      })
      .finally(() => setLoading(false));
  }, []);

  /**
   * Update a top-level section's config fields.
   * @param {string} sectionKey - e.g. "hero", "general"
   * @param {object} data - partial object to merge into that section
   */
  const updateConfig = (sectionKey, data) => {
    setConfig((prev) => {
      const next = { ...prev, [sectionKey]: { ...prev[sectionKey], ...data } };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  /** Reset to the default config from /defaultConfig.json */
  const resetConfig = async () => {
    try {
      const r = await fetch("/defaultConfig.json");
      const data = await r.json();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setConfig(data);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  /** Export current config as a JSON string */
  const exportConfig = () => {
    const blob = new Blob([JSON.stringify(config, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "festivalConfig.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  /** Import config from a JSON string or parsed object */
  const importConfig = (json) => {
    try {
      const data = typeof json === "string" ? JSON.parse(json) : json;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setConfig(data);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <FestivalConfigContext.Provider
      value={{ config, loading, updateConfig, resetConfig, exportConfig, importConfig }}
    >
      {children}
    </FestivalConfigContext.Provider>
  );
}

/** Hook to consume the festival config anywhere in the tree */
export function useFestivalConfig() {
  const ctx = useContext(FestivalConfigContext);
  if (!ctx) {
    throw new Error("useFestivalConfig must be used inside <FestivalConfigProvider>");
  }
  return ctx;
}
