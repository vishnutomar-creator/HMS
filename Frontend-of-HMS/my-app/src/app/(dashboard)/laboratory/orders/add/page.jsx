"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus } from "lucide-react";
import { labStore } from "../../../../services/labStore";

const patients = [
  { name: "Aditi Sharma", id: "P001" },
  { name: "Rohan Verma", id: "P002" },
  { name: "Meera Nair", id: "P003" },
  { name: "Karan Malhotra", id: "P004" },
  { name: "Sneha Patil", id: "P005" },
];

const doctors = [
  "Dr. Nikhil Rao",
  "Dr. Meera Nair",
  "Dr. Arjun Iyer",
  "Dr. Priya Menon",
  "Dr. Divya Kulkarni",
];

const testTypes = [
  "Lipid Profile",
  "HbA1c",
  "Complete Blood Count (CBC)",
  "Liver Function Test (LFT)",
  "Kidney Function Test (KFT)",
  "Thyroid Profile (T3, T4, TSH)",
  "X-Ray Knee (Left)",
  "MRI Brain",
  "Allergy Panel",
];

export default function AddLabOrderPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    patient: patients[0].name,
    doctor: doctors[0],
    testType: testTypes[0],
    orderDate: new Date().toISOString().split("T")[0],
    priority: "Routine",
    notes: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const selPatient = patients.find((p) => p.name === form.patient) || patients[0];

    labStore.createOrder({
      patientName: selPatient.name,
      patientId: selPatient.id,
      doctor: form.doctor,
      testType: form.testType,
      orderDate: form.orderDate,
      priority: form.priority,
      notes: form.notes,
    });

    router.push("/laboratory/orders");
  };

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/laboratory/orders"
          className="
            flex h-10 w-10 items-center justify-center
            rounded-xl border border-[#DDD9CE] text-[#52615B]
            transition hover:border-[#0F766E] hover:bg-[#E7F5F2] hover:text-[#0F766E]
            dark:border-white/10 dark:text-[#AAB6B0] dark:hover:bg-[#0F766E]/20
          "
        >
          <ArrowLeft size={18} />
        </Link>

        <div>
          <h1 className="text-xl font-bold text-[#17201D] dark:text-white">
            New Diagnostic Lab Order
          </h1>
          <p className="mt-1 text-sm text-[#7B8882] dark:text-[#87938E]">
            Create a lab test request. Order will start at Stage 1: <strong className="text-amber-600 dark:text-amber-400">ORDERED</strong>.
          </p>
        </div>
      </div>

      {/* Form Card */}
      <form
        onSubmit={handleSubmit}
        className="
          rounded-2xl border border-[#E5E2D9] bg-white p-6
          dark:border-white/10 dark:bg-[#17201D]
        "
      >
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {/* Patient */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">
              Patient Name
            </label>
            <select
              name="patient"
              value={form.patient}
              onChange={handleChange}
              className={inputClass}
            >
              {patients.map((p) => (
                <option key={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          {/* Doctor */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">
              Ordering Physician
            </label>
            <select
              name="doctor"
              value={form.doctor}
              onChange={handleChange}
              className={inputClass}
            >
              {doctors.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Test Type */}
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">
              Diagnostic Test Category / Type
            </label>
            <select
              name="testType"
              value={form.testType}
              onChange={handleChange}
              className={inputClass}
            >
              {testTypes.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Order Date */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">
              Order Date
            </label>
            <input
              required
              type="date"
              name="orderDate"
              value={form.orderDate}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          {/* Priority */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">
              Priority Level
            </label>
            <select
              name="priority"
              value={form.priority}
              onChange={handleChange}
              className={inputClass}
            >
              <option>Routine</option>
              <option>Urgent</option>
              <option>STAT Emergency</option>
            </select>
          </div>

          {/* Notes */}
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">
              Clinical Notes & Instructions
            </label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={3}
              placeholder="Fasting requirements, clinical indications, or special handling instructions..."
              className={inputClass}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex items-center justify-end gap-3 border-t border-[#EEECE5] pt-5 dark:border-white/10">
          <Link
            href="/laboratory/orders"
            className="
              rounded-xl px-4 py-2.5 text-sm font-semibold
              text-[#52615B] transition hover:bg-[#F1F3EF]
              dark:text-[#AAB6B0] dark:hover:bg-white/10
            "
          >
            Cancel
          </Link>

          <button
            type="submit"
            className="
              flex items-center gap-2 rounded-xl bg-[#0F766E] px-5 py-2.5
              text-sm font-semibold text-white
              transition hover:bg-[#0F766E]/90 shadow-sm
            "
          >
            <Plus size={16} />
            Create Order
          </button>
        </div>
      </form>
    </div>
  );
}

const inputClass = `
  w-full rounded-xl border border-[#E3E0D7]
  bg-[#FAFAF7] px-4 py-2.5 text-sm
  text-[#17201D] outline-none
  placeholder:text-[#9AA49F]
  focus:border-[#0F766E] focus:ring-4 focus:ring-[#0F766E]/10
  dark:border-white/10 dark:bg-[#202B27] dark:text-white
  dark:placeholder:text-[#71817B]
`;
