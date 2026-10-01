import { PERMISSIONS, ROLES } from "./constant";
import { hasPermission } from "./permission";

export const ROLE_DASHBOARDS = Object.freeze({
  [ROLES.SUPER_ADMIN]: "/super-admin/dashboard",
  [ROLES.ADMIN]: "/admin/dashboard",
  [ROLES.DOCTOR]: "/doctor/dashboard",
  [ROLES.RECEPTIONIST]: "/receptionist/dashboard",
  [ROLES.NURSE]: "/nurse/dashboard",
  [ROLES.PHARMACIST]: "/pharmacy/dashboard",
  [ROLES.BILLING_EXECUTIVE]: "/billing/dashboard",
  [ROLES.LAB_TECHNICIAN]: "/lab/dashboard",
  [ROLES.PATIENT]: "/patient/dashboard",
});

const ROUTE_PERMISSIONS = Object.freeze({
  "/patients": PERMISSIONS.PATIENT_VIEW,
  "/appointments": PERMISSIONS.APPOINTMENT_VIEW,
  "/queue": PERMISSIONS.QUEUE_VIEW,
  "/admissions": PERMISSIONS.ADMISSION_VIEW,
  "/medical-records": PERMISSIONS.MEDICAL_RECORD_VIEW,
  "/prescriptions": PERMISSIONS.PRESCRIPTION_VIEW,
  "/laboratory": PERMISSIONS.LAB_VIEW,
  "/radiology": PERMISSIONS.RADIOLOGY_VIEW,
  "/doctors": PERMISSIONS.DOCTOR_VIEW,
  "/nurses": PERMISSIONS.NURSE_VIEW,
  "/nursing": PERMISSIONS.WARD_VIEW,
  "/departments": PERMISSIONS.DEPARTMENT_VIEW,
  "/wards": PERMISSIONS.WARD_VIEW,
  "/beds": PERMISSIONS.BED_VIEW,
  "/operation-theater": PERMISSIONS.OT_VIEW,
  "/surgeries": PERMISSIONS.SURGERY_VIEW,
  "/pharmacy": PERMISSIONS.PHARMACY_VIEW,
  "/inventory": PERMISSIONS.INVENTORY_VIEW,
  "/suppliers": PERMISSIONS.SUPPLIER_VIEW,
  "/purchase-orders": PERMISSIONS.PO_VIEW,
  "/billing": PERMISSIONS.BILLING_VIEW,
  "/payments": PERMISSIONS.PAYMENT_VIEW,
  "/insurance": PERMISSIONS.INSURANCE_VIEW,
  "/finance": PERMISSIONS.FINANCE_VIEW,
  "/hr": PERMISSIONS.HR_VIEW,
  "/assets": PERMISSIONS.ASSET_VIEW,
  "/reports": PERMISSIONS.REPORTS_VIEW,
  "/notifications": PERMISSIONS.NOTIFICATION_VIEW,
  "/audit-logs": PERMISSIONS.AUDIT_VIEW,
  "/settings": PERMISSIONS.SETTINGS_VIEW,
});

export const dashboardPath = (role) => ROLE_DASHBOARDS[role] ?? "/login";

export function isRouteAllowed(role, pathname) {
  if (!role || !pathname) return false;
  if (pathname === "/profile") return true;
  if (pathname === "/dashboard" || pathname === dashboardPath(role)) return true;

  const route = Object.keys(ROUTE_PERMISSIONS).find(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
  return Boolean(route && hasPermission(role, ROUTE_PERMISSIONS[route]));
}
