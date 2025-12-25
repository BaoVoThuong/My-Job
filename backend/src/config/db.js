const { Pool } = require("pg");
const path = require("path");

const envPath = path.resolve(__dirname, '../../../.env');
require("dotenv").config({ path: envPath });

// Parse DATABASE_URL manually
const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  console.error('❌ DATABASE_URL not found in environment variables');
  process.exit(1);
}

const url = new URL(dbUrl);

const pool = new Pool({
  host: url.hostname,
  port: url.port,
  database: url.pathname.slice(1), // remove leading /
  user: url.username,
  password: url.password,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Kết nối Database thất bại:', err);
  } else {
    console.log('Kết nối Database thành công! Thời gian hiện tại:', res.rows[0].now);
  }
});

module.exports = pool;
