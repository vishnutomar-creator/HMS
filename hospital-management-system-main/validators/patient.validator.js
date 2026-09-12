const { body, param } = require("express-validator");

const createPatientValidator = [
  body("patientId")
    .notEmpty().withMessage("Patient ID is required")
    .trim(),

  body("name")
    .optional()
    .notEmpty().withMessage("Name cannot be blank")
    .isLength({ min: 2, max: 100 }).withMessage("Name must be 2–100 characters")
    .trim(),

  body("patientName")
    .optional()
    .notEmpty().withMessage("Patient name cannot be blank")
    .isLength({ min: 2, max: 100 }).withMessage("Name must be 2–100 characters")
    .trim(),

  body("age")
    .optional()
    .isInt({ min: 0, max: 150 }).withMessage("Age must be a number between 0 and 150"),

  body("phone")
    .optional()
    .matches(/^[+]?[\d\s\-().]{7,15}$/).withMessage("Invalid phone number format"),

  body("email")
    .optional()
    .isEmail().withMessage("Invalid email address")
    .normalizeEmail(),

  body("gender")
    .optional()
    .isIn(["Male", "Female", "Other"]).withMessage("Gender must be Male, Female, or Other"),

  body("bloodGroup")
    .optional()
    .isIn(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"])
    .withMessage("Invalid blood group"),

  body("maritalStatus")
    .optional()
    .isIn(["Single", "Married", "Divorced", "Widowed"])
    .withMessage("Invalid marital status"),

  body("userId")
    .optional()
    .isMongoId().withMessage("Invalid User ID"),
];

const updatePatientValidator = [
  param("id").notEmpty().withMessage("Patient ID is required"),

  body("name")
    .optional()
    .notEmpty().withMessage("Name cannot be blank")
    .isLength({ min: 2, max: 100 }).withMessage("Name must be 2–100 characters")
    .trim(),

  body("age")
    .optional()
    .isInt({ min: 0, max: 150 }).withMessage("Age must be a number between 0 and 150"),

  body("phone")
    .optional()
    .matches(/^[+]?[\d\s\-().]{7,15}$/).withMessage("Invalid phone number format"),

  body("email")
    .optional()
    .isEmail().withMessage("Invalid email address")
    .normalizeEmail(),

  body("gender")
    .optional()
    .isIn(["Male", "Female", "Other"]).withMessage("Gender must be Male, Female, or Other"),

  body("bloodGroup")
    .optional()
    .isIn(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"])
    .withMessage("Invalid blood group"),

  body("maritalStatus")
    .optional()
    .isIn(["Single", "Married", "Divorced", "Widowed"])
    .withMessage("Invalid marital status"),

  body("userId")
    .optional()
    .isMongoId().withMessage("Invalid User ID"),
];

const patientIdValidator = [
  param("id").notEmpty().withMessage("Patient ID is required"),
];

module.exports = {
  createPatientValidator,
  updatePatientValidator,
  patientIdValidator,
};
