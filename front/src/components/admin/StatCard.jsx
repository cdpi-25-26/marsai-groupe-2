export default function StatCard({ 
  icon, 
  label, 
  value, 
  subtitle, 
  details,
  progress,
  // bgColor = "from-gray-900 to-gray-800"
}) {
  return (
    <div className={`
       bg-white/10
        backdrop-blur-xl
        border border-white/20
        rounded-2xl p-6
        shadow-lg hover:shadow-xl
        transition-all duration-300
        hover:scale-105
        text-white
    `}>
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-1xl -ml-1">{icon}</span>
        <span className="text-xs text-neutral-400 uppercase tracking-wide">
          {label}
        </span>
      </div>

      {/* Main Value */}
      <div className="space-y-2">
        <p className="text-4xl font-bold text-white">
          {value}
        </p>
        
        {subtitle && (
          <p className="text-sm text-neutral-300">
            {subtitle}
          </p>
        )}

        {details && (
          <p className="text-xs text-neutral-400">
            {details}
          </p>
        )}

        {/* Progress Bar (if provided) */}
        {progress !== undefined && (
          <div className="mt-3">
            <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs text-neutral-400 mt-1">{progress}%</span>
          </div>
        )}
      </div>
    </div>
  );
}



/*
*** color cards effect ***

 bg-gradient-to-br ${bgColor}/30
    backdrop-blur-xl
    border border-white/10
    rounded-2xl p-6
    shadow-lg hover:shadow-xl
    transition-all duration-300
    hover:scale-105
    text-white
*/