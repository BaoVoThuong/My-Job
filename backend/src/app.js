const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, '../../.env') });

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const jobRoutes = require("./routes/job.routes");
const employerRoutes = require("./routes/employer.routes");
const paymentRoutes = require("./routes/payment.routes");
const subscriptionRoutes = require("./routes/subscription.routes");
const jobAlertRoutes = require("./routes/jobAlert.routes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/employer/", employerRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/candidate/job-alerts", jobAlertRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("Job Portal Backend is running!");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
