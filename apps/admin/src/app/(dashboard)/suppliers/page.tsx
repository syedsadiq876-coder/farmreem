"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  Tractor,
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
  UserCheck,
  ShieldX,
  Store,
  Truck,
  MapPin,
  PhoneCall,
  User,
} from "lucide-react";

interface Supplier {
  id: string;
  supplier_code: string;
  legal_name: string;
  trade_name: string | null;
  supplier_type: "POULTRY_FARM" | "WHOLESALE_MANDI" | "PARTNER_FARM" | "PROCESSOR" | "DISTRIBUTOR" | "OTHER";
  sourcing_channel: "DIRECT_FARM" | "MANDI_TRADER" | "CONTRACT_FARMING" | "INTEGRATOR" | "OTHER";
  gstin: string | null;
  pan: string | null;
  status: "PROSPECT" | "PENDING_VERIFICATION" | "ACTIVE" | "ON_HOLD" | "INACTIVE";
  verification_status: "UNVERIFIED" | "VERIFIED" | "SUSPENDED";
  assigned_procurement_owner?: { id: string; full_name: string; email: string } | null;
  primary_contact?: { contact_name: string; phone: string | null; email: string | null } | null;
  primary_address?: { city: string; state: string } | null;
  created_at: string;
  updated_at: string;
}

interface StaffUser {
  id: string;
  full_name: string;
  email: string;
}

const TYPE_MAP: Record<string, { label: string; bg: string; text: string }> = {
  POULTRY_FARM: { label: "Poultry Farm", bg: "bg-emerald-500/10", text: "text-emerald-400" },
  WHOLESALE_MANDI: { label: "Wholesale Mandi", bg: "bg-amber-500/10", text: "text-amber-400" },
  PARTNER_FARM: { label: "Partner Farm", bg: "bg-blue-500/10", text: "text-blue-400" },
  PROCESSOR: { label: "Processor", bg: "bg-purple-500/10", text: "text-purple-400" },
  DISTRIBUTOR: { label: "Distributor", bg: "bg-indigo-500/10", text: "text-indigo-400" },
  OTHER: { label: "Other", bg: "bg-slate-800", text: "text-slate-400" },
};

const CHANNEL_MAP: Record<string, { label: string; bg: string; text: string }> = {
  DIRECT_FARM: { label: "Direct Farm", bg: "bg-teal-500/10", text: "text-teal-400" },
  MANDI_TRADER: { label: "Mandi Trader", bg: "bg-orange-500/10", text: "text-orange-400" },
  CONTRACT_FARMING: { label: "Contract Farming", bg: "bg-sky-500/10", text: "text-sky-400" },
  INTEGRATOR: { label: "Integrator", bg: "bg-violet-500/10", text: "text-violet-400" },
  OTHER: { label: "Other", bg: "bg-slate-800", text: "text-slate-400" },
};

const STATUS_MAP: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  PROSPECT: { label: "Prospect", bg: "bg-slate-800", text: "text-slate-400", dot: "bg-slate-500" },
  PENDING_VERIFICATION: { label: "Pending Verification", bg: "bg-amber-500/10", text: "text-amber-400", dot: "bg-amber-400 animate-pulse" },
  ACTIVE: { label: "Active", bg: "bg-emerald-500/10", text: "text-emerald-400", dot: "bg-emerald-400 animate-pulse" },
  ON_HOLD: { label: "On Hold", bg: "bg-orange-500/10", text: "text-orange-400", dot: "bg-orange-400" },
  INACTIVE: { label: "Inactive", bg: "bg-slate-800", text: "text-slate-500", dot: "bg-slate-600" },
};

