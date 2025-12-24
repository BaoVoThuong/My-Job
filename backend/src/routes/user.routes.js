<<<<<<< HEAD
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const userController = require("../controllers/user.controller");

router.get("/me", auth, userController.getMe);
router.get("/me/applications", auth, userController.getAppliedJobs);
router.put("/me", auth, userController.updateMe);

module.exports = router;
=======
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const userController = require("../controllers/user.controller");

router.get("/me", auth, userController.getMe);
router.get("/me/applications", auth, userController.getAppliedJobs);
router.put("/me", auth, userController.updateMe);

module.exports = router;
>>>>>>> d8f4b6dd27e42e2420908d9b3678d12ab3e9cb81
