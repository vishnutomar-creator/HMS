const express = require("express");

const {
  createBilling,
  getBillings,
  getBillingById,
  updateBilling,
  deleteBilling,
} = require("../controllers/billing.controller");

const { validationMiddleware } = require("../middlewares/validation.middleware");
const { createBillingValidator, updateBillingValidator, billingIdValidator } = require("../validators/billing.validator");
const authMiddleware = require("../middlewares/auth.middleware");
const authorizeRoles = require("../middlewares/role.middleware");

const router = express.Router();

// Create bill — admin, accountant, receptionist
router.post(
  "/",
  authMiddleware,
  authorizeRoles("admin", "accountant", "receptionist"),
  createBillingValidator,
  validationMiddleware,
  createBilling
);

// Get all bills — admin, accountant, receptionist, doctor
router.get(
  "/",
  authMiddleware,
  authorizeRoles("admin", "accountant", "receptionist", "doctor"),
  getBillings
);

// Get bill by ID
router.get(
  "/:id",
  authMiddleware,
  authorizeRoles("admin", "accountant", "receptionist", "doctor"),
  billingIdValidator,
  validationMiddleware,
  getBillingById
);

// Update bill — admin, accountant
router.put(
  "/:id",
  authMiddleware,
  authorizeRoles("admin", "accountant"),
  updateBillingValidator,
  validationMiddleware,
  updateBilling
);

// Delete bill — admin only
router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("admin"),
  billingIdValidator,
  validationMiddleware,
  deleteBilling
);

module.exports = router;
