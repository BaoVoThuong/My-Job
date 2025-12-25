const pool = require("../config/db");
const { createJobAlert } = require("./jobAlert.controller");

exports.getJobsByUser = async (req, res) => {
  const userid = req.user.id;
  const page = parseInt(req.query.page) || 1; // trang hiện tại
  const limit = parseInt(req.query.limit) || 10; // số bản ghi mỗi trang
  const offset = (page - 1) * limit;

  try {
    // Lấy tổng số job của user
    const countResult = await pool.query(
      `SELECT COUNT(*) FROM jobs WHERE employer_id = $1`,
      [userid]
    );
    const totalJobs = parseInt(countResult.rows[0].count);

    // Lấy dữ liệu theo limit và offset
    const result = await pool.query(
      `
      SELECT id, title, description, company_id, location, salary_min, salary_max, job_type, skills, active_flag, employer_id
      FROM jobs
      WHERE employer_id = $1
      ORDER BY id DESC
      LIMIT $2 OFFSET $3
      `,
      [userid, limit, offset]
    );

    res.json({
      page,
      limit,
      totalJobs,
      totalPages: Math.ceil(totalJobs / limit),
      jobs: result.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.pushJob = async (req, res) => {
  const {
    title,
    description,
    company_id,
    location,
    salary_min,
    salary_max,
    job_type,
    skills,
    active_flag = true, // Default to true if not provided
  } = req.body;

  const userid = req.user.id;

  try {
    // Check job quota
    const quotaResult = await pool.query(
      `SELECT * FROM employer_job_quotas WHERE user_id = $1`,
      [userid]
    );

    if (quotaResult.rows.length === 0 || quotaResult.rows[0].remaining_quota <= 0) {
      return res.status(403).json({
        success: false,
        message: "You don't have enough job posting quota. Please purchase a subscription plan.",
        quota: quotaResult.rows[0] || { remaining_quota: 0 }
      });
    }

    // Insert job - active_flag defaults to true
    const result = await pool.query(
      `INSERT INTO jobs
      (title, description, company_id, location, salary_min, salary_max, job_type, skills, active_flag, employer_id)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING *`,
      [
        title,
        description,
        company_id,
        location,
        salary_min,
        salary_max,
        job_type,
        skills,
        active_flag,
        userid,
      ]
    );

    // Decrease quota
    await pool.query(
      `UPDATE employer_job_quotas
       SET used_quota = used_quota + 1,
           remaining_quota = remaining_quota - 1,
           last_updated = CURRENT_TIMESTAMP
       WHERE user_id = $1`,
      [userid]
    );

    res.status(201).json({
      success: true,
      message: "Job created successfully",
      data: {
        job: result.rows[0],
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.updateJob = async (req, res) => {
  const jobId = req.params.id;
  const userid = req.user.id; // từ authMiddleware
  const {
    title,
    description,
    company_name,
    location,
    salary_min,
    salary_max,
    job_type,
    experience_level,
    skills,
    active_flag,
  } = req.body;

  try {
    // 1️⃣ Lấy job hiện tại
    const jobCheck = await pool.query(
      `SELECT j.*, c.name as company_name
       FROM jobs j
       LEFT JOIN companies c ON j.company_id = c.id
       WHERE j.id=$1`,
      [jobId]
    );
    if (jobCheck.rows.length === 0) {
      return res.status(404).json({ message: "Job not found" });
    }

    const oldJob = jobCheck.rows[0];

    // 2️⃣ Chỉ update những trường được gửi
    const fields = [];
    const values = [];
    let idx = 1;

    // Track important changes for alert
    const importantChanges = [];

    if (title && title !== oldJob.title) {
      fields.push(`title=$${idx++}`);
      values.push(title);
      importantChanges.push('title');
    }
    if (description) {
      fields.push(`description=$${idx++}`);
      values.push(description);
    }
    if (company_name) {
      fields.push(`company_name=$${idx++}`);
      values.push(company_name);
    }
    if (location && location !== oldJob.location) {
      fields.push(`location=$${idx++}`);
      values.push(location);
      importantChanges.push('location');
    }
    if (salary_min && salary_min !== oldJob.salary_min) {
      fields.push(`salary_min=$${idx++}`);
      values.push(salary_min);
      importantChanges.push('salary');
    }
    if (salary_max && salary_max !== oldJob.salary_max) {
      fields.push(`salary_max=$${idx++}`);
      values.push(salary_max);
      importantChanges.push('salary');
    }
    if (job_type && job_type !== oldJob.job_type) {
      fields.push(`job_type=$${idx++}`);
      values.push(job_type);
      importantChanges.push('employment type');
    }
    if (experience_level) {
      fields.push(`experience_level=$${idx++}`);
      values.push(experience_level);
    }
    if (skills) {
      fields.push(`skills=$${idx++}`);
      values.push(Array.isArray(skills) ? skills : []);
    }
    if (active_flag !== undefined) {
      fields.push(`active_flag=$${idx++}`);
      values.push(active_flag);
    }

    if (fields.length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    // 3️⃣ Thêm jobId cho WHERE
    values.push(jobId);

    const result = await pool.query(
      `UPDATE jobs SET ${fields.join(", ")} WHERE id=$${idx} RETURNING *`,
      values
    );

    // BE-JA-3: Create job alert for candidates who applied or saved this job
    if (importantChanges.length > 0) {
      // Get all candidates who applied or saved this job
      const candidatesQuery = await pool.query(
        `SELECT DISTINCT user_id
         FROM (
           SELECT user_id FROM job_applications WHERE job_id = $1
           UNION
           SELECT userid as user_id FROM candidate_job_favorites WHERE jobid = $1
         ) AS candidates`,
        [jobId]
      );

      const changesText = importantChanges.join(', ');

      // Create alert for each candidate
      for (const candidate of candidatesQuery.rows) {
        await createJobAlert({
          userId: candidate.user_id,
          jobId: jobId,
          applicationId: null,
          type: "JOB_UPDATED",
          title: `Job updated: ${oldJob.title}`,
          message: `The job "${oldJob.title}" at ${oldJob.company_name || 'the company'} has been updated (${changesText} changed).`
        });
      }
    }

    res.json({
      success: true,
      message: "Job updated successfully",
      job: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.deleteJob = async (req, res) => {
  const jobId = req.params.id;

  try {
    // 1️⃣ Kiểm tra job có tồn tại
    const jobCheck = await pool.query(`SELECT * FROM jobs WHERE id=$1`, [
      jobId,
    ]);
    if (jobCheck.rows.length === 0) {
      return res.status(404).json({ message: "Job not found" });
    }

    // 2️⃣ Xóa job
    await pool.query(`DELETE FROM jobs WHERE id=$1`, [jobId]);

    res.json({
      success: true,
      message: `Job with id ${jobId} deleted successfully`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getJobApplications = async (req, res) => {
  try {
    const { jobId } = req.params;
    const employerId = req.user.id;

    // First verify the job belongs to this employer
    const jobCheck = await pool.query(
      "SELECT id, title FROM jobs WHERE id = $1 AND employer_id = $2",
      [jobId, employerId]
    );

    if (jobCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Job not found or you don't have permission to view applications"
      });
    }

    const result = await pool.query(
      `
      SELECT
        a.id,
        a.status,
        a.applied_at,
        u.id as candidate_id,
        u.full_name as candidate_name,
        u.email as candidate_email,
        u.phone as candidate_phone,
        p.headline as candidate_title,
        p.summary,
        p.summary as education,
        p.summary as skills,
        p.summary as cv_url,
        p.summary as linkedin_url,
        u.email as candidate_location,
        j.title as job_title
      FROM job_applications a
      JOIN users u ON u.id = a.user_id
      JOIN jobs j ON j.id = a.job_id
      LEFT JOIN candidate_profiles p ON p.user_id = u.id
      WHERE a.job_id = $1 AND j.employer_id = $2
      ORDER BY a.applied_at DESC
    `,
      [jobId, employerId]
    );

    res.json({
      success: true,
      message: `Found ${result.rows.length} applications for job: ${jobCheck.rows[0].title}`,
      data: {
        job: {
          id: jobCheck.rows[0].id,
          title: jobCheck.rows[0].title
        },
        applications: result.rows.map(row => ({
          id: row.id,
          status: row.status || 'PENDING',
          applied_date: row.applied_at,
          candidate_id: row.candidate_id,
          candidate_name: row.candidate_name,
          candidate_email: row.candidate_email,
          candidate_phone: row.candidate_phone,
          candidate_title: row.candidate_title,
          candidate_location: row.candidate_location,
          experience: row.experience,
          education: row.education,
          skills: row.skills ? row.skills.split(',') : [],
          cv_url: row.cv_url,
          linkedin_url: row.linkedin_url,
          job_title: row.job_title
        })),
        total: result.rows.length
      }
    });
  } catch (error) {
    console.error("Error getting job applications:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

exports.updateApplicationStatus = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { applicationId, status } = req.body;
    const employerId = req.user.id;

    console.log('Update status request:', { jobId, applicationId, status, employerId });

    // Validate status
    const validStatus = ["APPROVED", "DECLINED", "INTERVIEW", "INTERVIEWING", "PENDING"];
    if (!validStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be one of: APPROVED, DECLINED, INTERVIEW, INTERVIEWING, PENDING"
      });
    }

    if (!applicationId) {
      return res.status(400).json({
        success: false,
        message: "applicationId is required in request body"
      });
    }

    // Verify job belongs to employer and get job info
    const jobQuery = await pool.query(
      `SELECT id, title FROM jobs WHERE id = $1 AND employer_id = $2`,
      [jobId, employerId]
    );

    if (jobQuery.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Job not found or you don't have permission"
      });
    }

    const job = jobQuery.rows[0];

    // Get and verify application belongs to this job
    const appQuery = await pool.query(
      `SELECT a.*, u.full_name as candidate_name, u.email as candidate_email
       FROM job_applications a
       JOIN users u ON u.id = a.user_id
       WHERE a.id = $1 AND a.job_id = $2`,
      [applicationId, jobId]
    );

    if (appQuery.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Application not found for this job"
      });
    }

    const application = appQuery.rows[0];

    // Update status
    await pool.query(
      `UPDATE job_applications SET status = $1 WHERE id = $2`,
      [status, applicationId]
    );

    res.json({
      success: true,
      message: "Application status updated successfully",
      data: {
        applicationId: application.id,
        jobId: job.id,
        jobTitle: job.title,
        candidateName: application.candidate_name,
        candidateEmail: application.candidate_email,
        oldStatus: application.status,
        newStatus: status
      }
    });
  } catch (error) {
    console.error("Error updating application status:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

exports.saveCandidate = async (req, res) => {
  try {
    const employerId = req.user.id;
    const { candidateId, jobId } = req.body;

    console.log('Save candidate request:', { employerId, candidateId, jobId, body: req.body });

    if (!candidateId || !jobId) {
      return res.status(400).json({
        success: false,
        message: "Missing candidateId or jobId",
        received: { candidateId, jobId }
      });
    }

    await pool.query(
      `INSERT INTO saved_candidates (employer_id, candidate_id, job_id)
       VALUES ($1, $2, $3)
       ON CONFLICT DO NOTHING`,
      [employerId, candidateId, jobId]
    );

    res.status(201).json({
      success: true,
      message: "Candidate saved successfully",
    });
  } catch (error) {
    console.error('Error saving candidate:', error);
    res.status(500).json({
      success: false,
      message: "Failed to save candidate",
      error: error.message
    });
  }
};

exports.getSavedCandidates = async (req, res) => {
  const employerId = req.user.id;

  const result = await pool.query(
    `
    SELECT
      u.id AS "candidateId",
      u.full_name AS "candidateName",
      j.title AS "jobTitle",
      'SAVED' AS status
    FROM saved_candidates sc
    JOIN users u ON u.id = sc.candidate_id
    JOIN jobs j ON j.id = sc.job_id
    LEFT JOIN job_applications a
      ON a.job_id = sc.job_id AND a.user_id = sc.candidate_id
    WHERE sc.employer_id = $1
  `,
    [employerId]
  );

  res.json({
    success: true,
    data: { items: result.rows },
  });
};

exports.scheduleInterview = async (req, res) => {
  const { applicationId } = req.params;
  const { interviewDate, interviewLocation } = req.body;

  if (!interviewDate || !interviewLocation) {
    return res.status(400).json({ message: "Missing interview info" });
  }

  const result = await pool.query(
    `
    UPDATE applications
    SET status = 'INTERVIEW',
        interview_date = $1,
        interview_location = $2
    WHERE id = $3
    RETURNING *
  `,
    [interviewDate, interviewLocation, applicationId]
  );

  if (!result.rowCount) {
    return res.status(404).json({ message: "Application not found" });
  }

  res.json({
    success: true,
    message: "Interview scheduled successfully.",
  });
};
