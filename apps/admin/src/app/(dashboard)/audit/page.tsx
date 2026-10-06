"use client";

import ModuleShell from "../../../components/common/ModuleShell";
import { ShieldCheck } from "lucide-react";

export default function AuditPage() {
  return (
    <ModuleShell
      title="Audit Log & Security Ledger"
      category="Administration & Security"
      description="Immutable, append-only PostgreSQL security log capturing all system mutations, actors, and events."
      icon={ShieldCheck}
    />
  );
}
