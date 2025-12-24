import { NavLink } from 'react-router-dom';
import { LayoutGrid, Briefcase, Heart, AlertCircle, Star, Settings, LogOut } from '../icons';

const navItems = [

  { to: '/candidate/dashboard', icon: LayoutGrid, label: 'Overview' },
  { to: '/jobs/applied-jobs', icon: Briefcase, label: 'Applied Jobs' },
  { to: '/jobs/favorite-jobs', icon: Heart, label: 'Favorite Jobs' },
  { to: '/jobs/alert-jobs', icon: AlertCircle, label: 'Job Alert', badge: '09' },
  { to: '/jobs/vip-account', icon: Star, label: 'Vip account' },
  { to: '/jobs/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar() {
  return (
    <aside className="w-full lg:w-72 bg-white rounded-lg border border-gray-200 h-fit flex-shrink-0">
      <div className="p-6 lg:p-8">
        <h2 className="text-xs font-semibold text-gray-700 mb-4 lg:mb-6 tracking-wider">CANDIDATE DASHBOARD</h2>
        <nav className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible gap-2 lg:gap-0 lg:space-y-1 pb-2 lg:pb-0">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              // 2. SỬA LẠI ĐIỀU KIỆN ACTIVE: Để nút Overview sáng khi đúng đường dẫn
              end={item.to === '/candidate/dashboard'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 lg:py-3.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <span className="px-2.5 py-0.5 bg-blue-600 text-white text-xs font-semibold rounded-full">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>
        
        <div className="mt-6 lg:mt-8 pt-4 lg:pt-6 border-t border-gray-200">
          <button className="flex items-center gap-3 px-4 py-3 lg:py-3.5 w-full rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span>Log-out</span>
          </button>
        </div>
      </div>
    </aside>
  );
}