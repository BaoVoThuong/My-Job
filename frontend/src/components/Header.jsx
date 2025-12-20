import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Logo from './common/Logo';
import SearchBar from './common/SearchBar';
import { Phone, ChevronDown, Bell } from './icons';
import { Crown } from 'lucide-react';

const languages = [
  { code: 'en', name: 'English', flag: 'https://flagcdn.com/w20/us.png' },
  { code: 'fr', name: 'French', flag: 'https://flagcdn.com/w20/fr.png' },
  { code: 'de', name: 'German', flag: 'https://flagcdn.com/w20/de.png' },
  { code: 'es', name: 'Spanish', flag: 'https://flagcdn.com/w20/es.png' },
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

  return (
    <header className="bg-white border-b border-gray-200 w-full">
      <div className="bg-gray-100 border-b border-gray-100 hidden lg:block">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-16">
          <nav className="flex items-center justify-between h-14 mx-auto">
            <ul className="flex items-center gap-4 lg:gap-6 xl:gap-10 text-sm">
              <li><Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors">Home</Link></li>
              <li><Link to="/find-job" className="text-gray-700 hover:text-blue-600 transition-colors">Find Job</Link></li>
              <li><Link to="/find-employers" className="text-gray-700 hover:text-blue-600 transition-colors">Find Employers</Link></li>
              <li><Link to="/dashboard" className="text-blue-600 hover:text-blue-700 transition-colors font-medium">Dashboard</Link></li>
              <li><Link to="/jobs/alert-jobs" className="text-gray-700 hover:text-blue-600 transition-colors">Job Alerts</Link></li>
              <li><Link to="/jobs/favorite-jobs" className="text-gray-700 hover:text-blue-600 transition-colors">Favorite Jobs</Link></li>
              <li className="hidden xl:block"><Link to="/mock-interview" className="text-gray-700 hover:text-blue-600 transition-colors">Mock Interview</Link></li>
              <li className="hidden xl:block"><Link to="/certificate" className="text-gray-700 hover:text-blue-600 transition-colors">Take Certificate</Link></li>
            </ul>

            <div className="flex items-center gap-4 lg:gap-8 text-sm">
              <div className="flex items-center gap-2 text-gray-700">
                <Phone className="w-4 h-4" />
                <span className="hidden xl:inline">+1-202-555-0178</span>
                <span className="xl:hidden">+1-202-555</span>
              </div>

              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setLangOpen(!langOpen)}
                  className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <img src={currentLang.flag} alt={currentLang.name} className="w-5 h-3" />
                  <span className="hidden lg:inline">{currentLang.name}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {langOpen && (
                  <ul className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg z-50">
                    {languages.map((lang) => (
                      <li key={lang.code}>
                        <button
                          onClick={() => { setCurrentLang(lang); setLangOpen(false); }}
                          className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 w-full text-left"
                        >
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

      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-16">
        <div className="flex items-center justify-between h-16 lg:h-20 mx-auto gap-4 sm:gap-6 lg:gap-12">
          <Logo />
          <div className="flex-1 max-w-3xl">
            <SearchBar />
          </div>
          <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
            <button className="p-2 lg:p-2.5 hover:bg-gray-50 rounded-lg transition-colors relative">
              <Crown className="w-5 h-5 lg:w-6 lg:h-6 text-gray-700" />
            </button>
            <button className="p-2 lg:p-2.5 hover:bg-gray-50 rounded-lg transition-colors relative">
              <Bell className="w-5 h-5 lg:w-6 lg:h-6 text-gray-700" />
              <span className="absolute top-1.5 right-1.5 lg:top-2 lg:right-2 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button className="w-9 h-9 lg:w-10 lg:h-10 rounded-full bg-gray-900 text-white flex items-center justify-center font-medium hover:bg-gray-800 transition-colors">
              <span className="text-xs lg:text-sm">JD</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}