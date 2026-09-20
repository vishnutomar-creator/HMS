const express = require("express");
const {
  getInventory,
  getInventoryById,
  createInventoryItem,
  updateInventoryItem,
} = require("../controllers/inventory.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/inventory", authMiddleware, getInventory);
router.get("/inventory/:id", authMiddleware, getInventoryById);
router.post("/inventory", authMiddleware, createInventoryItem);
router.put("/inventory/:id", authMiddleware, updateInventoryItem);

module.exports = router;
