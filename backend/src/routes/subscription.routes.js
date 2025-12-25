const express = require("express");
const router = express.Router();
const subscriptionController = require("../controllers/subscription.controller");
const auth = require("../middleware/auth.middleware");

// Public routes
router.get("/plans", subscriptionController.getPlans);

// Protected routes
router.get("/my-subscription", auth, subscriptionController.getMySubscription);
router.get("/payment-history", auth, subscriptionController.getPaymentHistory);

module.exports = router;
