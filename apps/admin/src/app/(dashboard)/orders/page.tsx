"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Search,
  RefreshCw,
  AlertCircle,
  Eye,
  Building2,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Tag,
  ArrowRight,
} from "lucide-react";

interface Order {
  id: string;
  order_number: string;
  source_quotation_id: string;
  source_quotation_number_snapshot: string;
  source_revision_number_snapshot: number;
  customer_id: string;
  customer_legal_name_snapshot: string;
  customer_code_snapshot: string;
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
  requested_delivery_date: string;
  created_at: string;
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

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load sales orders.");
      setOrders(data.orders || []);
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter((item) => {
      const matchesSearch =
        item.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.source_quotation_number_snapshot.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.customer_legal_name_snapshot.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === "ALL" || item.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, statusFilter]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800 backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Sales Orders</h1>
              <p className="text-sm text-slate-400 mt-0.5">
                Confirmed B2B customer sales orders converted from accepted commercial quotations
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-7 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search order number (e.g. FR-ORD-000001), quote number, customer..."
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
            <option value="CONFIRMED">Confirmed</option>
            <option value="PROCUREMENT_PENDING">Procurement Pending</option>
            <option value="READY_FOR_DISPATCH">Ready for Dispatch</option>
            <option value="DISPATCHED">Dispatched</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        <div className="md:col-span-1 flex items-center justify-end">
          <button
            onClick={fetchOrders}
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
          <span>Loading sales orders directory...</span>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/40 rounded-2xl border border-slate-800">
          <ShoppingBag className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-white font-semibold text-lg">No sales orders found</h3>
          <p className="text-slate-400 text-sm mt-1">
            Convert an ACCEPTED quotation from the Quotations module to generate a Sales Order.
          </p>
        </div>
      ) : (
        <div className="bg-slate-900/60 rounded-2xl border border-slate-800 overflow-hidden backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950/60 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Order Number</th>
                  <th className="px-6 py-4">Source Quotation</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Grand Total</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Target Delivery</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredOrders.map((item) => {
                  const statusInfo = STATUS_MAP[item.status] || STATUS_MAP.CONFIRMED;

                  return (
                    <tr key={item.id} className="hover:bg-slate-800/30 transition">
                      <td className="px-6 py-4 font-mono">
                        <div className="font-semibold text-white">{item.order_number}</div>
                        <div className="text-[11px] text-slate-500">{new Date(item.created_at).toLocaleDateString()}</div>
                      </td>

                      <td className="px-6 py-4 font-mono text-xs">
                        <span className="text-emerald-400 font-semibold">{item.source_quotation_number_snapshot}</span>
                        <span className="text-slate-500"> · Rev {item.source_revision_number_snapshot}</span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="text-white font-medium">{item.customer_legal_name_snapshot}</div>
                        <div className="text-xs text-slate-500 font-mono">{item.customer_code_snapshot}</div>
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

                      <td className="px-6 py-4 text-xs text-slate-400 font-mono">
                        {item.requested_delivery_date ? new Date(item.requested_delivery_date).toLocaleDateString() : "N/A"}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/orders/${item.id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 text-xs font-semibold text-slate-200 hover:text-white hover:bg-slate-700 transition"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View Order
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
