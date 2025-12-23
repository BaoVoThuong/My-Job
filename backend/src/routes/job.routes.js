const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const jobController = require("../controllers/job.controller");
const checkRole = require("../middleware/role.middleware");

router.get("/", jobController.getAllJobs);

router.get("/search", jobController.searchJobs);

router.get("/:id", jobController.getJobById);

router.post("/:id/apply", auth, jobController.applyJob);

router.post("/saved/:id", auth, checkRole("candidate"), jobController.saveJob);

router.delete("/saved/:id", auth, checkRole("candidate"), jobController.unsaveJob);

module.exports = router;
