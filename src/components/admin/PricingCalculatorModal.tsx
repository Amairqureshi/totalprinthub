'use client';

import React, { useState, useEffect } from 'react';
import { Calculator, Plus, Wand2, Swords, RefreshCw, X, Check } from 'lucide-react';

// Shared Types
export interface Tier {
    min: number;
    max: number;
    discount: number;
    competitorPrice?: number;
}

export interface ItemOption {
    name: string;
    id?: string;
    multiplier: number;
}

export interface GeneratedVariant {
    id: string;
    name: string;
    width: number;
    height: number;
    tiers: { min: number; max: number; price: number }[];
}

const DEFAULT_TIERS: Tier[] = [
    { min: 1, max: 49, discount: 0 },
    { min: 50, max: 99, discount: 10 },
    { min: 100, max: 249, discount: 20 },
    { min: 250, max: 499, discount: 30 },
    { min: 500, max: 999, discount: 40 },
    { min: 1000, max: 10000, discount: 50 },
];

export const DEFAULT_MATERIALS: (ItemOption & { id: string })[] = [
    { name: 'Standard (Art Paper)', id: 'gloss_250', multiplier: 1.0 },
    { name: 'Matte (Art Paper)', id: 'matt_270', multiplier: 1.1 },
    { name: 'Heavy Matte', id: 'matt_350', multiplier: 1.2 },
    { name: 'Velvet Touch', id: 'velvet_370', multiplier: 1.5 },
    { name: 'Classic Ivory', id: 'ivory_370', multiplier: 1.5 },
    { name: 'Ultra Thick', id: 'thick_450', multiplier: 1.8 },
    { name: 'Non-Tearable (Synthetic)', id: 'non_tearable', multiplier: 2.0 },
    { name: 'Transparent (Clear)', id: 'transparent', multiplier: 1.8 },
    { name: 'Holographic', id: 'holographic', multiplier: 2.5 },
];

const DEFAULT_FINISHES: (ItemOption & { id: string })[] = [
    { name: 'None / Standard', id: 'none', multiplier: 1.0 },
    { name: 'Gloss Lamination', id: 'gloss_lam', multiplier: 1.1 },
    { name: 'Matte Lamination', id: 'matte_lam', multiplier: 1.15 },
    { name: 'Soft Touch Lamination', id: 'soft_touch', multiplier: 1.3 },
    { name: 'Spot UV', id: 'spot_uv', multiplier: 1.5 },
];

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSave: (variant: GeneratedVariant) => void;
}

