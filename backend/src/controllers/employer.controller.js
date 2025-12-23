const pool = require("../config/db");

exports.getJobsByUser = async (req, res) => {
  const userid = req.user.userId;
  const page = parseInt(req.query.page) || 1; // trang hiện tại
  const limit = parseInt(req.query.limit) || 10; // số bản ghi mỗi trang
  const offset = (page - 1) * limit;

  try {
    // Lấy tổng số job của user
    const countResult = await pool.query(
      `SELECT COUNT(*) FROM jobs WHERE userid = $1`,
      [userid]
    );
    const totalJobs = parseInt(countResult.rows[0].count);

    // Lấy dữ liệu theo limit và offset
    const result = await pool.query(
      `
      SELECT id, title, description, company_name, location, salary_min, salary_max, job_type, experience_level, skills, active_flag, userid
      FROM jobs
      WHERE userid = $1
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
    company_name,
    location,
    salary_min,
    salary_max,
    job_type,
    experience_level,
    skills,
    active_flag,
  } = req.body;

  const userid = req.user.userId;

  try {
    const result = await pool.query(
      `
      INSERT INTO jobs
      (title, description, company_name, location, salary_min, salary_max, job_type, experience_level, skills, active_flag,userid)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
      RETURNING *
      `,
      [
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
        userid,
      ]
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
  const userid = req.user.userId; // từ authMiddleware
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
    const jobCheck = await pool.query(`SELECT * FROM jobs WHERE id=$1`, [
      jobId,
    ]);
    if (jobCheck.rows.length === 0) {
      return res.status(404).json({ message: "Job not found" });
    }

    // 2️⃣ Chỉ update những trường được gửi
    const fields = [];
    const values = [];
    let idx = 1;

    if (title) {
      fields.push(`title=$${idx++}`);
      values.push(title);
    }
    if (description) {
      fields.push(`description=$${idx++}`);
      values.push(description);
    }
    if (company_name) {
      fields.push(`company_name=$${idx++}`);
      values.push(company_name);
    }
    if (location) {
      fields.push(`location=$${idx++}`);
      values.push(location);
    }
    if (salary_min) {
      fields.push(`salary_min=$${idx++}`);
      values.push(salary_min);
    }
    if (salary_max) {
      fields.push(`salary_max=$${idx++}`);
      values.push(salary_max);
    }
    if (job_type) {
      fields.push(`job_type=$${idx++}`);
      values.push(job_type);
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
  const { jobId } = req.params;
  const employerId = req.user.id;

  const result = await pool.query(
    `
    SELECT 
      a.id AS "applicationId",
      u.id AS "candidateId",
      a.status,
      a.applied_at AS "appliedAt"
    FROM job_applications a
    JOIN users u ON u.id = a.user_id
    JOIN jobs j ON j.id = a.job_id
    WHERE a.job_id = $1 AND j.userid = $2
    ORDER BY a.applied_at DESC
  `,
    [jobId, employerId]
  );

  res.json({
    success: true,
    data: { items: result.rows },
  });
};

exports.updateApplicationStatus = async (req, res) => {
  const { applicationId } = req.params;
  const { status, interviewDate } = req.body;

  const validStatus = ["APPROVED", "DECLINED", "INTERVIEW"];
  if (!validStatus.includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  const result = await pool.query(
    `
    UPDATE applications
    SET status = $1,
        interview_date = $2
    WHERE id = $3
    RETURNING *
  `,
    [status, status === "INTERVIEW" ? interviewDate : null, applicationId]
  );

  if (!result.rowCount) {
    return res.status(404).json({ message: "Application not found" });
  }

  res.json({ success: true, message: "Application status updated." });
};

exports.saveCandidate = async (req, res) => {
  const employerId = req.user.id;
  const { candidateId, jobId } = req.body;

  if (!candidateId || !jobId) {
    return res.status(400).json({ message: "Missing data" });
  }

  await pool.query(
    `
    INSERT INTO saved_candidates (employer_id, candidate_id, job_id)
    VALUES ($1, $2, $3)
    ON CONFLICT DO NOTHING
    `,
    [employerId, candidateId, jobId]
  );

  res.status(201).json({
    success: true,
    message: "Candidate saved successfully",
  });
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
