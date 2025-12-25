require('dotenv').config({ path: '../.env' });
const pool = require('./src/config/db');

async function seedDatabase() {
  try {
    // Check if companies exist
    const existingCompanies = await pool.query(`SELECT * FROM companies LIMIT 1`);
    if (existingCompanies.rows.length > 0) {
      console.log('✅ Companies already exist');
    } else {
      // Insert companies
      console.log('Inserting companies...');
      const company1 = await pool.query(`
        INSERT INTO companies (name, description, website, logo_url, location) 
        VALUES ('Google Inc.', 'Tech company', 'https://google.com', 'https://play-lh.googleusercontent.com/KCMTYuiTrKom4Vyf0G4foetVOwhKWzNbHWumV73IXexAIy5TTgZipL52WTt8ICL-oIo', 'Idaho') 
        RETURNING id
      `);
      
      const company2 = await pool.query(`
        INSERT INTO companies (name, description, website, logo_url, location) 
        VALUES ('YouTube', 'Video platform', 'https://youtube.com', 'https://static.vecteezy.com/system/resources/previews/018/930/480/non_2x/linkedin-logo-linkedin-icon-transparent-free-png.png', 'Minnesota') 
        RETURNING id
      `);
    }

    // Check if employer exists
    let employer = await pool.query(`SELECT * FROM users WHERE username = 'employer1'`);
    if (employer.rows.length > 0) {
      console.log('✅ Employer already exists');
    } else {
      // Insert employer user
      console.log('Inserting employer user...');
      employer = await pool.query(`
        INSERT INTO users (username, password_hash, full_name, role, email) 
        VALUES ('employer1', '$2b$10$hashedpassword', 'Employer One', 'employer', 'employer1@example.com') 
        RETURNING id
      `);
    }

    // Get company IDs
    const companies = await pool.query(`SELECT id FROM companies ORDER BY id LIMIT 2`);
    const employerId = employer.rows[0].id;
    const companyIds = companies.rows;

    // Insert jobs
    console.log('Inserting jobs...');
    await pool.query(`
      INSERT INTO jobs (title, description, company_id, employer_id, location, salary_min, salary_max, job_type, skills) 
      VALUES 
      ('Technical Support Specialist', 'Support for tech products', $1, $3, 'Idaho', 15000, 20000, 'Full Time', ARRAY['Support','Tech']),
      ('UI/UX Designer', 'Design UI/UX for products', $2, $3, 'Minnesota', 10000, 15000, 'Full Time', ARRAY['UI','UX','Design']),
      ('Senior UX Designer', 'Lead UX design', $2, $3, 'United Kingdom', 30000, 35000, 'Full Time', ARRAY['UX','Design'])
    `, [companyIds[0].id, companyIds[1].id, employerId]);

    console.log('✅ Database seeded successfully!');
    console.log(`Companies: ${companyIds.map(c => c.id).join(', ')}`);
    console.log(`Employer: ${employerId}`);
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    pool.end();
  }
}

seedDatabase();