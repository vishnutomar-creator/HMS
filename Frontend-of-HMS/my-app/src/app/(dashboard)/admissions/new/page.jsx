"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { patientAPI } from "../../../services/api";

const rooms = [
  "ICU-04",
  "ICU-05",
  "GEN-112",
  "GEN-113",
  "PVT-201",
  "SEMI-305",
];

const roomTypes = ["General", "ICU", "Private", "Semi-Private"];

function AdmissionForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const patientNameParam = searchParams.get("patientName");
  const patientIdParam = searchParams.get("patientId");

  const [patientOptions, setPatientOptions] = useState([]);
  const [useCustomName, setUseCustomName] = useState(false);
  const [form, setForm] = useState({
    patient: patientNameParam || "",
    roomNo: rooms[0],
    roomType: roomTypes[0],
    admissionDate: new Date().toISOString().slice(0, 10),
    status: "Admitted",
    reason: patientIdParam ? `IPD Admission for Patient ${patientIdParam}` : "",
  });
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    async function loadPatients() {
      let options = [];
      if (typeof window !== "undefined") {
        try {
          const stored = JSON.parse(localStorage.getItem("hms_local_patients") || "[]");
          stored.forEach((p) => {
            if (p.name && !options.includes(p.name)) options.push(p.name);
          });
        } catch (e) {}
      }

      try {
        const res = await patientAPI.getPatients();
        if (res.success && Array.isArray(res.data)) {
          res.data.forEach((p) => {
            const name = p.name || p.patientName || p.userId?.name;
            if (name && !options.includes(name)) options.push(name);
          });
        }
      } catch (e) {}

      if (patientNameParam && !options.includes(patientNameParam)) {
        options.unshift(patientNameParam);
      }

      setPatientOptions(options);
      if (options.length === 0) {
        setUseCustomName(true);
      } else if (!form.patient) {
        setForm((prev) => ({ ...prev, patient: options[0] }));
      }
    }

    loadPatients();
  }, [patientNameParam]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalPatientName = form.patient.trim() || "Patient";
    const admissionId = `ADM-${Math.floor(1000 + Math.random() * 9000)}`;
    const newAdmissionObj = {
      id: admissionId,
      admissionId,
      patient: finalPatientName,
      roomNo: form.roomNo,
      roomType: form.roomType,
      admissionDate: form.admissionDate,
      dischargeDate: null,
      status: form.status,
      reason: form.reason,
    };

    // Update backend API if patientIdParam is available
    if (patientIdParam) {
      try {
        await patientAPI.updatePatient(patientIdParam, { status: "Admitted" });
      } catch (err) {
        console.warn("Backend update notice:", err.message);
      }
    }

    if (typeof window !== "undefined") {
      try {
        const storedAdmissions = JSON.parse(localStorage.getItem("hms_local_admissions") || "[]");
        localStorage.setItem("hms_local_admissions", JSON.stringify([newAdmissionObj, ...storedAdmissions]));

        const storedPatients = JSON.parse(localStorage.getItem("hms_local_patients") || "[]");
        let patientExists = false;
        const updatedPatients = storedPatients.map((p) => {
          const matchName = (p.name || p.patientName || "").trim().toLowerCase() === finalPatientName.toLowerCase();
          const matchId = patientIdParam && (p.id === patientIdParam || p.patientId === patientIdParam);
          if (matchName || matchId) {
            patientExists = true;
            return { ...p, status: "Admitted" };
          }
          return p;
        });

        // Check if patient exists in options list loaded from API or dropdown
        const existsInOptions = patientOptions.some(
          (optName) => optName.trim().toLowerCase() === finalPatientName.toLowerCase()
        );

        if (!patientExists && !existsInOptions) {
          const newPatientObj = {
            id: `PT-${Math.floor(1000 + Math.random() * 9000)}`,
            name: finalPatientName,
            age: 30,
            gender: "Male",
            phone: "+91 98765 43210",
            email: "patient@example.com",
            department: "General Medicine",
            status: "Admitted",
          };
          updatedPatients.unshift(newPatientObj);
        }

        localStorage.setItem("hms_local_patients", JSON.stringify(updatedPatients));
      } catch (err) {}
    }

    setSuccessMsg(`Admission for ${finalPatientName} created successfully! Redirecting...`);
    setTimeout(() => {
      router.push("/admissions");
    }, 800);
  };

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/admissions"
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
            New IPD Admission
          </h1>
          <p className="mt-1 text-sm text-[#7B8882] dark:text-[#87938E]">
            Admit patient to IPD and assign ward room
          </p>
        </div>
      </div>

      {successMsg && (
        <div className="flex items-center gap-2 rounded-xl bg-[#ECFDF5] p-4 text-sm font-semibold text-[#0F766E]">
          <CheckCircle2 size={18} />
          {successMsg}
        </div>
      )}

      {/* Form Card */}
      <form
        onSubmit={handleSubmit}
        className="
          rounded-2xl border border-[#E5E2D9] bg-white p-6
          dark:border-white/10 dark:bg-[#17201D]
        "
      >
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {/* Patient Selection / Input */}
          <div className="sm:col-span-2">
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">
                Patient Name *
              </label>
              {patientOptions.length > 0 && (
                <button
                  type="button"
                  onClick={() => setUseCustomName((v) => !v)}
                  className="text-[11px] font-semibold text-[#0F766E] underline dark:text-[#5EEAD4]"
                >
                  {useCustomName ? "Select from registered patients" : "+ Enter new patient name"}
                </button>
              )}
            </div>

            {useCustomName || patientOptions.length === 0 ? (
              <input
                required
                type="text"
                name="patient"
                value={form.patient}
                onChange={handleChange}
                placeholder="Enter patient full name"
                className={inputClass}
              />
            ) : (
              <select
                name="patient"
                value={form.patient}
                onChange={handleChange}
                className={inputClass}
              >
                {patientOptions.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Room Type */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">
              Room Type
            </label>
            <select
              name="roomType"
              value={form.roomType}
              onChange={handleChange}
              className={inputClass}
            >
              {roomTypes.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </div>

          {/* Room No */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">
              Room No.
            </label>
            <select
              name="roomNo"
              value={form.roomNo}
              onChange={handleChange}
              className={inputClass}
            >
              {rooms.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </div>

          {/* Admission Date */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">
              Admission Date
            </label>
            <input
              required
              type="date"
              name="admissionDate"
              value={form.admissionDate}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          {/* Status */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">
              Status
            </label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className={inputClass}
            >
              <option>Admitted</option>
              <option>Discharged</option>
              <option>Transferred</option>
            </select>
          </div>

          {/* Reason */}
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">
              Reason for Admission
            </label>
            <textarea
              name="reason"
              value={form.reason}
              onChange={handleChange}
              rows={3}
              placeholder="Diagnosis, symptoms, or referral notes"
              className={inputClass}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex items-center justify-end gap-3 border-t border-[#EEECE5] pt-5 dark:border-white/10">
          <Link
            href="/admissions"
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
              rounded-xl bg-[#0F766E] px-5 py-2.5
              text-sm font-semibold text-white
              transition hover:bg-[#0F766E]/90
            "
          >
            Confirm IPD Admission
          </button>
        </div>
      </form>
    </div>
  );
}

export default function AddAdmissionPage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-[#87938E]">Loading admission form...</div>}>
      <AdmissionForm />
    </Suspense>
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