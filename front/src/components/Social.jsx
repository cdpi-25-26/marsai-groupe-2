export default function Social() {
  return (
    <div className="mt-0"> 
      <div className="bg-black w-full h-auto py-2 flex items-center justify-center gap-4 flex-wrap">

        {/* facebook */}
        <a
          href="https://www.facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 flex items-center justify-center relative overflow-hidden rounded-full bg-black shadow-md border-2 border-gray-600 group transition-all duration-300 hover:bg-white"
        >
          <svg
            className="relative z-10 fill-white transition-all duration-300 group-hover:fill-black"
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 72 72"
          >
            <path d="M46.4927 38.6403L47.7973 30.3588H39.7611V24.9759C39.7611 22.7114 40.883 20.4987 44.4706 20.4987H48.1756V13.4465C46.018 13.1028 43.8378 12.9168 41.6527 12.8901C35.0385 12.8901 30.7204 16.8626 30.7204 24.0442V30.3588H23.3887V38.6403H30.7204V58.671H39.7611V38.6403H46.4927Z" />
          </svg>
        </a>

        {/* instagram */}
<a
  href="https://www.instagram.com"
  target="_blank"
  rel="noopener noreferrer"
  className="w-10 h-10 flex items-center justify-center relative overflow-hidden rounded-full bg-black shadow-md border-2 border-gray-600 group transition-all duration-300 hover:bg-white"
>
<svg
  className="fill-white group-hover:fill-black transition-all duration-300"
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
>
  <path d="M7 2C4.243 2 2 4.243 2 7v10c0 2.757 2.243 5 5 5h10c2.757 0 5-2.243 5-5V7c0-2.757-2.243-5-5-5H7zm10 2c1.654 0 3 1.346 3 3v10c0 1.654-1.346 3-3 3H7c-1.654 0-3-1.346-3-3V7c0-1.654 1.346-3 3-3h10zm-5 3a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6zm4.5-2a1.5 1.5 0 100 3 1.5 1.5 0 000-3z"/>
</svg>
</a>

        {/* youtube */}
        <a
          href="https://www.youtube.com"
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 flex items-center justify-center relative overflow-hidden rounded-full bg-black shadow-md border-2 border-gray-600 group transition-all duration-300 hover:bg-white"
        >
          <svg
            className="relative z-10 fill-white transition-all duration-300 group-hover:fill-black"
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            viewBox="0 0 72 72"
          >
            <path d="M61.1026 23.7185C60.5048 21.471 58.7363 19.6981 56.4863 19.0904C52.4181 18 36.0951 18 36.0951 18C36.0951 18 19.7805 18 15.7039 19.0904C13.4622 19.6897 11.6937 21.4627 11.0876 23.7185C10 27.7971 10 36.3124 10 36.3124C10 36.3124 10 44.8276 11.0876 48.9063C11.6854 51.1537 13.4539 52.9267 15.7039 53.5343C19.7805 54.6247 36.0951 54.6247 36.0951 54.6247C36.0951 54.6247 52.4181 54.6247 56.4863 53.5343C58.728 52.935 60.4965 51.162 61.1026 48.9063C62.1902 44.8276 62.1902 36.3124 62.1902 36.3124Z" />
            <path
              className="fill-black transition-all duration-300 group-hover:fill-[#FF3000]"
              d="M30.8811 44.1617L44.4392 36.3124L30.8811 28.463V44.1617Z"
            />
          </svg>
        </a>

        {/* twitter */}
        <a
          href="https://www.twitter.com"
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 flex items-center justify-center relative overflow-hidden rounded-full bg-black shadow-md border-2 border-gray-600 group transition-all duration-300 hover:bg-white"
        >
          <svg
            className="relative z-10 fill-white transition-all duration-300 group-hover:fill-black"
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 72 72"
          >
            <path d="M40.7568 32.1716L59.3704 11H54.9596L38.7974 29.383L25.8887 11H11L30.5205 38.7983L11 61H15.4111L32.4788 41.5869L46.1113 61H61L40.7557 32.1716H40.7568Z" />
          </svg>
        </a>

      </div>
    </div>
  );
}    