const pool = require("../config/db");

exports.getPlans = async (req, res) => {
  const { role } = req.query;

  const result = await db.query(
    `SELECT * FROM subscription_plans WHERE role = $1 ORDER BY duration_months`,
    [role]
  );

  res.json(result.rows);
};
