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

const inventoryService = require("./inventory.service");

const dispensePrescription = async (id, dispensedBy = "Pharmacist") => {
  const prescription = await getPrescriptionById(id);
  if (!prescription) {
    const error = new Error("Prescription not found");
    error.statusCode = 404;
    throw error;
  }

  // Deduct inventory stock — will throw error if stock is insufficient
  await inventoryService.dispenseMedicines(prescription.medicines || []);

  prescription.status = "Dispensed";
  prescription.dispensedAt = new Date();
  prescription.dispensedBy = dispensedBy;
  await prescription.save();

  return prescription;
};

const returnPrescription = async (id, returnedItems = [], reason = "Patient Return") => {
  const prescription = await getPrescriptionById(id);
  if (!prescription) {
    const error = new Error("Prescription not found");
    error.statusCode = 404;
    throw error;
  }

  // Restore inventory stock
  await inventoryService.returnMedicines(returnedItems);

  if (!Array.isArray(prescription.returnHistory)) {
    prescription.returnHistory = [];
  }

  for (const item of returnedItems) {
    prescription.returnHistory.push({
      returnedAt: new Date(),
      medicineName: item.medicineName || item.name,
      quantity: Number(item.quantity) || 1,
      reason,
    });
  }

  prescription.status = "Returned";
  await prescription.save();

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
  dispensePrescription,
  returnPrescription,
};