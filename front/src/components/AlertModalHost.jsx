import { useEffect, useState } from "react";

const toneStyles = {
  error: "border-red-500/40 text-red-200",
  warning: "border-amber-500/40 text-amber-200",
  info: "border-sky-500/40 text-sky-200",
  success: "border-emerald-500/40 text-emerald-200",
};

export default function AlertModalHost() {
  const [alertData, setAlertData] = useState(null);

  useEffect(() => {
    function onAlert(event) {
      setAlertData(event.detail || null);
    }

    window.addEventListener("app-alert", onAlert);
    return () => window.removeEventListener("app-alert", onAlert);
  }, []);

  if (!alertData) return null;

  const { title = "Attention", message = "Une erreur est survenue.", tone = "error" } = alertData;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className={`w-full max-w-lg rounded-xl border bg-[#0f1014] p-5 shadow-2xl ${toneStyles[tone] || toneStyles.error}`}>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-white/90 whitespace-pre-line">{message}</p>
        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={() => setAlertData(null)}
            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
