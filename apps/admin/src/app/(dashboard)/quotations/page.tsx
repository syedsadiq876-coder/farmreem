"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  FileText,
  Search,
  Plus,
  RefreshCw,
  AlertCircle,
  Eye,
  Building2,
  Clock,
  CheckCircle2,
  XCircle,
  Send,
  AlertTriangle,
  History,
} from "lucide-react";

interface Quotation {
  id: string;
  quotation_number: string;
  revision_number: number;
  root_quotation_id: string;
  parent_quotation_id: string | null;
  customer_id: string;
  customer?: { id: string; legal_name: string; customer_code: string } | null;
  status:
    | "DRAFT"
    | "PENDING_APPROVAL"
    | "APPROVED"
    | "INTERNAL_REJECTED"
    | "SENT"
    | "ACCEPTED"
    | "DECLINED"
    | "EXPIRED"
    | "SUPERSEDED"
    | "CANCELLED";
  currency: string;
  grand_total: number;
  tax_total: number;
  subtotal: number;
  valid_until: string;
  seller_legal_name_snapshot: string | null;
  created_at: string;
  issued_at: string | null;
  creator?: { id: string; full_name: string; email: string } | null;
}

const STATUS_MAP: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  DRAFT: { label: "Draft", bg: "bg-slate-800", text: "text-slate-400", dot: "bg-slate-500" },
  PENDING_APPROVAL: { label: "Pending Approval", bg: "bg-amber-500/10", text: "text-amber-400", dot: "bg-amber-400 animate-pulse" },
  APPROVED: { label: "Approved Internal", bg: "bg-teal-500/10", text: "text-teal-400", dot: "bg-teal-400" },
  INTERNAL_REJECTED: { label: "Internal Rejected", bg: "bg-rose-500/10", text: "text-rose-400", dot: "bg-rose-500" },
  SENT: { label: "Issued & Sent", bg: "bg-blue-500/10", text: "text-blue-400", dot: "bg-blue-400" },
  ACCEPTED: { label: "Accepted", bg: "bg-emerald-500/10", text: "text-emerald-400", dot: "bg-emerald-400" },
  DECLINED: { label: "Client Declined", bg: "bg-purple-500/10", text: "text-purple-400", dot: "bg-purple-500" },
  EXPIRED: { label: "Expired", bg: "bg-slate-800", text: "text-slate-500", dot: "bg-slate-600" },
  SUPERSEDED: { label: "Superseded", bg: "bg-indigo-500/10", text: "text-indigo-400", dot: "bg-indigo-500" },
  CANCELLED: { label: "Cancelled", bg: "bg-red-950/40", text: "text-red-400", dot: "bg-red-500" },
};

export default function QuotationsPage() {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const fetchQuotations = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/quotations");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load quotations.");
      setQuotations(data.quotations || []);
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotations();
  }, []);

  const filteredQuotations = useMemo(() => {
    return quotations.filter((item) => {
      const displayCode = `${item.quotation_number} · Rev ${item.revision_number}`;
      const matchesSearch =
        displayCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.quotation_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.customer?.legal_name || "").toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === "ALL" || item.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [quotations, searchTerm, statusFilter]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800 backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Quotations & Commercial Offers</h1>
              <p className="text-sm text-slate-400 mt-0.5">
                Versioned commercial pricing quotes, seller tax snapshots, maker-checker governance & customer acceptance
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/quotations/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-semibold hover:from-emerald-400 hover:to-teal-500 shadow-lg shadow-emerald-500/20 transition"
          >
            <Plus className="w-4 h-4" />
            Create Quotation
          </Link>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-7 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search quotation number (e.g. FR-QTN-000001), customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 transition"
          />
        </div>

        <div className="md:col-span-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 transition"
          >
            <option value="ALL">All Statuses</option>
            <option value="DRAFT">Draft</option>
            <option value="PENDING_APPROVAL">Pending Approval</option>
            <option value="APPROVED">Approved Internal</option>
            <option value="INTERNAL_REJECTED">Internal Rejected</option>
            <option value="SENT">Issued & Sent</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="DECLINED">Client Declined</option>
            <option value="EXPIRED">Expired</option>
            <option value="SUPERSEDED">Superseded</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        <div className="md:col-span-1 flex items-center justify-end">
          <button
            onClick={fetchQuotations}
            className="p-2.5 bg-slate-900/80 border border-slate-800 rounded-xl text-slate-400 hover:text-white hover:border-slate-700 transition"
            title="Refresh Directory"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-emerald-400" : ""}`} />
          </button>
        </div>
      </div>

      {/* Main Table */}
      {error ? (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 text-rose-400 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      ) : loading ? (
        <div className="p-12 text-center text-slate-400 bg-slate-900/40 rounded-2xl border border-slate-800">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-400" />
          <span>Loading quotations directory...</span>
        </div>
      ) : filteredQuotations.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/40 rounded-2xl border border-slate-800">
          <FileText className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-white font-semibold text-lg">No quotations found</h3>
          <p className="text-slate-400 text-sm mt-1">Try adjusting search filters or create a new quotation draft.</p>
        </div>
      ) : (
        <div className="bg-slate-900/60 rounded-2xl border border-slate-800 overflow-hidden backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950/60 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Quotation Number</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Grand Total</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Valid Until</th>
                  <th className="px-6 py-4">Created By</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredQuotations.map((item) => {
                  const statusInfo = STATUS_MAP[item.status] || STATUS_MAP.DRAFT;

                  return (
                    <tr key={item.id} className="hover:bg-slate-800/30 transition">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-white">
                          {item.quotation_number} <span className="text-slate-400 text-xs font-normal">· Rev {item.revision_number}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono mt-0.5">{item.id.slice(0, 8)}...</div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="text-white font-medium">{item.customer?.legal_name || "Unknown Customer"}</div>
                        <div className="text-xs text-slate-500 font-mono">{item.customer?.customer_code}</div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="text-emerald-400 font-bold font-mono">
                          ₹{Number(item.grand_total || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Subtotal ₹{Number(item.subtotal || 0).toFixed(2)} + Tax ₹{Number(item.tax_total || 0).toFixed(2)}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${statusInfo.bg} ${statusInfo.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`} />
                          {statusInfo.label}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-xs text-slate-400">
                        {item.valid_until ? new Date(item.valid_until).toLocaleDateString() : "N/A"}
                      </td>

                      <td className="px-6 py-4">
                        <div className="text-slate-200 text-xs">{item.creator?.full_name || "Staff User"}</div>
                        <div className="text-slate-500 text-[11px]">{new Date(item.created_at).toLocaleDateString()}</div>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/quotations/${item.id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 text-xs font-semibold text-slate-200 hover:text-white hover:bg-slate-700 transition"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Manage & View
                        </Link>
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
