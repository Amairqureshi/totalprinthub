"use client";

import { useState, useEffect } from "react";
import { getAllCategories } from "@/lib/sanity/queries";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import Link from "next/link";
import { ArrowRight, Package, Tag, Layers, CheckCircle } from "lucide-react";

interface Category {
    _id: string;
    title: string;
    slug: { current: string };
    productCount: number;
    description?: string;
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            setIsLoading(true);
            const data = await getAllCategories();
            setCategories(data);
            setIsLoading(false);
        }
        loadData();
    }, []);

    const getIcon = (index: number) => {
        const icons = [Tag, Package, Layers, CheckCircle];
        return icons[index % icons.length];
    };

    return (
        <div className="min-h-screen bg-gray-50/50">
            {/* Hero Section */}
            <div className="bg-white border-b border-gray-200">
                <div className="container mx-auto px-4 py-8">
                    <Breadcrumbs items={[
                        { label: "Products", href: "/products" },
                        { label: "Categories", href: "/products/categories" }
                    ]} />
                    <div className="mt-6 mb-4">
                        <h1 className="text-3xl font-bold text-gray-900">Browse Categories</h1>
                        <p className="text-gray-600 mt-2 text-lg">Select a category to view all available products</p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array(6).fill(0).map((_, i) => (
                            <div key={i} className="h-48 bg-gray-200 rounded-xl animate-pulse"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categories.map((cat, index) => {
                            const Icon = getIcon(index);
                            return (
                                <Link
                                    key={cat._id}
                                    href={`/products?category=${cat.slug.current}`}
                                    className="group bg-white rounded-xl border border-gray-200 p-8 hover:shadow-lg hover:border-blue-500 transition-all duration-300 flex flex-col justify-between h-56 relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 p-32 bg-gray-50 rounded-full -mr-16 -mt-16 group-hover:bg-blue-50 transition-colors"></div>

                                    <div className="relative z-10">
                                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                            <Icon className="h-6 w-6" />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                                            {cat.title}
                                        </h3>
                                        <p className="text-gray-500 text-sm">
                                            {cat.productCount} Products Available
                                        </p>
                                    </div>

                                    <div className="relative z-10 flex items-center text-sm font-medium text-blue-600 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all">
                                        View Products <ArrowRight className="ml-2 h-4 w-4" />
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
