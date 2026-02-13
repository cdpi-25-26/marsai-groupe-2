export default function ThreeCards({
  icon,
  title,
  description,
  accentColor,
  borderColor,
  hoverShadow,
  height = "h-100",
  iconBg = "bg-white/10",
  paddingBottom = "pb-6",
}) {
  return (
    <div
      className={`
        w-90
        ${height}
        bg-[rgba(255,255,255,0.05)]
        rounded-[40px]
        border ${borderColor}
        ${paddingBottom}
        flex flex-col items-center justify-center
        ${hoverShadow}
        [@media(max-aspect-ratio:4/5)]:pt-6
        transition
      `}
    >

      {/* ICON */}
      {icon && (
        <div className={`
          mb-6
          w-20 h-20
          rounded-full
          border ${borderColor}
          ${hoverShadow}
          flex items-center justify-center
          ${iconBg}
        `}>
          <div style={{ color: accentColor }} className="w-15 h-15 flex items-center justify-center">
            {icon}
          </div>
        </div>
      )}

      {/* TITLE */}
      <div className={`${paddingBottom} pt-6`}>
      <h2
        className={`text-2xl font-bold text-center uppercase`}
        style={{ color: accentColor }}
      >
        {title}
      </h2>
</div>
      {/* TEXT */}
      <p className="text-gray-300 text-center text-base uppercase pt-6 px-6">
        {description}
      </p>
    </div>
  );
}
