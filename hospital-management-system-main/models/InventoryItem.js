const mongoose = require("mongoose");

const inventoryItemSchema = new mongoose.Schema(
  {
    itemId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      default: "General",
    },
    form: {
      type: String,
      default: "Tablet",
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    reorderLevel: {
      type: Number,
      default: 100,
    },
    capacity: {
      type: Number,
      default: 500,
    },
    unitPrice: {
      type: Number,
      default: 0,
    },
    supplier: {
      type: String,
      default: "Standard Pharma Distributors",
    },
    expiryDate: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ["In Stock", "Low Stock", "Out of Stock", "Expiring Soon"],
      default: "In Stock",
    },
  },
  {
    timestamps: true,
  }
);

inventoryItemSchema.pre("save", function (next) {
  if (this.stock <= 0) {
    this.status = "Out of Stock";
  } else if (this.stock <= this.reorderLevel) {
    this.status = "Low Stock";
  } else {
    this.status = "In Stock";
  }
  next();
});

module.exports = mongoose.model("InventoryItem", inventoryItemSchema);
