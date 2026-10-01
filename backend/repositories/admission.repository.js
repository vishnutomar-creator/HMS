const Admission = require("../models/admissions");

const createAdmission = async (admissionData) => {
  return await Admission.create(admissionData);
};

const getAdmissions = async () => {
  return await Admission.find()
    .populate("patientId", "Name phone gender bloodGroup")
    .populate("doctorId", "Name specialization")
    .populate("wardId", "wardName wardType")
    .populate("bedId", "bedNumber")
    .sort({ createdAt: -1 });
};

const getAdmissionById = async (id) => {
  return await Admission.findById(id)
    .populate("patientId", "Name phone gender bloodGroup")
    .populate("doctorId", "Name specialization")
    .populate("wardId", "wardName wardType")
    .populate("bedId", "bedNumber");
};

const getActiveAdmissionByPatient = async (patientId) => {
  return await Admission.findOne({ patientId, status: "Admitted" });
};

const getAdmissionsByPatient = async (patientId) => {
  return await Admission.find({ patientId })
    .populate("doctorId", "Name specialization")
    .populate("wardId", "wardName wardType")
    .populate("bedId", "bedNumber")
    .sort({ admissionDate: -1 });
};

const updateAdmission = async (id, admissionData) => {
  return await Admission.findByIdAndUpdate(id, admissionData, {
    new: true,
    runValidators: true,
  });
};

module.exports = {
  createAdmission,
  getAdmissions,
  getAdmissionById,
  getActiveAdmissionByPatient,
  getAdmissionsByPatient,
  updateAdmission,
};