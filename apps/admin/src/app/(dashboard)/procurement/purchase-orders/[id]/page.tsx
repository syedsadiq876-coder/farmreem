'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';

interface POItem {
  id: string;
  product_sku_snapshot: string;
  product_name_snapshot: string;
  ordered_quantity: number;
  uom_snapshot: string;
  unit_purchase_cost: number;
  line_purchase_amount: number;
  sourcing_address_snapshot: {
    line1?: string;
    city?: string;
    state?: string;
  };
  orders?: {
    order_number: string;
  };
}

interface POHistory {
  id: string;
  from_status: string | null;
  to_status: string;
  change_reason: string | null;
  created_at: string;
  users?: {
    full_name: string;
    email: string;
  };
}

interface PODetail {
  id: string;
  po_number: string;
  supplier_code_snapshot: string;
  supplier_legal_name_snapshot: string;
  supplier_gstin_snapshot: string | null;
  buyer_legal_name_snapshot: string;
  buyer_gstin_snapshot: string;
  buyer_registered_address_snapshot: {
    line1?: string;
    city?: string;
    state?: string;
    postal_code?: string;
  };
  expected_pickup_date: string;
  subtotal_amount: number;
  currency: string;
  status: string;
  self_approval_override_reason: string | null;
  notes: string | null;
  created_at: string;
  items: POItem[];
  history: POHistory[];
}

