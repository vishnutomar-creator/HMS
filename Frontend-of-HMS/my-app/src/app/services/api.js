const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

const getAuthToken = () => {
  if (typeof window !== "undefined") {
    return (
      localStorage.getItem("hms_token") ||
      localStorage.getItem("token") ||
      localStorage.getItem("accessToken")
    );
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

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }

    return data;
  } catch (error) {
    console.warn(`API Error [${endpoint}]:`, error.message);
    throw error;
  }
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
  getUsers: () => apiFetch("/auth/users"),
  updateProfile: (data) =>
    apiFetch("/auth/profile", {
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
// 3. PATIENTS API
// ==========================================
export const patientAPI = {
  getPatients: () => apiFetch("/patients/getpatients"),
  getPatientById: (id) => apiFetch(`/patients/getpatientby/${id}`),
  createPatient: (data) =>
    apiFetch("/patients/createpatient", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updatePatient: (id, data) =>
    apiFetch(`/patients/updatepatientby/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deletePatient: (id) =>
    apiFetch(`/patients/deletepatientby/${id}`, {
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
// 9. BILLING API
// ==========================================
export const billingAPI = {
  getBills: () => apiFetch("/billing"),
  getBillings: () => apiFetch("/billing"), // alias
  getBillById: (id) => apiFetch(`/billing/${id}`),
  createBill: (data) =>
    apiFetch("/billing", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  createBilling: (data) =>
    apiFetch("/billing", {
      method: "POST",
      body: JSON.stringify(data),
    }), // alias
  updateBill: (id, data) =>
    apiFetch(`/billing/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteBill: (id) =>
    apiFetch(`/billing/${id}`, {
      method: "DELETE",
    }),
  deleteBilling: (id) =>
    apiFetch(`/billing/${id}`, {
      method: "DELETE",
    }), // alias
};

// ==========================================
// 10. PAYMENTS API
// ==========================================
export const paymentAPI = {
  getPayments: () => apiFetch("/payments"),
  getPaymentById: (id) => apiFetch(`/payments/${id}`),
  getPayment: (id) => apiFetch(`/payments/${id}`), // alias
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
export const auditLogAPI = {
  getLogs: () => apiFetch("/audit-logs"),
};

export const auditAPI = auditLogAPI;
