"use client";

import ModuleShell from "../../../components/common/ModuleShell";
import { Truck } from "lucide-react";

export default function DeliveriesPage() {
  return (
    <ModuleShell
      title="Deliveries & Proof of Delivery (PoD)"
      category="Fulfillment & Logistics"
      description="Live fleet tracking, route optimization, digital delivery signatures, and rejection/return records."
      icon={Truck}
    />
  );
}
