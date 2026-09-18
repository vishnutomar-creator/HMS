const Doctor = require("../models/Doctor");

// Create doctor
const createDoctor = async (doctorData) => {
  return await Doctor.create(doctorData);
};

// Get all doctors
const getDoctors = async () => {
  return await Doctor.find()
    .populate("userId", "email role")
    .populate("department", "name")
    .sort({ createdAt: -1 });
};

// Get doctor by ID
const getDoctorById = async (id) => {
  return await Doctor.findById(id)
    .populate("userId", "email role")
    .populate("department", "name");
};

// Get doctor by user ID
const getDoctorByUserId = async (userId) => {
  return await Doctor.findOne({ userId });
};

// Get doctor by doctorId
const getDoctorByDoctorId = async (doctorId) => {
  return await Doctor.findOne({ doctorId });
};

// Get doctor by registration number
const getDoctorByRegistrationNumber = async (registrationNumber) => {
  return await Doctor.findOne({ registrationNumber });
};

// Update doctor
const updateDoctor = async (id, doctorData) => {
  return await Doctor.findByIdAndUpdate(id, doctorData, {
    new: true,
    runValidators: true,
  })
    .populate("userId", "email role")
    .populate("department", "name");
};

// Delete doctor
const deleteDoctor = async (id) => {
  return await Doctor.findByIdAndDelete(id);
};

module.exports = {
  createDoctor,
  getDoctors,
  getDoctorById,
  getDoctorByUserId,
  getDoctorByDoctorId,
  getDoctorByRegistrationNumber,
  updateDoctor,
  deleteDoctor,
};