"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { User, LogOut, Package, ChevronDown, Settings } from "lucide-react";

export function UserMenu() {
    const { user, profile, loading, signOut } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // OPTIMIZATION: Show "Sign In" immediately instead of loading skeleton
    // This prevents the "slow" feeling on page load.
    // if (loading) {
    //    return <div className="h-9 w-20 bg-slate-100 animate-pulse rounded-md" />;
    // }

    if (!user) {
        return (
            <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Link href="/login">Sign In</Link>
            </Button>
        );
    }

    const displayName = profile?.full_name || user.email?.split('@')[0] || "User";

    return (
        <div className="relative" ref={menuRef}>
            <Button
                variant="ghost"
                className="flex items-center gap-2 px-2 hover:bg-slate-100"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center border border-blue-200">
                    <User className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium text-slate-700 hidden sm:inline-block max-w-[100px] truncate">
                    {displayName}
                </span>
                <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </Button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                    <div className="px-4 py-3 border-b border-slate-100">
                        <p className="text-sm font-medium text-slate-900 truncate">{displayName}</p>
                        <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    </div>

                    <div className="p-1">
                        <Link
                            href="/account/orders"
                            className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            <Package className="h-4 w-4 text-slate-400" />
                            My Orders
                        </Link>
                        <Link
                            href="/account/settings"
                            className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            <Settings className="h-4 w-4 text-slate-400" />
                            Account Settings
                        </Link>
                    </div>

                    <div className="p-1 border-t border-slate-100">
                        <button
                            onClick={() => {
                                signOut();
                                setIsOpen(false);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 rounded-md transition-colors text-left"
                        >
                            <LogOut className="h-4 w-4" />
                            Sign Out
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
