"use client";

import ModuleShell from "../../../components/common/ModuleShell";
import { Tractor } from "lucide-react";

export default function ProcurementPage() {
  return (
    <ModuleShell
      title="Procurement & Produce Sourcing"
      category="Supply Chain & Sourcing"
      description="Farm harvest scheduling, direct farm buy-orders, quality inspection, and intake logistics."
      icon={Tractor}
    />
  );
}
