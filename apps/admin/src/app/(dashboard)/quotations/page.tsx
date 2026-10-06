"use client";

import ModuleShell from "../../../components/common/ModuleShell";
import { FileText } from "lucide-react";

export default function QuotationsPage() {
  return (
    <ModuleShell
      title="Quotations & Pro-Forma Orders"
      category="Sales & Accounts"
      description="Custom client price quotes, pro-forma invoice generation, and approval workflows."
      icon={FileText}
    />
  );
}
