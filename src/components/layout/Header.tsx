"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CartSheet } from "@/components/cart/CartSheet";
import { UserMenu } from "@/components/auth/UserMenu";
import { SearchBar } from "@/components/layout/SearchBar";
import { ChevronDown, Menu, X, ArrowRight } from "lucide-react";
import { useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { PRODUCT_CATEGORIES } from "@/config/navigation";

export function Header() {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Don't show this header on Admin pages
    if (pathname?.startsWith("/admin")) return null;

    return (
        <>
            {/* Top Announcement Bar */}
            <div className="bg-slate-900 text-white py-2.5 text-center text-sm relative z-50">
                <div className="container mx-auto px-4">
                    <p className="flex items-center justify-center gap-3 font-medium">
                        <span className="hidden sm:inline">🎉</span>
                        <span>MEGA SALE: Get flat 40% OFF</span>
                        <span className="hidden sm:inline text-slate-400">|</span>
                        <span className="bg-white/10 px-2 py-0.5 rounded text-white border border-white/20 select-all cursor-pointer hover:bg-white/20 transition-colors">
                            PRINT40
                        </span>
                    </p>
                </div>
            </div>

            {/* Main Header */}
            <header className="border-b border-gray-200 bg-white sticky top-0 z-40 shadow-sm">
                <div className="container mx-auto px-4 h-16 md:h-20">
                    <div className="flex items-center justify-between h-full gap-4 lg:gap-8">

                        {/* Left Section: Mobile Menu + Logo + Products */}
                        <div className="flex items-center gap-4 lg:gap-6">
                            {/* Mobile Menu Toggle */}
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="lg:hidden p-2 -ml-2 hover:bg-gray-100 rounded-md text-gray-600"
                            >
                                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </button>

                            {/* Logo */}
                            <Link href="/" className="flex flex-col">
                                <span className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight leading-none">
                                    TotalPrintHub
                                </span>
                            </Link>

                            {/* Desktop Products Dropdown - Moved Left */}
                            <div className="hidden lg:block relative">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            className="font-medium text-base hover:bg-gray-100/80 data-[state=open]:bg-gray-100"
                                        >
                                            Products
                                            <ChevronDown className="h-4 w-4 ml-1 opacity-50" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="start" className="w-[600px] p-0 shadow-xl border-gray-200" sideOffset={8}>
                                        <div className="grid grid-cols-2 p-2 gap-1 bg-white rounded-lg">
                                            {PRODUCT_CATEGORIES.slice(0, 6).map((category, index) => (
                                                <Link
                                                    key={category.title}
                                                    href={`/products?category=${category.title.toLowerCase()}`}
                                                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                                                >
                                                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center text-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                                        {getCategoryIcon(index)}
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                                            {category.title}
                                                        </div>
                                                        <div className="text-xs text-gray-500 mt-0.5 font-normal">
                                                            {category.items.slice(0, 2).map(i => i.title).join(", ")} +more
                                                        </div>
                                                    </div>
                                                </Link>
                                            ))}

                                            <div className="col-span-2 border-t border-gray-100 mt-2 pt-2 px-3 pb-1">
                                                <Link
                                                    href="/products/categories"
                                                    className="flex items-center justify-between p-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
                                                >
                                                    View All Categories
                                                    <ArrowRight className="h-4 w-4" />
                                                </Link>
                                            </div>
                                        </div>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>

                        {/* Center Section: Search Bar */}
                        <div className="flex-1 max-w-2xl hidden md:block">
                            <SearchBar />
                        </div>

                        {/* Right Section: Actions */}
                        <div className="flex items-center gap-2 lg:gap-2">
                            {/* Quick Links Desktop */}
                            <div className="hidden xl:flex items-center gap-1 mr-2 text-sm font-medium text-gray-600 border-r border-gray-200 pr-4">
                                <Link href="/about" className="px-3 py-2 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors">
                                    About
                                </Link>
                                <Link href="/blog" className="px-3 py-2 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors">
                                    Blog
                                </Link>
                                <Button asChild variant="default" size="sm" className="ml-2 bg-blue-600 hover:bg-blue-700 text-white">
                                    <Link href="/custom-quote">Get Check Quote</Link>
                                </Button>
                            </div>

                            <div className="flex items-center gap-2">
                                <UserMenu />
                                <CartSheet />
                            </div>
                        </div>
                    </div>

                    {/* Mobile Search Bar - Slimmer */}
                    <div className="md:hidden pb-3">
                        <SearchBar />
                    </div>
                </div>

                {/* Mobile Menu Dropdown */}
                {mobileMenuOpen && (
                    <div className="lg:hidden border-t border-gray-200 bg-white absolute w-full left-0 top-full shadow-lg h-[calc(100vh-64px)] overflow-y-auto">
                        <div className="container mx-auto px-4 py-4">
                            <nav className="space-y-1">
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">Products</p>
                                {PRODUCT_CATEGORIES.map((category) => (
                                    <Link
                                        key={category.title}
                                        href={`/products?category=${category.title.toLowerCase()}`}
                                        className="block py-2.5 px-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg font-medium transition-colors"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        {category.title}
                                    </Link>
                                ))}

                                <div className="border-t border-gray-100 my-2 pt-2"></div>
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">Company</p>

                                <Link
                                    href="/about"
                                    className="block py-2.5 px-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg font-medium transition-colors"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    About Us
                                </Link>
                                <Link
                                    href="/blog"
                                    className="block py-2.5 px-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg font-medium transition-colors"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Blog
                                </Link>
                                <Link
                                    href="/track-order"
                                    className="block py-2.5 px-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg font-medium transition-colors"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Track Order
                                </Link>
                                <Link
                                    href="/help"
                                    className="block py-2.5 px-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg font-medium transition-colors"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Help Center
                                </Link>
                            </nav>
                        </div>
                    </div>
                )}
            </header>
        </>
    );
}

// Helper function to get category icons
function getCategoryIcon(index: number) {
    const icons = ["🏷️", "📚", "📦", "📋", "✒️", "💳", "📢"];
    return icons[index % icons.length];
}
