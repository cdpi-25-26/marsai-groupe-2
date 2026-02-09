export default function TitleInBox({
    title,
    spancolor,
    title2,
}) {
    return (
         <div className="inline-flex items-center justify-center 
                          bg-black/20 border border-white/40 
                          px-4 py-1.5 rounded-full mb-6 mt-6">
            <p className="text-xs sm:text-sm tracking-[0.25em] text-gray-300 font-bold uppercase m-0">
              {title} <span className={`text-[${spancolor}]`}>{title2}</span>
            </p>
          </div>
    )
}