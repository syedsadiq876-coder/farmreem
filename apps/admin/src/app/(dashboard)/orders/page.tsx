"use client";

import ModuleShell from "../../../components/common/ModuleShell";
import { ShoppingCart } from "lucide-react";

export default function OrdersPage() {
  return (
    <ModuleShell
      title="Commercial Orders & Processing"
      category="Order Management"
      description="Client purchase order tracking, fulfillment status, line-item allocations, and order lifecycle."
      icon={ShoppingCart}
    />
  );
}
