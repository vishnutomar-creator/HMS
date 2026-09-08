"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import MobileSidebar from "./MobileSidebar";
import Breadcrumb from "./Breadcrumb";
import Footer from "./Footer";

export default function DashboardLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#F7F4ED]">

      {/* Desktop Sidebar */}

      <div className="hidden h-screen shrink-0 lg:block lg:sticky lg:top-0">
        <Sidebar />
      </div>


      {/* Mobile Sidebar */}

      <MobileSidebar
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />


      {/* Main Application */}

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">

        {/* Navbar */}

        <Navbar
          onMenuClick={() => setMobileOpen(true)}
        />


        {/* Page Content */}

        <main className="flex-1 px-4 py-5 sm:px-6 lg:px-8">

          <div className="mx-auto w-full max-w-[1800px]">

            <Breadcrumb />

            {children}

          </div>

        </main>


        {/* Footer */}

        <Footer />

      </div>

    </div>
  );
}