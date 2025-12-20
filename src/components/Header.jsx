import { useState, useRef, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Phone, ChevronDown, Search, Bell } from 'lucide-react';
import { Crown } from 'lucide-react';

const languages = [
  { code: 'en', name: 'English', flag: 'https://flagcdn.com/w20/us.png' },
  { code: 'vn', name: 'Vietnamese', flag: 'https://flagcdn.com/w20/vn.png' },
];

export default function Header() {
  const [langOpen, setLangOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState(languages[0]);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinkClass = ({ isActive }) =>
    isActive
      ? "text-blue-600 font-bold transition-colors"
      : "text-gray-600 hover:text-blue-600 transition-colors";

  return (
    <header className="w-full bg-white border-b border-gray-200">
      {/* TẦNG 1: TOP NAVIGATION */}
      <div className="bg-gray-100 border-b border-gray-100 hidden lg:block">
        <div className="w-full px-4 sm:px-6 lg:px-16">
          <nav className="flex items-center justify-between h-14 mx-auto text-sm">
            <ul className="flex items-center gap-6 xl:gap-10">
              <li><NavLink to="/" end className={navLinkClass}>Home</NavLink></li>
              <li><NavLink to="/find-job" className={navLinkClass}>Find Job</NavLink></li>
              <li><NavLink to="/find-employers" className={navLinkClass}>Find Employers</NavLink></li>
              <li><NavLink to="/jobs" className={navLinkClass}>Dashboard</NavLink></li>
              <li><NavLink to="/jobs/alert-jobs" className={navLinkClass}>Job Alerts</NavLink></li>
              <li><NavLink to="/jobs/favorite-jobs" className={navLinkClass}>Favorite Jobs</NavLink></li>
              {/* Giữ lại các mục Mock Interview và Certificate từ file gốc của bạn */}
              <li className="hidden xl:block"><NavLink to="/mock-interview" className={navLinkClass}>Mock Interview</NavLink></li>
              <li className="hidden xl:block"><NavLink to="/certificate" className={navLinkClass}>Take Certificate</NavLink></li>
            </ul>

            <div className="flex items-center gap-8 text-gray-700">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>0333032782</span>
              </div>

              <div className="relative" ref={dropdownRef}>
                <button onClick={() => setLangOpen(!langOpen)} className="flex items-center gap-2">
                  <img src={currentLang.flag} alt={currentLang.name} className="w-5 h-3" />
                  <span>{currentLang.name}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                {langOpen && (
                  <ul className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg z-50">
                    {languages.map((lang) => (
                      <li key={lang.code}>
                        <button onClick={() => { setCurrentLang(lang); setLangOpen(false); }} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 w-full text-left">
                          <img src={lang.flag} alt={lang.name} className="w-5 h-3" />
                          {lang.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </nav>
        </div>
      </div>

      {/* TẦNG 2: MAIN BAR (Logo Vali + Search + User Icons) */}
      <div className="w-full px-4 sm:px-6 lg:px-16 py-4 lg:py-5 flex items-center justify-between gap-12">
        {/* LOGO VALI */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="w-10 h-10 bg-[#0A65CC] rounded-lg flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 8V6C7 4.89543 7.89543 4 9 4H15C16.1046 4 17 4.89543 17 6V8M7 8H17M7 8C5.89543 8 5 8.89543 5 10V18C5 19.1046 5.89543 20 7 20H17C18.1046 20 19 19.1046 19 18V10C19 8.89543 18.1046 8 17 8M10 12H14" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-2xl font-bold text-[#18191C]">MyJob</span>
        </Link>

        {/* THANH SEARCH TÍCH HỢP */}
        <div className="flex-1 max-w-2xl flex items-center border border-gray-200 rounded-lg px-4 py-2.5 bg-white focus-within:border-blue-400">
          <div className="flex items-center gap-2 border-r border-gray-200 pr-4 mr-4">
            <img src="https://flagcdn.com/w20/vn.png" alt="VN" className="w-5 h-3.5" />
            <span className="text-sm font-medium">Việt Nam</span>
            <ChevronDown size={14} className="text-gray-400" />
          </div>
          <div className="flex items-center gap-3 flex-1">
            <Search size={20} className="text-[#0A65CC]" />
            <input type="text" placeholder="Job title, keyword, company..." className="w-full outline-none text-sm" />
          </div>
        </div>

        {/* NHÓM ICON USER (Giữ lại từ code gốc của bạn) */}
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-gray-50 rounded-lg relative">
            <Crown className="w-6 h-6 text-gray-700" />
          </button>
          <button className="p-2 hover:bg-gray-50 rounded-lg relative">
            <Bell className="w-6 h-6 text-gray-700" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          <button className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center font-medium">
            <span className="text-sm">JD</span>
          </button>
        </div>
      </div>
    </header>
  );
}