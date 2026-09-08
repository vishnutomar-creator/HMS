"use client";

// Initial seed data for Laboratory Orders pipeline
const INITIAL_LAB_ORDERS = [
  {
    id: "LO-9001",
    patientId: "P001",
    patientName: "Aditi Sharma",
    doctor: "Dr. Meera Nair",
    department: "Cardiology",
    testType: "Lipid Profile",
    orderDate: "2026-08-14",
    priority: "Urgent",
    status: "ORDERED", // Stage 1
    notes: "Patient reports mild chest heaviness. Fasting sample requested.",
    sample: null,
    results: null,
    verification: null,
  },
  {
    id: "LO-9002",
    patientId: "P002",
    patientName: "Rohan Verma",
    doctor: "Dr. Nikhil Rao",
    department: "General Medicine",
    testType: "Complete Blood Count (CBC)",
    orderDate: "2026-08-14",
    priority: "Routine",
    status: "SAMPLE_COLLECTED", // Stage 2
    notes: "Evaluate low grade fever and fatigue.",
    sample: {
      sampleId: "SMP-6012",
      specimenType: "EDTA Whole Blood",
      tubeColor: "Lavender Top",
      collectedBy: "Nurse Ritu Desai",
      collectedAt: "2026-08-14 09:30 AM",
      containerId: "BAR-88219",
    },
    results: null,
    verification: null,
  },
  {
    id: "LO-9003",
    patientId: "P003",
    patientName: "Meera Nair",
    doctor: "Dr. Arjun Iyer",
    department: "Neurology",
    testType: "MRI Brain",
    orderDate: "2026-08-13",
    priority: "Routine",
    status: "PROCESSING", // Stage 3
    notes: "Rule out structural lesions.",
    sample: {
      sampleId: "SMP-6015",
      specimenType: "Imaging Scan",
      tubeColor: "N/A",
      collectedBy: "Radiographer Vivek Shah",
      collectedAt: "2026-08-13 02:15 PM",
      containerId: "RAD-9920",
    },
    results: null,
    verification: null,
  },
  {
    id: "LO-9004",
    patientId: "P004",
    patientName: "Karan Malhotra",
    doctor: "Dr. Priya Menon",
    department: "Endocrinology",
    testType: "HbA1c",
    orderDate: "2026-08-12",
    priority: "Routine",
    status: "RESULT_READY", // Stage 4
    notes: "Quarterly diabetic monitor.",
    sample: {
      sampleId: "SMP-6002",
      specimenType: "Venous Blood",
      tubeColor: "Purple Top",
      collectedBy: "Nurse Ritu Desai",
      collectedAt: "2026-08-12 08:45 AM",
      containerId: "BAR-77123",
    },
    results: {
      value: "6.8%",
      normalRange: "4.0 - 5.6%",
      interpretation: "High",
      technician: "Tech. Ramesh Gupta",
      enteredAt: "2026-08-12 11:30 AM",
      parameters: [
        { name: "HbA1c (Glycated Hb)", value: "6.8", unit: "%", reference: "4.0 - 5.6", flag: "High" },
        { name: "Estimated Avg Glucose (eAG)", value: "149", unit: "mg/dL", reference: "70 - 114", flag: "High" }
      ],
      remarks: "Slightly elevated glycated hemoglobin indicating sub-optimal glycemic control."
    },
    verification: null,
  },
  {
    id: "LO-9005",
    patientId: "P001",
    patientName: "Aditi Sharma",
    doctor: "Dr. Meera Nair",
    department: "Cardiology",
    testType: "Complete Blood Count (CBC)",
    orderDate: "2026-08-15",
    priority: "Routine",
    status: "REPORT_RELEASED", // Stage 6
    notes: "Routine pre-admission check.",
    sample: {
      sampleId: "SMP-6001",
      specimenType: "EDTA Whole Blood",
      tubeColor: "Lavender Top",
      collectedBy: "Nurse Ritu Desai",
      collectedAt: "2026-08-15 08:00 AM",
      containerId: "BAR-60012",
    },
    results: {
      value: "WBC: 8.2, RBC: 4.8, Hb: 13.2 g/dL",
      normalRange: "Hb: 12.0 - 15.5 g/dL",
      interpretation: "Normal",
      technician: "Tech. Ramesh Gupta",
      enteredAt: "2026-08-15 10:15 AM",
      parameters: [
        { name: "Hemoglobin (Hb)", value: "13.2", unit: "g/dL", reference: "12.0 - 15.5", flag: "Normal" },
        { name: "White Blood Cells (WBC)", value: "8.2", unit: "10^3/µL", reference: "4.5 - 11.0", flag: "Normal" },
        { name: "Red Blood Cells (RBC)", value: "4.8", unit: "10^6/µL", reference: "3.8 - 5.1", flag: "Normal" },
        { name: "Platelet Count", value: "220", unit: "10^3/µL", reference: "150 - 450", flag: "Normal" },
      ],
      remarks: "All hematological parameters within normal reference limits."
    },
    verification: {
      verifiedBy: "Dr. Nikhil Rao",
      pathologistTitle: "Senior Consultant Pathologist",
      verifiedAt: "2026-08-15 12:45 PM",
      comments: "Verified and signed digitally. Report released to patient record.",
    }
  },
  {
    id: "LO-9006",
    patientId: "P005",
    patientName: "Sneha Patil",
    doctor: "Dr. Divya Kulkarni",
    department: "Dermatology",
    testType: "Allergy Panel",
    orderDate: "2026-08-11",
    priority: "Routine",
    status: "REPORT_RELEASED", // Stage 6
    notes: "Investigate chronic urticaria.",
    sample: {
      sampleId: "SMP-6003",
      specimenType: "Serum",
      tubeColor: "Red Top",
      collectedBy: "Nurse Farah Khan",
      collectedAt: "2026-08-11 10:00 AM",
      containerId: "BAR-55410",
    },
    results: {
      value: "IgE Total: 45 IU/mL (Negative)",
      normalRange: "< 100 IU/mL",
      interpretation: "Normal",
      technician: "Tech. Suresh Kumar",
      enteredAt: "2026-08-11 02:00 PM",
      parameters: [
        { name: "Total IgE", value: "45", unit: "IU/mL", reference: "< 100", flag: "Normal" },
        { name: "Dust Mite Mix", value: "Negative", unit: "-", reference: "Negative", flag: "Normal" },
        { name: "Pollen Mix", value: "Negative", unit: "-", reference: "Negative", flag: "Normal" }
      ],
      remarks: "No specific IgE elevation observed."
    },
    verification: {
      verifiedBy: "Dr. Divya Kulkarni",
      pathologistTitle: "Chief Pathologist",
      verifiedAt: "2026-08-11 04:30 PM",
      comments: "Report verified and released.",
    }
  }
];

