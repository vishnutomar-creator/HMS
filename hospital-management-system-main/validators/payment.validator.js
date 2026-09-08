const { body, param } = require("express-validator");

const createPaymentValidator = [
  body("billingId").notEmpty().withMessage("Billing ID is required").isMongoId().withMessage("Invalid Billing ID"),
  body("patientId").notEmpty().withMessage("Patient ID is required").isMongoId().withMessage("Invalid Patient ID"),
  body("amount").notEmpty().withMessage("Amount is required").isNumeric().withMessage("Amount must be a number"),
  body("paymentMethod").notEmpty().withMessage("Payment method is required"),
];

const updatePaymentValidator = [
  param("id").isMongoId().withMessage("Invalid payment ID"),
];

const paymentIdValidator = [
  param("id").isMongoId().withMessage("Invalid payment ID"),
];

module.exports = {
  createPaymentValidator,
  updatePaymentValidator,
  paymentIdValidator,
};
