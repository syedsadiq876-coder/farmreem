"use client";

import ModuleShell from "../../../components/common/ModuleShell";
import { CreditCard } from "lucide-react";

export default function PaymentsPage() {
  return (
    <ModuleShell
      title="Payments & Receivables Reconciliation"
      category="Finance & Commercial"
      description="Bank wire processing, cheque clearance, online gateway settlements, and ledger posting."
      icon={CreditCard}
    />
  );
}
