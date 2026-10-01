"use client";

/**
 * MediCare HMS — Permission Hooks
 *
 * Public hooks that components and pages should use.
 * All hooks read the role from the authenticated backend session.
 *
 * Usage:
 *   const canCreate = usePermission("patient.create");
 *   const { "lab.view": canViewLab, "lab.order.create": canOrderLab } = usePermissions(["lab.view", "lab.order.create"]);
 *   const { role } = useRole();
 */

import { useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { hasPermission, hasAnyPermission, hasAllPermissions } from "../utils/permission";

// ---------------------------------------------------------------------------
// useRole
// ---------------------------------------------------------------------------
/**
 * Returns the authenticated role. It is intentionally read-only.
 *
 * @returns {{ activeRole: string | null, role: string | null, hydrated: boolean }}
 */
export function useRole() {
  const { role, loading } = useAuth();
  return { activeRole: role, role, hydrated: !loading };
}

// ---------------------------------------------------------------------------
// usePermission
// ---------------------------------------------------------------------------
/**
 * Check a SINGLE permission for the current active role.
 *
 * @param {string} permission - e.g. "patient.create"
 * @returns {boolean}
 *
 * @example
 * function CreatePatientButton() {
 *   const can = usePermission("patient.create");
 *   if (!can) return null;
 *   return <button>Add Patient</button>;
 * }
 */
export function usePermission(permission) {
  const { role: activeRole } = useAuth();

  return useMemo(
    () => hasPermission(activeRole, permission),
    [activeRole, permission]
  );
}

// ---------------------------------------------------------------------------
// usePermissions  (batch)
// ---------------------------------------------------------------------------
/**
 * Check MULTIPLE permissions at once.
 * Returns an object keyed by permission string → boolean.
 *
 * @param {string[]} permissions
 * @returns {Record<string, boolean>}
 *
 * @example
 * const perms = usePermissions(["billing.create", "billing.delete"]);
 * // { "billing.create": true, "billing.delete": false }
 */
export function usePermissions(permissions = []) {
  const { role: activeRole } = useAuth();

  return useMemo(() => {
    return Object.fromEntries(
      permissions.map((p) => [p, hasPermission(activeRole, p)])
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeRole, permissions.join(",")]);
}

// ---------------------------------------------------------------------------
// useHasAnyPermission
// ---------------------------------------------------------------------------
/**
 * Returns true if the active role has AT LEAST ONE of the given permissions.
 *
 * @param {string[]} permissions
 * @returns {boolean}
 */
export function useHasAnyPermission(permissions = []) {
  const { role: activeRole } = useAuth();

  return useMemo(
    () => hasAnyPermission(activeRole, permissions),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeRole, permissions.join(",")]
  );
}

// ---------------------------------------------------------------------------
// useHasAllPermissions
// ---------------------------------------------------------------------------
/**
 * Returns true only if the active role has ALL of the given permissions.
 *
 * @param {string[]} permissions
 * @returns {boolean}
 */
export function useHasAllPermissions(permissions = []) {
  const { role: activeRole } = useAuth();

  return useMemo(
    () => hasAllPermissions(activeRole, permissions),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeRole, permissions.join(",")]
  );
}
