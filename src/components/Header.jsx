import { useState, useRef, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Phone, ChevronDown, Search, Bell, Crown, Briefcase, LogOut, User, Settings } from 'lucide-react';

const languages = [
  { code: 'en', name: 'English', flag: 'https://flagcdn.com/w20/us.png' },
  { code: 'vn', name: 'Vietnamese', flag: 'https://flagcdn.com/w20/vn.png' },
];

export default function Header() {
  const [langOpen, setLangOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false); // State cho menu User
  const [currentLang, setCurrentLang] = useState(languages[0]);
  
  const langDropdownRef = useRef(null);
  const userDropdownRef = useRef(null);
  const navigate = useNavigate();

  // Xử lý click outside để đóng các dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target)) {
        setLangOpen(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // --- HÀM ĐĂNG XUẤT ---
  const handleLogout = () => {
    // 1. Xóa token
    localStorage.removeItem('accessToken');
    // 2. Tắt menu
    setUserMenuOpen(false);
    // 3. Chuyển hướng về Home (Layout sẽ tự đổi sang HeaderGuest)
    navigate('/home');
  };

  // Class style cho NavLink
  const navLinkClass = ({ isActive }) =>
    isActive
      ? "text-blue-600 font-medium relative flex items-center h-full border-b-[2px] border-blue-600 transition-colors"
      : "text-gray-500 hover:text-blue-600 font-medium flex items-center h-full border-b-[2px] border-transparent transition-colors";

  return (
    <header className="w-full font-sans bg-white shadow-sm z-40 relative">
      {/* --- TẦNG 1: TOP NAVIGATION BAR --- */}
      <div className="bg-gray-50 border-b border-gray-100 hidden lg:block">
        <div className="w-full px-4 sm:px-6 lg:px-8"> 
          <div className="flex items-center justify-between h-10 text-sm">
            
            {/* Left Menu */}
            <nav className="h-full">
              <ul className="flex items-center gap-6 h-full">
                <li className="h-full"><NavLink to="/home" className={navLinkClass}>Home</NavLink></li>
                <li className="h-full"><NavLink to="/find-job" className={navLinkClass}>Find Job</NavLink></li>
                <li className="h-full"><NavLink to="/find-employers" className={navLinkClass}>Find Employers</NavLink></li>
                <li className="h-full"><NavLink to="/candidate/dashboard" className={navLinkClass}>Dashboard</NavLink></li>
                <li className="h-full"><NavLink to="/jobs/alert-jobs" className={navLinkClass}>Job Alerts</NavLink></li>
                <li className="h-full"><NavLink to="/support" className={navLinkClass}>Customer Supports</NavLink></li>
              </ul>
            </nav>

            {/* Right Info */}
            <div className="flex items-center gap-6 text-gray-500">
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-gray-600" />
                <span className="font-semibold text-gray-700">0333032782</span>
              </div>

              {/* Language Dropdown */}
              <div className="relative z-50" ref={langDropdownRef}>
                <button 
                  onClick={() => setLangOpen(!langOpen)} 
                  className="flex items-center gap-2 cursor-pointer hover:text-blue-600 transition-colors"
                >
                  <img src={currentLang.flag} alt={currentLang.name} className="w-5 h-auto rounded-sm" />
                  <span>{currentLang.name}</span>
                  <ChevronDown size={14} />
                </button>
                
                {langOpen && (
                  <ul className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg py-1 animate-in fade-in zoom-in duration-200">
                    {languages.map((lang) => (
                      <li key={lang.code}>
                        <button 
                          onClick={() => { setCurrentLang(lang); setLangOpen(false); }} 
                          className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 w-full text-left text-sm text-gray-700"
                        >
                          <img src={lang.flag} alt={lang.name} className="w-5 h-auto rounded-sm" />
                          {lang.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- TẦNG 2: MAIN BAR --- */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-3 lg:py-4 flex items-center justify-between">
        
        {/* LOGO */}
        <Link to="/home" className="flex items-center gap-2 shrink-0 group">
          <Briefcase size={32} className="text-blue-600 group-hover:text-blue-700 transition-colors" strokeWidth={2} />
          <span className="text-2xl font-bold text-gray-900 tracking-tight">MyJob</span>
        </Link>

        {/* SEARCH BAR */}
        <div className="flex-1 max-w-2xl mx-8 hidden md:block">
          <div className="flex items-center border border-gray-200 rounded-lg p-1 pl-4 h-12 bg-white hover:border-blue-400 focus-within:border-blue-400 transition-all shadow-sm">
            <div className="flex items-center gap-2 cursor-pointer mr-2 shrink-0">
              <img src="https://flagcdn.com/w20/vn.png" alt="VN" className="w-5 h-auto rounded-sm" />
              <span className="font-medium text-gray-700 text-sm">Viet Nam</span>
              <ChevronDown size={14} className="text-gray-400" />
            </div>
            <div className="w-[1px] h-6 bg-gray-200 mx-3"></div>
            <div className="flex items-center w-full gap-3">
              <Search size={20} className="text-blue-600" />
              <input 
                type="text" 
                placeholder="Job title, keyword, company..." 
                className="w-full outline-none text-gray-600 placeholder-gray-400 text-sm bg-transparent" 
              />
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-5">
          <button className="text-gray-500 hover:text-yellow-600 transition-colors hidden sm:block">
            <Crown size={24} strokeWidth={2} />
          </button>

          <button className="relative text-gray-500 hover:text-blue-600 transition-colors">
            <Bell size={24} strokeWidth={2} />
            <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white transform translate-x-1/4 -translate-y-1/4"></span>
          </button>

          {/* USER AVATAR & DROPDOWN */}
          <div className="relative" ref={userDropdownRef}>
            <button 
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="w-10 h-10 rounded-full overflow-hidden border border-gray-200 cursor-pointer hover:ring-2 hover:ring-blue-100 transition-all focus:outline-none"
            >
              <img 
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80" 
                alt="User" 
                className="w-full h-full object-cover"
              />
            </button>

            {/* Dropdown Menu User */}
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-lg shadow-xl py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-900">John Doe</p>
                  <p className="text-xs text-gray-500 truncate">john.doe@example.com</p>
                </div>
                
                <Link to="/candidate/dashboard" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600">
                  <Briefcase size={16} /> Dashboard
                </Link>
                <Link to="/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600">
                  <User size={16} /> My Profile
                </Link>
                <Link to="/settings" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600">
                  <Settings size={16} /> Settings
                </Link>
                
                <div className="border-t border-gray-100 mt-1">
                  <button 
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={16} /> Log Out
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}