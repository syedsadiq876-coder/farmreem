"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  FileText,
  Building2,
  Calendar,
  DollarSign,
  Plus,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Send,
  History,
  ShieldCheck,
  Building,
  FileCheck,
  Ban,
  Clock,
  Trash2,
  Tag,
  AlertTriangle,
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  sku: string;
  uom: string;
  tax_rate_percent: number;
}

interface QuotationItem {
  id: string;
  line_number: number;
  product_id: string;
  product_name_snapshot: string;
  sku_snapshot: string;
  uom_snapshot: string;
  quantity: number;
  unit_price: number;
  price_list_id: string | null;
  price_list_code_snapshot: string | null;
  taxable_amount: number;
  tax_classification: "INTRA_STATE" | "INTER_STATE";
  cgst_rate_percent: number;
  cgst_amount: number;
  sgst_rate_percent: number;
  sgst_amount: number;
  igst_rate_percent: number;
  igst_amount: number;
  tax_total_amount: number;
  line_total_amount: number;
}

interface Quotation {
  id: string;
  quotation_number: string;
  revision_number: number;
  root_quotation_id: string;
  parent_quotation_id: string | null;
  customer_id: string;
  customer?: { id: string; legal_name: string; customer_code: string; gstin: string | null } | null;
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
  subtotal: number;
  tax_total: number;
  grand_total: number;
  place_of_supply_state_code: string;
  place_of_supply_state_name: string | null;
  seller_tax_profile_id: string | null;
  seller_legal_name_snapshot: string | null;
  seller_trade_name_snapshot: string | null;
  seller_gstin_snapshot: string | null;
  seller_registered_address_snapshot: string | null;
  seller_state_name_snapshot: string | null;
  seller_state_code_snapshot: string | null;
  valid_until: string;
  notes: string | null;
  terms_and_conditions: string | null;
  created_at: string;
  approved_at: string | null;
  issued_at: string | null;
  sent_at: string | null;
  accepted_at: string | null;
  creator?: { id: string; full_name: string; email: string } | null;
  approver?: { id: string; full_name: string; email: string } | null;
  items?: QuotationItem[];
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

export default function QuotationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const quotationId = params.id as string;

  const [quotation, setQuotation] = useState<Quotation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // Add Item Modal/Form state
  const [products, setProducts] = useState<Product[]>([]);
  const [showAddItem, setShowAddItem] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [itemQuantity, setItemQuantity] = useState("10");

  // Approval Self Override Modal
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [selfApprovalReason, setSelfApprovalReason] = useState("");

