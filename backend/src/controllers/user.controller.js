const pool = require("../config/db");

exports.getMe = async (req, res) => {
  try {
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
        SELECT company, position, description, "startDate", "endDate"
        FROM candidate_workexperience
        WHERE userid = $1
        `,
        [userId]
      );

      const education = await pool.query(
        `
        SELECT school, degree, gpa, "startDate", "endDate"
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
          fullName: user.rows[0].full_name,
          email: user.rows[0].email,
          phone: user.rows[0].phone,
          headline: profile.rows[0]?.headline || "",
          summary: profile.rows[0]?.summary || "",
          skills: skills.rows.map(s => s.skill),
          workExperience: workexperience.rows.map(w => ({
            company: w.company,
            position: w.position,
            startDate: w.startDate,
            endDate: w.endDate,
            description: w.description
          })),
          education: education.rows.map(e => ({
            school: e.school,
            degree: e.degree,
            GPA: e.gpa,
            startDate: e.startDate,
            endDate: e.endDate
          })),
          cv: cv.rows[0]?.cv || null
        }
      });
    }

    res.json({
      success: true,
      data: user.rows[0]
    });
  } catch (error) {
    console.error("Error in getMe:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
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
    fullName,       // camelCase instead of full_name
    age,
    location,
    email,
    phone,
    headline,       // Direct fields instead of nested profile object
    summary,
    skills,         // array of skill strings
    workExperience, // array of { company, position, description, startDate, endDate }
    education,      // array of { school, degree, GPA, startDate, endDate }
    cv              // string: cv URL
  } = req.body;

  try {
    // 1️⃣ Update user only if fields exist
    const userFields = [];
    const userValues = [];
    let idx = 1;

    if (username) { userFields.push(`username=$${idx++}`); userValues.push(username); }
    if (fullName) { userFields.push(`full_name=$${idx++}`); userValues.push(fullName); }
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

    // 2️⃣ Update candidate profile (headline and summary)
    if (headline !== undefined || summary !== undefined) {
      const profileFields = [];
      const profileValues = [];
      idx = 1;

      if (headline !== undefined) { profileFields.push(`headline=$${idx++}`); profileValues.push(headline); }
      if (summary !== undefined) { profileFields.push(`summary=$${idx++}`); profileValues.push(summary); }

      if (profileFields.length > 0) {
        profileValues.push(userId);
        await pool.query(
          `UPDATE candidate_profiles SET ${profileFields.join(', ')} WHERE user_id=$${idx}`,
          profileValues
        );
      }
    }

    // 3️⃣ Update skills if provided
    if (skills && Array.isArray(skills) && skills.length > 0) {
      await pool.query(`DELETE FROM candidate_skills WHERE userid=$1`, [userId]);
      const skillPromises = skills.map(skill =>
        pool.query(`INSERT INTO candidate_skills (userid, skill) VALUES ($1,$2)`, [userId, skill])
      );
      await Promise.all(skillPromises);
    }

    // 4️⃣ Update work experience if provided
    if (workExperience && Array.isArray(workExperience) && workExperience.length > 0) {
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

    // 5️⃣ Update education if provided (now includes GPA)
    if (education && Array.isArray(education) && education.length > 0) {
      await pool.query(`DELETE FROM candidate_education WHERE userid=$1`, [userId]);
      const eduPromises = education.map(item =>
        pool.query(
          `INSERT INTO candidate_education (userid, school, degree, gpa, "startDate", "endDate")
           VALUES ($1,$2,$3,$4,$5,$6)`,
          [userId, item.school, item.degree, item.GPA || null, item.startDate, item.endDate]
        )
      );
      await Promise.all(eduPromises);
    }

    // 6️⃣ Update CV if provided
    if (cv !== undefined) {
      await pool.query(
        `UPDATE candidate_cv SET cv=$1 WHERE userid=$2`,
        [cv, userId]
      );
    }

    // 7️⃣ Return updated user in new format (matching getMe format)
    const user = await pool.query(
      `SELECT id, username, full_name, age, location, role, email, phone FROM users WHERE id=$1`,
      [userId]
    );

    const profile = await pool.query(
      `SELECT headline, summary FROM candidate_profiles WHERE user_id=$1`,
      [userId]
    );

    const skillsData = await pool.query(
      `SELECT skill FROM candidate_skills WHERE userid=$1`,
      [userId]
    );

    const workData = await pool.query(
      `SELECT company, position, description, "startDate", "endDate" FROM candidate_workexperience WHERE userid=$1`,
      [userId]
    );

    const eduData = await pool.query(
      `SELECT school, degree, gpa, "startDate", "endDate" FROM candidate_education WHERE userid=$1`,
      [userId]
    );

    const cvData = await pool.query(
      `SELECT cv FROM candidate_cv WHERE userid=$1`,
      [userId]
    );

    res.json({
      success: true,
      message: "Update successful",
      data: {
        fullName: user.rows[0].full_name,
        email: user.rows[0].email,
        phone: user.rows[0].phone,
        headline: profile.rows[0]?.headline || "",
        summary: profile.rows[0]?.summary || "",
        skills: skillsData.rows.map(s => s.skill),
        workExperience: workData.rows.map(w => ({
          company: w.company,
          position: w.position,
          startDate: w.startDate,
          endDate: w.endDate,
          description: w.description
        })),
        education: eduData.rows.map(e => ({
          school: e.school,
          degree: e.degree,
          GPA: e.gpa,
          startDate: e.startDate,
          endDate: e.endDate
        })),
        cv: cvData.rows[0]?.cv || null
      }
    });
  } catch (err) {
    console.error("Error in updateMe:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};



