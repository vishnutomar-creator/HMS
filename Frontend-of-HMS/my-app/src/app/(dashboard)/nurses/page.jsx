"use client";

import Link from "next/link";
import {
  Activity,
  CalendarDays,
  ChevronRight,
  Clock3,
  Mail,
  MoreHorizontal,
  Phone,
  Plus,
  Search,
  ShieldCheck,
  UserRound,
  Users,
} from "lucide-react";

const nurses = [
  {
    id: "NUR-1001",
    name: "Anjali Verma",
    department: "Cardiology",
    ward: "Ward A-201",
    shift: "Morning",
    experience: "8 Years",
    phone: "+91 98765 11223",
    email: "anjali.verma@medicare.com",
    patients: 8,
    status: "On Duty",
    initials: "AV",
  },
  {
    id: "NUR-1002",
    name: "Priya Sharma",
    department: "Neurology",
    ward: "Ward B-305",
    shift: "Morning",
    experience: "6 Years",
    phone: "+91 98765 22334",
    email: "priya.sharma@medicare.com",
    patients: 6,
    status: "On Duty",
    initials: "PS",
  },
  {
    id: "NUR-1003",
    name: "Neha Singh",
    department: "Orthopedics",
    ward: "Ward A-302",
    shift: "Evening",
    experience: "5 Years",
    phone: "+91 98765 33445",
    email: "neha.singh@medicare.com",
    patients: 7,
    status: "On Duty",
    initials: "NS",
  },
  {
    id: "NUR-1004",
    name: "Ritika Patel",
    department: "Pediatrics",
    ward: "Ward C-102",
    shift: "Morning",
    experience: "4 Years",
    phone: "+91 98765 44556",
    email: "ritika.patel@medicare.com",
    patients: 5,
    status: "On Leave",
    initials: "RP",
  },
  {
    id: "NUR-1005",
    name: "Kavita Joshi",
    department: "General Medicine",
    ward: "Ward A-105",
    shift: "Night",
    experience: "10 Years",
    phone: "+91 98765 55667",
    email: "kavita.joshi@medicare.com",
    patients: 9,
    status: "On Duty",
    initials: "KJ",
  },
  {
    id: "NUR-1006",
    name: "Megha Gupta",
    department: "Emergency",
    ward: "Emergency Unit",
    shift: "Night",
    experience: "7 Years",
    phone: "+91 98765 66778",
    email: "megha.gupta@medicare.com",
    patients: 11,
    status: "On Duty",
    initials: "MG",
  },
  {
    id: "NUR-1007",
    name: "Pooja Mehta",
    department: "Radiology",
    ward: "Diagnostic Unit",
    shift: "Evening",
    experience: "3 Years",
    phone: "+91 98765 77889",
    email: "pooja.mehta@medicare.com",
    patients: 4,
    status: "Off Duty",
    initials: "PM",
  },
  {
    id: "NUR-1008",
    name: "Sneha Kapoor",
    department: "General Medicine",
    ward: "Ward B-201",
    shift: "Morning",
    experience: "9 Years",
    phone: "+91 98765 88990",
    email: "sneha.kapoor@medicare.com",
    patients: 8,
    status: "On Duty",
    initials: "SK",
  },
];

