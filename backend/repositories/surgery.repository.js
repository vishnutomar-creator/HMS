const Surgery = require("../models/surgeries");

const createSurgery = async (surgeryData) => {
  return await Surgery.create(surgeryData);
};

const getSurgeries = async () => {
  return await Surgery.find()
    .populate("patientId", "Name phone")
    .populate("primarySurgeonId", "Name specialization")
    .populate("assistantSurgeonId", "Name specialization")
    .sort({ surgeryDate: -1 });
};

const getSurgeryById = async (id) => {
  return await Surgery.findById(id)
    .populate("patientId", "Name phone")
    .populate("primarySurgeonId", "Name specialization")
    .populate("assistantSurgeonId", "Name specialization");
};

const getSurgeriesByOtAndDate = async (otId, surgeryDate) => {
  return await Surgery.find({
    otId,
    surgeryDate,
    status: { $in: ["Scheduled", "InProgress"] },
  });
};

const updateSurgery = async (id, surgeryData) => {
  return await Surgery.findByIdAndUpdate(id, surgeryData, {
    new: true,
    runValidators: true,
  });
};

const deleteSurgery = async (id) => {
  return await Surgery.findByIdAndDelete(id);
};

module.exports = {
  createSurgery,
  getSurgeries,
  getSurgeryById,
  getSurgeriesByOtAndDate,
  updateSurgery,
  deleteSurgery,
};