"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, FileText, Building2, Calendar, FileCode2, Save, RefreshCw, AlertCircle } from "lucide-react";

interface Customer {
  id: string;
  legal_name: string;
  trade_name: string | null;
  customer_code: string;
  gstin: string | null;
  gst_state_code: string | null;
  state_name: string | null;
  delivery_address: string | null;
}

export default function NewQuotationPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loadingCustomers, setLoadingCustomers] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [placeOfSupplyStateCode, setPlaceOfSupplyStateCode] = useState("");
  const [placeOfSupplyStateName, setPlaceOfSupplyStateName] = useState("");
  const [validUntil, setValidUntil] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split("T")[0];
  });
  const [notes, setNotes] = useState("");
  const [termsAndConditions, setTermsAndConditions] = useState("Standard FarmReem commercial terms apply. Delivery subject to farm harvest schedule.");

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await fetch("/api/customers");
        const data = await res.json();
        if (res.ok && data.customers) {
          setCustomers(data.customers);
        }
      } catch (err) {
        console.error("Failed to load customers:", err);
      } finally {
        setLoadingCustomers(false);
      }
    };
    fetchCustomers();
  }, []);

  const handleCustomerChange = (customerId: string) => {
    setSelectedCustomerId(customerId);
    const cust = customers.find((c) => c.id === customerId);
    if (cust) {
      if (cust.gst_state_code) setPlaceOfSupplyStateCode(cust.gst_state_code);
      if (cust.state_name) setPlaceOfSupplyStateName(cust.state_name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomerId) {
      setError("Please select a customer.");
      return;
    }
    if (!placeOfSupplyStateCode) {
      setError("Please enter or select a 2-digit Place of Supply GST state code.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/quotations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_id: selectedCustomerId,
          place_of_supply_state_code: placeOfSupplyStateCode,
          place_of_supply_state_name: placeOfSupplyStateName || null,
          valid_until: validUntil,
          notes: notes || null,
          terms_and_conditions: termsAndConditions || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create quotation draft.");

      router.push(`/quotations/${data.quotation.id}`);
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/quotations"
          className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Draft New Quotation</h1>
          <p className="text-sm text-slate-400">Initialize a new versioned commercial price quote for a client</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 text-rose-400 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Draft Form */}
      <form onSubmit={handleSubmit} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-6 backdrop-blur-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Customer selection */}
          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-400" /> Select Customer <span className="text-rose-400">*</span>
            </label>
            {loadingCustomers ? (
              <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-400 flex items-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" /> Loading customer database...
              </div>
            ) : (
              <select
                value={selectedCustomerId}
                onChange={(e) => handleCustomerChange(e.target.value)}
                required
                className="w-full px-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 transition"
              >
                <option value="">-- Choose B2B Customer --</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.legal_name} ({c.customer_code}) {c.gstin ? `[GSTIN: ${c.gstin}]` : ""}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Place of Supply State Code */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <FileCode2 className="w-4 h-4 text-emerald-400" /> Place of Supply GST State Code <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              maxLength={2}
              placeholder="e.g. 36 (Telangana), 27 (Maharashtra)"
              value={placeOfSupplyStateCode}
              onChange={(e) => setPlaceOfSupplyStateCode(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 font-mono transition"
            />
            <p className="text-[11px] text-slate-500">2-digit numerical GST state code for tax classification.</p>
          </div>

          {/* Place of Supply State Name */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-200">Place of Supply State Name</label>
            <input
              type="text"
              placeholder="e.g. Telangana"
              value={placeOfSupplyStateName}
              onChange={(e) => setPlaceOfSupplyStateName(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 transition"
            />
          </div>

          {/* Valid Until */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-400" /> Quotation Validity Expiry Date <span className="text-rose-400">*</span>
            </label>
            <input
              type="date"
              required
              value={validUntil}
              onChange={(e) => setValidUntil(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 transition"
            />
          </div>

          {/* Notes */}
          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-semibold text-slate-200">Internal Notes / Customer Remarks</label>
            <textarea
              rows={2}
              placeholder="Add any internal comments or specific requests..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 transition"
            />
          </div>

          {/* Terms & Conditions */}
          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-semibold text-slate-200">Commercial Terms & Conditions</label>
            <textarea
              rows={3}
              placeholder="Terms and conditions printed on quote..."
              value={termsAndConditions}
              onChange={(e) => setTermsAndConditions(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 transition"
            />
          </div>
        </div>

        {/* Submit Actions */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
          <Link
            href="/quotations"
            className="px-5 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 text-sm font-semibold hover:bg-slate-700 transition"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-semibold hover:from-emerald-400 hover:to-teal-500 shadow-lg shadow-emerald-500/20 transition disabled:opacity-50"
          >
            {submitting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" /> Creating Draft...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" /> Initialize Draft Quote
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
