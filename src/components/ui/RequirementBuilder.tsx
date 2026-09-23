"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Sliders, Layers } from "lucide-react";

export default function RequirementBuilder() {
  const [activeCategory, setActiveCategory] = useState<"live" | "whole" | "cuts" | "boneless">("live");

  // State for Live Bird
  const [liveSize, setLiveSize] = useState("Medium (1.0 – 1.4 kg)");
  const [liveQty, setLiveQty] = useState("100");
  const [liveSlot, setLiveSlot] = useState("Morning (6 AM – 8 AM)");

  // State for Cuts
  const [cutType, setCutType] = useState("Curry Cut");
  const [cutQty, setCutQty] = useState("50");
  const [skinPref, setSkinPref] = useState("Skinless");
  const [bonePref, setBonePref] = useState("Bone-In");

  return (
    <div className="bg-white rounded-3xl border border-[#E8E1D3] p-6 sm:p-10 shadow-xl space-y-8 max-w-4xl mx-auto">
      {/* Header Badge & Title */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#E8E1D3]">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF7F2] text-[#C59B27] border border-[#E8E1D3] text-xs font-extrabold uppercase tracking-wider">
            <Sliders className="w-3.5 h-3.5 text-[#C59B27]" />
            <span>B2B Ordering Experience · Portal in Development</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-[#0F2E23]">
            What does your kitchen need?
          </h3>
          <p className="text-xs text-[#4F5E57] font-medium">
            Configure your requirement visually to preview how FarmReem plans supply around your kitchen.
          </p>
        </div>
        <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-extrabold flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Interactive Demo UI
        </span>
      </div>

      {/* Category Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <button
          type="button"
          onClick={() => setActiveCategory("live")}
          className={`px-4 py-3 rounded-xl text-xs font-extrabold transition-all border text-center cursor-pointer ${
            activeCategory === "live"
              ? "bg-[#0F2E23] text-white border-[#0F2E23] shadow-md"
              : "bg-[#FAF7F2] text-[#0F2E23] border-[#E8E1D3] hover:bg-white"
          }`}
        >
          Live Bird Supply
        </button>
        <button
          type="button"
          onClick={() => setActiveCategory("whole")}
          className={`px-4 py-3 rounded-xl text-xs font-extrabold transition-all border text-center cursor-pointer ${
            activeCategory === "whole"
              ? "bg-[#0F2E23] text-white border-[#0F2E23] shadow-md"
              : "bg-[#FAF7F2] text-[#0F2E23] border-[#E8E1D3] hover:bg-white"
          }`}
        >
          Whole / Dressed
        </button>
        <button
          type="button"
          onClick={() => setActiveCategory("cuts")}
          className={`px-4 py-3 rounded-xl text-xs font-extrabold transition-all border text-center cursor-pointer ${
            activeCategory === "cuts"
              ? "bg-[#0F2E23] text-white border-[#0F2E23] shadow-md"
              : "bg-[#FAF7F2] text-[#0F2E23] border-[#E8E1D3] hover:bg-white"
          }`}
        >
          Portion Cuts
        </button>
        <button
          type="button"
          onClick={() => setActiveCategory("boneless")}
          className={`px-4 py-3 rounded-xl text-xs font-extrabold transition-all border text-center cursor-pointer ${
            activeCategory === "boneless"
              ? "bg-[#0F2E23] text-white border-[#0F2E23] shadow-md"
              : "bg-[#FAF7F2] text-[#0F2E23] border-[#E8E1D3] hover:bg-white"
          }`}
        >
          Boneless Meat
        </button>
      </div>

      {/* Category Option Panels */}
      {activeCategory === "live" && (
        <div className="space-y-6 animate-fadeIn">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="space-y-2">
              <label className="block font-extrabold text-[#0F2E23]">Select Bird Size</label>
              <select
                value={liveSize}
                onChange={(e) => setLiveSize(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E1D3] bg-[#FAF7F2] text-[#0F2E23] font-bold focus:outline-none focus:ring-2 focus:ring-[#0F2E23]"
              >
                <option value="Small (800 g – 1.0 kg)">Small (800 g – 1.0 kg) · Tandoor / Grill</option>
                <option value="Medium (1.0 – 1.4 kg)">Medium (1.0 kg – 1.4 kg) · Standard Restaurant</option>
                <option value="Large (1.4 – 1.8 kg)">Large (1.4 kg – 1.8 kg) · Banquet & Heavy Yield</option>
                <option value="Custom Specification">Custom Weight Range (Account Spec)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block font-extrabold text-[#0F2E23]">Estimated Quantity (Birds)</label>
              <input
                type="number"
                value={liveQty}
                onChange={(e) => setLiveQty(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E1D3] bg-[#FAF7F2] text-[#0F2E23] font-bold focus:outline-none focus:ring-2 focus:ring-[#0F2E23]"
              />
            </div>

            <div className="space-y-2">
              <label className="block font-extrabold text-[#0F2E23]">Preferred Delivery Window</label>
              <select
                value={liveSlot}
                onChange={(e) => setLiveSlot(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E1D3] bg-[#FAF7F2] text-[#0F2E23] font-bold focus:outline-none focus:ring-2 focus:ring-[#0F2E23]"
              >
                <option value="Morning (6 AM – 8 AM)">Morning (6:00 AM – 8:00 AM)</option>
                <option value="Mid-Day (10 AM – 12 PM)">Mid-Day (10:00 AM – 12:00 PM)</option>
                <option value="Custom Schedule">Custom Kitchen Slot</option>
              </select>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8E1D3] text-xs flex items-center justify-between flex-wrap gap-3">
            <div className="space-y-0.5">
              <span className="font-extrabold text-[#0F2E23] block">Configured Live Requirement:</span>
              <span className="text-[#4F5E57]">
                {liveQty} Live Birds · {liveSize} · {liveSlot}
              </span>
            </div>
            <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded border border-emerald-300">
              Active Supply Category
            </span>
          </div>
        </div>
      )}

      {activeCategory === "whole" && (
        <div className="space-y-6 animate-fadeIn">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="space-y-2">
              <label className="block font-extrabold text-[#0F2E23]">Product Type</label>
              <select className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E1D3] bg-[#FAF7F2] text-[#0F2E23] font-bold focus:outline-none focus:ring-2 focus:ring-[#0F2E23]">
                <option value="Whole Dressed Chicken">Whole Dressed Chicken</option>
                <option value="Whole Chicken Skin-On">Whole Chicken Skin-On</option>
                <option value="Whole Chicken Skinless">Whole Chicken Skinless</option>
                <option value="Whole Tandoori Bird">Whole Tandoori Bird</option>
                <option value="Half Chicken">Half Chicken</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block font-extrabold text-[#0F2E23]">Quantity (KG)</label>
              <input
                type="number"
                defaultValue="50"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E1D3] bg-[#FAF7F2] text-[#0F2E23] font-bold focus:outline-none focus:ring-2 focus:ring-[#0F2E23]"
              />
            </div>

            <div className="space-y-2">
              <label className="block font-extrabold text-[#0F2E23]">Status</label>
              <div className="px-3.5 py-2.5 rounded-xl border border-amber-300 bg-amber-50 text-amber-900 font-extrabold text-xs">
                ON REQUEST (Network Supply)
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8E1D3] text-xs space-y-1">
            <span className="font-extrabold text-[#0F2E23] block">Network Sourcing Note:</span>
            <p className="text-[#4F5E57]">
              Processed whole chicken is available through the FarmReem supply network upon commercial account confirmation.
            </p>
          </div>
        </div>
      )}

      {activeCategory === "cuts" && (
        <div className="space-y-6 animate-fadeIn">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
            <div className="space-y-2">
              <label className="block font-extrabold text-[#0F2E23]">Cut Type</label>
              <select
                value={cutType}
                onChange={(e) => setCutType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E1D3] bg-[#FAF7F2] text-[#0F2E23] font-bold focus:outline-none focus:ring-2 focus:ring-[#0F2E23]"
              >
                <option value="Curry Cut">Curry Cut (Standard)</option>
                <option value="Small Curry Cut">Small Curry Cut</option>
                <option value="Large Curry Cut">Large Curry Cut</option>
                <option value="Biryani Cut">Biryani Cut</option>
                <option value="Tandoori Cut">Tandoori Cut</option>
                <option value="Custom Cut">Custom Cut Specification</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block font-extrabold text-[#0F2E23]">Skin Preference</label>
              <select
                value={skinPref}
                onChange={(e) => setSkinPref(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E1D3] bg-[#FAF7F2] text-[#0F2E23] font-bold focus:outline-none focus:ring-2 focus:ring-[#0F2E23]"
              >
                <option value="Skinless">Skinless</option>
                <option value="Skin-On">Skin-On</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block font-extrabold text-[#0F2E23]">Bone Preference</label>
              <select
                value={bonePref}
                onChange={(e) => setBonePref(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E1D3] bg-[#FAF7F2] text-[#0F2E23] font-bold focus:outline-none focus:ring-2 focus:ring-[#0F2E23]"
              >
                <option value="Bone-In">Bone-In</option>
                <option value="Boneless">Boneless</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block font-extrabold text-[#0F2E23]">Quantity (KG)</label>
              <input
                type="number"
                value={cutQty}
                onChange={(e) => setCutQty(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E1D3] bg-[#FAF7F2] text-[#0F2E23] font-bold focus:outline-none focus:ring-2 focus:ring-[#0F2E23]"
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8E1D3] text-xs flex items-center justify-between flex-wrap gap-3">
            <div className="space-y-0.5">
              <span className="font-extrabold text-[#0F2E23] block">Configured Cut Requirement:</span>
              <span className="text-[#4F5E57]">
                {cutQty} KG · {cutType} ({skinPref}, {bonePref})
              </span>
            </div>
            <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2.5 py-1 rounded border border-amber-300">
              ON REQUEST (Network Sourcing)
            </span>
          </div>
        </div>
      )}

      {activeCategory === "boneless" && (
        <div className="space-y-6 animate-fadeIn">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="space-y-2">
              <label className="block font-extrabold text-[#0F2E23]">Boneless Specification</label>
              <select className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E1D3] bg-[#FAF7F2] text-[#0F2E23] font-bold focus:outline-none focus:ring-2 focus:ring-[#0F2E23]">
                <option value="Boneless Breast">Boneless Breast Fillet</option>
                <option value="Breast Cubes">Breast Cubes / Tikka Size</option>
                <option value="Boneless Thigh">Boneless Thigh</option>
                <option value="Breast Strips">Breast Strips / Finger Cut</option>
                <option value="Mince">Chicken Keema / Mince</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block font-extrabold text-[#0F2E23]">Estimated Quantity (KG)</label>
              <input
                type="number"
                defaultValue="30"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E1D3] bg-[#FAF7F2] text-[#0F2E23] font-bold focus:outline-none focus:ring-2 focus:ring-[#0F2E23]"
              />
            </div>

            <div className="space-y-2">
              <label className="block font-extrabold text-[#0F2E23]">Availability Status</label>
              <div className="px-3.5 py-2.5 rounded-xl border border-amber-300 bg-amber-50 text-amber-900 font-extrabold text-xs">
                ON REQUEST (Network Sourcing)
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8E1D3] text-xs space-y-1">
            <span className="font-extrabold text-[#0F2E23] block">Boneless Portioning Note:</span>
            <p className="text-[#4F5E57]">
              Boneless chicken products are supplied through verified network partners based on account volume requirements.
            </p>
          </div>
        </div>
      )}

      {/* Footer CTA & Disclosure */}
      <div className="pt-4 border-t border-[#E8E1D3] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-[#4F5E57] space-y-0.5">
          <span className="font-bold text-[#0F2E23] block">Need customized weight or cut specifications?</span>
          <p>Submit your kitchen requirements to receive commercial pricing options.</p>
        </div>

        <Link
          href="/request-pricing"
          className="w-full sm:w-auto bg-[#0F2E23] hover:bg-[#184636] text-[#FAF7F2] font-extrabold text-xs px-7 py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 group cursor-pointer"
        >
          Tell Us Your Requirement
          <ArrowRight className="w-4 h-4 text-[#C59B27] group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
