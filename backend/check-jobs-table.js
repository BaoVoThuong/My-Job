require('dotenv').config({ path: '../.env' });
const pool = require('./src/config/db');

async function checkJobsTable() {
  try {
    // Check jobs table structure
    const result = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'jobs' 
      ORDER BY ordinal_position
    `);
    
    console.log('Jobs table columns:');
    result.rows.forEach(row => {
      console.log(`- ${row.column_name}: ${row.data_type} ${row.is_nullable === 'NO' ? 'NOT NULL' : ''}`);
    });
    
    // Check some sample data
    const sampleData = await pool.query('SELECT * FROM jobs LIMIT 3');
    console.log('\nSample data:', sampleData.rows.length, 'rows found');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    pool.end();
  }
}

checkJobsTable();