const express = require("express");

const {
  createPatient,
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient,
} = require("../controllers/patient.controller");

const { validationMiddleware } = require("../middlewares/validation.middleware");
const { createPatientValidator, updatePatientValidator, patientIdValidator } = require("../validators/patient.validator");
const authMiddleware = require("../middlewares/auth.middleware");
const authorizeRoles = require("../middlewares/role.middleware");

const router = express.Router();
const upload = require("../middlewares/upload.middleware");

// =========================
// Create Patient — admin, receptionist
// =========================
router.post(
  "/",
  authMiddleware,
  authorizeRoles("admin", "receptionist"),
  upload.single("profileImage"),
  createPatientValidator,
  validationMiddleware,
  createPatient
);

// =========================
// Get All Patients — admin, receptionist, doctor, nurse
// =========================
router.get(
  "/",
  authMiddleware,
  authorizeRoles("admin", "receptionist", "doctor", "nurse"),
  getPatients
);

// =========================
// Get Patient By ID — admin, receptionist, doctor, nurse
// =========================
router.get(
  "/:id",
  authMiddleware,
  authorizeRoles("admin", "receptionist", "doctor", "nurse"),
  patientIdValidator,
  validationMiddleware,
  getPatientById
);

// =========================
// Update Patient By ID — admin, receptionist
// =========================
router.put(
  "/:id",
  authMiddleware,
  authorizeRoles("admin", "receptionist"),
  upload.single("profileImage"),
  updatePatientValidator,
  validationMiddleware,
  updatePatient
);

// =========================
// Delete Patient By ID — admin only
// =========================
router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("admin"),
  patientIdValidator,
  validationMiddleware,
  deletePatient
);

module.exports = router;