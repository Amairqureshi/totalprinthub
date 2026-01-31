'use client';

import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Download, RefreshCw, FolderOpen, Calculator, Layers, Wand2, Swords, Image as ImageIcon, FileText, Search, Upload, Loader2, Check } from 'lucide-react';
import { saveAs } from 'file-saver';

// Types
interface Tier {
    min: number;
    max: number;
    discount: number;
    competitorPrice?: number; // User input: What the competitor charges
}

interface ItemOption {
    name: string;
    id?: string;
    multiplier: number;
}

interface ProductConfig {
    name: string;
    category: string;
    baseRate: number;
    setupFee: number;
    packagingCost: number;
    gstRate: number;
    markup: number;
    // New Undercut Strategy
    undercutAmount: number;
}

interface SizeVariant {
    id: string;
    name: string;
    width: number;
    height: number;
    tiers: { min: number; max: number; price: number }[];
}

interface SavedTemplate {
    id: string;
    name: string;
    config: ProductConfig;
    materialName: string;
    finishName: string;
}

const DEFAULT_TIERS: Tier[] = [
    { min: 1, max: 49, discount: 0 },
    { min: 50, max: 99, discount: 10 },
    { min: 100, max: 249, discount: 20 },
    { min: 250, max: 499, discount: 30 },
    { min: 500, max: 999, discount: 40 },
    { min: 1000, max: 10000, discount: 50 },
];

