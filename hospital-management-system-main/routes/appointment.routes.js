const express = require("express");

const {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
} = require("../controllers/appointment.controller");

const {
  validateCreateAppointment,
  validateUpdateAppointment,
} = require("../validators/appointment.validator");

const authMiddleware = require("../middlewares/auth.middleware");
const authorizeRoles = require("../middlewares/role.middleware");

const router = express.Router();

// Create Appointment — admin, receptionist, doctor
router.post(
  "/appointments",
  authMiddleware,
  authorizeRoles("admin", "receptionist", "doctor"),
  validateCreateAppointment,
  createAppointment
);

// Get All Appointments — admin, receptionist, doctor, nurse
router.get(
  "/appointments",
  authMiddleware,
  authorizeRoles("admin", "receptionist", "doctor", "nurse"),
  getAppointments
);

// Get Appointment By ID
router.get(
  "/appointments/:id",
  authMiddleware,
  authorizeRoles("admin", "receptionist", "doctor", "nurse"),
  getAppointmentById
);

// Update Appointment (status changes, reschedule)
router.put(
  "/appointments/:id",
  authMiddleware,
  authorizeRoles("admin", "receptionist", "doctor"),
  validateUpdateAppointment,
  updateAppointment
);

// Delete Appointment — admin only (use status update for cancellation)
router.delete(
  "/appointments/:id",
  authMiddleware,
  authorizeRoles("admin"),
  deleteAppointment
);

module.exports = router;