"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  Plus,
  Edit3,
  Power,
  CheckCircle2,
  Clock,
  PauseCircle,
  Building2,
  RefreshCw,
  AlertCircle,
  Filter,
  Eye,
  ShieldAlert,
} from "lucide-react";

interface Customer {
  id: string;
  customer_code: string;
  legal_name: string;
  trade_name: string | null;
  customer_type: "HOTEL" | "RESTAURANT" | "CATERER" | "INSTITUTION" | "RETAILER" | "DISTRIBUTOR" | "OTHER";
  gstin: string | null;
  pan: string | null;
  status: "LEAD" | "PENDING_VERIFICATION" | "ACTIVE" | "ON_HOLD" | "INACTIVE";
  commercial_status: "UNAPPROVED" | "APPROVED" | "SUSPENDED" | "CREDIT_HOLD";
  assigned_account_owner?: { id: string; full_name: string; email: string } | null;
  created_at: string;
  updated_at: string;
}

const TYPE_MAP: Record<string, { label: string; bg: string; text: string }> = {
  HOTEL: { label: "Hotel", bg: "bg-blue-500/10", text: "text-blue-400" },
  RESTAURANT: { label: "Restaurant", bg: "bg-amber-500/10", text: "text-amber-400" },
  CATERER: { label: "Caterer", bg: "bg-purple-500/10", text: "text-purple-400" },
  INSTITUTION: { label: "Institution", bg: "bg-emerald-500/10", text: "text-emerald-400" },
  RETAILER: { label: "Retailer", bg: "bg-cyan-500/10", text: "text-cyan-400" },
  DISTRIBUTOR: { label: "Distributor", bg: "bg-indigo-500/10", text: "text-indigo-400" },
  OTHER: { label: "Other", bg: "bg-slate-800", text: "text-slate-400" },
};

const STATUS_MAP: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  LEAD: { label: "Lead", bg: "bg-slate-800", text: "text-slate-400", dot: "bg-slate-500" },
  PENDING_VERIFICATION: { label: "Pending Verification", bg: "bg-amber-500/10", text: "text-amber-400", dot: "bg-amber-400 animate-pulse" },
  ACTIVE: { label: "Active", bg: "bg-emerald-500/10", text: "text-emerald-400", dot: "bg-emerald-400 animate-pulse" },
  ON_HOLD: { label: "On Hold", bg: "bg-orange-500/10", text: "text-orange-400", dot: "bg-orange-400" },
  INACTIVE: { label: "Inactive", bg: "bg-slate-800", text: "text-slate-500", dot: "bg-slate-600" },
};