const STORAGE_KEY = "medicare_hms_lab_orders_v2";

export function getStoredLabOrders() {
  if (typeof window === "undefined") return INITIAL_LAB_ORDERS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_LAB_ORDERS));
      return INITIAL_LAB_ORDERS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading lab orders from localStorage:", err);
    return INITIAL_LAB_ORDERS;
  }
}

export function saveStoredLabOrders(orders) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    window.dispatchEvent(new Event("medicare_lab_store_updated"));
  } catch (err) {
    console.error("Error saving lab orders to localStorage:", err);
  }
}

export const labStore = {
  getOrders() {
    return getStoredLabOrders();
  },

  getOrderById(id) {
    const orders = getStoredLabOrders();
    return orders.find((o) => o.id === id) || null;
  },

  createOrder(newOrderData) {
    const orders = getStoredLabOrders();
    const newId = `LO-${9000 + orders.length + 1}`;
    const newOrder = {
      id: newId,
      patientId: newOrderData.patientId || `P00${orders.length + 1}`,
      patientName: newOrderData.patientName || newOrderData.patient,
      doctor: newOrderData.doctor || "Dr. Nikhil Rao",
      department: newOrderData.department || "General Medicine",
      testType: newOrderData.testType,
      orderDate: newOrderData.orderDate || new Date().toISOString().split("T")[0],
      priority: newOrderData.priority || "Routine",
      status: "ORDERED", // Pipeline Stage 1
      notes: newOrderData.notes || "",
      sample: null,
      results: null,
      verification: null,
    };

    const updated = [newOrder, ...orders];
    saveStoredLabOrders(updated);
    return newOrder;
  },

  collectSample(orderId, sampleDetails) {
    const orders = getStoredLabOrders();
    const updated = orders.map((o) => {
      if (o.id === orderId) {
        const sampleId = sampleDetails.sampleId || `SMP-${Math.floor(6000 + Math.random() * 1000)}`;
        return {
          ...o,
          status: "SAMPLE_COLLECTED", // Pipeline Stage 2
          sample: {
            sampleId,
            specimenType: sampleDetails.specimenType || "Blood / Serum",
            tubeColor: sampleDetails.tubeColor || "Lavender Top",
            collectedBy: sampleDetails.collectedBy || "Nurse Ritu Desai",
            collectedAt: sampleDetails.collectedAt || new Date().toLocaleString("en-US"),
            containerId: sampleDetails.containerId || `BAR-${Math.floor(10000 + Math.random() * 90000)}`,
            notes: sampleDetails.notes || "",
          },
        };
      }
      return o;
    });

    saveStoredLabOrders(updated);
    return updated.find((o) => o.id === orderId);
  },

  markProcessing(orderId) {
    const orders = getStoredLabOrders();
    const updated = orders.map((o) => {
      if (o.id === orderId) {
        return { ...o, status: "PROCESSING" };
      }
      return o;
    });
    saveStoredLabOrders(updated);
  },

  enterResults(orderId, resultData) {
    const orders = getStoredLabOrders();
    const updated = orders.map((o) => {
      if (o.id === orderId) {
        return {
          ...o,
          status: "RESULT_READY", // Pipeline Stage 4
          results: {
            value: resultData.value || "Completed",
            normalRange: resultData.normalRange || "Standard",
            interpretation: resultData.interpretation || "Normal",
            technician: resultData.technician || "Tech. Ramesh Gupta",
            enteredAt: new Date().toLocaleString("en-US"),
            parameters: resultData.parameters || [
              { name: o.testType, value: resultData.value, unit: "", reference: resultData.normalRange, flag: resultData.interpretation }
            ],
            remarks: resultData.remarks || "",
          },
        };
      }
      return o;
    });

    saveStoredLabOrders(updated);
    return updated.find((o) => o.id === orderId);
  },

  verifyAndReleaseReport(orderId, verificationData) {
    const orders = getStoredLabOrders();
    const updated = orders.map((o) => {
      if (o.id === orderId) {
        return {
          ...o,
          status: "REPORT_RELEASED", // Pipeline Stage 5 & 6: VERIFIED -> REPORT_RELEASED
          verification: {
            verifiedBy: verificationData.verifiedBy || "Dr. Pathologist",
            pathologistTitle: verificationData.pathologistTitle || "Consultant Pathologist",
            verifiedAt: new Date().toLocaleString("en-US"),
            comments: verificationData.comments || "Verified and signed digitally.",
          },
        };
      }
      return o;
    });

    saveStoredLabOrders(updated);
    return updated.find((o) => o.id === orderId);
  },

  getVerifiedReportsForPatient(patientNameOrId) {
    const orders = getStoredLabOrders();
    return orders.filter((o) => {
      const matchPatient =
        o.patientName?.toLowerCase() === patientNameOrId?.toLowerCase() ||
        o.patientId?.toLowerCase() === patientNameOrId?.toLowerCase() ||
        patientNameOrId?.toLowerCase().includes(o.patientName?.toLowerCase());

      const isVerifiedOrReleased =
        o.status === "VERIFIED" || o.status === "REPORT_RELEASED";

      return matchPatient && isVerifiedOrReleased;
    });
  },

  getPendingOrdersForPatient(patientNameOrId) {
    const orders = getStoredLabOrders();
    return orders.filter((o) => {
      const matchPatient =
        o.patientName?.toLowerCase() === patientNameOrId?.toLowerCase() ||
        o.patientId?.toLowerCase() === patientNameOrId?.toLowerCase() ||
        patientNameOrId?.toLowerCase().includes(o.patientName?.toLowerCase());

      const isPending = o.status !== "VERIFIED" && o.status !== "REPORT_RELEASED";

      return matchPatient && isPending;
    });
  }
};
