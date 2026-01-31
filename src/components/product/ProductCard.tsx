"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { urlFor } from "@/lib/sanity/client";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
    product: {
        _id: string;
        title: string;
        slug: { current: string };
        category: { title: string; slug: { current: string } };
        mainImage: any;
        basePrice?: number; // Made optional
        description: string;
    };
    viewMode?: "grid" | "list";
}

export function ProductCard({ product, viewMode = "grid" }: ProductCardProps) {
    if (viewMode === "list") {
        return (
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-row items-center p-4 gap-6"
            >
                {/* Image - Smaller for list */}
                <Link
                    href={`/products/${product.category.slug.current}/${product.slug.current}`}
                    className="relative w-32 h-32 md:w-48 md:h-48 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden"
                >
                    {product.mainImage ? (
                        <Image
                            src={urlFor(product.mainImage).width(400).url()}
                            alt={product.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                            No Image
                        </div>
                    )}
                </Link>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <Link
                        href={`/products/${product.category.slug.current}`}
                        className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1 block"
                    >
                        {product.category.title}
                    </Link>

                    <Link href={`/products/${product.category.slug.current}/${product.slug.current}`}>
                        <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 truncate group-hover:text-blue-600 transition-colors">
                            {product.title}
                        </h3>
                    </Link>

                    <p className="text-sm text-gray-500 line-clamp-2 md:line-clamp-3 mb-4 hidden sm:block">
                        {product.description}
                    </p>

                    <div className="flex items-center justify-between sm:justify-start sm:gap-8">
                        <div>
                            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tight">Starting at</p>
                            <p className="text-lg md:text-xl font-black text-gray-900">
                                {product.basePrice ? (
                                    `₹ ${product.basePrice.toLocaleString("en-IN")}`
                                ) : (
                                    <span className="text-sm text-gray-400">Price not set</span>
                                )}
                            </p>
                        </div>

                        <Link href={`/products/${product.category.slug.current}/${product.slug.current}`}>
                            <Button size="sm" className="rounded-full px-6 bg-gray-900 hover:bg-blue-600">
                                Customize
                            </Button>
                        </Link>
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
            className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full"
        >
            {/* Image Container */}
            <Link
                href={`/products/${product.category.slug.current}/${product.slug.current}`}
                className="relative aspect-square overflow-hidden bg-gray-50 flex-shrink-0"
            >
                {product.mainImage ? (
                    <Image
                        src={urlFor(product.mainImage).width(600).url()}
                        alt={product.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                        No Image
                    </div>
                )}

                {/* Quick Badge */}
                <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full text-blue-600 shadow-sm border border-blue-50">
                        Best Seller
                    </span>
                </div>
            </Link>

            {/* Content */}
            <div className="p-5 flex flex-col flex-grow">
                <div className="mb-auto">
                    <Link
                        href={`/products/${product.category.slug.current}`}
                        className="text-[11px] font-bold text-blue-500 uppercase tracking-widest mb-1.5 block hover:text-blue-600 transition-colors"
                    >
                        {product.category.title}
                    </Link>

                    <Link href={`/products/${product.category.slug.current}/${product.slug.current}`}>
                        <h3 className="text-lg font-bold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors mb-2">
                            {product.title}
                        </h3>
                    </Link>

                    <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                        {product.description}
                    </p>
                </div>

                {/* Price and Action */}
                <div className="flex items-end justify-between mt-4 pt-4 border-t border-gray-50">
                    <div>
                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tight">Starting at</p>
                        <p className="text-xl font-black text-gray-900">
                            {product.basePrice ? (
                                `₹ ${product.basePrice.toLocaleString("en-IN")}`
                            ) : (
                                <span className="text-sm text-gray-400">Price not set</span>
                            )}
                        </p>
                    </div>

                    <Link href={`/products/${product.category.slug.current}/${product.slug.current}`}>
                        <Button size="sm" className="rounded-full px-5 font-bold bg-gray-900 hover:bg-blue-600 transition-all shadow-lg shadow-gray-200">
                            Customize
                        </Button>
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}
