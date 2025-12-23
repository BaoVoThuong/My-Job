import { Outlet } from 'react-router-dom';
import Sidebar from '../components/dashboard/Sidebar';

export default function DashboardLayout() {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-16">
      <div className="flex flex-col lg:flex-row mx-auto gap-6 lg:gap-8 py-6 lg:py-8">
        <Sidebar />
        <Outlet />
      </div>
    </div>
  );
}
