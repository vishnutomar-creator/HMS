const appointmentRepository = require("../repositories/appointment.repository");
const doctorRepository = require("../repositories/doctor.repository");
const patientRepository = require("../repositories/patient.repository");
const eventEmitter = require("../events/eventEmitter");

const createAppointment = async (appointmentData) => {
  const {
    patientId,
    doctorId,
    appointmentDate,
    appointmentTime,
  } = appointmentData;

  // Validate patient exists
  const patient = await patientRepository.getPatientById(patientId);
  if (!patient) {
    const error = new Error("Patient not found");
    error.statusCode = 404;
    throw error;
  }

  // Validate doctor exists and is available
  const doctor = await doctorRepository.getDoctorById(doctorId);
  if (!doctor) {
    const error = new Error("Doctor not found");
    error.statusCode = 404;
    throw error;
  }

  if (doctor.availability !== "Available") {
    const error = new Error(
      `Doctor is currently ${doctor.availability} and cannot accept appointments`
    );
    error.statusCode = 409;
    throw error;
  }

  // Check for time slot conflict
  const existingAppointment =
    await appointmentRepository.findExistingAppointment({
      doctorId,
      appointmentDate,
      appointmentTime,
    });

  if (existingAppointment) {
    const error = new Error(
      "Doctor is already booked for this date and time"
    );
    error.statusCode = 409;
    throw error;
  }

  const appointment = await appointmentRepository.createAppointment(
    appointmentData
  );

  eventEmitter.emit("appointmentCreated", appointment);

  return appointment;
};

const getAppointments = async () => {
  return await appointmentRepository.getAppointments();
};

const getAppointmentById = async (id) => {
  const appointment =
    await appointmentRepository.getAppointmentById(id);

  if (!appointment) {
    const error = new Error(
      "Appointment not found"
    );
    error.statusCode = 404;
    throw error;
  }

  return appointment;
};

const updateAppointment = async (
  id,
  appointmentData
) => {
  const existingAppointment =
    await appointmentRepository.getAppointmentById(id);

  if (!existingAppointment) {
    const error = new Error(
      "Appointment not found"
    );
    error.statusCode = 404;
    throw error;
  }

  // If rescheduling to a new doctor/time, re-validate availability
  if (
    appointmentData.doctorId ||
    appointmentData.appointmentDate ||
    appointmentData.appointmentTime
  ) {
    const targetDoctorId =
      appointmentData.doctorId ||
      existingAppointment.doctorId;

    // Check doctor availability if doctor is being changed
    if (appointmentData.doctorId) {
      const doctor = await doctorRepository.getDoctorById(appointmentData.doctorId);
      if (!doctor) {
        const error = new Error("Doctor not found");
        error.statusCode = 404;
        throw error;
      }
      if (doctor.availability !== "Available") {
        const error = new Error(
          `Doctor is currently ${doctor.availability} and cannot accept appointments`
        );
        error.statusCode = 409;
        throw error;
      }
    }

    const appointmentDate =
      appointmentData.appointmentDate ||
      existingAppointment.appointmentDate;

    const appointmentTime =
      appointmentData.appointmentTime ||
      existingAppointment.appointmentTime;

    const conflict =
      await appointmentRepository.findExistingAppointment(
        {
          doctorId: targetDoctorId,
          appointmentDate,
          appointmentTime,
        }
      );

    if (
      conflict &&
      conflict._id.toString() !== id
    ) {
      const error = new Error(
        "Doctor is already booked for this date and time"
      );
      error.statusCode = 409;
      throw error;
    }
  }

  return await appointmentRepository.updateAppointment(
    id,
    appointmentData
  );
};

const deleteAppointment = async (id) => {
  const appointment =
    await appointmentRepository.getAppointmentById(id);

  if (!appointment) {
    const error = new Error(
      "Appointment not found"
    );
    error.statusCode = 404;
    throw error;
  }

  await appointmentRepository.deleteAppointment(id);

  return appointment;
};

module.exports = {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
};