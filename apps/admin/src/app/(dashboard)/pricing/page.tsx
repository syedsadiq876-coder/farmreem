"use client";

import ModuleShell from "../../../components/common/ModuleShell";
import { DollarSign } from "lucide-react";

export default function PricingPage() {
  return (
    <ModuleShell
      title="Pricing Engine & Rate Cards"
      category="Finance & Commercial"
      description="Dynamic daily market rate matrices, volume discount tiers, and contractual pricing policies."
      icon={DollarSign}
    />
  );
}
