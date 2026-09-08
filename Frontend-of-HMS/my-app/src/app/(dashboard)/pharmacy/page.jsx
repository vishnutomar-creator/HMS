"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  MoreVertical,
  Pill,
  Package,
  AlertTriangle,
  Wallet,
  User,
} from "lucide-react";

const stats = [
  {
    label: "Total Medicines",
    value: "186",
    sub: "Catalog items",
    icon: Pill,
    tone: "teal",
  },
  {
    label: "In Stock Units",
    value: "9,420",
    sub: "Total quantity",
    icon: Package,
    tone: "teal",
  },
  {
    label: "Low Stock Items",
    value: "14",
    sub: "Below reorder level",
    icon: AlertTriangle,
    tone: "amber",
  },
  {
    label: "Inventory Value",
    value: "₹8.4L",
    sub: "At current stock",
    icon: Wallet,
    tone: "teal",
  },
];

const dummyMedicines = [
  {
    itemId: "MED-101",
    name: "Amlodipine 5mg",
    category: "Cardiac",
    form: "Tablet",
    stock: 420,
    reorderLevel: 150,
    capacity: 600,
    unitPrice: 3.5,
    supplier: "Sunrise Pharma Distributors",
    expiryDate: "2027-03-01",
    status: "In Stock",
  },
  {
    itemId: "MED-102",
    name: "Metformin 500mg",
    category: "Diabetes",
    form: "Tablet",
    stock: 90,
    reorderLevel: 150,
    capacity: 500,
    unitPrice: 2.1,
    supplier: "Wellness Meditrade",
    expiryDate: "2026-12-15",
    status: "Low Stock",
  },
  {
    itemId: "MED-103",
    name: "Cetirizine 10mg",
    category: "Allergy",
    form: "Tablet",
    stock: 310,
    reorderLevel: 100,
    capacity: 400,
    unitPrice: 1.2,
    supplier: "Sunrise Pharma Distributors",
    expiryDate: "2027-06-20",
    status: "In Stock",
  },
  {
    itemId: "MED-104",
    name: "Ibuprofen 400mg",
    category: "Pain Relief",
    form: "Tablet",
    stock: 60,
    reorderLevel: 120,
    capacity: 450,
    unitPrice: 1.8,
    supplier: "MedCore Supplies",
    expiryDate: "2026-09-30",
    status: "Low Stock",
  },
  {
    itemId: "MED-105",
    name: "Amoxicillin 250mg",
    category: "Antibiotic",
    form: "Capsule",
    stock: 275,
    reorderLevel: 100,
    capacity: 350,
    unitPrice: 4.0,
    supplier: "Wellness Meditrade",
    expiryDate: "2026-10-05",
    status: "In Stock",
  },
  {
    itemId: "MED-106",
    name: "Insulin Glargine",
    category: "Diabetes",
    form: "Injection",
    stock: 35,
    reorderLevel: 40,
    capacity: 120,
    unitPrice: 320,
    supplier: "MedCore Supplies",
    expiryDate: "2026-08-25",
    status: "Expiring Soon",
  },
];

const statusStyles = {
  "In Stock":
    "bg-[#0F766E]/10 text-[#0F766E] dark:bg-[#0F766E]/20 dark:text-[#5EEAD4]",
  "Low Stock":
    "bg-[#FCEFC7] text-[#8A6D1D] dark:bg-[#FCEFC7]/10 dark:text-[#E8C766]",
  "Expiring Soon":
    "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400",
};

const categories = [
  "All Categories",
  "Cardiac",
  "Diabetes",
  "Allergy",
  "Pain Relief",
  "Antibiotic",
];
const statuses = ["All Status", "In Stock", "Low Stock", "Expiring Soon"];

