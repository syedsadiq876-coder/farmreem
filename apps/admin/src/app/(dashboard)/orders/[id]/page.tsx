"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ShoppingBag,
  Building2,
  Calendar,
  Building,
  RefreshCw,
  AlertCircle,
  Ban,
  Clock,
  Tag,
  CheckCircle2,
  Truck,
  Package,
} from "lucide-react";

interface OrderItem {
  id: string;
  line_number: number;
  product_id: string;
  product_name_snapshot: string;
  product_sku_snapshot: string;
  product_category_snapshot: string;
  quantity: number;
  uom: string;
  unit_price: number;
  price_list_code_snapshot: string | null;
  pricing_version_snapshot: number;
  pricing_resolved_at: string;
  taxable_amount: number;
  tax_classification: string;
  cgst_rate_percent: number;
  cgst_amount: number;
  sgst_rate_percent: number;
  sgst_amount: number;
  igst_rate_percent: number;
  igst_amount: number;
  line_tax_total: number;
  line_grand_total: number;
  notes: string | null;
}

interface OrderHistory {
  id: string;
  from_status: string;
  to_status: string;
  change_reason: string | null;
  created_at: string;
  changer?: { id: string; full_name: string; email: string } | null;
}

interface Order {
  id: string;
  order_number: string;
  source_quotation_id: string;
  source_quotation_number_snapshot: string;
  source_revision_number_snapshot: number;
  customer_id: string;
  customer_legal_name_snapshot: string;
  customer_code_snapshot: string;
  customer_gstin_snapshot: string | null;
  seller_tax_profile_id: string;
  seller_legal_name_snapshot: string;
  seller_trade_name_snapshot: string | null;
  seller_gstin_snapshot: string;
  seller_registered_address_snapshot: any;
  seller_state_name_snapshot: string;
  seller_state_code_snapshot: string;
  place_of_supply_state_name_snapshot: string;
  place_of_supply_state_code_snapshot: string;
  billing_address_snapshot: any;
  delivery_address_snapshot: any;
  tax_type: string;
  is_interstate_supply: boolean;
  requested_delivery_date: string;
  status:
    | "CONFIRMED"
    | "PROCUREMENT_PENDING"
    | "READY_FOR_DISPATCH"
    | "DISPATCHED"
    | "DELIVERED"
    | "CANCELLED";
  currency: string;
  subtotal: number;
  tax_total: number;
  grand_total: number;
  payment_terms: string | null;
  delivery_terms: string | null;
  special_instructions: string | null;
  cancellation_reason: string | null;
  created_at: string;
  confirmed_at: string;
  dispatched_at: string | null;
  delivered_at: string | null;
  cancelled_at: string | null;
  creator?: { id: string; full_name: string; email: string } | null;
}

