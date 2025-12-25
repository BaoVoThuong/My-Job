const pool = require("./src/config/db");

async function addProfileColumn() {
  try {
    console.log("🔧 Adding profile_id column to job_applications table...");

    // Add profile_id column
    await pool.query(`
      ALTER TABLE job_applications
      ADD COLUMN IF NOT EXISTS profile_id INTEGER REFERENCES candidate_profiles(id) ON DELETE SET NULL
    `);

    console.log("✅ Successfully added profile_id column");

    // Update existing applications to use default profile
    await pool.query(`
      UPDATE job_applications ja
      SET profile_id = (
        SELECT id FROM candidate_profiles cp
        WHERE cp.user_id = ja.user_id
        LIMIT 1
      )
      WHERE profile_id IS NULL
    `);

    console.log("✅ Updated existing applications with default profiles");
    console.log("🎉 Migration completed successfully!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

addProfileColumn();
