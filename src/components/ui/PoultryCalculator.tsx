"use client";

import { useState } from "react";
import Link from "next/link";
import { Calculator, ArrowRight, CheckCircle2, Info } from "lucide-react";

export default function PoultryCalculator() {
  const [kitchenType, setKitchenType] = useState("Restaurant");
  const [servings, setServings] = useState(150);
  const [portionGrams, setPortionGrams] = useState(200);
  const [birdCategory, setBirdCategory] = useState<"small" | "medium" | "large">("medium");

  // Calculation Logic
  // Total raw kg needed = (servings * portionGrams) / 1000
  const rawKgNeeded = Math.round((servings * portionGrams) / 1000);

  // Average live weight per bird category
  // Small: ~0.9kg (dressing yield ~70% => ~0.63kg meat)
  // Medium: ~1.2kg (dressing yield ~70% => ~0.84kg meat)
  // Large: ~1.6kg (dressing yield ~70% => ~1.12kg meat)
  const categoryYieldMap = {
    small: { avgWeight: 0.9, avgDressed: 0.63, label: "Small (800g – 1.0kg)" },
    medium: { avgWeight: 1.2, avgDressed: 0.84, label: "Medium (1.0kg – 1.4kg)" },
    large: { avgWeight: 1.6, avgDressed: 1.12, label: "Large (1.4kg – 1.8kg)" },
  };

  const selectedSpec = categoryYieldMap[birdCategory];
  const estimatedBirds = Math.ceil(rawKgNeeded / selectedSpec.avgDressed);

  return (
    <div className="bg-white rounded-3xl border border-[#E8E1D3] p-6 sm:p-10 shadow-xl space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#E8E1D3]">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF7F2] text-[#C59B27] border border-[#E8E1D3] text-xs font-extrabold uppercase tracking-wider">
            <Calculator className="w-3.5 h-3.5 text-[#C59B27]" />
            <span>B2B Procurement Planning Tool</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-[#0F2E23]">
            Poultry Requirement & Bird Count Calculator
          </h3>
          <p className="text-xs text-[#4F5E57] font-medium">
            Estimate live bird counts and total raw kilograms based on your daily kitchen cover count and portion sizes.
          </p>
        </div>
        <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-extrabold">
          Interactive Calculator
        </span>
      </div>

      {/* Input Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs text-[#0F2E23]">
        <div className="space-y-2">
          <label className="block font-extrabold">Kitchen Category</label>
          <select
            value={kitchenType}
            onChange={(e) => setKitchenType(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E1D3] bg-[#FAF7F2] font-bold focus:outline-none focus:ring-2 focus:ring-[#0F2E23]"
          >
            <option value="Hotel">Hotel / Fine Dining</option>
            <option value="Restaurant">Standalone Restaurant</option>
            <option value="Caterer">Event & Banquet Caterer</option>
            <option value="Institutional">Institutional Mess</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block font-extrabold">Daily Servings / Covers</label>
          <input
            type="number"
            value={servings}
            onChange={(e) => setServings(Math.max(1, parseInt(e.target.value) || 0))}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E1D3] bg-[#FAF7F2] font-bold focus:outline-none focus:ring-2 focus:ring-[#0F2E23]"
          />
        </div>

        <div className="space-y-2">
          <label className="block font-extrabold">Portion Size per Serving (Grams)</label>
          <select
            value={portionGrams}
            onChange={(e) => setPortionGrams(parseInt(e.target.value))}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E1D3] bg-[#FAF7F2] font-bold focus:outline-none focus:ring-2 focus:ring-[#0F2E23]"
          >
            <option value={150}>150 g (Light Portion / Curry)</option>
            <option value={200}>200 g (Standard Main Course)</option>
            <option value={250}>250 g (Heavy Portion / Banquet)</option>
            <option value={300}>300 g (Half Bird Portion)</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block font-extrabold">Preferred Bird Sizing</label>
          <select
            value={birdCategory}
            onChange={(e) => setBirdCategory(e.target.value as "small" | "medium" | "large")}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E1D3] bg-[#FAF7F2] font-bold focus:outline-none focus:ring-2 focus:ring-[#0F2E23]"
          >
            <option value="small">Small (800g – 1.0kg)</option>
            <option value="medium">Medium (1.0kg – 1.4kg)</option>
            <option value="large">Large (1.4kg – 1.8kg)</option>
          </select>
        </div>
      </div>

      {/* Output Results Display */}
      <div className="bg-[#FAF7F2] rounded-2xl p-6 border border-[#E8E1D3] space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="bg-white p-5 rounded-xl border border-[#E8E1D3] shadow-sm space-y-1">
            <span className="text-[10px] font-bold text-[#4F5E57] uppercase tracking-wider block">
              Estimated Raw Quantity
            </span>
            <span className="text-2xl font-black text-[#0F2E23]">{rawKgNeeded} KG</span>
            <span className="text-[10px] text-[#4F5E57] block">Total meat volume required</span>
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#C59B27] shadow-sm space-y-1 relative">
            <span className="text-[10px] font-bold text-[#C59B27] uppercase tracking-wider block">
              Estimated Bird Count
            </span>
            <span className="text-3xl font-black text-[#0F2E23]">{estimatedBirds} Birds</span>
            <span className="text-[10px] text-[#4F5E57] block">Based on {selectedSpec.label}</span>
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#E8E1D3] shadow-sm space-y-1">
            <span className="text-[10px] font-bold text-[#4F5E57] uppercase tracking-wider block">
              Recommended Category
            </span>
            <span className="text-lg font-extrabold text-[#0F2E23]">{selectedSpec.label}</span>
            <span className="text-[10px] text-emerald-700 font-bold block">Available Sourcing Category</span>
          </div>
        </div>

        <div className="flex items-start gap-2 text-[11px] text-[#4F5E57] bg-white p-3.5 rounded-xl border border-[#E8E1D3]">
          <Info className="w-4 h-4 text-[#C59B27] flex-shrink-0 mt-0.5" />
          <p>
            * Calculation based on standard dressed meat yield assumptions (~70% dressed yield from live weight). Actual bird counts may vary based on exact receiving dock weighment and portioning specifications.
          </p>
        </div>
      </div>

      {/* CTA Footer */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-xs text-[#4F5E57]">
          Ready to submit your calculated requirement for pricing?
        </span>
        <Link
          href="/request-pricing"
          className="w-full sm:w-auto bg-[#0F2E23] hover:bg-[#184636] text-[#FAF7F2] font-extrabold text-xs px-7 py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 group"
        >
          Submit Requirement for Pricing
          <ArrowRight className="w-4 h-4 text-[#C59B27] group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
