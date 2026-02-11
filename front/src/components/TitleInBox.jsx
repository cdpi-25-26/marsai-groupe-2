export default function TitleInBox({
  icon = null,
  iconcolor,
  title,
  spancolor,
  title2,
}) {
  return (
    <div
      className="inline-flex items-center justify-center 
                          bg-black/40 border border-white/40 
                          px-4 py-1.5 rounded-full mb-6 mt-6"
    >
      <span style={{ color: iconcolor }} className="pr-2 flex items-center">
        {icon}
      </span>
      <p className="tracking-[0.25em] text-gray-300 font-bold uppercase m-0">
        {title} <span className={`text-[${spancolor}]`}>{title2}</span>
      </p>
    </div>
  );
}