const STATUS_MAP: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  CONFIRMED: { label: "Confirmed", bg: "bg-emerald-500/10", text: "text-emerald-400", dot: "bg-emerald-400" },
  PROCUREMENT_PENDING: { label: "Procurement Pending", bg: "bg-amber-500/10", text: "text-amber-400", dot: "bg-amber-400 animate-pulse" },
  READY_FOR_DISPATCH: { label: "Ready for Dispatch", bg: "bg-blue-500/10", text: "text-blue-400", dot: "bg-blue-400" },
  DISPATCHED: { label: "Dispatched", bg: "bg-purple-500/10", text: "text-purple-400", dot: "bg-purple-400" },
  DELIVERED: { label: "Delivered", bg: "bg-teal-500/10", text: "text-teal-400", dot: "bg-teal-400" },
  CANCELLED: { label: "Cancelled", bg: "bg-rose-500/10", text: "text-rose-400", dot: "bg-rose-500" },
};

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [history, setHistory] = useState<OrderHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Modal states
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancellationReason, setCancellationReason] = useState("");

  const fetchOrderDetail = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/orders/${orderId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch order details.");
      setOrder(data.order);
      setItems(data.items || []);
      setHistory(data.history || []);
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetail();
  }, [orderId]);

  const handleStatusTransition = async (targetStatus: string) => {
    setActionLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target_status: targetStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update order status.");
      await fetchOrderDetail();
    } catch (err: any) {
      setError(err.message || "Failed to update order status.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!cancellationReason.trim()) {
      setError("Please provide a reason for cancelling this order.");
      return;
    }
    setActionLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/orders/${orderId}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cancellation_reason: cancellationReason }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to cancel order.");
      setShowCancelModal(false);
      await fetchOrderDetail();
    } catch (err: any) {
      setError(err.message || "Failed to cancel order.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-400 bg-slate-900/40 rounded-2xl border border-slate-800">
        <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-400" />
        <span>Loading sales order details...</span>
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="p-6 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-6 h-6 shrink-0" />
          <span>{error}</span>
        </div>
        <Link href="/orders" className="px-4 py-2 bg-slate-800 rounded-xl text-white text-xs font-semibold">
          Return to Orders Directory
        </Link>
      </div>
    );
  }

  if (!order) return null;

  const statusInfo = STATUS_MAP[order.status] || STATUS_MAP.CONFIRMED;

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <Link
            href="/orders"
            className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white tracking-tight">{order.order_number}</h1>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${statusInfo.bg} ${statusInfo.text}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`} />
                {statusInfo.label}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              Converted from Quotation: <Link href={`/quotations/${order.source_quotation_id}`} className="text-emerald-400 hover:underline">{order.source_quotation_number_snapshot} Rev {order.source_revision_number_snapshot}</Link>
            </p>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center gap-3">
          {order.status === "CONFIRMED" && (
            <button
              onClick={() => handleStatusTransition("PROCUREMENT_PENDING")}
              disabled={actionLoading}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold hover:bg-amber-500/30 transition disabled:opacity-40"
            >
              <Package className="w-3.5 h-3.5" /> Move to Procurement Pending
            </button>
          )}

          {order.status !== "CANCELLED" && order.status !== "DELIVERED" && order.status !== "DISPATCHED" && (
            <button
              onClick={() => setShowCancelModal(true)}
              disabled={actionLoading}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold hover:bg-rose-500/20 transition"
            >
              <Ban className="w-3.5 h-3.5" /> Cancel Order
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

      {/* Snapshots Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Customer Information */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <Building2 className="w-4 h-4 text-emerald-400" /> B2B Customer Identity
          </div>
          <div className="space-y-1">
            <div className="text-white font-semibold">{order.customer_legal_name_snapshot}</div>
            <div className="text-xs text-slate-400 font-mono">Code: {order.customer_code_snapshot}</div>
            <div className="text-xs text-slate-400 font-mono">GSTIN: {order.customer_gstin_snapshot || "N/A"}</div>
            <div className="text-xs text-slate-300 mt-2">
              Place of Supply: <span className="font-mono text-emerald-400">{order.place_of_supply_state_code_snapshot}</span> ({order.place_of_supply_state_name_snapshot})
            </div>
          </div>
        </div>

        {/* Seller Statutory Profile Snapshot */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <Building className="w-4 h-4 text-blue-400" /> Seller Statutory Identity Snapshot
          </div>
          <div className="space-y-1 text-xs">
            <div className="text-white font-semibold">{order.seller_legal_name_snapshot}</div>
            <div className="text-slate-400 font-mono">GSTIN: {order.seller_gstin_snapshot}</div>
            <div className="text-slate-400">State: {order.seller_state_name_snapshot} (Code {order.seller_state_code_snapshot})</div>
          </div>
        </div>

        {/* Fulfillment & Metadata */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <Calendar className="w-4 h-4 text-purple-400" /> Fulfillment Planning
          </div>
          <div className="space-y-1.5 text-xs text-slate-300">
            <div>Target Delivery: <span className="font-semibold text-white font-mono">{new Date(order.requested_delivery_date).toLocaleDateString()}</span></div>
            <div>Order Created: <span className="text-slate-400">{new Date(order.created_at).toLocaleString()}</span></div>
            <div>Confirmed At: <span className="text-slate-400">{new Date(order.confirmed_at).toLocaleString()}</span></div>
          </div>
        </div>
      </div>

      {/* Order Line Items Table */}
      <div className="bg-slate-900/60 rounded-2xl border border-slate-800 overflow-hidden backdrop-blur-xl">
        <div className="p-5 border-b border-slate-800">
          <h3 className="text-lg font-bold text-white tracking-tight">Order Line Items</h3>
          <p className="text-xs text-slate-400">Copied verbatim from source quotation revision with zero commercial recalculation drift</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/60 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5">#</th>
                <th className="px-5 py-3.5">Product / SKU</th>
                <th className="px-5 py-3.5 text-right">Qty & UOM</th>
                <th className="px-5 py-3.5 text-right">Agreed Rate</th>
                <th className="px-5 py-3.5">Price Provenance</th>
                <th className="px-5 py-3.5 text-right">Taxable Amount</th>
                <th className="px-5 py-3.5 text-right">Tax Breakdown</th>
                <th className="px-5 py-3.5 text-right">Line Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/30 transition font-mono">
                  <td className="px-5 py-4 text-slate-500 font-sans">{item.line_number}</td>
                  <td className="px-5 py-4 font-sans">
                    <div className="font-semibold text-white">{item.product_name_snapshot}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{item.product_sku_snapshot}</div>
                  </td>
                  <td className="px-5 py-4 text-right font-sans">
                    <span className="text-white font-semibold font-mono">{item.quantity}</span> {item.uom}
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
                      {item.tax_classification || order.tax_type}
                    </span>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {order.tax_type === "INTRA_STATE"
                        ? `CGST ${item.cgst_rate_percent}% (₹${Number(item.cgst_amount).toFixed(2)}) + SGST ${item.sgst_rate_percent}% (₹${Number(item.sgst_amount).toFixed(2)})`
                        : `IGST ${item.igst_rate_percent}% (₹${Number(item.igst_amount).toFixed(2)})`}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-right text-emerald-400 font-bold font-sans">
                    ₹{Number(item.line_grand_total).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Financial Totals Summary */}
        <div className="p-5 bg-slate-950/60 border-t border-slate-800 flex justify-end">
          <div className="w-72 space-y-2 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Subtotal:</span>
              <span className="font-mono text-white">₹{Number(order.subtotal || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>GST Total:</span>
              <span className="font-mono text-white">₹{Number(order.tax_total || 0).toFixed(2)}</span>
            </div>
            <div className="pt-2 border-t border-slate-800 flex justify-between text-base font-bold text-emerald-400">
              <span>Grand Total:</span>
              <span className="font-mono">₹{Number(order.grand_total || 0).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Order Status History Timeline */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-slate-300">
          <Clock className="w-4 h-4 text-emerald-400" /> Order Lifecycle History
        </div>

        <div className="space-y-3">
          {history.map((h) => (
            <div key={h.id} className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-400">Transition: </span>
                <span className="font-semibold text-white">{h.from_status}</span> &rarr; <span className="font-semibold text-emerald-400">{h.to_status}</span>
                {h.change_reason && <div className="text-slate-400 text-[11px] mt-0.5">{h.change_reason}</div>}
              </div>
              <div className="text-right text-slate-500 font-mono">
                <div>{new Date(h.created_at).toLocaleString()}</div>
                <div>{h.changer?.full_name || "Staff"}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cancellation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-400">
              <Ban className="w-6 h-6" />
              <h3 className="text-lg font-bold text-white">Cancel Sales Order</h3>
            </div>
            <p className="text-xs text-slate-400">
              Order cancellation is a recorded lifecycle event. Please provide a clear operational reason.
            </p>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-200">Cancellation Reason <span className="text-rose-400">*</span></label>
              <textarea
                rows={3}
                required
                placeholder="Reason for cancellation..."
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 bg-slate-800 rounded-xl text-slate-300 text-xs font-semibold"
              >
                Back
              </button>
              <button
                onClick={handleCancelOrder}
                disabled={actionLoading || !cancellationReason.trim()}
                className="px-5 py-2 bg-rose-500 text-white rounded-xl text-xs font-bold hover:bg-rose-600 transition disabled:opacity-50"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
