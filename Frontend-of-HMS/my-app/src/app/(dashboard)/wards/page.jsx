"use client";

import Link from "next/link";
import {
  Activity,
  BedDouble,
  Building2,
  ChevronRight,
  ClipboardList,
  MoreHorizontal,
  Plus,
  Search,
  ShieldCheck,
  UserRound,
  Users,
} from "lucide-react";

const wards = [
  {
    id: "WRD-001",
    name: "Cardiology Ward A",
    department: "Cardiology",
    floor: "2nd Floor",
    totalBeds: 42,
    occupiedBeds: 28,
    availableBeds: 14,
    nurses: 12,
    patients: 28,
    headNurse: "Anjali Verma",
    type: "General",
    status: "Operational",
  },
  {
    id: "WRD-002",
    name: "Neurology Ward B",
    department: "Neurology",
    floor: "3rd Floor",
    totalBeds: 36,
    occupiedBeds: 27,
    availableBeds: 9,
    nurses: 10,
    patients: 27,
    headNurse: "Priya Sharma",
    type: "General",
    status: "Operational",
  },
  {
    id: "WRD-003",
    name: "Orthopedic Ward A",
    department: "Orthopedics",
    floor: "3rd Floor",
    totalBeds: 40,
    occupiedBeds: 29,
    availableBeds: 11,
    nurses: 11,
    patients: 29,
    headNurse: "Neha Singh",
    type: "General",
    status: "Operational",
  },
  {
    id: "WRD-004",
    name: "Pediatric Ward",
    department: "Pediatrics",
    floor: "1st Floor",
    totalBeds: 30,
    occupiedBeds: 22,
    availableBeds: 8,
    nurses: 9,
    patients: 22,
    headNurse: "Ritika Patel",
    type: "Pediatric",
    status: "Operational",
  },
  {
    id: "WRD-005",
    name: "ICU",
    department: "Critical Care",
    floor: "Ground Floor",
    totalBeds: 20,
    occupiedBeds: 17,
    availableBeds: 3,
    nurses: 16,
    patients: 17,
    headNurse: "Kavita Joshi",
    type: "Critical Care",
    status: "High Occupancy",
  },
  {
    id: "WRD-006",
    name: "Emergency Unit",
    department: "Emergency",
    floor: "Ground Floor",
    totalBeds: 32,
    occupiedBeds: 26,
    availableBeds: 6,
    nurses: 18,
    patients: 26,
    headNurse: "Megha Gupta",
    type: "Emergency",
    status: "Operational",
  },
  {
    id: "WRD-007",
    name: "General Medicine Ward",
    department: "General Medicine",
    floor: "1st Floor",
    totalBeds: 60,
    occupiedBeds: 39,
    availableBeds: 21,
    nurses: 15,
    patients: 39,
    headNurse: "Sneha Kapoor",
    type: "General",
    status: "Operational",
  },
  {
    id: "WRD-008",
    name: "Private Care Ward",
    department: "General Medicine",
    floor: "4th Floor",
    totalBeds: 24,
    occupiedBeds: 12,
    availableBeds: 12,
    nurses: 7,
    patients: 12,
    headNurse: "Pooja Mehta",
    type: "Private",
    status: "Operational",
  },
];

