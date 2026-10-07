"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  Tag,
  Search,
  Plus,
  Filter,
  RefreshCw,
  AlertCircle,
  Eye,
  CheckCircle2,
  Clock,
  XCircle,
  Sliders,
  DollarSign,
  Layers,
  Building2,
  Tractor,
} from "lucide-react";

interface PriceList {
  id: string;
  price_list_code: string;
  name: string;
  list_type: "BASE_SELLING" | "CUSTOMER_CONTRACT" | "SUPPLIER_REFERENCE_COST";
  customer_id: string | null;
  supplier_id: string | null;
  customer?: { id: string; legal_name: string; customer_code: string } | null;
  supplier?: { id: string; legal_name: string; supplier_code: string } | null;
  status: "DRAFT" | "PENDING_APPROVAL" | "ACTIVE" | "SUPERSEDED" | "INACTIVE" | "REJECTED";
  currency: string;
  notes: string | null;
  creator?: { id: string; full_name: string; email: string } | null;
  approver?: { id: string; full_name: string; email: string } | null;
  created_at: string;
  updated_at: string;
}

const TYPE_MAP: Record<string, { label: string; bg: string; text: string; icon: any }> = {
  BASE_SELLING: { label: "Base Selling Rates", bg: "bg-emerald-500/10", text: "text-emerald-400", icon: DollarSign },
  CUSTOMER_CONTRACT: { label: "B2B Customer Contract", bg: "bg-blue-500/10", text: "text-blue-400", icon: Building2 },
  SUPPLIER_REFERENCE_COST: { label: "Supplier Ref Cost", bg: "bg-amber-500/10", text: "text-amber-400", icon: Tractor },
};

const STATUS_MAP: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  DRAFT: { label: "Draft", bg: "bg-slate-800", text: "text-slate-400", dot: "bg-slate-500" },
  PENDING_APPROVAL: { label: "Pending Approval", bg: "bg-amber-500/10", text: "text-amber-400", dot: "bg-amber-400 animate-pulse" },
  ACTIVE: { label: "Active", bg: "bg-emerald-500/10", text: "text-emerald-400", dot: "bg-emerald-400 animate-pulse" },
  SUPERSEDED: { label: "Superseded", bg: "bg-purple-500/10", text: "text-purple-400", dot: "bg-purple-500" },
  INACTIVE: { label: "Inactive", bg: "bg-slate-800", text: "text-slate-500", dot: "bg-slate-600" },
  REJECTED: { label: "Rejected", bg: "bg-rose-500/10", text: "text-rose-400", dot: "bg-rose-500" },
};

export default function PricingPage() {
  const [priceLists, setPriceLists] = useState<PriceList[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const fetchPriceLists = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/pricing");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load price lists.");
      setPriceLists(data.price_lists || []);
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPriceLists();
  }, []);

  const filteredLists = useMemo(() => {
    return priceLists.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.price_list_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.customer?.legal_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.supplier?.legal_name || "").toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = typeFilter === "ALL" || item.list_type === typeFilter;
      const matchesStatus = statusFilter === "ALL" || item.status === statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [priceLists, searchTerm, typeFilter, statusFilter]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800 backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
              <Tag className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Pricing Engine V1</h1>
              <p className="text-sm text-slate-400 mt-0.5">
                Versioned commercial selling rates, B2B customer contracts & supplier reference costs
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/pricing/margin-rules"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-slate-200 text-sm font-semibold hover:bg-slate-700 transition"
          >
            <Sliders className="w-4 h-4 text-emerald-400" />
            Margin Guardrails
          </Link>
          <Link
            href="/pricing/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-semibold hover:from-emerald-400 hover:to-teal-500 shadow-lg shadow-emerald-500/20 transition"
          >
            <Plus className="w-4 h-4" />
            New Price List
          </Link>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-5 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search price list code, name, customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 transition"
          />
        </div>

        <div className="md:col-span-3">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 transition"
          >
            <option value="ALL">All List Types</option>
            <option value="BASE_SELLING">Base Selling Rates</option>
            <option value="CUSTOMER_CONTRACT">B2B Customer Contracts</option>
            <option value="SUPPLIER_REFERENCE_COST">Supplier Reference Costs</option>
          </select>
        </div>

        <div className="md:col-span-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 transition"
          >
            <option value="ALL">All Statuses</option>
            <option value="DRAFT">Draft</option>
            <option value="PENDING_APPROVAL">Pending Approval</option>
            <option value="ACTIVE">Active</option>
            <option value="SUPERSEDED">Superseded</option>
            <option value="INACTIVE">Inactive</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>

        <div className="md:col-span-1 flex items-center justify-end">
          <button
            onClick={fetchPriceLists}
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
          <span>Loading pricing directory...</span>
        </div>
      ) : filteredLists.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/40 rounded-2xl border border-slate-800">
          <Tag className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-white font-semibold text-lg">No price lists found</h3>
          <p className="text-slate-400 text-sm mt-1">Try adjusting search filters or create a new price list.</p>
        </div>
      ) : (
        <div className="bg-slate-900/60 rounded-2xl border border-slate-800 overflow-hidden backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950/60 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Price List</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Scope Entity</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Created By</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredLists.map((item) => {
                  const typeInfo = TYPE_MAP[item.list_type] || TYPE_MAP.BASE_SELLING;
                  const statusInfo = STATUS_MAP[item.status] || STATUS_MAP.DRAFT;
                  const Icon = typeInfo.icon;

                  return (
                    <tr key={item.id} className="hover:bg-slate-800/30 transition">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-white">{item.name}</div>
                        <div className="font-mono text-xs text-slate-400 mt-0.5">{item.price_list_code}</div>
                      </td>

                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${typeInfo.bg} ${typeInfo.text}`}>
                          <Icon className="w-3.5 h-3.5" />
                          {typeInfo.label}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        {item.list_type === "CUSTOMER_CONTRACT" && item.customer ? (
                          <span className="text-blue-400 font-medium">{item.customer.legal_name}</span>
                        ) : item.list_type === "SUPPLIER_REFERENCE_COST" && item.supplier ? (
                          <span className="text-amber-400 font-medium">{item.supplier.legal_name}</span>
                        ) : (
                          <span className="text-slate-500 italic">Global Catalog</span>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${statusInfo.bg} ${statusInfo.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`} />
                          {statusInfo.label}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="text-slate-200 text-xs">{item.creator?.full_name || "Staff User"}</div>
                        <div className="text-slate-500 text-[11px]">{new Date(item.created_at).toLocaleDateString()}</div>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/pricing/${item.id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 text-xs font-semibold text-slate-200 hover:text-white hover:bg-slate-700 transition"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View Detail
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