  const fetchQuotation = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/quotations/${quotationId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch quotation details.");
      setQuotation(data.quotation);
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      if (res.ok && data.products) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error("Failed to fetch products:", err);
    }
  };

  useEffect(() => {
    fetchQuotation();
    fetchProducts();
  }, [quotationId]);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId) return;

    setActionLoading(true);
    setActionMessage(null);
    setError(null);

    try {
      const res = await fetch(`/api/quotations/${quotationId}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: selectedProductId,
          quantity: parseFloat(itemQuantity),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add quotation item.");

      setShowAddItem(false);
      setSelectedProductId("");
      setItemQuantity("10");
      await fetchQuotation();
    } catch (err: any) {
      setError(err.message || "Failed to add line item.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleSubmitForApproval = async () => {
    setActionLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/quotations/${quotationId}/submit`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit quotation for approval.");
      await fetchQuotation();
    } catch (err: any) {
      setError(err.message || "Failed to submit for approval.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleApprove = async () => {
    setActionLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/quotations/${quotationId}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          self_approval_reason: selfApprovalReason || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to approve quotation.");
      setShowApproveModal(false);
      await fetchQuotation();
    } catch (err: any) {
      setError(err.message || "Failed to approve quotation.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleSend = async () => {
    setActionLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/quotations/${quotationId}/send`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to formally issue quotation.");
      await fetchQuotation();
    } catch (err: any) {
      setError(err.message || "Failed to send quotation.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleAccept = async () => {
    setActionLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/quotations/${quotationId}/accept`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to mark quotation as accepted.");
      await fetchQuotation();
    } catch (err: any) {
      setError(err.message || "Failed to accept quotation.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRevise = async () => {
    setActionLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/quotations/${quotationId}/revise`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create revision.");
      router.push(`/quotations/${data.revised_quotation.id}`);
    } catch (err: any) {
      setError(err.message || "Failed to create revision.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel this quotation?")) return;
    setActionLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/quotations/${quotationId}/cancel`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to cancel quotation.");
      await fetchQuotation();
    } catch (err: any) {
      setError(err.message || "Failed to cancel quotation.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-400 bg-slate-900/40 rounded-2xl border border-slate-800">
        <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-400" />
        <span>Loading quotation details...</span>
      </div>
    );
  }

  if (error && !quotation) {
    return (
      <div className="p-6 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-6 h-6 shrink-0" />
          <span>{error}</span>
        </div>
        <Link href="/quotations" className="px-4 py-2 bg-slate-800 rounded-xl text-white text-xs font-semibold">
          Return to Directory
        </Link>
      </div>
    );
  }

  if (!quotation) return null;

  const statusInfo = STATUS_MAP[quotation.status] || STATUS_MAP.DRAFT;
  const isEditable = quotation.status === "DRAFT" || quotation.status === "INTERNAL_REJECTED";

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <Link
            href="/quotations"
            className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white tracking-tight">
                {quotation.quotation_number}
              </h1>
              <span className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-full text-xs font-mono text-emerald-400 font-semibold">
                Rev {quotation.revision_number}
              </span>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${statusInfo.bg} ${statusInfo.text}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`} />
                {statusInfo.label}
              </span>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Customer: <span className="text-white font-medium">{quotation.customer?.legal_name}</span> ({quotation.customer?.customer_code})
            </p>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          {quotation.status === "DRAFT" && (
            <button
              onClick={handleSubmitForApproval}
              disabled={actionLoading || (quotation.items?.length || 0) === 0}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold hover:bg-amber-500/30 transition disabled:opacity-40"
            >
              <Send className="w-3.5 h-3.5" /> Submit for Approval
            </button>
          )}

          {quotation.status === "PENDING_APPROVAL" && (
            <button
              onClick={() => setShowApproveModal(true)}
              disabled={actionLoading}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-500/20 border border-teal-500/30 text-teal-300 text-xs font-semibold hover:bg-teal-500/30 transition"
            >
              <ShieldCheck className="w-3.5 h-3.5" /> Approve Quotation
            </button>
          )}

          {quotation.status === "APPROVED" && (
            <button
              onClick={handleSend}
              disabled={actionLoading}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-semibold hover:bg-blue-500/30 transition"
            >
              <FileCheck className="w-3.5 h-3.5" /> Formally Issue & Send
            </button>
          )}

          {quotation.status === "SENT" && (
            <>
              <button
                onClick={handleAccept}
                disabled={actionLoading}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold hover:bg-emerald-500/30 transition"
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> Mark Accepted
              </button>
              <button
                onClick={handleRevise}
                disabled={actionLoading}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-semibold hover:bg-purple-500/30 transition"
              >
                <History className="w-3.5 h-3.5" /> Create Revision N+1
              </button>
            </>
          )}

          {(quotation.status === "DECLINED" || quotation.status === "EXPIRED") && (
            <button
              onClick={handleRevise}
              disabled={actionLoading}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-semibold hover:bg-purple-500/30 transition"
            >
              <History className="w-3.5 h-3.5" /> Create Revision N+1
            </button>
          )}

          {quotation.status !== "CANCELLED" && quotation.status !== "SUPERSEDED" && quotation.status !== "ACCEPTED" && (
            <button
              onClick={handleCancel}
              disabled={actionLoading}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold hover:bg-rose-500/20 transition"
            >
              <Ban className="w-3.5 h-3.5" /> Cancel
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 text-rose-400 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Detail Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Customer & Place of Supply */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <Building2 className="w-4 h-4 text-emerald-400" /> Customer Information
          </div>
          <div className="space-y-1">
            <div className="text-white font-semibold">{quotation.customer?.legal_name}</div>
            <div className="text-xs text-slate-400 font-mono">Code: {quotation.customer?.customer_code}</div>
            <div className="text-xs text-slate-400">GSTIN: {quotation.customer?.gstin || "N/A"}</div>
            <div className="text-xs text-slate-300 mt-2">
              Place of Supply: <span className="font-mono text-emerald-400">{quotation.place_of_supply_state_code}</span> ({quotation.place_of_supply_state_name || "N/A"})
            </div>
          </div>
        </div>

        {/* Seller Tax Identity Snapshot */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <Building className="w-4 h-4 text-blue-400" /> Authoritative Seller Tax Profile Snapshot
          </div>
          <div className="space-y-1 text-xs">
            {quotation.seller_legal_name_snapshot ? (
              <>
                <div className="text-white font-semibold">{quotation.seller_legal_name_snapshot}</div>
                <div className="text-slate-400 font-mono">GSTIN: {quotation.seller_gstin_snapshot}</div>
                <div className="text-slate-400">State Code: {quotation.seller_state_code_snapshot} ({quotation.seller_state_name_snapshot})</div>
                <div className="text-slate-500 text-[11px] truncate">{quotation.seller_registered_address_snapshot}</div>
              </>
            ) : (
              <div className="text-amber-400 italic bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20">
                Pending formal issuance. Seller tax snapshot will be stamped upon send.
              </div>
            )}
          </div>
        </div>

        {/* Validity & Metadata */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <Calendar className="w-4 h-4 text-purple-400" /> Validity & Timestamps
          </div>
          <div className="space-y-1.5 text-xs text-slate-300">
            <div>Valid Until: <span className="font-semibold text-white">{new Date(quotation.valid_until).toLocaleDateString()}</span></div>
            <div>Created: <span className="text-slate-400">{new Date(quotation.created_at).toLocaleString()}</span> ({quotation.creator?.full_name || "Staff"})</div>
            {quotation.approved_at && <div>Approved: <span className="text-slate-400">{new Date(quotation.approved_at).toLocaleString()}</span></div>}
            {quotation.issued_at && <div>Issued: <span className="text-slate-400">{new Date(quotation.issued_at).toLocaleString()}</span></div>}
          </div>
        </div>
      </div>

      {/* Line Items Table */}
      <div className="bg-slate-900/60 rounded-2xl border border-slate-800 overflow-hidden backdrop-blur-xl">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">Quotation Line Items</h3>
            <p className="text-xs text-slate-400">Pricing Engine V1 resolved rates with 4-decimal tax calculations</p>
          </div>
          {isEditable && (
            <button
              onClick={() => setShowAddItem(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold hover:bg-emerald-500/30 transition"
            >
              <Plus className="w-3.5 h-3.5" /> Add Line Item
            </button>
          )}
        </div>

        {/* Add Item Inline Panel */}
        {showAddItem && (
          <form onSubmit={handleAddItem} className="p-4 bg-slate-950/80 border-b border-slate-800 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-7">
                <label className="text-xs font-semibold text-slate-300 mb-1 block">Select Product</label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500"
                >
                  <option value="">-- Choose Product --</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.sku}) - UOM: {p.uom} - Tax: {p.tax_rate_percent}%
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-3">
                <label className="text-xs font-semibold text-slate-300 mb-1 block">Quantity</label>
                <input
                  type="number"
                  step="0.0001"
                  min="0.0001"
                  required
                  value={itemQuantity}
                  onChange={(e) => setItemQuantity(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="md:col-span-2 flex items-end gap-2">
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="w-full py-2 bg-emerald-500 text-slate-950 rounded-xl text-xs font-bold hover:bg-emerald-400 transition"
                >
                  Resolve & Add
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddItem(false)}
                  className="px-3 py-2 bg-slate-800 text-slate-400 rounded-xl text-xs hover:text-white"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/60 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5">#</th>
                <th className="px-5 py-3.5">Product / SKU</th>
                <th className="px-5 py-3.5 text-right">Qty & UOM</th>
                <th className="px-5 py-3.5 text-right">Resolved Price</th>
                <th className="px-5 py-3.5">Price List Snapshot</th>
                <th className="px-5 py-3.5 text-right">Taxable Amount</th>
                <th className="px-5 py-3.5 text-right">Tax Class / Breakdown</th>
                <th className="px-5 py-3.5 text-right">Line Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {(!quotation.items || quotation.items.length === 0) ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-slate-500">
                    No line items added yet. Click "Add Line Item" to resolve pricing.
                  </td>
                </tr>
              ) : (
                quotation.items.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/30 transition font-mono">
                    <td className="px-5 py-4 text-slate-500 font-sans">{item.line_number}</td>
                    <td className="px-5 py-4 font-sans">
                      <div className="font-semibold text-white">{item.product_name_snapshot}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{item.sku_snapshot}</div>
                    </td>
                    <td className="px-5 py-4 text-right font-sans">
                      <span className="text-white font-semibold font-mono">{item.quantity}</span> {item.uom_snapshot}
                    </td>
                    <td className="px-5 py-4 text-right text-emerald-400 font-bold">
                      ₹{Number(item.unit_price).toFixed(2)}
                    </td>
                    <td className="px-5 py-4 font-sans">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 text-[11px] font-mono text-slate-300">
                        <Tag className="w-3 h-3 text-emerald-400" />
                        {item.price_list_code_snapshot || "BASE"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right text-slate-200">
                      ₹{Number(item.taxable_amount).toFixed(4)}
                    </td>
                    <td className="px-5 py-4 text-right font-sans">
                      <span className="text-[11px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-semibold block mb-0.5">
                        {item.tax_classification}
                      </span>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {item.tax_classification === "INTRA_STATE"
                          ? `CGST ${item.cgst_rate_percent}% (₹${Number(item.cgst_amount).toFixed(2)}) + SGST ${item.sgst_rate_percent}% (₹${Number(item.sgst_amount).toFixed(2)})`
                          : `IGST ${item.igst_rate_percent}% (₹${Number(item.igst_amount).toFixed(2)})`}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right text-emerald-400 font-bold font-sans">
                      ₹{Number(item.line_total_amount).toFixed(2)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Totals Summary Footer */}
        <div className="p-5 bg-slate-950/60 border-t border-slate-800 flex justify-end">
          <div className="w-72 space-y-2 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Subtotal (Taxable):</span>
              <span className="font-mono text-white">₹{Number(quotation.subtotal || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>GST Total:</span>
              <span className="font-mono text-white">₹{Number(quotation.tax_total || 0).toFixed(2)}</span>
            </div>
            <div className="pt-2 border-t border-slate-800 flex justify-between text-base font-bold text-emerald-400">
              <span>Grand Total:</span>
              <span className="font-mono">₹{Number(quotation.grand_total || 0).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Self Approval Override Modal */}
      {showApproveModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
              <h3 className="text-lg font-bold text-white">Approve Quotation</h3>
            </div>
            <p className="text-xs text-slate-400">
              Maker-checker rule: If you are the creator (SUPER_ADMIN self-approval), you MUST provide an explicit audit reason.
            </p>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-200">Self-Approval Reason (If Creator)</label>
              <textarea
                rows={3}
                placeholder="Required if approving your own created quotation..."
                value={selfApprovalReason}
                onChange={(e) => setSelfApprovalReason(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowApproveModal(false)}
                className="px-4 py-2 bg-slate-800 rounded-xl text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleApprove}
                disabled={actionLoading}
                className="px-5 py-2 bg-emerald-500 text-slate-950 rounded-xl text-xs font-bold hover:bg-emerald-400 transition"
              >
                Confirm Approval
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