const COMMERCIAL_MAP: Record<string, { label: string; bg: string; text: string }> = {
  UNAPPROVED: { label: "Unapproved", bg: "bg-slate-800", text: "text-slate-400" },
  APPROVED: { label: "Approved", bg: "bg-emerald-500/10", text: "text-emerald-400" },
  SUSPENDED: { label: "Suspended", bg: "bg-red-500/10", text: "text-red-400" },
  CREDIT_HOLD: { label: "Credit Hold", bg: "bg-amber-500/10", text: "text-amber-400" },
};

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Add Modal State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    legal_name: "",
    trade_name: "",
    customer_type: "HOTEL",
    gstin: "",
    pan: "",
    status: "LEAD",
    commercial_status: "UNAPPROVED",
    notes: "",
  });

  const fetchCustomers = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append("search", searchQuery);
      if (typeFilter !== "ALL") params.append("customer_type", typeFilter);
      if (statusFilter !== "ALL") params.append("status", statusFilter);

      const res = await fetch(`/api/customers?${params.toString()}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to load customers");

      setCustomers(data.customers || []);
    } catch (err: any) {
      setError(err.message || "Error communicating with server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [searchQuery, typeFilter, statusFilter]);

  // Dynamic KPIs derived from actual database records
  const stats = useMemo(() => {
    const total = customers.length;
    const active = customers.filter((c) => c.status === "ACTIVE").length;
    const pending = customers.filter((c) => c.status === "PENDING_VERIFICATION").length;
    const onHold = customers.filter((c) => c.status === "ON_HOLD").length;
    const typesCount = new Set(customers.map((c) => c.customer_type)).size;
    return { total, active, pending, onHold, typesCount };
  }, [customers]);

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setModalError(null);

    try {
      const res = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create customer");

      setIsAddOpen(false);
      fetchCustomers();
    } catch (err: any) {
      setModalError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/60 backdrop-blur-md border border-slate-800 p-6 rounded-2xl">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">B2B Customers Master Directory</h1>
              <p className="text-sm text-slate-400 mt-0.5">
                Organization-centric accounts, contact management, delivery locations, and lifecycle governance.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => fetchCustomers()}
            className="p-2.5 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-xl border border-slate-700 transition"
            title="Refresh Directory"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={() => {
              setFormData({
                legal_name: "",
                trade_name: "",
                customer_type: "HOTEL",
                gstin: "",
                pan: "",
                status: "LEAD",
                commercial_status: "UNAPPROVED",
                notes: "",
              });
              setModalError(null);
              setIsAddOpen(true);
            }}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-xl transition shadow-lg shadow-emerald-950/40"
          >
            <Plus className="w-4 h-4" />
            Add Customer Account
          </button>
        </div>
      </div>

      {/* Dynamic Database-derived KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 text-sm">
            <span>Total Accounts</span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-bold text-white mt-2">{stats.total}</div>
          <div className="text-xs text-slate-500 mt-1">Master customer records</div>
        </div>

        <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 text-sm">
            <span>Active Accounts</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-bold text-emerald-400 mt-2">{stats.active}</div>
          <div className="text-xs text-emerald-500/70 mt-1">Verified commercial buyers</div>
        </div>

        <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 text-sm">
            <span>Verification Pending</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-bold text-amber-400 mt-2">{stats.pending}</div>
          <div className="text-xs text-amber-500/70 mt-1">Tax / document review</div>
        </div>

        <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 text-sm">
            <span>On Hold</span>
            <PauseCircle className="w-4 h-4 text-orange-400" />
          </div>
          <div className="text-3xl font-bold text-orange-400 mt-2">{stats.onHold}</div>
          <div className="text-xs text-orange-400/70 mt-1">Administrative pause</div>
        </div>

        <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 text-sm">
            <span>Active Categories</span>
            <Building2 className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-bold text-purple-400 mt-2">{stats.typesCount}</div>
          <div className="text-xs text-purple-400/70 mt-1">B2B segment groups</div>
        </div>
      </div>

      {/* Toolbar: Search & Filters */}
      <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row gap-3 justify-between items-stretch md:items-center">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Customer Code, Business Name, GSTIN, or PAN..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-transparent text-sm text-white focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-slate-900">All Customer Types</option>
              <option value="HOTEL" className="bg-slate-900">Hotel</option>
              <option value="RESTAURANT" className="bg-slate-900">Restaurant</option>
              <option value="CATERER" className="bg-slate-900">Caterer</option>
              <option value="INSTITUTION" className="bg-slate-900">Institution</option>
              <option value="RETAILER" className="bg-slate-900">Retailer</option>
              <option value="DISTRIBUTOR" className="bg-slate-900">Distributor</option>
              <option value="OTHER" className="bg-slate-900">Other</option>
            </select>
          </div>

          <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-sm text-white focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-slate-900">All Account Statuses</option>
              <option value="LEAD" className="bg-slate-900">Lead</option>
              <option value="PENDING_VERIFICATION" className="bg-slate-900">Pending Verification</option>
              <option value="ACTIVE" className="bg-slate-900">Active</option>
              <option value="ON_HOLD" className="bg-slate-900">On Hold</option>
              <option value="INACTIVE" className="bg-slate-900">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Customers Directory Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden">
        {error && (
          <div className="p-4 bg-red-500/10 border-b border-red-500/20 text-red-400 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="p-12 text-center text-slate-400 flex flex-col items-center gap-3">
            <RefreshCw className="w-6 h-6 animate-spin text-emerald-400" />
            <p className="text-sm">Loading customer directory from database...</p>
          </div>
        ) : customers.length === 0 ? (
          <div className="p-12 text-center text-slate-400 flex flex-col items-center gap-3">
            <Building2 className="w-8 h-8 text-slate-600" />
            <p className="text-base font-semibold text-slate-300">No customer accounts found</p>
            <p className="text-sm text-slate-500 max-w-sm">
              No customer master records match the selected filters or search parameters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950/80 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4 font-semibold">Customer Code</th>
                  <th className="px-6 py-4 font-semibold">Business Name</th>
                  <th className="px-6 py-4 font-semibold">Type</th>
                  <th className="px-6 py-4 font-semibold">Tax Registration</th>
                  <th className="px-6 py-4 font-semibold">Account Owner</th>
                  <th className="px-6 py-4 font-semibold">Account Lifecycle</th>
                  <th className="px-6 py-4 font-semibold">Commercial State</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {customers.map((customer) => {
                  const typeMeta = TYPE_MAP[customer.customer_type] || TYPE_MAP.OTHER;
                  const statusMeta = STATUS_MAP[customer.status] || STATUS_MAP.LEAD;
                  const commercialMeta = COMMERCIAL_MAP[customer.commercial_status] || COMMERCIAL_MAP.UNAPPROVED;

                  return (
                    <tr
                      key={customer.id}
                      className="hover:bg-slate-800/30 transition-colors group"
                    >
                      <td className="px-6 py-4 font-mono font-semibold text-emerald-400">
                        <Link href={`/customers/${customer.id}`} className="hover:underline">
                          {customer.customer_code}
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-white">
                          <Link href={`/customers/${customer.id}`} className="hover:text-emerald-400 transition">
                            {customer.legal_name}
                          </Link>
                        </div>
                        {customer.trade_name && (
                          <div className="text-xs text-slate-400 mt-0.5">
                            DBA: {customer.trade_name}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${typeMeta.bg} ${typeMeta.text}`}
                        >
                          {typeMeta.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs font-mono">
                        {customer.gstin ? (
                          <div className="text-slate-200">GST: {customer.gstin}</div>
                        ) : customer.pan ? (
                          <div className="text-slate-400">PAN: {customer.pan}</div>
                        ) : (
                          <span className="text-slate-600">Unregistered / Pending</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-xs">
                        {customer.assigned_account_owner ? (
                          <span className="text-slate-200 font-medium">{customer.assigned_account_owner.full_name}</span>
                        ) : (
                          <span className="text-slate-500 italic">Unassigned</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${statusMeta.bg} ${statusMeta.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${statusMeta.dot}`} />
                          {statusMeta.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${commercialMeta.bg} ${commercialMeta.text}`}>
                          {commercialMeta.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/customers/${customer.id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View Master
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Customer Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl shadow-2xl p-6 space-y-5">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-400" />
                Add B2B Customer Account
              </h3>
              <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-white p-1">
                ✕
              </button>
            </div>

            {modalError && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleCreateCustomer} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Legal Business Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Taj Hotels & Resorts Private Limited"
                  value={formData.legal_name}
                  onChange={(e) => setFormData({ ...formData, legal_name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Trade Name / DBA
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. The Taj Palace"
                    value={formData.trade_name}
                    onChange={(e) => setFormData({ ...formData, trade_name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Customer Type *
                  </label>
                  <select
                    value={formData.customer_type}
                    onChange={(e) => setFormData({ ...formData, customer_type: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="HOTEL">Hotel</option>
                    <option value="RESTAURANT">Restaurant</option>
                    <option value="CATERER">Caterer</option>
                    <option value="INSTITUTION">Institution</option>
                    <option value="RETAILER">Retailer</option>
                    <option value="DISTRIBUTOR">Distributor</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    GSTIN (15 Chars)
                  </label>
                  <input
                    type="text"
                    maxLength={15}
                    placeholder="e.g. 07AAAAA0000A1Z5"
                    value={formData.gstin}
                    onChange={(e) => setFormData({ ...formData, gstin: e.target.value.toUpperCase() })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    PAN (10 Chars)
                  </label>
                  <input
                    type="text"
                    maxLength={10}
                    placeholder="e.g. AAAAA0000A"
                    value={formData.pan}
                    onChange={(e) => setFormData({ ...formData, pan: e.target.value.toUpperCase() })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Account Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="LEAD">Lead</option>
                    <option value="PENDING_VERIFICATION">Pending Verification</option>
                    <option value="ACTIVE">Active</option>
                    <option value="ON_HOLD">On Hold</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Commercial Status
                  </label>
                  <select
                    value={formData.commercial_status}
                    onChange={(e) => setFormData({ ...formData, commercial_status: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="UNAPPROVED">Unapproved</option>
                    <option value="APPROVED">Approved</option>
                    <option value="SUSPENDED">Suspended</option>
                    <option value="CREDIT_HOLD">Credit Hold</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Notes / Onboarding Context
                </label>
                <textarea
                  rows={3}
                  placeholder="Optional account notes or lead context..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-xl transition disabled:opacity-50 flex items-center gap-2"
                >
                  {submitting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  Save Customer Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
