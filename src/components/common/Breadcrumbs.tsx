"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
    label: string;
    href: string;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
    return (
        <nav className="flex mb-6 overflow-x-auto whitespace-nowrap pb-2 md:pb-0" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm text-gray-500">
                <li>
                    <Link
                        href="/"
                        className="flex items-center hover:text-blue-600 transition-colors"
                    >
                        <Home className="h-4 w-4 mr-1" />
                        <span>Home</span>
                    </Link>
                </li>

                {items.map((item, index) => (
                    <li key={item.href} className="flex items-center">
                        <ChevronRight className="h-4 w-4 mx-1 flex-shrink-0" />
                        {index === items.length - 1 ? (
                            <span className="font-semibold text-gray-900" aria-current="page">
                                {item.label}
                            </span>
                        ) : (
                            <Link
                                href={item.href}
                                className="hover:text-blue-600 transition-colors"
                            >
                                {item.label}
                            </Link>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}
