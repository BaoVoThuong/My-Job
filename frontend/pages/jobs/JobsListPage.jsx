import { useEffect, useState } from "react";

import { getJobs } from "../../services/jobService.jsx";




/* =======================
   UTIL: debounce hook
======================= */
function useDebounce(value, delay = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

/* =======================
   PAGE
======================= */
export default function JobsListPage() {
  /* ---------- state ---------- */
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // filters
  const [q, setQ] = useState("");
  const [location, setLocation] = useState("");
  const [level, setLevel] = useState("");
  const [employmentType, setEmploymentType] = useState("");

  // pagination
  const [page, setPage] = useState(1);
  const [size] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  /* ---------- debounce ---------- */
  const debouncedQ = useDebounce(q, 400);

  /* ---------- effect ---------- */
  useEffect(() => {
    fetchJobs();
  }, [debouncedQ, location, level, employmentType, page]);

  /* ---------- API call ---------- */
  async function fetchJobs() {
    try {
      setLoading(true);
      setError("");

      const res = await getJobs({
        q: debouncedQ,
        location,
        level,
        employmentType,
        page,
        size,
      });

      setJobs(res.items);
      setTotalPages(res.meta.totalPages);
    } catch (err) {
      // giả lập phân loại lỗi theo mô tả
      if (err.message?.includes("INVALID")) {
        setError(err.message);
      } else {
        setError("Không tải được danh sách việc làm, vui lòng thử lại sau.");
      }
    } finally {
      setLoading(false);
    }
  }

  /* =======================
     RENDER
  ======================= */
  return (
    <div className="flex-1 bg-gray-50 p-8">
      <h1 className="text-2xl font-semibold mb-6">Job List</h1>

      {/* SEARCH + FILTER */}
      <div className="bg-white p-4 rounded shadow-sm mb-6 flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Search job..."
          value={q}
          onChange={(e) => {
            setPage(1);
            setQ(e.target.value);
          }}
          className="border px-3 py-2 rounded w-60"
        />

        <select
          value={location}
          onChange={(e) => {
            setPage(1);
            setLocation(e.target.value);
          }}
          className="border px-3 py-2 rounded"
        >
          <option value="">All locations</option>
          <option value="Idaho">Idaho</option>
          <option value="Minnesota">Minnesota</option>
          <option value="United Kingdom of Great Britain">
            United Kingdom
          </option>
        </select>

        <select
          value={level}
          onChange={(e) => {
            setPage(1);
            setLevel(e.target.value);
          }}
          className="border px-3 py-2 rounded"
        >
          <option value="">All levels</option>
          <option value="Junior">Junior</option>
          <option value="Senior">Senior</option>
        </select>

        <select
          value={employmentType}
          onChange={(e) => {
            setPage(1);
            setEmploymentType(e.target.value);
          }}
          className="border px-3 py-2 rounded"
        >
          <option value="">All types</option>
          <option value="Full Time">Full Time</option>
          <option value="Part Time">Part Time</option>
        </select>
      </div>

      {/* STATE */}
      {loading && <p>Loading jobs...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && jobs.length === 0 && (
        <p>No jobs found.</p>
      )}

      {/* LIST */}
      <ul className="space-y-4">
        {jobs.map((job) => (
          <li
            key={job.id}
            className="bg-white p-4 rounded shadow-sm"
          >
            <h2 className="font-medium">{job.title}</h2>
            <p className="text-sm text-gray-500">{job.location}</p>
            <p className="text-sm text-gray-500">
              {job.employmentType} • {job.level}
            </p>
            <p className="text-sm text-gray-500">
              Salary: ${job.salary}
            </p>
          </li>
        ))}
      </ul>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="mt-6 flex gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>

          <span className="px-3 py-1">
            Page {page} / {totalPages}
          </span>

          <button
            disabled={page === totalPages}
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