export default function PharmacyPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [status, setStatus] = useState("All Status");
  const [openMenuId, setOpenMenuId] = useState(null);

  const filtered = dummyMedicines.filter((m) => {
    const matchesQuery = `${m.name} ${m.itemId} ${m.supplier}`
      .toLowerCase()
      .includes(query.toLowerCase());
    const matchesCategory =
      category === "All Categories" || m.category === category;
    const matchesStatus = status === "All Status" || m.status === status;
    return matchesQuery && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-5">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-sm text-[#87938E]">
        <span>Hospital</span>
        <span>›</span>
        <span className="font-semibold text-[#17201D] dark:text-white">
          Pharmacy
        </span>
      </div>

      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#17201D] dark:text-white">
            Pharmacy
          </h1>
          <p className="mt-1 text-sm text-[#7B8882] dark:text-[#87938E]">
            Manage medicine stock, pricing, and suppliers.
          </p>
        </div>

        <Link
          href="/pharmacy/add"
          className="
            flex items-center justify-center gap-2
            rounded-xl bg-[#0F766E] px-4 py-2.5
            text-sm font-semibold text-white
            transition hover:bg-[#0F766E]/90
          "
        >
          <Plus size={17} />
          Add Medicine
        </Link>
      </div>

      {/* Stat Strip */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          const iconBg =
            s.tone === "amber"
              ? "bg-[#FCEFC7] text-[#8A6D1D] dark:bg-[#FCEFC7]/10 dark:text-[#E8C766]"
              : "bg-[#0F766E]/10 text-[#0F766E] dark:bg-[#0F766E]/20 dark:text-[#5EEAD4]";

          return (
            <div
              key={s.label}
              className="rounded-2xl border border-[#E5E2D9] bg-white p-4 dark:border-white/10 dark:bg-[#17201D]"
            >
              <div className="flex items-start justify-between">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconBg}`}
                >
                  <Icon size={20} />
                </div>
              </div>

              <p className="mt-4 text-xs text-[#87938E]">{s.label}</p>
              <div className="mt-1 flex items-baseline justify-between">
                <p className="text-2xl font-bold text-[#17201D] dark:text-white">
                  {s.value}
                </p>
                <p className="text-[11px] text-[#87938E]">{s.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-[#E5E2D9] bg-white p-4 sm:flex-row sm:items-center sm:justify-between dark:border-white/10 dark:bg-[#17201D]">
        <div className="relative w-full max-w-xs">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A9691]"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search medicine..."
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

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-xl border border-[#E3E0D7] bg-[#FAFAF7] px-3 py-2 text-sm text-[#52615B] outline-none focus:border-[#0F766E] dark:border-white/10 dark:bg-[#202B27] dark:text-[#AAB6B0]"
          >
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-xl border border-[#E3E0D7] bg-[#FAFAF7] px-3 py-2 text-sm text-[#52615B] outline-none focus:border-[#0F766E] dark:border-white/10 dark:bg-[#202B27] dark:text-[#AAB6B0]"
          >
            {statuses.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Medicine Cards Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((m) => {
          const stockPct = Math.round((m.stock / m.capacity) * 100);

          return (
            <div
              key={m.itemId}
              className="rounded-2xl border border-[#E5E2D9] bg-white p-5 dark:border-white/10 dark:bg-[#17201D]"
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0F766E]/10 text-[#0F766E] dark:bg-[#0F766E]/20 dark:text-[#5EEAD4]">
                    <Pill size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-[#17201D] dark:text-white">
                      {m.name}
                    </p>
                    <p className="text-xs text-[#87938E]">{m.itemId}</p>
                  </div>
                </div>

                <div className="relative">
                  <button
                    onClick={() =>
                      setOpenMenuId(
                        openMenuId === m.itemId ? null : m.itemId
                      )
                    }
                    className="rounded-lg p-1.5 text-[#64746E] hover:bg-[#F1F3EF] hover:text-[#0F766E] dark:text-[#AAB6B0] dark:hover:bg-white/10"
                  >
                    <MoreVertical size={17} />
                  </button>

                  {openMenuId === m.itemId && (
                    <div className="absolute right-0 top-9 z-10 w-36 overflow-hidden rounded-xl border border-[#DDD9CE] bg-white shadow-xl dark:border-white/10 dark:bg-[#202B27]">
                      <Link
                        href={`/pharmacy/${m.itemId}/edit`}
                        className="block px-3 py-2.5 text-left text-sm text-[#52615B] hover:bg-[#E7F5F2] hover:text-[#0F766E] dark:text-[#AAB6B0] dark:hover:bg-[#0F766E]/20 dark:hover:text-[#5EEAD4]"
                      >
                        Edit
                      </Link>
                      <button className="block w-full px-3 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10">
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Badges */}
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full bg-[#F1F3EF] px-2.5 py-1 text-[11px] font-semibold text-[#52615B] dark:bg-white/10 dark:text-[#AAB6B0]">
                  {m.category}
                </span>
                <span className="rounded-full bg-[#F1F3EF] px-2.5 py-1 text-[11px] font-semibold text-[#52615B] dark:bg-white/10 dark:text-[#AAB6B0]">
                  {m.form}
                </span>
              </div>

              {/* Stock Bar */}
              <div className="mt-4 rounded-xl border border-[#EEECE5] p-3 dark:border-white/10">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-semibold text-[#17201D] dark:text-white">
                    <Package size={13} className="text-[#8A9691]" />
                    Stock Level
                  </div>
                  <span className="font-bold text-[#0F766E] dark:text-[#5EEAD4]">
                    {stockPct}%
                  </span>
                </div>

                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[#EEECE5] dark:bg-white/10">
                  <div
                    className="h-full rounded-full bg-[#0F766E]"
                    style={{ width: `${stockPct}%` }}
                  />
                </div>

                <div className="mt-3 grid grid-cols-3 text-center text-xs">
                  <div>
                    <p className="text-[#87938E]">In Stock</p>
                    <p className="font-bold text-[#17201D] dark:text-white">
                      {m.stock}
                    </p>
                  </div>
                  <div>
                    <p className="text-[#87938E]">Reorder At</p>
                    <p className="font-bold text-[#17201D] dark:text-white">
                      {m.reorderLevel}
                    </p>
                  </div>
                  <div>
                    <p className="text-[#87938E]">Capacity</p>
                    <p className="font-bold text-[#17201D] dark:text-white">
                      {m.capacity}
                    </p>
                  </div>
                </div>
              </div>

              {/* Price + Supplier */}
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-[#EEECE5] p-3 dark:border-white/10">
                  <p className="text-[11px] text-[#87938E]">Unit Price</p>
                  <p className="mt-0.5 font-bold text-[#17201D] dark:text-white">
                    ₹{m.unitPrice}
                  </p>
                </div>
                <div className="rounded-xl border border-[#EEECE5] p-3 dark:border-white/10">
                  <p className="text-[11px] text-[#87938E]">Expiry</p>
                  <p className="mt-0.5 font-bold text-[#17201D] dark:text-white">
                    {m.expiryDate}
                  </p>
                </div>
              </div>

              {/* Supplier */}
              <div className="mt-3 flex items-center gap-2 text-xs text-[#52615B] dark:text-[#AAB6B0]">
                <User size={13} className="text-[#8A9691]" />
                <span className="truncate">{m.supplier}</span>
              </div>

              {/* Footer */}
              <div className="mt-4 flex items-center justify-between border-t border-[#EEECE5] pt-3 dark:border-white/10">
                <span
                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${statusStyles[m.status]}`}
                >
                  {m.status}
                </span>

                <Link
                  href={`/pharmacy/${m.itemId}`}
                  className="text-xs font-semibold text-[#0F766E] hover:underline dark:text-[#5EEAD4]"
                >
                  View Details →
                </Link>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <p className="col-span-full py-10 text-center text-sm text-[#87938E]">
            No medicines found.
          </p>
        )}
      </div>
    </div>
  );
}
