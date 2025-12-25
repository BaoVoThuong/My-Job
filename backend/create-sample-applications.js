const { Pool } = require('pg');
require('dotenv').config({ path: '../.env' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function createSampleApplications() {
  try {
    console.log('Creating sample applications for Job ID 7...');

    // Create some sample job applications using existing candidate users
    const applications = [
      {
        user_id: 1, // candidate: Tonnn (tn123@gmail.com)
        job_id: 7,
        status: 'PENDING',
        profile_id: null
      },
      {
        user_id: 2, // candidate: Lê Minh Tuấn (ton123@gmail.com)
        job_id: 7,
        status: 'APPROVED', 
        profile_id: null
      }
    ];

    for (const app of applications) {
      await pool.query(
        `INSERT INTO job_applications (user_id, job_id, status, profile_id) 
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (user_id, job_id) DO NOTHING`,
        [app.user_id, app.job_id, app.status, app.profile_id]
      );
      console.log(`✅ Created application: User ${app.user_id} -> Job ${app.job_id} (${app.status})`);
    }

    // Check final count
    const result = await pool.query(
      'SELECT COUNT(*) FROM job_applications WHERE job_id = 7'
    );
    console.log(`\n📊 Total applications for Job 7: ${result.rows[0].count}`);
    
    pool.end();
  } catch (error) {
    console.error('Error:', error);
    pool.end();
  }
}

createSampleApplications();