"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  Building2,
  MapPin,
  BedDouble,
  Edit,
  CheckCircle2,
  Hash,
  Heart,
  Droplets,
  Calendar,
  FileText,
  Pill,
  FlaskConical,
  Activity,
  Ambulance,
  AlertTriangle,
  Clock,
  ChevronRight,
  Stethoscope,
  ThumbsUp,
  MoreHorizontal,
  Download,
  Printer,
  Eye,
  ShieldCheck,
} from "lucide-react";
import { patientAPI } from "../../../services/api";
import { labStore } from "../../../services/labStore";
import LabReportModal from "../../../components/laboratory/LabReportModal";




// ---------------------------------------------------------------------------
// Shared Styles
// ---------------------------------------------------------------------------
const statusStyles = {
  Admitted:   "bg-[#0F766E]/10 text-[#0F766E] dark:bg-[#0F766E]/20 dark:text-[#5EEAD4]",
  Discharged: "bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-gray-300",
  Outpatient: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
};

// ---------------------------------------------------------------------------
// Patient History Placeholder Data
// In production, these would be fetched from their respective module APIs.
// ---------------------------------------------------------------------------
function buildHistory(patientId) {
  return {
    visits: [
      {
        id: "V001",
        date: "2026-08-14",
        type: "OPD",
        doctor: "Dr. Meera Nair",
        department: "Cardiology",
        chief: "Chest pain, shortness of breath",
        diagnosis: "Hypertensive Heart Disease",
        outcome: "Follow-up in 2 weeks",
      },
      {
        id: "V002",
        date: "2026-06-02",
        type: "OPD",
        doctor: "Dr. Rajan Kumar",
        department: "General Medicine",
        chief: "Fever, body ache",
        diagnosis: "Viral Fever",
        outcome: "Prescribed rest and fluids",
      },
      {
        id: "V003",
        date: "2026-03-19",
        type: "Emergency",
        doctor: "Dr. Priya Singh",
        department: "Emergency",
        chief: "Severe abdominal pain",
        diagnosis: "Acute Gastritis",
        outcome: "Admitted for 2 days, discharged",
      },
    ],
    diagnoses: [
      {
        id: "D001",
        date: "2026-08-14",
        code: "I11.0",
        name: "Hypertensive Heart Disease",
        doctor: "Dr. Meera Nair",
        severity: "Moderate",
      },
      {
        id: "D002",
        date: "2026-06-02",
        code: "B34.9",
        name: "Viral Infection, unspecified",
        doctor: "Dr. Rajan Kumar",
        severity: "Mild",
      },
      {
        id: "D003",
        date: "2026-03-19",
        code: "K29.7",
        name: "Acute Gastritis",
        doctor: "Dr. Priya Singh",
        severity: "Moderate",
      },
    ],
    prescriptions: [
      {
        id: "RX001",
        date: "2026-08-14",
        doctor: "Dr. Meera Nair",
        drugs: ["Amlodipine 5mg OD", "Aspirin 75mg OD", "Atenolol 50mg BD"],
        duration: "30 days",
        status: "Active",
      },
      {
        id: "RX002",
        date: "2026-06-02",
        doctor: "Dr. Rajan Kumar",
        drugs: ["Paracetamol 500mg TDS", "Cetirizine 10mg OD"],
        duration: "5 days",
        status: "Completed",
      },
    ],
    labReports: [
      {
        id: "LB001",
        date: "2026-08-15",
        test: "Complete Blood Count (CBC)",
        orderedBy: "Dr. Meera Nair",
        status: "Completed",
        result: "WBC: 8.2, RBC: 4.8, Hb: 13.2, Platelets: 220k",
        flags: "Normal",
      },
      {
        id: "LB002",
        date: "2026-08-15",
        test: "Lipid Profile",
        orderedBy: "Dr. Meera Nair",
        status: "Completed",
        result: "Total Chol: 218, LDL: 142, HDL: 38, TG: 190",
        flags: "High LDL",
      },
      {
        id: "LB003",
        date: "2026-06-03",
        test: "Dengue NS1 Antigen",
        orderedBy: "Dr. Rajan Kumar",
        status: "Completed",
        result: "Negative",
        flags: "Normal",
      },
    ],
    admissions: [
      {
        id: "ADM001",
        admitDate: "2026-03-19",
        dischargeDate: "2026-03-21",
        ward: "General Ward B",
        bed: "B-12",
        reason: "Acute Gastritis",
        doctor: "Dr. Priya Singh",
        duration: "2 days",
        status: "Discharged",
      },
    ],
    allergies: [
      { substance: "Penicillin", reaction: "Anaphylaxis", severity: "Severe", noted: "2024-01-10" },
      { substance: "Shellfish", reaction: "Hives, swelling", severity: "Moderate", noted: "2023-05-22" },
      { substance: "Aspirin", reaction: "GI upset", severity: "Mild", noted: "2026-06-02" },
    ],
  };
}

