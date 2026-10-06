"use client";

import ModuleShell from "../../../components/common/ModuleShell";
import { Building2 } from "lucide-react";

export default function CustomersPage() {
  return (
    <ModuleShell
      title="Customer Accounts & Directory"
      category="Accounts & Directory"
      description="Commercial client profiles, credit limits, contact directory, and contract tiers."
      icon={Building2}
    />
  );
}
