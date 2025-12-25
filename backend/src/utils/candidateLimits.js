const db = require('../config/db');

// Daily apply limit for free users
const FREE_DAILY_APPLY_LIMIT = 20;

/**
 * Check if candidate has active premium subscription
 */
async function hasPremiumSubscription(userId) {
  const result = await db.query(
    `SELECT us.*, sp.role
     FROM user_subscriptions us
     JOIN subscription_plans sp ON sp.id = us.plan_id
     WHERE us.user_id = $1
       AND us.is_active = true
       AND sp.role = 'candidate'
       AND us.end_date > CURRENT_TIMESTAMP
     ORDER BY us.end_date DESC
     LIMIT 1`,
    [userId]
  );

  return result.rows.length > 0;
}

/**
 * Get today's apply count for a candidate
 */
async function getTodayApplyCount(userId) {
  const result = await db.query(
    `SELECT apply_count
     FROM candidate_daily_limits
     WHERE user_id = $1 AND apply_date = CURRENT_DATE`,
    [userId]
  );

  return result.rows.length > 0 ? result.rows[0].apply_count : 0;
}

/**
 * Check if candidate can apply for a job
 * Returns: { allowed: boolean, reason: string, current: number, limit: number }
 */
async function canApplyForJob(userId) {
  // Check if user has premium subscription
  const isPremium = await hasPremiumSubscription(userId);

  if (isPremium) {
    return {
      allowed: true,
      reason: 'Premium user - unlimited applications',
      current: 0,
      limit: -1, // -1 means unlimited
    };
  }

  // Free user - check daily limit
  const todayCount = await getTodayApplyCount(userId);

  if (todayCount >= FREE_DAILY_APPLY_LIMIT) {
    return {
      allowed: false,
      reason: `Daily application limit reached (${FREE_DAILY_APPLY_LIMIT} applications per day for free users)`,
      current: todayCount,
      limit: FREE_DAILY_APPLY_LIMIT,
    };
  }

  return {
    allowed: true,
    reason: 'Within daily limit',
    current: todayCount,
    limit: FREE_DAILY_APPLY_LIMIT,
  };
}

/**
 * Increment apply count for today
 */
async function incrementApplyCount(userId) {
  await db.query(
    `INSERT INTO candidate_daily_limits (user_id, apply_date, apply_count)
     VALUES ($1, CURRENT_DATE, 1)
     ON CONFLICT (user_id, apply_date)
     DO UPDATE SET apply_count = candidate_daily_limits.apply_count + 1`,
    [userId]
  );
}

/**
 * Get candidate's subscription info and limits
 */
async function getCandidateSubscriptionInfo(userId) {
  const isPremium = await hasPremiumSubscription(userId);
  const todayCount = await getTodayApplyCount(userId);

  return {
    isPremium,
    dailyApplies: {
      current: todayCount,
      limit: isPremium ? -1 : FREE_DAILY_APPLY_LIMIT,
      remaining: isPremium ? -1 : Math.max(0, FREE_DAILY_APPLY_LIMIT - todayCount),
    },
  };
}

module.exports = {
  hasPremiumSubscription,
  canApplyForJob,
  incrementApplyCount,
  getTodayApplyCount,
  getCandidateSubscriptionInfo,
  FREE_DAILY_APPLY_LIMIT,
};
