const express = require("express");

const router = express.Router();

// =========================
// Health Check
// =========================

router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "HMS API is working",
  });
});

// =========================
// Routes
// =========================

const userRoutes = require("./user.routes");
const doctorRoutes = require("./doctor.routes");
const departmentRoutes = require("./department.routes");
const patientRoutes = require("./patient.routes");
const dashboardRoutes = require("./dashboard.routes");
const authRoutes = require("./auth.routes");
const appointmentRoutes = require("./appointment.routes");
const auditRoutes = require("./audit.routes");
const notificationRoutes = require("./notification.routes");
const prescriptionRoutes = require("./prescription.routes");
const medicalRecordRoutes = require("./medicalRecord.routes");
const billingRoutes = require("./billing.routes");
const paymentRoutes = require("./payment.routes");

// =========================
// Route Mounting
// =========================

router.use("/users", userRoutes);

router.use("/doctors", doctorRoutes);

router.use("/departments", departmentRoutes);

// Patient routes now at /patients with REST paths
router.use("/patients", patientRoutes);

router.use("/", dashboardRoutes);

router.use("/auth", authRoutes);

// Appointment, prescription, medicalRecord routes use full paths internally
router.use("/", appointmentRoutes);

router.use("/", auditRoutes);

router.use("/", notificationRoutes);

router.use("/", prescriptionRoutes);

router.use("/", medicalRecordRoutes);

router.use("/billings", billingRoutes);

router.use("/payments", paymentRoutes);

module.exports = router;
