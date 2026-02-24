// import { useEffect, useRef, useState } from "react";

// export function VideoPreview({ src, poster, title, onEnded }) {
//   const videoRef = useRef(null);
//   const [isOpen, setIsOpen] = useState(false);

//   useEffect(() => {
//     if (!isOpen && videoRef.current) {
//       videoRef.current.pause();
//       videoRef.current.currentTime = 0;
//     }
//   }, [isOpen]);

//   function handleMouseEnter() {
//     if (videoRef.current) {
//       videoRef.current.play().catch(() => null);
//     }
//   }

//   function handleMouseLeave() {
//     if (videoRef.current) {
//       videoRef.current.pause();
//       videoRef.current.currentTime = 0;
//     }
//   }

//   function openFullscreen() {
//     setIsOpen(true);
//   }

//   function closeFullscreen() {
//     setIsOpen(false);
//   }

//   function requestNativeFullscreen() {
//     const video = videoRef.current;
//     if (!video) return;
//     if (video.requestFullscreen) {
//       video.requestFullscreen();
//     } else if (video.webkitRequestFullscreen) {
//       video.webkitRequestFullscreen();
//     }
//   }

//   return (
//     <>
//       <div
//         className="group relative w-full aspect-video bg-black/80 border border-white/10 rounded-lg overflow-hidden cursor-pointer hover:border-blue-500/50 transition-all duration-300 shadow-lg shadow-black/30"
//         onMouseEnter={handleMouseEnter}
//         onMouseLeave={handleMouseLeave}
//         onClick={openFullscreen}
//         role="button"
//         tabIndex={0}
//         onKeyDown={(event) => {
//           if (event.key === "Enter" || event.key === " ") {
//             openFullscreen();
//           }
//         }}
//       >
//         <video
//           ref={videoRef}
//           className="w-full h-full object-cover"
//           src={src}
//           poster={poster || undefined}
//           muted
//           playsInline
//           loop
//           preload="metadata"
//         />
        
//         {/* Gradient Overlay */}
//         <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
//         {/* Play Button */}
//         <div className="absolute inset-0 flex items-center justify-center">
//           <div className="w-14 h-14 rounded-full bg-blue-600/90 flex items-center justify-center border-2 border-white/30 shadow-xl transform scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300">
//             <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
//               <path d="M8 5v14l11-7z" />
//             </svg>
//           </div>
//         </div>
        
//         {/* Time Badge */}
//         <div className="absolute bottom-3 left-3 px-2 py-1 bg-black/80 backdrop-blur-sm border border-white/10 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//           <span className="text-[10px] text-white/90">Cliquer pour agrandir</span>
//         </div>
        
//         {/* Title Badge */}
//         <div className="absolute top-3 left-3 px-2 py-1 bg-black/80 backdrop-blur-sm border border-white/10 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//           <span className="text-[10px] text-white/90 font-medium truncate max-w-[200px]">{title}</span>
//         </div>
//       </div>

//       {isOpen && (
//         <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4">
//           <div className="relative w-full max-w-6xl">
//             {/* Header */}
//             <div className="flex items-center justify-between mb-3">
//               <div className="flex items-center gap-3">
//                 <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center">
//                   <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                   </svg>
//                 </div>
//                 <h3 className="text-base font-medium text-white">{title}</h3>
//               </div>
//               <button
//                 onClick={closeFullscreen}
//                 className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
//               >
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//             </div>

//             {/* Video Player */}
//             <div className="relative rounded-lg overflow-hidden border border-white/10 bg-black shadow-2xl shadow-black/50">
//               <video
//                 ref={videoRef}
//                 className="w-full h-auto max-h-[70vh]"
//                 src={src}
//                 poster={poster || undefined}
//                 controls
//                 autoPlay
//               />
//             </div>

//             {/* Controls */}
//             <div className="mt-4 flex justify-end">
//               <button
//                 onClick={requestNativeFullscreen}
//                 className="px-4 py-2 bg-white/10 text-white text-xs font-medium rounded-lg hover:bg-white/20 transition-colors border border-white/20 flex items-center gap-2"
//               >
//                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
//                 </svg>
//                 Plein écran
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

import { useEffect, useRef, useState } from "react";

export function VideoPreview({ src, poster, title, onEnded, openMode = "overlay" }) {
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
        className="group relative w-full aspect-video bg-black/80 border border-white/10 rounded-lg overflow-hidden cursor-pointer hover:border-blue-500/50 transition-all duration-300 shadow-lg shadow-black/30"
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
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Play Button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-blue-600/90 flex items-center justify-center border-2 border-white/30 shadow-xl transform scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
        
        {/* Time Badge */}
        <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 px-2 py-1 bg-black/80 backdrop-blur-sm border border-white/10 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-[10px] text-white/90">Cliquer pour agrandir</span>
        </div>
        
        {/* Title Badge */}
        <div className="absolute top-2 sm:top-3 left-2 sm:left-3 px-2 py-1 bg-black/80 backdrop-blur-sm border border-white/10 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 max-w-[150px] sm:max-w-[200px]">
          <span className="text-[10px] text-white/90 font-medium truncate block">{title}</span>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 mobile-modal-overlay">
          <div className="w-full max-w-6xl mobile-modal-panel">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-semibold text-lg">{title}</h3>
              <button
                onClick={closeFullscreen}
                className="p-1.5 sm:p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors flex-shrink-0"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <video
              className="w-full h-auto max-h-[80vh] bg-black rounded-lg"
              src={src}
              poster={poster || undefined}
              controls
              autoPlay
              onEnded={onEnded}
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
