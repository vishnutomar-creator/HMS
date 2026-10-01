const prescriptionRepository = require(
  "../repositories/prescription.repository"
);

const notificationService = require(
  "./notification.service"
);

const createPrescription = async (
  prescriptionData
) => {
  const prescription =
    await prescriptionRepository.createPrescription(
      prescriptionData
    );

  /*
   * Patient notification
   *
   * Patient model should have userId.
   */

  return prescription;
};

const getPrescriptions = async () => {
  return await prescriptionRepository.getPrescriptions();
};

const getPrescriptionById = async (id) => {
  const prescription =
    await prescriptionRepository.getPrescriptionById(
      id
    );

  if (!prescription) {
    const error = new Error(
      "Prescription not found"
    );

    error.statusCode = 404;

    throw error;
  }

  return prescription;
};

const getPrescriptionsByPatient = async (
  patientId
) => {
  return await prescriptionRepository.getPrescriptionsByPatient(
    patientId
  );
};

const getPrescriptionsByDoctor = async (
  doctorId
) => {
  return await prescriptionRepository.getPrescriptionsByDoctor(
    doctorId
  );
};

const updatePrescription = async (
  id,
  prescriptionData
) => {
  const prescription =
    await prescriptionRepository.updatePrescription(
      id,
      prescriptionData
    );

  if (!prescription) {
    const error = new Error(
      "Prescription not found"
    );

    error.statusCode = 404;

    throw error;
  }

  return prescription;
};

const deletePrescription = async (id) => {
  const prescription =
    await prescriptionRepository.deletePrescription(
      id
    );

  if (!prescription) {
    const error = new Error(
      "Prescription not found"
    );

    error.statusCode = 404;

    throw error;
  }

  return prescription;
};

module.exports = {
  createPrescription,
  getPrescriptions,
  getPrescriptionById,
  getPrescriptionsByPatient,
  getPrescriptionsByDoctor,
  updatePrescription,
  deletePrescription,
};