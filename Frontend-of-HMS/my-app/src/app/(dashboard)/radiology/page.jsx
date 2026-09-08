"use client";

import {
  Activity,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileText,
  Image as ImageIcon,
  MoreHorizontal,
  ScanLine,
  Search,
  Upload,
  UserRound,
  XCircle,
} from "lucide-react";

const studies = [
  {
    id: "RAD-10482",
    patient: "Aarav Sharma",
    patientId: "PT-8921",
    modality: "MRI",
    bodyPart: "Brain",
    doctor: "Dr. Ankit Sharma",
    date: "12 Aug 2026",
    time: "09:30 AM",
    status: "Report Ready",
  },
  {
    id: "RAD-10481",
    patient: "Priya Verma",
    patientId: "PT-8918",
    modality: "CT",
    bodyPart: "Chest",
    doctor: "Dr. Neha Gupta",
    date: "12 Aug 2026",
    time: "10:15 AM",
    status: "In Progress",
  },
  {
    id: "RAD-10480",
    patient: "Rahul Singh",
    patientId: "PT-8912",
    modality: "X-Ray",
    bodyPart: "Chest",
    doctor: "Dr. Raj Mehta",
    date: "12 Aug 2026",
    time: "11:00 AM",
    status: "Scheduled",
  },
  {
    id: "RAD-10479",
    patient: "Ananya Patel",
    patientId: "PT-8907",
    modality: "Ultrasound",
    bodyPart: "Abdomen",
    doctor: "Dr. Riya Kapoor",
    date: "12 Aug 2026",
    time: "11:45 AM",
    status: "Report Ready",
  },
  {
    id: "RAD-10478",
    patient: "Vikram Joshi",
    patientId: "PT-8901",
    modality: "CT",
    bodyPart: "Head",
    doctor: "Dr. Ankit Sharma",
    date: "12 Aug 2026",
    time: "12:30 PM",
    status: "Pending Review",
  },
];

const modalities = [
  {
    name: "X-Ray",
    total: 86,
    percentage: 78,
    icon: ScanLine,
    iconBg: "bg-[#E7F5F2]",
    iconColor: "text-[#0F766E]",
    bar: "bg-[#0F766E]",
  },
  {
    name: "CT Scan",
    total: 42,
    percentage: 62,
    icon: ImageIcon,
    iconBg: "bg-[#EEF2FF]",
    iconColor: "text-[#5367B8]",
    bar: "bg-[#5367B8]",
  },
  {
    name: "MRI",
    total: 28,
    percentage: 48,
    icon: Activity,
    iconBg: "bg-[#F2ECFA]",
    iconColor: "text-[#7954A6]",
    bar: "bg-[#7954A6]",
  },
  {
    name: "Ultrasound",
    total: 35,
    percentage: 56,
    icon: ScanLine,
    iconBg: "bg-[#FFF3E8]",
    iconColor: "text-[#C87924]",
    bar: "bg-[#C87924]",
  },
];

const activities = [
  {
    title: "MRI report verified",
    description: "Dr. Mehta verified RAD-10482",
    time: "8 min ago",
    icon: CheckCircle2,
    color: "bg-[#E7F5F2] text-[#0F766E]",
  },
  {
    title: "New CT scan uploaded",
    description: "Images uploaded for Priya Verma",
    time: "22 min ago",
    icon: Upload,
    color: "bg-[#EEF2FF] text-[#5367B8]",
  },
  {
    title: "X-Ray study completed",
    description: "Chest X-Ray for Rahul Singh",
    time: "35 min ago",
    icon: ScanLine,
    color: "bg-[#FFF3E8] text-[#C87924]",
  },
  {
    title: "Report pending review",
    description: "RAD-10478 requires verification",
    time: "48 min ago",
    icon: Clock3,
    color: "bg-[#F2ECFA] text-[#7954A6]",
  },
];

