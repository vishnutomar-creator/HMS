const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

const getAuthToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("hms_token");
  }
  return null;
};

async function apiFetch(endpoint, options = {}) {
  const token = getAuthToken();

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || `Request failed with status ${response.status}`);
    error.status = response.status;
    throw error;
  }

  return data;
}

// ==========================================
// 1. AUTH & USER API
// ==========================================
export const authAPI = {
  login: (credentials) =>
    apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),

  register: (userData) =>
    apiFetch("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    }),

  getMe: () => apiFetch("/auth/me"),
};

export const userAPI = {
  getUsers: () => apiFetch("/users"),
  updateProfile: (id, data) =>
    apiFetch(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};

// ==========================================
// 2. DASHBOARD API
// ==========================================
export const dashboardAPI = {
  getDashboard: () => apiFetch("/dashboard"),
};

// ==========================================
// 3. PATIENTS API  (REST — /patients)
// ==========================================
export const patientAPI = {
  getPatients: () => apiFetch("/patients"),
  getPatientById: (id) => apiFetch(`/patients/${id}`),
  createPatient: (data) =>
    apiFetch("/patients", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updatePatient: (id, data) =>
    apiFetch(`/patients/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deletePatient: (id) =>
    apiFetch(`/patients/${id}`, {
      method: "DELETE",
    }),
};

// ==========================================
// 4. DOCTORS API
// ==========================================
export const doctorAPI = {
  getDoctors: () => apiFetch("/doctors"),
  getDoctorById: (id) => apiFetch(`/doctors/${id}`),
  createDoctor: (data) =>
    apiFetch("/doctors", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateDoctor: (id, data) =>
    apiFetch(`/doctors/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteDoctor: (id) =>
    apiFetch(`/doctors/${id}`, {
      method: "DELETE",
    }),
};

// ==========================================
// 5. DEPARTMENTS API
// ==========================================
export const departmentAPI = {
  getDepartments: () => apiFetch("/departments"),
  getDepartmentById: (id) => apiFetch(`/departments/${id}`),
  createDepartment: (data) =>
    apiFetch("/departments", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateDepartment: (id, data) =>
    apiFetch(`/departments/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteDepartment: (id) =>
    apiFetch(`/departments/${id}`, {
      method: "DELETE",
    }),
};

// ==========================================
// 6. APPOINTMENTS API
// ==========================================
export const appointmentAPI = {
  getAppointments: () => apiFetch("/appointments"),
  getAppointmentById: (id) => apiFetch(`/appointments/${id}`),
  createAppointment: (data) =>
    apiFetch("/appointments", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateAppointment: (id, data) =>
    apiFetch(`/appointments/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  cancelAppointment: (id, reason = "") =>
    apiFetch(`/appointments/${id}`, {
      method: "PUT",
      body: JSON.stringify({ status: "cancelled", cancellationReason: reason }),
    }),
  deleteAppointment: (id) =>
    apiFetch(`/appointments/${id}`, {
      method: "DELETE",
    }),
};

// ==========================================
// 7. MEDICAL RECORDS API
// ==========================================
export const medicalRecordAPI = {
  getMedicalRecords: () => apiFetch("/medical-records"),
  getMedicalRecordById: (id) => apiFetch(`/medical-records/${id}`),
  getMedicalRecordsByPatient: (patientId) => apiFetch(`/medical-records/patient/${patientId}`),
  getMedicalRecordsByDoctor: (doctorId) => apiFetch(`/medical-records/doctor/${doctorId}`),
  createMedicalRecord: (data) =>
    apiFetch("/medical-records", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateMedicalRecord: (id, data) =>
    apiFetch(`/medical-records/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteMedicalRecord: (id) =>
    apiFetch(`/medical-records/${id}`, {
      method: "DELETE",
    }),
};

// ==========================================
// 8. PRESCRIPTIONS API
// ==========================================
export const prescriptionAPI = {
  getPrescriptions: () => apiFetch("/prescriptions"),
  getPrescriptionById: (id) => apiFetch(`/prescriptions/${id}`),
  getPrescriptionsByPatient: (patientId) => apiFetch(`/prescriptions/patient/${patientId}`),
  getPrescriptionsByDoctor: (doctorId) => apiFetch(`/prescriptions/doctor/${doctorId}`),
  createPrescription: (data) =>
    apiFetch("/prescriptions", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updatePrescription: (id, data) =>
    apiFetch(`/prescriptions/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deletePrescription: (id) =>
    apiFetch(`/prescriptions/${id}`, {
      method: "DELETE",
    }),
};

// ==========================================
// 9. BILLING API  (/billings — plural)
// ==========================================
export const billingAPI = {
  getBillings: () => apiFetch("/billings"),
  getBillingById: (id) => apiFetch(`/billings/${id}`),
  createBilling: (data) =>
    apiFetch("/billings", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateBilling: (id, data) =>
    apiFetch(`/billings/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteBilling: (id) =>
    apiFetch(`/billings/${id}`, {
      method: "DELETE",
    }),
};

// ==========================================
// 10. PAYMENTS API
// ==========================================
export const paymentAPI = {
  getPayments: () => apiFetch("/payments"),
  getPaymentById: (id) => apiFetch(`/payments/${id}`),
  createPayment: (data) =>
    apiFetch("/payments", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updatePayment: (id, data) =>
    apiFetch(`/payments/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deletePayment: (id) =>
    apiFetch(`/payments/${id}`, {
      method: "DELETE",
    }),
};

// ==========================================
// 11. NOTIFICATIONS API
// ==========================================
export const notificationAPI = {
  getNotifications: () => apiFetch("/notifications"),
  markAsRead: (id) =>
    apiFetch(`/notifications/${id}/read`, {
      method: "PUT",
    }),
  markAllAsRead: () =>
    apiFetch("/notifications/read-all", {
      method: "PUT",
    }),
};

// ==========================================
// 12. AUDIT LOGS API
// ==========================================
export const auditAPI = {
  getLogs: () => apiFetch("/audit-logs"),
};
