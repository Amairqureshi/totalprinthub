"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingCart } from "lucide-react";

interface Product {
    id: string;
    title: string;
    price: string;
    image?: string;
    rating?: number;
    category: string;
    badge?: string;
}

interface ProductSliderProps {
    title: string;
    subtitle?: string;
    products: Product[];
}

export function ProductSlider({ title, subtitle, products }: ProductSliderProps) {
    return (
        <section className="py-12 bg-white">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-start gap-4 mb-8">
                    <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
                    {subtitle && <p className="text-gray-500">{subtitle}</p>}
                </div>

                <Carousel
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                    className="w-full"
                >
                    <CarouselContent className="-ml-2 md:-ml-4">
                        {products.map((product) => (
                            <CarouselItem key={product.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                                <div className="p-1">
                                    <Card className="overflow-hidden group hover:shadow-lg transition-all border-gray-100">
                                        <CardContent className="p-0">
                                            <div className="relative aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
                                                {product.badge && (
                                                    <Badge className="absolute top-2 left-2 z-10 bg-blue-600 hover:bg-blue-700">
                                                        {product.badge}
                                                    </Badge>
                                                )}
                                                {/* Placeholder for real image */}
                                                <div className="text-gray-400 group-hover:scale-105 transition-transform duration-300">
                                                    {/* In a real app, use next/image here */}
                                                    <span className="text-4xl">🖼️</span>
                                                </div>
                                            </div>
                                            <div className="p-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="text-sm text-gray-500 capitalize">{product.category}</div>
                                                    {product.rating && (
                                                        <div className="flex items-center text-amber-500 text-xs font-medium">
                                                            <Star className="w-3 h-3 fill-current mr-1" />
                                                            {product.rating}
                                                        </div>
                                                    )}
                                                </div>
                                                <Link href={`/products/${product.category}/${product.id}`} className="block">
                                                    <h3 className="font-semibold text-lg leading-tight mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
                                                        {product.title}
                                                    </h3>
                                                </Link>
                                                <div className="flex items-center justify-between mt-4">
                                                    <span className="font-bold text-lg">{product.price}</span>
                                                    <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full hover:bg-blue-600 hover:text-white transition-colors">
                                                        <ShoppingCart className="h-4 w-4" />
                                                        <span className="sr-only">Add to cart</span>
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="hidden md:flex" />
                    <CarouselNext className="hidden md:flex" />
                </Carousel>
            </div>
        </section>
    );
}