export default function RadiologyPage() {
  return (
    <div className="min-h-screen bg-[#F7F4ED] p-4 sm:p-6 lg:p-7 dark:bg-[#101614]">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="mb-7 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">

        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-[#87938E] dark:text-[#71817B]">
            <span>Hospital</span>
            <ChevronRight size={13} />
            <span className="text-[#0F766E]">
              Radiology
            </span>
          </div>

          <h1 className="mt-2 text-2xl font-bold tracking-tight text-[#17201D] sm:text-3xl dark:text-white">
            Radiology
          </h1>

          <p className="mt-1 text-sm text-[#7B8882] dark:text-[#87938E]">
            Manage imaging studies, reports and diagnostic workflows.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">

          <button className="flex items-center gap-2 rounded-xl border border-[#DDD9CE] bg-white px-4 py-2.5 text-sm font-semibold text-[#52615B] transition hover:border-[#0F766E] hover:text-[#0F766E] dark:border-white/10 dark:bg-[#18211E] dark:text-[#AAB6B0]">
            <CalendarDays size={16} />
            Today
          </button>

          <button className="flex items-center gap-2 rounded-xl bg-[#0F766E] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0B625C]">
            <Upload size={16} />
            Upload Study
          </button>

        </div>

      </div>


      {/* =====================================================
          STAT CARDS
      ====================================================== */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="Today's Studies"
          value="191"
          change="+12.4%"
          icon={<ImageIcon size={21} />}
          iconBg="bg-[#E7F5F2]"
          iconColor="text-[#0F766E]"
        />

        <StatCard
          title="Pending Reports"
          value="24"
          change="Needs attention"
          icon={<FileText size={21} />}
          iconBg="bg-[#FFF3E8]"
          iconColor="text-[#C87924]"
          warning
        />

        <StatCard
          title="Reports Verified"
          value="142"
          change="+8.6%"
          icon={<CheckCircle2 size={21} />}
          iconBg="bg-[#EEF2FF]"
          iconColor="text-[#5367B8]"
        />

        <StatCard
          title="Equipment Usage"
          value="76%"
          change="+4.2%"
          icon={<Activity size={21} />}
          iconBg="bg-[#F2ECFA]"
          iconColor="text-[#7954A6]"
        />

      </div>


      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.6fr_1fr]">

        {/* Modality Overview */}

        <div className="rounded-2xl border border-[#E3E0D7] bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#18211E]">

          <div className="flex items-center justify-between">

            <div>
              <h2 className="text-sm font-bold text-[#17201D] dark:text-white">
                Imaging Overview
              </h2>

              <p className="mt-1 text-xs text-[#87938E]">
                Today's studies by modality
              </p>
            </div>

            <select className="rounded-lg border border-[#E3E0D7] bg-[#FAFAF7] px-3 py-2 text-[10px] font-semibold text-[#52615B] outline-none dark:border-white/10 dark:bg-[#202B27] dark:text-[#AAB6B0]">
              <option>Today</option>
              <option>This Week</option>
              <option>This Month</option>
            </select>

          </div>


          <div className="mt-7 grid gap-4 sm:grid-cols-2">

            {modalities.map((item) => {

              const Icon = item.icon;

              return (
                <div
                  key={item.name}
                  className="rounded-2xl border border-[#EEECE5] p-4 dark:border-white/10"
                >

                  <div className="flex items-center justify-between">

                    <div className="flex items-center gap-3">

                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.iconBg} ${item.iconColor}`}
                      >
                        <Icon size={19} />
                      </div>

                      <div>
                        <p className="text-xs font-bold text-[#17201D] dark:text-white">
                          {item.name}
                        </p>

                        <p className="mt-0.5 text-[10px] text-[#87938E]">
                          {item.total} studies
                        </p>
                      </div>

                    </div>

                    <span className="text-xs font-bold text-[#52615B] dark:text-[#AAB6B0]">
                      {item.percentage}%
                    </span>

                  </div>

                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#EEF0EC] dark:bg-white/10">

                    <div
                      className={`h-full rounded-full ${item.bar}`}
                      style={{
                        width: `${item.percentage}%`,
                      }}
                    />

                  </div>

                </div>
              );
            })}

          </div>


          {/* Equipment status */}

          <div className="mt-5 rounded-xl bg-[#F7F4ED] p-4 dark:bg-[#202B27]">

            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E7F5F2] text-[#0F766E]">
                <Activity size={18} />
              </div>

              <div>
                <p className="text-xs font-bold text-[#17201D] dark:text-white">
                  Imaging Equipment Status
                </p>

                <p className="mt-0.5 text-[10px] text-[#87938E]">
                  7 of 9 machines currently operational
                </p>
              </div>

              <span className="ml-auto text-xs font-bold text-[#0F766E]">
                78%
              </span>

            </div>

          </div>

        </div>


        {/* Pending Reports */}

        <div className="rounded-2xl border border-[#E3E0D7] bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#18211E]">

          <div className="flex items-center justify-between">

            <div>
              <h2 className="text-sm font-bold text-[#17201D] dark:text-white">
                Report Queue
              </h2>

              <p className="mt-1 text-xs text-[#87938E]">
                Reports requiring attention
              </p>
            </div>

            <span className="rounded-full bg-[#FFF3E8] px-2.5 py-1 text-[9px] font-bold text-[#C87924]">
              24 Pending
            </span>

          </div>


          <div className="mt-6 space-y-4">

            <ReportItem
              patient="Vikram Joshi"
              study="CT Head"
              id="RAD-10478"
              time="12 min ago"
            />

            <ReportItem
              patient="Meera Kapoor"
              study="MRI Spine"
              id="RAD-10475"
              time="26 min ago"
            />

            <ReportItem
              patient="Rohan Gupta"
              study="Chest X-Ray"
              id="RAD-10472"
              time="41 min ago"
            />

            <ReportItem
              patient="Kavya Singh"
              study="CT Abdomen"
              id="RAD-10469"
              time="55 min ago"
            />

          </div>


          <button className="mt-5 flex w-full items-center justify-center gap-1 rounded-xl border border-[#E3E0D7] py-2.5 text-xs font-bold text-[#52615B] transition hover:border-[#0F766E] hover:text-[#0F766E] dark:border-white/10 dark:text-[#AAB6B0]">
            View All Reports
            <ChevronRight size={14} />
          </button>

        </div>

      </div>


      {/* =====================================================
          STUDIES TABLE
      ====================================================== */}

      <div className="mt-6 overflow-hidden rounded-2xl border border-[#E3E0D7] bg-white shadow-sm dark:border-white/10 dark:bg-[#18211E]">

        <div className="flex flex-col justify-between gap-4 border-b border-[#EEECE5] px-5 py-4 md:flex-row md:items-center dark:border-white/10">

          <div>
            <h2 className="text-sm font-bold text-[#17201D] dark:text-white">
              Recent Imaging Studies
            </h2>

            <p className="mt-1 text-xs text-[#87938E]">
              Latest radiology examinations
            </p>
          </div>


          <div className="flex gap-2">

            <div className="relative">

              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9AA49F]"
              />

              <input
                type="text"
                placeholder="Search studies..."
                className="w-[190px] rounded-xl border border-[#E3E0D7] bg-[#FAFAF7] py-2 pl-9 pr-3 text-xs text-[#17201D] outline-none placeholder:text-[#9AA49F] focus:border-[#0F766E] dark:border-white/10 dark:bg-[#202B27] dark:text-white"
              />

            </div>

            <button className="rounded-xl border border-[#E3E0D7] px-3 text-xs font-semibold text-[#52615B] dark:border-white/10 dark:text-[#AAB6B0]">
              Filter
            </button>

          </div>

        </div>


        {/* Table */}

        <div className="overflow-x-auto">

          <table className="w-full min-w-[850px]">

            <thead>

              <tr className="border-b border-[#EEECE5] dark:border-white/10">

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-[#9AA49F]">
                  Study ID
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-[#9AA49F]">
                  Patient
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-[#9AA49F]">
                  Modality
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-[#9AA49F]">
                  Doctor
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-[#9AA49F]">
                  Date & Time
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-[#9AA49F]">
                  Status
                </th>

                <th className="px-5 py-3"></th>

              </tr>

            </thead>


            <tbody>

              {studies.map((study) => (

                <tr
                  key={study.id}
                  className="border-b border-[#F0EEE8] last:border-0 transition hover:bg-[#FAFAF7] dark:border-white/5 dark:hover:bg-white/[0.02]"
                >

                  <td className="px-5 py-4">

                    <span className="text-xs font-bold text-[#0F766E]">
                      {study.id}
                    </span>

                  </td>


                  <td className="px-5 py-4">

                    <div className="flex items-center gap-3">

                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E7F5F2] text-[#0F766E]">
                        <UserRound size={15} />
                      </div>

                      <div>

                        <p className="text-xs font-bold text-[#17201D] dark:text-white">
                          {study.patient}
                        </p>

                        <p className="mt-0.5 text-[9px] text-[#87938E]">
                          {study.patientId}
                        </p>

                      </div>

                    </div>

                  </td>


                  <td className="px-5 py-4">

                    <div>

                      <p className="text-xs font-bold text-[#52615B] dark:text-[#AAB6B0]">
                        {study.modality}
                      </p>

                      <p className="mt-0.5 text-[9px] text-[#87938E]">
                        {study.bodyPart}
                      </p>

                    </div>

                  </td>


                  <td className="px-5 py-4">

                    <p className="text-xs text-[#52615B] dark:text-[#AAB6B0]">
                      {study.doctor}
                    </p>

                  </td>


                  <td className="px-5 py-4">

                    <div className="flex items-center gap-1.5">

                      <Clock3
                        size={13}
                        className="text-[#87938E]"
                      />

                      <div>

                        <p className="text-xs font-semibold text-[#52615B] dark:text-[#AAB6B0]">
                          {study.time}
                        </p>

                        <p className="text-[9px] text-[#87938E]">
                          {study.date}
                        </p>

                      </div>

                    </div>

                  </td>


                  <td className="px-5 py-4">
                    <StatusBadge status={study.status} />
                  </td>


                  <td className="px-5 py-4">

                    <button className="flex h-8 w-8 items-center justify-center rounded-lg text-[#87938E] hover:bg-[#E7F5F2] hover:text-[#0F766E] dark:hover:bg-[#0F766E]/15">
                      <MoreHorizontal size={17} />
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>


        {/* Footer */}

        <div className="flex items-center justify-between border-t border-[#EEECE5] px-5 py-3 dark:border-white/10">

          <p className="text-[10px] text-[#87938E]">
            Showing 5 of 191 imaging studies
          </p>

          <button className="flex items-center gap-1 text-xs font-bold text-[#0F766E] hover:underline">
            View all studies
            <ChevronRight size={14} />
          </button>

        </div>

      </div>


      {/* =====================================================
          RECENT ACTIVITY
      ====================================================== */}

      <div className="mt-6 rounded-2xl border border-[#E3E0D7] bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#18211E]">

        <div className="flex items-center justify-between">

          <div>

            <h2 className="text-sm font-bold text-[#17201D] dark:text-white">
              Recent Radiology Activity
            </h2>

            <p className="mt-1 text-xs text-[#87938E]">
              Latest updates from the radiology department
            </p>

          </div>

          <button className="text-xs font-bold text-[#0F766E] hover:underline">
            View activity
          </button>

        </div>


        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          {activities.map((activity) => {

            const Icon = activity.icon;

            return (
              <div
                key={activity.title}
                className="rounded-xl border border-[#EEECE5] p-4 dark:border-white/10"
              >

                <div className="flex items-start gap-3">

                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${activity.color}`}
                  >
                    <Icon size={16} />
                  </div>

                  <div className="min-w-0">

                    <p className="text-xs font-bold text-[#17201D] dark:text-white">
                      {activity.title}
                    </p>

                    <p className="mt-1 text-[10px] leading-4 text-[#87938E]">
                      {activity.description}
                    </p>

                    <p className="mt-2 text-[9px] font-medium text-[#A1AAA6]">
                      {activity.time}
                    </p>

                  </div>

                </div>

              </div>
            );
          })}

        </div>

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
  change,
  icon,
  iconBg,
  iconColor,
  warning = false,
}) {
  return (
    <div className="rounded-2xl border border-[#E3E0D7] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-[#18211E]">

      <div className="flex items-start justify-between">

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconBg} ${iconColor}`}
        >
          {icon}
        </div>

        <MoreHorizontal
          size={18}
          className="text-[#A0AAA6]"
        />

      </div>

      <p className="mt-5 text-xs font-medium text-[#87938E]">
        {title}
      </p>

      <div className="mt-1 flex items-end justify-between">

        <h2 className="text-2xl font-bold tracking-tight text-[#17201D] dark:text-white">
          {value}
        </h2>

        {warning ? (
          <span className="mb-1 text-[10px] font-bold text-[#C87924]">
            {change}
          </span>
        ) : (
          <span className="mb-1 flex items-center gap-1 text-[10px] font-bold text-[#0F766E]">
            <ArrowUpRight size={13} />
            {change}
          </span>
        )}

      </div>

    </div>
  );
}


/* ============================================================
   REPORT ITEM
============================================================ */

function ReportItem({
  patient,
  study,
  id,
  time,
}) {
  return (
    <div className="flex items-center gap-3">

      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#FFF3E8] text-[#C87924]">
        <FileText size={16} />
      </div>

      <div className="min-w-0 flex-1">

        <div className="flex items-center justify-between gap-2">

          <p className="truncate text-xs font-bold text-[#17201D] dark:text-white">
            {patient}
          </p>

          <span className="shrink-0 text-[9px] text-[#9AA49F]">
            {time}
          </span>

        </div>

        <div className="mt-1 flex items-center gap-2">

          <span className="text-[10px] text-[#87938E]">
            {study}
          </span>

          <span className="text-[9px] font-bold text-[#0F766E]">
            {id}
          </span>

        </div>

      </div>

    </div>
  );
}


/* ============================================================
   STATUS BADGE
============================================================ */

function StatusBadge({ status }) {

  const styles = {
    "Report Ready":
      "bg-[#ECFDF5] text-[#0F766E] dark:bg-[#0F766E]/15 dark:text-[#5EEAD4]",

    "In Progress":
      "bg-[#EEF2FF] text-[#5367B8] dark:bg-[#5367B8]/15 dark:text-[#A5B4FC]",

    Scheduled:
      "bg-[#F3F4F6] text-[#52615B] dark:bg-white/10 dark:text-[#AAB6B0]",

    "Pending Review":
      "bg-[#FFF7ED] text-[#C87924] dark:bg-[#C87924]/15 dark:text-[#FDBA74]",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[9px] font-bold ${
        styles[status] || styles.Scheduled
      }`}
    >
      {status === "Report Ready" && (
        <CheckCircle2 size={11} />
      )}

      {status === "Pending Review" && (
        <Clock3 size={11} />
      )}

      {status === "In Progress" && (
        <Activity size={11} />
      )}

      {status === "Scheduled" && (
        <CalendarDays size={11} />
      )}

      {status}
    </span>
  );
}