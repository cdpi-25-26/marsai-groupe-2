export default function OneCardWithImage({
  image,
  title,
  borderColor,
  hoverborderColor,
  hoverShadow,
  onOpenModal,
}) {
  return (
    <div
      className={`
        w-full h-50
        bg-[rgb(255,255,255)]
        rounded-[40px]
        border-4
        ${borderColor}
        flex flex-col
        overflow-hidden
        ${hoverborderColor}
        ${hoverShadow}
        transition
      `}
    >

      {/* IMAGE */}
      <div className="w-11/12 overflow-hidden mx-auto my-auto">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>

    </div>
  );
}



