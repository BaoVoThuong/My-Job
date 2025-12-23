import FavoriteJobs from "../pages/jobs/FavoriteJobs";
import JobAlerts from "../pages/jobs/JobAlerts";
import DashboardLayout from "../layouts/DashboardLayout";
import Home from "../pages/Home";
import JobList from "../pages/jobs/JobList";


export const jobsRoutes = [
  {
    path: "/", // Đường dẫn gốc
    element: <Home />, 
  },
  {
    path: "/jobs",
    element: <DashboardLayout />,
    children: [
      { index: true, element: <JobList /> },
      { path: "applied-jobs", element: <div className="flex-1 bg-gray-50 p-8">Applied Jobs</div> },
      { path: "favorite-jobs", element: <FavoriteJobs /> },
      { path: "alert-jobs", element: <JobAlerts /> },
      { path: "job-alert", element: <div className="flex-1 bg-gray-50 p-8">Job Alert</div> },
      { path: "vip-account", element: <div className="flex-1 bg-gray-50 p-8">VIP Account</div> },
      { path: "settings", element: <div className="flex-1 bg-gray-50 p-8">Settings</div> },
    ],
  },
];