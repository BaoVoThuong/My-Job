import { useEffect, useState } from "react";
import { getJobs } from "../../services/jobService.jsx";


export default function JobList() {
  const [jobs, setJobs] = useState([]);
  const [meta, setMeta] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // filter
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchJobs();
  }, [page]);

  async function fetchJobs() {
    try {
      setLoading(true);
      setError("");

      const result = await getJobs({
        q: keyword,
        page,
        size: 5,
      });

      setJobs(result.items);
      setMeta(result.meta);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(e) {
    e.preventDefault();
    setPage(1);
    fetchJobs();
  }

  return (
    <div className="flex-1 bg-gray-50 p-8">
      <h1 className="text-2xl font-semibold mb-6">Job List</h1>

      {/* SEARCH */}
      <form onSubmit={handleSearch} className="mb-6 flex gap-2">
        <input
          type="text"
          placeholder="Search job..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="border px-4 py-2 rounded w-64"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </form>

      {/* LOADING */}
      {loading && <p>Loading jobs...</p>}

      {/* ERROR */}
      {error && <p className="text-red-500">{error}</p>}

      {/* JOB LIST */}
      {!loading && jobs.length === 0 && <p>No jobs found.</p>}

      <ul className="space-y-4">
        {jobs.map((job) => (
          <li
            key={job.id}
            className="bg-white p-4 rounded shadow-sm"
          >
            <h2 className="text-lg font-medium">{job.title}</h2>
            <p className="text-sm text-gray-500">{job.location}</p>
            <p className="text-sm text-gray-500">
              Salary: ${job.salary}
            </p>
          </li>
        ))}
      </ul>

      {/* PAGINATION */}
      {meta.totalPages > 1 && (
        <div className="mt-6 flex gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>

          <span className="px-3 py-1">
            Page {meta.page} / {meta.totalPages}
          </span>

          <button
            disabled={page === meta.totalPages}
            onClick={() => setPage(page + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
