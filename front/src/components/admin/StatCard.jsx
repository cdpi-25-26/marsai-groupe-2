// components/admin/StatCard.jsx
export default function StatCard({
  icon,
  label,
  value,
  subtitle,
  progress,
}) {
  return (
    <div className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800">
      <div className="flex justify-between mb-3">
        <span className="text-2xl">{icon}</span>
        <span className="text-xs text-neutral-400 uppercase">
          {label}
        </span>
      </div>

      <div className="space-y-2">
        <p className="text-3xl font-bold">{value}</p>
        <p className="text-sm text-neutral-400">{subtitle}</p>

        {progress !== undefined && (
          <div className="w-full bg-neutral-800 h-2 rounded-full">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
