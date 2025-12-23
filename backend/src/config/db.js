const { Pool } = require("pg");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, '../../.env') }); // adjust path to your .env

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    require: true,
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
