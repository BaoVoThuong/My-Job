import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getJobDetail } from "../../services/jobService";
import jobService from "../../services/jobService";
import { useAuth } from "../../context/AuthContext";

/* =======================
   APPLY JOB MODAL
======================= */
function ApplyJobModal({ isOpen, onClose, jobId, userId }) {
  const [selectedProfile, setSelectedProfile] = useState("default");
  const [profiles, setProfiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  // Fetch user profiles when modal opens
  useEffect(() => {
    if (isOpen && userId) {
      fetchUserProfiles();
    }
  }, [isOpen, userId]);

  const fetchUserProfiles = async () => {
    try {
      // For now, just use default profile since we only have 1 profile per user
      // In the future with premium, this will fetch multiple profiles
      setProfiles([{ id: "default", name: "Default Profile" }]);
    } catch (err) {
      console.error("Error fetching profiles:", err);
    }
  };

  const handleSubmit = async () => {
    if (!selectedProfile) {
      alert("Please select a profile");
      return;
    }

    try {
      setSubmitting(true);
      // Send profile_id to backend (null for default profile)
      const profileId = selectedProfile === "default" ? null : selectedProfile;
      const response = await jobService.applyJob(jobId, profileId);

      if (response.success) {
        alert(response.message || "Application submitted successfully!");
        onClose();
      } else {
        alert(response.message || "Failed to apply for job");
      }
    } catch (err) {
      console.error("Error applying for job:", err);
      const errorMsg = err.response?.data?.message || "Failed to apply. Please try again.";
      alert(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Apply for Job</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Select Profile</label>
          <select
            value={selectedProfile}
            onChange={(e) => setSelectedProfile(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          >
            <option value="">-- Choose a profile --</option>
            <option value="default">Default Profile</option>
            <option value="premium1">Premium Profile 1 (Coming Soon)</option>
            <option value="premium2">Premium Profile 2 (Coming Soon)</option>
          </select>
          <p className="text-sm text-gray-500 mt-2">
            💡 Premium users can create multiple profiles for different job types
          </p>
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit Application"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* =======================
   JOB DETAIL PAGE
======================= */
export default function JobDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);

  useEffect(() => {
    const fetchJobDetail = async () => {
      try {
        setLoading(true);
        const response = await getJobDetail(id);
        setJob(response.data);
      } catch (err) {
        console.error("Error fetching job detail:", err);
        setError("Không thể tải thông tin công việc");
      } finally {
        setLoading(false);
      }
    };

    const checkSavedStatus = async () => {
      try {
        const savedRes = await jobService.getSavedJobs(1, 1000);
        const savedIds = savedRes.data.map(job => job.id);
        setIsSaved(savedIds.includes(parseInt(id)));
      } catch (err) {
        console.error("Error checking saved status:", err);
      }
    };

    fetchJobDetail();
    checkSavedStatus();
  }, [id]);

  const handleToggleSave = async () => {
    try {
      if (isSaved) {
        await jobService.unsaveJob(id);
        setIsSaved(false);
      } else {
        await jobService.saveJob(id);
        setIsSaved(true);
      }
    } catch (err) {
      console.error("Error toggling save:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-red-500 mb-4">{error || "Job not found"}</p>
          <button
            onClick={() => navigate("/find-job")}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Back to Job List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="text-sm text-gray-500">
            <button onClick={() => navigate("/")} className="hover:text-blue-600">
              Home
            </button>
            {" / "}
            <button onClick={() => navigate("/find-job")} className="hover:text-blue-600">
              Find Job
            </button>
            {" / "}
            <span className="text-gray-900">Job Details</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Header */}
            <div className="bg-white rounded-lg p-8 border">
              <div className="flex items-start gap-6">
                <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-3xl">📱</span>
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
                  <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-4">
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      {job.location}
                    </span>
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                      </svg>
                      {job.salary_min && job.salary_max
                        ? `$${job.salary_min?.toLocaleString()} - $${job.salary_max?.toLocaleString()}`
                        : 'Negotiable'}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 bg-red-50 text-red-600 text-sm rounded-full">Featured</span>
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 text-sm rounded-full">{job.job_type || 'Full Time'}</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleToggleSave}
                    className={`p-3 border rounded-lg ${isSaved ? "text-black" : "text-gray-400 hover:bg-gray-50"}`}
                  >
                    <svg className="w-6 h-6" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setShowApplyModal(true)}
                    className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                  >
                    Apply Now →
                  </button>
                </div>
              </div>
            </div>

            {/* Job Description */}
            <div className="bg-white rounded-lg p-8 border">
              <h2 className="text-2xl font-bold mb-4">Job Description</h2>
              <div className="prose max-w-none text-gray-700">
                <p>{job.description || "No description available."}</p>
              </div>
            </div>

            {/* Responsibilities */}
            <div className="bg-white rounded-lg p-8 border">
              <h2 className="text-2xl font-bold mb-4">Responsibilities</h2>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Design and develop high-quality software solutions</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Collaborate with cross-functional teams</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Write clean, maintainable code</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Participate in code reviews</span>
                </li>
              </ul>
            </div>

            {/* Share Job */}
            <div className="bg-white rounded-lg p-8 border">
              <h3 className="text-xl font-semibold mb-4">Share this job:</h3>
              <div className="flex gap-3">
                <button className="px-6 py-2 bg-blue-600 text-white rounded flex items-center gap-2 hover:bg-blue-700">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                    <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                  </svg>
                  Facebook
                </button>
                <button className="px-6 py-2 bg-sky-500 text-white rounded flex items-center gap-2 hover:bg-sky-600">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                  Facebook
                </button>
                <button className="px-6 py-2 bg-red-600 text-white rounded flex items-center gap-2 hover:bg-red-700">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                  </svg>
                  Pinterest
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Job Overview */}
            <div className="bg-white rounded-lg p-6 border">
              <h3 className="text-xl font-bold mb-4">Job Overview</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">JOB POSTED:</p>
                    <p className="font-semibold">{new Date(job.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">JOB EXPIRE IN:</p>
                    <p className="font-semibold">{new Date(job.updated_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">EDUCATION</p>
                    <p className="font-semibold">Graduation</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                      <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">EXPERIENCE</p>
                    <p className="font-semibold">10-15 Years</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">SALARY</p>
                    <p className="font-semibold">
                      {job.salary_min && job.salary_max
                        ? `$${job.salary_min?.toLocaleString()}-${job.salary_max?.toLocaleString()}/year`
                        : 'Negotiable'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">LOCATION</p>
                    <p className="font-semibold">{job.location}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">JOB TYPE</p>
                    <p className="font-semibold">{job.job_type || 'Full Time'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Company Info (if available) */}
            {job.company_name && (
              <div className="bg-white rounded-lg p-6 border">
                <h3 className="text-xl font-bold mb-4">{job.company_name}</h3>
                <p className="text-gray-600 text-sm mb-4">Social networking service</p>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Founded in:</span>
                    <span className="text-gray-600">March 21, 2006</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Organization type:</span>
                    <span className="text-gray-600">Private Company</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Company size:</span>
                    <span className="text-gray-600">120-300 Employees</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Phone:</span>
                    <span className="text-gray-600">(406) 555-0120</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Email:</span>
                    <span className="text-gray-600">twitter@gmail.com</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Website:</span>
                    <a href="#" className="text-blue-600">https://twitter.com</a>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <a href="#" className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white">f</a>
                  <a href="#" className="w-8 h-8 bg-sky-500 rounded flex items-center justify-center text-white">t</a>
                  <a href="#" className="w-8 h-8 bg-blue-700 rounded flex items-center justify-center text-white">in</a>
                  <a href="#" className="w-8 h-8 bg-red-600 rounded flex items-center justify-center text-white">y</a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Apply Job Modal */}
      <ApplyJobModal
        isOpen={showApplyModal}
        onClose={() => setShowApplyModal(false)}
        jobId={id}
        userId={user?.id}
      />
    </div>
  );
}
