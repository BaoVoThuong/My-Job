const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const employerController = require("../controllers/employer.controller");
const checkRole = require("../middleware/role.middleware");


router.post("/jobs", auth, checkRole("employer"), employerController.pushJob);

router.get("/jobs", auth, checkRole("employer"), employerController.getJobsByUser);

router.put("/jobs/:id", auth, checkRole("employer"), employerController.updateJob);

router.delete("/jobs/:id", auth, checkRole("employer"), employerController.deleteJob);

module.exports = router;