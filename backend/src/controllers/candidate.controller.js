const pool = require("../config/db");

// Get candidate dashboard stats
exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get applied jobs count
    const appliedResult = await pool.query(
      `SELECT COUNT(*) as count FROM job_applications WHERE user_id = $1`,
      [userId]
    );

    // Get favorite jobs count
    const favoriteResult = await pool.query(
      `SELECT COUNT(*) as count FROM saved_jobs WHERE user_id = $1`,
      [userId]
    );

    // Get job alerts count
    const alertsResult = await pool.query(
      `SELECT COUNT(*) as count FROM job_alerts WHERE user_id = $1`,
      [userId]
    );

    res.json({
      success: true,
      stats: {
        appliedJobs: parseInt(appliedResult.rows[0].count),
        favoriteJobs: parseInt(favoriteResult.rows[0].count),
        jobAlerts: parseInt(alertsResult.rows[0].count),
      }
    });
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get dashboard statistics'
    });
  }
};

// Get candidate's applied jobs
exports.getAppliedJobs = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT
        ja.*,
        j.id as job_id,
        j.title,
        COALESCE(c.name, 'Unknown Company') as company_name,
        j.location,
        j.salary_min,
        j.salary_max,
        j.job_type,
        j.experience_level,
        j.created_at as job_posted_date
       FROM job_applications ja
       JOIN jobs j ON j.id = ja.job_id
       LEFT JOIN companies c ON c.id = j.company_id
       WHERE ja.user_id = $1
       ORDER BY ja.applied_at DESC`,
      [userId]
    );

    res.json({
      success: true,
      data: result.rows.map(row => ({
        id: row.id,
        job_id: row.job_id,
        status: row.status || 'pending',
        created_at: row.applied_at,
        job: {
          id: row.job_id,
          title: row.title,
          company_name: row.company_name,
          location: row.location,
          salary_min: row.salary_min,
          salary_max: row.salary_max,
          job_type: row.job_type,
          experience_level: row.experience_level,
          created_at: row.job_posted_date
        }
      }))
    });
  } catch (error) {
    console.error('Error getting applied jobs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get applied jobs'
    });
  }
};

// Get recent jobs (for dashboard)
exports.getRecentJobs = async (req, res) => {
  try {
    const userId = req.user.id;
    const limit = req.query.limit || 3;

    // Get recent jobs with application status
    const result = await pool.query(
      `SELECT
        j.*,
        CASE WHEN ja.id IS NOT NULL THEN true ELSE false END as is_applied,
        CASE WHEN sj.id IS NOT NULL THEN true ELSE false END as is_saved
       FROM jobs j
       LEFT JOIN job_applications ja ON ja.job_id = j.id AND ja.user_id = $1
       LEFT JOIN saved_jobs sj ON sj.job_id = j.id AND sj.user_id = $1
       WHERE j.status = 'active'
       ORDER BY j.created_at DESC
       LIMIT $2`,
      [userId, limit]
    );

    res.json({
      success: true,
      jobs: result.rows
    });
  } catch (error) {
    console.error('Error getting recent jobs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get recent jobs'
    });
  }
};

module.exports = exports;
