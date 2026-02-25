/**
 * ColorPicker
 * Color swatch preview + hex input matching the dark admin theme.
 * Props: label, value, onChange
 */

export default function ColorPicker({ label, value = "#7c3aed", onChange }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-white/50 uppercase tracking-wider">
        {label}
      </label>
      <div className="flex items-center gap-3">
        {/* Native color picker hidden behind the swatch */}
        <label className="cursor-pointer relative">
          <div
            className="w-9 h-9 rounded-lg border-2 border-white/20 shadow-inner"
            style={{ backgroundColor: value }}
          />
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
          />
        </label>
        {/* Hex input */}
        <input
          type="text"
          value={value}
          onChange={(e) => {
            const v = e.target.value;
            if (/^#[0-9a-fA-F]{0,6}$/.test(v)) onChange(v);
          }}
          maxLength={7}
          className="w-28 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 transition-colors"
        />
      </div>
    </div>
  );
}
