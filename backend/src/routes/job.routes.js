const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const jobController = require("../controllers/job.controller");
const checkRole = require("../middleware/role.middleware");

router.get("/", jobController.getAllJobs);

router.get("/search", jobController.searchJobs);

// IMPORTANT: Specific routes must come BEFORE dynamic routes like /:id
router.get("/saved", auth, checkRole("candidate"), jobController.getSavedJobs);

router.get("/applied-ids", auth, checkRole("candidate"), jobController.getAppliedJobIds);

router.post("/saved/:id", auth, checkRole("candidate"), jobController.saveJob);

router.delete("/saved/:id", auth, checkRole("candidate"), jobController.unsaveJob);

// Dynamic route /:id must come AFTER all specific routes
router.get("/:id", jobController.getJobById);

router.post("/:id/apply", auth, jobController.applyJob);

module.exports = router;
