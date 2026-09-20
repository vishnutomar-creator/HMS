const inventoryService = require("../services/inventory.service");

const getInventory = async (req, res, next) => {
  try {
    const items = await inventoryService.getInventoryItems();
    return res.status(200).json({
      success: true,
      message: "Inventory items fetched successfully",
      data: items,
    });
  } catch (err) {
    next(err);
  }
};

const getInventoryById = async (req, res, next) => {
  try {
    const item = await inventoryService.getInventoryItemById(req.params.id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Inventory item not found",
      });
    }
    return res.status(200).json({
      success: true,
      data: item,
    });
  } catch (err) {
    next(err);
  }
};

const createInventoryItem = async (req, res, next) => {
  try {
    const item = await inventoryService.createInventoryItem(req.body);
    return res.status(201).json({
      success: true,
      message: "Inventory item created successfully",
      data: item,
    });
  } catch (err) {
    next(err);
  }
};

const updateInventoryItem = async (req, res, next) => {
  try {
    const item = await inventoryService.updateInventoryItem(req.params.id, req.body);
    return res.status(200).json({
      success: true,
      message: "Inventory item updated successfully",
      data: item,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getInventory,
  getInventoryById,
  createInventoryItem,
  updateInventoryItem,
};
