const pool = require("../config/db");

exports.getPlans = async (req, res) => {
  try {
    const { role } = req.query;

    const result = await pool.query(
      `SELECT * FROM subscription_plans WHERE role = $1 ORDER BY price`,
      [role]
    );

    res.json({
      success: true,
      plans: result.rows
    });
  } catch (error) {
    console.error('Error getting plans:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get subscription plans'
    });
  }
};

// Get current user's subscription and quota
exports.getMySubscription = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    // Get active subscription
    const subResult = await pool.query(
      `SELECT us.*, sp.name as plan_name, sp.max_job_posts, sp.price, sp.role
       FROM user_subscriptions us
       JOIN subscription_plans sp ON sp.id = us.plan_id
       WHERE us.user_id = $1 AND us.is_active = true
       ORDER BY us.end_date DESC
       LIMIT 1`,
      [userId]
    );

    const response = {
      success: true,
      subscription: subResult.rows[0] || null,
    };

    // For employers: get job posting quota
    if (userRole === 'employer') {
      const quotaResult = await pool.query(
        `SELECT * FROM employer_job_quotas WHERE user_id = $1`,
        [userId]
      );
      response.quota = quotaResult.rows[0] || { total_quota: 0, used_quota: 0, remaining_quota: 0 };
    }

    // For candidates: get daily apply limits
    if (userRole === 'candidate') {
      const candidateLimits = require('../utils/candidateLimits');
      const limitsInfo = await candidateLimits.getCandidateSubscriptionInfo(userId);
      response.limits = limitsInfo;
    }

    res.json(response);
  } catch (error) {
    console.error('Error getting subscription:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get subscription info'
    });
  }
};

// Get payment history
exports.getPaymentHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT o.*, sp.name as plan_name, sp.max_job_posts
       FROM orders o
       JOIN subscription_plans sp ON sp.id = o.plan_id
       WHERE o.user_id = $1
       ORDER BY o.created_at DESC`,
      [userId]
    );

    res.json({
      success: true,
      payments: result.rows
    });
  } catch (error) {
    console.error('Error getting payment history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get payment history'
    });
  }
};
