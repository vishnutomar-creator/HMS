const { ROLES } = require("../constants/roles");

const ALL_STAFF = [
  ROLES.SUPER_ADMIN,
  ROLES.ADMIN,
  ROLES.DOCTOR,
  ROLES.RECEPTIONIST,
  ROLES.NURSE,
  ROLES.PHARMACIST,
  ROLES.BILLING_EXECUTIVE,
  ROLES.LAB_TECHNICIAN,
];

const policies = [
  { prefix: "/users", roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN] },
  { prefix: "/audit-logs", roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN] },
  { prefix: "/assets", roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN] },
  { prefix: "/finance", roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.BILLING_EXECUTIVE] },
  { prefix: "/inventory", roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.PHARMACIST] },
  { prefix: "/purchase-orders", roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.PHARMACIST] },
  { prefix: "/suppliers", roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.PHARMACIST] },
  { prefix: "/billings", roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.BILLING_EXECUTIVE, ROLES.RECEPTIONIST] },
  { prefix: "/payments", roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.BILLING_EXECUTIVE, ROLES.RECEPTIONIST] },
  { prefix: "/pharmacy", roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.DOCTOR, ROLES.PHARMACIST] },
  { prefix: "/lab-tests", roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.DOCTOR, ROLES.LAB_TECHNICIAN] },
  { prefix: "/patients", roles: [...ALL_STAFF, ROLES.PATIENT] },
  { prefix: "/doctors", roles: [...ALL_STAFF, ROLES.PATIENT] },
];

function authorizeApiAccess(req, res, next) {
  const path = req.path;
  const policy = policies.find(({ prefix }) => path === prefix || path.startsWith(`${prefix}/`));

  if (req.user.role === ROLES.PATIENT && ["/patients", "/doctors"].some((prefix) => path === prefix || path.startsWith(`${prefix}/`)) && req.method !== "GET") {
    return res.status(403).json({
      success: false,
      message: "Patients cannot modify this API resource",
    });
  }

  if (!policy || policy.roles.includes(req.user.role)) return next();
  return res.status(403).json({
    success: false,
    message: "Forbidden: your role is not authorized for this API resource",
  });
}

module.exports = authorizeApiAccess;
