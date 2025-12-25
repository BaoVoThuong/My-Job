const express = require("express");
const router = express.Router();
const candidateController = require("../controllers/candidate.controller");
const authMiddleware = require("../middleware/auth.middleware");

// All routes require authentication
router.use(authMiddleware);

// Get dashboard statistics
router.get("/dashboard/stats", candidateController.getDashboardStats);

// Get applied jobs
router.get("/applied-jobs", candidateController.getAppliedJobs);

// Get recent jobs for dashboard
router.get("/recent-jobs", candidateController.getRecentJobs);

module.exports = router;
