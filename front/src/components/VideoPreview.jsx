import { useEffect, useRef, useState } from "react";

export function VideoPreview({ src, poster, title }) {
  const videoRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [isOpen]);

  function handleMouseEnter() {
    if (videoRef.current) {
      videoRef.current.play().catch(() => null);
    }
  }

  function handleMouseLeave() {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }

  function openFullscreen() {
    setIsOpen(true);
  }

  function closeFullscreen() {
    setIsOpen(false);
  }

  function requestNativeFullscreen() {
    const video = videoRef.current;
    if (!video) return;
    if (video.requestFullscreen) {
      video.requestFullscreen();
    } else if (video.webkitRequestFullscreen) {
      video.webkitRequestFullscreen();
    }
  }

  return (
    <>
      <div
        className="relative w-full aspect-video bg-black rounded-lg overflow-hidden cursor-pointer"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={openFullscreen}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            openFullscreen();
          }
        }}
      >
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          src={src}
          poster={poster || undefined}
          muted
          playsInline
          loop
          preload="metadata"
        />
        <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition flex items-center justify-center">
          <span className="text-white font-semibold text-sm">Cliquer pour plein écran</span>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <div className="w-full max-w-6xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-semibold text-lg">{title}</h3>
              <button
                type="button"
                onClick={closeFullscreen}
                className="text-white/80 hover:text-white"
              >
                Fermer
              </button>
            </div>
            <video
              className="w-full h-auto max-h-[80vh] bg-black rounded-lg"
              src={src}
              poster={poster || undefined}
              controls
              autoPlay
            />
            <div className="mt-3 flex justify-end">
              <button
                type="button"
                onClick={requestNativeFullscreen}
                className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
              >
                Plein écran
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
