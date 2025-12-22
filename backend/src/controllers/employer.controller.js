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
      jobs: result.rows
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
    active_flag
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
      [title, description, company_name, location, salary_min, salary_max, job_type, experience_level, skills, active_flag, userid]
    );

    res.status(201).json({ 
      success: true,
      message: "Job created successfully", 
      data:{
        job: result.rows[0]
      } 
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
    active_flag
  } = req.body;

  try {
    // 1️⃣ Lấy job hiện tại
    const jobCheck = await pool.query(`SELECT * FROM jobs WHERE id=$1`, [jobId]);
    if (jobCheck.rows.length === 0) {
      return res.status(404).json({ message: "Job not found" });
    }

    // 2️⃣ Chỉ update những trường được gửi
    const fields = [];
    const values = [];
    let idx = 1;

    if (title) { fields.push(`title=$${idx++}`); values.push(title); }
    if (description) { fields.push(`description=$${idx++}`); values.push(description); }
    if (company_name) { fields.push(`company_name=$${idx++}`); values.push(company_name); }
    if (location) { fields.push(`location=$${idx++}`); values.push(location); }
    if (salary_min) { fields.push(`salary_min=$${idx++}`); values.push(salary_min); }
    if (salary_max) { fields.push(`salary_max=$${idx++}`); values.push(salary_max); }
    if (job_type) { fields.push(`job_type=$${idx++}`); values.push(job_type); }
    if (experience_level) { fields.push(`experience_level=$${idx++}`); values.push(experience_level); }
    if (skills) { fields.push(`skills=$${idx++}`); values.push(Array.isArray(skills) ? skills : []); }
    if (active_flag !== undefined) { fields.push(`active_flag=$${idx++}`); values.push(active_flag); }

    if (fields.length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    // 3️⃣ Thêm jobId cho WHERE
    values.push(jobId);

    const result = await pool.query(
      `UPDATE jobs SET ${fields.join(', ')} WHERE id=$${idx} RETURNING *`,
      values
    );

    res.json({ 
      success: true,
      message: "Job updated successfully", 
      job: result.rows[0] 
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
    const jobCheck = await pool.query(`SELECT * FROM jobs WHERE id=$1`, [jobId]);
    if (jobCheck.rows.length === 0) {
      return res.status(404).json({ message: "Job not found" });
    }

    // 2️⃣ Xóa job
    await pool.query(`DELETE FROM jobs WHERE id=$1`, [jobId]);

    res.json({ 
      success: true,
      message: `Job with id ${jobId} deleted successfully` 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
