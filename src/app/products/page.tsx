"use client";

import { useState, useEffect } from "react";
import { getAllProducts, getAllCategories } from "@/lib/sanity/queries";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductSkeleton } from "@/components/product/ProductSkeleton";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {
    SlidersHorizontal,
    X,
    LayoutGrid,
    List,
    Search,
    ChevronDown
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface Product {
    _id: string;
    title: string;
    slug: { current: string };
    category: { title: string; slug: { current: string } };
    featuredImage: any;
    basePrice: number;
    shortDescription: string;
}

interface Category {
    _id: string;
    title: string;
    slug: { current: string };
    productCount: number;
}

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // View State
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [showFilters, setShowFilters] = useState(false);

    // Filter states
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [priceRange, setPriceRange] = useState<number[]>([0, 10000]);
    const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
    const [sortBy, setSortBy] = useState("popular");

    // Load data
    useEffect(() => {
        async function loadData() {
            setIsLoading(true);
            const [productsData, categoriesData] = await Promise.all([
                getAllProducts(),
                getAllCategories()
            ]);
            setProducts(productsData);
            setCategories(categoriesData);
            setFilteredProducts(productsData);
            setIsLoading(false);
        }
        loadData();
    }, []);

    // Apply filters
    useEffect(() => {
        let filtered = [...products];

        // Search Query
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            filtered = filtered.filter(p =>
                p.title.toLowerCase().includes(q) ||
                p.shortDescription?.toLowerCase().includes(q)
            );
        }

        // Category filter
        if (selectedCategories.length > 0) {
            filtered = filtered.filter(p =>
                selectedCategories.includes(p.category.slug.current)
            );
        }

        // Price filter
        filtered = filtered.filter(p =>
            p.basePrice >= priceRange[0] && p.basePrice <= priceRange[1]
        );

        // Sort
        switch (sortBy) {
            case "price-low":
                filtered.sort((a, b) => a.basePrice - b.basePrice);
                break;
            case "price-high":
                filtered.sort((a, b) => b.basePrice - a.basePrice);
                break;
            case "name":
                filtered.sort((a, b) => a.title.localeCompare(b.title));
                break;
        }

        setFilteredProducts(filtered);
    }, [products, searchQuery, selectedCategories, priceRange, sortBy]);

    const toggleCategory = (slug: string) => {
        setSelectedCategories(prev =>
            prev.includes(slug)
                ? prev.filter(c => c !== slug)
                : [...prev, slug]
        );
    };

    const clearFilters = () => {
        setSearchQuery("");
        setSelectedCategories([]);
        setPriceRange([0, 10000]);
        setSelectedMaterials([]);
        setSortBy("popular");
    };

    const activeFilterCount = selectedCategories.length + selectedMaterials.length +
        (priceRange[0] !== 0 || priceRange[1] !== 10000 ? 1 : 0) + (searchQuery ? 1 : 0);

    return (
        <div className="min-h-screen bg-gray-50/50">
            {/* Hero Section */}
            <div className="bg-white border-b border-gray-200 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.03]"></div>
                <div className="container mx-auto px-4 py-8 relative">
                    <Breadcrumbs items={[{ label: "Products", href: "/products" }]} />

                    <div className="mt-8 mb-4">
                        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-3">
                            All Products
                        </h1>
                        <p className="text-gray-600 max-w-2xl text-lg">
                            Discover premium printing solutions for your business. From business cards to marketing materials, we've got you covered.
                        </p>
                    </div>

                    {/* Mobile Filter Toggle */}
                    <div className="mt-6 md:hidden">
                        <Button
                            variant="outline"
                            onClick={() => setShowFilters(!showFilters)}
                            className="w-full flex items-center justify-between"
                        >
                            <span className="flex items-center">
                                <SlidersHorizontal className="h-4 w-4 mr-2" />
                                Filters
                            </span>
                            {activeFilterCount > 0 && (
                                <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full">
                                    {activeFilterCount}
                                </span>
                            )}
                        </Button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filters Sidebar */}
                    <aside className={`lg:w-72 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                        <div className="sticky top-24 space-y-6">

                            {/* Search Box - Sidebar */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Search products..."
                                    className="pl-9 bg-white"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                                    <h2 className="font-semibold text-gray-900">Filters</h2>
                                    {activeFilterCount > 0 && (
                                        <button
                                            onClick={clearFilters}
                                            className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                                        >
                                            Reset All
                                        </button>
                                    )}
                                </div>

                                <Accordion type="multiple" defaultValue={["categories", "price"]} className="px-4">
                                    {/* Categories */}
                                    <AccordionItem value="categories" className="border-b-0">
                                        <AccordionTrigger className="text-sm font-semibold hover:no-underline py-3">
                                            Categories
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            <div className="space-y-2 pb-2">
                                                {isLoading ? (
                                                    // Loading state for categories
                                                    Array(5).fill(0).map((_, i) => (
                                                        <div key={i} className="flex gap-2">
                                                            <div className="h-4 w-4 bg-gray-100 rounded" />
                                                            <div className="h-4 w-2/3 bg-gray-100 rounded" />
                                                        </div>
                                                    ))
                                                ) : (
                                                    categories.map((cat) => (
                                                        <div key={cat._id} className="flex items-center group">
                                                            <Checkbox
                                                                id={cat.slug.current}
                                                                checked={selectedCategories.includes(cat.slug.current)}
                                                                onCheckedChange={() => toggleCategory(cat.slug.current)}
                                                                className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                                                            />
                                                            <Label
                                                                htmlFor={cat.slug.current}
                                                                className="ml-2 text-sm text-gray-600 group-hover:text-gray-900 cursor-pointer flex-1 flex items-center justify-between py-1"
                                                            >
                                                                <span>{cat.title}</span>
                                                                <span className="text-xs text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded">
                                                                    {cat.productCount}
                                                                </span>
                                                            </Label>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>

                                    {/* Availability */}
                                    <AccordionItem value="availability" className="border-b-0">
                                        <AccordionTrigger className="text-sm font-semibold hover:no-underline py-3">
                                            Availability
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            <div className="space-y-2 pb-2">
                                                <div className="flex items-center space-x-2">
                                                    <Checkbox id="in-stock" />
                                                    <label htmlFor="in-stock" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer text-gray-600 hover:text-gray-900">
                                                        In Stock
                                                    </label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Checkbox id="out-of-stock" />
                                                    <label htmlFor="out-of-stock" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer text-gray-600 hover:text-gray-900">
                                                        Out of Stock
                                                    </label>
                                                </div>
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>

                                    {/* Price Range */}
                                    <AccordionItem value="price" className="border-t border-gray-100 border-b-0">
                                        <AccordionTrigger className="text-sm font-semibold hover:no-underline py-3">
                                            Price Range
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            <div className="space-y-4 px-1 pb-4 pt-2">
                                                <Slider
                                                    min={0}
                                                    max={10000}
                                                    step={100}
                                                    value={priceRange}
                                                    onValueChange={setPriceRange}
                                                    className="w-full"
                                                />
                                                <div className="flex items-center justify-between text-sm">
                                                    <div className="border border-gray-200 rounded px-2 py-1 bg-gray-50">
                                                        <span className="text-gray-500 mr-1">₹</span>
                                                        <span className="font-medium">{priceRange[0]}</span>
                                                    </div>
                                                    <span className="text-gray-400">-</span>
                                                    <div className="border border-gray-200 rounded px-2 py-1 bg-gray-50">
                                                        <span className="text-gray-500 mr-1">₹</span>
                                                        <span className="font-medium">{priceRange[1]}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>

                                    {/* Customer Ratings */}
                                    <AccordionItem value="ratings" className="border-t border-gray-100 border-b-0">
                                        <AccordionTrigger className="text-sm font-semibold hover:no-underline py-3">
                                            Customer Ratings
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            <div className="space-y-2 pb-2">
                                                {[4, 3, 2, 1].map((rating) => (
                                                    <div key={rating} className="flex items-center space-x-2 cursor-pointer group">
                                                        <Checkbox id={`rating-${rating}`} />
                                                        <label htmlFor={`rating-${rating}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex items-center gap-1">
                                                            <div className="flex text-yellow-400">
                                                                {Array(5).fill(0).map((_, i) => (
                                                                    <span key={i} className={i < rating ? "text-yellow-400" : "text-gray-200"}>★</span>
                                                                ))}
                                                            </div>
                                                            <span className="text-gray-500 text-xs font-normal group-hover:text-gray-900">& Up</span>
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>

                                    {/* Material */}
                                    <AccordionItem value="material" className="border-t border-gray-100 border-b-0">
                                        <AccordionTrigger className="text-sm font-semibold hover:no-underline py-3">
                                            Material
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            <div className="space-y-2 pb-2">
                                                {["Glossy", "Matte", "Vinyl", "Paper", "Canvas"].map((material) => (
                                                    <div key={material} className="flex items-center space-x-2">
                                                        <Checkbox
                                                            id={material}
                                                            checked={selectedMaterials.includes(material)}
                                                            onCheckedChange={() => {
                                                                setSelectedMaterials(prev =>
                                                                    prev.includes(material)
                                                                        ? prev.filter(m => m !== material)
                                                                        : [...prev, material]
                                                                );
                                                            }}
                                                        />
                                                        <label htmlFor={material} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer text-gray-600 hover:text-gray-900">
                                                            {material}
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </div>

                            {/* Need Help Card */}
                            <div className="bg-blue-600 rounded-xl p-6 text-white text-center shadow-lg shadow-blue-200/50">
                                <h4 className="font-bold text-lg mb-2">Need Custom Quote?</h4>
                                <p className="text-sm text-blue-100 mb-4 leading-relaxed">
                                    Looking for bulk orders or custom specifications? We can help!
                                </p>
                                <Button variant="secondary" className="w-full text-blue-700 font-semibold">
                                    Contact Sales
                                </Button>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Toolbar */}
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <p className="text-sm text-gray-500">
                                Showing <span className="font-bold text-gray-900">{filteredProducts.length}</span> results
                            </p>

                            <div className="flex items-center gap-3">
                                {/* View Toggle */}
                                <div className="flex items-center bg-gray-100 p-1 rounded-lg">
                                    <button
                                        onClick={() => setViewMode("grid")}
                                        className={`p-1.5 rounded-md transition-all ${viewMode === "grid" ? "bg-white shadow text-blue-600" : "text-gray-500 hover:text-gray-900"
                                            }`}
                                    >
                                        <LayoutGrid className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => setViewMode("list")}
                                        className={`p-1.5 rounded-md transition-all ${viewMode === "list" ? "bg-white shadow text-blue-600" : "text-gray-500 hover:text-gray-900"
                                            }`}
                                    >
                                        <List className="h-4 w-4" />
                                    </button>
                                </div>

                                <div className="h-8 w-[1px] bg-gray-200 mx-1 hidden sm:block"></div>

                                {/* Sort */}
                                <Select value={sortBy} onValueChange={setSortBy}>
                                    <SelectTrigger className="w-[160px] border-none bg-gray-50 focus:ring-0">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="popular">Most Popular</SelectItem>
                                        <SelectItem value="price-low">Price: Low to High</SelectItem>
                                        <SelectItem value="price-high">Price: High to Low</SelectItem>
                                        <SelectItem value="name">Name: A to Z</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Active Filters Bar */}
                        {activeFilterCount > 0 && (
                            <div className="flex flex-wrap items-center gap-2 mb-6">
                                {searchQuery && (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-200 rounded-full text-sm text-gray-700 shadow-sm">
                                        Search: "{searchQuery}"
                                        <button onClick={() => setSearchQuery("")} className="hover:text-red-500"><X className="h-3.5 w-3.5" /></button>
                                    </span>
                                )}
                                {selectedCategories.map(slug => {
                                    const cat = categories.find(c => c.slug.current === slug);
                                    return (
                                        <span key={slug} className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-100 rounded-full text-sm text-blue-700 shadow-sm">
                                            {cat?.title}
                                            <button onClick={() => toggleCategory(slug)} className="hover:text-blue-900"><X className="h-3.5 w-3.5" /></button>
                                        </span>
                                    );
                                })}
                                {(priceRange[0] !== 0 || priceRange[1] !== 10000) && (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-200 rounded-full text-sm text-gray-700 shadow-sm">
                                        Price: ₹{priceRange[0]} - ₹{priceRange[1]}
                                        <button onClick={() => setPriceRange([0, 10000])} className="hover:text-red-500"><X className="h-3.5 w-3.5" /></button>
                                    </span>
                                )}
                                <button
                                    onClick={clearFilters}
                                    className="text-sm text-gray-500 hover:text-gray-900 underline ml-2"
                                >
                                    Clear all
                                </button>
                            </div>
                        )}

                        {/* Product Grid / Loading State */}
                        {isLoading ? (
                            <div className={`grid gap-6 ${viewMode === "grid" ? "sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
                                {Array(6).fill(0).map((_, i) => (
                                    <ProductSkeleton key={i} />
                                ))}
                            </div>
                        ) : filteredProducts.length === 0 ? (
                            <div className="bg-white rounded-2xl p-16 text-center border border-dashed border-gray-300">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-50 rounded-full mb-4">
                                    <Search className="w-8 h-8 text-gray-400" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
                                <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                                    We couldn't find any products matching your filters. Try adjusting your search or filter criteria.
                                </p>
                                <Button onClick={clearFilters} size="lg">
                                    Clear Filters
                                </Button>
                            </div>
                        ) : (
                            <div className={`grid gap-6 ${viewMode === "grid" ? "sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
                                {filteredProducts.map((product) => (
                                    <ProductCard
                                        key={product._id}
                                        product={{
                                            _id: product._id,
                                            title: product.title,
                                            slug: product.slug,
                                            category: product.category,
                                            mainImage: product.featuredImage,
                                            basePrice: product.basePrice,
                                            description: product.shortDescription
                                        }}
                                        viewMode={viewMode}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
