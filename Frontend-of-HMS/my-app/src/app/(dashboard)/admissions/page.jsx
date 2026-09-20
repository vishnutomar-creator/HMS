"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Search, Plus, MoreVertical, BedDouble, Building2,
  CheckCircle2, LogOut, UserPlus, RefreshCw,
} from "lucide-react";
import { patientAPI } from "../../services/api";
import { getBedsFromStorage, freeBed } from "../../utils/bedStore";

const statusStyles = {
  Admitted:    "bg-[#0F766E]/10 text-[#0F766E] dark:bg-[#0F766E]/20 dark:text-[#5EEAD4]",
  Discharged:  "bg-[#F1F3EF] text-[#64746E] dark:bg-white/10 dark:text-[#AAB6B0]",
  Transferred: "bg-[#FCEFC7] text-[#8A6D1D] dark:bg-[#FCEFC7]/10 dark:text-[#E8C766]",
};

export default function AdmissionsPage() {
  const [admissions, setAdmissions]   = useState([]);
  const [beds,       setBeds]         = useState([]);
  const [query,      setQuery]        = useState("");
  const [openMenuId, setOpenMenuId]   = useState(null);
  const [loading,    setLoading]      = useState(true);
  const [successMsg, setSuccessMsg]   = useState("");

  const loadData = async () => {
    setLoading(true);
    let localAdmissions = [];
    try {
      localAdmissions = JSON.parse(localStorage.getItem("hms_local_admissions") || "[]");
    } catch(_) {}

    // Also synthesise admissions for API-admitted patients (legacy)
    let apiAdmissions = [];
    try {
      const res = await patientAPI.getPatients();
      if (res.success && Array.isArray(res.data)) {
        res.data.forEach((p) => {
          if (p.status === "Admitted") {
            const pid = p.patientId || p._id || p.id;
            apiAdmissions.push({
              admissionId:   `ADM-${pid}`,
              patient:       p.name || p.patientName || "Patient",
              ward:          p.ward  || "—",
              bedNumber:     p.roomNo || "—",
              doctor:        "—",
              ipdNumber:     "—",
              admissionDate: p.createdAt ? String(p.createdAt).slice(0, 10) : "—",
              dischargeDate: null,
              status:        "Admitted",
            });
          }
        });
      }
    } catch(_) {}

    // Merge, local takes priority by admissionId
    const map = new Map();
    localAdmissions.forEach((a) => map.set(a.admissionId || a.id, a));
    apiAdmissions.forEach((a) => { if (!map.has(a.admissionId)) map.set(a.admissionId, a); });

    setAdmissions(Array.from(map.values()));
    setBeds(getBedsFromStorage());
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    const handler = () => setBeds(getBedsFromStorage());
    window.addEventListener("hms_beds_updated", handler);
    return () => window.removeEventListener("hms_beds_updated", handler);
  }, []);

  const handleDelete = (id) => {
    if (!confirm("Delete this admission record?")) return;
    const updated = admissions.filter((a) => (a.admissionId || a.id) !== id);
    setAdmissions(updated);
    try {
      localStorage.setItem("hms_local_admissions", JSON.stringify(updated));
    } catch(_) {}
    setOpenMenuId(null);
  };

  const handleDischarge = (admission) => {
    if (!confirm(`Discharge ${admission.patient}? This will free their bed.`)) return;

    // Free the bed
    if (admission.bedId) freeBed(admission.bedId, "Cleaning");

    // Update admission status
    const updated = admissions.map((a) =>
      (a.admissionId || a.id) === (admission.admissionId || admission.id)
        ? { ...a, status: "Discharged", dischargeDate: new Date().toISOString().slice(0, 10) }
        : a
    );
    setAdmissions(updated);
    setBeds(getBedsFromStorage());
    try {
      localStorage.setItem("hms_local_admissions", JSON.stringify(updated));
    } catch(_) {}
    setOpenMenuId(null);
    setSuccessMsg(`${admission.patient} discharged. Bed ${admission.bedNumber || ""} is now Cleaning.`);
    setTimeout(() => setSuccessMsg(""), 5000);
  };

  const filtered = admissions.filter((a) =>
    `${a.patient} ${a.admissionId} ${a.ipdNumber} ${a.ward} ${a.bedNumber} ${a.doctor}`
      .toLowerCase().includes(query.toLowerCase())
  );

  const admittedCount   = admissions.filter((a) => a.status === "Admitted").length;
  const availableBeds   = beds.filter((b) => b.status === "Available").length;
  const dischargedToday = admissions.filter((a) => a.dischargeDate === new Date().toISOString().slice(0, 10)).length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#17201D] dark:text-white">IPD Admissions</h1>
          <p className="mt-1 text-sm text-[#7B8882] dark:text-[#87938E]">Manage inpatient admissions, ward beds, and discharges</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={loadData} className="flex items-center gap-2 rounded-xl border border-[#DDD9CE] px-3.5 py-2.5 text-sm font-semibold text-[#52615B] transition hover:border-[#0F766E] hover:bg-[#E7F5F2] hover:text-[#0F766E] dark:border-white/10 dark:text-[#AAB6B0]">
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />Refresh
          </button>
          <Link href="/admissions/new" className="flex items-center justify-center gap-2 rounded-xl bg-[#0F766E] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0F766E]/90">
            <UserPlus size={17} />New Admission
          </Link>
        </div>
      </div>

      {/* Stat Strip */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-[#E5E2D9] bg-white p-4 dark:border-white/10 dark:bg-[#17201D]">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0F766E]/10 text-[#0F766E] dark:bg-[#0F766E]/20 dark:text-[#5EEAD4]"><UserPlus size={20}/></div>
          <p className="mt-4 text-xs text-[#87938E]">Currently Admitted</p>
          <p className="mt-1 text-2xl font-bold text-[#17201D] dark:text-white">{admittedCount}</p>
        </div>
        <div className="rounded-2xl border border-[#E5E2D9] bg-white p-4 dark:border-white/10 dark:bg-[#17201D]">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#ECFDF5] text-[#0F766E]"><BedDouble size={20}/></div>
          <p className="mt-4 text-xs text-[#87938E]">Available Beds</p>
          <p className="mt-1 text-2xl font-bold text-[#0F766E] dark:text-[#5EEAD4]">{availableBeds}</p>
        </div>
        <div className="rounded-2xl border border-[#E5E2D9] bg-white p-4 dark:border-white/10 dark:bg-[#17201D]">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F1F3EF] text-[#52615B] dark:bg-white/10"><LogOut size={20}/></div>
          <p className="mt-4 text-xs text-[#87938E]">Discharged Today</p>
          <p className="mt-1 text-2xl font-bold text-[#17201D] dark:text-white">{dischargedToday}</p>
        </div>
      </div>

      {/* Success Banner */}
      {successMsg && (
        <div className="flex items-center gap-3 rounded-2xl border border-[#0F766E]/30 bg-[#0F766E]/10 p-4 text-sm font-semibold text-[#0F766E] dark:text-[#5EEAD4]">
          <CheckCircle2 size={20}/><span>{successMsg}</span>
        </div>
      )}

      {/* Table Card */}
      <div className="rounded-2xl border border-[#E5E2D9] bg-white dark:border-white/10 dark:bg-[#17201D]">
        <div className="flex items-center justify-between gap-3 border-b border-[#EEECE5] p-4 dark:border-white/10">
          <div className="relative w-full max-w-xs">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A9691]" />
            <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search patient, IPD, ward, bed…"
              className="w-full rounded-xl border border-[#E3E0D7] bg-[#FAFAF7] py-2 pl-10 pr-4 text-sm text-[#17201D] outline-none placeholder:text-[#9AA49F] focus:border-[#0F766E] focus:ring-4 focus:ring-[#0F766E]/10 dark:border-white/10 dark:bg-[#202B27] dark:text-white dark:placeholder:text-[#71817B]" />
          </div>
          <p className="hidden shrink-0 text-xs text-[#87938E] sm:block">{filtered.length} admissions</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#EEECE5] text-[10px] font-bold uppercase tracking-[0.08em] text-[#87938E] dark:border-white/10">
                <th className="px-5 py-3">Patient</th>
                <th className="px-5 py-3">IPD No.</th>
                <th className="px-5 py-3">Ward / Bed</th>
                <th className="px-5 py-3">Doctor</th>
                <th className="px-5 py-3">Admitted</th>
                <th className="px-5 py-3">Discharge</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => {
                const id = a.admissionId || a.id;
                return (
                  <tr key={id} className="border-b border-[#EEECE5] last:border-0 hover:bg-[#FAFAF7] dark:border-white/5 dark:hover:bg-white/[0.03]">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0F766E]/10 text-xs font-bold text-[#0F766E] dark:bg-[#0F766E]/20 dark:text-[#5EEAD4]">
                          {(a.patient || "P").split(" ").map((n) => n[0]).join("").slice(0,2)}
                        </div>
                        <div>
                          <p className="font-semibold text-[#17201D] dark:text-white">{a.patient}</p>
                          <p className="text-xs text-[#87938E]">{id}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-3.5">
                      <span className="rounded-lg bg-[#0F766E]/10 px-2.5 py-1 text-xs font-bold text-[#0F766E] dark:bg-[#0F766E]/20 dark:text-[#5EEAD4]">
                        {a.ipdNumber || "—"}
                      </span>
                    </td>

                    <td className="px-5 py-3.5">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#17201D] dark:text-white">
                          <Building2 size={12} className="text-[#8A9691]" />{a.ward || a.roomNo || "—"}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-[#87938E]">
                          <BedDouble size={12} />{a.bedNumber || a.roomNo || "—"}
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-3.5 text-xs text-[#52615B] dark:text-[#AAB6B0]">{a.doctor || "—"}</td>

                    <td className="px-5 py-3.5 text-xs text-[#52615B] dark:text-[#AAB6B0]">{a.admissionDate || "—"}</td>

                    <td className="px-5 py-3.5 text-xs text-[#52615B] dark:text-[#AAB6B0]">{a.dischargeDate || "—"}</td>

                    <td className="px-5 py-3.5">
                      <span className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${statusStyles[a.status] || "bg-gray-100 text-gray-600"}`}>
                        {a.status}
                      </span>
                    </td>

                    <td className="px-5 py-3.5">
                      <div className="relative flex justify-end">
                        <button onClick={() => setOpenMenuId(openMenuId === id ? null : id)}
                          className="rounded-lg p-2 text-[#64746E] hover:bg-[#F1F3EF] hover:text-[#0F766E] dark:text-[#AAB6B0] dark:hover:bg-white/10">
                          <MoreVertical size={16} />
                        </button>
                        {openMenuId === id && (
                          <div className="absolute right-0 top-10 z-10 min-w-[160px] overflow-hidden rounded-xl border border-[#DDD9CE] bg-white shadow-xl dark:border-white/10 dark:bg-[#202B27]">
                            {a.status === "Admitted" && (
                              <button onClick={() => handleDischarge(a)}
                                className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-[#52615B] hover:bg-[#E7F5F2] hover:text-[#0F766E] dark:text-[#AAB6B0] dark:hover:bg-[#0F766E]/20">
                                <LogOut size={14} /> Discharge
                              </button>
                            )}
                            <button onClick={() => handleDelete(id)}
                              className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10">
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E7F5F2] text-[#0F766E]"><BedDouble size={24}/></div>
                      <p className="text-sm font-semibold text-[#17201D] dark:text-white">{loading ? "Loading admissions…" : "No admissions found"}</p>
                      <p className="max-w-xs text-xs text-[#87938E]">{loading ? "Fetching records…" : "Admit a patient to IPD using the New Admission button."}</p>
                      {!loading && (
                        <Link href="/admissions/new" className="mt-2 flex items-center gap-2 rounded-xl bg-[#0F766E] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#0F766E]/90">
                          <Plus size={15}/>New Admission
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
