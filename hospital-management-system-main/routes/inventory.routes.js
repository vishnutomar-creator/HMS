const express = require("express");

const {
    createItem,
    getItems,
    getItemById,
    updateItem,
    restockItem,
    consumeItem,
    getLowStockItems,
    getExpiringItems,
    deleteItem,
} = require("../controllers/inventory.controller");

const { validationMiddleware } = require("../middlewares/validation.middleware");
const {
    createItemValidator,
    stockChangeValidator,
    idValidator,
} = require("../validators/inventory.validator");

const authMiddleware = require("../middlewares/auth.middleware");
const authorizeRoles = require("../middlewares/role.middleware");
const { ROLES } = require("../constants/roles");

const router = express.Router();

router.use(authMiddleware, authorizeRoles(ROLES.ADMIN));

router.post("/createitem", createItemValidator, validationMiddleware, createItem);
router.get("/getitems", getItems);
router.get("/low-stock", getLowStockItems);
router.get("/expiring", getExpiringItems);
router.get("/getitemby/:id", idValidator, validationMiddleware, getItemById);
router.put("/updateitemby/:id", idValidator, validationMiddleware, updateItem);
router.patch("/restock/:id", stockChangeValidator, validationMiddleware, restockItem);
router.patch("/consume/:id", stockChangeValidator, validationMiddleware, consumeItem);
router.delete("/deleteitemby/:id", idValidator, validationMiddleware, deleteItem);

module.exports = router;