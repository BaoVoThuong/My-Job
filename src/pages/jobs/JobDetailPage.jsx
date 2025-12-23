
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getJobDetail } from "../../services/jobService";

export default function JobDetailPage() {
  const { jobId } = useParams();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");

    getJobDetail(jobId)
      .then((res) => setJob(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [jobId]);

  /* ===== STATE ===== */
  if (loading) {
    return <div className="flex-1 p-8">Loading job detail...</div>;
  }

  if (error) {
    return (
      <div className="flex-1 p-8 text-red-500">
        {error}
      </div>
    );
  }

  if (!job) return null;

  /* ===== RENDER ===== */
  return (
    <div className="flex-1 bg-gray-50 p-8">
      <h1 className="text-2xl font-semibold mb-4">{job.title}</h1>

      <div className="bg-white p-6 rounded shadow-sm space-y-4">
        <p><strong>Company:</strong> {job.companyName}</p>
        <p><strong>Location:</strong> {job.location}</p>
        <p><strong>Level:</strong> {job.level}</p>
        <p><strong>Employment Type:</strong> {job.employmentType}</p>
        <p>
          <strong>Salary:</strong>{" "}
          {job.salaryMin.toLocaleString()} – {job.salaryMax.toLocaleString()}
        </p>

        <div>
          <h2 className="font-medium mt-4 mb-1">Job Description</h2>
          <p>{job.description}</p>
        </div>

        <div>
          <h2 className="font-medium mt-4 mb-1">Requirements</h2>
          <p>{job.requirements}</p>
        </div>

        <div>
          <h2 className="font-medium mt-4 mb-1">Benefits</h2>
          <p>{job.benefits}</p>
        </div>
      </div>

      {/* APPLY – dùng cho WTD-36 */}
      <div className="mt-6">
        <button className="bg-blue-600 text-white px-6 py-2 rounded">
          Ứng tuyển
        </button>
      </div>
    </div>
  );
}