// ---------------------------------------------------------------------------
// Section wrapper
// ---------------------------------------------------------------------------
function HistorySection({ icon: Icon, title, count, children, color = "#0F766E" }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="rounded-2xl border border-[#E5E2D9] bg-white dark:border-white/10 dark:bg-[#17201D]">
      <button
        onClick={() => setCollapsed((v) => !v)}
        className="flex w-full items-center justify-between px-6 py-4"
      >
        <div className="flex items-center gap-3">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-xl"
            style={{ backgroundColor: color + "18" }}
          >
            <Icon size={18} style={{ color }} />
          </div>
          <div className="text-left">
            <p className="text-sm font-bold text-[#17201D] dark:text-white">{title}</p>
          </div>
          <span className="rounded-full bg-[#F1F3EF] px-2 py-0.5 text-[10px] font-black text-[#52615B] dark:bg-white/10 dark:text-[#AAB6B0]">
            {count}
          </span>
        </div>
        <ChevronRight
          size={16}
          className={`text-[#87938E] transition-transform ${collapsed ? "" : "rotate-90"}`}
        />
      </button>

      {!collapsed && (
        <div className="border-t border-[#EEECE5] dark:border-white/10">
          {children}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function PatientDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [patient,  setPatient]  = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [tab,      setTab]      = useState("overview"); // "overview" | "history"
  const [selectedReportOrder, setSelectedReportOrder] = useState(null);


  useEffect(() => {
    async function loadPatient() {
      if (!params?.id) return;

      // Try localStorage first
      let foundLocal = null;
      try {
        const stored = JSON.parse(localStorage.getItem("hms_local_patients") || "[]");
        foundLocal = stored.find(
          (p) => p.id === params.id || p.uhid === params.id || p._id === params.id
        );
      } catch { /* ignore */ }

      try {
        const res = await patientAPI.getPatientById(params.id);
        if (res.success && res.data) {
          const d = res.data;
          setPatient({
            id:          d.uhid || d.patientId || d._id || params.id,
            uhid:        d.uhid || d.patientId || d._id || params.id,
            name:        d.name || d.patientName || "Patient",
            age:         d.age || 30,
            dob:         d.dob || "",
            gender:      d.gender || "Male",
            phone:       d.phone || "+91 98765 43210",
            email:       d.email || "patient@example.com",
            bloodGroup:  d.bloodGroup || "",
            department:  d.department || "General Medicine",
            status:      d.status || "Outpatient",
            address:     d.address || "Not provided",
            allergies:   d.allergies || "",
            emergencyContact: d.emergencyContact || null,
            registeredAt: d.registeredAt || "",
          });
        } else if (foundLocal) {
          setPatient(foundLocal);
        }
      } catch {
        if (foundLocal) {
          setPatient(foundLocal);
        } else {
          // Demo fallback
          setPatient({
            id:          params.id,
            uhid:        params.id,
            name:        "Aditi Sharma",
            age:         34,
            dob:         "1992-03-15",
            gender:      "Female",
            phone:       "+91 98765 43210",
            email:       "aditi.sharma@example.com",
            bloodGroup:  "B+",
            department:  "Cardiology",
            status:      "Outpatient",
            address:     "House 42, Civil Lines, Sector 5, New Delhi — 110001",
            allergies:   "Penicillin, Shellfish",
            emergencyContact: { name: "Rohan Sharma", phone: "+91 98765 11111", relation: "Spouse" },
            registeredAt: "2024-01-10T09:00:00Z",
          });
        }
      } finally {
        setLoading(false);
      }
    }
    loadPatient();
  }, [params]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-sm font-semibold text-[#87938E]">
        Loading patient profile…
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="p-6 text-center text-sm font-semibold text-[#87938E]">
        Patient record not found.
      </div>
    );
  }

  const history = buildHistory(patient.id);
  const initials = patient.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="space-y-6">

      {/* ── Page Header ─────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/patients"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#DDD9CE] text-[#52615B] transition hover:bg-[#E7F5F2] hover:text-[#0F766E] dark:border-white/10 dark:text-[#AAB6B0]"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-[#17201D] dark:text-white">
              Patient Record
            </h1>
            <p className="text-xs text-[#7B8882] dark:text-[#87938E]">
              Full clinical profile and visit history
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 rounded-xl border border-[#DDD9CE] px-3 py-2 text-xs font-semibold text-[#52615B] transition hover:bg-[#F1F3EF] dark:border-white/10 dark:text-[#AAB6B0]">
            <Printer size={15} />
            <span className="hidden sm:inline">Print</span>
          </button>
          <button className="flex items-center gap-2 rounded-xl border border-[#DDD9CE] px-3 py-2 text-xs font-semibold text-[#52615B] transition hover:bg-[#F1F3EF] dark:border-white/10 dark:text-[#AAB6B0]">
            <Download size={15} />
            <span className="hidden sm:inline">Export</span>
          </button>

          {patient.status !== "Admitted" && (
            <button
              onClick={() =>
                router.push(`/admissions/new?patientName=${encodeURIComponent(patient.name)}&patientId=${patient.id}`)
              }
              className="flex items-center gap-2 rounded-xl border border-[#0F766E] bg-[#E7F5F2] px-4 py-2 text-sm font-bold text-[#0F766E] transition hover:bg-[#0F766E] hover:text-white dark:border-[#5EEAD4] dark:bg-[#0F766E]/20 dark:text-[#5EEAD4]"
            >
              <BedDouble size={16} />
              Admit to IPD
            </button>
          )}

          <Link
            href={`/patients/${patient.id}/edit`}
            className="flex items-center gap-2 rounded-xl bg-[#0F766E] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#0B625C]"
          >
            <Edit size={16} />
            Edit Record
          </Link>
        </div>
      </div>

      {/* ── Hero Card ───────────────────────────────────────────── */}
      <div className="rounded-2xl border border-[#E5E2D9] bg-white shadow-sm dark:border-white/10 dark:bg-[#17201D]">

        {/* Top strip */}
        <div className="flex flex-col gap-6 border-b border-[#EEECE5] p-6 sm:flex-row sm:items-center dark:border-white/10">

          {/* Avatar + name */}
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0F766E]/10 text-xl font-black text-[#0F766E] dark:bg-[#0F766E]/20 dark:text-[#5EEAD4]">
              {initials}
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#17201D] dark:text-white">{patient.name}</h2>
              <p className="mt-0.5 text-sm text-[#7B8882] dark:text-[#87938E]">
                {patient.age} yrs · {patient.gender}
                {patient.dob && <> · DOB: {new Date(patient.dob).toLocaleDateString("en-IN")}</>}
              </p>
              <div className="mt-1.5 flex items-center gap-2">
                <span className={`rounded-full px-3 py-0.5 text-xs font-bold ${statusStyles[patient.status] || ""}`}>
                  ● {patient.status}
                </span>
                {patient.bloodGroup && (
                  <span className="rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-bold text-red-600 dark:bg-red-500/10 dark:text-red-400">
                    <Droplets size={10} className="mr-0.5 inline" />
                    {patient.bloodGroup}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* UHID Hero — the centerpiece */}
          <div className="sm:ml-auto">
            <div className="rounded-2xl border-2 border-dashed border-[#0F766E]/30 bg-[#E7F5F2] px-5 py-4 text-center dark:bg-[#0F766E]/10">
              <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-[#0F766E]/60 dark:text-[#5EEAD4]/60">
                Unique Hospital ID (UHID)
              </p>
              <div className="flex items-center justify-center gap-2">
                <Hash size={18} className="text-[#0F766E] dark:text-[#5EEAD4]" />
                <p className="font-mono text-2xl font-black tracking-wider text-[#0F766E] dark:text-[#5EEAD4]">
                  {patient.uhid || patient.id}
                </p>
              </div>
              <p className="mt-1 text-[10px] text-[#7B8882] dark:text-[#87938E]">
                Quote this ID at every visit
              </p>
            </div>
          </div>
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-1 gap-0 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Phone,     label: "Mobile",      value: patient.phone },
            { icon: Mail,      label: "Email",        value: patient.email },
            { icon: Building2, label: "Department",   value: patient.department },
            { icon: MapPin,    label: "Address",      value: patient.address },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-3 border-r border-b border-[#EEECE5] p-5 last:border-r-0 dark:border-white/10">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#FAFAF7] text-[#52615B] dark:bg-[#202B27] dark:text-[#AAB6B0]">
                <Icon size={17} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#87938E]">{label}</p>
                <p className="truncate text-sm font-semibold text-[#17201D] dark:text-white">{value || "—"}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Emergency contact + registered */}
        <div className="flex flex-col gap-4 border-t border-[#EEECE5] px-6 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-white/10">
          {patient.emergencyContact?.name && (
            <div className="flex items-center gap-2 text-xs text-[#52615B] dark:text-[#AAB6B0]">
              <Heart size={13} className="text-red-500" />
              <span className="font-semibold">Emergency:</span>
              <span>{patient.emergencyContact.name}</span>
              <span className="text-[#C5C9C6]">·</span>
              <span>{patient.emergencyContact.phone}</span>
              <span className="rounded-full bg-red-50 px-1.5 py-0.5 text-[10px] text-red-500 dark:bg-red-500/10">
                {patient.emergencyContact.relation}
              </span>
            </div>
          )}
          {patient.registeredAt && (
            <div className="flex items-center gap-1.5 text-xs text-[#87938E]">
              <Calendar size={12} />
              Registered: {new Date(patient.registeredAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
            </div>
          )}
        </div>
      </div>

      {/* ── Tab Navigation ──────────────────────────────────────── */}
      <div className="flex gap-1 rounded-2xl border border-[#E5E2D9] bg-white p-1.5 dark:border-white/10 dark:bg-[#17201D]">
        {[
          { key: "overview", label: "Overview",       icon: User },
          { key: "history",  label: "Patient History", icon: Clock },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
              tab === key
                ? "bg-[#0F766E] text-white shadow-sm"
                : "text-[#52615B] hover:bg-[#F1F3EF] dark:text-[#AAB6B0] dark:hover:bg-white/[0.06]"
            }`}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      {/* ── Overview Tab ────────────────────────────────────────── */}
      {tab === "overview" && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Quick stats */}
          {[
            { label: "Total Visits",        value: history.visits.length,        icon: Calendar,  color: "#2563EB" },
            { label: "Diagnoses",           value: history.diagnoses.length,     icon: Stethoscope, color: "#7C3AED" },
            { label: "Active Prescriptions",value: history.prescriptions.filter(r => r.status === "Active").length, icon: Pill, color: "#0F766E" },
            { label: "Lab Reports",         value: history.labReports.length,    icon: FlaskConical, color: "#059669" },
            { label: "Admissions",          value: history.admissions.length,    icon: Ambulance, color: "#EA580C" },
            { label: "Known Allergies",     value: history.allergies.length,     icon: AlertTriangle, color: "#D95C4F" },
          ].map(({ label, value, icon: Icon, color }) => (
            <div
              key={label}
              className="flex items-center gap-4 rounded-2xl border border-[#E5E2D9] bg-white p-5 dark:border-white/10 dark:bg-[#17201D]"
            >
              <div
                className="flex h-11 w-11 items-center justify-center rounded-xl"
                style={{ backgroundColor: color + "18" }}
              >
                <Icon size={20} style={{ color }} />
              </div>
              <div>
                <p className="text-2xl font-black text-[#17201D] dark:text-white">{value}</p>
                <p className="text-xs font-semibold text-[#87938E]">{label}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── History Tab ─────────────────────────────────────────── */}
      {tab === "history" && (
        <div className="space-y-4">

          {/* Allergies — always at top, critical safety info */}
          <HistorySection
            icon={AlertTriangle}
            title="Known Allergies"
            count={history.allergies.length}
            color="#D95C4F"
          >
            <div className="divide-y divide-[#EEECE5] dark:divide-white/10">
              {history.allergies.length === 0 ? (
                <p className="px-6 py-4 text-sm text-[#87938E]">No known allergies recorded.</p>
              ) : (
                history.allergies.map((a, i) => (
                  <div key={i} className="flex items-center gap-4 px-6 py-4">
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${
                      a.severity === "Severe" ? "bg-red-100 dark:bg-red-500/10" :
                      a.severity === "Moderate" ? "bg-orange-100 dark:bg-orange-500/10" :
                      "bg-yellow-100 dark:bg-yellow-500/10"
                    }`}>
                      <AlertTriangle size={15} className={
                        a.severity === "Severe" ? "text-red-600" :
                        a.severity === "Moderate" ? "text-orange-600" : "text-yellow-600"
                      } />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-[#17201D] dark:text-white">{a.substance}</p>
                      <p className="text-xs text-[#87938E]">Reaction: {a.reaction}</p>
                    </div>
                    <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                      a.severity === "Severe"   ? "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400" :
                      a.severity === "Moderate" ? "bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400" :
                      "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400"
                    }`}>
                      {a.severity}
                    </span>
                  </div>
                ))
              )}
            </div>
          </HistorySection>

          {/* Previous Visits */}
          <HistorySection
            icon={Calendar}
            title="Previous Visits"
            count={history.visits.length}
            color="#2563EB"
          >
            <div className="divide-y divide-[#EEECE5] dark:divide-white/10">
              {history.visits.map((v) => (
                <div key={v.id} className="px-6 py-4">
                  <div className="mb-1 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        v.type === "Emergency" ? "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400" : "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400"
                      }`}>
                        {v.type}
                      </span>
                      <span className="text-xs text-[#87938E]">{new Date(v.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                    </div>
                    <span className="text-[10px] font-mono text-[#87938E]">{v.id}</span>
                  </div>
                  <p className="text-sm font-bold text-[#17201D] dark:text-white">{v.diagnosis}</p>
                  <p className="mt-0.5 text-xs text-[#87938E]">Chief complaint: {v.chief}</p>
                  <div className="mt-2 flex items-center gap-3 text-xs text-[#52615B] dark:text-[#AAB6B0]">
                    <span className="flex items-center gap-1"><Stethoscope size={11} />{v.doctor}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1"><Building2 size={11} />{v.department}</span>
                  </div>
                  <p className="mt-1 text-xs text-[#7B8882]">Outcome: {v.outcome}</p>
                </div>
              ))}
            </div>
          </HistorySection>

          {/* Diagnoses */}
          <HistorySection
            icon={Stethoscope}
            title="Diagnosis History"
            count={history.diagnoses.length}
            color="#7C3AED"
          >
            <div className="divide-y divide-[#EEECE5] dark:divide-white/10">
              {history.diagnoses.map((d) => (
                <div key={d.id} className="flex items-center gap-4 px-6 py-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-500/10">
                    <Stethoscope size={16} className="text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-[#17201D] dark:text-white">{d.name}</p>
                      <span className="rounded bg-[#F1F3EF] px-1.5 py-0.5 font-mono text-[10px] text-[#52615B] dark:bg-white/10 dark:text-[#AAB6B0]">
                        {d.code}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-[#87938E]">{d.doctor} · {new Date(d.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                  </div>
                  <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                    d.severity === "Severe"   ? "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400" :
                    d.severity === "Moderate" ? "bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400" :
                    "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400"
                  }`}>
                    {d.severity}
                  </span>
                </div>
              ))}
            </div>
          </HistorySection>

          {/* Prescriptions */}
          <HistorySection
            icon={Pill}
            title="Prescription History"
            count={history.prescriptions.length}
            color="#0F766E"
          >
            <div className="divide-y divide-[#EEECE5] dark:divide-white/10">
              {history.prescriptions.map((rx) => (
                <div key={rx.id} className="px-6 py-4">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        rx.status === "Active"
                          ? "bg-[#0F766E]/10 text-[#0F766E] dark:bg-[#0F766E]/20 dark:text-[#5EEAD4]"
                          : "bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-gray-400"
                      }`}>
                        {rx.status}
                      </span>
                      <span className="text-xs font-mono text-[#87938E]">{rx.id}</span>
                    </div>
                    <span className="text-xs text-[#87938E]">{new Date(rx.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {rx.drugs.map((drug, i) => (
                      <span
                        key={i}
                        className="flex items-center gap-1 rounded-lg bg-[#FAFAF7] px-3 py-1.5 text-xs font-semibold text-[#52615B] dark:bg-[#202B27] dark:text-[#AAB6B0]"
                      >
                        <Pill size={10} className="text-[#0F766E]" />
                        {drug}
                      </span>
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-[#87938E]">{rx.doctor} · Duration: {rx.duration}</p>
                </div>
              ))}
            </div>
          </HistorySection>

          {/* Lab Reports — Showing strictly VERIFIED & REPORT_RELEASED reports */}
          {(() => {
            const verifiedStoreReports = labStore.getVerifiedReportsForPatient(patient.name);
            const pendingStoreOrders = labStore.getPendingOrdersForPatient(patient.name);

            // Combine store verified reports with legacy static verified reports if any
            const displayReports = [
              ...verifiedStoreReports,
              ...(verifiedStoreReports.length === 0
                ? history.labReports.map((lb, idx) => ({
                    id: lb.id || `LO-HIST-${idx}`,
                    testType: lb.test,
                    patientName: patient.name,
                    patientId: patient.id,
                    doctor: lb.orderedBy,
                    department: "Laboratory",
                    orderDate: lb.date,
                    status: "REPORT_RELEASED",
                    results: {
                      value: lb.result,
                      normalRange: "Standard Reference",
                      interpretation: lb.flags || "Normal",
                      technician: "Tech. Ramesh Gupta",
                      enteredAt: lb.date,
                    },
                    verification: {
                      verifiedBy: "Dr. Nikhil Rao",
                      pathologistTitle: "Consultant Pathologist",
                      verifiedAt: lb.date,
                      comments: "Verified report.",
                    },
                  }))
                : [])
            ];

            return (
              <HistorySection
                icon={FlaskConical}
                title="Lab Reports (Verified Only)"
                count={displayReports.length}
                color="#059669"
              >
                <div className="divide-y divide-[#EEECE5] dark:divide-white/10">
                  {/* Notice for In-Progress Orders */}
                  {pendingStoreOrders.length > 0 && (
                    <div className="flex items-center justify-between bg-amber-50 p-4 text-xs dark:bg-amber-500/10">
                      <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-semibold">
                        <Clock size={16} />
                        <span>
                          {pendingStoreOrders.length} Lab Order(s) currently in progress ({pendingStoreOrders.map(p => p.testType).join(", ")}).
                        </span>
                      </div>
                      <span className="rounded bg-amber-200/80 px-2 py-0.5 font-bold text-amber-900 text-[10px] dark:bg-amber-500/30 dark:text-amber-200">
                        Raw results hidden until Pathologist Verification
                      </span>
                    </div>
                  )}

                  {displayReports.length === 0 ? (
                    <p className="px-6 py-4 text-sm text-[#87938E]">
                      No verified lab reports available.
                    </p>
                  ) : (
                    displayReports.map((lb) => (
                      <div key={lb.id} className="flex items-start gap-4 px-6 py-4">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-500/10">
                          <ShieldCheck size={18} className="text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-bold text-[#17201D] dark:text-white">
                                {lb.testType || lb.test}
                              </p>
                              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300">
                                <CheckCircle2 size={11} /> VERIFIED & RELEASED
                              </span>
                            </div>
                            <button
                              onClick={() => setSelectedReportOrder(lb)}
                              className="flex items-center gap-1 text-xs font-bold text-[#0F766E] hover:underline dark:text-[#5EEAD4]"
                            >
                              <Eye size={14} />
                              View Full Report
                            </button>
                          </div>
                          <p className="mt-0.5 text-xs text-[#87938E]">
                            Ordered by {lb.doctor || lb.orderedBy} · Verified by {lb.verification?.verifiedBy || "Pathologist"} on {lb.verification?.verifiedAt || lb.orderDate || lb.date}
                          </p>
                          <div className="mt-2 flex items-center justify-between rounded-lg bg-[#FAFAF7] px-3 py-2 text-xs dark:bg-[#202B27]">
                            <span className="font-mono text-[#17201D] dark:text-white font-bold">
                              Result: {lb.results?.value || lb.result}
                            </span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              lb.results?.interpretation === "High" ? "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300" : "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
                            }`}>
                              {lb.results?.interpretation || lb.flags || "Normal"}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </HistorySection>
            );
          })()}

          {/* Admission History */}
          <HistorySection
            icon={Ambulance}
            title="Admission History"
            count={history.admissions.length}
            color="#EA580C"
          >
            <div className="divide-y divide-[#EEECE5] dark:divide-white/10">
              {history.admissions.length === 0 ? (
                <p className="px-6 py-4 text-sm text-[#87938E]">No hospital admissions recorded.</p>
              ) : (
                history.admissions.map((adm) => (
                  <div key={adm.id} className="px-6 py-4">
                    <div className="mb-1 flex items-center justify-between">
                      <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        adm.status === "Discharged"
                          ? "bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-gray-400"
                          : "bg-[#0F766E]/10 text-[#0F766E] dark:bg-[#0F766E]/20 dark:text-[#5EEAD4]"
                      }`}>
                        {adm.status}
                      </span>
                      <span className="font-mono text-[10px] text-[#87938E]">{adm.id}</span>
                    </div>
                    <p className="text-sm font-bold text-[#17201D] dark:text-white">{adm.reason}</p>
                    <div className="mt-1.5 flex flex-wrap gap-4 text-xs text-[#52615B] dark:text-[#AAB6B0]">
                      <span className="flex items-center gap-1"><Calendar size={11} />Admitted: {new Date(adm.admitDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                      {adm.dischargeDate && <span className="flex items-center gap-1"><ThumbsUp size={11} />Discharged: {new Date(adm.dischargeDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>}
                      <span className="flex items-center gap-1"><BedDouble size={11} />{adm.ward} · {adm.bed}</span>
                      <span className="flex items-center gap-1"><Stethoscope size={11} />{adm.doctor}</span>
                      <span className="flex items-center gap-1"><Clock size={11} />Stay: {adm.duration}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </HistorySection>

        </div>
      )}

      {/* Render Lab Report Modal when requested by Doctor */}
      {selectedReportOrder && (
        <LabReportModal
          order={selectedReportOrder}
          onClose={() => setSelectedReportOrder(null)}
        />
      )}
    </div>
  );
}