import { useState, useRef, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Phone, ChevronDown, Search, Briefcase, User, Settings, LogOut, Bookmark, FileCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const languages = [
  { code: 'en', name: 'English', flag: 'https://flagcdn.com/w20/us.png' },
  { code: 'vn', name: 'Vietnamese', flag: 'https://flagcdn.com/w20/vn.png' },
];

export default function HeaderGuest() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [langOpen, setLangOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState(languages[0]);
  const dropdownRef = useRef(null);
  const userMenuRef = useRef(null);

  // Xử lý click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setLangOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Style cho Link menu (Guest)
  const navLinkClass = ({ isActive }) =>
    isActive
      ? "text-blue-600 font-bold transition-colors text-sm" // Active đậm hơn chút
      : "text-gray-500 hover:text-blue-600 font-medium transition-colors text-sm";

  return (
    <header className="w-full font-sans bg-white shadow-sm sticky top-0 z-50">
      
      {/* --- TẦNG 1: TOP NAVIGATION (MENU FULL CHỨC NĂNG) --- */}
      <div className="bg-gray-50 border-b border-gray-100 hidden xl:block">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-10 text-sm">
            
            {/* Left Menu: Role-based navigation */}
            <nav>
              <ul className="flex items-center gap-5">
                <li><NavLink to="/home" className={navLinkClass}>Home</NavLink></li>

                {/* Dashboard - different for employer vs candidate */}
                {user?.role === 'employer' ? (
                  <>
                    <li><NavLink to="/employer/dashboard" className={navLinkClass}>Dashboard</NavLink></li>
                    <li><NavLink to="/employer/jobs" className={navLinkClass}>My Jobs</NavLink></li>
                    <li><NavLink to="/employer/jobs/create" className={navLinkClass}>Post Job</NavLink></li>
                    <li><NavLink to="/employer/saved-candidates" className={navLinkClass}>Saved Candidates</NavLink></li>
                    <li><NavLink to="/employer/subscription" className={navLinkClass}>Subscription</NavLink></li>
                    <li><NavLink to="/candidates" className={navLinkClass}>Candidates</NavLink></li>
                  </>
                ) : (
                  <>
                    <li><NavLink to="/candidate/dashboard" className={navLinkClass}>Dashboard</NavLink></li>
                    <li><NavLink to="/find-job" className={navLinkClass}>Find Job</NavLink></li>
                    {user && <li><NavLink to="/saved-jobs" className={navLinkClass}>Saved Jobs</NavLink></li>}
                    {user && <li><NavLink to="/candidate/subscription" className={navLinkClass}>Subscription</NavLink></li>}
                    <li><NavLink to="/find-employers" className={navLinkClass}>Employers</NavLink></li>
                    <li><NavLink to="/candidates" className={navLinkClass}>Candidates</NavLink></li>
                    {user && <li><NavLink to="/job-alerts" className={navLinkClass}>Job Alerts</NavLink></li>}
                  </>
                )}

                {/* Common features for all users */}
                <li><NavLink to="/mock-interview" className={navLinkClass}>Interview</NavLink></li>
                <li><NavLink to="/take-certificate" className={navLinkClass}>Certificate</NavLink></li>
                <li><NavLink to="/customer-supports" className={navLinkClass}>Support</NavLink></li>
              </ul>
            </nav>

            {/* Right Info: Phone & Language */}
            <div className="flex items-center gap-6 text-gray-500">
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-gray-600" />
                <span className="font-semibold text-gray-700 text-xs">0333032782</span>
              </div>

              {/* Language Dropdown */}
              <div className="relative z-50" ref={dropdownRef}>
                <button 
                  onClick={() => setLangOpen(!langOpen)} 
                  className="flex items-center gap-2 cursor-pointer hover:text-blue-600 transition-colors"
                >
                  <img src={currentLang.flag} alt={currentLang.name} className="w-4 h-auto rounded-sm" />
                  <span className="text-xs">{currentLang.name}</span>
                  <ChevronDown size={12} />
                </button>
                
                {langOpen && (
                  <ul className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-[100]">
                    {languages.map((lang) => (
                      <li key={lang.code}>
                        <button 
                          onClick={() => { setCurrentLang(lang); setLangOpen(false); }} 
                          className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 w-full text-left text-xs text-gray-700"
                        >
                          <img src={lang.flag} alt={lang.name} className="w-4 h-auto rounded-sm" />
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

      {/* --- TẦNG 2: MAIN HEADER (LOGO + SEARCH + AUTH BUTTONS) --- */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between bg-white">
        
        {/* LOGO */}
        <Link to="/home" className="flex items-center gap-2 shrink-0 group">
          <Briefcase size={32} className="text-blue-600 group-hover:text-blue-700 transition-colors" strokeWidth={2.5} />
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

        {/* AUTH BUTTONS / USER MENU */}
        <div className="flex items-center gap-3">
          {user ? (
            /* User Menu Dropdown */
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {user.username?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-semibold text-gray-800">{user.username}</p>
                  <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                </div>
                <ChevronDown size={16} className="text-gray-400" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-800">{user.username}</p>
                    <p className="text-xs text-gray-500">{user.email || 'No email'}</p>
                  </div>

                  {user?.role === 'employer' ? (
                    /* Employer Menu */
                    <>
                      <Link
                        to="/employer/dashboard"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-sm text-gray-700"
                      >
                        <Briefcase size={18} />
                        <span>Dashboard</span>
                      </Link>

                      <Link
                        to="/employer/jobs"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-sm text-gray-700"
                      >
                        <Briefcase size={18} />
                        <span>My Jobs</span>
                      </Link>

                      <Link
                        to="/employer/jobs/create"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-sm text-gray-700"
                      >
                        <Settings size={18} />
                        <span>Post New Job</span>
                      </Link>

                      <Link
                        to="/employer/subscription"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-sm text-gray-700"
                      >
                        <Settings size={18} />
                        <span>Subscription</span>
                      </Link>
                    </>
                  ) : (
                    /* Candidate Menu */
                    <>
                      <Link
                        to="/candidate/profile"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-sm text-gray-700"
                      >
                        <User size={18} />
                        <span>My Profile</span>
                      </Link>

                      <Link
                        to="/saved-jobs"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-sm text-gray-700"
                      >
                        <Bookmark size={18} />
                        <span>Saved Jobs</span>
                      </Link>

                      <Link
                        to="/candidate/applied-jobs"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-sm text-gray-700"
                      >
                        <FileCheck size={18} />
                        <span>Applied Jobs</span>
                      </Link>

                      <Link
                        to="/candidate/profile/edit"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-sm text-gray-700"
                      >
                        <Settings size={18} />
                        <span>Edit Profile</span>
                      </Link>
                    </>
                  )}

                  <div className="border-t border-gray-100 mt-2 pt-2">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 transition-colors text-sm text-red-600 w-full"
                    >
                      <LogOut size={18} />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Guest Auth Buttons */
            <>
              <Link
                to="/login"
                className="px-5 py-2.5 text-blue-600 font-bold text-sm hover:bg-blue-50 rounded-md transition-colors"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="px-5 py-2.5 bg-blue-600 text-white font-bold text-sm rounded-md shadow-md hover:bg-blue-700 transition-all hover:shadow-lg"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}