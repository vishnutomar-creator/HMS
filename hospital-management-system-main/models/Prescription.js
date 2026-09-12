const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    dosage: {
      type: String,
      required: true,
      trim: true,
    },

    frequency: {
      type: String,
      required: true,
      enum: [
        "once_daily",
        "twice_daily",
        "three_times_daily",
        "four_times_daily",
        "as_needed",
      ],
    },

    timing: {
      type: String,
      enum: [
        "before_meal",
        "after_meal",
        "with_meal",
        "anytime",
      ],
      default: "anytime",
    },

    duration: {
      type: String,
      required: true,
    },

    quantity: {
      type: Number,
      default: null,
    },

    instructions: {
      type: String,
      default: "",
    },
  },
  {
    _id: false,
  }
);

const prescriptionSchema = new mongoose.Schema(
  {
    rxId: {
      type: String,
      trim: true,
    },

    // Links to a MedicalRecord — optional but strongly recommended
    recordId: {
      type: String,
      trim: true,
      default: null,
    },

    patientId: {
      type: mongoose.Schema.Types.Mixed,
      required: false,
      default: null,
    },

    patientName: {
      type: String,
      trim: true,
    },

    doctorId: {
      type: mongoose.Schema.Types.Mixed,
      required: false,
      default: null,
    },

    appointmentId: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    diagnosis: {
      type: String,
      trim: true,
      default: "General Consultation",
    },

    symptoms: {
      type: [String],
      default: [],
    },

    // Structured medicines array — single source of truth
    medicines: {
      type: [medicineSchema],
      default: [],
    },

    advice: {
      type: String,
      default: "",
    },

    followUpDate: {
      type: Date,
      default: null,
    },

    status: {
      type: String,
      enum: ["Active", "Completed", "Cancelled"],
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Prescription",
  prescriptionSchema
);