<<<<<<< HEAD
const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

router.post("/register", authController.register);
router.post("/login", authController.login);

module.exports = router;
=======
const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

router.post("/register", authController.register);
router.post("/login", authController.login);

module.exports = router;
>>>>>>> d8f4b6dd27e42e2420908d9b3678d12ab3e9cb81
