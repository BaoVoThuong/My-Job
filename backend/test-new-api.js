const axios = require('axios');
const { Pool } = require('pg');
require('dotenv').config({ path: '../.env' });

async function testNewAPI() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    // Get a valid token first (simulate login)
    console.log('🔍 Testing the new API endpoint: /api/employer/applications/7');
    
    // First, let's check if the employer exists and can access job 7
    const jobCheck = await pool.query(
      'SELECT id, title, employer_id FROM jobs WHERE id = 7'
    );
    
    if (jobCheck.rows.length > 0) {
      console.log('✅ Job found:', jobCheck.rows[0]);
      
      // Check applications for this job
      const appCheck = await pool.query(
        'SELECT COUNT(*) FROM job_applications WHERE job_id = 7'
      );
      console.log(`📊 Applications count: ${appCheck.rows[0].count}`);
      
      // Test the API endpoint structure (without authentication for now)
      console.log('\n🚀 API Endpoint Structure:');
      console.log('URL: http://localhost:5000/api/employer/applications/7');
      console.log('Method: GET');
      console.log('Headers: Authorization: Bearer <token>');
      console.log('\n📋 Expected Response Format:');
      console.log({
        success: true,
        message: "Found X applications for job: Job Title",
        data: {
          job: { id: 7, title: "Job Title" },
          applications: [
            {
              id: "application_id",
              status: "PENDING",
              applied_date: "2025-12-25T...",
              candidate_id: "user_id",
              candidate_name: "Full Name",
              candidate_email: "email@example.com",
              // ... other fields
            }
          ],
          total: "X"
        }
      });
      
    } else {
      console.log('❌ Job 7 not found');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    pool.end();
  }
}

testNewAPI();