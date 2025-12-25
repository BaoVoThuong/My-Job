const pool = require('./src/config/db');

async function addMissingColumns() {
  try {
    console.log('Adding missing columns to jobs table...');

    // Add experience_level column
    await pool.query(`
      ALTER TABLE jobs 
      ADD COLUMN IF NOT EXISTS experience_level VARCHAR(50)
    `);
    console.log('✅ Added experience_level column');

    // Add education_level column  
    await pool.query(`
      ALTER TABLE jobs 
      ADD COLUMN IF NOT EXISTS education_level VARCHAR(50)
    `);
    console.log('✅ Added education_level column');

    // Update existing jobs with default values
    await pool.query(`
      UPDATE jobs 
      SET experience_level = 'Freshers', education_level = 'Bachelor Degree'
      WHERE experience_level IS NULL OR education_level IS NULL
    `);
    console.log('✅ Updated existing jobs with default values');

    console.log('Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

addMissingColumns();