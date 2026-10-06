"use client";

import ModuleShell from "../../../components/common/ModuleShell";
import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <ModuleShell
      title="System Settings & Configuration"
      category="Administration & Security"
      description="Global platform parameters, email dispatch configuration, regional tax rules, and system security."
      icon={Settings}
    />
  );
}
