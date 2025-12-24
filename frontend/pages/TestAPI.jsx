import { useState, useEffect } from 'react';
import jobService from '../services/jobService';

export default function TestAPI() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await jobService.getAllJobs();
      console.log('API Response:', response);
      setJobs(response.data || []);
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '20px' }}>
        ✅ Test BE-FE Connection
      </h1>

      {loading && <p style={{ fontSize: '18px' }}>Loading...</p>}

      {error && (
        <div style={{ color: 'red', padding: '10px', border: '2px solid red', borderRadius: '8px', marginBottom: '20px' }}>
          <strong>❌ Error:</strong> {error}
        </div>
      )}

      {!loading && !error && (
        <div>
          <div style={{ background: '#10b981', color: 'white', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>
              ✅ Kết nối thành công! Tìm thấy {jobs.length} jobs từ Backend
            </h2>
          </div>

          <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '10px' }}>
            Jobs from Database:
          </h3>

          <div style={{ display: 'grid', gap: '15px' }}>
            {jobs.map((job) => (
              <div
                key={job.id}
                style={{
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  padding: '20px',
                  background: 'white',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              >
                <h4 style={{ fontSize: '20px', fontWeight: 'bold', color: '#2563eb', marginBottom: '10px' }}>
                  {job.title}
                </h4>
                <p style={{ color: '#666', marginBottom: '5px' }}>
                  <strong>Company:</strong> {job.company_name}
                </p>
                <p style={{ color: '#666', marginBottom: '5px' }}>
                  <strong>Location:</strong> {job.location}
                </p>
                <p style={{ color: '#666', marginBottom: '5px' }}>
                  <strong>Salary:</strong> ${job.salary_min} - ${job.salary_max}
                </p>
                <p style={{ color: '#666', marginBottom: '5px' }}>
                  <strong>Type:</strong> {job.job_type}
                </p>
                <p style={{ color: '#666', marginBottom: '10px' }}>
                  <strong>Skills:</strong> {job.skills?.join(', ') || 'N/A'}
                </p>
                <p style={{ color: '#888', fontSize: '14px' }}>
                  {job.description}
                </p>
              </div>
            ))}
          </div>

          <details style={{ marginTop: '30px', padding: '15px', background: '#f5f5f5', borderRadius: '8px' }}>
            <summary style={{ cursor: 'pointer', fontWeight: 'bold', fontSize: '18px' }}>
              📄 View Raw JSON
            </summary>
            <pre style={{ marginTop: '10px', padding: '15px', background: '#1e293b', color: '#fff', borderRadius: '8px', overflow: 'auto', fontSize: '12px' }}>
              {JSON.stringify(jobs, null, 2)}
            </pre>
          </details>
        </div>
      )}

      <button
        onClick={fetchJobs}
        style={{
          marginTop: '20px',
          padding: '12px 24px',
          background: '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}
      >
        🔄 Refresh
      </button>
    </div>
  );
}
