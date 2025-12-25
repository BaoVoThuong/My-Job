require("dotenv").config({ path: "../.env" });
const pool = require("./src/config/db");

async function recreateDatabase() {
  try {
    console.log("🗑️ Dropping all tables and recreating database...");

    // Lấy danh sách tất cả bảng
    const tablesResult = await pool.query(`
      SELECT tablename FROM pg_tables
      WHERE schemaname = 'public'
      AND tablename NOT LIKE 'pg_%'
      AND tablename NOT LIKE 'sql_%'
    `);

    // Drop tất cả bảng với CASCADE
    for (const table of tablesResult.rows) {
      const tableName = table.tablename;
      try {
        await pool.query(`DROP TABLE IF EXISTS ${tableName} CASCADE`);
        console.log(`✅ Dropped table: ${tableName}`);
      } catch (error) {
        console.log(`⚠️ Couldn't drop ${tableName}: ${error.message}`);
      }
    }

    console.log("\n📦 Creating tables...\n");

    // 1. Tạo bảng users
    await pool.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        full_name VARCHAR(255),
        age INTEGER,
        location VARCHAR(255),
        role VARCHAR(20) DEFAULT 'candidate' CHECK (role IN ('candidate', 'employer', 'admin')),
        email VARCHAR(255) UNIQUE,
        phone VARCHAR(20),
        birth DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("✅ Created users table");

    // 2. Tạo bảng candidate_profiles
    await pool.query(`
      CREATE TABLE candidate_profiles (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        headline VARCHAR(255),
        summary TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("✅ Created candidate_profiles table");

    // 3. Tạo bảng candidate_skills
    await pool.query(`
      CREATE TABLE candidate_skills (
        id SERIAL PRIMARY KEY,
        userid INTEGER REFERENCES users(id) ON DELETE CASCADE,
        skill VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("✅ Created candidate_skills table");

    // 4. Tạo bảng candidate_workexperience
    await pool.query(`
      CREATE TABLE candidate_workexperience (
        id SERIAL PRIMARY KEY,
        userid INTEGER REFERENCES users(id) ON DELETE CASCADE,
        company VARCHAR(255),
        position VARCHAR(255),
        description TEXT,
        "startDate" DATE,
        "endDate" DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("✅ Created candidate_workexperience table");

    // 5. Tạo bảng candidate_education
    await pool.query(`
      CREATE TABLE candidate_education (
        id SERIAL PRIMARY KEY,
        userid INTEGER REFERENCES users(id) ON DELETE CASCADE,
        school VARCHAR(255),
        degree VARCHAR(255),
        gpa VARCHAR(10),
        "startDate" DATE,
        "endDate" DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("✅ Created candidate_education table");

    // 6. Tạo bảng candidate_cv
    await pool.query(`
      CREATE TABLE candidate_cv (
        id SERIAL PRIMARY KEY,
        userid INTEGER REFERENCES users(id) ON DELETE CASCADE,
        cv VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("✅ Created candidate_cv table");

    // 7. Tạo bảng companies
    await pool.query(`
      CREATE TABLE companies (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        website VARCHAR(255),
        logo_url VARCHAR(500),
        location VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("✅ Created companies table");

    // 8. Tạo bảng jobs
    await pool.query(`
      CREATE TABLE jobs (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE,
        employer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        location VARCHAR(255),
        salary_min INTEGER,
        salary_max INTEGER,
        job_type VARCHAR(50) DEFAULT 'full-time',
        skills TEXT[],
        active_flag BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("✅ Created jobs table");

    // 9. Tạo bảng job_applications
    await pool.query(`
      CREATE TABLE job_applications (
        id SERIAL PRIMARY KEY,
        job_id INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(20) DEFAULT 'pending',
        UNIQUE(job_id, user_id)
      )
    `);
    console.log("✅ Created job_applications table");

    // 10. Tạo bảng candidate_job_favorites
    await pool.query(`
      CREATE TABLE candidate_job_favorites (
        id SERIAL PRIMARY KEY,
        userid INTEGER REFERENCES users(id) ON DELETE CASCADE,
        jobid INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(userid, jobid)
      )
    `);
    console.log("✅ Created candidate_job_favorites table");

    // 11. Tạo bảng subscription_plans
    await pool.query(`
      CREATE TABLE subscription_plans (
        id SERIAL PRIMARY KEY,
        role VARCHAR(20) NOT NULL CHECK (role IN ('candidate', 'employer')),
        name VARCHAR(100) NOT NULL,
        duration_months INT NOT NULL CHECK (duration_months >= 0),
        price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
        max_applications INT CHECK (max_applications IS NULL OR max_applications > 0),
        max_profiles INT DEFAULT 1,
        is_featured_job BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("✅ Created subscription_plans table");

    // 12. Tạo bảng user_subscriptions
    await pool.query(`
      CREATE TABLE user_subscriptions (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL REFERENCES users(id),
        plan_id INT NOT NULL REFERENCES subscription_plans(id),
        start_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        end_date TIMESTAMP,
        is_active BOOLEAN DEFAULT TRUE
      )
    `);
    console.log("✅ Created user_subscriptions table");

    // 13. Tạo bảng orders
    await pool.query(`
      CREATE TABLE orders (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL REFERENCES users(id),
        plan_id INT NOT NULL REFERENCES subscription_plans(id),
        amount DECIMAL(10,2) NOT NULL,
        payment_method VARCHAR(20) NOT NULL,
        status VARCHAR(20) NOT NULL CHECK (status IN ('PENDING', 'PAID', 'FAILED')),
        momo_order_id VARCHAR(100),
        momo_trans_id VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("✅ Created orders table");

    console.log("\n📝 Inserting subscription plans data...\n");

    // Insert subscription plans for candidates
    await pool.query(`
      INSERT INTO subscription_plans
      (role, name, duration_months, price, max_applications, max_profiles, is_featured_job)
      VALUES
      ('candidate', 'Free', 0, 0, 10, 1, FALSE),
      ('candidate', 'VIP Monthly', 1, 99000, 20, 3, FALSE),
      ('candidate', 'VIP 6 Months', 6, 499000, 50, 5, FALSE),
      ('candidate', 'VIP Yearly', 12, 899000, 100, 10, FALSE)
    `);
    console.log("✅ Inserted candidate subscription plans");

    // Insert subscription plans for employers
    await pool.query(`
      INSERT INTO subscription_plans
      (role, name, duration_months, price, max_applications, is_featured_job)
      VALUES
      ('employer', 'Free', 0, 0, NULL, FALSE),
      ('employer', 'VIP Monthly', 1, 499000, NULL, TRUE),
      ('employer', 'VIP 6 Months', 6, 2499000, NULL, TRUE),
      ('employer', 'VIP Yearly', 12, 4499000, NULL, TRUE)
    `);
    console.log("✅ Inserted employer subscription plans");

    console.log("\n🎉 Database recreation completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Database recreation failed:", error);
    process.exit(1);
  }
}

recreateDatabase();
