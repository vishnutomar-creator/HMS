"use client";

import { useAuth } from "../../../context/AuthContext";

export default function RoleDashboardPage() {
  const { user, role } = useAuth();

  return (
    <div>
      <h1 className="text-2xl font-semibold">{user?.name ? `${user.name}'s Dashboard` : "Dashboard"}</h1>
      <p className="mt-2 text-sm text-[#64746E]">
        Signed in with the read-only {role?.replaceAll("_", " ")} role.
      </p>
    </div>
  );
}
