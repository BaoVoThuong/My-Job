const pool = require("../config/db");

exports.getMe = async (req, res) => {
  const userId = req.user.id;

  const user = await pool.query(
    `
    SELECT id, username, full_name, age, location, role, email, phone
    FROM users
    WHERE id = $1
    `,
    [userId]
  );

  if (user.rows[0].role === "candidate") {
    const profile = await pool.query(
      `
      SELECT headline, summary
      FROM candidate_profiles
      WHERE user_id = $1
      `,
      [userId]
    );

    const skills = await pool.query(
      `
      SELECT skill
      FROM candidate_skills
      WHERE userid = $1
      `,
      [userId]
    );

    const workexperience = await pool.query(
      `
      SELECT company,position,description,"startDate","endDate"
      FROM candidate_workexperience
      WHERE userid = $1
      `,
      [userId]
    );

    const education = await pool.query(
      `
      SELECT school,degree,"startDate","endDate"
      FROM candidate_education
      WHERE userid = $1
      `,
      [userId]
    );

    const cv = await pool.query(
      `
      SELECT cv
      FROM candidate_cv
      WHERE userid = $1
      `,
      [userId]
    );


    return res.json({
      success: true,
      data: {
        ...user.rows[0],
        profile: profile.rows[0],
        skills: skills.rows,
        workExperience: workexperience.rows,
        education: education.rows,
        pdfUrl: cv.rows
      }
    });
  }

  res.json(user.rows[0]);
};

exports.getAppliedJobs = async (req, res) => {
  const userId = req.user.id;

  const result = await pool.query(
    `
    SELECT j.*
    FROM job_applications ja
    JOIN jobs j ON j.id = ja.job_id
    WHERE ja.user_id = $1
    ORDER BY ja.applied_at DESC
    `,
    [userId]
  );

  res.json({
    count: result.rowCount,
    data: result.rows,
  });
};

exports.updateMe = async (req, res) => {
  const userId = req.user.id;
  const {
    username,
    full_name,
    age,
    location,
    email,
    phone,
    profile,        // { headline, summary }
    skills,         // array of skill strings
    workExperience, // array of { company, position, description, startDate, endDate }
    education,      // array of { school, degree, startDate, endDate }
    cv              // string: cv URL
  } = req.body;

  try {
    // 1️⃣ Update user only if fields exist
    const userFields = [];
    const userValues = [];
    let idx = 1;

    if (username) { userFields.push(`username=$${idx++}`); userValues.push(username); }
    if (full_name) { userFields.push(`full_name=$${idx++}`); userValues.push(full_name); }
    if (age) { userFields.push(`age=$${idx++}`); userValues.push(age); }
    if (location) { userFields.push(`location=$${idx++}`); userValues.push(location); }
    if (email) { userFields.push(`email=$${idx++}`); userValues.push(email); }
    if (phone) { userFields.push(`phone=$${idx++}`); userValues.push(phone); }

    if (userFields.length > 0) {
      userValues.push(userId); // WHERE id=$idx
      await pool.query(
        `UPDATE users SET ${userFields.join(', ')} WHERE id=$${idx}`,
        userValues
      );
    }

    // 2️⃣ Update candidate profile
    if (profile) {
      const profileFields = [];
      const profileValues = [];
      idx = 1;

      if (profile.headline) { profileFields.push(`headline=$${idx++}`); profileValues.push(profile.headline); }
      if (profile.summary) { profileFields.push(`summary=$${idx++}`); profileValues.push(profile.summary); }

      if (profileFields.length > 0) {
        profileValues.push(userId);
        await pool.query(
          `UPDATE candidate_profiles SET ${profileFields.join(', ')} WHERE user_id=$${idx}`,
          profileValues
        );
      }
    }

    // 3️⃣ Update skills if provided
    if (skills && skills.length > 0) {
      await pool.query(`DELETE FROM candidate_skills WHERE userid=$1`, [userId]);
      const skillPromises = skills.map(skill =>
        pool.query(`INSERT INTO candidate_skills (userid, skill) VALUES ($1,$2)`, [userId, skill])
      );
      await Promise.all(skillPromises);
    }

    // 4️⃣ Update work experience if provided
    if (workExperience && workExperience.length > 0) {
      await pool.query(`DELETE FROM candidate_workexperience WHERE userid=$1`, [userId]);
      const workPromises = workExperience.map(item =>
        pool.query(
          `INSERT INTO candidate_workexperience (userid, company, position, description, "startDate", "endDate")
           VALUES ($1,$2,$3,$4,$5,$6)`,
          [userId, item.company, item.position, item.description, item.startDate, item.endDate]
        )
      );
      await Promise.all(workPromises);
    }

    // 5️⃣ Update education if provided
    if (education && education.length > 0) {
      await pool.query(`DELETE FROM candidate_education WHERE userid=$1`, [userId]);
      const eduPromises = education.map(item =>
        pool.query(
          `INSERT INTO candidate_education (userid, school, degree, "startDate", "endDate")
           VALUES ($1,$2,$3,$4,$5)`,
          [userId, item.school, item.degree, item.startDate, item.endDate]
        )
      );
      await Promise.all(eduPromises);
    }

    // 6️⃣ Update CV if provided
    if (cv) {
      await pool.query(
        `UPDATE candidate_cv SET cv=$1 WHERE userid=$2`,
        [cv, userId]
      );
    }

    // 7️⃣ Return updated user
    const updatedUser = await pool.query(
      `SELECT id, username, full_name, age, location, role, email, phone FROM users WHERE id=$1`,
      [userId]
    );

    res.json({ success: true, message: "Update successful", user: updatedUser.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};



