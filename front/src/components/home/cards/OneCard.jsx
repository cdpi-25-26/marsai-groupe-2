export default function OneCard({
  icon,
  title,
  description,
  accentColor,
  borderColor,
  hoverShadow,
  textSize = "text-xl sm:text-2xl md:text-3xl",
  height = "h-60",
  width = "w-90",
  iconBg = "bg-white/10",
  paddingBottom = "pb-3",
}) {
  return (
    <div
      className={`
${width}
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
          mb-3
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
      <div className={`${paddingBottom} pt-3`}>
      <h2
        className={`${textSize} font-bold text-center uppercase`}
        style={{ color: accentColor }}
      >
        {title}
      </h2>
</div>
      {/* TEXT */}
      <p className="text-gray-300 text-center text-base uppercase pt-3 px-6">
        {description}
      </p>
    </div>
  );
}