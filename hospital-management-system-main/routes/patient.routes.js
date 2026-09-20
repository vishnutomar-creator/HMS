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

const router = express.Router();

const upload = require("../middlewares/upload.middleware");

// =========================
// Create Patient
// =========================

router.post("/createpatient", upload.single("profileImage"), createPatientValidator, validationMiddleware, createPatient);

// =========================
// Get All Patients
// =========================

router.get("/getpatients", getPatients);

// =========================
// Get Patient By ID
// =========================

router.get("/getpatientby/:id", patientIdValidator, validationMiddleware, getPatientById);

// =========================
// Update Patient By ID
// =========================

router.put("/updatepatientby/:id", upload.single("profileImage"), updatePatientValidator, validationMiddleware, updatePatient);

// =========================
// Delete Patient By ID
// =========================

router.delete("/deletepatientby/:id", patientIdValidator, validationMiddleware, deletePatient);

module.exports = router;