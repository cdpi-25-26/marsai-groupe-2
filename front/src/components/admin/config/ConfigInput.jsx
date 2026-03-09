/**
 * ConfigInput
 * A labeled text (or textarea) input matching the dark admin theme.
 * Props: label, value, onChange, placeholder, multiline, type
 */

export default function ConfigInput({
  label,
  value = "",
  onChange,
  placeholder = "",
  multiline = false,
  type = "text",
}) {
  const baseClass =
    "w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 transition-colors";

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-white/50 uppercase tracking-wider">
        {label}
      </label>
      {multiline ? (
        <textarea
          className={`${baseClass} resize-y min-h-[80px]`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
        />
      ) : (
        <input
          type={type}
          className={baseClass}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      )}
    </div>
  );
}
