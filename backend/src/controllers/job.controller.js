const pool = require("../config/db");

exports.getAllJobs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const query = `
      SELECT 
        j.id,
        j.title,
        j.description,
        j.location,
        j.salary_min,
        j.salary_max,
        j.job_type,
        j.skills,
        j.active_flag,
        j.created_at,
        j.updated_at,
        c.name as company_name,
        c.logo_url as company_logo,
        u.full_name as employer_name
      FROM jobs j
      LEFT JOIN companies c ON j.company_id = c.id
      LEFT JOIN users u ON j.employer_id = u.id
      WHERE j.active_flag = true
      ORDER BY j.created_at DESC
      LIMIT $1 OFFSET $2
    `;

    const countQuery = `
      SELECT COUNT(*) as total
      FROM jobs j
      WHERE j.active_flag = true
    `;

    const [result, countResult] = await Promise.all([
      pool.query(query, [limit, offset]),
      pool.query(countQuery)
    ]);

    const total = parseInt(countResult.rows[0].total);
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      count: result.rowCount,
      data: result.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch jobs",
    });
  }
};

exports.getJobById = async (req, res) => {
  try {
    const { id } = req.params;
    const query = `
      SELECT *
      FROM jobs
      WHERE id = $1
    `;
    const result = await pool.query(query, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }
    res.status(200).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error fetching job by ID:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch job",
    });
  }
};

exports.searchJobs = async (req, res) => {
  try {
    const {
      q,
      skill,
      location,
      job_type,
      experience_level,
      min_salary,
      max_salary,
      page = 1,
      limit = 10,
    } = req.query;

    const offset = (page - 1) * limit;

    let conditions = ["active_flag = TRUE"];
    let values = [];
    let idx = 1;

    // Search title + description
    if (q) {
      conditions.push(`(title ILIKE $${idx} OR description ILIKE $${idx})`);
      values.push(`%${q}%`);
      idx++;
    }

    // Filter skill (TEXT[])
    if (skill) {
      conditions.push(`skills @> ARRAY[$${idx}]`);
      values.push(skill);
      idx++;
    }

    // Location
    if (location) {
      conditions.push(`location ILIKE $${idx}`);
      values.push(`%${location}%`);
      idx++;
    }

    // Job type (case-insensitive, flexible matching)
    if (job_type) {
      conditions.push(`job_type ILIKE $${idx}`);
      values.push(`%${job_type.replace(/\s+/g, '%')}%`);
      idx++;
    }

    // Experience level (case-insensitive, flexible matching)
    if (experience_level) {
      conditions.push(`experience_level ILIKE $${idx}`);
      values.push(`%${experience_level.replace(/\s+/g, '%')}%`);
      idx++;
    }

    // Salary range
    if (min_salary) {
      conditions.push(`salary_max >= $${idx}`);
      values.push(min_salary);
      idx++;
    }

    if (max_salary) {
      conditions.push(`salary_min <= $${idx}`);
      values.push(max_salary);
      idx++;
    }

    const whereClause = conditions.length
      ? `WHERE ${conditions.join(" AND ")}`
      : "";

    const query = `
      SELECT *
      FROM jobs
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${idx} OFFSET $${idx + 1}
    `;

    values.push(limit, offset);

    const result = await pool.query(query, values);

    res.json({
      meta: {
        page: Number(page),
        limit: Number(limit),
        count: result.rowCount,
      },
      data: result.rows,
    });
  } catch (error) {
    console.error("Search jobs error:", error);
    res.status(500).json({
      message: "Failed to search jobs",
    });
  }
};

exports.applyJob = async (req, res) => {
  try {
    const userId = req.user.id;
    const jobId = req.params.id;
    const { profile_id } = req.body; // For premium feature with multiple profiles

    // Get user's profile (default profile if not specified)
    let profileId = profile_id;
    if (!profileId) {
      const profileResult = await pool.query(
        `SELECT id FROM candidate_profiles WHERE user_id = $1 LIMIT 1`,
        [userId]
      );
      if (profileResult.rows.length > 0) {
        profileId = profileResult.rows[0].id;
      } else {
        return res.status(400).json({
          success: false,
          message: "No profile found. Please create a profile first."
        });
      }
    }

    // Check if already applied
    const existingApplication = await pool.query(
      `SELECT id FROM job_applications WHERE user_id = $1 AND job_id = $2`,
      [userId, jobId]
    );

    if (existingApplication.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "You have already applied for this job"
      });
    }

    // Insert application with profile_id
    await pool.query(
      `INSERT INTO job_applications (user_id, job_id, profile_id)
       VALUES ($1, $2, $3)`,
      [userId, jobId, profileId]
    );

    res.json({
      success: true,
      message: "Applied successfully"
    });
  } catch (error) {
    console.error("Error applying for job:", error);
    res.status(500).json({
      success: false,
      message: "Failed to apply for job"
    });
  }
};

exports.saveJob = async (req, res) => {
  const userId = req.user.id;
  if( !userId ) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const jobId = req.params.id;
  await pool.query(
    `
    INSERT INTO candidate_job_favorites (userid, jobid) 
    VALUES ($1, $2)
    ON CONFLICT DO NOTHING
    `,
    [userId, jobId]
  );
  res.json({ 
    success: true,
    message: "Job saved successfully" 
  });
};

exports.unsaveJob = async (req, res) => {
  const userId = req.user.id;
  const jobId = req.params.id;
  await pool.query(
    `
    DELETE FROM candidate_job_favorites
    WHERE userid = $1 AND jobid = $2
    `,
    [userId, jobId]
  );
  res.json({
    success: true,
    message: "Job unsaved successfully"
  });
};

exports.getSavedJobs = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const query = `
      SELECT
        j.id,
        j.title,
        j.description,
        j.location,
        j.salary_min,
        j.salary_max,
        j.job_type,
        j.skills,
        j.active_flag,
        j.created_at,
        j.updated_at,
        c.name as company_name,
        c.logo_url as company_logo,
        u.full_name as employer_name
      FROM candidate_job_favorites f
      JOIN jobs j ON f.jobid = j.id
      LEFT JOIN companies c ON j.company_id = c.id
      LEFT JOIN users u ON j.employer_id = u.id
      WHERE f.userid = $1 AND j.active_flag = true
      ORDER BY f.created_at DESC
      LIMIT $2 OFFSET $3
    `;

    const countQuery = `
      SELECT COUNT(*) as total
      FROM candidate_job_favorites f
      JOIN jobs j ON f.jobid = j.id
      WHERE f.userid = $1 AND j.active_flag = true
    `;

    const [result, countResult] = await Promise.all([
      pool.query(query, [userId, limit, offset]),
      pool.query(countQuery, [userId])
    ]);

    const total = parseInt(countResult.rows[0].total);
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      count: result.rowCount,
      data: result.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    });
  } catch (error) {
    console.error("Error fetching saved jobs:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch saved jobs",
    });
  }
};

// Get applied job IDs for current user
exports.getAppliedJobIds = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT job_id FROM job_applications WHERE user_id = $1`,
      [userId]
    );

    const jobIds = result.rows.map(row => row.job_id);

    res.json({
      success: true,
      data: jobIds
    });
  } catch (error) {
    console.error("Error fetching applied job IDs:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch applied jobs"
    });
  }
};