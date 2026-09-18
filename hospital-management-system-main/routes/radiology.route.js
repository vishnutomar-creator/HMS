const express = require("express");

const {
    orderScan,
    getScans,
    getScanById,
    getScansByPatient,
    getPendingScans,
    scheduleScan,
    startScan,
    submitReport,
    verifyReport,
    cancelScan,
    deleteScan,
} = require("../controllers/radiology.controller");

const { validationMiddleware } = require("../middlewares/validation.middleware");
const {
    orderScanValidator,
    scheduleScanValidator,
    submitReportValidator,
    verifyReportValidator,
    scanIdValidator,
} = require("../validators/radiology.validator.jsradiology.validator");

const authMiddleware = require("../middlewares/auth.middleware");
const authorizeRoles = require("../middlewares/role.middleware");
const { ROLES } = require("../constants/roles");
const upload = require("../middlewares/upload.middleware");

const router = express.Router();

router.post(
    "/orderscan",
    authMiddleware,
    authorizeRoles(ROLES.ADMIN, ROLES.DOCTOR),
    orderScanValidator,
    validationMiddleware,
    orderScan
);

router.get(
    "/getscans",
    authMiddleware,
    authorizeRoles(ROLES.ADMIN, ROLES.DOCTOR),
    getScans
);

router.get(
    "/getpendingscans",
    authMiddleware,
    authorizeRoles(ROLES.ADMIN, ROLES.DOCTOR),
    getPendingScans
);

router.get(
    "/getscanby/:id",
    authMiddleware,
    authorizeRoles(ROLES.ADMIN, ROLES.DOCTOR, ROLES.PATIENT),
    scanIdValidator,
    validationMiddleware,
    getScanById
);

router.get(
    "/getscansbypatient/:patientId",
    authMiddleware,
    authorizeRoles(ROLES.ADMIN, ROLES.DOCTOR, ROLES.PATIENT),
    getScansByPatient
);

router.patch(
    "/schedulescan/:id",
    authMiddleware,
    authorizeRoles(ROLES.ADMIN, ROLES.DOCTOR),
    scheduleScanValidator,
    validationMiddleware,
    scheduleScan
);

router.patch(
    "/startscan/:id",
    authMiddleware,
    authorizeRoles(ROLES.ADMIN, ROLES.DOCTOR),
    scanIdValidator,
    validationMiddleware,
    startScan
);

router.patch(
    "/submitreport/:id",
    authMiddleware,
    authorizeRoles(ROLES.ADMIN, ROLES.DOCTOR),
    upload.single("reportFile"),
    submitReportValidator,
    validationMiddleware,
    submitReport
);

router.patch(
    "/verifyreport/:id",
    authMiddleware,
    authorizeRoles(ROLES.ADMIN, ROLES.DOCTOR),
    verifyReportValidator,
    validationMiddleware,
    verifyReport
);

router.patch(
    "/cancelscan/:id",
    authMiddleware,
    authorizeRoles(ROLES.ADMIN, ROLES.DOCTOR),
    scanIdValidator,
    validationMiddleware,
    cancelScan
);

router.delete(
    "/deletescanby/:id",
    authMiddleware,
    authorizeRoles(ROLES.ADMIN),
    scanIdValidator,
    validationMiddleware,
    deleteScan
);

module.exports = router;