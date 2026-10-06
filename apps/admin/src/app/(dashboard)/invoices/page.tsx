"use client";

import ModuleShell from "../../../components/common/ModuleShell";
import { Receipt } from "lucide-react";

export default function InvoicesPage() {
  return (
    <ModuleShell
      title="Invoices & Billing Matrix"
      category="Finance & Commercial"
      description="Tax-compliant commercial billing, credit note issuance, payment terms, and aging reports."
      icon={Receipt}
    />
  );
}
