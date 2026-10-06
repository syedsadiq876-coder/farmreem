"use client";

import ModuleShell from "../../../components/common/ModuleShell";
import { Users } from "lucide-react";

export default function CrmPage() {
  return (
    <ModuleShell
      title="CRM & Lead Management"
      category="Sales & Accounts"
      description="Lead qualification, B2B customer account tracking, and staff interaction log."
      icon={Users}
    />
  );
}
