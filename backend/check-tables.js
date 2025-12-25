require('dotenv').config({ path: '../.env' });
const pool = require('./src/config/db');

pool.query('SELECT tablename FROM pg_tables WHERE schemaname = $1', ['public'], (err, res) => {
  if (err) {
    console.error('Error:', err);
  } else {
    console.log('Existing tables:', res.rows.map(r => r.tablename).join(', ') || 'NONE');
  }
  pool.end();
});
