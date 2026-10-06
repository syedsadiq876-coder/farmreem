"use client";

import ModuleShell from "../../../components/common/ModuleShell";
import { Truck } from "lucide-react";

export default function DispatchPage() {
  return (
    <ModuleShell
      title="Dispatch Dock Operations"
      category="Fulfillment & Logistics"
      description="Cold-chain crate packing, staging bay assignments, vehicle loading manifests, and driver dispatch."
      icon={Truck}
    />
  );
}
