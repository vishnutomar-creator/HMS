const express = require("express");

const {
  createPrescription,
  getPrescriptions,
  getPrescriptionById,
  getPrescriptionsByPatient,
  getPrescriptionsByDoctor,
  updatePrescription,
  deletePrescription,
} = require(
  "../controllers/prescription.controller"
);

const {
  validateCreatePrescription,
  validateUpdatePrescription,
} = require(
  "../validators/prescription.validator"
);

const authMiddleware = require(
  "../middlewares/auth.middleware"
);

const router = express.Router();

// CREATE
router.post(
  "/prescriptions",
  authMiddleware,
  validateCreatePrescription,
  createPrescription
);

// GET ALL
router.get(
  "/prescriptions",
  authMiddleware,
  getPrescriptions
);

// GET BY PATIENT
router.get(
  "/prescriptions/patient/:patientId",
  authMiddleware,
  getPrescriptionsByPatient
);

// GET BY DOCTOR
router.get(
  "/prescriptions/doctor/:doctorId",
  authMiddleware,
  getPrescriptionsByDoctor
);

// GET BY ID
router.get(
  "/prescriptions/:id",
  authMiddleware,
  getPrescriptionById
);

// UPDATE
router.put(
  "/prescriptions/:id",
  authMiddleware,
  validateUpdatePrescription,
  updatePrescription
);

// DELETE
router.delete(
  "/prescriptions/:id",
  authMiddleware,
  deletePrescription
);

module.exports = router;