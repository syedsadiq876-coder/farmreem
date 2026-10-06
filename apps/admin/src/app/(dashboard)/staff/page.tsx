"use client";

import ModuleShell from "../../../components/common/ModuleShell";
import { UserCheck } from "lucide-react";

export default function StaffPage() {
  return (
    <ModuleShell
      title="Staff Users & Provisioning"
      category="Administration & Security"
      description="Internal staff user directory, role assignment, app access claims, and activation state management."
      icon={UserCheck}
    />
  );
}
