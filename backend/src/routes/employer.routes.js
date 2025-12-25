const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const employerController = require("../controllers/employer.controller");
const checkRole = require("../middleware/role.middleware");

router.post("/jobs", auth, checkRole("employer"), employerController.pushJob);

router.get(
  "/jobs",
  auth,
  checkRole("employer"),
  employerController.getJobsByUser
);

router.put(
  "/jobs/:id",
  auth,
  checkRole("employer"),
  employerController.updateJob
);

router.delete(
  "/jobs/:id",
  auth,
  checkRole("employer"),
  employerController.deleteJob
);

// Get job applications - both routes for compatibility
router.get(
  "/jobs/:jobId/applications",
  auth,
  checkRole("employer"),
  employerController.getJobApplications
);

router.get(
  "/applications/:jobId",
  auth,
  checkRole("employer"),
  employerController.getJobApplications
);

router.put(
  "/jobs/:jobId/applications/status",
  auth,
  checkRole("employer"),
  employerController.updateApplicationStatus
);

// Update application status by application ID
router.put(
  "/applications/:applicationId/status",
  auth,
  checkRole("employer"),
  employerController.updateApplicationStatus
);

router.post(
  "/candidates/save",
  auth,
  checkRole("employer"),
  employerController.saveCandidate
);

router.get(
  "/candidates/saved",
  auth,
  checkRole("employer"),
  employerController.getSavedCandidates
);

router.post(
  "/applications/:applicationId/interview",
  auth,
  checkRole("employer"),
  employerController.scheduleInterview
);

module.exports = router;
