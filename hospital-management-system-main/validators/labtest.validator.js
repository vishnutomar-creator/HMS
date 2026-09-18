const { body, param } = require("express-validator");

const orderLabTestValidator = [
    body("patientId").notEmpty().withMessage("Patient ID is required").isMongoId().withMessage("Invalid Patient ID"),
    body("doctorId").notEmpty().withMessage("Doctor ID is required").isMongoId().withMessage("Invalid Doctor ID"),
    body("testName").notEmpty().withMessage("Test name is required").trim(),
    body("testCategory").optional().isIn(["Blood", "Urine", "Imaging", "Microbiology", "Biochemistry", "Other"]).withMessage("Invalid test category"),
    body("priority").optional().isIn(["Routine", "Urgent", "STAT"]).withMessage("Invalid priority"),
];

const submitResultValidator = [
    param("id").notEmpty().withMessage("Lab test ID is required"),
    body("resultValue").notEmpty().withMessage("Result value is required").trim(),
    body("interpretation").optional().isIn(["Normal", "Abnormal", "Critical"]).withMessage("Invalid interpretation"),
];

const verifyResultValidator = [
    param("id").notEmpty().withMessage("Lab test ID is required"),
    body("verifiedBy").notEmpty().withMessage("Verifying doctor ID is required").isMongoId().withMessage("Invalid Doctor ID"),
];

const labTestIdValidator = [
    param("id").notEmpty().withMessage("Lab test ID is required"),
];

module.exports = {
    orderLabTestValidator,
    submitResultValidator,
    verifyResultValidator,
    labTestIdValidator,
};