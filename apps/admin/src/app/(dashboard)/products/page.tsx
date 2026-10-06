"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Package,
  Search,
  Plus,
  Edit3,
  Power,
  CheckCircle2,
  XCircle,
  Tag,
  Scale,
  RefreshCw,
  AlertCircle,
  FileText,
  Filter,
} from "lucide-react";

interface Product {
  id: string;
  sku: string;
  name: string;
  category: "LIVE_BROILER" | "WHOLE_DRESSED" | "CUTS" | "BONELESS";
  min_weight_kg: number | null;
  max_weight_kg: number | null;
  unit_of_measure: string;
  status: "ACTIVE" | "INACTIVE";
  notes: string | null;
  created_at: string;
  updated_at: string;
}

const CATEGORY_MAP: Record<string, { label: string; bg: string; text: string }> = {
  LIVE_BROILER: { label: "Live Broiler", bg: "bg-amber-500/10", text: "text-amber-400" },
  WHOLE_DRESSED: { label: "Whole Dressed", bg: "bg-emerald-500/10", text: "text-emerald-400" },
  CUTS: { label: "Cuts", bg: "bg-blue-500/10", text: "text-blue-400" },
  BONELESS: { label: "Boneless", bg: "bg-purple-500/10", text: "text-purple-400" },
};

