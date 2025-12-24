<<<<<<< HEAD
const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/payment.controller");
const authMiddleware = require("../middleware/auth.middleware");

// User phải login mới mua subscription
router.post(
  "/momo/create",
  authMiddleware,
  paymentController.createMomoPayment
);

// MoMo callback (IPN) — KHÔNG auth
router.post("/momo/ipn", paymentController.momoIPN);

module.exports = router;
=======
const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/payment.controller");
const authMiddleware = require("../middleware/auth.middleware");

// User phải login mới mua subscription
router.post(
  "/momo/create",
  authMiddleware,
  paymentController.createMomoPayment
);

// MoMo callback (IPN) — KHÔNG auth
router.post("/momo/ipn", paymentController.momoIPN);

module.exports = router;
>>>>>>> d8f4b6dd27e42e2420908d9b3678d12ab3e9cb81
