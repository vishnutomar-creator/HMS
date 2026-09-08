"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { paymentAPI, billingAPI, patientAPI } from "../../../services/api";

export default function AddPaymentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [billOptions, setBillOptions] = useState([]);
  const [form, setForm] = useState({
    billId: "",
    amount: "",
    method: "UPI",
    date: "",
    transactionId: "",
  });

  // Load real bills from localStorage + API
  useEffect(() => {
    const loadBills = async () => {
      let bills = [];

      // 1. From localStorage billings
      if (typeof window !== "undefined") {
        try {
          const stored = JSON.parse(localStorage.getItem("hms_local_billings") || "[]");
          stored.forEach((b) => {
            const id = b.billId || b.id;
            const patient = b.patient || b.patientName || "Patient";
            if (id) bills.push({ id, patient });
          });
        } catch (e) {}
      }

      // 2. From billing API
      try {
        const res = await billingAPI.getBills();
        if (res.success && Array.isArray(res.data)) {
          res.data.forEach((b) => {
            const id = b.billId || b._id || b.id;
            const patient = b.patientName || b.patientId?.name || b.patient || "Patient";
            if (id && !bills.find((x) => x.id === id)) bills.push({ id, patient });
          });
        }
      } catch (e) {}

      // 3. Fallback: build from patients if no bills exist
      if (bills.length === 0) {
        let patients = [];
        if (typeof window !== "undefined") {
          try {
            const stored = JSON.parse(localStorage.getItem("hms_local_patients") || "[]");
            stored.forEach((p) => {
              const name = p.name || p.patientName || p.userId?.name;
              if (name) patients.push(name);
            });
          } catch (e) {}
        }
        try {
          const res = await patientAPI.getPatients();
          if (res.success && Array.isArray(res.data)) {
            res.data.forEach((p) => {
              const name = p.name || p.patientName || p.userId?.name;
              if (name && !patients.includes(name)) patients.push(name);
            });
          }
        } catch (e) {}

        bills = patients.map((name, i) => ({
          id: `BILL-${500 + i + 1}`,
          patient: name,
        }));
      }

      setBillOptions(bills);
      setForm((prev) => ({ ...prev, billId: prev.billId || bills[0]?.id || "" }));
    };

    loadBills();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const paymentId = `PAY-${Math.floor(1000 + Math.random() * 9000)}`;
    const matchedBill = billOptions.find((b) => b.id === form.billId);
    const newPaymentObj = {
      id: paymentId,
      paymentId,
      billId: form.billId,
      patient: matchedBill ? matchedBill.patient : "Patient",
      amount: Number(form.amount) || 0,
      method: form.method,
      date: form.date || "Today",
      status: "Completed",
    };

    if (typeof window !== "undefined") {
      try {
        const stored = JSON.parse(localStorage.getItem("hms_local_payments") || "[]");
        localStorage.setItem("hms_local_payments", JSON.stringify([newPaymentObj, ...stored]));
      } catch (err) {}
    }

    try {
      await paymentAPI.createPayment(newPaymentObj);
    } catch (err) {
      console.warn("Payment API creation notice:", err.message);
    } finally {
      setLoading(false);
      router.push("/payments");
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Link href="/payments" className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#DDD9CE] text-[#52615B] transition hover:border-[#0F766E] hover:bg-[#E7F5F2] hover:text-[#0F766E] dark:border-white/10 dark:text-[#AAB6B0] dark:hover:bg-[#0F766E]/20">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-[#17201D] dark:text-white">Record Payment</h1>
          <p className="mt-1 text-sm text-[#7B8882] dark:text-[#87938E]">Log a payment against a bill</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="rounded-2xl border border-[#E5E2D9] bg-white p-6 dark:border-white/10 dark:bg-[#17201D]">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">Bill</label>
            {billOptions.length > 0 ? (
              <select name="billId" value={form.billId} onChange={handleChange} className={inputClass}>
                <option value="">-- Select Bill --</option>
                {billOptions.map((b) => (
                  <option key={b.id} value={b.id}>{b.id} - {b.patient}</option>
                ))}
              </select>
            ) : (
              <input
                className={inputClass}
                placeholder="Loading bills..."
                readOnly
              />
            )}
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">Amount (₹)</label>
            <input required type="number" min="0" name="amount" value={form.amount} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">Payment Method</label>
            <select name="method" value={form.method} onChange={handleChange} className={inputClass}>
              <option>Cash</option>
              <option>Card</option>
              <option>Insurance</option>
              <option>UPI</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">Payment Date</label>
            <input required type="date" name="date" value={form.date} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">Transaction ID</label>
            <input name="transactionId" value={form.transactionId} onChange={handleChange} placeholder="Optional" className={inputClass} />
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 border-t border-[#EEECE5] pt-5 dark:border-white/10">
          <Link href="/payments" className="rounded-xl px-4 py-2.5 text-sm font-semibold text-[#52615B] transition hover:bg-[#F1F3EF] dark:text-[#AAB6B0] dark:hover:bg-white/10">Cancel</Link>
          <button type="submit" className="rounded-xl bg-[#0F766E] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0F766E]/90">Save Payment</button>
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