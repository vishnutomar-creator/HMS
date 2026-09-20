const Radiology = require("../models/radiology");

const createScan = async (scanData) => {
    return await Radiology.create(scanData);
};

const getScans = async () => {
    return await Radiology.find()
        .populate("patientId", "Name phone gender")
        .populate("doctorId", "Name specialization")
        .populate("verifiedBy", "Name")
        .sort({ createdAt: -1 });
};

const getScanById = async (id) => {
    return await Radiology.findById(id)
        .populate("patientId", "Name phone gender")
        .populate("doctorId", "Name specialization")
        .populate("verifiedBy", "Name");
};

const getScansByPatient = async (patientId) => {
    return await Radiology.find({ patientId })
        .populate("doctorId", "Name specialization")
        .sort({ orderDate: -1 });
};

const getScansByStatus = async (status) => {
    return await Radiology.find({ status })
        .populate("patientId", "Name phone")
        .populate("doctorId", "Name specialization")
        .sort({ priority: 1, orderDate: 1 });
};

const updateScan = async (id, updateData) => {
    return await Radiology.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
    });
};

const deleteScan = async (id) => {
    return await Radiology.findByIdAndDelete(id);
};

module.exports = {
    createScan,
    getScans,
    getScanById,
    getScansByPatient,
    getScansByStatus,
    updateScan,
    deleteScan,
};