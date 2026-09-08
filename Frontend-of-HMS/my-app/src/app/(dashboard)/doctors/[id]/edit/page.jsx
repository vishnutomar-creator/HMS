"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { doctorAPI } from "../../../../services/api";

export default function EditDoctorPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [doctor, setDoctor] = useState({
    name: "",
    email: "",
    phone: "",
    department: "Cardiology",
    specialization: "Cardiologist",
    experience: "5",
    shift: "Morning",
    status: "Available",
  });

  useEffect(() => {
    async function loadDoctor() {
      if (!params?.id) return;
      let foundLocal = null;
      if (typeof window !== "undefined") {
        try {
          const stored = JSON.parse(localStorage.getItem("hms_local_doctors") || "[]");
          foundLocal = stored.find((d) => d.id === params.id || d._id === params.id);
        } catch (e) {}
      }

      try {
        const res = await doctorAPI.getDoctorById(params.id);
        if (res.success && res.data) {
          const d = res.data;
          setDoctor({
            name: d.name || d.doctorName || "",
            email: d.email || "",
            phone: d.phone || "",
            department: d.department?.name || d.department || "Cardiology",
            specialization: d.specialization || "Cardiologist",
            experience: d.experience || "5",
            shift: d.shift || "Morning",
            status: d.availability || d.status || "Available",
          });
        } else if (foundLocal) {
          setDoctor({
            ...foundLocal,
            experience: String(foundLocal.experienceYears || foundLocal.experience || 5).replace(" Years", ""),
          });
        }
      } catch (err) {
        if (foundLocal) {
          setDoctor({
            ...foundLocal,
            experience: String(foundLocal.experienceYears || foundLocal.experience || 5).replace(" Years", ""),
          });
        }
      }
    }

    loadDoctor();
  }, [params]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const updatedObj = {
      id: params.id,
      doctorId: params.id,
      name: doctor.name,
      doctorName: doctor.name,
      email: doctor.email,
      phone: doctor.phone,
      department: doctor.department,
      specialization: doctor.specialization,
      experience: `${doctor.experience} Years`,
      shift: doctor.shift,
      status: doctor.status,
    };

    if (typeof window !== "undefined") {
      try {
        const stored = JSON.parse(localStorage.getItem("hms_local_doctors") || "[]");
        const updatedList = stored.map((d) => (d.id === params.id ? updatedObj : d));
        localStorage.setItem("hms_local_doctors", JSON.stringify(updatedList));
      } catch (e) {}
    }

    try {
      if (params?.id) {
        await doctorAPI.updateDoctor(params.id, doctor);
      }
    } catch (err) {
      console.warn("Update doctor notice:", err.message);
    } finally {
      setLoading(false);
      router.push("/doctors");
    }
  };

  return (
    <div className="space-y-5 p-6">
      <div className="flex items-center gap-3">
        <Link href="/doctors" className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#DDD9CE] text-[#52615B] transition hover:bg-[#E7F5F2] hover:text-[#0F766E] dark:border-white/10 dark:text-[#AAB6B0]">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-[#17201D] dark:text-white">Edit Doctor Profile</h1>
          <p className="mt-1 text-sm text-[#7B8882] dark:text-[#87938E]">Doctor ID: {params.id}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="rounded-2xl border border-[#E5E2D9] bg-white p-6 dark:border-white/10 dark:bg-[#17201D]">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">Full Name *</label>
            <input required value={doctor.name} onChange={(e) => setDoctor((d) => ({ ...d, name: e.target.value }))} className={inputClass} />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">Email *</label>
            <input required type="email" value={doctor.email} onChange={(e) => setDoctor((d) => ({ ...d, email: e.target.value }))} className={inputClass} />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">Phone *</label>
            <input required type="tel" value={doctor.phone} onChange={(e) => setDoctor((d) => ({ ...d, phone: e.target.value }))} className={inputClass} />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">Department *</label>
            <select value={doctor.department} onChange={(e) => setDoctor((d) => ({ ...d, department: e.target.value }))} className={inputClass}>
              {["Cardiology", "Neurology", "Orthopedics", "Pediatrics", "General Medicine", "Radiology"].map((dep) => (
                <option key={dep}>{dep}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">Specialization *</label>
            <input required value={doctor.specialization} onChange={(e) => setDoctor((d) => ({ ...d, specialization: e.target.value }))} className={inputClass} />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">Status</label>
            <select value={doctor.status} onChange={(e) => setDoctor((d) => ({ ...d, status: e.target.value }))} className={inputClass}>
              <option>Available</option>
              <option>On Duty</option>
              <option>On Leave</option>
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">Shift</label>
            <select value={doctor.shift} onChange={(e) => setDoctor((d) => ({ ...d, shift: e.target.value }))} className={inputClass}>
              <option>Morning</option>
              <option>Evening</option>
              <option>Night</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3 border-t border-[#EEECE5] pt-5 dark:border-white/10">
          <Link href="/doctors" className="rounded-xl px-4 py-2.5 text-sm font-semibold text-[#52615B] transition hover:bg-[#F1F3EF] dark:text-[#AAB6B0]">Cancel</Link>
          <button type="submit" disabled={loading} className="flex items-center gap-2 rounded-xl bg-[#0F766E] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0B625C]">
            <Save size={16} />
            {loading ? "Saving..." : "Update Doctor"}
          </button>
        </div>
      </form>
    </div>
  );
}

const inputClass = `
  w-full rounded-xl border border-[#E3E0D7] bg-[#FAFAF7] px-4 py-2.5 text-sm text-[#17201D] outline-none focus:border-[#0F766E] focus:ring-4 focus:ring-[#0F766E]/10 dark:border-white/10 dark:bg-[#202B27] dark:text-white
`;
