import { useState, useEffect } from 'react';
import jobService from '../services/jobService';

export const useJobs = (filters = {}) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [meta, setMeta] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, [JSON.stringify(filters)]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = Object.keys(filters).length > 0
        ? await jobService.searchJobs(filters)
        : await jobService.getAllJobs();

      setJobs(data.data || []);
      setMeta(data.meta || null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch jobs');
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    fetchJobs();
  };

  return { jobs, loading, error, meta, refetch };
};

export const useJob = (jobId) => {
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (jobId) {
      fetchJob();
    }
  }, [jobId]);

  const fetchJob = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await jobService.getJobById(jobId);
      setJob(data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch job');
      console.error('Error fetching job:', err);
    } finally {
      setLoading(false);
    }
  };

  return { job, loading, error, refetch: fetchJob };
};