export default function WardsPage() {
  return (
    <div className="min-h-screen bg-[#F7F4ED] p-4 sm:p-6 lg:p-7 dark:bg-[#101614]">

      {/* ================= HEADER ================= */}

      <div className="mb-7 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">

        <div>
          <div className="flex items-center gap-2 text-xs text-[#87938E]">
            <span>Hospital</span>
            <ChevronRight size={13} />
            <span className="text-[#0F766E]">Wards</span>
          </div>

          <h1 className="mt-2 text-2xl font-bold text-[#17201D] sm:text-3xl dark:text-white">
            Wards
          </h1>

          <p className="mt-1 text-sm text-[#7B8882] dark:text-[#87938E]">
            Manage hospital wards, bed capacity, occupancy and nursing staff.
          </p>
        </div>

        <Link
          href="/wards/add"
          className="flex w-fit items-center gap-2 rounded-xl bg-[#0F766E] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0B625C]"
        >
          <Plus size={17} />
          Add Ward
        </Link>

      </div>


      {/* ================= STATS ================= */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="Total Wards"
          value="24"
          subtitle="Hospital units"
          icon={<Building2 size={20} />}
          iconBg="bg-[#E7F5F2]"
          iconColor="text-[#0F766E]"
        />

        <StatCard
          title="Total Beds"
          value="428"
          subtitle="Total capacity"
          icon={<BedDouble size={20} />}
          iconBg="bg-[#EEF2FF]"
          iconColor="text-[#5367B8]"
        />

        <StatCard
          title="Occupied Beds"
          value="286"
          subtitle="66.8% occupancy"
          icon={<Users size={20} />}
          iconBg="bg-[#FFF3E8]"
          iconColor="text-[#C87924]"
        />

        <StatCard
          title="Available Beds"
          value="142"
          subtitle="Ready for admission"
          icon={<Activity size={20} />}
          iconBg="bg-[#ECFDF5]"
          iconColor="text-[#0F766E]"
        />

      </div>


      {/* ================= SEARCH / FILTER ================= */}

      <div className="mt-6 rounded-2xl border border-[#E3E0D7] bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#18211E]">

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">

          <div className="relative w-full lg:max-w-[380px]">

            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9AA49F]"
            />

            <input
              type="text"
              placeholder="Search ward..."
              className="w-full rounded-xl border border-[#E3E0D7] bg-[#FAFAF7] py-2.5 pl-10 pr-4 text-xs text-[#17201D] outline-none placeholder:text-[#9AA49F] focus:border-[#0F766E] focus:ring-4 focus:ring-[#0F766E]/10 dark:border-white/10 dark:bg-[#202B27] dark:text-white"
            />

          </div>

          <div className="flex flex-wrap gap-2">

            <select className="rounded-xl border border-[#E3E0D7] bg-[#FAFAF7] px-4 py-2.5 text-xs font-medium text-[#52615B] outline-none focus:border-[#0F766E] dark:border-white/10 dark:bg-[#202B27] dark:text-[#AAB6B0]">
              <option>All Departments</option>
              <option>Cardiology</option>
              <option>Neurology</option>
              <option>Orthopedics</option>
              <option>Pediatrics</option>
              <option>Critical Care</option>
              <option>Emergency</option>
              <option>General Medicine</option>
            </select>

            <select className="rounded-xl border border-[#E3E0D7] bg-[#FAFAF7] px-4 py-2.5 text-xs font-medium text-[#52615B] outline-none focus:border-[#0F766E] dark:border-white/10 dark:bg-[#202B27] dark:text-[#AAB6B0]">
              <option>All Ward Types</option>
              <option>General</option>
              <option>Private</option>
              <option>Pediatric</option>
              <option>Critical Care</option>
              <option>Emergency</option>
            </select>

            <select className="rounded-xl border border-[#E3E0D7] bg-[#FAFAF7] px-4 py-2.5 text-xs font-medium text-[#52615B] outline-none focus:border-[#0F766E] dark:border-white/10 dark:bg-[#202B27] dark:text-[#AAB6B0]">
              <option>All Status</option>
              <option>Operational</option>
              <option>High Occupancy</option>
              <option>Maintenance</option>
            </select>

          </div>

        </div>

      </div>


      {/* ================= WARD CARDS ================= */}

      <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">

        {wards.map((ward) => (
          <WardCard
            key={ward.id}
            ward={ward}
          />
        ))}

      </div>


      {/* ================= FOOTER INFO ================= */}

      <div className="mt-6 flex flex-col justify-between gap-3 rounded-2xl border border-[#E3E0D7] bg-white px-5 py-4 shadow-sm sm:flex-row sm:items-center dark:border-white/10 dark:bg-[#18211E]">

        <div className="flex items-center gap-3">

          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E7F5F2] text-[#0F766E]">
            <ShieldCheck size={17} />
          </div>

          <div>
            <p className="text-xs font-bold text-[#17201D] dark:text-white">
              Ward Operations
            </p>

            <p className="mt-0.5 text-[10px] text-[#87938E]">
              All active wards are being monitored for bed availability.
            </p>
          </div>

        </div>

        <span className="rounded-full bg-[#ECFDF5] px-3 py-1.5 text-[9px] font-bold text-[#0F766E]">
          142 Beds Available
        </span>

      </div>

    </div>
  );
}


/* ============================================================
   STAT CARD
============================================================ */

