"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Plus, MoreVertical } from "lucide-react";
import { billingAPI } from "../../services/api";

const statusStyles = {
  Paid: "bg-[#0F766E]/10 text-[#0F766E] dark:bg-[#0F766E]/20 dark:text-[#5EEAD4]",
  Pending: "bg-[#FCEFC7] text-[#8A6D1D] dark:bg-[#FCEFC7]/10 dark:text-[#E8C766]",
  "Partially Paid": "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400",
};

export default function BillingPage() {
  const [bills, setBills] = useState([]);
  const [query, setQuery] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchBillings = async () => {
    setLoading(true);
    let localItems = [];
    if (typeof window !== "undefined") {
      try {
        localItems = JSON.parse(localStorage.getItem("hms_local_billings") || "[]");
      } catch (e) {}
    }

    try {
      const res = await billingAPI.getBillings();
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        const formatted = res.data.map((b) => ({
          billId: b.billId || b._id || b.id,
          patient: b.patientName || b.patientId?.name || b.patient || "Patient",
          billDate: b.createdAt ? String(b.createdAt).slice(0, 10) : b.billDate || "Today",
          totalAmount: b.totalAmount || 10000,
          paymentStatus: b.paymentStatus || "Pending",
        }));

        const apiIds = new Set(formatted.map((item) => item.billId));
        const uniqueLocals = localItems.filter((item) => !apiIds.has(item.billId));
        setBills([...uniqueLocals, ...formatted]);
      } else {
        setBills(localItems);
      }
    } catch (err) {
      console.warn("Billing API load notice:", err.message);
      setBills(localItems);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBillings();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this bill?")) return;
    try {
      await billingAPI.deleteBilling(id);
    } catch (err) {
      console.warn("Delete bill notice:", err.message);
    } finally {
      setBills((prev) => prev.filter((b) => b.billId !== id));
      if (typeof window !== "undefined") {
        try {
          const stored = JSON.parse(localStorage.getItem("hms_local_billings") || "[]");
          const updated = stored.filter((b) => b.billId !== id);
          localStorage.setItem("hms_local_billings", JSON.stringify(updated));
        } catch (e) {}
      }
      setOpenMenuId(null);
    }
  };

  const filtered = bills.filter((b) =>
    `${b.patient} ${b.billId}`.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#17201D] dark:text-white">Billing</h1>
          <p className="mt-1 text-sm text-[#7B8882] dark:text-[#87938E]">Patient bills and payment status</p>
        </div>
        <Link href="/billing/create" className="flex items-center justify-center gap-2 rounded-xl bg-[#0F766E] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0F766E]/90">
          <Plus size={17} />
          Create Bill
        </Link>
      </div>

      <div className="rounded-2xl border border-[#E5E2D9] bg-white dark:border-white/10 dark:bg-[#17201D]">
        <div className="flex items-center justify-between gap-3 border-b border-[#EEECE5] p-4 dark:border-white/10">
          <div className="relative w-full max-w-xs">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A9691]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search bills..."
              className="w-full rounded-xl border border-[#E3E0D7] bg-[#FAFAF7] py-2 pl-10 pr-4 text-sm text-[#17201D] outline-none placeholder:text-[#9AA49F] focus:border-[#0F766E] focus:ring-4 focus:ring-[#0F766E]/10 dark:border-white/10 dark:bg-[#202B27] dark:text-white dark:placeholder:text-[#71817B]"
            />
          </div>
          <p className="hidden shrink-0 text-xs text-[#87938E] sm:block">{filtered.length} bills</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#EEECE5] text-[10px] font-bold uppercase tracking-[0.08em] text-[#87938E] dark:border-white/10">
                <th className="px-5 py-3">Patient</th>
                <th className="px-5 py-3">Bill Date</th>
                <th className="px-5 py-3">Total Amount</th>
                <th className="px-5 py-3">Payment Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => (
                <tr key={b.billId} className="border-b border-[#EEECE5] last:border-0 hover:bg-[#FAFAF7] dark:border-white/5 dark:hover:bg-white/[0.03]">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0F766E]/10 text-xs font-bold text-[#0F766E] dark:bg-[#0F766E]/20 dark:text-[#5EEAD4]">
                        {b.patient.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div>
                        <p className="font-semibold text-[#17201D] dark:text-white">{b.patient}</p>
                        <p className="text-xs text-[#87938E]">{b.billId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-[#52615B] dark:text-[#AAB6B0]">{b.billDate}</td>
                  <td className="px-5 py-3.5 text-[#52615B] dark:text-[#AAB6B0]">₹{b.totalAmount.toLocaleString()}</td>
                  <td className="px-5 py-3.5">
                    <span className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${statusStyles[b.paymentStatus]}`}>{b.paymentStatus}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="relative flex justify-end">
                      <button onClick={() => setOpenMenuId(openMenuId === b.billId ? null : b.billId)} className="rounded-lg p-2 text-[#64746E] hover:bg-[#F1F3EF] hover:text-[#0F766E] dark:text-[#AAB6B0] dark:hover:bg-white/10">
                        <MoreVertical size={16} />
                      </button>
                      {openMenuId === b.billId && (
                        <div className="absolute right-0 top-10 z-10 w-36 overflow-hidden rounded-xl border border-[#DDD9CE] bg-white shadow-xl dark:border-white/10 dark:bg-[#202B27]">
                          <Link href={`/billing/${b.billId}`} className="block px-3 py-2.5 text-left text-sm text-[#52615B] hover:bg-[#E7F5F2] hover:text-[#0F766E] dark:text-[#AAB6B0] dark:hover:bg-[#0F766E]/20 dark:hover:text-[#5EEAD4]">View</Link>
                          <button onClick={() => handleDelete(b.billId)} className="block w-full px-3 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10">Delete</button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="px-5 py-10 text-center text-sm text-[#87938E]">No bills found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}