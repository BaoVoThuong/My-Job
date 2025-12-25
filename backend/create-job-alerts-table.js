const pool = require("./src/config/db");

async function createJobAlertsTable() {
  try {
    console.log("🔧 Creating job_alert_notifications table...");

    await pool.query(`
      CREATE TABLE IF NOT EXISTS job_alert_notifications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        job_id INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
        application_id INTEGER REFERENCES job_applications(id) ON DELETE SET NULL,
        type VARCHAR(50) NOT NULL CHECK (type IN ('APPLICATION_APPROVED', 'APPLICATION_DECLINED', 'APPLICATION_INTERVIEWING', 'JOB_UPDATED', 'JOB_DEADLINE_SOON')),
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        read_at TIMESTAMP DEFAULT NULL
      )
    `);

    console.log("✅ Successfully created job_alert_notifications table");

    // Create index for better query performance
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_job_alerts_user_id ON job_alert_notifications(user_id);
      CREATE INDEX IF NOT EXISTS idx_job_alerts_read_at ON job_alert_notifications(read_at);
      CREATE INDEX IF NOT EXISTS idx_job_alerts_created_at ON job_alert_notifications(created_at DESC);
    `);

    console.log("✅ Created indexes for job_alert_notifications");
    console.log("🎉 Job alerts table setup completed!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Failed to create job alerts table:", error);
    process.exit(1);
  }
}

createJobAlertsTable();
