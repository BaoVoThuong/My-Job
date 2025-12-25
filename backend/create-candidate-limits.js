const { Pool } = require('pg');
require('dotenv').config({ path: '../.env' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function createCandidateLimits() {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    console.log('📊 Creating candidate_daily_limits table...');

    // Create table to track daily apply limits
    await client.query(`
      CREATE TABLE IF NOT EXISTS candidate_daily_limits (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        apply_date DATE NOT NULL DEFAULT CURRENT_DATE,
        apply_count INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, apply_date)
      )
    `);

    console.log('✅ candidate_daily_limits table created');

    console.log('📊 Creating candidate subscription plans...');

    // Check if candidate plans already exist
    const existingPlans = await client.query(`
      SELECT COUNT(*) as count FROM subscription_plans WHERE role = 'candidate'
    `);

    if (existingPlans.rows[0].count > 0) {
      console.log('⚠️  Candidate plans already exist, skipping...');
    } else {
      // Create candidate subscription plans
      await client.query(`
        INSERT INTO subscription_plans (role, name, duration_months, price, is_featured_job, max_job_posts)
        VALUES
          ('candidate', 'Free Plan', 0, 0, false, 0),
          ('candidate', '1 Month Premium', 1, 50000, false, 0),
          ('candidate', '3 Months Premium', 3, 135000, false, 0),
          ('candidate', '6 Months Premium', 6, 240000, true, 0),
          ('candidate', '1 Year Premium', 12, 500000, true, 0)
      `);
      console.log('✅ Candidate subscription plans created');
    }

    await client.query('COMMIT');
    console.log('🎉 Migration completed successfully!');

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

createCandidateLimits();
