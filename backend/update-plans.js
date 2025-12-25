const pool = require('./src/config/db');

async function updatePlans() {
  try {
    // Delete old employer plans
    await pool.query("DELETE FROM subscription_plans WHERE role = 'employer'");
    console.log('Deleted old employer plans');

    // Create new pay-per-use plans
    await pool.query(`
      INSERT INTO subscription_plans (role, name, duration_months, price, max_job_posts, is_featured_job)
      VALUES
        ('employer', '1 Job Post', 0, 100000, 1, false),
        ('employer', '5 Job Posts', 0, 450000, 5, false),
        ('employer', '10 Job Posts', 0, 900000, 10, false),
        ('employer', '20 Job Posts', 0, 1700000, 20, true),
        ('employer', '50 Job Posts', 0, 4000000, 50, true)
    `);
    console.log('Created new pay-per-use plans');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

updatePlans();
