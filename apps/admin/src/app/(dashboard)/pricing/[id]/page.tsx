"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Tag,
  Plus,
  Send,
  CheckCircle2,
  XCircle,
  Power,
  RefreshCw,
  AlertCircle,
  Building2,
  Tractor,
  DollarSign,
  ShieldCheck,
  ShieldAlert,
  Clock,
  Calendar,
  Layers,
} from "lucide-react";

interface ProductOption {
  id: string;
  sku: string;
  name: string;
  category: string;
  unit_of_measure: string;
}

interface PriceListItem {
  id: string;
  price_list_id: string;
  product_id: string;
  unit_price: number;
  currency: string;
  uom: string;
  min_quantity: number;
  version: number;
  is_superseded: boolean;
  effective_from: string;
  effective_to: string | null;
  product?: { sku: string; name: string; category: string; unit_of_measure: string } | null;
}

interface PriceListDetail {
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
  created_by: string;
  approved_by: string | null;
  approved_at: string | null;
  creator?: { id: string; full_name: string; email: string } | null;
  approver?: { id: string; full_name: string; email: string } | null;
  created_at: string;
  updated_at: string;
}

export default function PriceListDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [priceList, setPriceList] = useState<PriceListDetail | null>(null);
  const [items, setItems] = useState<PriceListItem[]>([]);
  const [products, setProducts] = useState<ProductOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Modal States
  const [showItemModal, setShowItemModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);

  // Item Form States
  const [selectedProductId, setSelectedProductId] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [minQty, setMinQty] = useState("1.000");
  const [effectiveFrom, setEffectiveFrom] = useState(new Date().toISOString().substring(0, 10));
  const [itemSaving, setItemSaving] = useState(false);

  // Approve Form States
  const [overrideReason, setOverrideReason] = useState("");
  const [approving, setApproving] = useState(false);

  // Reject Form States
  const [rejectReason, setRejectReason] = useState("");
  const [rejecting, setRejecting] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const fetchDetail = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/pricing/${id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load price list detail.");
      setPriceList(data.price_list);
      setItems(data.items || []);
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();

    // Fetch active products for line-item editor
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data.products || []))
      .catch(() => {});
  }, [id]);

  // Add Item Handler
  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setItemSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/pricing/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          price_list_id: id,
          product_id: selectedProductId,
          unit_price: parseFloat(unitPrice),
          min_quantity: parseFloat(minQty),
          effective_from: new Date(effectiveFrom).toISOString(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add price line item.");

      setShowItemModal(false);
      setSelectedProductId("");
      setUnitPrice("");
      setActionSuccess("Line item added successfully.");
      fetchDetail();
    } catch (err: any) {
      setError(err.message || "Failed to add line item.");
    } finally {
      setItemSaving(false);
    }
  };

  // Submit Handler
  const handleSubmitForApproval = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/pricing/${id}/submit`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit price list.");
      setActionSuccess("Price list submitted for approval (DRAFT -> PENDING_APPROVAL).");
      fetchDetail();
    } catch (err: any) {
      setError(err.message || "Failed to submit.");
    } finally {
      setSubmitting(false);
    }
  };

  // Approve Handler
  const handleApprove = async (e: React.FormEvent) => {
    e.preventDefault();
    setApproving(true);
    setError(null);
    try {
      const res = await fetch(`/api/pricing/${id}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ override_reason: overrideReason }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to approve price list.");

      setShowApproveModal(false);
      setActionSuccess("Price list approved and activated (PENDING_APPROVAL -> ACTIVE).");
      fetchDetail();
    } catch (err: any) {
      setError(err.message || "Approval failed.");
    } finally {
      setApproving(false);
    }
  };

  // Reject Handler
  const handleReject = async (e: React.FormEvent) => {
    e.preventDefault();
    setRejecting(true);
    setError(null);
    try {
      const res = await fetch(`/api/pricing/${id}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: rejectReason }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to reject price list.");

      setShowRejectModal(false);
      setActionSuccess("Price list rejected.");
      fetchDetail();
    } catch (err: any) {
      setError(err.message || "Rejection failed.");
    } finally {
      setRejecting(false);
    }
  };

  // Deactivate Handler
  const handleDeactivate = async () => {
    if (!confirm("Are you sure you want to deactivate this active price list?")) return;
    setError(null);
    try {
      const res = await fetch(`/api/pricing/${id}/deactivate`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to deactivate price list.");
      setActionSuccess("Price list deactivated (ACTIVE -> INACTIVE).");
      fetchDetail();
    } catch (err: any) {
      setError(err.message || "Deactivation failed.");
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-400 bg-slate-900/40 rounded-2xl border border-slate-800">
        <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-400" />
        <span>Loading price list details...</span>
      </div>
    );
  }

  if (error && !priceList) {
    return (
      <div className="p-6 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 space-y-4">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-6 h-6 shrink-0" />
          <span className="font-semibold">{error}</span>
        </div>
        <Link href="/pricing" className="inline-flex items-center gap-2 text-sm text-slate-300 underline hover:text-white">
          <ArrowLeft className="w-4 h-4" /> Return to Pricing Directory
        </Link>
      </div>
    );
  }

  if (!priceList) return null;

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <Link
            href="/pricing"
            className="p-2.5 rounded-xl border border-slate-800 bg-slate-950 text-slate-400 hover:text-white hover:border-slate-700 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white tracking-tight">{priceList.name}</h1>
              <span className="px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-400 font-mono text-xs font-semibold border border-slate-700">
                {priceList.price_list_code}
              </span>
            </div>
            <div className="flex items-center gap-4 mt-1 text-xs text-slate-400">
              <span>Type: <strong className="text-slate-200">{priceList.list_type}</strong></span>
              {priceList.customer && <span>Customer: <strong className="text-blue-400">{priceList.customer.legal_name}</strong></span>}
              {priceList.supplier && <span>Supplier: <strong className="text-amber-400">{priceList.supplier.legal_name}</strong></span>}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {priceList.status === "DRAFT" && (
            <>
              <button
                onClick={() => setShowItemModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-slate-200 text-sm font-semibold hover:bg-slate-700 transition"
              >
                <Plus className="w-4 h-4 text-emerald-400" /> Add Line Item
              </button>
              <button
                onClick={handleSubmitForApproval}
                disabled={submitting || items.length === 0}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-semibold hover:from-emerald-400 hover:to-teal-500 shadow-lg shadow-emerald-500/20 disabled:opacity-50 transition"
              >
                {submitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Submit for Approval
              </button>
            </>
          )}

          {priceList.status === "PENDING_APPROVAL" && (
            <>
              <button
                onClick={() => setShowRejectModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-400 text-sm font-semibold hover:bg-rose-500/20 transition"
              >
                <XCircle className="w-4 h-4" /> Reject
              </button>
              <button
                onClick={() => setShowApproveModal(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-semibold hover:from-emerald-400 hover:to-teal-500 shadow-lg shadow-emerald-500/20 transition"
              >
                <ShieldCheck className="w-4 h-4" /> Approve & Activate
              </button>
            </>
          )}

          {priceList.status === "ACTIVE" && (
            <button
              onClick={handleDeactivate}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 text-sm font-semibold hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/30 transition"
            >
              <Power className="w-4 h-4" /> Deactivate
            </button>
          )}
        </div>
      </div>

      {actionSuccess && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3 text-emerald-400 text-sm">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 text-rose-400 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Line Items Table Card */}
      <div className="bg-slate-900/60 rounded-2xl border border-slate-800 overflow-hidden backdrop-blur-xl">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Versioned Line Items</h2>
            <p className="text-xs text-slate-400">Snapshot UOMs and threshold quantities</p>
          </div>
          <span className="text-xs font-semibold text-slate-400 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
            {items.length} Item{items.length !== 1 ? "s" : ""}
          </span>
        </div>

        {items.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <Tag className="w-10 h-10 mx-auto mb-3 text-slate-600" />
            <p className="font-semibold text-white">No line items in this price list</p>
            <p className="text-xs mt-1 text-slate-400">Add product SKU rates to enable commercial resolution.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950/60 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Product SKU</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Unit Price (INR)</th>
                  <th className="px-6 py-4">Snapshot UOM</th>
                  <th className="px-6 py-4">Min Qty Tier</th>
                  <th className="px-6 py-4">Effective Date</th>
                  <th className="px-6 py-4">Version</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/30 transition">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-white">{item.product?.name || "Product"}</div>
                      <div className="font-mono text-xs text-slate-400 mt-0.5">{item.product?.sku}</div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 font-mono text-xs border border-slate-700">
                        {item.product?.category || "N/A"}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span className="font-mono font-bold text-white text-base">₹{Number(item.unit_price).toFixed(2)}</span>
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                        {item.uom}
                      </span>
                    </td>

                    <td className="px-6 py-4 font-mono text-xs text-slate-300">
                      {Number(item.min_quantity).toFixed(3)} {item.uom}
                    </td>

                    <td className="px-6 py-4 text-xs text-slate-400 font-mono">
                      {new Date(item.effective_from).toLocaleDateString()}
                    </td>

                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono text-xs border border-slate-700">
                        v{item.version}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Line Item Modal */}
      {showItemModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Add Line Item Rate</h3>

            <form onSubmit={handleAddItem} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Product SKU *</label>
                <select
                  required
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500"
                >
                  <option value="">-- Choose Product --</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.sku}) — [{p.unit_of_measure}]
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Unit Price (INR) *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="e.g. 240.50"
                  value={unitPrice}
                  onChange={(e) => setUnitPrice(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Min Qty Tier</label>
                  <input
                    type="number"
                    step="0.001"
                    required
                    value={minQty}
                    onChange={(e) => setMinQty(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Effective From</label>
                  <input
                    type="date"
                    required
                    value={effectiveFrom}
                    onChange={(e) => setEffectiveFrom(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowItemModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-800 bg-slate-800 text-slate-300 text-sm font-semibold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={itemSaving}
                  className="px-4 py-2 rounded-xl bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-400 disabled:opacity-50"
                >
                  {itemSaving ? "Saving..." : "Add Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Approve Modal (Maker-Checker Enforced) */}
      {showApproveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center gap-3 text-emerald-400">
              <ShieldCheck className="w-6 h-6 shrink-0" />
              <h3 className="text-lg font-bold text-white">Approve Price List</h3>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Approval activates this price list and makes its line item rates eligible for live commercial order resolution.
            </p>

            <form onSubmit={handleApprove} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Self-Approval Override Reason (Required if approving your own creation)
                </label>
                <textarea
                  rows={3}
                  placeholder="Enter explicit business justification if self-approving as SUPER_ADMIN..."
                  value={overrideReason}
                  onChange={(e) => setOverrideReason(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowApproveModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-800 bg-slate-800 text-slate-300 text-sm font-semibold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={approving}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-400 disabled:opacity-50"
                >
                  {approving ? "Activating..." : "Confirm Approval"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-400">
              <XCircle className="w-6 h-6 shrink-0" />
              <h3 className="text-lg font-bold text-white">Reject Price List Submission</h3>
            </div>

            <form onSubmit={handleReject} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Rejection Reason *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Specify why this pricing submission is being rejected..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowRejectModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-800 bg-slate-800 text-slate-300 text-sm font-semibold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={rejecting}
                  className="px-5 py-2.5 rounded-xl bg-rose-500 text-white text-sm font-semibold hover:bg-rose-400 disabled:opacity-50"
                >
                  {rejecting ? "Rejecting..." : "Confirm Rejection"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