export default function NursesPage() {
  return (
    <div className="min-h-screen bg-[#F7F4ED] p-4 sm:p-6 lg:p-7 dark:bg-[#101614]">

      {/* ================= HEADER ================= */}

      <div className="mb-7 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">

        <div>

          <div className="flex items-center gap-2 text-xs text-[#87938E]">
            <span>Hospital</span>
            <ChevronRight size={13} />
            <span className="text-[#0F766E]">
              Nurses
            </span>
          </div>

          <h1 className="mt-2 text-2xl font-bold text-[#17201D] sm:text-3xl dark:text-white">
            Nurses
          </h1>

          <p className="mt-1 text-sm text-[#7B8882] dark:text-[#87938E]">
            Manage nursing staff, shifts, wards and patient assignments.
          </p>

        </div>

        <Link
          href="/nurses/add"
          className="flex w-fit items-center gap-2 rounded-xl bg-[#0F766E] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0B625C]"
        >
          <Plus size={17} />
          Add Nurse
        </Link>

      </div>


      {/* ================= STATS ================= */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="Total Nurses"
          value="286"
          subtitle="Registered staff"
          icon={<Users size={20} />}
          iconBg="bg-[#E7F5F2]"
          iconColor="text-[#0F766E]"
        />

        <StatCard
          title="On Duty"
          value="184"
          subtitle="Currently working"
          icon={<Activity size={20} />}
          iconBg="bg-[#ECFDF5]"
          iconColor="text-[#0F766E]"
        />

        <StatCard
          title="On Leave"
          value="27"
          subtitle="Currently away"
          icon={<CalendarDays size={20} />}
          iconBg="bg-[#FFF3E8]"
          iconColor="text-[#C87924]"
        />

        <StatCard
          title="Patients Assigned"
          value="509"
          subtitle="Active patients"
          icon={<UserRound size={20} />}
          iconBg="bg-[#EEF2FF]"
          iconColor="text-[#5367B8]"
        />

      </div>


      {/* ================= SEARCH / FILTER ================= */}

      <div className="mt-6 rounded-2xl border border-[#E3E0D7] bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#18211E]">

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">

          <div className="relative w-full lg:max-w-[360px]">

            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9AA49F]"
            />

            <input
              type="text"
              placeholder="Search nurse..."
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
              <option>Emergency</option>
              <option>General Medicine</option>
            </select>


            <select className="rounded-xl border border-[#E3E0D7] bg-[#FAFAF7] px-4 py-2.5 text-xs font-medium text-[#52615B] outline-none focus:border-[#0F766E] dark:border-white/10 dark:bg-[#202B27] dark:text-[#AAB6B0]">
              <option>All Shifts</option>
              <option>Morning</option>
              <option>Evening</option>
              <option>Night</option>
            </select>


            <select className="rounded-xl border border-[#E3E0D7] bg-[#FAFAF7] px-4 py-2.5 text-xs font-medium text-[#52615B] outline-none focus:border-[#0F766E] dark:border-white/10 dark:bg-[#202B27] dark:text-[#AAB6B0]">
              <option>All Status</option>
              <option>On Duty</option>
              <option>Off Duty</option>
              <option>On Leave</option>
            </select>

          </div>

        </div>

      </div>


      {/* ================= NURSE TABLE ================= */}

      <div className="mt-6 overflow-hidden rounded-2xl border border-[#E3E0D7] bg-white shadow-sm dark:border-white/10 dark:bg-[#18211E]">

        <div className="flex items-center justify-between border-b border-[#EEECE5] px-5 py-4 dark:border-white/10">

          <div>

            <h2 className="text-sm font-bold text-[#17201D] dark:text-white">
              Nursing Staff Directory
            </h2>

            <p className="mt-1 text-xs text-[#87938E]">
              286 registered nurses
            </p>

          </div>

          <div className="hidden items-center gap-2 rounded-xl bg-[#ECFDF5] px-3 py-2 sm:flex">

            <ShieldCheck
              size={14}
              className="text-[#0F766E]"
            />

            <span className="text-[9px] font-bold text-[#0F766E]">
              Staff Verified
            </span>

          </div>

        </div>


        <div className="overflow-x-auto">

          <table className="w-full min-w-[1050px]">

            <thead>

              <tr className="border-b border-[#EEECE5] dark:border-white/10">

                <TableHead>
                  Nurse
                </TableHead>

                <TableHead>
                  Department
                </TableHead>

                <TableHead>
                  Ward
                </TableHead>

                <TableHead>
                  Contact
                </TableHead>

                <TableHead>
                  Shift
                </TableHead>

                <TableHead>
                  Patients
                </TableHead>

                <TableHead>
                  Status
                </TableHead>

                <th className="px-5 py-3" />

              </tr>

            </thead>


            <tbody>

              {nurses.map((nurse) => (

                <tr
                  key={nurse.id}
                  className="border-b border-[#F0EEE8] last:border-0 hover:bg-[#FAFAF7] dark:border-white/5 dark:hover:bg-white/[0.02]"
                >

                  {/* Nurse */}

                  <td className="px-5 py-4">

                    <Link
                      href={`/nurses/${nurse.id}`}
                      className="flex items-center gap-3"
                    >

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E7F5F2] text-xs font-bold text-[#0F766E]">
                        {nurse.initials}
                      </div>

                      <div>

                        <p className="text-xs font-bold text-[#17201D] hover:text-[#0F766E] dark:text-white">
                          {nurse.name}
                        </p>

                        <p className="mt-0.5 text-[10px] text-[#87938E]">
                          {nurse.experience}
                        </p>

                        <p className="mt-0.5 text-[9px] text-[#A1AAA6]">
                          {nurse.id}
                        </p>

                      </div>

                    </Link>

                  </td>


                  {/* Department */}

                  <td className="px-5 py-4">

                    <p className="text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">
                      {nurse.department}
                    </p>

                  </td>


                  {/* Ward */}

                  <td className="px-5 py-4">

                    <div className="flex items-center gap-2">

                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F1F3EF] text-[#0F766E] dark:bg-white/5">
                        <Activity size={13} />
                      </div>

                      <span className="text-xs font-medium text-[#52615B] dark:text-[#AAB6B0]">
                        {nurse.ward}
                      </span>

                    </div>

                  </td>


                  {/* Contact */}

                  <td className="px-5 py-4">

                    <div className="space-y-1">

                      <p className="flex items-center gap-1.5 text-[10px] text-[#52615B] dark:text-[#AAB6B0]">
                        <Phone size={11} />
                        {nurse.phone}
                      </p>

                      <p className="flex items-center gap-1.5 text-[10px] text-[#87938E]">
                        <Mail size={11} />
                        {nurse.email}
                      </p>

                    </div>

                  </td>


                  {/* Shift */}

                  <td className="px-5 py-4">

                    <span className="flex items-center gap-1.5 text-xs text-[#52615B] dark:text-[#AAB6B0]">
                      <Clock3 size={13} />
                      {nurse.shift}
                    </span>

                  </td>


                  {/* Patients */}

                  <td className="px-5 py-4">

                    <div className="flex items-center gap-2">

                      <Users
                        size={14}
                        className="text-[#0F766E]"
                      />

                      <span className="text-xs font-bold text-[#17201D] dark:text-white">
                        {nurse.patients}
                      </span>

                    </div>

                  </td>


                  {/* Status */}

                  <td className="px-5 py-4">

                    <Status status={nurse.status} />

                  </td>


                  {/* Actions */}

                  <td className="px-5 py-4">

                    <button className="flex h-8 w-8 items-center justify-center rounded-lg text-[#87938E] hover:bg-[#E7F5F2] hover:text-[#0F766E]">
                      <MoreHorizontal size={17} />
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>


      {/* ================= FOOTER INFO ================= */}

      <div className="mt-6 flex flex-col justify-between gap-3 rounded-2xl border border-[#E3E0D7] bg-white px-5 py-4 shadow-sm sm:flex-row sm:items-center dark:border-white/10 dark:bg-[#18211E]">

        <div className="flex items-center gap-3">

          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E7F5F2] text-[#0F766E]">
            <ShieldCheck size={17} />
          </div>

          <div>

            <p className="text-xs font-bold text-[#17201D] dark:text-white">
              Nursing Operations
            </p>

            <p className="mt-0.5 text-[10px] text-[#87938E]">
              Nursing staff schedules and patient assignments are up to date.
            </p>

          </div>

        </div>

        <span className="rounded-full bg-[#ECFDF5] px-3 py-1.5 text-[9px] font-bold text-[#0F766E]">
          184 Nurses On Duty
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

      <div className="flex h-11 w-11 items-center justify-center rounded-xl">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconBg} ${iconColor}`}
        >
          {icon}
        </div>
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
   TABLE HEAD
============================================================ */

function TableHead({ children }) {
  return (
    <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-[#9AA49F]">
      {children}
    </th>
  );
}


/* ============================================================
   STATUS
============================================================ */

function Status({ status }) {

  const styles = {
    "On Duty":
      "bg-[#ECFDF5] text-[#0F766E]",

    "Off Duty":
      "bg-[#F1F3EF] text-[#66736D]",

    "On Leave":
      "bg-[#FFF3E8] text-[#C87924]",
  };

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[9px] font-bold ${
        styles[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
}