const DEFAULT_MATERIALS: (ItemOption & { id: string })[] = [
    { name: 'Standard (Art Paper)', id: 'gloss_250', multiplier: 1.0 },
    { name: 'Matte (Art Paper)', id: 'matt_270', multiplier: 1.1 },
    { name: 'Heavy Matte', id: 'matt_350', multiplier: 1.2 },
    { name: 'Velvet Touch', id: 'velvet_370', multiplier: 1.5 },
    { name: 'Classic Ivory', id: 'ivory_370', multiplier: 1.5 },
    { name: 'Ultra Thick', id: 'thick_450', multiplier: 1.8 },
    { name: 'Non-Tearable (Synthetic)', id: 'non_tearable', multiplier: 2.0 },
    // Custom mappings for admin specific ones
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

const STANDARD_SIZES = [1, 2, 3, 4, 5];

export default function PricingCalculator() {
    // GLOBAL CONFIG
    const [config, setConfig] = useState<ProductConfig>({
        name: 'New Product',
        category: 'Stickers',
        baseRate: 0.5,
        setupFee: 50,
        packagingCost: 5,
        gstRate: 18,
        markup: 40,
        undercutAmount: 5, // Default beat by 5 rupees
    });

    const [selectedMaterial, setSelectedMaterial] = useState<ItemOption>(DEFAULT_MATERIALS[0]);
    const [selectedFinish, setSelectedFinish] = useState<ItemOption>(DEFAULT_FINISHES[0]);

    // CURRENT VARIANT
    const [currentWidth, setCurrentWidth] = useState(3);
    const [currentHeight, setCurrentHeight] = useState(3);
    const [tiers, setTiers] = useState<Tier[]>(DEFAULT_TIERS);

    const [maxAutoResize, setMaxAutoResize] = useState(5);
    const [variants, setVariants] = useState<SizeVariant[]>([]);
    const [showPreview, setShowPreview] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);

    // EXTENDED PRODUCT DATA
    const [activeTab, setActiveTab] = useState<'pricing' | 'details' | 'media' | 'seo'>('pricing');
    const [productDetails, setProductDetails] = useState({
        shortDesc: '',
        longDesc: '',
        metaTitle: '',
        metaDesc: '',
        keywords: ''
    });
    const [featuredImageAssetId, setFeaturedImageAssetId] = useState<string | null>(null);
    const [featuredImageUrl, setFeaturedImageUrl] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    // Templates
    const [savedTemplates, setSavedTemplates] = useState<SavedTemplate[]>([]);
    const [showTemplates, setShowTemplates] = useState(false);

    useEffect(() => {
        const loaded = localStorage.getItem('pricing_templates_v2');
        if (loaded) try { setSavedTemplates(JSON.parse(loaded)); } catch (e) { }
    }, []);

    // ------------------------------------------------------------------
    // CORE CALCULATION LOGIC
    // ------------------------------------------------------------------
    const calculateRow = (tier: Tier, w: number, h: number) => {
        const area = w * h;
        const totalMultiplier = selectedMaterial.multiplier * selectedFinish.multiplier;

        // Base Cost Calculation
        const baseMfgCost = (area * config.baseRate * totalMultiplier);
        const amortizedSetup = config.setupFee / tier.min;
        const totalBaseCostPerUnit = baseMfgCost + config.packagingCost + amortizedSetup;

        // --- PRICING STRATEGY ---
        let effectiveFinalPrice = 0;
        let effectiveProfit = 0;
        let calculatedMarkup = 0;

        if (tier.competitorPrice && tier.competitorPrice > 0) {
            // STRATEGY: COMPETITOR UNDERCUT
            // Formula: FinalPrice = CompetitorPrice - UndercutAmount
            effectiveFinalPrice = Math.max(0, tier.competitorPrice - config.undercutAmount);

            // Back-calculate Profit
            const preTaxPrice = effectiveFinalPrice / (1 + (config.gstRate / 100));
            effectiveProfit = preTaxPrice - totalBaseCostPerUnit;

        } else {
            // STRATEGY: COST PLUS (Legacy)
            const priceWithGlobalMarkup = totalBaseCostPerUnit * (1 + (config.markup / 100));
            const discountedPreTax = priceWithGlobalMarkup * (1 - (tier.discount / 100));
            effectiveFinalPrice = discountedPreTax * (1 + (config.gstRate / 100));
            effectiveProfit = discountedPreTax - totalBaseCostPerUnit;
        }

        if (totalBaseCostPerUnit > 0) {
            calculatedMarkup = (effectiveProfit / totalBaseCostPerUnit) * 100;
        }

        return {
            ...tier,
            baseCost: totalBaseCostPerUnit,
            finalPrice: parseFloat(effectiveFinalPrice.toFixed(2)),
            profit: parseFloat(effectiveProfit.toFixed(2)),
            effectiveMarkup: parseFloat(calculatedMarkup.toFixed(1))
        };
    };

    // Derived State
    const manualCalculations = tiers.map(t => calculateRow(t, currentWidth, currentHeight));

    // ------------------------------------------------------------------
    // ACTIONS
    // ------------------------------------------------------------------
    const updateCompetitorPrice = (index: number, price: string) => {
        const val = parseFloat(price);
        const newTiers = [...tiers];
        newTiers[index].competitorPrice = isNaN(val) ? 0 : val;
        setTiers(newTiers);
    };

    const addVariant = () => {
        const name = `${currentWidth}x${currentHeight} inch`;
        if (variants.some(v => v.name === name)) return alert("Exists");

        const newVariant: SizeVariant = {
            id: Date.now().toString(),
            name,
            width: currentWidth,
            height: currentHeight,
            tiers: manualCalculations.map(c => ({ min: c.min, max: c.max, price: c.finalPrice }))
        };
        setVariants([...variants, newVariant]);
    };

    const autoGenerateSizes = () => {
        if (!confirm(`Generate 1" to ${maxAutoResize}"?`)) return;
        const newVars: SizeVariant[] = [];
        for (let s = 1; s <= maxAutoResize; s++) {
            const name = `${s}x${s} inch`;
            if (variants.some(v => v.name === name)) continue;
            const rows = tiers.map(t => calculateRow(t, s, s));
            newVars.push({
                id: Date.now().toString() + Math.random(),
                name, width: s, height: s,
                tiers: rows.map(c => ({ min: c.min, max: c.max, price: c.finalPrice }))
            });
        }
        setVariants([...variants, ...newVars]);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);

            const res = await fetch('/api/admin/upload-sanity-image', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();

            if (data.success) {
                setFeaturedImageAssetId(data.assetId);
                setFeaturedImageUrl(data.url);
            } else {
                alert('Upload failed: ' + data.error);
            }
        } catch (err) {
            console.error(err);
            alert('Upload error');
        } finally {
            setIsUploading(false);
        }
    };

    const handlePublish = async () => {
        if (variants.length === 0) {
            alert("No variants added! Please generate sizes first.");
            return;
        }

        setIsPublishing(true);
        try {
            const finalPayload = {
                config,
                selectedMaterial,
                selectedFinish,
                variants,
                // New Fields
                shortDescription: productDetails.shortDesc,
                longDescription: productDetails.longDesc,
                seo: {
                    title: productDetails.metaTitle,
                    description: productDetails.metaDesc,
                    keywords: productDetails.keywords.split(',').map(k => k.trim())
                },
                featuredImageAssetId
            };

            const res = await fetch('/api/admin/create-product', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(finalPayload)
            });

            const data = await res.json();
            if (data.success) {
                alert("Published to Sanity! 🎉");
                setVariants([]);
                setShowPreview(false);
            } else {
                alert("Error: " + data.error);
            }
        } catch (e) { alert(e); }
        finally { setIsPublishing(false); }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-100px)] gap-4">

            {/* TOP NAVIGATION TABS */}
            <div className="bg-white border text-sm mt-3 px-1 rounded-xl flex items-center shadow-sm w-fit self-center">
                <button onClick={() => setActiveTab('pricing')} className={`px-4 py-2 flex items-center gap-2 font-bold ${activeTab === 'pricing' ? 'text-blue-600 bg-blue-50' : 'text-gray-500 hover:text-gray-800'}`}>
                    <Calculator size={16} /> Pricing
                </button>
                <div className="h-4 w-px bg-gray-200"></div>
                <button onClick={() => setActiveTab('details')} className={`px-4 py-2 flex items-center gap-2 font-bold ${activeTab === 'details' ? 'text-blue-600 bg-blue-50' : 'text-gray-500 hover:text-gray-800'}`}>
                    <FileText size={16} /> Details
                </button>
                <div className="h-4 w-px bg-gray-200"></div>
                <button onClick={() => setActiveTab('media')} className={`px-4 py-2 flex items-center gap-2 font-bold ${activeTab === 'media' ? 'text-blue-600 bg-blue-50' : 'text-gray-500 hover:text-gray-800'}`}>
                    <ImageIcon size={16} /> Media
                </button>
                <div className="h-4 w-px bg-gray-200"></div>
                <button onClick={() => setActiveTab('seo')} className={`px-4 py-2 flex items-center gap-2 font-bold ${activeTab === 'seo' ? 'text-blue-600 bg-blue-50' : 'text-gray-500 hover:text-gray-800'}`}>
                    <Search size={16} /> SEO
                </button>
            </div>

            {/* TAB CONTENT */}

            {/* === PRICING TAB === */}
            <div className={`flex flex-col lg:flex-row gap-4 h-full ${activeTab === 'pricing' ? 'block' : 'hidden'}`}>
                {/* 1. CONFIG SIDEBAR */}
                <div className="w-full lg:w-72 bg-white border rounded-lg p-3 overflow-y-auto space-y-4">
                    <h2 className="font-bold flex items-center gap-2 text-gray-700"><RefreshCw size={16} /> Settings</h2>

                    <input className="w-full border p-2 font-bold rounded" value={config.name} onChange={e => setConfig({ ...config, name: e.target.value })} placeholder="Product Name" />

                    <div className="p-3 bg-red-50 border border-red-100 rounded-lg space-y-2">
                        <div className="flex items-center gap-2 text-red-800 font-bold text-xs uppercase">
                            <Swords size={14} /> Competitor Strategy
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs">Beat by ₹</span>
                            <input type="number" className="w-16 border rounded p-1 font-bold text-red-600" value={config.undercutAmount} onChange={e => setConfig({ ...config, undercutAmount: parseFloat(e.target.value) || 0 })} />
                        </div>
                        <p className="text-[10px] text-gray-500 leading-tight">We will automatically price your product ₹{config.undercutAmount} CHEAPER than the competitor price you enter.</p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">Material & Finish</label>
                        <select className="w-full border p-1 text-sm rounded" value={selectedMaterial.name} onChange={e => setSelectedMaterial(DEFAULT_MATERIALS.find(m => m.name === e.target.value)!)}>
                            {DEFAULT_MATERIALS.map(m => <option key={m.name} value={m.name}>{m.name}</option>)}
                        </select>
                        <select className="w-full border p-1 text-sm rounded" value={selectedFinish.name} onChange={e => setSelectedFinish(DEFAULT_FINISHES.find(m => m.name === e.target.value)!)}>
                            {DEFAULT_FINISHES.map(f => <option key={f.name} value={f.name}>{f.name}</option>)}
                        </select>
                    </div>
                    {/* Category Input */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">Category</label>
                        <input className="w-full border p-2 text-sm rounded" value={config.category} onChange={e => setConfig({ ...config, category: e.target.value })} placeholder="Stickers" />
                    </div>
                </div>

                {/* 2. MAIN AREA */}
                <div className="flex-1 bg-white border rounded-lg flex flex-col">
                    <div className="p-3 border-b bg-gray-50 flex justify-between items-center">
                        <h2 className="font-bold text-blue-700 flex items-center gap-2"><Calculator size={16} /> Pricing Engine</h2>
                        <div className="flex gap-2">
                            <button onClick={autoGenerateSizes} className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-xs font-bold"><Wand2 size={12} /> Auto Gen</button>
                        </div>
                    </div>

                    <div className="p-4 flex flex-col gap-4 overflow-y-auto">
                        <div className="flex gap-2 items-end">
                            <div className="bg-gray-100 p-2 rounded">
                                <label className="text-xs block font-bold text-gray-500">Width</label>
                                <input type="number" className="w-12 p-1 text-center font-bold text-lg bg-transparent" value={currentWidth} onChange={e => setCurrentWidth(parseFloat(e.target.value) || 0)} />
                            </div>
                            <span className="mb-4 text-gray-300">×</span>
                            <div className="bg-gray-100 p-2 rounded">
                                <label className="text-xs block font-bold text-gray-500">Height</label>
                                <input type="number" className="w-12 p-1 text-center font-bold text-lg bg-transparent" value={currentHeight} onChange={e => setCurrentHeight(parseFloat(e.target.value) || 0)} />
                            </div>
                            <div className="flex-1"></div>
                            <button onClick={addVariant} className="bg-black text-white px-4 py-2 rounded font-bold shadow flex items-center gap-2"><Plus size={16} /> Add {currentWidth}x{currentHeight}"</button>
                        </div>

                        <table className="w-full text-sm text-left border rounded-lg overflow-hidden">
                            <thead className="bg-gray-100 text-gray-600 text-xs uppercase font-bold">
                                <tr>
                                    <th className="p-3">Quantity</th>
                                    <th className="p-3 text-red-600 bg-red-50 border-x border-red-100 w-40">Competitor Price (₹)</th>
                                    <th className="p-3 text-green-700 bg-green-50 w-40">Your Price (₹)</th>
                                    <th className="p-3 text-gray-400">Your Profit</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y text-xs">
                                {manualCalculations.map((row, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-3 font-medium text-gray-700">{row.min} - {row.max} units</td>
                                        <td className="p-3 bg-red-50/30 border-x border-red-100">
                                            <div className="relative">
                                                <span className="absolute left-2 top-1.5 text-red-300">₹</span>
                                                <input
                                                    type="number"
                                                    placeholder="Enter Price"
                                                    className="w-full border-2 border-red-100 rounded pl-5 py-1 text-red-700 font-bold focus:border-red-500 focus:outline-none bg-white"
                                                    value={tiers[idx].competitorPrice || ''}
                                                    onChange={(e) => updateCompetitorPrice(idx, e.target.value)}
                                                />
                                            </div>
                                        </td>
                                        <td className="p-3 bg-green-50/30">
                                            <div className="flex items-center gap-2">
                                                <span className="text-lg font-bold text-green-700">₹{row.finalPrice}</span>
                                                {row.competitorPrice ? <span className="text-[10px] text-green-600 bg-green-100 px-1 rounded">-₹{config.undercutAmount}</span> : null}
                                            </div>
                                        </td>
                                        <td className="p-3 text-gray-400">
                                            {row.profit > 0 ? <span className="text-green-600">₹{row.profit} ✅</span> : <span className="text-red-400">Loss</span>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* 3. LIST */}
                <div className="w-full lg:w-56 bg-white border rounded-lg flex flex-col">
                    <div className="p-3 border-b flex justify-between items-center bg-gray-50">
                        <h3 className="font-bold text-xs uppercase">Ready to Publish</h3>
                        <button onClick={() => setShowPreview(true)} disabled={variants.length === 0} className="text-xs bg-green-600 text-white px-3 py-1 rounded font-bold hover:bg-green-700">Preview</button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-2 bg-gray-50">
                        {variants.length === 0 && <p className="text-xs text-gray-400 text-center mt-10">No variants added</p>}
                        {variants.map(v => (
                            <div key={v.id} className="bg-white border p-2 rounded shadow-sm text-xs relative group">
                                <div className="font-bold mb-1">{v.name}</div>
                                <div className="text-gray-500">Starts ₹{v.tiers[0].price}</div>
                                <button onClick={() => setVariants(variants.filter(x => x.id !== v.id))} className="absolute top-1 right-1 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100">×</button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* === DETAILS TAB === */}
            <div className={`flex justify-center h-full ${activeTab === 'details' ? 'block' : 'hidden'}`}>
                <div className="max-w-2xl w-full bg-white border rounded-lg p-8 space-y-6">
                    <h2 className="text-xl font-bold flex items-center gap-2"><FileText /> Product Details</h2>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Short Description</label>
                        <textarea
                            className="w-full border p-3 rounded-lg text-sm h-24"
                            placeholder="Brief summary shown on cards..."
                            value={productDetails.shortDesc}
                            onChange={e => setProductDetails({ ...productDetails, shortDesc: e.target.value })}
                        ></textarea>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Long Description (Content)</label>
                        <textarea
                            className="w-full border p-3 rounded-lg text-sm h-64"
                            placeholder="Full product details..."
                            value={productDetails.longDesc}
                            onChange={e => setProductDetails({ ...productDetails, longDesc: e.target.value })}
                        ></textarea>
                    </div>
                </div>
            </div>

            {/* === MEDIA TAB === */}
            <div className={`flex justify-center h-full ${activeTab === 'media' ? 'block' : 'hidden'}`}>
                <div className="max-w-2xl w-full bg-white border rounded-lg p-8 space-y-6">
                    <h2 className="text-xl font-bold flex items-center gap-2"><ImageIcon /> Media Upload</h2>

                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors">
                        {featuredImageUrl ? (
                            <div className="relative group">
                                <img src={featuredImageUrl} className="h-64 object-contain rounded shadow-lg" />
                                <button
                                    onClick={() => { setFeaturedImageUrl(null); setFeaturedImageAssetId(null); }}
                                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Trash2 size={16} />
                                </button>
                                <div className="mt-4 flex items-center justify-center gap-2 text-green-600 font-bold">
                                    <Check size={16} /> Image Uploaded
                                </div>
                            </div>
                        ) : (
                            <>
                                {isUploading ? (
                                    <Loader2 className="h-10 w-10 text-blue-500 animate-spin mb-4" />
                                ) : (
                                    <Upload className="h-10 w-10 text-gray-300 mb-4" />
                                )}
                                <h3 className="text-lg font-bold text-gray-700">Upload Featured Image</h3>
                                <p className="text-sm text-gray-400 mb-4">JPG, PNG, WEBP supported</p>
                                <input
                                    type="file"
                                    onChange={handleImageUpload}
                                    disabled={isUploading}
                                    className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                />
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* === SEO TAB === */}
            <div className={`flex justify-center h-full ${activeTab === 'seo' ? 'block' : 'hidden'}`}>
                <div className="max-w-2xl w-full bg-white border rounded-lg p-8 space-y-6">
                    <h2 className="text-xl font-bold flex items-center gap-2"><Search /> SEO Settings</h2>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Meta Title</label>
                        <input
                            className="w-full border p-3 rounded-lg text-sm"
                            placeholder="SEO Title (60 chars)"
                            value={productDetails.metaTitle}
                            onChange={e => setProductDetails({ ...productDetails, metaTitle: e.target.value })}
                        />
                        <p className="text-xs text-gray-400 mt-1">{productDetails.metaTitle.length}/60</p>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Meta Description</label>
                        <textarea
                            className="w-full border p-3 rounded-lg text-sm h-24"
                            placeholder="SEO Description (160 chars)"
                            value={productDetails.metaDesc}
                            onChange={e => setProductDetails({ ...productDetails, metaDesc: e.target.value })}
                        ></textarea>
                        <p className="text-xs text-gray-400 mt-1">{productDetails.metaDesc.length}/160</p>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Keywords</label>
                        <input
                            className="w-full border p-3 rounded-lg text-sm"
                            placeholder="stickers, printing, custom (comma separated)"
                            value={productDetails.keywords}
                            onChange={e => setProductDetails({ ...productDetails, keywords: e.target.value })}
                        />
                    </div>
                </div>
            </div>

            {/* PREVIEW MODAL */}
            {showPreview && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded w-full max-w-lg max-h-[80vh] flex flex-col shadow-2xl">
                        <div className="p-4 border-b font-bold flex justify-between">Confirm Publish <button onClick={() => setShowPreview(false)}>×</button></div>
                        <div className="p-4 bg-gray-100 overflow-auto flex-1 text-xs font-mono">
                            {JSON.stringify({ config, productDetails, variants }, null, 2)}
                        </div>
                        <div className="p-4 border-t flex justify-end">
                            <button onClick={handlePublish} disabled={isPublishing} className="bg-green-600 text-white px-6 py-2 rounded font-bold hover:bg-green-700">{isPublishing ? '...' : 'Publish Live'}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
