/**
 * SectionCard
 * Collapsible dark card used in the FestivalConfig admin page.
 * Props:
 *  - icon: ReactNode
 *  - title: string
 *  - visible: boolean | undefined  (when undefined, no toggle is shown)
 *  - onToggleVisible: () => void
 *  - children: ReactNode (form fields)
 *  - defaultOpen: boolean
 */

import { useState } from "react";

export default function SectionCard({
  icon,
  title,
  visible,
  onToggleVisible,
  children,
  defaultOpen = false,
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="rounded-xl border border-white/10 bg-[#0d0f12] overflow-hidden mb-4">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4">
        {/* Left: collapse toggle + icon + title */}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-3 flex-1 text-left"
        >
          <span className="text-violet-400">{icon}</span>
          <span className="font-semibold text-white text-sm tracking-wide">{title}</span>
          <svg
            className={`ml-auto w-4 h-4 text-white/40 transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Right: visibility toggle */}
        {typeof visible !== "undefined" && (
          <button
            type="button"
            onClick={onToggleVisible}
            className={`ml-4 relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${
              visible ? "bg-violet-600" : "bg-white/10"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                visible ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        )}
      </div>

      {/* Collapsible body */}
      {open && (
        <div className="px-5 pb-5 border-t border-white/5 pt-4 space-y-4">
          {children}
        </div>
      )}
    </div>
  );
}
