const pool = require("../config/db");

// Helper function to create job alert notification
async function createJobAlert({ userId, jobId, applicationId = null, type, title, message }) {
  try {
    await pool.query(
      `INSERT INTO job_alert_notifications (user_id, job_id, application_id, type, title, message)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [userId, jobId, applicationId, type, title, message]
    );
  } catch (error) {
    console.error("Error creating job alert:", error);
  }
}

// BE-JA-4: Get all job alerts for candidate
exports.getJobAlerts = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 10;
    const onlyUnread = req.query.onlyUnread === 'true';
    const offset = (page - 1) * size;

    let whereClause = 'WHERE ja.user_id = $1';
    if (onlyUnread) {
      whereClause += ' AND ja.read_at IS NULL';
    }

    const query = `
      SELECT
        ja.id,
        ja.type,
        ja.job_id,
        j.title as job_title,
        c.name as company_name,
        ja.application_id,
        ja.title,
        ja.message,
        ja.created_at,
        ja.read_at
      FROM job_alert_notifications ja
      LEFT JOIN jobs j ON ja.job_id = j.id
      LEFT JOIN companies c ON j.company_id = c.id
      ${whereClause}
      ORDER BY ja.created_at DESC
      LIMIT $2 OFFSET $3
    `;

    const countQuery = `
      SELECT COUNT(*) as total
      FROM job_alert_notifications ja
      ${whereClause}
    `;

    const [result, countResult] = await Promise.all([
      pool.query(query, [userId, size, offset]),
      pool.query(countQuery, [userId])
    ]);

    const total = parseInt(countResult.rows[0].total);
    const totalPages = Math.ceil(total / size);

    res.json({
      success: true,
      data: {
        items: result.rows.map(row => ({
          id: row.id,
          type: row.type,
          jobId: row.job_id,
          jobTitle: row.job_title,
          companyName: row.company_name,
          applicationId: row.application_id,
          title: row.title,
          message: row.message,
          createdAt: row.created_at,
          readAt: row.read_at
        })),
        page,
        size,
        totalItems: total,
        totalPages
      }
    });
  } catch (error) {
    console.error("Error fetching job alerts:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch job alerts"
    });
  }
};

// BE-JA-5: Mark single alert as read
exports.markAlertAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const alertId = req.params.alertId;

    const result = await pool.query(
      `UPDATE job_alert_notifications
       SET read_at = CURRENT_TIMESTAMP
       WHERE id = $1 AND user_id = $2 AND read_at IS NULL
       RETURNING id`,
      [alertId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Alert not found or already read"
      });
    }

    res.json({
      success: true,
      message: "Alert marked as read"
    });
  } catch (error) {
    console.error("Error marking alert as read:", error);
    res.status(500).json({
      success: false,
      message: "Failed to mark alert as read"
    });
  }
};

// BE-JA-5: Mark multiple alerts as read
exports.markAlertsAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const { alertIds } = req.body;

    if (!alertIds || !Array.isArray(alertIds) || alertIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "alertIds array is required"
      });
    }

    const placeholders = alertIds.map((_, idx) => `$${idx + 2}`).join(',');

    await pool.query(
      `UPDATE job_alert_notifications
       SET read_at = CURRENT_TIMESTAMP
       WHERE user_id = $1 AND id IN (${placeholders}) AND read_at IS NULL`,
      [userId, ...alertIds]
    );

    res.json({
      success: true,
      message: "Alerts marked as read"
    });
  } catch (error) {
    console.error("Error marking alerts as read:", error);
    res.status(500).json({
      success: false,
      message: "Failed to mark alerts as read"
    });
  }
};

// BE-JA-6: Get unread count
exports.getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT COUNT(*) as unread_count
       FROM job_alert_notifications
       WHERE user_id = $1 AND read_at IS NULL`,
      [userId]
    );

    res.json({
      success: true,
      data: {
        unreadCount: parseInt(result.rows[0].unread_count)
      }
    });
  } catch (error) {
    console.error("Error getting unread count:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get unread count"
    });
  }
};

// Export helper function for use in other controllers
exports.createJobAlert = createJobAlert;
