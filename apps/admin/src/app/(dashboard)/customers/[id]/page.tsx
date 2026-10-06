"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import {
  Building2,
  ArrowLeft,
  Users,
  MapPin,
  FileText,
  Plus,
  Edit3,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Phone,
  Mail,
  Star,
  Shield,
  Clock,
  Power,
} from "lucide-react";

interface CustomerDetail {
  id: string;
  customer_code: string;
  legal_name: string;
  trade_name: string | null;
  customer_type: string;
  gstin: string | null;
  pan: string | null;
  status: string;
  commercial_status: string;
  assigned_account_owner?: { id: string; full_name: string; email: string } | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

interface Contact {
  id: string;
  customer_id: string;
  full_name: string;
  designation: string | null;
  email: string | null;
  phone: string | null;
  is_primary: boolean;
  preferred_channel: string;
  status: "ACTIVE" | "INACTIVE";
  notes: string | null;
  updated_at: string;
}

interface Address {
  id: string;
  customer_id: string;
  address_type: "BILLING" | "DELIVERY" | "BOTH";
  label: string | null;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_primary_delivery: boolean;
  is_primary_billing: boolean;
  status: "ACTIVE" | "INACTIVE";
  notes: string | null;
  updated_at: string;
}

export default function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [customer, setCustomer] = useState<CustomerDetail | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<"overview" | "contacts" | "addresses">("overview");

  // Contact Modal
  const [isAddContactOpen, setIsAddContactOpen] = useState(false);
  const [contactForm, setContactForm] = useState({
    full_name: "",
    designation: "",
    email: "",
    phone: "",
    preferred_channel: "PHONE",
    is_primary: false,
    notes: "",
  });