function formatWeightSpec(min: number | null, max: number | null, category: string): string {
  if (min !== null && max !== null) {
    if (min < 1) {
      const minG = Math.round(min * 1000);
      return `${minG} g–${max} kg`;
    }
    return `${min}–${max} kg`;
  }
  if (min !== null) return `>= ${min} kg`;
  if (max !== null) return `<= ${max} kg`;
  return "Standard / Variable";
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [statusToggleTarget, setStatusToggleTarget] = useState<Product | null>(null);
  const [statusReason, setStatusReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  // Form Fields
  const [formData, setFormData] = useState({
    sku: "",
    name: "",
    category: "LIVE_BROILER",
    min_weight_kg: "",
    max_weight_kg: "",
    unit_of_measure: "KG",
    notes: "",
  });

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append("search", searchQuery);
      if (categoryFilter !== "ALL") params.append("category", categoryFilter);
      if (statusFilter !== "ALL") params.append("status", statusFilter);

      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to load products");
      }

      setProducts(data.products || []);
    } catch (err: any) {
      setError(err.message || "Error communicating with server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [searchQuery, categoryFilter, statusFilter]);

  // Dynamic KPI calculations from actual product data
  const stats = useMemo(() => {
    const total = products.length;
    const active = products.filter((p) => p.status === "ACTIVE").length;
    const inactive = products.filter((p) => p.status === "INACTIVE").length;
    const categoriesCount = new Set(products.map((p) => p.category)).size;
    return { total, active, inactive, categoriesCount };
  }, [products]);

  const openAddModal = () => {
    setFormData({
      sku: "",
      name: "",
      category: "LIVE_BROILER",
      min_weight_kg: "",
      max_weight_kg: "",
      unit_of_measure: "KG",
      notes: "",
    });
    setModalError(null);
    setIsAddOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      sku: product.sku,
      name: product.name,
      category: product.category,
      min_weight_kg: product.min_weight_kg !== null ? String(product.min_weight_kg) : "",
      max_weight_kg: product.max_weight_kg !== null ? String(product.max_weight_kg) : "",
      unit_of_measure: product.unit_of_measure,
      notes: product.notes || "",
    });
    setModalError(null);
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setModalError(null);

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create product");
      }

      setIsAddOpen(false);
      fetchProducts();
    } catch (err: any) {
      setModalError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    setSubmitting(true);
    setModalError(null);

    try {
      const res = await fetch(`/api/products/${editingProduct.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          category: formData.category,
          min_weight_kg: formData.min_weight_kg,
          max_weight_kg: formData.max_weight_kg,
          unit_of_measure: formData.unit_of_measure,
          notes: formData.notes,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update product");
      }

      setEditingProduct(null);
      fetchProducts();
    } catch (err: any) {
      setModalError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!statusToggleTarget) return;
    setSubmitting(true);
    setModalError(null);

    const nextStatus = statusToggleTarget.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

    try {
      const res = await fetch(`/api/products/${statusToggleTarget.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: nextStatus,
          reason: statusReason || `Product status changed to ${nextStatus}`,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to change product status");
      }

      setStatusToggleTarget(null);
      setStatusReason("");
      fetchProducts();
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
              <Package className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Products & Taxonomy Catalog</h1>
              <p className="text-sm text-slate-400 mt-0.5">
                Official FarmReem agricultural product SKUs, weight specifications, and status lifecycle.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => fetchProducts()}
            className="p-2.5 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-xl border border-slate-700 transition"
            title="Refresh product list"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={openAddModal}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-xl transition shadow-lg shadow-emerald-950/40"
          >
            <Plus className="w-4 h-4" />
            Add Product SKU
          </button>
        </div>
      </div>

      {/* Dynamic KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 text-sm">
            <span>Total SKUs</span>
            <Package className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-bold text-white mt-2">{stats.total}</div>
          <div className="text-xs text-slate-500 mt-1">Database-backed catalog entries</div>
        </div>

        <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 text-sm">
            <span>Active Taxonomy</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-bold text-emerald-400 mt-2">{stats.active}</div>
          <div className="text-xs text-emerald-500/70 mt-1">Available for transactions</div>
        </div>

        <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 text-sm">
            <span>Inactive SKUs</span>
            <XCircle className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-3xl font-bold text-slate-400 mt-2">{stats.inactive}</div>
          <div className="text-xs text-slate-500 mt-1">Soft-deactivated / Archived</div>
        </div>

        <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 text-sm">
            <span>Categories</span>
            <Tag className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-bold text-purple-400 mt-2">{stats.categoriesCount}</div>
          <div className="text-xs text-purple-400/70 mt-1">Controlled taxonomy groups</div>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row gap-3 justify-between items-stretch md:items-center">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search products by SKU or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-transparent text-sm text-white focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-slate-900">All Categories</option>
              <option value="LIVE_BROILER" className="bg-slate-900">Live Broiler</option>
              <option value="WHOLE_DRESSED" className="bg-slate-900">Whole Dressed</option>
              <option value="CUTS" className="bg-slate-900">Cuts</option>
              <option value="BONELESS" className="bg-slate-900">Boneless</option>
            </select>
          </div>

          <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-sm text-white focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-slate-900">All Statuses</option>
              <option value="ACTIVE" className="bg-slate-900">Active</option>
              <option value="INACTIVE" className="bg-slate-900">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Data Table */}
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
            <p className="text-sm">Loading product catalog from database...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center text-slate-400 flex flex-col items-center gap-3">
            <Package className="w-8 h-8 text-slate-600" />
            <p className="text-base font-semibold text-slate-300">No products found</p>
            <p className="text-sm text-slate-500 max-w-sm">
              No product SKUs match the selected filters or search parameters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950/80 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4 font-semibold">SKU Code</th>
                  <th className="px-6 py-4 font-semibold">Product Name</th>
                  <th className="px-6 py-4 font-semibold">Category</th>
                  <th className="px-6 py-4 font-semibold">Weight Range</th>
                  <th className="px-6 py-4 font-semibold">UOM</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Last Updated</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {products.map((product) => {
                  const catMeta = CATEGORY_MAP[product.category] || {
                    label: product.category,
                    bg: "bg-slate-800",
                    text: "text-slate-300",
                  };
                  return (
                    <tr
                      key={product.id}
                      className="hover:bg-slate-800/30 transition-colors group"
                    >
                      <td className="px-6 py-4 font-mono font-semibold text-emerald-400">
                        {product.sku}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-white">{product.name}</div>
                        {product.notes && (
                          <div className="text-xs text-slate-400 truncate max-w-xs mt-0.5">
                            {product.notes}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${catMeta.bg} ${catMeta.text}`}
                        >
                          {catMeta.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono text-slate-300 text-xs">
                        <span className="inline-flex items-center gap-1.5 bg-slate-950/60 border border-slate-800 px-2.5 py-1 rounded-md">
                          <Scale className="w-3.5 h-3.5 text-slate-400" />
                          {formatWeightSpec(product.min_weight_kg, product.max_weight_kg, product.category)}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-slate-400">
                        {product.unit_of_measure}
                      </td>
                      <td className="px-6 py-4">
                        {product.status === "ACTIVE" ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            ACTIVE
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-400 border border-slate-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                            INACTIVE
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-400">
                        {new Date(product.updated_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(product)}
                            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
                            title="Edit Product Details"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setStatusToggleTarget(product)}
                            className={`p-2 rounded-lg transition ${
                              product.status === "ACTIVE"
                                ? "text-amber-400 hover:bg-amber-500/10"
                                : "text-emerald-400 hover:bg-emerald-500/10"
                            }`}
                            title={product.status === "ACTIVE" ? "Deactivate Product" : "Reactivate Product"}
                          >
                            <Power className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl shadow-2xl p-6 space-y-5">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-400" />
                Add Product SKU
              </h3>
              <button
                onClick={() => setIsAddOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            {modalError && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleCreateProduct} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    SKU Code *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. FR-LB-CUSTOM"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value.toUpperCase() })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="LIVE_BROILER">Live Broiler</option>
                    <option value="WHOLE_DRESSED">Whole Dressed</option>
                    <option value="CUTS">Cuts</option>
                    <option value="BONELESS">Boneless</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Live Broiler — Special Batch"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Min Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    placeholder="e.g. 0.800"
                    value={formData.min_weight_kg}
                    onChange={(e) => setFormData({ ...formData, min_weight_kg: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Max Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    placeholder="e.g. 1.000"
                    value={formData.max_weight_kg}
                    onChange={(e) => setFormData({ ...formData, max_weight_kg: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    UOM *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.unit_of_measure}
                    onChange={(e) => setFormData({ ...formData, unit_of_measure: e.target.value.toUpperCase() })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Product Notes / Specifications
                </label>
                <textarea
                  rows={3}
                  placeholder="Optional grading notes or packaging specs..."
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
                  Save Product SKU
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl shadow-2xl p-6 space-y-5">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-emerald-400" />
                Edit Product SKU: <span className="font-mono text-emerald-400">{editingProduct.sku}</span>
              </h3>
              <button
                onClick={() => setEditingProduct(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            {modalError && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleEditProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="LIVE_BROILER">Live Broiler</option>
                    <option value="WHOLE_DRESSED">Whole Dressed</option>
                    <option value="CUTS">Cuts</option>
                    <option value="BONELESS">Boneless</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    UOM *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.unit_of_measure}
                    onChange={(e) => setFormData({ ...formData, unit_of_measure: e.target.value.toUpperCase() })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Min Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    placeholder="e.g. 0.800"
                    value={formData.min_weight_kg}
                    onChange={(e) => setFormData({ ...formData, min_weight_kg: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Max Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    placeholder="e.g. 1.000"
                    value={formData.max_weight_kg}
                    onChange={(e) => setFormData({ ...formData, max_weight_kg: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Product Notes / Specifications
                </label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
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
                  Update Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Activate / Deactivate Toggle Modal */}
      {statusToggleTarget && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div
                className={`p-2.5 rounded-xl border ${
                  statusToggleTarget.status === "ACTIVE"
                    ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                    : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                }`}
              >
                <Power className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  {statusToggleTarget.status === "ACTIVE" ? "Deactivate Product" : "Reactivate Product"}
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  SKU: {statusToggleTarget.sku} — {statusToggleTarget.name}
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-300">
              {statusToggleTarget.status === "ACTIVE"
                ? "Deactivating this product hides it from new customer orders while preserving full historical reporting. No records are deleted."
                : "Reactivating this product makes it available for immediate commercial quoting and orders."}
            </p>

            {modalError && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Audit Reason / Justification
              </label>
              <input
                type="text"
                placeholder="e.g. Seasonal availability change / Taxonomy update"
                value={statusReason}
                onChange={(e) => setStatusReason(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setStatusToggleTarget(null);
                  setStatusReason("");
                }}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleToggleStatus}
                disabled={submitting}
                className={`px-4 py-2 text-white text-sm font-semibold rounded-xl transition disabled:opacity-50 flex items-center gap-2 ${
                  statusToggleTarget.status === "ACTIVE"
                    ? "bg-amber-600 hover:bg-amber-500"
                    : "bg-emerald-600 hover:bg-emerald-500"
                }`}
              >
                {submitting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                Confirm {statusToggleTarget.status === "ACTIVE" ? "Deactivation" : "Reactivation"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
