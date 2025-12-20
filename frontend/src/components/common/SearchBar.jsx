import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown } from '../icons'; // Đảm bảo bạn đã có các icon này

const countries = [
  { code: 'vn', name: 'Viet Nam', flag: 'https://flagcdn.com/w20/vn.png' },
  { code: 'us', name: 'USA', flag: 'https://flagcdn.com/w20/us.png' },
  { code: 'gb', name: 'United Kingdom', flag: 'https://flagcdn.com/w20/gb.png' },
  { code: 'jp', name: 'Japan', flag: 'https://flagcdn.com/w20/jp.png' },
];

export default function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const dropdownRef = useRef(null);

  // Đóng dropdown khi click ra ngoài vùng chứa
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex items-center bg-white border border-gray-200 rounded-lg w-full max-w-3xl shadow-sm focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
      
      <div className="relative" ref={dropdownRef}>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          type="button"
          className="flex items-center gap-2 px-4 py-2.5 hover:bg-gray-50 transition-colors rounded-l-lg border-r border-gray-200"
        >
          <img 
            src={selectedCountry.flag} 
            alt={selectedCountry.name} 
            className="w-5 h-3.5 object-cover rounded-sm" 
          />
          <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
            {selectedCountry.name}
          </span>
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1 animte-in fade-in zoom-in duration-200">
            {countries.map((country) => (
              <button
                key={country.code}
                onClick={() => {
                  setSelectedCountry(country);
                  setIsOpen(false);
                }}
                className="flex items-center w-full gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                <img src={country.flag} alt={country.name} className="w-5 h-3.5 object-cover" />
                {country.name}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center flex-1 px-4 py-2.5">
        <Search className="w-5 h-5 text-blue-500 flex-shrink-0" />
        <input
          type="text"
          placeholder="Job title, keyword, company"
          className="ml-3 w-full outline-none text-sm text-gray-900 placeholder:text-gray-400 bg-transparent"
        />
      </div>
    </div>
  );
}