  // Address Modal
  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);
  const [addressForm, setAddressForm] = useState({
    address_type: "DELIVERY",
    label: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "India",
    is_primary_delivery: false,
    is_primary_billing: false,
    notes: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  const fetchDetail = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/customers/${id}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to load customer detail");

      setCustomer(data.customer);
      setContacts(data.contacts || []);
      setAddresses(data.addresses || []);
    } catch (err: any) {
      setError(err.message || "Error communicating with server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setModalError(null);

    try {
      const res = await fetch(`/api/customers/${id}/contacts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactForm),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add contact");

      setIsAddContactOpen(false);
      fetchDetail();
    } catch (err: any) {
      setModalError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setModalError(null);

    try {
      const res = await fetch(`/api/customers/${id}/addresses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addressForm),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add address");

      setIsAddAddressOpen(false);
      fetchDetail();
    } catch (err: any) {
      setModalError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleContactPrimary = async (contactId: string, currentIsPrimary: boolean) => {
    try {
      await fetch(`/api/customers/${id}/contacts/${contactId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_primary: !currentIsPrimary }),
      });
      fetchDetail();
    } catch (e) {}
  };

  const handleToggleAddressPrimary = async (addressId: string, type: "billing" | "delivery", currentVal: boolean) => {
    try {
      const payload = type === "billing" ? { is_primary_billing: !currentVal } : { is_primary_delivery: !currentVal };
      await fetch(`/api/customers/${id}/addresses/${addressId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      fetchDetail();
    } catch (e) {}
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-400 flex flex-col items-center gap-3">
        <RefreshCw className="w-8 h-8 animate-spin text-emerald-400" />
        <p className="text-sm">Loading customer master record...</p>
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="p-8 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <span>{error || "Customer record not found."}</span>
        </div>
        <Link href="/customers" className="px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-semibold">
          Return to Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/customers"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Customers Directory
        </Link>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-mono">ID: {customer.id}</span>
        </div>
      </div>

      {/* Main Master Card */}
      <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 p-6 rounded-2xl space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
              <Building2 className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-emerald-400 text-sm font-semibold">{customer.customer_code}</span>
                <span className="text-slate-600">•</span>
                <span className="text-xs px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-300 font-medium">
                  {customer.customer_type}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-white mt-1">{customer.legal_name}</h1>
              {customer.trade_name && (
                <p className="text-sm text-slate-400 mt-0.5">DBA: {customer.trade_name}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs text-slate-500">Account Status</div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {customer.status}
              </span>
            </div>

            <div className="text-right">
              <div className="text-xs text-slate-500">Commercial Status</div>
              <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 mt-1">
                {customer.commercial_status}
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-4 text-sm font-medium border-b border-slate-800 pt-2">
          <button
            onClick={() => setActiveTab("overview")}
            className={`pb-3 border-b-2 transition flex items-center gap-2 ${
              activeTab === "overview"
                ? "border-emerald-500 text-emerald-400 font-semibold"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            <FileText className="w-4 h-4" />
            Account Overview
          </button>
          <button
            onClick={() => setActiveTab("contacts")}
            className={`pb-3 border-b-2 transition flex items-center gap-2 ${
              activeTab === "contacts"
                ? "border-emerald-500 text-emerald-400 font-semibold"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            <Users className="w-4 h-4" />
            Contacts ({contacts.length})
          </button>
          <button
            onClick={() => setActiveTab("addresses")}
            className={`pb-3 border-b-2 transition flex items-center gap-2 ${
              activeTab === "addresses"
                ? "border-emerald-500 text-emerald-400 font-semibold"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            <MapPin className="w-4 h-4" />
            Addresses ({addresses.length})
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <div className="space-y-4 bg-slate-950/60 p-5 rounded-xl border border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                Legal & Tax Identification
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-xs text-slate-500 block">GSTIN</span>
                  <span className="font-mono text-white">{customer.gstin || "Not Registered"}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">PAN</span>
                  <span className="font-mono text-white">{customer.pan || "Not Registered"}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 bg-slate-950/60 p-5 rounded-xl border border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-400" />
                Account Ownership & Audit
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-xs text-slate-500 block">Account Owner</span>
                  <span className="text-white font-medium">
                    {customer.assigned_account_owner ? customer.assigned_account_owner.full_name : "Unassigned"}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">Last Updated</span>
                  <span className="text-slate-300 font-mono text-xs">
                    {new Date(customer.updated_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>

            {customer.notes && (
              <div className="md:col-span-2 bg-slate-950/60 p-5 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-500 block mb-1">Account Notes / Onboarding Context</span>
                <p className="text-sm text-slate-300 leading-relaxed">{customer.notes}</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "contacts" && (
          <div className="space-y-4 pt-2">
            <div className="flex justify-between items-center">
              <p className="text-xs text-slate-400">
                Multiple contacts associated with this customer account. One primary contact per customer.
              </p>
              <button
                onClick={() => {
                  setContactForm({ full_name: "", designation: "", email: "", phone: "", preferred_channel: "PHONE", is_primary: false, notes: "" });
                  setModalError(null);
                  setIsAddContactOpen(true);
                }}
                className="flex items-center gap-2 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl transition"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Contact
              </button>
            </div>

            {contacts.length === 0 ? (
              <div className="p-8 text-center bg-slate-950/60 rounded-xl border border-slate-800 text-slate-400 text-sm">
                No contacts registered for this customer account yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {contacts.map((contact) => (
                  <div key={contact.id} className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl space-y-3 relative">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-base">{contact.full_name}</span>
                          {contact.is_primary && (
                            <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium">
                              <Star className="w-3 h-3 fill-amber-400" />
                              Primary Contact
                            </span>
                          )}
                        </div>
                        {contact.designation && <p className="text-xs text-slate-400">{contact.designation}</p>}
                      </div>

                      <button
                        onClick={() => handleToggleContactPrimary(contact.id, contact.is_primary)}
                        className={`text-xs p-1.5 rounded-lg border transition ${
                          contact.is_primary
                            ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                            : "text-slate-400 hover:text-white border-slate-800 hover:bg-slate-800"
                        }`}
                        title={contact.is_primary ? "Unset Primary" : "Set as Primary Contact"}
                      >
                        <Star className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-300">
                      {contact.email && (
                        <div className="flex items-center gap-2 text-slate-300">
                          <Mail className="w-3.5 h-3.5 text-slate-500" />
                          <span>{contact.email}</span>
                        </div>
                      )}
                      {contact.phone && (
                        <div className="flex items-center gap-2 text-slate-300">
                          <Phone className="w-3.5 h-3.5 text-slate-500" />
                          <span>{contact.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "addresses" && (
          <div className="space-y-4 pt-2">
            <div className="flex justify-between items-center">
              <p className="text-xs text-slate-400">
                Registered delivery locations and billing addresses.
              </p>
              <button
                onClick={() => {
                  setAddressForm({
                    address_type: "DELIVERY",
                    label: "",
                    address_line1: "",
                    address_line2: "",
                    city: "",
                    state: "",
                    postal_code: "",
                    country: "India",
                    is_primary_delivery: false,
                    is_primary_billing: false,
                    notes: "",
                  });
                  setModalError(null);
                  setIsAddAddressOpen(true);
                }}
                className="flex items-center gap-2 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl transition"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Address
              </button>
            </div>

            {addresses.length === 0 ? (
              <div className="p-8 text-center bg-slate-950/60 rounded-xl border border-slate-800 text-slate-400 text-sm">
                No delivery or billing addresses registered for this account yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map((addr) => (
                  <div key={addr.id} className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl space-y-3 relative">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">{addr.label || `${addr.address_type} Address`}</span>
                          <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                            {addr.address_type}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {addr.address_type !== "BILLING" && (
                          <button
                            onClick={() => handleToggleAddressPrimary(addr.id, "delivery", addr.is_primary_delivery)}
                            className={`text-xs px-2 py-1 rounded border transition ${
                              addr.is_primary_delivery
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                : "text-slate-400 hover:text-white border-slate-800"
                            }`}
                            title="Primary Delivery Address"
                          >
                            Primary Delivery
                          </button>
                        )}
                        {addr.address_type !== "DELIVERY" && (
                          <button
                            onClick={() => handleToggleAddressPrimary(addr.id, "billing", addr.is_primary_billing)}
                            className={`text-xs px-2 py-1 rounded border transition ${
                              addr.is_primary_billing
                                ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                                : "text-slate-400 hover:text-white border-slate-800"
                            }`}
                            title="Primary Billing Address"
                          >
                            Primary Billing
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="text-xs text-slate-300 leading-relaxed">
                      <p>{addr.address_line1}</p>
                      {addr.address_line2 && <p>{addr.address_line2}</p>}
                      <p>{addr.city}, {addr.state} - {addr.postal_code}, {addr.country}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Contact Modal */}
      {isAddContactOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">Add Customer Contact</h3>
              <button onClick={() => setIsAddContactOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            {modalError && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleAddContact} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={contactForm.full_name}
                  onChange={(e) => setContactForm({ ...contactForm, full_name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Designation</label>
                <input
                  type="text"
                  placeholder="e.g. Executive Chef / Purchase Manager"
                  value={contactForm.designation}
                  onChange={(e) => setContactForm({ ...contactForm, designation: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Email</label>
                  <input
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Phone</label>
                  <input
                    type="text"
                    value={contactForm.phone}
                    onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="is_primary_contact"
                  checked={contactForm.is_primary}
                  onChange={(e) => setContactForm({ ...contactForm, is_primary: e.target.checked })}
                  className="rounded border-slate-800 bg-slate-950 text-emerald-500 focus:ring-0"
                />
                <label htmlFor="is_primary_contact" className="text-xs text-slate-300 cursor-pointer">
                  Set as Primary Contact for this Customer
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button type="button" onClick={() => setIsAddContactOpen(false)} className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl">Cancel</button>
                <button type="submit" disabled={submitting} className="px-4 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-xl disabled:opacity-50">Save Contact</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Address Modal */}
      {isAddAddressOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">Add Customer Address</h3>
              <button onClick={() => setIsAddAddressOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            {modalError && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleAddAddress} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Address Type *</label>
                  <select
                    value={addressForm.address_type}
                    onChange={(e) => setAddressForm({ ...addressForm, address_type: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="DELIVERY">Delivery</option>
                    <option value="BILLING">Billing</option>
                    <option value="BOTH">Both Billing & Delivery</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Label</label>
                  <input
                    type="text"
                    placeholder="e.g. Main Kitchen Warehouse"
                    value={addressForm.label}
                    onChange={(e) => setAddressForm({ ...addressForm, label: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Address Line 1 *</label>
                <input
                  type="text"
                  required
                  placeholder="Plot/Building, Street, Area"
                  value={addressForm.address_line1}
                  onChange={(e) => setAddressForm({ ...addressForm, address_line1: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={addressForm.city}
                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">State *</label>
                  <input
                    type="text"
                    required
                    value={addressForm.state}
                    onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Postal Code *</label>
                  <input
                    type="text"
                    required
                    value={addressForm.postal_code}
                    onChange={(e) => setAddressForm({ ...addressForm, postal_code: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button type="button" onClick={() => setIsAddAddressOpen(false)} className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl">Cancel</button>
                <button type="submit" disabled={submitting} className="px-4 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-xl disabled:opacity-50">Save Address</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
