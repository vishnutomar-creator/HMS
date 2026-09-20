"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft, ArrowRight, BedDouble, CheckCircle2, UserPlus,
  Building2, Stethoscope, User, FileText, Wrench, AlertTriangle,
} from "lucide-react";
import { patientAPI, doctorAPI } from "../../../services/api";
import {
  getBedsFromStorage, occupyBed, generateIPD,
} from "../../../utils/bedStore";

const inputClass = `w-full rounded-xl border border-[#E3E0D7] bg-[#FAFAF7] px-4 py-2.5 text-sm text-[#17201D] outline-none placeholder:text-[#9AA49F] focus:border-[#0F766E] focus:ring-4 focus:ring-[#0F766E]/10 dark:border-white/10 dark:bg-[#202B27] dark:text-white dark:placeholder:text-[#71817B]`;

const BED_STATUS_CONFIG = {
  Available:   { color:"text-[#0F766E]", bg:"bg-[#ECFDF5] dark:bg-[#0F766E]/10", badge:"bg-[#0F766E]/10 text-[#0F766E] dark:bg-[#0F766E]/20 dark:text-[#5EEAD4]", selectable:true },
  Occupied:    { color:"text-[#C84B4B]", bg:"bg-red-50 dark:bg-red-500/5",       badge:"bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400",             selectable:false },
  Reserved:    { color:"text-[#C87924]", bg:"bg-amber-50 dark:bg-amber-500/5",   badge:"bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",     selectable:false },
  Cleaning:    { color:"text-blue-600",  bg:"bg-blue-50 dark:bg-blue-500/5",     badge:"bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",         selectable:false },
  Maintenance: { color:"text-gray-500",  bg:"bg-gray-50 dark:bg-white/5",        badge:"bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-white/50",           selectable:false },
};

const BED_TYPE_ICONS = { ICU:<Stethoscope size={16}/>, General:<BedDouble size={16}/>, Private:<User size={16}/>, Pediatric:<User size={16}/>, Emergency:<AlertTriangle size={16}/> };

