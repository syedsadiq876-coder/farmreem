"use client";

import ModuleShell from "../../../components/common/ModuleShell";
import { Package } from "lucide-react";

export default function ProductsPage() {
  return (
    <ModuleShell
      title="Products & Catalog Management"
      category="Inventory & Catalog"
      description="Agricultural product SKUs, grading parameters, origin tracking, and packaging specs."
      icon={Package}
    />
  );
}
