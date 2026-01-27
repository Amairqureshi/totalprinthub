"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    User, ShoppingBag, FileText, MapPin, Settings, LogOut,
    LayoutDashboard
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/AuthProvider";

const sidebarItems = [
    { href: "/account", label: "Overview", icon: LayoutDashboard },
    { href: "/account/orders", label: "Orders & Returns", icon: ShoppingBag },
    { href: "/account/quotes", label: "My Quotes", icon: FileText },
    { href: "/account/settings", label: "Profile Settings", icon: Settings },
];

export function AccountSidebar() {
    const pathname = usePathname();
    const { user, signOut } = useAuth();

    return (
        <div className="w-full md:w-64 flex-shrink-0 space-y-6">
            {/* User Profile Summary */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
                <div className="h-20 w-20 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mb-3 text-2xl font-bold">
                    {user?.email?.[0].toUpperCase() || "U"}
                </div>
                <h3 className="font-semibold text-slate-900 truncate w-full">
                    {user?.user_metadata?.full_name || "Valued User"}
                </h3>
                <p className="text-xs text-slate-500 truncate w-full mb-4">
                    {user?.email}
                </p>
                <div className="w-full pt-4 border-t border-slate-100">
                    <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Member Since</p>
                    <p className="text-xs text-slate-600">
                        {user?.created_at ? new Date(user.created_at).getFullYear() : '2024'}
                    </p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden text-sm font-medium">
                {sidebarItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 border-l-4 transition-colors",
                                isActive
                                    ? "border-blue-600 bg-blue-50 text-blue-700 font-semibold"
                                    : "border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                            )}
                        >
                            <Icon className={cn("h-5 w-5", isActive ? "text-blue-600" : "text-slate-400")} />
                            {item.label}
                        </Link>
                    );
                })}

                <div className="border-t border-slate-100 mt-2 pt-2 pb-2">
                    <button
                        onClick={() => signOut()}
                        className="w-full flex items-center gap-3 px-4 py-3 text-rose-600 hover:bg-rose-50 border-l-4 border-transparent transition-colors text-left"
                    >
                        <LogOut className="h-5 w-5" />
                        Sign Out
                    </button>
                </div>
            </nav>
        </div>
    );
}
