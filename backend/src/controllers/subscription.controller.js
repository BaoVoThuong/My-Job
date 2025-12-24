<<<<<<< HEAD
const pool = require("../config/db");

exports.getPlans = async (req, res) => {
  const { role } = req.query;

  const result = await db.query(
    `SELECT * FROM subscription_plans WHERE role = $1 ORDER BY duration_months`,
    [role]
  );

  res.json(result.rows);
};
=======
const pool = require("../config/db");

exports.getPlans = async (req, res) => {
  const { role } = req.query;

  const result = await db.query(
    `SELECT * FROM subscription_plans WHERE role = $1 ORDER BY duration_months`,
    [role]
  );

  res.json(result.rows);
};
>>>>>>> d8f4b6dd27e42e2420908d9b3678d12ab3e9cb81
