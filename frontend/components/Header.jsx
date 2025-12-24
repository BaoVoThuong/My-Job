import { useState, useRef, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Phone, ChevronDown, Search, Bell, Crown, Briefcase, LogOut, User, Settings } from 'lucide-react';

const languages = [
  { code: 'en', name: 'English', flag: 'https://flagcdn.com/w20/us.png' },
  { code: 'vn', name: 'Vietnamese', flag: 'https://flagcdn.com/w20/vn.png' },
];

export default function Header() {
  const [langOpen, setLangOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState(languages[0]);
  
  const langDropdownRef = useRef(null);
  const userDropdownRef = useRef(null);
  const navigate = useNavigate();

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

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    setUserMenuOpen(false);
    navigate('/home');
  };

  const navLinkClass = ({ isActive }) =>
    isActive
      ? "text-blue-600 font-bold h-full flex items-center border-b-2 border-blue-600 px-1 transition-colors"
      : "text-gray-500 font-medium h-full flex items-center border-b-2 border-transparent hover:text-blue-600 px-1 transition-colors";

  return (
    <header className="w-full font-sans bg-white shadow-sm z-40 relative sticky top-0">
      {/* TOP BAR */}
      <div className="bg-gray-50 border-b border-gray-100 hidden xl:block">
        <div className="w-full px-4 sm:px-6 lg:px-8"> 
          <div className="flex items-center justify-between h-10 text-sm">
            
            {/* MENU LINKS */}
            <nav className="h-full">
              <ul className="flex items-center gap-6 h-full">
                <li className="h-full"><NavLink to="/home" className={navLinkClass}>Home</NavLink></li>
                <li className="h-full"><NavLink to="/dashboard" className={navLinkClass}>Dashboard</NavLink></li>
                <li className="h-full"><NavLink to="/find-job" className={navLinkClass}>Find Job</NavLink></li>
                <li className="h-full"><NavLink to="/find-employers" className={navLinkClass}>Employers</NavLink></li>
                <li className="h-full"><NavLink to="/candidates" className={navLinkClass}>Candidates</NavLink></li>
                <li className="h-full"><NavLink to="/jobs/alert-jobs" className={navLinkClass}>Job Alerts</NavLink></li>
                
                {/* Link ngắn gọn (Đã được App.jsx xử lý) */}
                <li className="h-full"><NavLink to="/interview" className={navLinkClass}>Interview</NavLink></li>
                <li className="h-full"><NavLink to="/certificate" className={navLinkClass}>Certificate</NavLink></li>
                <li className="h-full"><NavLink to="/support" className={navLinkClass}>Support</NavLink></li>
              </ul>
            </nav>

            {/* INFO & LANG */}
            <div className="flex items-center gap-6 text-gray-500">
              <div className="flex items-center gap-2">
                <Phone size={16} />
                <span className="font-semibold text-gray-700">0333032782</span>
              </div>
              <div className="relative z-50" ref={langDropdownRef}>
                <button onClick={() => setLangOpen(!langOpen)} className="flex items-center gap-2 hover:text-blue-600">
                  <img src={currentLang.flag} alt={currentLang.name} className="w-5 h-auto rounded-sm" />
                  <span>{currentLang.name}</span>
                  <ChevronDown size={14} />
                </button>
                {langOpen && (
                  <ul className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg py-1">
                    {languages.map((lang) => (
                      <li key={lang.code}>
                        <button 
                          onClick={() => { setCurrentLang(lang); setLangOpen(false); }} 
                          className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 w-full text-left text-sm"
                        >
                          <img src={lang.flag} alt={lang.name} className="w-5" /> {lang.name}
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

      {/* MAIN BAR */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-3 lg:py-4 flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-2 shrink-0 group">
          <Briefcase size={32} className="text-blue-600 group-hover:text-blue-700" strokeWidth={2} />
          <span className="text-2xl font-bold text-gray-900 tracking-tight">MyJob</span>
        </Link>

        {/* SEARCH */}
        <div className="flex-1 max-w-2xl mx-8 hidden md:block">
          <div className="flex items-center border border-gray-200 rounded-lg p-1 pl-4 h-12 bg-white shadow-sm hover:border-blue-400 transition-all">
            <div className="flex items-center gap-2 mr-2 cursor-pointer">
              <img src="https://flagcdn.com/w20/vn.png" alt="VN" className="w-5" />
              <span className="text-sm font-medium">Viet Nam</span>
            </div>
            <div className="w-[1px] h-6 bg-gray-200 mx-3"></div>
            <div className="flex items-center w-full gap-3">
              <Search size={20} className="text-blue-600" />
              <input type="text" placeholder="Job title, keyword, company..." className="w-full outline-none text-sm bg-transparent" />
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-5">
          <button className="text-gray-500 hover:text-yellow-600"><Crown size={24} /></button>
          <button className="relative text-gray-500 hover:text-blue-600">
            <Bell size={24} />
            <span className="absolute top-0 right-0 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white translate-x-1/4 -translate-y-1/4"></span>
          </button>

          {/* USER DROPDOWN */}
          <div className="relative" ref={userDropdownRef}>
            <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="w-10 h-10 rounded-full border overflow-hidden hover:ring-2 hover:ring-blue-100">
              <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?fit=facearea&facepad=2.25&w=256&h=256&q=80" alt="User" className="w-full h-full object-cover" />
            </button>
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-xl py-1 z-50">
                <div className="px-4 py-3 border-b">
                  <p className="text-sm font-bold">John Doe</p>
                  <p className="text-xs text-gray-500 truncate">john.doe@example.com</p>
                </div>
                <Link to="/dashboard" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 hover:text-blue-600"><Briefcase size={16}/> Dashboard</Link>
                <Link to="/candidate/profile" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 hover:text-blue-600"><User size={16}/> My Profile</Link>
                <Link to="/settings" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 hover:text-blue-600"><Settings size={16}/> Settings</Link>
                <div className="border-t mt-1">
                  <button onClick={handleLogout} className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"><LogOut size={16}/> Log Out</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}