const express = require("express");

const {
    createSupplier,
    getSuppliers,
    getSupplierById,
    updateSupplier,
    deleteSupplier,
} = require("../controllers/supplier.controller");

const { validationMiddleware } = require("../middlewares/validation.middleware");
const {
    createSupplierValidator,
    updateSupplierValidator,
    supplierIdValidator,
} = require("../validators/supplier.validator");

const router = express.Router();

router.post("/createsupplier", createSupplierValidator, validationMiddleware, createSupplier);
router.get("/getsuppliers", getSuppliers);
router.get("/getsupplierby/:id", supplierIdValidator, validationMiddleware, getSupplierById);
router.put("/updatesupplierby/:id", updateSupplierValidator, validationMiddleware, updateSupplier);
router.delete("/deletesupplierby/:id", supplierIdValidator, validationMiddleware, deleteSupplier);

module.exports = router;