export default function PurchaseOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: poId } = use(params);
  const [po, setPo] = useState<PODetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [cancelReason, setCancelReason] = useState<string>('');
  const [overrideReason, setOverrideReason] = useState<string>('');
  const [showCancelModal, setShowCancelModal] = useState<boolean>(false);
  const [showApproveModal, setShowApproveModal] = useState<boolean>(false);

  useEffect(() => {
    fetchPODetail();
  }, [poId]);

  async function fetchPODetail() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/procurement/purchase-orders/${poId}`);
      const json = await res.json();
      if (res.ok) setPo(json.data);
      else setError(json.error || 'Failed to load Purchase Order');
    } catch (err: any) {
      setError(err.message || 'Error loading Purchase Order');
    } finally {
      setLoading(false);
    }
  }

  async function handleAction(endpoint: string, bodyObj: object = {}) {
    setActionLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/procurement/purchase-orders/${poId}/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyObj),
      });
      const json = await res.json();
      if (res.ok) {
        setShowCancelModal(false);
        setShowApproveModal(false);
        fetchPODetail();
      } else {
        setError(json.error || `Failed to execute ${endpoint}`);
      }
    } catch (err: any) {
      setError(err.message || 'Network error');
    } finally {
      setActionLoading(false);
    }
  }

  if (loading) return <div className="p-12 text-center text-emerald-400/60 animate-pulse">Loading Purchase Order...</div>;
  if (error || !po) return <div className="p-8 max-w-5xl mx-auto text-red-400">{error || 'Purchase Order not found'}</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-emerald-800/40 pb-5">
        <div>
          <Link href="/procurement" className="text-emerald-400/70 hover:text-emerald-300 text-xs font-semibold flex items-center gap-1 mb-2">
            &larr; Back to Procurement Dashboard
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold text-white tracking-tight font-mono">
              {po.po_number}
            </h1>
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
              po.status === 'ISSUED' ? 'bg-purple-500/10 border-purple-500/40 text-purple-400' :
              po.status === 'APPROVED' ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' :
              po.status === 'PENDING_APPROVAL' ? 'bg-amber-500/10 border-amber-500/40 text-amber-400' :
              po.status === 'DRAFT' ? 'bg-slate-800 border-slate-700 text-slate-300' :
              'bg-red-500/10 border-red-500/40 text-red-400'
            }`}>
              {po.status}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {po.status === 'DRAFT' && (
            <button
              onClick={() => handleAction('submit')}
              disabled={actionLoading}
              className="px-4 py-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30 text-sm font-semibold transition-all disabled:opacity-50"
            >
              Submit for Approval &rarr;
            </button>
          )}

          {po.status === 'PENDING_APPROVAL' && (
            <button
              onClick={() => setShowApproveModal(true)}
              disabled={actionLoading}
              className="px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30 text-sm font-semibold transition-all disabled:opacity-50"
            >
              Approve Purchase Order
            </button>
          )}

          {po.status === 'APPROVED' && (
            <button
              onClick={() => handleAction('issue')}
              disabled={actionLoading}
              className="px-4 py-2 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300 hover:bg-purple-500/30 text-sm font-semibold transition-all disabled:opacity-50"
            >
              Transmit & Issue PO
            </button>
          )}

          {po.status !== 'CANCELLED' && (
            <button
              onClick={() => setShowCancelModal(true)}
              disabled={actionLoading}
              className="px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 text-sm font-semibold transition-all disabled:opacity-50"
            >
              Cancel PO
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-sm">
          {error}
        </div>
      )}

      {/* Snapshots Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Supplier Vendor Snapshot */}
        <div className="bg-slate-900/60 border border-emerald-800/40 rounded-2xl p-6 space-y-3">
          <h2 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Vendor / Supplier Identity</h2>
          <div className="text-lg font-bold text-white">{po.supplier_legal_name_snapshot}</div>
          <div className="text-xs font-mono text-slate-400">Code: {po.supplier_code_snapshot}</div>
          {po.supplier_gstin_snapshot && (
            <div className="text-xs font-mono text-slate-400">GSTIN: {po.supplier_gstin_snapshot}</div>
          )}
        </div>

        {/* Buyer FarmReem Snapshot */}
        <div className="bg-slate-900/60 border border-emerald-800/40 rounded-2xl p-6 space-y-3">
          <h2 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Buyer Statutory Entity (FarmReem)</h2>
          <div className="text-lg font-bold text-white">{po.buyer_legal_name_snapshot}</div>
          <div className="text-xs font-mono text-slate-400">GSTIN: {po.buyer_gstin_snapshot}</div>
          <div className="text-xs text-slate-400">
            Address: {po.buyer_registered_address_snapshot.line1}, {po.buyer_registered_address_snapshot.city}, {po.buyer_registered_address_snapshot.state}
          </div>
        </div>
      </div>

      {/* Line Items Table */}
      <div className="bg-slate-900/60 border border-emerald-800/40 rounded-2xl overflow-hidden shadow-2xl space-y-4 p-6">
        <h2 className="text-lg font-bold text-white">Purchase Order Line Items</h2>
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-950/80 text-emerald-400 text-xs font-semibold uppercase tracking-wider border-b border-emerald-800/40">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Source Sales Order</th>
              <th className="px-4 py-3">Pickup Address</th>
              <th className="px-4 py-3">Ordered Qty</th>
              <th className="px-4 py-3">Buying Rate</th>
              <th className="px-4 py-3 text-right">Line Subtotal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {po.items.map((item) => (
              <tr key={item.id} className="hover:bg-emerald-950/20">
                <td className="px-4 py-3">
                  <div className="font-semibold text-white">{item.product_name_snapshot}</div>
                  <div className="text-xs text-slate-500 font-mono">{item.product_sku_snapshot}</div>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-slate-400">
                  {item.orders?.order_number || 'N/A'}
                </td>
                <td className="px-4 py-3 text-xs text-slate-400">
                  {item.sourcing_address_snapshot.line1}, {item.sourcing_address_snapshot.city}
                </td>
                <td className="px-4 py-3 font-mono font-semibold">
                  {item.ordered_quantity} {item.uom_snapshot}
                </td>
                <td className="px-4 py-3 font-mono text-emerald-400">
                  ₹{Number(item.unit_purchase_cost).toFixed(2)} / {item.uom_snapshot}
                </td>
                <td className="px-4 py-3 font-mono font-bold text-white text-right">
                  ₹{Number(item.line_purchase_amount).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals Summary */}
        <div className="border-t border-emerald-800/40 pt-4 flex justify-end">
          <div className="w-64 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Pre-tax Subtotal:</span>
              <span className="font-mono font-bold text-emerald-400 text-base">
                ₹{Number(po.subtotal_amount).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Approve Modal */}
      {showApproveModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-emerald-800/60 rounded-2xl p-6 max-w-md w-full space-y-4">
            <h3 className="text-lg font-bold text-white">Approve Purchase Order</h3>
            <p className="text-xs text-slate-400">
              If you created this PO (Maker), a SUPER_ADMIN self-approval override reason is required.
            </p>
            <textarea
              value={overrideReason}
              onChange={(e) => setOverrideReason(e.target.value)}
              placeholder="Self-approval override reason (if maker)..."
              className="w-full bg-slate-950 border border-emerald-800/60 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-emerald-400"
              rows={3}
            />
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowApproveModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-sm font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => handleAction('approve', { override_reason: overrideReason })}
                disabled={actionLoading}
                className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-sm"
              >
                Confirm Approval
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-red-800/60 rounded-2xl p-6 max-w-md w-full space-y-4">
            <h3 className="text-lg font-bold text-white">Cancel Purchase Order</h3>
            <p className="text-xs text-slate-400">
              Cancelling a PO will release all attached allocations back to open requirements.
            </p>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Mandatory cancellation reason..."
              className="w-full bg-slate-950 border border-red-800/60 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-red-400"
              rows={3}
            />
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-sm font-semibold"
              >
                Back
              </button>
              <button
                onClick={() => handleAction('cancel', { reason: cancelReason })}
                disabled={actionLoading || !cancelReason.trim()}
                className="px-4 py-2 rounded-xl bg-red-600 text-white font-bold text-sm disabled:opacity-50"
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
