const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const checkRole = require("../middleware/role.middleware");
const jobAlertController = require("../controllers/jobAlert.controller");

// All routes require authentication and candidate role
router.use(auth, checkRole("candidate"));

// BE-JA-4: Get all job alerts
router.get("/", jobAlertController.getJobAlerts);

// BE-JA-6: Get unread count
router.get("/unread-count", jobAlertController.getUnreadCount);

// BE-JA-5: Mark single alert as read
router.post("/:alertId/read", jobAlertController.markAlertAsRead);

// BE-JA-5: Mark multiple alerts as read
router.post("/read-all", jobAlertController.markAlertsAsRead);

// Delete single alert
router.delete("/:alertId", jobAlertController.deleteJobAlert);

// Delete multiple alerts
router.post("/delete-multiple", jobAlertController.deleteMultipleAlerts);

// Delete all read alerts
router.delete("/read/all", jobAlertController.deleteAllReadAlerts);

module.exports = router;
