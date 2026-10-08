'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface ProcurementRequirement {
  id: string;
  requirement_number: string;
  order_id: string;
  order_item_id: string;
  product_id: string;
  product_sku_snapshot: string;
  product_name_snapshot: string;
  required_quantity: number;
  allocated_quantity: number;
  uom_snapshot: string;
  target_fulfillment_date: string;
  status: string;
  created_at: string;
  orders?: {
    order_number: string;
    requested_delivery_date: string;
    status: string;
  };
}

interface SupplierAllocation {
  id: string;
  allocation_number: string;
  procurement_requirement_id: string;
  supplier_id: string;
  allocated_quantity: number;
  uom_snapshot: string;
  negotiated_unit_cost: number;
  expected_pickup_date: string;
  status: string;
  created_at: string;
  suppliers?: {
    supplier_code: string;
    legal_name: string;
  };
  procurement_requirements?: {
    requirement_number: string;
    product_sku_snapshot: string;
    product_name_snapshot: string;
  };
}

interface PurchaseOrder {
  id: string;
  po_number: string;
  supplier_code_snapshot: string;
  supplier_legal_name_snapshot: string;
  buyer_legal_name_snapshot: string;
  expected_pickup_date: string;
  subtotal_amount: number;
  currency: string;
  status: string;
  created_at: string;
}

