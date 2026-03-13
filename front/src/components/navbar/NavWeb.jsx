
import { Link } from "react-router";
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from "react";

export default function Navbar() {
  const { i18n } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const firstName = localStorage.getItem("firstName");
  const lastName = localStorage.getItem("lastName");
  const role = localStorage.getItem("role");

  const roleHomePath = {
    ADMIN: "/admin",
    PRODUCER: "/producer",
    JURY: "/jury",
  };
  const userHomePath = role ? roleHomePath[role] : null;

  // Check if mobile on mount and when window resizes
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close mobile menu when navigating
  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  function handleLogout() {
    localStorage.clear();
    window.location.href = "/";
  }

  const toggleLanguage = () => {
    const newLang = i18n.language === 'fr' ? 'en' : 'fr';
    i18n.changeLanguage(newLang);
    localStorage.setItem('lang', newLang);
  };

  // Tooltip component (only shown on desktop)
  const Tooltip = ({ text, children }) => (
    <div className="group relative hidden md:block">
      {children}
      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-900/90 backdrop-blur-sm text-white text-xs rounded border border-white/10 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        {text}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop/Tablet Navigation */}
      <nav className="
        hidden md:flex items-center justify-between
        mx-auto mt-1 w-fit min-w-[800px]
        bg-gradient-to-br from-[#C6CAD2]/30 to-[#0f1114]/10
        backdrop-blur-sm
        text-white rounded-full 
        px-4 py-2
        border border-white/30
        fixed top-2 left-1/2 -translate-x-1/2 z-50 
        transition-all duration-300
        shadow-xl shadow-black/30
        hover:shadow-2xl hover:shadow-blue-500/10
      ">
        {/* Logo - Left */}
        <Link to="/" className="hover:scale-105 transition-transform duration-300 mr-4">
          <div className="flex items-center gap-1">
            <div className="text-white text-xl uppercase font-bold">Mars</div> 
            <div className="text-xl uppercase font-bold bg-gradient-to-b from-[#AD46FF] to-[#F6339A] bg-clip-text text-transparent">AI</div>
          </div>
        </Link>

        {/* Navigation Links - Center (no tooltips) */}
        <div className="flex items-center gap-1">
          <Link to="/" className="block px-4 py-2 rounded-lg hover:bg-white/5 transition-all duration-300 cursor-pointer text-gray-300 hover:text-white text-sm font-medium">
            Home
          </Link>

          <Link to="/program" className="block px-4 py-2 rounded-lg hover:bg-white/5 transition-all duration-300 cursor-pointer text-gray-300 hover:text-white text-sm font-medium">
            Program
          </Link>

          <Link to="/juryPublic" className="block px-4 py-2 rounded-lg hover:bg-white/5 transition-all duration-300 cursor-pointer text-gray-300 hover:text-white text-sm font-medium">
            Jury
          </Link>

          <Link to="/sponsors" className="block px-4 py-2 rounded-lg hover:bg-white/5 transition-all duration-300 cursor-pointer text-gray-300 hover:text-white text-sm font-medium">
            Sponsors
          </Link>

          <Link to="/infos" className="block px-4 py-2 rounded-lg hover:bg-white/5 transition-all duration-300 cursor-pointer text-gray-300 hover:text-white text-sm font-medium">
            Info
          </Link>
        </div>

        {/* Right Section - Language & Auth */}
        <div className="flex items-center gap-2 ml-4">
          {/* Language Switcher (with tooltip) */}
          <Tooltip text={i18n.language === 'fr' ? 'Switch to English' : 'Passer en français'}>
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/5 transition-all duration-300 cursor-pointer"
            >
              <div className={`
                p-1 rounded-md transition-all duration-300
                ${i18n.language === 'fr' 
                  ? 'bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-500/30' 
                  : 'bg-gradient-to-r from-purple-500/20 to-purple-600/20 border border-purple-500/30'
                }
              `}>
                {i18n.language === 'fr' ? (
                  <svg width="18" height="18" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                    <mask id="circleFlagsFr0">
                      <circle cx="256" cy="256" fill="#fff" r="256"/>
                    </mask>
                    <g mask="url(#circleFlagsFr0)">
                      <path d="M167 0h178l25.9 252.3L345 512H167l-29.8-253.4z" fill="#eee"/>
                      <path d="M0 0h167v512H0z" fill="#0052b4"/>
                      <path d="M345 0h167v512H345z" fill="#d80027"/>
                    </g>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                    <mask id="circleFlagsEn0">
                      <circle cx="256" cy="256" fill="#fff" r="256"/>
                    </mask>
                    <g mask="url(#circleFlagsEn0)">
                      <path d="m0 0l8 22l-8 23v23l32 54l-32 54v32l32 48l-32 48v32l32 54l-32 54v68l22-8l23 8h23l54-32l54 32h32l48-32l48 32h32l54-32l54 32h68l-8-22l8-23v-23l-32-54l32-54v-32l-32-48l32-48v-32l-32-54l32-54V0l-22 8l-23-8h-23l-54 32l-54-32h-32l-48 32l-48-32h-32l-54 32L68 0z" fill="#eee"/>
                      <path d="M336 0v108L444 0Zm176 68L404 176h108zM0 176h108L0 68ZM68 0l108 108V0Zm108 512V404L68 512ZM0 444l108-108H0Zm512-108H404l108 108Zm-68 176L336 404v108z" fill="#0052b4"/>
                      <path d="M0 0v45l131 131h45zm208 0v208H0v96h208v208h96V304h208v-96H304V0zm259 0L336 131v45L512 0zM176 336L0 512h45l131-131zm160 0l176 176v-45L381 336z" fill="#d80027"/>
                    </g>
                  </svg>
                )}
              </div>
              <span className="text-xs font-medium text-gray-300">
                {i18n.language === 'fr' ? 'FR' : 'EN'}
              </span>
            </button>
          </Tooltip>

          {/* User Section */}
          {firstName ? (
            <div className="flex items-center gap-2">
              <Tooltip text="Dashboard">
                {userHomePath && (
                  <Link to={userHomePath}>
                    <button className="px-3 py-1.5 text-xs font-medium bg-gradient-to-r from-purple-500/20 to-purple-600/20 text-purple-300 border border-purple-500/30 rounded-lg hover:text-white hover:from-purple-500/30 hover:to-purple-600/30 transition-all duration-300 cursor-pointer">
                      {role?.toLowerCase()}
                    </button>
                  </Link>
                )}
              </Tooltip>
              <Tooltip text="Logout">
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 text-xs font-medium bg-gradient-to-r from-red-500/20 to-red-600/20 text-red-300 border border-red-500/30 rounded-lg hover:text-white hover:from-red-500/30 hover:to-red-600/30 transition-all duration-300 cursor-pointer"
                >
                  Exit
                </button>
              </Tooltip>
            </div>
          ) : (
            <Tooltip text="Sign in">
              <Link to="/auth/login" className="block">
                <div className="p-2 rounded-lg hover:bg-white/5 transition-all duration-300 cursor-pointer">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-gray-300 hover:text-white transition-colors duration-300"
                  >
                    <circle
                      cx="12"
                      cy="8"
                      r="4"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <path
                      d="M5 20V19C5 15.6863 7.68629 13 11 13H13C16.3137 13 19 15.6863 19 19V20"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </Link>
            </Tooltip>
          )}
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="
        md:hidden
        w-full
        bg-gradient-to-br from-[#C6CAD2]/30 to-[#0f1114]/10
        backdrop-blur-sm
        text-white
        px-4 py-3
        border-b border-white/30
        fixed top-0 left-0 z-50
        transition-all duration-300
        shadow-xl shadow-black/30
      ">
        <div className="flex items-center justify-between">
          {/* Logo - Left */}
          <Link to="/" onClick={handleLinkClick} className="hover:scale-105 transition-transform duration-300">
            <div className="flex items-center gap-1">
              <div className="text-white text-xl uppercase font-bold">Mars</div> 
              <div className="text-xl uppercase font-bold bg-gradient-to-b from-[#AD46FF] to-[#F6339A] bg-clip-text text-transparent">AI</div>
            </div>
          </Link>

          {/* Right Section - Language & Menu Toggle */}
          <div className="flex items-center gap-2">
            {/* Language Switcher (mobile version) */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-white/5 transition-all duration-300 cursor-pointer"
            >
              <div className={`
                p-1 rounded-md transition-all duration-300
                ${i18n.language === 'fr' 
                  ? 'bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-500/30' 
                  : 'bg-gradient-to-r from-purple-500/20 to-purple-600/20 border border-purple-500/30'
                }
              `}>
                {i18n.language === 'fr' ? (
                  <svg width="18" height="18" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                    <mask id="circleFlagsFr0-mobile">
                      <circle cx="256" cy="256" fill="#fff" r="256"/>
                    </mask>
                    <g mask="url(#circleFlagsFr0-mobile)">
                      <path d="M167 0h178l25.9 252.3L345 512H167l-29.8-253.4z" fill="#eee"/>
                      <path d="M0 0h167v512H0z" fill="#0052b4"/>
                      <path d="M345 0h167v512H345z" fill="#d80027"/>
                    </g>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                    <mask id="circleFlagsEn0-mobile">
                      <circle cx="256" cy="256" fill="#fff" r="256"/>
                    </mask>
                    <g mask="url(#circleFlagsEn0-mobile)">
                      <path d="m0 0l8 22l-8 23v23l32 54l-32 54v32l32 48l-32 48v32l32 54l-32 54v68l22-8l23 8h23l54-32l54 32h32l48-32l48 32h32l54-32l54 32h68l-8-22l8-23v-23l-32-54l32-54v-32l-32-48l32-48v-32l-32-54l32-54V0l-22 8l-23-8h-23l-54 32l-54-32h-32l-48 32l-48-32h-32l-54 32L68 0z" fill="#eee"/>
                      <path d="M336 0v108L444 0Zm176 68L404 176h108zM0 176h108L0 68ZM68 0l108 108V0Zm108 512V404L68 512ZM0 444l108-108H0Zm512-108H404l108 108Zm-68 176L336 404v108z" fill="#0052b4"/>
                      <path d="M0 0v45l131 131h45zm208 0v208H0v96h208v208h96V304h208v-96H304V0zm259 0L336 131v45L512 0zM176 336L0 512h45l131-131zm160 0l176 176v-45L381 336z" fill="#d80027"/>
                    </g>
                  </svg>
                )}
              </div>
              <span className="text-xs font-medium text-gray-300">
                {i18n.language === 'fr' ? 'FR' : 'EN'}
              </span>
            </button>

            {/* User Icon (mobile) */}
            {firstName ? (
              <div className="flex items-center gap-1">
                <Link to={userHomePath || "#"} onClick={handleLinkClick}>
                  <div className="p-2 rounded-lg hover:bg-white/5 transition-all duration-300 cursor-pointer">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center text-xs font-bold">
                      {firstName.charAt(0)}
                    </div>
                  </div>
                </Link>
              </div>
            ) : (
              <Link to="/auth/login" onClick={handleLinkClick} className="block">
                <div className="p-2 rounded-lg hover:bg-white/5 transition-all duration-300 cursor-pointer">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-gray-300 hover:text-white transition-colors duration-300"
                  >
                    <circle
                      cx="12"
                      cy="8"
                      r="4"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <path
                      d="M5 20V19C5 15.6863 7.68629 13 11 13H13C16.3137 13 19 15.6863 19 19V20"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </Link>
            )}

            {/* Hamburger Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-white/5 transition-all duration-300 cursor-pointer"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-gray-300 hover:text-white transition-colors duration-300"
              >
                {isMobileMenuOpen ? (
                  <path
                    d="M18 6L6 18M6 6L18 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                ) : (
                  <path
                    d="M3 12H21M3 6H21M3 18H21"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 mx-4 p-4 bg-gray-900/95 backdrop-blur-sm rounded-xl border border-white/10 shadow-xl">
            <div className="flex flex-col gap-2">
              <Link 
                to="/" 
                onClick={handleLinkClick}
                className="px-4 py-3 rounded-lg hover:bg-white/5 transition-all duration-300 cursor-pointer text-gray-300 hover:text-white text-base font-medium"
              >
                Home
              </Link>

              <Link 
                to="/program" 
                onClick={handleLinkClick}
                className="px-4 py-3 rounded-lg hover:bg-white/5 transition-all duration-300 cursor-pointer text-gray-300 hover:text-white text-base font-medium"
              >
                Program
              </Link>

              <Link 
                to="/juryPublic" 
                onClick={handleLinkClick}
                className="px-4 py-3 rounded-lg hover:bg-white/5 transition-all duration-300 cursor-pointer text-gray-300 hover:text-white text-base font-medium"
              >
                Jury
              </Link>

              <Link 
                to="/sponsors" 
                onClick={handleLinkClick}
                className="px-4 py-3 rounded-lg hover:bg-white/5 transition-all duration-300 cursor-pointer text-gray-300 hover:text-white text-base font-medium"
              >
                Sponsors
              </Link>

              <Link 
                to="/infos" 
                onClick={handleLinkClick}
                className="px-4 py-3 rounded-lg hover:bg-white/5 transition-all duration-300 cursor-pointer text-gray-300 hover:text-white text-base font-medium"
              >
                Info
              </Link>

              {/* Mobile User Actions */}
              {firstName && (
                <>
                  <div className="h-px bg-white/10 my-2"></div>
                  <div className="px-4 py-2 text-sm text-gray-400">
                    Logged in as <span className="text-white font-medium">{firstName} {lastName}</span>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      handleLinkClick();
                    }}
                    className="px-4 py-3 text-left rounded-lg hover:bg-white/5 transition-all duration-300 cursor-pointer text-red-300 hover:text-red-200 text-base font-medium"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}