"use client";

import { useEffect, useState, use, useMemo } from "react";
import Link from "next/link";
import {
  Tractor,
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
  Store,
  Truck,
  History,
  Lock,
  MessageSquare,
} from "lucide-react";

interface SupplierDetail {
  id: string;
  supplier_code: string;
  legal_name: string;
  trade_name: string | null;
  supplier_type: "POULTRY_FARM" | "WHOLESALE_MANDI" | "PARTNER_FARM" | "PROCESSOR" | "DISTRIBUTOR" | "OTHER";
  sourcing_channel: "DIRECT_FARM" | "MANDI_TRADER" | "CONTRACT_FARMING" | "INTEGRATOR" | "OTHER";
  gstin: string | null;
  pan: string | null;
  status: "PROSPECT" | "PENDING_VERIFICATION" | "ACTIVE" | "ON_HOLD" | "INACTIVE";
  verification_status: "UNVERIFIED" | "VERIFIED" | "SUSPENDED";
  assigned_procurement_owner_id: string | null;
  assigned_procurement_owner?: { id: string; full_name: string; email: string } | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

interface Contact {
  id: string;
  supplier_id: string;
  contact_name: string;
  designation: string | null;
  email: string | null;
  phone: string | null;
  is_primary: boolean;
  preferred_channel: "PHONE" | "WHATSAPP" | "EMAIL" | "NONE";
  status: "ACTIVE" | "INACTIVE";
  notes: string | null;
  created_at: string;
  updated_at: string;
}

interface Address {
  id: string;
  supplier_id: string;
  address_type: "FARM_LOCATION" | "MANDI_WAREHOUSE" | "BILLING" | "PICKUP_SOURCE" | "OTHER";
  address_line1: string;
  address_line2: string | null;
  landmark: string | null;
  city: string;
  state: string;
  postal_code: string | null;
  country: string;
  is_primary_pickup: boolean;
  is_primary_billing: boolean;
  status: "ACTIVE" | "INACTIVE";
  notes: string | null;
  created_at: string;
  updated_at: string;
}

interface StaffUser {
  id: string;
  full_name: string;
  email: string;
}

export default function SupplierDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: supplierId } = use(params);
  const [supplier, setSupplier] = useState<SupplierDetail | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [staffUsers, setStaffUsers] = useState<StaffUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<"overview" | "contacts" | "addresses" | "audit">("overview");

  // Edit Supplier State
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    legal_name: "",
    trade_name: "",
    supplier_type: "POULTRY_FARM",
    sourcing_channel: "DIRECT_FARM",
    gstin: "",
    pan: "",
    status: "PROSPECT",
    verification_status: "UNVERIFIED",
    assigned_procurement_owner_id: "",
    notes: "",
  });
  const [savingSupplier, setSavingSupplier] = useState(false);

  // Add Contact Modal
  const [isAddContactOpen, setIsAddContactOpen] = useState(false);
  const [submittingContact, setSubmittingContact] = useState(false);
  const [contactError, setContactError] = useState<string | null>(null);
  const [contactForm, setContactForm] = useState({
    contact_name: "",
    designation: "",
    email: "",
    phone: "",
    preferred_channel: "PHONE",
    is_primary: false,
    notes: "",
  });

  // Add Address Modal
  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);
  const [submittingAddress, setSubmittingAddress] = useState(false);
  const [addressError, setAddressError] = useState<string | null>(null);
  const [addressForm, setAddressForm] = useState({
    address_type: "PICKUP_SOURCE",
    address_line1: "",
    address_line2: "",
    landmark: "",
    city: "",
    state: "",
    postal_code: "",
    country: "India",
    is_primary_pickup: false,
    is_primary_billing: false,
    notes: "",
  });

  const fetchSupplierData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch Master
      const sRes = await fetch(`/api/suppliers/${supplierId}`);
      const sData = await sRes.json();
      if (!sRes.ok) throw new Error(sData.error || "Failed to load supplier detail");

      setSupplier(sData.supplier);
      setEditForm({
        legal_name: sData.supplier.legal_name || "",
        trade_name: sData.supplier.trade_name || "",
        supplier_type: sData.supplier.supplier_type || "POULTRY_FARM",
        sourcing_channel: sData.supplier.sourcing_channel || "DIRECT_FARM",
        gstin: sData.supplier.gstin || "",
        pan: sData.supplier.pan || "",
        status: sData.supplier.status || "PROSPECT",
        verification_status: sData.supplier.verification_status || "UNVERIFIED",
        assigned_procurement_owner_id: sData.supplier.assigned_procurement_owner_id || "",
        notes: sData.supplier.notes || "",
      });

      // Fetch Contacts
      const cRes = await fetch(`/api/suppliers/${supplierId}/contacts`);
      if (cRes.ok) {
        const cData = await cRes.json();
        setContacts(cData.contacts || []);
      }

      // Fetch Addresses
      const aRes = await fetch(`/api/suppliers/${supplierId}/addresses`);
      if (aRes.ok) {
        const aData = await aRes.json();
        setAddresses(aData.addresses || []);
      }

      // Fetch Setup staff
      const setupRes = await fetch("/api/suppliers/setup");
      if (setupRes.ok) {
        const setupData = await setupRes.json();
        if (setupData.staffUsers) setStaffUsers(setupData.staffUsers);
      }
    } catch (err: any) {
      setError(err.message || "Error fetching supplier data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSupplierData();
  }, [supplierId]);

  // Save Supplier Edits
  const handleSaveSupplier = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSupplier(true);
    setError(null);
    try {
      const res = await fetch(`/api/suppliers/${supplierId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          legal_name: editForm.legal_name,
          trade_name: editForm.trade_name || null,
          supplier_type: editForm.supplier_type,
          sourcing_channel: editForm.sourcing_channel,
          gstin: editForm.gstin || null,
          pan: editForm.pan || null,
          status: editForm.status,
          verification_status: editForm.verification_status,
          assigned_procurement_owner_id: editForm.assigned_procurement_owner_id || null,
          notes: editForm.notes || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update supplier master");

      setSupplier(data.supplier);
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || "Failed to save supplier edits");
    } finally {
      setSavingSupplier(false);
    }
  };

  // Add Contact Submit
  const handleAddContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingContact(true);
    setContactError(null);
    try {
      const res = await fetch(`/api/suppliers/${supplierId}/contacts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add contact");

      setIsAddContactOpen(false);
      setContactForm({
        contact_name: "",
        designation: "",
        email: "",
        phone: "",
        preferred_channel: "PHONE",
        is_primary: false,
        notes: "",
      });
      fetchSupplierData();
    } catch (err: any) {
      setContactError(err.message || "Failed to create contact");
    } finally {
      setSubmittingContact(false);
    }
  };

  // Set Primary Contact
  const handleSetPrimaryContact = async (contactId: string) => {
    try {
      const res = await fetch(`/api/suppliers/${supplierId}/contacts/${contactId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_primary: true }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to set primary contact");
      }
      fetchSupplierData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Toggle Contact Status
  const handleToggleContactStatus = async (contactId: string, currentStatus: string) => {
    const nextStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    try {
      const res = await fetch(`/api/suppliers/${supplierId}/contacts/${contactId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to toggle contact status");
      }
      fetchSupplierData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Add Address Submit
  const handleAddAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingAddress(true);
    setAddressError(null);
    try {
      const res = await fetch(`/api/suppliers/${supplierId}/addresses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addressForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add address");

      setIsAddAddressOpen(false);
      setAddressForm({
        address_type: "PICKUP_SOURCE",
        address_line1: "",
        address_line2: "",
        landmark: "",
        city: "",
        state: "",
        postal_code: "",
        country: "India",
        is_primary_pickup: false,
        is_primary_billing: false,
        notes: "",
      });
      fetchSupplierData();
    } catch (err: any) {
      setAddressError(err.message || "Failed to create address");
    } finally {
      setSubmittingAddress(false);
    }
  };

  // Set Primary Address Pickup/Billing
  const handleSetPrimaryAddress = async (addressId: string, type: "PICKUP" | "BILLING") => {
    try {
      const body = type === "PICKUP" ? { is_primary_pickup: true } : { is_primary_billing: true };
      const res = await fetch(`/api/suppliers/${supplierId}/addresses/${addressId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || `Failed to set primary ${type.toLowerCase()}`);
      }
      fetchSupplierData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Toggle Address Status
  const handleToggleAddressStatus = async (addressId: string, currentStatus: string) => {
    const nextStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    try {
      const res = await fetch(`/api/suppliers/${supplierId}/addresses/${addressId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to toggle address status");
      }
      fetchSupplierData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-500">
        <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-3 text-emerald-400" />
        Loading supplier master record...
      </div>
    );
  }

  if (error || !supplier) {
    return (
      <div className="space-y-4">
        <Link
          href="/suppliers"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Suppliers Directory
        </Link>
        <div className="rounded-xl border border-red-900/50 bg-red-950/20 p-6 text-red-300">
          <AlertCircle className="h-6 w-6 text-red-400 mb-2" />
          <h2 className="text-lg font-bold">Error Loading Master Record</h2>
          <p className="text-sm text-red-400 mt-1">{error || "Supplier record not found."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <Link
            href="/suppliers"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-400 transition-colors mb-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Suppliers Directory
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-100 flex items-center gap-2">
              <span>{supplier.legal_name}</span>
              <span className="font-mono text-sm px-2.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-800 text-emerald-400 font-normal">
                {supplier.supplier_code}
              </span>
            </h1>
          </div>
          {supplier.trade_name && (
            <p className="text-sm text-slate-400 mt-0.5">Trade Name: {supplier.trade_name}</p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-800">
            {supplier.status}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
            {supplier.verification_status}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-800">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab("overview")}
            className={`py-3 px-1 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === "overview"
                ? "border-emerald-500 text-emerald-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Tractor className="h-4 w-4" /> Overview
          </button>

          <button
            onClick={() => setActiveTab("contacts")}
            className={`py-3 px-1 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === "contacts"
                ? "border-emerald-500 text-emerald-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Users className="h-4 w-4" /> Contacts ({contacts.length})
          </button>

          <button
            onClick={() => setActiveTab("addresses")}
            className={`py-3 px-1 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === "addresses"
                ? "border-emerald-500 text-emerald-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <MapPin className="h-4 w-4" /> Locations ({addresses.length})
          </button>
        </nav>
      </div>

      {/* Tab Content: Overview */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info Box */}
          <div className="lg:col-span-2 rounded-xl border border-slate-800 bg-slate-900/50 p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Tractor className="h-4 w-4 text-emerald-400" />
                Supplier Master Identity
              </h3>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-950 text-slate-300 text-xs font-medium hover:bg-slate-800 transition-colors"
                >
                  <Edit3 className="h-3.5 w-3.5 text-emerald-400" /> Edit Master
                </button>
              ) : (
                <button
                  onClick={() => setIsEditing(false)}
                  className="text-xs text-slate-400 hover:text-slate-200"
                >
                  Cancel Edit
                </button>
              )}
            </div>

            {!isEditing ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">
                    Supplier Code (Immutable)
                  </div>
                  <div className="font-mono text-sm font-bold text-emerald-400 flex items-center gap-2">
                    {supplier.supplier_code}
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-sans font-normal border border-slate-700 flex items-center gap-1">
                      <Lock className="h-2.5 w-2.5 text-amber-400" /> DB Trigger Protected
                    </span>
                  </div>
                </div>

                <div>
                  <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">
                    Legal Business Name
                  </div>
                  <div className="text-sm font-medium text-slate-100">{supplier.legal_name}</div>
                </div>

                <div>
                  <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">
                    Trade Name
                  </div>
                  <div className="text-sm text-slate-300">{supplier.trade_name || "—"}</div>
                </div>

                <div>
                  <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">
                    Supplier Type
                  </div>
                  <div className="text-sm text-slate-200 font-medium">{supplier.supplier_type}</div>
                </div>

                <div>
                  <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">
                    Sourcing Channel
                  </div>
                  <div className="text-sm text-slate-200 font-medium">{supplier.sourcing_channel}</div>
                </div>

                <div>
                  <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">
                    GSTIN
                  </div>
                  <div className="font-mono text-sm text-slate-200">{supplier.gstin || "—"}</div>
                </div>

                <div>
                  <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">
                    PAN
                  </div>
                  <div className="font-mono text-sm text-slate-200">{supplier.pan || "—"}</div>
                </div>

                <div>
                  <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">
                    Assigned Procurement Owner
                  </div>
                  <div className="text-sm text-slate-200 font-medium">
                    {supplier.assigned_procurement_owner
                      ? `${supplier.assigned_procurement_owner.full_name} (${supplier.assigned_procurement_owner.email})`
                      : "Unassigned"}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">
                    Lifecycle Status
                  </div>
                  <div className="text-sm font-medium text-emerald-400">{supplier.status}</div>
                </div>

                <div>
                  <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">
                    Verification State
                  </div>
                  <div className="text-sm font-medium text-slate-200">
                    {supplier.verification_status}
                    <div className="text-[11px] text-slate-500 font-normal mt-0.5">
                      Strictly FarmReem internal supplier onboarding status.
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">
                    Notes
                  </div>
                  <div className="text-sm text-slate-300 bg-slate-950 p-3 rounded-lg border border-slate-800 whitespace-pre-wrap">
                    {supplier.notes || "No internal notes."}
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSaveSupplier} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Legal Business Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={editForm.legal_name}
                      onChange={(e) => setEditForm({ ...editForm, legal_name: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Trade Name (Optional)
                    </label>
                    <input
                      type="text"
                      value={editForm.trade_name}
                      onChange={(e) => setEditForm({ ...editForm, trade_name: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Supplier Type
                    </label>
                    <select
                      value={editForm.supplier_type}
                      onChange={(e) => setEditForm({ ...editForm, supplier_type: e.target.value as any })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                    >
                      <option value="POULTRY_FARM">Poultry Farm</option>
                      <option value="WHOLESALE_MANDI">Wholesale Mandi</option>
                      <option value="PARTNER_FARM">Partner Farm</option>
                      <option value="PROCESSOR">Processor</option>
                      <option value="DISTRIBUTOR">Distributor</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Sourcing Channel
                    </label>
                    <select
                      value={editForm.sourcing_channel}
                      onChange={(e) => setEditForm({ ...editForm, sourcing_channel: e.target.value as any })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                    >
                      <option value="DIRECT_FARM">Direct Farm</option>
                      <option value="MANDI_TRADER">Mandi Trader</option>
                      <option value="CONTRACT_FARMING">Contract Farming</option>
                      <option value="INTEGRATOR">Integrator</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">GSTIN</label>
                    <input
                      type="text"
                      maxLength={15}
                      value={editForm.gstin}
                      onChange={(e) => setEditForm({ ...editForm, gstin: e.target.value.toUpperCase() })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 font-mono uppercase focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">PAN</label>
                    <input
                      type="text"
                      maxLength={10}
                      value={editForm.pan}
                      onChange={(e) => setEditForm({ ...editForm, pan: e.target.value.toUpperCase() })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 font-mono uppercase focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Lifecycle Status
                    </label>
                    <select
                      value={editForm.status}
                      onChange={(e) => setEditForm({ ...editForm, status: e.target.value as any })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                    >
                      <option value="PROSPECT">Prospect</option>
                      <option value="PENDING_VERIFICATION">Pending Verification</option>
                      <option value="ACTIVE">Active</option>
                      <option value="ON_HOLD">On Hold</option>
                      <option value="INACTIVE">Inactive</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Verification State
                    </label>
                    <select
                      value={editForm.verification_status}
                      onChange={(e) =>
                        setEditForm({ ...editForm, verification_status: e.target.value as any })
                      }
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                    >
                      <option value="UNVERIFIED">Unverified</option>
                      <option value="VERIFIED">FarmReem Verified</option>
                      <option value="SUSPENDED">Suspended</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Procurement Owner
                    </label>
                    <select
                      value={editForm.assigned_procurement_owner_id}
                      onChange={(e) =>
                        setEditForm({ ...editForm, assigned_procurement_owner_id: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                    >
                      <option value="">Unassigned</option>
                      {staffUsers.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.full_name} ({user.email})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Notes</label>
                  <textarea
                    rows={3}
                    value={editForm.notes}
                    onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 rounded-lg border border-slate-800 bg-slate-950 text-slate-300 text-sm font-medium hover:bg-slate-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingSupplier}
                    className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    {savingSupplier && <RefreshCw className="h-4 w-4 animate-spin" />} Save Changes
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Sidebar Meta Box */}
          <div className="space-y-6">
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 space-y-4">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-3">
                <Clock className="h-4 w-4 text-emerald-400" /> Audit Timestamps
              </h3>
              <div className="space-y-3 text-xs">
                <div>
                  <div className="text-slate-400">Created At</div>
                  <div className="text-slate-200 font-mono mt-0.5">
                    {new Date(supplier.created_at).toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400">Last Updated</div>
                  <div className="text-slate-200 font-mono mt-0.5">
                    {new Date(supplier.updated_at).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content: Contacts */}
      {activeTab === "contacts" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Users className="h-5 w-5 text-emerald-400" />
              Supplier Contacts Directory
            </h3>
            <button
              onClick={() => setIsAddContactOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-colors"
            >
              <Plus className="h-3.5 w-3.5" /> Add Contact
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {contacts.length === 0 ? (
              <div className="col-span-full py-12 text-center text-slate-500 border border-dashed border-slate-800 rounded-xl">
                No contacts registered for this supplier yet.
              </div>
            ) : (
              contacts.map((c) => (
                <div
                  key={c.id}
                  className={`rounded-xl border p-5 relative space-y-3 backdrop-blur-md transition-all ${
                    c.is_primary
                      ? "border-emerald-500/50 bg-emerald-950/20 shadow-lg shadow-emerald-950/30"
                      : "border-slate-800 bg-slate-900/40"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-bold text-slate-100 text-base flex items-center gap-2">
                        {c.contact_name}
                        {c.is_primary && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-800 flex items-center gap-1">
                            <Star className="h-3 w-3 fill-emerald-400" /> Primary Contact
                          </span>
                        )}
                      </div>
                      {c.designation && (
                        <div className="text-xs text-slate-400 mt-0.5">{c.designation}</div>
                      )}
                    </div>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                        c.status === "ACTIVE"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-slate-800 text-slate-500"
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-300">
                    {c.phone && (
                      <div className="flex items-center gap-2 text-slate-300">
                        <Phone className="h-3.5 w-3.5 text-slate-400" />
                        <span className="font-mono">{c.phone}</span>
                      </div>
                    )}
                    {c.email && (
                      <div className="flex items-center gap-2 text-slate-300">
                        <Mail className="h-3.5 w-3.5 text-slate-400" />
                        <span>{c.email}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                      <MessageSquare className="h-3.5 w-3.5" />
                      <span>Prefers: {c.preferred_channel}</span>
                    </div>
                  </div>

                  {c.notes && (
                    <div className="text-xs text-slate-400 bg-slate-950/60 p-2 rounded border border-slate-800/80">
                      {c.notes}
                    </div>
                  )}

                  <div className="flex items-center justify-between border-t border-slate-800/80 pt-3">
                    {!c.is_primary && c.status === "ACTIVE" && (
                      <button
                        onClick={() => handleSetPrimaryContact(c.id)}
                        className="text-xs text-emerald-400 hover:text-emerald-300 font-medium"
                      >
                        Set as Primary
                      </button>
                    )}
                    <button
                      onClick={() => handleToggleContactStatus(c.id, c.status)}
                      className="text-xs text-slate-400 hover:text-slate-200 ml-auto"
                    >
                      {c.status === "ACTIVE" ? "Deactivate" : "Reactivate"}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab Content: Locations / Addresses */}
      {activeTab === "addresses" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-emerald-400" />
              Supplier Locations & Warehouses
            </h3>
            <button
              onClick={() => setIsAddAddressOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-colors"
            >
              <Plus className="h-3.5 w-3.5" /> Add Location
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.length === 0 ? (
              <div className="col-span-full py-12 text-center text-slate-500 border border-dashed border-slate-800 rounded-xl">
                No location records registered for this supplier yet.
              </div>
            ) : (
              addresses.map((a) => (
                <div
                  key={a.id}
                  className={`rounded-xl border p-5 relative space-y-3 backdrop-blur-md transition-all ${
                    a.is_primary_pickup || a.is_primary_billing
                      ? "border-emerald-500/50 bg-emerald-950/20 shadow-lg shadow-emerald-950/30"
                      : "border-slate-800 bg-slate-900/40"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-bold text-slate-100 text-sm flex flex-wrap items-center gap-2">
                        <span>{a.address_type}</span>
                        {a.is_primary_pickup && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-800">
                            Primary Pickup
                          </span>
                        )}
                        {a.is_primary_billing && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-500/20 text-blue-400 border border-blue-800">
                            Primary Billing
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-300 font-medium mt-1">
                        {a.address_line1}
                        {a.address_line2 && `, ${a.address_line2}`}
                      </div>
                    </div>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                        a.status === "ACTIVE"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-slate-800 text-slate-500"
                      }`}
                    >
                      {a.status}
                    </span>
                  </div>

                  <div className="text-xs text-slate-400 space-y-0.5">
                    {a.landmark && <div>Landmark: {a.landmark}</div>}
                    <div>
                      {a.city}, {a.state} {a.postal_code ? `- ${a.postal_code}` : ""} ({a.country})
                    </div>
                  </div>

                  {a.notes && (
                    <div className="text-xs text-slate-400 bg-slate-950/60 p-2 rounded border border-slate-800/80">
                      {a.notes}
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-3 border-t border-slate-800/80 pt-3 text-xs">
                    {!a.is_primary_pickup && a.address_type !== "BILLING" && a.status === "ACTIVE" && (
                      <button
                        onClick={() => handleSetPrimaryAddress(a.id, "PICKUP")}
                        className="text-emerald-400 hover:text-emerald-300 font-medium"
                      >
                        Set Primary Pickup
                      </button>
                    )}
                    {!a.is_primary_billing && a.status === "ACTIVE" && (
                      <button
                        onClick={() => handleSetPrimaryAddress(a.id, "BILLING")}
                        className="text-blue-400 hover:text-blue-300 font-medium"
                      >
                        Set Primary Billing
                      </button>
                    )}
                    <button
                      onClick={() => handleToggleAddressStatus(a.id, a.status)}
                      className="text-slate-400 hover:text-slate-200 ml-auto"
                    >
                      {a.status === "ACTIVE" ? "Deactivate" : "Reactivate"}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Add Contact Modal */}
      {isAddContactOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Users className="h-4 w-4 text-emerald-400" /> Add Contact Person
              </h3>
              <button
                onClick={() => setIsAddContactOpen(false)}
                className="text-slate-400 hover:text-slate-200 text-xl font-bold"
              >
                &times;
              </button>
            </div>

            {contactError && (
              <div className="bg-red-950/30 border border-red-800/50 rounded p-2.5 text-xs text-red-300">
                {contactError}
              </div>
            )}

            <form onSubmit={handleAddContactSubmit} className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Full Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rajesh Kumar"
                  value={contactForm.contact_name}
                  onChange={(e) => setContactForm({ ...contactForm, contact_name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Designation</label>
                  <input
                    type="text"
                    placeholder="e.g. Farm Manager"
                    value={contactForm.designation}
                    onChange={(e) => setContactForm({ ...contactForm, designation: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Preferred Channel
                  </label>
                  <select
                    value={contactForm.preferred_channel}
                    onChange={(e) =>
                      setContactForm({ ...contactForm, preferred_channel: e.target.value as any })
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="PHONE">Phone</option>
                    <option value="WHATSAPP">WhatsApp</option>
                    <option value="EMAIL">Email</option>
                    <option value="NONE">None</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="+91 9876543210"
                    value={contactForm.phone}
                    onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="rajesh@farm.com"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="is_primary"
                  checked={contactForm.is_primary}
                  onChange={(e) => setContactForm({ ...contactForm, is_primary: e.target.checked })}
                  className="rounded border-slate-800 text-emerald-600 focus:ring-emerald-500 bg-slate-950"
                />
                <label htmlFor="is_primary" className="text-xs text-slate-300">
                  Set as Primary Contact for this Supplier
                </label>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Notes</label>
                <textarea
                  rows={2}
                  placeholder="Availability timing, language preference..."
                  value={contactForm.notes}
                  onChange={(e) => setContactForm({ ...contactForm, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddContactOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-800 bg-slate-950 text-slate-300 text-xs font-medium hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingContact}
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {submittingContact && <RefreshCw className="h-3.5 w-3.5 animate-spin" />}
                  Save Contact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Address Modal */}
      {isAddAddressOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-emerald-400" /> Add Location / Address
              </h3>
              <button
                onClick={() => setIsAddAddressOpen(false)}
                className="text-slate-400 hover:text-slate-200 text-xl font-bold"
              >
                &times;
              </button>
            </div>

            {addressError && (
              <div className="bg-red-950/30 border border-red-800/50 rounded p-2.5 text-xs text-red-300">
                {addressError}
              </div>
            )}

            <form onSubmit={handleAddAddressSubmit} className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Location Type <span className="text-red-400">*</span>
                </label>
                <select
                  value={addressForm.address_type}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, address_type: e.target.value as any })
                  }
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="FARM_LOCATION">Farm Location</option>
                  <option value="MANDI_WAREHOUSE">Mandi Warehouse</option>
                  <option value="PICKUP_SOURCE">Pickup Source</option>
                  <option value="BILLING">Billing Only</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Address Line 1 <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Plot/Survey No, Village, Street"
                  value={addressForm.address_line1}
                  onChange={(e) => setAddressForm({ ...addressForm, address_line1: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Address Line 2</label>
                <input
                  type="text"
                  placeholder="Tehsil, District, Sub-location"
                  value={addressForm.address_line2}
                  onChange={(e) => setAddressForm({ ...addressForm, address_line2: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Landmark</label>
                  <input
                    type="text"
                    placeholder="Near Toll Gate / Water Tank"
                    value={addressForm.landmark}
                    onChange={(e) => setAddressForm({ ...addressForm, landmark: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    City / Town <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Hosur"
                    value={addressForm.city}
                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    State <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tamil Nadu"
                    value={addressForm.state}
                    onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Pincode</label>
                  <input
                    type="text"
                    placeholder="635109"
                    value={addressForm.postal_code}
                    onChange={(e) => setAddressForm({ ...addressForm, postal_code: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Country</label>
                  <input
                    type="text"
                    value={addressForm.country}
                    onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-2 pt-1">
                {addressForm.address_type !== "BILLING" && (
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="is_primary_pickup"
                      checked={addressForm.is_primary_pickup}
                      onChange={(e) =>
                        setAddressForm({ ...addressForm, is_primary_pickup: e.target.checked })
                      }
                      className="rounded border-slate-800 text-emerald-600 focus:ring-emerald-500 bg-slate-950"
                    />
                    <label htmlFor="is_primary_pickup" className="text-xs text-slate-300">
                      Set as Primary Pickup Source
                    </label>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_primary_billing"
                    checked={addressForm.is_primary_billing}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, is_primary_billing: e.target.checked })
                    }
                    className="rounded border-slate-800 text-blue-600 focus:ring-blue-500 bg-slate-950"
                  />
                  <label htmlFor="is_primary_billing" className="text-xs text-slate-300">
                    Set as Primary Billing Location
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Notes</label>
                <textarea
                  rows={2}
                  placeholder="Truck loading dock info, gate entry instructions..."
                  value={addressForm.notes}
                  onChange={(e) => setAddressForm({ ...addressForm, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddAddressOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-800 bg-slate-950 text-slate-300 text-xs font-medium hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingAddress}
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {submittingAddress && <RefreshCw className="h-3.5 w-3.5 animate-spin" />}
                  Save Location
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