const VERIFICATION_MAP: Record<string, { label: string; bg: string; text: string }> = {
  UNVERIFIED: { label: "Unverified", bg: "bg-slate-800", text: "text-slate-400" },
  VERIFIED: { label: "FarmReem Verified", bg: "bg-emerald-500/10", text: "text-emerald-400" },
  SUSPENDED: { label: "Suspended", bg: "bg-red-500/10", text: "text-red-400" },
};

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [staffUsers, setStaffUsers] = useState<StaffUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [channelFilter, setChannelFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [verificationFilter, setVerificationFilter] = useState("ALL");

  // Add Modal State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    legal_name: "",
    trade_name: "",
    supplier_type: "POULTRY_FARM",
    sourcing_channel: "DIRECT_FARM",
    gstin: "",
    pan: "",
    status: "PROSPECT",
    verification_status: "UNVERIFIED",
    assigned_procurement_owner_id: "",
    notes: "",
  });

  const fetchSuppliers = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append("search", searchQuery);
      if (typeFilter !== "ALL") params.append("supplier_type", typeFilter);
      if (channelFilter !== "ALL") params.append("sourcing_channel", channelFilter);
      if (statusFilter !== "ALL") params.append("status", statusFilter);
      if (verificationFilter !== "ALL") params.append("verification_status", verificationFilter);

      const res = await fetch(`/api/suppliers?${params.toString()}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to load suppliers");

      setSuppliers(data.suppliers || []);
    } catch (err: any) {
      setError(err.message || "Error communicating with server");
    } finally {
      setLoading(false);
    }
  };

  const fetchSetup = async () => {
    try {
      const res = await fetch("/api/suppliers/setup");
      if (res.ok) {
        const data = await res.json();
        if (data.staffUsers) {
          setStaffUsers(data.staffUsers);
        }
      }
    } catch (e) {
      // Non-blocking
    }
  };

  useEffect(() => {
    fetchSetup();
  }, []);

  useEffect(() => {
    fetchSuppliers();
  }, [searchQuery, typeFilter, channelFilter, statusFilter, verificationFilter]);

  // Dynamic KPIs derived from actual database records
  const stats = useMemo(() => {
    const total = suppliers.length;
    const active = suppliers.filter((s) => s.status === "ACTIVE").length;
    const pending = suppliers.filter((s) => s.status === "PENDING_VERIFICATION").length;
    const onHold = suppliers.filter((s) => s.status === "ON_HOLD").length;
    const typesCount = new Set(suppliers.map((s) => s.supplier_type)).size;

    return { total, active, pending, onHold, typesCount };
  }, [suppliers]);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setModalError(null);

    try {
      const res = await fetch("/api/suppliers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          legal_name: formData.legal_name,
          trade_name: formData.trade_name || null,
          supplier_type: formData.supplier_type,
          sourcing_channel: formData.sourcing_channel,
          gstin: formData.gstin || null,
          pan: formData.pan || null,
          status: formData.status,
          verification_status: formData.verification_status,
          assigned_procurement_owner_id: formData.assigned_procurement_owner_id || null,
          notes: formData.notes || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create supplier");

      setIsAddOpen(false);
      setFormData({
        legal_name: "",
        trade_name: "",
        supplier_type: "POULTRY_FARM",
        sourcing_channel: "DIRECT_FARM",
        gstin: "",
        pan: "",
        status: "PROSPECT",
        verification_status: "UNVERIFIED",
        assigned_procurement_owner_id: "",
        notes: "",
      });
      fetchSuppliers();
    } catch (err: any) {
      setModalError(err.message || "Failed to create supplier");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-emerald-900/30 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Tractor className="h-7 w-7 text-emerald-400" />
            <h1 className="text-2xl font-bold tracking-tight text-slate-100">
              Suppliers & Farms Master
            </h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Manage poultry farms, mandi traders, integrators, and processing partners.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchSuppliers}
            className="p-2.5 rounded-lg border border-slate-800 bg-slate-900/80 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            title="Refresh Suppliers"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin text-emerald-400" : ""}`} />
          </button>
          <button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm transition-all shadow-lg shadow-emerald-900/30 active:scale-95"
          >
            <Plus className="h-4 w-4" />
            Add Supplier
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-md">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Suppliers</span>
            <Building2 className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100">{stats.total}</div>
          <div className="text-xs text-slate-400 mt-1">Master Records</div>
        </div>

        <div className="rounded-xl border border-emerald-900/30 bg-emerald-950/20 p-4 backdrop-blur-md">
          <div className="flex items-center justify-between text-emerald-400/80 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Active</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-300">{stats.active}</div>
          <div className="text-xs text-emerald-400/60 mt-1">Ready for Sourcing</div>
        </div>

        <div className="rounded-xl border border-amber-900/30 bg-amber-950/20 p-4 backdrop-blur-md">
          <div className="flex items-center justify-between text-amber-400/80 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Pending Verification</span>
            <Clock className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-300">{stats.pending}</div>
          <div className="text-xs text-amber-400/60 mt-1">Awaiting Onboarding</div>
        </div>

        <div className="rounded-xl border border-orange-900/30 bg-orange-950/20 p-4 backdrop-blur-md">
          <div className="flex items-center justify-between text-orange-400/80 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">On Hold</span>
            <PauseCircle className="h-4 w-4 text-orange-400" />
          </div>
          <div className="text-2xl font-bold text-orange-300">{stats.onHold}</div>
          <div className="text-xs text-orange-400/60 mt-1">Operational Pause</div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-md">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Supplier Types</span>
            <Store className="h-4 w-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100">{stats.typesCount}</div>
          <div className="text-xs text-slate-400 mt-1">Categories Represented</div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between bg-slate-900/70 p-4 rounded-xl border border-slate-800">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by code, legal name, trade name, GSTIN, PAN..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500"
            >
              <option value="ALL">All Types</option>
              <option value="POULTRY_FARM">Poultry Farm</option>
              <option value="WHOLESALE_MANDI">Wholesale Mandi</option>
              <option value="PARTNER_FARM">Partner Farm</option>
              <option value="PROCESSOR">Processor</option>
              <option value="DISTRIBUTOR">Distributor</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <select
            value={channelFilter}
            onChange={(e) => setChannelFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">All Sourcing Channels</option>
            <option value="DIRECT_FARM">Direct Farm</option>
            <option value="MANDI_TRADER">Mandi Trader</option>
            <option value="CONTRACT_FARMING">Contract Farming</option>
            <option value="INTEGRATOR">Integrator</option>
            <option value="OTHER">Other</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">All Lifecycle Statuses</option>
            <option value="PROSPECT">Prospect</option>
            <option value="PENDING_VERIFICATION">Pending Verification</option>
            <option value="ACTIVE">Active</option>
            <option value="ON_HOLD">On Hold</option>
            <option value="INACTIVE">Inactive</option>
          </select>

          <select
            value={verificationFilter}
            onChange={(e) => setVerificationFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">All Verification States</option>
            <option value="UNVERIFIED">Unverified</option>
            <option value="VERIFIED">FarmReem Verified</option>
            <option value="SUSPENDED">Suspended</option>
          </select>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="rounded-xl border border-red-900/50 bg-red-950/20 p-4 text-sm text-red-300 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/50 overflow-hidden backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/80 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-4 py-3.5">Supplier Code</th>
                <th className="px-4 py-3.5">Business Name</th>
                <th className="px-4 py-3.5">Supplier Type</th>
                <th className="px-4 py-3.5">Sourcing Channel</th>
                <th className="px-4 py-3.5">Primary Contact</th>
                <th className="px-4 py-3.5">City</th>
                <th className="px-4 py-3.5">Procurement Owner</th>
                <th className="px-4 py-3.5">Lifecycle</th>
                <th className="px-4 py-3.5">Verification</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={10} className="px-4 py-12 text-center text-slate-500">
                    <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-emerald-400" />
                    Loading supplier directory...
                  </td>
                </tr>
              ) : suppliers.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-12 text-center text-slate-500">
                    No supplier records found matching criteria.
                  </td>
                </tr>
              ) : (
                suppliers.map((supplier) => {
                  const typeMeta = TYPE_MAP[supplier.supplier_type] || TYPE_MAP.OTHER;
                  const channelMeta = CHANNEL_MAP[supplier.sourcing_channel] || CHANNEL_MAP.OTHER;
                  const statusMeta = STATUS_MAP[supplier.status] || STATUS_MAP.PROSPECT;
                  const verifMeta = VERIFICATION_MAP[supplier.verification_status] || VERIFICATION_MAP.UNVERIFIED;

                  return (
                    <tr key={supplier.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-4 py-3.5 font-mono text-xs font-semibold text-emerald-400">
                        {supplier.supplier_code}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="font-medium text-slate-100">{supplier.legal_name}</div>
                        {supplier.trade_name && (
                          <div className="text-xs text-slate-400 font-normal">
                            Trade: {supplier.trade_name}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${typeMeta.bg} ${typeMeta.text}`}
                        >
                          {typeMeta.label}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${channelMeta.bg} ${channelMeta.text}`}
                        >
                          {channelMeta.label}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-xs text-slate-300">
                        {supplier.primary_contact ? (
                          <div>
                            <div className="font-medium text-slate-200">{supplier.primary_contact.contact_name}</div>
                            {supplier.primary_contact.phone && (
                              <div className="text-slate-400">{supplier.primary_contact.phone}</div>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-500 italic">No primary</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-xs text-slate-300">
                        {supplier.primary_address ? (
                          <span>{supplier.primary_address.city}, {supplier.primary_address.state}</span>
                        ) : (
                          <span className="text-slate-500 italic">No location</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-xs text-slate-300">
                        {supplier.assigned_procurement_owner ? (
                          <div>
                            <div className="font-medium text-slate-200">
                              {supplier.assigned_procurement_owner.full_name}
                            </div>
                            <div className="text-slate-500 text-[11px]">
                              {supplier.assigned_procurement_owner.email}
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-500 italic">Unassigned</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusMeta.bg} ${statusMeta.text}`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${statusMeta.dot}`} />
                          {statusMeta.label}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${verifMeta.bg} ${verifMeta.text}`}
                        >
                          {verifMeta.label}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <Link
                          href={`/suppliers/${supplier.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
                        >
                          <Eye className="h-3.5 w-3.5 text-emerald-400" />
                          View Master
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Supplier Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-2xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <Tractor className="h-5 w-5 text-emerald-400" />
                  Onboard New Supplier / Farm
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Supplier Code will be database-generated automatically (e.g. FR-SUPP-000001).
                </p>
              </div>
              <button
                onClick={() => setIsAddOpen(false)}
                className="text-slate-400 hover:text-slate-200 text-xl font-bold"
              >
                &times;
              </button>
            </div>

            {modalError && (
              <div className="bg-red-950/30 border border-red-800/50 rounded-lg p-3 text-xs text-red-300">
                {modalError}
              </div>
            )}

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Legal / Business Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Greenfield Poultry Farms Pvt Ltd"
                    value={formData.legal_name}
                    onChange={(e) => setFormData({ ...formData, legal_name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Trade Name / DB Name (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Greenfield Farms"
                    value={formData.trade_name}
                    onChange={(e) => setFormData({ ...formData, trade_name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Supplier Type <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={formData.supplier_type}
                    onChange={(e) =>
                      setFormData({ ...formData, supplier_type: e.target.value as any })
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="POULTRY_FARM">Poultry Farm</option>
                    <option value="WHOLESALE_MANDI">Wholesale Mandi</option>
                    <option value="PARTNER_FARM">Partner Farm</option>
                    <option value="PROCESSOR">Processor</option>
                    <option value="DISTRIBUTOR">Distributor</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Sourcing Channel <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={formData.sourcing_channel}
                    onChange={(e) =>
                      setFormData({ ...formData, sourcing_channel: e.target.value as any })
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="DIRECT_FARM">Direct Farm</option>
                    <option value="MANDI_TRADER">Mandi Trader</option>
                    <option value="CONTRACT_FARMING">Contract Farming</option>
                    <option value="INTEGRATOR">Integrator</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    GSTIN (Optional)
                  </label>
                  <input
                    type="text"
                    maxLength={15}
                    placeholder="e.g. 29ABCDE1234F1Z5"
                    value={formData.gstin}
                    onChange={(e) => setFormData({ ...formData, gstin: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 uppercase focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    PAN (Optional)
                  </label>
                  <input
                    type="text"
                    maxLength={10}
                    placeholder="e.g. ABCDE1234F"
                    value={formData.pan}
                    onChange={(e) => setFormData({ ...formData, pan: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 uppercase focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Lifecycle Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="PROSPECT">Prospect</option>
                    <option value="PENDING_VERIFICATION">Pending Verification</option>
                    <option value="ACTIVE">Active</option>
                    <option value="ON_HOLD">On Hold</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Verification State
                  </label>
                  <select
                    value={formData.verification_status}
                    onChange={(e) =>
                      setFormData({ ...formData, verification_status: e.target.value as any })
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="UNVERIFIED">Unverified</option>
                    <option value="VERIFIED">FarmReem Verified</option>
                    <option value="SUSPENDED">Suspended</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Procurement Owner
                  </label>
                  <select
                    value={formData.assigned_procurement_owner_id}
                    onChange={(e) =>
                      setFormData({ ...formData, assigned_procurement_owner_id: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="">Unassigned</option>
                    {staffUsers.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.full_name} ({user.email})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Internal notes, farm access remarks, biosecurity notes..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-slate-800 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-800 bg-slate-950 text-slate-300 text-sm font-medium hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {submitting && <RefreshCw className="h-4 w-4 animate-spin" />}
                  Save Supplier Master
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
