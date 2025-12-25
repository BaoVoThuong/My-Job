const pool = require("./src/config/db");

async function testQuery() {
  try {
    const jobId = 6;
    const userId = 2; // Changed to user 2 who actually applied

    const query = `
      SELECT
        j.*,
        CASE WHEN ja.id IS NOT NULL THEN true ELSE false END as is_applied,
        CASE WHEN sj.id IS NOT NULL THEN true ELSE false END as is_saved
      FROM jobs j
      LEFT JOIN job_applications ja ON ja.job_id = j.id AND ja.user_id = $2
      LEFT JOIN saved_jobs sj ON sj.job_id = j.id AND sj.user_id = $2
      WHERE j.id = $1
    `;

    const result = await pool.query(query, [jobId, userId]);
    console.log("Query result for user 2:");
    console.log(JSON.stringify(result.rows[0], null, 2));

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

testQuery();
