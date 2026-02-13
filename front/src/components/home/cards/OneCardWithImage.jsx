export default function OneCardWithImage({
  image,
  title,
  description,
  accentColor,
  borderColor,
  hoverShadow,
  onOpenModal,
}) {
  return (
    <div
      className={`
        w-full h-72
        bg-[rgba(255,255,255,0.05)]
        rounded-[40px]
        border ${borderColor}
        flex flex-col
        overflow-hidden
        ${hoverShadow}
        transition
      `}
    >

      {/* IMAGE */}
      <div className="w-full h-40 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* TITLE */}
      <h2
        className="text-xl font-bold text-center mt-3 uppercase"
        style={{ color: accentColor }}
      >
        {title}
      </h2>

      {/* DESCRIPTION */}
      <p className="text-gray-300 text-center text-sm px-4 mt-1 uppercase">
        {description}
      </p>

      {/* BOUTON MODAL */}
      <button
        onClick={onOpenModal}
        className="mt-2 text-sm underline text-white/70 hover:text-white"
      >
        Ouvrir
      </button>
    </div>
  );
}



