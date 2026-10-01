import { NextResponse } from "next/server";

const API_URL = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

const dashboardByRole = {
  SUPER_ADMIN: "/super-admin/dashboard",
  ADMIN: "/admin/dashboard",
  DOCTOR: "/doctor/dashboard",
  RECEPTIONIST: "/receptionist/dashboard",
  NURSE: "/nurse/dashboard",
  PHARMACIST: "/pharmacy/dashboard",
  BILLING_EXECUTIVE: "/billing/dashboard",
  LAB_TECHNICIAN: "/lab/dashboard",
  PATIENT: "/patient/dashboard",
};

const routeRoles = {
  "/assets": ["SUPER_ADMIN", "ADMIN"],
  "/audit-logs": ["SUPER_ADMIN", "ADMIN"],
  "/billing": ["SUPER_ADMIN", "ADMIN", "BILLING_EXECUTIVE"],
  "/finance": ["SUPER_ADMIN", "ADMIN", "BILLING_EXECUTIVE"],
  "/inventory": ["SUPER_ADMIN", "ADMIN", "PHARMACIST"],
  "/laboratory": ["SUPER_ADMIN", "ADMIN", "DOCTOR", "LAB_TECHNICIAN", "PATIENT"],
  "/pharmacy": ["SUPER_ADMIN", "ADMIN", "DOCTOR", "PHARMACIST", "PATIENT"],
  "/reports": ["SUPER_ADMIN", "ADMIN", "DOCTOR"],
  "/settings": ["SUPER_ADMIN", "ADMIN"],
};

function isAllowed(role, pathname) {
  if (pathname === "/dashboard" || pathname === "/profile") return true;
  const ownDashboard = dashboardByRole[role];
  if (pathname === ownDashboard) return true;

  if (Object.values(dashboardByRole).some((path) => pathname === path || pathname.startsWith(`${path}/`))) return false;

  const route = Object.keys(routeRoles).find((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
  if (route) return routeRoles[route].includes(role);

  // The remaining existing operational pages are permission-checked again by
  // the authenticated client layout and their API endpoints.
  return true;
}

export async function proxy(request) {
  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("next", request.nextUrl.pathname);

  const session = request.cookies.get("hms_session")?.value;
  if (!session) return NextResponse.redirect(loginUrl);

  try {
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: { cookie: `hms_session=${session}` },
      cache: "no-store",
    });
    const body = await response.json();
    const role = body?.data?.role;

    if (!response.ok || !dashboardByRole[role]) return NextResponse.redirect(loginUrl);
    if (!isAllowed(role, request.nextUrl.pathname)) {
      return NextResponse.redirect(new URL(dashboardByRole[role], request.url));
    }
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/super-admin/:path*",
    "/admin/:path*",
    "/doctor/:path*",
    "/receptionist/:path*",
    "/nurse/:path*",
    "/pharmacy/:path*",
    "/billing/:path*",
    "/lab/:path*",
    "/patient/:path*",
    "/patients/:path*",
    "/appointments/:path*",
    "/queue/:path*",
    "/admissions/:path*",
    "/medical-records/:path*",
    "/prescriptions/:path*",
    "/laboratory/:path*",
    "/radiology/:path*",
    "/doctors/:path*",
    "/nurses/:path*",
    "/nursing/:path*",
    "/departments/:path*",
    "/wards/:path*",
    "/beds/:path*",
    "/operation-theater/:path*",
    "/surgeries/:path*",
    "/inventory/:path*",
    "/suppliers/:path*",
    "/purchase-orders/:path*",
    "/payments/:path*",
    "/insurance/:path*",
    "/finance/:path*",
    "/hr/:path*",
    "/assets/:path*",
    "/reports/:path*",
    "/notifications/:path*",
    "/audit-logs/:path*",
    "/settings/:path*",
    "/profile/:path*",
  ],
};
