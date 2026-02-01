"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShoppingCart, Package, Users, Settings, LogOut, Printer, FileText, Briefcase, BookOpen, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
    { name: "Overview", href: "/admin", icon: LayoutDashboard },
    { name: "Create Product", href: "/admin/pricing-builder", icon: Plus },
    { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
    { name: "Products", href: "/admin/products", icon: Package },
    { name: "Customers", href: "/admin/customers", icon: Users },
    { name: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
    const pathname = usePathname();

    return (
        <div className="flex h-full w-64 flex-col bg-[#0f172a] text-white border-r border-[#1e293b]">
            <div className="flex h-20 items-center px-6 border-b border-[#1e293b] bg-[#0f172a]">
                <div className="flex items-center gap-3">
                    <img
                        src="/logo.png"
                        alt="TotalPrintHub Admin"
                        className="h-8 w-auto object-contain brightness-0 invert"
                    />
                    <span className="bg-blue-600 text-[10px] font-bold px-1.5 py-0.5 rounded text-white ml-2 uppercase tracking-wider">Admin</span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
                <p className="px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Platform</p>
                {navigation.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 group relative overflow-hidden",
                                isActive
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
                                    : "text-slate-400 hover:bg-[#1e293b] hover:text-white"
                            )}
                        >
                            <Icon className={cn("mr-3 h-5 w-5 flex-shrink-0 transition-colors", isActive ? "text-white" : "text-slate-500 group-hover:text-blue-400")} />
                            {item.name}
                            {isActive && <div className="absolute inset-y-0 right-0 w-1 bg-white/20 rounded-l-full" />}
                        </Link>
                    );
                })}
            </div>

            <div className="p-4 bg-[#020617]">
                <button className="flex w-full items-center px-3 py-3 text-sm font-medium text-slate-400 rounded-xl hover:bg-[#1e293b] hover:text-white transition-all duration-200 group">
                    <LogOut className="mr-3 h-5 w-5 text-slate-500 group-hover:text-red-400 transition-colors" />
                    Sign Out
                </button>
            </div>
        </div>
    );
}
