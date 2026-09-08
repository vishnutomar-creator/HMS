"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Plus, MoreVertical, BedDouble, Trash2 } from "lucide-react";
import { patientAPI } from "../../services/api";

const statusStyles = {
  Admitted:
    "bg-[#0F766E]/10 text-[#0F766E] dark:bg-[#0F766E]/20 dark:text-[#5EEAD4]",
  Discharged:
    "bg-[#F1F3EF] text-[#64746E] dark:bg-white/10 dark:text-[#AAB6B0]",
  Transferred:
    "bg-[#FCEFC7] text-[#8A6D1D] dark:bg-[#FCEFC7]/10 dark:text-[#E8C766]",
};

export default function AdmissionsPage() {
  const [admissions, setAdmissions] = useState([]);
  const [query, setQuery] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAdmissions = async () => {
    setLoading(true);
    let localAdmissions = [];
    let admittedPatients = [];

    if (typeof window !== "undefined") {
      try {
        localAdmissions = JSON.parse(localStorage.getItem("hms_local_admissions") || "[]");
        const storedPatients = JSON.parse(localStorage.getItem("hms_local_patients") || "[]");
        storedPatients.forEach((p) => {
          if (p.status === "Admitted") {
            admittedPatients.push({
              admissionId: `ADM-${p.id || "101"}`,
              patient: p.name || "Patient",
              roomNo: p.roomNo || "ICU-04",
              admissionDate: p.admissionDate || "Today",
              dischargeDate: null,
              status: "Admitted",
            });
          }
        });
      } catch (e) {}
    }

    try {
      const res = await patientAPI.getPatients();
      if (res.success && Array.isArray(res.data)) {
        res.data.forEach((p) => {
          if (p.status === "Admitted") {
            const pid = p.patientId || p._id || p.id;
            admittedPatients.push({
              admissionId: `ADM-${pid}`,
              patient: p.name || p.patientName || "Patient",
              roomNo: p.roomNo || "GEN-112",
              admissionDate: p.createdAt ? String(p.createdAt).slice(0, 10) : "Today",
              dischargeDate: null,
              status: "Admitted",
            });
          }
        });
      }
    } catch (err) {
      console.warn("Admissions load notice:", err.message);
    } finally {
      // Key by patient name (and admissionId) so only 1 admission exists per patient
      const map = new Map();

      // 1. Explicit user admissions take highest priority
      localAdmissions.forEach((item) => {
        const patientKey = (item.patient || "").trim().toLowerCase();
        if (patientKey && !map.has(patientKey)) {
          map.set(patientKey, item);
        }
      });

      // 2. Synthesized fallback admissions for admitted patients without explicit record
      admittedPatients.forEach((item) => {
        const patientKey = (item.patient || "").trim().toLowerCase();
        if (patientKey && !map.has(patientKey)) {
          map.set(patientKey, item);
        }
      });

      setAdmissions(Array.from(map.values()));
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmissions();
  }, []);

  const handleDelete = (id) => {
    if (!confirm("Are you sure you want to delete this admission record?")) return;
    setAdmissions((prev) => prev.filter((a) => a.admissionId !== id && a.id !== id));
    if (typeof window !== "undefined") {
      try {
        const stored = JSON.parse(localStorage.getItem("hms_local_admissions") || "[]");
        const updated = stored.filter((a) => a.admissionId !== id && a.id !== id);
        localStorage.setItem("hms_local_admissions", JSON.stringify(updated));
      } catch (e) {}
    }
    setOpenMenuId(null);
  };

  const filtered = admissions.filter((a) =>
    `${a.patient} ${a.admissionId} ${a.roomNo}`
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#17201D] dark:text-white">
            Admissions
          </h1>
          <p className="mt-1 text-sm text-[#7B8882] dark:text-[#87938E]">
            Manage inpatient admissions, transfers, and discharges
          </p>
        </div>

        <Link
          href="/admissions/new"
          className="
            flex items-center justify-center gap-2
            rounded-xl bg-[#0F766E] px-4 py-2.5
            text-sm font-semibold text-white
            transition hover:bg-[#0F766E]/90
          "
        >
          <Plus size={17} />
          New Admission
        </Link>
      </div>

      {/* Card */}
      <div
        className="
          rounded-2xl border border-[#E5E2D9] bg-white
          dark:border-white/10 dark:bg-[#17201D]
        "
      >
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-3 border-b border-[#EEECE5] p-4 dark:border-white/10">
          <div className="relative w-full max-w-xs">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A9691]"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search admissions..."
              className="
                w-full rounded-xl border border-[#E3E0D7]
                bg-[#FAFAF7] py-2 pl-10 pr-4 text-sm
                text-[#17201D] outline-none
                placeholder:text-[#9AA49F]
                focus:border-[#0F766E] focus:ring-4 focus:ring-[#0F766E]/10
                dark:border-white/10 dark:bg-[#202B27] dark:text-white
                dark:placeholder:text-[#71817B]
              "
            />
          </div>

          <p className="hidden shrink-0 text-xs text-[#87938E] sm:block">
            {filtered.length} admissions
          </p>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#EEECE5] text-[10px] font-bold uppercase tracking-[0.08em] text-[#87938E] dark:border-white/10">
                <th className="px-5 py-3">Patient</th>
                <th className="px-5 py-3">Room</th>
                <th className="px-5 py-3">Admission Date</th>
                <th className="px-5 py-3">Discharge Date</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((a) => (
                <tr
                  key={a.admissionId}
                  className="border-b border-[#EEECE5] last:border-0 hover:bg-[#FAFAF7] dark:border-white/5 dark:hover:bg-white/[0.03]"
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0F766E]/10 text-xs font-bold text-[#0F766E] dark:bg-[#0F766E]/20 dark:text-[#5EEAD4]">
                        {(a.patient || "P")
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div>
                        <p className="font-semibold text-[#17201D] dark:text-white">
                          {a.patient}
                        </p>
                        <p className="text-xs text-[#87938E]">
                          {a.admissionId}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-3.5 text-[#52615B] dark:text-[#AAB6B0]">
                    <div className="flex items-center gap-1.5">
                      <BedDouble size={13} className="text-[#8A9691]" />
                      {a.roomNo}
                    </div>
                  </td>

                  <td className="px-5 py-3.5 text-[#52615B] dark:text-[#AAB6B0]">
                    {a.admissionDate}
                  </td>

                  <td className="px-5 py-3.5 text-[#52615B] dark:text-[#AAB6B0]">
                    {a.dischargeDate || "—"}
                  </td>

                  <td className="px-5 py-3.5">
                    <span
                      className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${statusStyles[a.status] || "bg-gray-100 text-gray-600"}`}
                    >
                      {a.status}
                    </span>
                  </td>

                  <td className="px-5 py-3.5">
                    <div className="relative flex justify-end">
                      <button
                        onClick={() =>
                          setOpenMenuId(
                            openMenuId === a.admissionId ? null : a.admissionId
                          )
                        }
                        className="rounded-lg p-2 text-[#64746E] hover:bg-[#F1F3EF] hover:text-[#0F766E] dark:text-[#AAB6B0] dark:hover:bg-white/10"
                      >
                        <MoreVertical size={16} />
                      </button>

                      {openMenuId === a.admissionId && (
                        <div className="absolute right-0 top-10 z-10 w-36 overflow-hidden rounded-xl border border-[#DDD9CE] bg-white shadow-xl dark:border-white/10 dark:bg-[#202B27]">
                          <button
                            onClick={() => handleDelete(a.admissionId)}
                            className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                          >
                            <Trash2 size={15} /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-12 text-center"
                  >
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E7F5F2] text-[#0F766E]">
                        <BedDouble size={24} />
                      </div>
                      <p className="text-sm font-semibold text-[#17201D] dark:text-white">
                        {loading ? "Loading IPD admissions..." : "No IPD admissions recorded"}
                      </p>
                      <p className="max-w-xs text-xs text-[#87938E]">
                        {loading ? "Fetching admissions..." : "Admit a patient to IPD or create a new admission."}
                      </p>
                      {!loading && (
                        <Link
                          href="/admissions/new"
                          className="mt-2 flex items-center gap-2 rounded-xl bg-[#0F766E] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#0F766E]/90"
                        >
                          <Plus size={15} /> New Admission
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