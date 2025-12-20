import { useState } from 'react';
import JobCard from '../../components/dashboard/JobCard';
import Pagination from '../../components/dashboard/Pagination';
import { mockJobs } from '../../data/mockJobs';
export default function JobAlerts() {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="flex-1 min-w-0">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
          Job Alerts <span className="text-gray-500 font-normal">(19 new jobs)</span>
        </h1>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {mockJobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={5}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
