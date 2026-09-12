const createPrescriptionDTO = (data) => {
  // Build the medicines array — accept explicit array or build from flat fields
  const medicines = Array.isArray(data.medicines) && data.medicines.length > 0
    ? data.medicines
    : [];

  return {
    rxId: data.rxId || undefined,
    // recordId links to a MedicalRecord — never default to a hard-coded value
    recordId: data.recordId || null,
    patientId: data.patientId || null,
    patientName: data.patientName || data.patient || null,
    doctorId: data.doctorId || null,
    appointmentId: data.appointmentId || null,
    diagnosis: data.diagnosis || "General Consultation",
    symptoms: Array.isArray(data.symptoms) ? data.symptoms : [],
    medicines,
    advice: data.advice || "",
    followUpDate: data.followUpDate || null,
    status: data.status || "Active",
  };
};

const updatePrescriptionDTO = (data) => {
  const dto = {};

  if (data.patientName !== undefined) dto.patientName = data.patientName;
  if (data.recordId !== undefined) dto.recordId = data.recordId;
  if (data.diagnosis !== undefined) dto.diagnosis = data.diagnosis;
  if (data.symptoms !== undefined) dto.symptoms = data.symptoms;
  if (data.medicines !== undefined) dto.medicines = data.medicines;
  if (data.advice !== undefined) dto.advice = data.advice;
  if (data.followUpDate !== undefined) dto.followUpDate = data.followUpDate;
  if (data.status !== undefined) dto.status = data.status;

  return dto;
};

module.exports = {
  createPrescriptionDTO,
  updatePrescriptionDTO,
};