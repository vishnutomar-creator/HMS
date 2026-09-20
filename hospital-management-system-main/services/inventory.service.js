const InventoryItem = require("../models/InventoryItem");

const initialMedicines = [
  {
    itemId: "MED-101",
    name: "Amlodipine 5mg",
    category: "Cardiac",
    form: "Tablet",
    stock: 420,
    reorderLevel: 150,
    capacity: 600,
    unitPrice: 3.5,
    supplier: "Sunrise Pharma Distributors",
    expiryDate: "2027-03-01",
    status: "In Stock",
  },
  {
    itemId: "MED-102",
    name: "Metformin 500mg",
    category: "Diabetes",
    form: "Tablet",
    stock: 90,
    reorderLevel: 150,
    capacity: 500,
    unitPrice: 2.1,
    supplier: "Wellness Meditrade",
    expiryDate: "2026-12-15",
    status: "Low Stock",
  },
  {
    itemId: "MED-103",
    name: "Cetirizine 10mg",
    category: "Allergy",
    form: "Tablet",
    stock: 310,
    reorderLevel: 100,
    capacity: 400,
    unitPrice: 1.2,
    supplier: "Sunrise Pharma Distributors",
    expiryDate: "2027-06-20",
    status: "In Stock",
  },
  {
    itemId: "MED-104",
    name: "Ibuprofen 400mg",
    category: "Pain Relief",
    form: "Tablet",
    stock: 60,
    reorderLevel: 120,
    capacity: 450,
    unitPrice: 1.8,
    supplier: "MedCore Supplies",
    expiryDate: "2026-09-30",
    status: "Low Stock",
  },
  {
    itemId: "MED-105",
    name: "Amoxicillin 250mg",
    category: "Antibiotic",
    form: "Capsule",
    stock: 275,
    reorderLevel: 100,
    capacity: 350,
    unitPrice: 4.0,
    supplier: "Wellness Meditrade",
    expiryDate: "2026-10-05",
    status: "In Stock",
  },
  {
    itemId: "MED-106",
    name: "Insulin Glargine",
    category: "Diabetes",
    form: "Injection",
    stock: 35,
    reorderLevel: 40,
    capacity: 120,
    unitPrice: 320,
    supplier: "MedCore Supplies",
    expiryDate: "2026-08-25",
    status: "Expiring Soon",
  },
];

const seedIfEmpty = async () => {
  try {
    const count = await InventoryItem.countDocuments();
    if (count === 0) {
      await InventoryItem.insertMany(initialMedicines);
    }
  } catch (e) {
    console.warn("Inventory seed check notice:", e.message);
  }
};

const getInventoryItems = async () => {
  await seedIfEmpty();
  return await InventoryItem.find().sort({ updatedAt: -1 });
};

const getInventoryItemById = async (id) => {
  return await InventoryItem.findOne({
    $or: [{ _id: id }, { itemId: id }],
  });
};

const createInventoryItem = async (data) => {
  const item = new InventoryItem(data);
  return await item.save();
};

const updateInventoryItem = async (id, data) => {
  const item = await InventoryItem.findOne({
    $or: [{ _id: id }, { itemId: id }],
  });
  if (!item) {
    throw new Error("Inventory item not found");
  }
  Object.assign(item, data);
  return await item.save();
};

// Check stock and dispense medicines
const dispenseMedicines = async (medicines) => {
  await seedIfEmpty();
  const allItems = await InventoryItem.find();
  const insufficientItems = [];
  const updates = [];

  for (const med of medicines) {
    const qtyRequired = Number(med.quantity) || 1;
    const cleanMedName = (med.name || "").trim().toLowerCase();

    // Match inventory item by name substring or full name
    const match = allItems.find(
      (item) =>
        item.name.toLowerCase() === cleanMedName ||
        cleanMedName.includes(item.name.toLowerCase()) ||
        item.name.toLowerCase().includes(cleanMedName)
    );

    if (match) {
      if (match.stock < qtyRequired) {
        insufficientItems.push({
          medicineName: match.name,
          availableStock: match.stock,
          requiredStock: qtyRequired,
        });
      } else {
        updates.push({
          item: match,
          newStock: match.stock - qtyRequired,
        });
      }
    }
  }

  if (insufficientItems.length > 0) {
    const details = insufficientItems
      .map(
        (i) =>
          `"${i.medicineName}": ${i.availableStock} available, ${i.requiredStock} required`
      )
      .join("; ");
    const err = new Error(`Low Stock Warning: Insufficient stock for ${details}`);
    err.insufficientStock = true;
    err.details = insufficientItems;
    throw err;
  }

  // Deduct stock for all matched medicines
  for (const u of updates) {
    u.item.stock = u.newStock;
    if (u.item.stock <= 0) {
      u.item.status = "Out of Stock";
    } else if (u.item.stock <= u.item.reorderLevel) {
      u.item.status = "Low Stock";
    } else {
      u.item.status = "In Stock";
    }
    await u.item.save();
  }

  return { success: true, updatedCount: updates.length };
};

// Process pharmacy return and restore stock
const returnMedicines = async (returnedItems) => {
  await seedIfEmpty();
  const allItems = await InventoryItem.find();
  const restored = [];

  for (const item of returnedItems) {
    const returnQty = Number(item.quantity) || 1;
    const cleanName = (item.medicineName || item.name || "").trim().toLowerCase();

    const match = allItems.find(
      (inv) =>
        inv.name.toLowerCase() === cleanName ||
        cleanName.includes(inv.name.toLowerCase()) ||
        inv.name.toLowerCase().includes(cleanName)
    );

    if (match) {
      match.stock = Math.min(match.capacity || 9999, match.stock + returnQty);
      if (match.stock > match.reorderLevel) {
        match.status = "In Stock";
      } else if (match.stock > 0) {
        match.status = "Low Stock";
      }
      await match.save();
      restored.push({ medicineName: match.name, newStock: match.stock, qtyReturned: returnQty });
    }
  }

  return { success: true, restored };
};

module.exports = {
  getInventoryItems,
  getInventoryItemById,
  createInventoryItem,
  updateInventoryItem,
  dispenseMedicines,
  returnMedicines,
};
