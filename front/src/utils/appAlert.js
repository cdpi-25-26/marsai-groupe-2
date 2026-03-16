export function showAppAlert({ title = "Attention", message = "Une erreur est survenue.", tone = "error" }) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent("app-alert", {
      detail: { title, message, tone },
    }),
  );
}
