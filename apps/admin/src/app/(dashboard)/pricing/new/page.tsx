"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Tag, Save, AlertCircle, RefreshCw, Building2, Tractor, DollarSign } from "lucide-react";

interface CustomerOption {
  id: string;
  legal_name: string;
  customer_code: string;
}

interface SupplierOption {
  id: string;
  legal_name: string;
  supplier_code: string;
}

export default function NewPriceListPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [listType, setListType] = useState<"BASE_SELLING" | "CUSTOMER_CONTRACT" | "SUPPLIER_REFERENCE_COST">("BASE_SELLING");
  const [customerId, setCustomerId] = useState("");
  const [supplierId, setSupplierId] = useState("");
  const [notes, setNotes] = useState("");

  const [customers, setCustomers] = useState<CustomerOption[]>([]);
  const [suppliers, setSuppliers] = useState<SupplierOption[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch customers for B2B contract choice
    fetch("/api/customers")
      .then((res) => res.json())
      .then((data) => setCustomers(data.customers || []))
      .catch(() => {});

    // Fetch suppliers for Reference Cost choice
    fetch("/api/suppliers/setup")
      .then((res) => res.json())
      .then((data) => setSuppliers(data.suppliers || []))
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const payload: any = {
        name: name.trim(),
        list_type: listType,
        notes: notes.trim() || null,
      };

      if (listType === "CUSTOMER_CONTRACT") {
        if (!customerId) throw new Error("Please select a customer for contract rates.");
        payload.customer_id = customerId;
      }

      if (listType === "SUPPLIER_REFERENCE_COST") {
        if (!supplierId) throw new Error("Please select a supplier for reference cost benchmarks.");
        payload.supplier_id = supplierId;
      }

      const res = await fetch("/api/pricing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create price list.");

      router.push(`/pricing/${data.price_list.id}`);
    } catch (err: any) {
      setError(err.message || "Failed to save price list.");
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/pricing"
          className="p-2.5 rounded-xl border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white hover:border-slate-700 transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Draft New Price List</h1>
          <p className="text-sm text-slate-400">Initialize a new commercial selling list, B2B contract, or reference cost book</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 text-rose-400 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-6 backdrop-blur-xl">
        {/* Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Price List Title <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="e.g. HORECA Base Rates Q4 2026 or Taj Group Contract"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 transition"
          />
        </div>

        {/* List Type Choice */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Price List Purpose & Type <span className="text-rose-400">*</span>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => {
                setListType("BASE_SELLING");
                setCustomerId("");
                setSupplierId("");
              }}
              className={`p-4 rounded-xl border text-left flex flex-col justify-between transition ${
                listType === "BASE_SELLING"
                  ? "bg-emerald-500/10 border-emerald-500/40 text-white"
                  : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
              }`}
            >
              <DollarSign className={`w-5 h-5 mb-2 ${listType === "BASE_SELLING" ? "text-emerald-400" : "text-slate-500"}`} />
              <div>
                <div className="font-semibold text-sm">Base Selling Rates</div>
                <div className="text-xs opacity-75 mt-0.5">Global standard commercial catalog prices</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                setListType("CUSTOMER_CONTRACT");
                setSupplierId("");
              }}
              className={`p-4 rounded-xl border text-left flex flex-col justify-between transition ${
                listType === "CUSTOMER_CONTRACT"
                  ? "bg-blue-500/10 border-blue-500/40 text-white"
                  : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
              }`}
            >
              <Building2 className={`w-5 h-5 mb-2 ${listType === "CUSTOMER_CONTRACT" ? "text-blue-400" : "text-slate-500"}`} />
              <div>
                <div className="font-semibold text-sm">B2B Customer Contract</div>
                <div className="text-xs opacity-75 mt-0.5">Custom negotiated rates for specific account</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                setListType("SUPPLIER_REFERENCE_COST");
                setCustomerId("");
              }}
              className={`p-4 rounded-xl border text-left flex flex-col justify-between transition ${
                listType === "SUPPLIER_REFERENCE_COST"
                  ? "bg-amber-500/10 border-amber-500/40 text-white"
                  : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
              }`}
            >
              <Tractor className={`w-5 h-5 mb-2 ${listType === "SUPPLIER_REFERENCE_COST" ? "text-amber-400" : "text-slate-500"}`} />
              <div>
                <div className="font-semibold text-sm">Supplier Ref Cost</div>
                <div className="text-xs opacity-75 mt-0.5">Procurement landed cost benchmarks (non-sellable)</div>
              </div>
            </button>
          </div>
        </div>

        {/* Customer Selection (Conditional) */}
        {listType === "CUSTOMER_CONTRACT" && (
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Select B2B Customer Account <span className="text-rose-400">*</span>
            </label>
            <select
              required
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 transition"
            >
              <option value="">-- Choose Customer --</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.legal_name} ({c.customer_code})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Supplier Selection (Conditional) */}
        {listType === "SUPPLIER_REFERENCE_COST" && (
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Select Supplier Partner <span className="text-rose-400">*</span>
            </label>
            <select
              required
              value={supplierId}
              onChange={(e) => setSupplierId(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 transition"
            >
              <option value="">-- Choose Supplier --</option>
              {suppliers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.legal_name} ({s.supplier_code})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Notes */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Internal Notes</label>
          <textarea
            rows={3}
            placeholder="Add contextual details regarding contract terms, volume commitments, or validity assumptions..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 transition"
          />
        </div>

        {/* Submit Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <Link
            href="/pricing"
            className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 text-sm font-semibold hover:bg-slate-700 transition"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-semibold hover:from-emerald-400 hover:to-teal-500 shadow-lg shadow-emerald-500/20 disabled:opacity-50 transition"
          >
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save & Continue to Line Items
          </button>
        </div>
      </form>
    </div>
  );
}