export default function ProcurementDashboardPage() {
  const [activeTab, setActiveTab] = useState<'requirements' | 'allocations' | 'orders'>('requirements');
  const [requirements, setRequirements] = useState<ProcurementRequirement[]>([]);
  const [allocations, setAllocations] = useState<SupplierAllocation[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  async function fetchData() {
    setLoading(true);
    setError(null);
    try {
      if (activeTab === 'requirements') {
        const res = await fetch('/api/procurement/requirements');
        const json = await res.json();
        if (res.ok) setRequirements(json.data || []);
        else setError(json.error || 'Failed to fetch requirements');
      } else if (activeTab === 'allocations') {
        const res = await fetch('/api/procurement/allocations');
        const json = await res.json();
        if (res.ok) setAllocations(json.data || []);
        else setError(json.error || 'Failed to fetch allocations');
      } else {
        const res = await fetch('/api/procurement/purchase-orders');
        const json = await res.json();
        if (res.ok) setPurchaseOrders(json.data || []);
        else setError(json.error || 'Failed to fetch purchase orders');
      }
    } catch (err: any) {
      setError(err.message || 'Error connecting to server');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-emerald-800/40 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              ⚡
            </span>
            Procurement & Sourcing Module
          </h1>
          <p className="text-emerald-400/70 text-sm mt-1">
            Manage demand requirements, supplier allocations, and commercial purchase orders.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-emerald-800/40 space-x-4">
        <button
          onClick={() => setActiveTab('requirements')}
          className={`pb-3 px-4 text-sm font-semibold transition-all border-b-2 ${
            activeTab === 'requirements'
              ? 'border-emerald-400 text-emerald-400'
              : 'border-transparent text-emerald-200/60 hover:text-white'
          }`}
        >
          Demand Requirements ({requirements.length})
        </button>
        <button
          onClick={() => setActiveTab('allocations')}
          className={`pb-3 px-4 text-sm font-semibold transition-all border-b-2 ${
            activeTab === 'allocations'
              ? 'border-emerald-400 text-emerald-400'
              : 'border-transparent text-emerald-200/60 hover:text-white'
          }`}
        >
          Supplier Allocations ({allocations.length})
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 px-4 text-sm font-semibold transition-all border-b-2 ${
            activeTab === 'orders'
              ? 'border-emerald-400 text-emerald-400'
              : 'border-transparent text-emerald-200/60 hover:text-white'
          }`}
        >
          Purchase Orders ({purchaseOrders.length})
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-sm">
          {error}
        </div>
      )}

      {/* Content Views */}
      {loading ? (
        <div className="p-12 text-center text-emerald-400/60 animate-pulse">Loading procurement data...</div>
      ) : activeTab === 'requirements' ? (
        <div className="bg-slate-900/60 border border-emerald-800/40 rounded-2xl overflow-hidden shadow-2xl">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/80 text-emerald-400 text-xs font-semibold uppercase tracking-wider border-b border-emerald-800/40">
              <tr>
                <th className="px-6 py-4">Req Number</th>
                <th className="px-6 py-4">Sales Order</th>
                <th className="px-6 py-4">Product SKU / Name</th>
                <th className="px-6 py-4">Required Qty</th>
                <th className="px-6 py-4">Allocated Qty</th>
                <th className="px-6 py-4">Target Date</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {requirements.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                    No active procurement requirements found.
                  </td>
                </tr>
              ) : (
                requirements.map((req) => (
                  <tr key={req.id} className="hover:bg-emerald-950/20 transition-all">
                    <td className="px-6 py-4 font-mono font-bold text-emerald-300">{req.requirement_number}</td>
                    <td className="px-6 py-4 text-slate-300 font-medium">
                      {req.orders?.order_number || 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-white">{req.product_name_snapshot}</div>
                      <div className="text-xs text-slate-500 font-mono">{req.product_sku_snapshot}</div>
                    </td>
                    <td className="px-6 py-4 font-mono font-semibold">
                      {req.required_quantity} {req.uom_snapshot}
                    </td>
                    <td className="px-6 py-4 font-mono font-semibold text-amber-400">
                      {req.allocated_quantity} {req.uom_snapshot}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400">
                      {new Date(req.target_fulfillment_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                        req.status === 'FULLY_ALLOCATED' ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' :
                        req.status === 'PARTIALLY_ALLOCATED' ? 'bg-amber-500/10 border-amber-500/40 text-amber-400' :
                        'bg-slate-800 border-slate-700 text-slate-400'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : activeTab === 'allocations' ? (
        <div className="bg-slate-900/60 border border-emerald-800/40 rounded-2xl overflow-hidden shadow-2xl">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/80 text-emerald-400 text-xs font-semibold uppercase tracking-wider border-b border-emerald-800/40">
              <tr>
                <th className="px-6 py-4">Allocation ID</th>
                <th className="px-6 py-4">Requirement</th>
                <th className="px-6 py-4">Supplier</th>
                <th className="px-6 py-4">Allocated Qty</th>
                <th className="px-6 py-4">Buying Rate</th>
                <th className="px-6 py-4">Pickup Date</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {allocations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                    No active supplier allocations found.
                  </td>
                </tr>
              ) : (
                allocations.map((alloc) => (
                  <tr key={alloc.id} className="hover:bg-emerald-950/20 transition-all">
                    <td className="px-6 py-4 font-mono font-bold text-emerald-300">{alloc.allocation_number}</td>
                    <td className="px-6 py-4 text-slate-300 font-mono text-xs">
                      {alloc.procurement_requirements?.requirement_number || 'N/A'}
                    </td>
                    <td className="px-6 py-4 font-semibold text-white">
                      {alloc.suppliers?.legal_name} ({alloc.suppliers?.supplier_code})
                    </td>
                    <td className="px-6 py-4 font-mono font-semibold">
                      {alloc.allocated_quantity} {alloc.uom_snapshot}
                    </td>
                    <td className="px-6 py-4 font-mono font-semibold text-emerald-400">
                      ₹{Number(alloc.negotiated_unit_cost).toFixed(2)} / {alloc.uom_snapshot}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400">
                      {new Date(alloc.expected_pickup_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                        alloc.status === 'PO_GENERATED' ? 'bg-blue-500/10 border-blue-500/40 text-blue-400' :
                        alloc.status === 'ALLOCATED' ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' :
                        'bg-red-500/10 border-red-500/40 text-red-400'
                      }`}>
                        {alloc.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-slate-900/60 border border-emerald-800/40 rounded-2xl overflow-hidden shadow-2xl">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/80 text-emerald-400 text-xs font-semibold uppercase tracking-wider border-b border-emerald-800/40">
              <tr>
                <th className="px-6 py-4">PO Number</th>
                <th className="px-6 py-4">Supplier</th>
                <th className="px-6 py-4">Buyer Profile</th>
                <th className="px-6 py-4">Pickup Date</th>
                <th className="px-6 py-4">Pre-tax Subtotal</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {purchaseOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                    No active Purchase Orders found.
                  </td>
                </tr>
              ) : (
                purchaseOrders.map((po) => (
                  <tr key={po.id} className="hover:bg-emerald-950/20 transition-all">
                    <td className="px-6 py-4 font-mono font-bold text-emerald-300">{po.po_number}</td>
                    <td className="px-6 py-4 font-semibold text-white">{po.supplier_legal_name_snapshot}</td>
                    <td className="px-6 py-4 text-xs text-slate-400">{po.buyer_legal_name_snapshot}</td>
                    <td className="px-6 py-4 text-xs text-slate-400">
                      {new Date(po.expected_pickup_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 font-mono font-semibold text-emerald-400">
                      ₹{Number(po.subtotal_amount).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                        po.status === 'ISSUED' ? 'bg-purple-500/10 border-purple-500/40 text-purple-400' :
                        po.status === 'APPROVED' ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' :
                        po.status === 'PENDING_APPROVAL' ? 'bg-amber-500/10 border-amber-500/40 text-amber-400' :
                        po.status === 'DRAFT' ? 'bg-slate-800 border-slate-700 text-slate-300' :
                        'bg-red-500/10 border-red-500/40 text-red-400'
                      }`}>
                        {po.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/procurement/purchase-orders/${po.id}`}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 text-xs font-semibold transition-all"
                      >
                        View Detail &rarr;
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
