"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, Command } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { PRODUCT_CATEGORIES } from "@/config/navigation";

interface SearchResult {
    title: string;
    href: string;
    category: string;
    description?: string;
}

export function SearchBar() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const searchRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Keyboard shortcut: Press "/" to focus search
    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === "/" && !isInputFocused()) {
                e.preventDefault();
                inputRef.current?.focus();
            }
            if (e.key === "Escape") {
                setIsOpen(false);
                inputRef.current?.blur();
            }
        }

        function isInputFocused() {
            return document.activeElement?.tagName === "INPUT" ||
                document.activeElement?.tagName === "TEXTAREA";
        }

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Search products as user types
    useEffect(() => {
        if (query.trim().length < 2) {
            setResults([]);
            setIsOpen(false);
            return;
        }

        // Flatten all products from categories
        const allProducts: SearchResult[] = [];
        PRODUCT_CATEGORIES.forEach(category => {
            category.items.forEach(item => {
                allProducts.push({
                    title: item.title,
                    href: item.href,
                    category: category.title,
                    description: item.description
                });
            });
        });

        // Filter based on query
        const filtered = allProducts.filter(product =>
            product.title.toLowerCase().includes(query.toLowerCase()) ||
            product.category.toLowerCase().includes(query.toLowerCase()) ||
            product.description?.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 8); // Limit to 8 results

        setResults(filtered);
        setIsOpen(filtered.length > 0);
        setSelectedIndex(0);
    }, [query]);

    // Keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!isOpen || results.length === 0) return;

        if (e.key === "ArrowDown") {
            e.preventDefault();
            setSelectedIndex((prev) => (prev + 1) % results.length);
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
        } else if (e.key === "Enter" && selectedIndex >= 0) {
            e.preventDefault();
            window.location.href = results[selectedIndex].href;
        }
    };

    const handleClear = () => {
        setQuery("");
        setResults([]);
        setIsOpen(false);
    };

    return (
        <div ref={searchRef} className="relative w-full">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                    ref={inputRef}
                    type="text"
                    placeholder='Search products... (Press "/" to focus)'
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => query.length >= 2 && results.length > 0 && setIsOpen(true)}
                    onKeyDown={handleKeyDown}
                    className="pl-10 pr-20 h-11 bg-gray-50 border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    {query && (
                        <button
                            onClick={handleClear}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                    <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-100 border border-gray-200 rounded">
                        <Command className="h-3 w-3" />
                        /
                    </kbd>
                </div>
            </div>

            {/* Search Results Dropdown */}
            {isOpen && results.length > 0 && (
                <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden z-50 max-h-[500px] overflow-y-auto">
                    <div className="p-2">
                        <div className="flex items-center justify-between px-3 py-2">
                            <p className="text-xs text-gray-500 font-medium">
                                {results.length} {results.length === 1 ? 'result' : 'results'} found
                            </p>
                            <p className="text-xs text-gray-400">
                                Use ↑↓ to navigate, Enter to select
                            </p>
                        </div>
                        <div className="space-y-1">
                            {results.map((result, index) => (
                                <Link
                                    key={index}
                                    href={result.href}
                                    onClick={() => {
                                        setIsOpen(false);
                                        setQuery("");
                                    }}
                                    className={`flex items-start gap-3 p-3 rounded-md transition-colors group ${index === selectedIndex
                                            ? 'bg-blue-50 border-l-2 border-blue-600'
                                            : 'hover:bg-gray-50'
                                        }`}
                                >
                                    {/* Product Icon/Image Placeholder */}
                                    <div className={`flex-shrink-0 w-12 h-12 rounded-md flex items-center justify-center ${index === selectedIndex
                                            ? 'bg-blue-100'
                                            : 'bg-gradient-to-br from-blue-50 to-blue-100'
                                        }`}>
                                        <span className="text-xl">📦</span>
                                    </div>

                                    {/* Product Info */}
                                    <div className="flex-1 min-w-0">
                                        <p className={`font-medium text-sm transition-colors ${index === selectedIndex
                                                ? 'text-blue-600'
                                                : 'text-gray-900 group-hover:text-blue-600'
                                            }`}>
                                            {result.title}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-0.5">
                                            {result.category}
                                        </p>
                                        {result.description && (
                                            <p className="text-xs text-gray-400 mt-1 line-clamp-1">
                                                {result.description}
                                            </p>
                                        )}
                                    </div>

                                    {/* Selected indicator */}
                                    {index === selectedIndex && (
                                        <div className="flex-shrink-0 text-blue-600 text-xs font-medium">
                                            ↵
                                        </div>
                                    )}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* View All Results Link */}
                    <div className="border-t border-gray-100 p-2 bg-gray-50">
                        <Link
                            href={`/products?q=${encodeURIComponent(query)}`}
                            onClick={() => {
                                setIsOpen(false);
                                setQuery("");
                            }}
                            className="block text-center text-sm text-blue-600 hover:text-blue-700 font-medium py-2 hover:bg-white rounded-md transition-colors"
                        >
                            View all results for "{query}" →
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