function StatCard({
  title,
  value,
  subtitle,
  icon,
  iconBg,
  iconColor,
}) {
  return (
    <div className="rounded-2xl border border-[#E3E0D7] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-[#18211E]">

      <div
        className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconBg} ${iconColor}`}
      >
        {icon}
      </div>

      <p className="mt-5 text-xs font-medium text-[#87938E]">
        {title}
      </p>

      <div className="mt-1 flex items-end justify-between">

        <p className="text-2xl font-bold text-[#17201D] dark:text-white">
          {value}
        </p>

        <span className="mb-1 text-[9px] font-semibold text-[#87938E]">
          {subtitle}
        </span>

      </div>

    </div>
  );
}


/* ============================================================
   WARD CARD
============================================================ */

function WardCard({ ward }) {
  const occupancy = Math.round(
    (ward.occupiedBeds / ward.totalBeds) * 100
  );

  const isHighOccupancy = occupancy >= 80;

  return (
    <div className="group rounded-2xl border border-[#E3E0D7] bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg dark:border-white/10 dark:bg-[#18211E]">

      {/* Header */}

      <div className="flex items-start justify-between">

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E7F5F2] text-[#0F766E]">
            <Building2 size={20} />
          </div>

          <div>

            <h2 className="text-sm font-bold text-[#17201D] dark:text-white">
              {ward.name}
            </h2>

            <p className="mt-0.5 text-[9px] text-[#A1AAA6]">
              {ward.id}
            </p>

          </div>

        </div>

        <button className="flex h-8 w-8 items-center justify-center rounded-lg text-[#87938E] hover:bg-[#E7F5F2] hover:text-[#0F766E]">
          <MoreHorizontal size={17} />
        </button>

      </div>


      {/* Department / Floor */}

      <div className="mt-4 flex flex-wrap gap-2">

        <span className="rounded-full bg-[#F1F3EF] px-2.5 py-1 text-[9px] font-semibold text-[#66736D] dark:bg-white/5 dark:text-[#AAB6B0]">
          {ward.department}
        </span>

        <span className="rounded-full bg-[#E7F5F2] px-2.5 py-1 text-[9px] font-semibold text-[#0F766E]">
          {ward.floor}
        </span>

        <span className="rounded-full bg-[#EEF2FF] px-2.5 py-1 text-[9px] font-semibold text-[#5367B8]">
          {ward.type}
        </span>

      </div>


      {/* Bed Occupancy */}

      <div className="mt-5 rounded-xl bg-[#FAFAF7] p-4 dark:bg-[#202B27]">

        <div className="flex items-center justify-between">

          <div className="flex items-center gap-2">

            <BedDouble
              size={16}
              className="text-[#0F766E]"
            />

            <span className="text-xs font-bold text-[#52615B] dark:text-[#AAB6B0]">
              Bed Occupancy
            </span>

          </div>

          <span
            className={`text-xs font-bold ${
              isHighOccupancy
                ? "text-[#C84B4B]"
                : "text-[#0F766E]"
            }`}
          >
            {occupancy}%
          </span>

        </div>


        <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#E7E8E3] dark:bg-white/10">

          <div
            className={`h-full rounded-full ${
              isHighOccupancy
                ? "bg-[#C84B4B]"
                : "bg-[#0F766E]"
            }`}
            style={{
              width: `${occupancy}%`,
            }}
          />

        </div>


        <div className="mt-3 flex justify-between">

          <div>
            <p className="text-[9px] text-[#9AA49F]">
              Occupied
            </p>

            <p className="mt-0.5 text-sm font-bold text-[#17201D] dark:text-white">
              {ward.occupiedBeds}
            </p>
          </div>

          <div className="text-right">
            <p className="text-[9px] text-[#9AA49F]">
              Available
            </p>

            <p className="mt-0.5 text-sm font-bold text-[#0F766E]">
              {ward.availableBeds}
            </p>
          </div>

          <div className="text-right">
            <p className="text-[9px] text-[#9AA49F]">
              Total
            </p>

            <p className="mt-0.5 text-sm font-bold text-[#17201D] dark:text-white">
              {ward.totalBeds}
            </p>
          </div>

        </div>

      </div>


      {/* Staff */}

      <div className="mt-5 grid grid-cols-2 gap-3">

        <MiniStat
          icon={<Users size={14} />}
          label="Patients"
          value={ward.patients}
        />

        <MiniStat
          icon={<UserRound size={14} />}
          label="Nurses"
          value={ward.nurses}
        />

      </div>


      {/* Head Nurse */}

      <div className="mt-5 flex items-center gap-3">

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EEF2FF] text-[#5367B8]">
          <UserRound size={15} />
        </div>

        <div>

          <p className="text-[9px] text-[#9AA49F]">
            Head Nurse
          </p>

          <p className="mt-0.5 text-xs font-bold text-[#52615B] dark:text-[#AAB6B0]">
            {ward.headNurse}
          </p>

        </div>

      </div>


      {/* Footer */}

      <div className="mt-5 flex items-center justify-between border-t border-[#EEECE5] pt-4 dark:border-white/10">

        <span
          className={`rounded-full px-2.5 py-1 text-[9px] font-bold ${
            isHighOccupancy
              ? "bg-[#FFF1F1] text-[#C84B4B]"
              : "bg-[#ECFDF5] text-[#0F766E]"
          }`}
        >
          {ward.status}
        </span>

        <Link
          href={`/wards/${ward.id}`}
          className="flex items-center gap-1 text-[10px] font-bold text-[#0F766E] transition hover:gap-2"
        >
          View Details
          <ChevronRight size={13} />
        </Link>

      </div>

    </div>
  );
}


/* ============================================================
   MINI STAT
============================================================ */

function MiniStat({
  icon,
  label,
  value,
}) {
  return (
    <div className="rounded-xl border border-[#EEECE5] bg-[#FAFAF7] px-3 py-3 dark:border-white/10 dark:bg-[#202B27]">

      <div className="flex items-center gap-2 text-[#0F766E]">
        {icon}

        <span className="text-[9px] text-[#87938E]">
          {label}
        </span>
      </div>

      <p className="mt-1 text-lg font-bold text-[#17201D] dark:text-white">
        {value}
      </p>

    </div>
  );
}