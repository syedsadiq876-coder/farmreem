"use client";

import ModuleShell from "../../../components/common/ModuleShell";
import { LifeBuoy } from "lucide-react";

export default function SupportPage() {
  return (
    <ModuleShell
      title="Support Desk & Escalations"
      category="Customer Service"
      description="Customer issue ticketing, delivery dispute resolution, SLA tracking, and resolution history."
      icon={LifeBuoy}
    />
  );
}
