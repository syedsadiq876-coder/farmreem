"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Sliders,
  ArrowLeft,
  Plus,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Building2,
  Package,
  Layers,
  Globe,
} from "lucide-react";

interface MarginRule {
  id: string;
  rule_code: string;
  name: string;
  scope: "CUSTOMER_SPECIFIC" | "PRODUCT_SPECIFIC" | "CATEGORY" | "GLOBAL";
  margin_type: "PERCENTAGE_MARKUP" | "FIXED_MARKUP_INR" | "PERCENTAGE_MARGIN" | "MINIMUM_FLOOR_PRICE";
  margin_value: number;
  is_active: boolean;
  product?: { sku: string; name: string } | null;
  customer?: { legal_name: string; customer_code: string } | null;
  product_category?: string | null;
  effective_from: string;
  created_at: string;
}

const SCOPE_MAP: Record<string, { label: string; bg: string; text: string; icon: any }> = {
  CUSTOMER_SPECIFIC: { label: "Customer Specific", bg: "bg-blue-500/10", text: "text-blue-400", icon: Building2 },
  PRODUCT_SPECIFIC: { label: "Product Specific", bg: "bg-emerald-500/10", text: "text-emerald-400", icon: Package },
  CATEGORY: { label: "Category Level", bg: "bg-purple-500/10", text: "text-purple-400", icon: Layers },
  GLOBAL: { label: "Global Baseline", bg: "bg-amber-500/10", text: "text-amber-400", icon: Globe },
};

export default function MarginRulesPage() {
  const [rules, setRules] = useState<MarginRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRules = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/pricing/margin-rules");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load margin rules.");
      setRules(data.margin_rules || []);
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRules();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <Link
            href="/pricing"
            className="p-2.5 rounded-xl border border-slate-800 bg-slate-950 text-slate-400 hover:text-white hover:border-slate-700 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400 border border-emerald-500/20">
                <Sliders className="w-5 h-5" />
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Margin & Floor Guardrails</h1>
            </div>
            <p className="text-sm text-slate-400 mt-0.5">
              Deterministic precedence rules used during pricing review and validation
            </p>
          </div>
        </div>

        <button
          onClick={fetchRules}
          className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white hover:border-slate-700 transition"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-emerald-400" : ""}`} />
        </button>
      </div>

      {error ? (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 text-rose-400 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      ) : loading ? (
        <div className="p-12 text-center text-slate-400 bg-slate-900/40 rounded-2xl border border-slate-800">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-400" />
          <span>Loading margin rules...</span>
        </div>
      ) : rules.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/40 rounded-2xl border border-slate-800">
          <Sliders className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-white font-semibold text-lg">No margin rules configured</h3>
          <p className="text-slate-400 text-sm mt-1">Margin guardrails ensure commercial selling rates never fall below target thresholds.</p>
        </div>
      ) : (
        <div className="bg-slate-900/60 rounded-2xl border border-slate-800 overflow-hidden backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950/60 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Rule Code & Name</th>
                  <th className="px-6 py-4">Scope Precedence</th>
                  <th className="px-6 py-4">Margin Calculation Type</th>
                  <th className="px-6 py-4">Value</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {rules.map((rule) => {
                  const scopeInfo = SCOPE_MAP[rule.scope] || SCOPE_MAP.GLOBAL;
                  const Icon = scopeInfo.icon;

                  return (
                    <tr key={rule.id} className="hover:bg-slate-800/30 transition">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-white">{rule.name}</div>
                        <div className="font-mono text-xs text-slate-400 mt-0.5">{rule.rule_code}</div>
                      </td>

                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${scopeInfo.bg} ${scopeInfo.text}`}>
                          <Icon className="w-3.5 h-3.5" />
                          {scopeInfo.label}
                        </span>
                      </td>

                      <td className="px-6 py-4 font-mono text-xs text-slate-300">
                        {rule.margin_type}
                      </td>

                      <td className="px-6 py-4 font-mono font-bold text-emerald-400 text-base">
                        {rule.margin_type.includes("PERCENTAGE") ? `${Number(rule.margin_value).toFixed(2)}%` : `₹${Number(rule.margin_value).toFixed(2)}`}
                      </td>

                      <td className="px-6 py-4">
                        {rule.is_active ? (
                          <span className="inline-flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20 font-semibold">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs text-slate-500 bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700 font-semibold">
                            <XCircle className="w-3.5 h-3.5" /> Inactive
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