export default function PricingCalculatorModal({ isOpen, onClose, onSave }: Props) {
    // Config State
    const [baseRate, setBaseRate] = useState(0.5);
    const [setupFee, setSetupFee] = useState(50);
    const [packagingCost, setPackagingCost] = useState(5);
    const [markup, setMarkup] = useState(40);
    const [undercutAmount, setUndercutAmount] = useState(5);

    // Selection State
    const [selectedMaterial, setSelectedMaterial] = useState<ItemOption>(DEFAULT_MATERIALS[0]);
    const [selectedFinish, setSelectedFinish] = useState<ItemOption>(DEFAULT_FINISHES[0]);

    // Dimensions
    const [width, setWidth] = useState(3);
    const [height, setHeight] = useState(3);
    const [tiers, setTiers] = useState<Tier[]>(DEFAULT_TIERS);

    if (!isOpen) return null;

    // Calculation
    const calculateRow = (tier: Tier) => {
        const area = width * height;
        const totalMultiplier = selectedMaterial.multiplier * selectedFinish.multiplier;
        const baseMfgCost = (area * baseRate * totalMultiplier);
        const amortizedSetup = setupFee / tier.min;
        const totalBaseCostPerUnit = baseMfgCost + packagingCost + amortizedSetup;

        let finalPrice = 0;
        let profit = 0;

        if (tier.competitorPrice && tier.competitorPrice > 0) {
            finalPrice = Math.max(0, tier.competitorPrice - undercutAmount);
            const preTax = finalPrice / 1.18; // Approx GST removal
            profit = preTax - totalBaseCostPerUnit;
        } else {
            const priceWithMarkup = totalBaseCostPerUnit * (1 + (markup / 100));
            const discounted = priceWithMarkup * (1 - (tier.discount / 100));
            finalPrice = discounted * 1.18; // Add GST
            profit = discounted - totalBaseCostPerUnit;
        }

        return { ...tier, finalPrice: parseFloat(finalPrice.toFixed(2)), profit: parseFloat(profit.toFixed(2)) };
    };

    const calculatedTiers = tiers.map(t => calculateRow(t));

    const handleSave = () => {
        const variant: GeneratedVariant = {
            id: Date.now().toString(),
            name: `${width} ${height} inch`, // Format used in Sanity
            width,
            height,
            tiers: calculatedTiers.map(t => ({ min: t.min, max: t.max, price: t.finalPrice }))
        };
        onSave(variant);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl w-full max-w-4xl h-[90vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="p-4 border-b flex justify-between items-center bg-gray-50 rounded-t-xl">
                    <h2 className="text-lg font-bold flex items-center gap-2 text-gray-800">
                        <Calculator className="text-blue-600" size={20} />
                        Pricing Calculator
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors"><X size={20} /></button>
                </div>

                {/* Body */}
                <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">

                    {/* Sidebar Config */}
                    <div className="w-full lg:w-72 bg-gray-50 border-r p-4 overflow-y-auto space-y-5">
                        <div className="space-y-3">
                            <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2"><Swords size={12} /> Competitor Strategy</label>
                            <div className="bg-white p-3 rounded border shadow-sm">
                                <div className="flex justify-between items-center text-sm mb-1">
                                    <span>Beat by</span>
                                    <div className="flex items-center">
                                        <span className="text-gray-400 mr-1">₹</span>
                                        <input type="number" className="w-12 border rounded p-1 text-center font-bold text-red-600" value={undercutAmount} onChange={e => setUndercutAmount(Number(e.target.value))} />
                                    </div>
                                </div>
                                <p className="text-[10px] text-gray-400">Auto-undercut competitor prices</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-xs font-bold text-gray-500 uppercase">Simulation Material</label>
                            <select className="w-full border p-2 text-sm rounded bg-white" value={selectedMaterial.name} onChange={e => setSelectedMaterial(DEFAULT_MATERIALS.find(m => m.name === e.target.value)!)}>
                                {DEFAULT_MATERIALS.map(m => <option key={m.name} value={m.name}>{m.name}</option>)}
                            </select>
                            <p className="text-[10px] text-gray-400">Used for base cost calculation only</p>
                        </div>

                        <div className="space-y-3 border-t pt-3">
                            <label className="text-xs font-bold text-gray-500 uppercase">Internal Costs</label>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <span className="text-[10px] block">Base Rate</span>
                                    <input type="number" className="w-full border p-1 text-xs rounded" value={baseRate} onChange={e => setBaseRate(Number(e.target.value))} />
                                </div>
                                <div>
                                    <span className="text-[10px] block">Setup</span>
                                    <input type="number" className="w-full border p-1 text-xs rounded" value={setupFee} onChange={e => setSetupFee(Number(e.target.value))} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Calculator */}
                    <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-6">
                        {/* Dimensions */}
                        <div className="flex items-center gap-4 justify-center bg-gray-50 p-6 rounded-xl border border-dashed border-gray-300">
                            <div className="text-center">
                                <label className="block text-xs font-bold text-gray-500 mb-1">WIDTH</label>
                                <input type="number" className="w-20 p-2 text-center text-2xl font-bold rounded border shadow-sm" value={width} onChange={e => setWidth(Number(e.target.value))} />
                                <span className="text-xs text-gray-400">in</span>
                            </div>
                            <span className="text-2xl text-gray-300">×</span>
                            <div className="text-center">
                                <label className="block text-xs font-bold text-gray-500 mb-1">HEIGHT</label>
                                <input type="number" className="w-20 p-2 text-center text-2xl font-bold rounded border shadow-sm" value={height} onChange={e => setHeight(Number(e.target.value))} />
                                <span className="text-xs text-gray-400">in</span>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="border rounded-lg overflow-hidden shadow-sm">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-100 text-gray-600 text-xs uppercase">
                                    <tr>
                                        <th className="p-3 text-left">Quantity</th>
                                        <th className="p-3 text-left w-32">Competitor (₹)</th>
                                        <th className="p-3 text-left text-green-700">Your Price (₹)</th>
                                        <th className="p-3 text-left text-gray-400">Profit</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {calculatedTiers.map((row, idx) => (
                                        <tr key={idx} className="hover:bg-blue-50/50">
                                            <td className="p-3 font-medium">{row.min} - {row.max}</td>
                                            <td className="p-3">
                                                <input
                                                    type="number"
                                                    className="w-24 border rounded px-2 py-1 text-xs"
                                                    placeholder="-"
                                                    value={tiers[idx].competitorPrice || ''}
                                                    onChange={e => {
                                                        const newTiers = [...tiers];
                                                        newTiers[idx].competitorPrice = parseFloat(e.target.value);
                                                        setTiers(newTiers);
                                                    }}
                                                />
                                            </td>
                                            <td className="p-3 font-bold text-green-700">₹{row.finalPrice}</td>
                                            <td className="p-3 text-xs text-gray-500">₹{row.profit}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t bg-gray-50 flex justify-end gap-3 rounded-b-xl">
                    <button onClick={onClose} className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-200 rounded-lg">Cancel</button>
                    <button onClick={handleSave} className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 flex items-center gap-2 shadow-lg hover:shadow-xl transition-all">
                        <Check size={18} /> Add Variant
                    </button>
                </div>
            </div>
        </div>
    );
}
