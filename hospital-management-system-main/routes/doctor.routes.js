const express = require("express");

const {
  createDoctor,
  getDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
} = require("../controllers/doctor.controller");

const {
  createDoctorValidator,
  updateDoctorValidator,
  doctorIdValidator,
} = require("../validators/doctor.validator");

const { validationMiddleware } = require("../middlewares/validation.middleware");
const authMiddleware = require("../middlewares/auth.middleware");
const authorizeRoles = require("../middlewares/role.middleware");

const router = express.Router();

// Create Doctor — admin only
router.post(
  "/",
  authMiddleware,
  authorizeRoles("admin"),
  createDoctorValidator,
  validationMiddleware,
  createDoctor
);

// Get All Doctors — admin, receptionist, doctor, nurse
router.get(
  "/",
  authMiddleware,
  authorizeRoles("admin", "receptionist", "doctor", "nurse"),
  getDoctors
);

// Get Doctor By ID — admin, receptionist, doctor, nurse
router.get(
  "/:id",
  authMiddleware,
  authorizeRoles("admin", "receptionist", "doctor", "nurse"),
  doctorIdValidator,
  validationMiddleware,
  getDoctorById
);

// Update Doctor — admin only
router.put(
  "/:id",
  authMiddleware,
  authorizeRoles("admin"),
  updateDoctorValidator,
  validationMiddleware,
  updateDoctor
);

// Delete Doctor — admin only
router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("admin"),
  doctorIdValidator,
  validationMiddleware,
  deleteDoctor
);

module.exports = router;