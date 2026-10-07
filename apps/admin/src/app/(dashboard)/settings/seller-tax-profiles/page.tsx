"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Building,
  Plus,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  ShieldAlert,
  MapPin,
  FileText,
  Star,
} from "lucide-react";

interface SellerTaxProfile {
  id: string;
  profile_code: string;
  organization_id: string;
  legal_entity_name: string;
  trade_name: string | null;
  gstin: string;
  pan: string | null;
  registered_address_line1: string;
  city: string;
  state_name: string;
  gst_state_code: string;
  postal_code: string;
  country: string;
  is_primary_seller: boolean;
  is_active: boolean;
  verification_status: "DRAFT" | "VERIFIED" | "SUSPENDED" | "INACTIVE";
  organization?: { legal_name: string } | null;
  created_at: string;
}

export default function SellerTaxProfilesPage() {
  const [profiles, setProfiles] = useState<SellerTaxProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfiles = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/settings/seller-tax-profiles");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load seller tax profiles.");
      setProfiles(data.seller_tax_profiles || []);
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
            <Building className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Seller Statutory & Tax Profiles</h1>
            <p className="text-sm text-slate-400 mt-0.5">
              Authoritative corporate GST registrations & legal entity identity for commercial documents
            </p>
          </div>
        </div>

        <button
          onClick={fetchProfiles}
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
          <span>Loading statutory profiles...</span>
        </div>
      ) : profiles.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/40 rounded-2xl border border-slate-800">
          <Building className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-white font-semibold text-lg">No Seller Tax Profiles Configured</h3>
          <p className="text-slate-400 text-sm mt-1">
            Formal quotation issuance requires at least one verified active seller tax profile.
          </p>
        </div>
      ) : (
        <div className="bg-slate-900/60 rounded-2xl border border-slate-800 overflow-hidden backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950/60 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Profile Code & Legal Entity</th>
                  <th className="px-6 py-4">GSTIN & PAN</th>
                  <th className="px-6 py-4">State & GST Code</th>
                  <th className="px-6 py-4">Primary Seller</th>
                  <th className="px-6 py-4">Governance Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {profiles.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/30 transition">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-white">{p.legal_entity_name}</div>
                      <div className="font-mono text-xs text-slate-400 mt-0.5">{p.profile_code}</div>
                    </td>

                    <td className="px-6 py-4 font-mono text-xs">
                      <div className="text-emerald-400 font-bold">{p.gstin}</div>
                      <div className="text-slate-400 mt-0.5">PAN: {p.pan || "N/A"}</div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="text-slate-200">{p.state_name}</div>
                      <div className="font-mono text-xs text-slate-400">GST Code: {p.gst_state_code}</div>
                    </td>

                    <td className="px-6 py-4">
                      {p.is_primary_seller ? (
                        <span className="inline-flex items-center gap-1 text-xs text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20 font-semibold">
                          <Star className="w-3.5 h-3.5" /> Primary Seller
                        </span>
                      ) : (
                        <span className="text-slate-500 text-xs">Secondary Registration</span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      {p.verification_status === "VERIFIED" ? (
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-slate-400 bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700 font-semibold">
                          {p.verification_status}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
