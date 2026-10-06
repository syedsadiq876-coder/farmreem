"use client";

import ModuleShell from "../../../components/common/ModuleShell";
import { Boxes } from "lucide-react";

export default function SuppliersPage() {
  return (
    <ModuleShell
      title="Suppliers & Partner Farms"
      category="Supply Chain & Sourcing"
      description="Grower profiles, agricultural certifications, farm location directory, and payout terms."
      icon={Boxes}
    />
  );
}
