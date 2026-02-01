'use client';

import React, { useState } from 'react';
import { Save, Plus, Trash2, Image as ImageIcon, FileText, Search, Settings, DollarSign, Check, X, Loader2, Eye, Upload } from 'lucide-react';
import PricingCalculatorModal, { GeneratedVariant, DEFAULT_MATERIALS } from './PricingCalculatorModal'; // Ensure correct import path

// Types aligned with Sanity
interface ProductData {
    title: string;
    slug: string;
    category: string;
    shortDescription: string;
    longDescription: string;
    // Config
    selectedMaterials: string[];
    selectedShapes: string[];
    selectedCutTypes: string[];
    // Pricing
    basePrice: number;
    variants: GeneratedVariant[];
    // Media
    featuredImage: { id: string, url: string } | null;
    galleryImages: { id: string, url: string }[];
    // SEO
    metaTitle: string;
    metaDescription: string;
    keywords: string;
}

const AVAILABLE_SHAPES = ['Die Cut', 'Circle', 'Square', 'Custom', 'Rectangle', 'Rounded Corners'];
const CUT_TYPES = ['Individual (Details Cut)', 'Sheets (Kiss Cut)'];

// Helper to auto-generate slug
const generateSlug = (text: string) => text.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');

export default function ProductEditor() {
    // STATE
    const [data, setData] = useState<ProductData>({
        title: '',
        slug: '',
        category: 'Stickers',
        shortDescription: '',
        longDescription: '',
        selectedMaterials: ['gloss_250'], // Default
        selectedShapes: ['custom'],
        selectedCutTypes: ['individual'],
        basePrice: 99,
        variants: [],
        featuredImage: null,
        galleryImages: [],
        metaTitle: '',
        metaDescription: '',
        keywords: ''
    });

    const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);

    // HANDLERS
    const handleAddVariant = (variant: GeneratedVariant) => {
        setData(prev => ({
            ...prev,
            variants: [...prev.variants, variant]
        }));
    };

    const handleRemoveVariant = (id: string) => {
        setData(prev => ({
            ...prev,
            variants: prev.variants.filter(v => v.id !== id)
        }));
    };

    const toggleArraySelection = (field: 'selectedMaterials' | 'selectedShapes' | 'selectedCutTypes', value: string) => {
        setData(prev => {
            const list = prev[field];
            if (list.includes(value)) {
                return { ...prev, [field]: list.filter(item => item !== value) };
            } else {
                return { ...prev, [field]: [...list, value] };
            }
        });
    };

    const handleImageUpload = async (file: File, type: 'featured' | 'gallery') => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            // Re-use existing upload route
            const res = await fetch('/api/admin/upload-sanity-image', { method: 'POST', body: formData });
            const result = await res.json();

            if (result.success) {
                if (type === 'featured') {
                    setData(prev => ({ ...prev, featuredImage: { id: result.assetId, url: result.url } }));
                } else {
                    setData(prev => ({ ...prev, galleryImages: [...prev.galleryImages, { id: result.assetId, url: result.url }] }));
                }
            } else {
                alert('Upload Failed: ' + result.error);
            }
        } catch (e) {
            alert('Upload Error');
        }
    };

    const handlePublish = async () => {
        if (!data.title) return alert("Title is required");
        if (data.variants.length === 0) return alert("Please add at least one Size Variant");

        setIsPublishing(true);
        try {
            // Transform for API
            const payload = {
                config: { name: data.title, category: data.category, basePrice: data.basePrice }, // Base config wrapper
                // Flattened fields for API
                title: data.title,
                slug: data.slug || generateSlug(data.title),
                category: data.category,
                shortDescription: data.shortDescription,
                longDescription: data.longDescription,

                availableMaterials: data.selectedMaterials,
                availableShapes: data.selectedShapes.map(s => s.toLowerCase().replace(' ', '-')), // slugify shapes
                availableCutTypes: data.selectedCutTypes.map(c => c.split(' ')[0].toLowerCase()), // 'Individual' -> 'individual'

                variants: data.variants,

                featuredImageAssetId: data.featuredImage?.id,
                galleryAssetIds: data.galleryImages.map(img => img.id),

                seo: {
                    title: data.metaTitle || data.title,
                    description: data.metaDescription || data.shortDescription,
                    keywords: data.keywords.split(',').map(k => k.trim())
                }
            };

            const res = await fetch('/api/admin/create-product', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await res.json();
            if (result.success) {
                setLastSaved(new Date());
                alert("Published Successfully! 🚀");
                // Optional: Redirect or Reset
            } else {
                alert("Error: " + result.error);
            }
        } catch (e) {
            alert(e);
        } finally {
            setIsPublishing(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 pb-20">
            {/* Modal */}
            <PricingCalculatorModal
                isOpen={isCalculatorOpen}
                onClose={() => setIsCalculatorOpen(false)}
                onSave={handleAddVariant}
            />

            {/* HEADER */}
            <header className="sticky top-0 bg-white border-b px-8 py-4 flex justify-between items-center z-10 shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{data.title || 'Untitled Product'}</h1>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                        <span className={`px-2 py-0.5 rounded-full ${lastSaved ? 'bg-green-100 text-green-700' : 'bg-gray-100'}`}>
                            {lastSaved ? 'Published' : 'Draft'}
                        </span>
                        {lastSaved && <span>Last saved at {lastSaved.toLocaleTimeString()}</span>}
                    </div>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-white border rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2">
                        <Eye size={16} /> Preview
                    </button>
                    <button
                        onClick={handlePublish}
                        disabled={isPublishing}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
                    >
                        {isPublishing ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                        {isPublishing ? 'Publishing...' : 'Update Product'}
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* --- LEFT COLUMN (Content) --- */}
                <div className="lg:col-span-2 space-y-8">

                    {/* 1. GENERAL INFO */}
                    <section className="bg-white rounded-xl border shadow-sm p-6 space-y-6">
                        <h2 className="text-lg font-bold flex items-center gap-2 text-gray-800"><FileText className="text-blue-500" size={20} /> General Information</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Product Title</label>
                                <input
                                    className="w-full border p-3 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-100 outline-none"
                                    placeholder="e.g. Die Cut Stickers"
                                    value={data.title}
                                    onChange={e => setData({ ...data, title: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">URL Slug</label>
                                    <div className="flex">
                                        <span className="bg-gray-100 border border-r-0 rounded-l p-2 text-gray-500 text-sm">/products/</span>
                                        <input
                                            className="w-full border p-2 rounded-r text-sm text-gray-600"
                                            value={data.slug || generateSlug(data.title)} // Auto-preview or manual
                                            onChange={e => setData({ ...data, slug: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Category</label>
                                    <select
                                        className="w-full border p-2 rounded text-sm bg-white"
                                        value={data.category}
                                        onChange={e => setData({ ...data, category: e.target.value })}
                                    >
                                        <option>Stickers</option>
                                        <option>Labels</option>
                                        <option>Cards</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                                <textarea
                                    className="w-full border p-3 rounded-lg text-sm h-32 focus:ring-2 focus:ring-blue-100"
                                    placeholder="Product description..."
                                    value={data.longDescription}
                                    onChange={e => setData({ ...data, longDescription: e.target.value })}
                                ></textarea>
                            </div>
                        </div>
                    </section>

                    {/* 2. CONFIGURATION */}
                    <section className="bg-white rounded-xl border shadow-sm p-6 space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-bold flex items-center gap-2 text-gray-800"><Settings className="text-blue-500" size={20} /> Configuration Options</h2>
                            <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded font-medium">Synced with Sanity</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Materials */}
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase mb-3 block">Available Materials</label>
                                <div className="space-y-2">
                                    {DEFAULT_MATERIALS.map(mat => {
                                        const isSelected = data.selectedMaterials.includes(mat.id);
                                        return (
                                            <div
                                                key={mat.id}
                                                onClick={() => toggleArraySelection('selectedMaterials', mat.id)}
                                                className={`flex items-center gap-3 p-2 rounded border cursor-pointer transition-all ${isSelected ? 'border-blue-500 bg-blue-50/50' : 'border-gray-100 hover:border-gray-200'}`}
                                            >
                                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}`}>
                                                    {isSelected && <Check size={10} className="text-white" />}
                                                </div>
                                                <span className={`text-sm ${isSelected ? 'font-bold text-blue-900' : 'text-gray-600'}`}>{mat.name}</span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Shapes & Cuts */}
                            <div className="space-y-6">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase mb-3 block">Available Shapes</label>
                                    <div className="flex flex-wrap gap-2">
                                        {AVAILABLE_SHAPES.map(shape => (
                                            <button
                                                key={shape}
                                                onClick={() => toggleArraySelection('selectedShapes', shape)}
                                                className={`px-3 py-1 text-xs rounded-full border ${data.selectedShapes.includes(shape) ? 'bg-blue-600 text-white border-blue-600 font-bold' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                                            >
                                                {shape}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase mb-3 block">Cut Types</label>
                                    <div className="flex flex-col gap-2">
                                        {CUT_TYPES.map(type => (
                                            <label key={type} className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={data.selectedCutTypes.includes(type)}
                                                    onChange={() => toggleArraySelection('selectedCutTypes', type)}
                                                    className="w-4 h-4 text-blue-600 rounded"
                                                />
                                                <span className="text-sm text-gray-700">{type}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 3. PRICING */}
                    <section className="bg-white rounded-xl border shadow-sm p-6 space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-bold flex items-center gap-2 text-gray-800"><DollarSign className="text-green-600" size={20} /> Pricing & Variants</h2>
                        </div>

                        {/* Base Price */}
                        <div className="bg-gray-50 p-4 rounded-lg flex items-center gap-4">
                            <div className="flex-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">Base Price (Starting At)</label>
                                <div className="flex items-center mt-1">
                                    <span className="text-gray-400 text-lg mr-2">₹</span>
                                    <input
                                        type="number"
                                        className="bg-white border p-2 rounded font-bold w-32"
                                        value={data.basePrice}
                                        onChange={e => setData({ ...data, basePrice: Number(e.target.value) })}
                                    />
                                </div>
                            </div>
                            <div className="text-xs text-gray-400 max-w-xs">
                                This is the "From" price displayed on the product card. Actual prices are determined by variants.
                            </div>
                        </div>

                        {/* Variants List */}
                        <div>
                            <div className="flex justify-between items-end mb-4">
                                <label className="text-xs font-bold text-gray-500 uppercase">Size Variants ({data.variants.length})</label>
                            </div>

                            <div className="space-y-3">
                                {data.variants.map((v) => (
                                    <div key={v.id} className="flex items-center justify-between p-3 border rounded-lg hover:border-blue-300 transition-colors bg-white">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center font-bold text-xs text-gray-500">
                                                {v.name.split('')[0]}
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-800 text-sm">{v.name}</div>
                                                <div className="text-xs text-gray-400">Starts at ₹{v.tiers[0]?.price}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded font-mono">
                                                {v.tiers.length} Tiers
                                            </div>
                                            <button onClick={() => handleRemoveVariant(v.id)} className="text-gray-300 hover:text-red-500">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                <button
                                    onClick={() => setIsCalculatorOpen(true)}
                                    className="w-full py-4 border-2 border-dashed border-gray-200 rounded-lg text-gray-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all font-medium flex items-center justify-center gap-2"
                                >
                                    <Plus size={18} /> Add New Variant
                                </button>
                            </div>
                        </div>
                    </section>

                </div>

                {/* --- RIGHT COLUMN (Sidebar) --- */}
                <div className="space-y-8">

                    {/* MEDIA MANAGER */}
                    <div className="bg-white rounded-xl border shadow-sm p-6 space-y-4">
                        <h2 className="text-sm font-bold flex items-center gap-2 text-gray-800"><ImageIcon size={16} /> Media Manager</h2>

                        {/* Featured */}
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Featured Image</label>
                            <div className="aspect-square bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 flex flex-col items-center justify-center relative overflow-hidden group">
                                {data.featuredImage ? (
                                    <>
                                        <img src={data.featuredImage.url} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => setData({ ...data, featuredImage: null })} className="bg-white p-2 rounded-full text-red-500 hover:bg-red-50"><Trash2 size={16} /></button>
                                        </div>
                                    </>
                                ) : (
                                    <label className="cursor-pointer flex flex-col items-center">
                                        <Upload className="text-gray-300 mb-2" size={24} />
                                        <span className="text-xs text-blue-600 font-bold">Upload</span>
                                        <input type="file" className="hidden" onChange={e => e.target.files && handleImageUpload(e.target.files[0], 'featured')} />
                                    </label>
                                )}
                            </div>
                        </div>

                        {/* Gallery */}
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Gallery</label>
                            <div className="grid grid-cols-3 gap-2">
                                {data.galleryImages.map(img => (
                                    <div key={img.id} className="aspect-square bg-gray-50 rounded border relative group overflow-hidden">
                                        <img src={img.url} className="w-full h-full object-cover" />
                                        <button
                                            onClick={() => setData({ ...data, galleryImages: data.galleryImages.filter(i => i.id !== img.id) })}
                                            className="absolute top-1 right-1 bg-white/80 p-1 rounded-full text-red-500 opacity-0 group-hover:opacity-100"
                                        >
                                            <X size={10} />
                                        </button>
                                    </div>
                                ))}
                                <label className="aspect-square bg-gray-50 rounded border-2 border-dashed border-gray-200 flex items-center justify-center cursor-pointer hover:bg-blue-50 hover:border-blue-200">
                                    <Plus className="text-gray-400" size={16} />
                                    <input type="file" className="hidden" onChange={e => e.target.files && handleImageUpload(e.target.files[0], 'gallery')} />
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* SEO SECTION */}
                    <div className="bg-white rounded-xl border shadow-sm p-6 space-y-4">
                        <h2 className="text-sm font-bold flex items-center gap-2 text-gray-800"><Search size={16} /> SEO & Metadata</h2>

                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Meta Title</label>
                                <input
                                    className="w-full border p-2 rounded text-sm"
                                    placeholder="Title tag"
                                    value={data.metaTitle}
                                    onChange={e => setData({ ...data, metaTitle: e.target.value })}
                                />
                                <div className="h-1 bg-gray-100 mt-1 rounded overflow-hidden">
                                    <div className={`h-full ${data.metaTitle.length > 60 ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${Math.min(100, (data.metaTitle.length / 60) * 100)}%` }}></div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Meta Description</label>
                                <textarea
                                    className="w-full border p-2 rounded text-sm h-20"
                                    placeholder="Description tag..."
                                    value={data.metaDescription}
                                    onChange={e => setData({ ...data, metaDescription: e.target.value })}
                                ></textarea>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Keywords</label>
                                <input
                                    className="w-full border p-2 rounded text-sm"
                                    placeholder="sticker, print, custom"
                                    value={data.keywords}
                                    onChange={e => setData({ ...data, keywords: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                </div>

            </main>
        </div>
    );
}
