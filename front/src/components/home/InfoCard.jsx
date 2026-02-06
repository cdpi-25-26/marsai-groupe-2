export default function InfoCard({
  title,
  description,
  accentColor,
  borderColor,
  hoverShadow,
  height = "h-100",
}) {
  return (
    <div
      className={`
        w-90
        ${height}
        bg-[rgba(255,255,255,0.05)]
        rounded-[40px]
        border ${borderColor}
        flex flex-col items-center justify-center
        hover:${hoverShadow}
        hover:border-[${accentColor}]
        [@media(max-aspect-ratio:4/5)]:pt-6
        transition
      `}
    >
      <h2
        className="text-2xl font-bold text-center uppercase"
        style={{ color: accentColor }}
      >
        {title}
      </h2>

      <p className="text-gray-300 text-center text-base uppercase pt-6 px-6">
        {description}
      </p>
    </div>
  );
}