function AdmissionWizard() {
  const router      = useRouter();
  const searchParams = useSearchParams();
  const preWardId   = searchParams.get("wardId") || "";
  const preWardName = searchParams.get("wardName") || "";

  const [step, setStep]                 = useState(1);
  const [patientOptions, setPatientOptions] = useState([]);
  const [doctorOptions,  setDoctorOptions]  = useState([]);
  const [allBeds,        setAllBeds]        = useState([]);
  const [wardFilter,     setWardFilter]     = useState(preWardId ? preWardName : "All Wards");
  const [selectedBedId,  setSelectedBedId]  = useState(null);
  const [ipdNumber,      setIpdNumber]      = useState("");
  const [saving,         setSaving]         = useState(false);

  // Step 1 form
  const [form, setForm] = useState({
    patientName: "",
    doctorName:  "",
    reason:      "",
    diagnosis:   "",
    admissionDate: new Date().toISOString().slice(0, 10),
  });

  // Load patients + doctors + beds
  useEffect(() => {
    async function load() {
      // Patients
      let pNames = [];
      try {
        const res = await patientAPI.getPatients();
        if (res.success && Array.isArray(res.data)) {
          res.data.forEach((p) => { const n = p.name || p.patientName; if (n && !pNames.includes(n)) pNames.push(n); });
        }
      } catch(_) {}
      setPatientOptions(pNames);
      if (pNames.length > 0) setForm((f) => ({ ...f, patientName: pNames[0] }));

      // Doctors
      let dNames = [];
      try {
        const res = await doctorAPI.getDoctors();
        if (res.success && Array.isArray(res.data)) {
          res.data.forEach((d) => { const n = d.name || d.doctorName; if (n && !dNames.includes(n)) dNames.push(`Dr. ${n}`); });
        }
      } catch(_) {}
      setDoctorOptions(dNames);
      if (dNames.length > 0) setForm((f) => ({ ...f, doctorName: dNames[0] }));

      // Beds
      setAllBeds(getBedsFromStorage());
    }
    load();
  }, []);

  // Derive wards list for filter
  const wardNames = ["All Wards", ...Array.from(new Set(allBeds.map((b) => b.ward)))];

  // Filter beds
  const visibleBeds = allBeds.filter((b) => wardFilter === "All Wards" || b.ward === wardFilter);

  const selectedBed = allBeds.find((b) => b.id === selectedBedId) || null;

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const goToStep2 = (e) => {
    e.preventDefault();
    if (!form.patientName.trim()) return;
    setStep(2);
  };

  const goToStep3 = () => {
    if (!selectedBed) return;
    const ipd = generateIPD();
    setIpdNumber(ipd);
    setStep(3);
  };

  const handleConfirm = () => {
    setSaving(true);
    const admissionId = `ADM-${Math.floor(1000 + Math.random() * 9000)}`;

    // 1. Mark bed occupied
    // 1. Mark bed occupied
    occupyBed(selectedBed.id, {
      patient: form.patientName,
      patientId: null,
      admissionId,
      assignedDoctor: form.doctorName,
    });

    // 2. Update MongoDB patient record
    (async () => {
      try {
        const pRes = await patientAPI.getPatients();
        if (pRes.success && Array.isArray(pRes.data)) {
          const matched = pRes.data.find(
            (p) => (p.name && p.name.toLowerCase() === form.patientName.toLowerCase()) ||
                   (p.patientName && p.patientName.toLowerCase() === form.patientName.toLowerCase())
          );
          if (matched) {
            const targetId = matched.patientId || matched._id || matched.id;
            await patientAPI.updatePatient(targetId, {
              status: "Admitted",
              ward: selectedBed.ward,
              roomNo: selectedBed.bedNumber,
            });
          }
        }
      } catch (err) {
        console.warn("Update patient admission status notice:", err.message);
      }
    })();

    setSaving(false);
    setStep(4); // success
  };

  // ── Step 4: Success ────────────────────────────────────────────────
  if (step === 4) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 py-16">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#0F766E]/10 text-[#0F766E] dark:bg-[#0F766E]/20 dark:text-[#5EEAD4]">
          <CheckCircle2 size={40} />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#17201D] dark:text-white">Patient Admitted Successfully</h2>
          <p className="mt-2 text-sm text-[#7B8882] dark:text-[#87938E]">
            <strong className="text-[#17201D] dark:text-white">{form.patientName}</strong> has been admitted to{" "}
            <strong className="text-[#17201D] dark:text-white">{selectedBed?.bedNumber}</strong> — {selectedBed?.ward}
          </p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-2xl border border-[#0F766E]/20 bg-[#0F766E]/5 px-6 py-3">
            <span className="text-xs text-[#87938E]">IPD Number</span>
            <span className="text-lg font-bold text-[#0F766E] dark:text-[#5EEAD4]">{ipdNumber}</span>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link href="/admissions" className="rounded-xl border border-[#DDD9CE] px-5 py-2.5 text-sm font-semibold text-[#52615B] transition hover:bg-[#F1F3EF] dark:border-white/10 dark:text-[#AAB6B0] dark:hover:bg-white/10">
            View Admissions
          </Link>
          <Link href="/wards" className="flex items-center gap-2 rounded-xl bg-[#0F766E] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0B625C]">
            <Building2 size={16} />View Wards
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => step === 1 ? router.back() : setStep((s) => s - 1)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#DDD9CE] text-[#52615B] transition hover:border-[#0F766E] hover:bg-[#E7F5F2] hover:text-[#0F766E] dark:border-white/10 dark:text-[#AAB6B0] dark:hover:bg-[#0F766E]/20"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-[#17201D] dark:text-white">New IPD Admission</h1>
          <p className="mt-1 text-sm text-[#7B8882] dark:text-[#87938E]">Step {step} of 3 — {["Patient & Doctor","Select Bed","Confirm Admission"][step-1]}</p>
        </div>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-0">
        {[1,2,3].map((s, i) => (
          <div key={s} className="flex items-center">
            <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition ${step >= s ? "bg-[#0F766E] text-white" : "border-2 border-[#DDD9CE] text-[#87938E] dark:border-white/20"}`}>{s}</div>
            {i < 2 && <div className={`h-0.5 w-12 transition-all ${step > s ? "bg-[#0F766E]" : "bg-[#DDD9CE] dark:bg-white/20"}`} />}
          </div>
        ))}
        <div className="ml-3 flex gap-4 text-xs text-[#87938E]">
          <span className={step===1?"font-bold text-[#0F766E]":""}>Patient</span>
          <span className={step===2?"font-bold text-[#0F766E]":""}>Bed</span>
          <span className={step===3?"font-bold text-[#0F766E]":""}>Confirm</span>
        </div>
      </div>

      {/* ── STEP 1: Patient & Doctor ──────────────────────────────── */}
      {step === 1 && (
        <form onSubmit={goToStep2} className="rounded-2xl border border-[#E5E2D9] bg-white p-6 dark:border-white/10 dark:bg-[#17201D]">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

            {/* Patient */}
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">Patient *</label>
              {patientOptions.length > 0 ? (
                <select name="patientName" value={form.patientName} onChange={handleChange} className={inputClass}>
                  {patientOptions.map((p) => <option key={p}>{p}</option>)}
                </select>
              ) : (
                <input required type="text" name="patientName" value={form.patientName} onChange={handleChange} placeholder="Patient full name" className={inputClass} />
              )}
            </div>

            {/* Doctor */}
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">Attending Doctor *</label>
              {doctorOptions.length > 0 ? (
                <select name="doctorName" value={form.doctorName} onChange={handleChange} className={inputClass}>
                  {doctorOptions.map((d) => <option key={d}>{d}</option>)}
                </select>
              ) : (
                <input required type="text" name="doctorName" value={form.doctorName} onChange={handleChange} placeholder="e.g. Dr. Rajesh Gupta" className={inputClass} />
              )}
            </div>

            {/* Diagnosis */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">Diagnosis</label>
              <input type="text" name="diagnosis" value={form.diagnosis} onChange={handleChange} placeholder="e.g. Acute MI, Fracture…" className={inputClass} />
            </div>

            {/* Admission Date */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">Admission Date</label>
              <input required type="date" name="admissionDate" value={form.admissionDate} onChange={handleChange} className={inputClass} />
            </div>

            {/* Reason */}
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">Reason for Admission</label>
              <textarea name="reason" value={form.reason} onChange={handleChange} rows={3} placeholder="Symptoms, referral notes, clinical summary…" className={inputClass} />
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3 border-t border-[#EEECE5] pt-5 dark:border-white/10">
            <Link href="/admissions" className="rounded-xl px-4 py-2.5 text-sm font-semibold text-[#52615B] hover:bg-[#F1F3EF] dark:text-[#AAB6B0] dark:hover:bg-white/10">Cancel</Link>
            <button type="submit" className="flex items-center gap-2 rounded-xl bg-[#0F766E] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0B625C]">
              Next: Select Bed <ArrowRight size={16} />
            </button>
          </div>
        </form>
      )}

      {/* ── STEP 2: Bed Picker ────────────────────────────────────── */}
      {step === 2 && (
        <div className="space-y-4">
          {/* Ward filter */}
          <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-[#E5E2D9] bg-white p-4 dark:border-white/10 dark:bg-[#17201D]">
            <label className="text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">Filter by Ward:</label>
            <div className="flex flex-wrap gap-2">
              {wardNames.map((wn) => (
                <button key={wn} onClick={() => setWardFilter(wn)}
                  className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${wardFilter === wn ? "bg-[#0F766E] text-white" : "border border-[#DDD9CE] text-[#52615B] hover:border-[#0F766E] hover:bg-[#E7F5F2] hover:text-[#0F766E] dark:border-white/10 dark:text-[#AAB6B0]"}`}>
                  {wn}
                </button>
              ))}
            </div>
            <div className="ml-auto text-xs text-[#87938E]">
              {visibleBeds.filter((b) => b.status === "Available").length} available of {visibleBeds.length} shown
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-3 text-[10px]">
            {Object.entries(BED_STATUS_CONFIG).map(([st, cfg]) => (
              <span key={st} className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 font-semibold ${cfg.badge}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${cfg.color.replace("text-","bg-")}`} />
                {st}{!cfg.selectable && st !== "Available" ? " (unavailable)" : ""}
              </span>
            ))}
          </div>

          {/* Bed Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {visibleBeds.map((bed) => {
              const cfg = BED_STATUS_CONFIG[bed.status] || BED_STATUS_CONFIG.Maintenance;
              const isSelected = selectedBedId === bed.id;
              return (
                <button key={bed.id} disabled={!cfg.selectable} onClick={() => cfg.selectable && setSelectedBedId(bed.id)}
                  className={`w-full rounded-2xl border p-5 text-left transition duration-200 ${cfg.selectable ? "hover:shadow-md hover:-translate-y-0.5 cursor-pointer" : "cursor-not-allowed opacity-60"} ${isSelected ? "border-[#0F766E] ring-2 ring-[#0F766E]/30 shadow-lg shadow-[#0F766E]/10" : "border-[#E3E0D7] dark:border-white/10"} ${cfg.bg} dark:bg-opacity-50`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${isSelected ? "bg-[#0F766E] text-white" : "bg-white/70 dark:bg-white/10"} ${cfg.color}`}>
                        {BED_TYPE_ICONS[bed.type] || <BedDouble size={16}/>}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#17201D] dark:text-white">{bed.bedNumber}</p>
                        <p className="text-[10px] text-[#87938E]">{bed.id}</p>
                      </div>
                    </div>
                    <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${cfg.badge}`}>{bed.status}</span>
                  </div>

                  <div className="mt-3 space-y-1.5 text-xs">
                    <div className="flex items-center gap-1.5 text-[#52615B] dark:text-[#AAB6B0]">
                      <Building2 size={12}/><span>{bed.ward}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#87938E]">{bed.floor} · {bed.type}</span>
                      {bed.equipment && <span className="rounded-full bg-white/50 px-2 py-0.5 text-[9px] text-[#52615B] dark:bg-white/10 dark:text-[#AAB6B0]">{bed.equipment}</span>}
                    </div>
                    {!cfg.selectable && bed.patient && (
                      <div className="mt-1 flex items-center gap-1 text-[#87938E]"><User size={11}/><span>Patient: {bed.patient}</span></div>
                    )}
                  </div>

                  {isSelected && (
                    <div className="mt-3 flex items-center gap-1.5 rounded-xl bg-[#0F766E]/10 px-3 py-2 text-[11px] font-bold text-[#0F766E] dark:bg-[#0F766E]/20 dark:text-[#5EEAD4]">
                      <CheckCircle2 size={14}/> Selected
                    </div>
                  )}
                </button>
              );
            })}
            {visibleBeds.length === 0 && (
              <div className="col-span-full py-12 text-center text-sm text-[#87938E]">No beds found for this ward.</div>
            )}
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-[#E5E2D9] bg-white p-4 dark:border-white/10 dark:bg-[#17201D]">
            <button onClick={() => setStep(1)} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-[#52615B] hover:bg-[#F1F3EF] dark:text-[#AAB6B0] dark:hover:bg-white/10">← Back</button>
            <button onClick={goToStep3} disabled={!selectedBedId}
              className="flex items-center gap-2 rounded-xl bg-[#0F766E] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0B625C] disabled:opacity-40 disabled:cursor-not-allowed">
              Next: Review &amp; Confirm <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 3: Confirm ──────────────────────────────────────── */}
      {step === 3 && selectedBed && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-[#E5E2D9] bg-white p-6 dark:border-white/10 dark:bg-[#17201D]">
            <p className="text-xs font-bold uppercase tracking-wider text-[#87938E]">Admission Summary</p>

            {/* IPD Number */}
            <div className="mt-4 flex items-center gap-3 rounded-2xl border border-[#0F766E]/20 bg-[#0F766E]/5 p-4 dark:border-[#0F766E]/30 dark:bg-[#0F766E]/10">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0F766E]/10 text-[#0F766E] dark:bg-[#0F766E]/20 dark:text-[#5EEAD4]">
                <FileText size={20} />
              </div>
              <div>
                <p className="text-xs text-[#87938E]">Generated IPD Number</p>
                <p className="text-xl font-bold text-[#0F766E] dark:text-[#5EEAD4]">{ipdNumber}</p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[
                { label:"Patient",       value:form.patientName,      icon:<User size={16}/> },
                { label:"Attending Dr",  value:form.doctorName,       icon:<Stethoscope size={16}/> },
                { label:"Bed",           value:selectedBed.bedNumber, icon:<BedDouble size={16}/> },
                { label:"Ward",          value:selectedBed.ward,      icon:<Building2 size={16}/> },
                { label:"Floor",         value:selectedBed.floor,     icon:<Building2 size={16}/> },
                { label:"Bed Type",      value:selectedBed.type,      icon:<BedDouble size={16}/> },
                { label:"Admission Date",value:form.admissionDate,    icon:<FileText size={16}/> },
                { label:"Equipment",     value:selectedBed.equipment, icon:<Wrench size={16}/> },
              ].map(({ label, value, icon }) => (
                <div key={label} className="rounded-xl border border-[#EEECE5] p-3 dark:border-white/10">
                  <p className="flex items-center gap-1.5 text-[10px] text-[#87938E]">{icon}{label}</p>
                  <p className="mt-1 text-sm font-bold text-[#17201D] dark:text-white">{value || "—"}</p>
                </div>
              ))}
            </div>

            {(form.diagnosis || form.reason) && (
              <div className="mt-4 rounded-xl border border-[#EEECE5] p-3 dark:border-white/10">
                {form.diagnosis && <p className="text-xs"><span className="text-[#87938E]">Diagnosis: </span><strong className="text-[#17201D] dark:text-white">{form.diagnosis}</strong></p>}
                {form.reason    && <p className="mt-1 text-xs text-[#52615B] dark:text-[#AAB6B0]">{form.reason}</p>}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-[#E5E2D9] bg-white p-4 dark:border-white/10 dark:bg-[#17201D]">
            <button onClick={() => setStep(2)} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-[#52615B] hover:bg-[#F1F3EF] dark:text-[#AAB6B0] dark:hover:bg-white/10">← Change Bed</button>
            <button onClick={handleConfirm} disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-[#0F766E] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0B625C] disabled:opacity-60">
              <UserPlus size={16} />
              {saving ? "Admitting…" : "Confirm & Admit Patient"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AddAdmissionPage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-[#87938E]">Loading admission form…</div>}>
      <AdmissionWizard />
    </Suspense>
  );
}
