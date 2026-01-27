"use client";

import Link from "next/link";
import { Package, FileText, Settings, ShoppingBag } from "lucide-react";

export default function AccountOverviewPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Account Overview</h1>
                <p className="text-slate-500">Welcome back to your dashboard.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Link href="/account/orders" className="block group">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow h-full">
                        <div className="h-10 w-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            <ShoppingBag className="h-5 w-5" />
                        </div>
                        <h3 className="font-semibold text-slate-900 mb-1">Your Orders</h3>
                        <p className="text-sm text-slate-500">Track packages and view order history.</p>
                    </div>
                </Link>

                <Link href="/account/quotes" className="block group">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow h-full">
                        <div className="h-10 w-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-4 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                            <FileText className="h-5 w-5" />
                        </div>
                        <h3 className="font-semibold text-slate-900 mb-1">My Quotes</h3>
                        <p className="text-sm text-slate-500">View status of your custom quote requests.</p>
                    </div>
                </Link>

                <Link href="/account/settings" className="block group">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow h-full">
                        <div className="h-10 w-10 rounded-lg bg-gray-50 text-gray-600 flex items-center justify-center mb-4 group-hover:bg-gray-800 group-hover:text-white transition-colors">
                            <Settings className="h-5 w-5" />
                        </div>
                        <h3 className="font-semibold text-slate-900 mb-1">Profile Settings</h3>
                        <p className="text-sm text-slate-500">Update your email, password, and address.</p>
                    </div>
                </Link>
            </div>

            <div className="bg-blue-50/50 rounded-xl p-6 border border-blue-100 mt-8">
                <h3 className="font-semibold text-blue-900 mb-2">Need Help?</h3>
                <p className="text-sm text-blue-800 mb-4">Our support team is available Monday to Friday, 9am - 6pm.</p>
                <Link href="/contact" className="text-sm font-medium text-blue-600 hover:underline">
                    Contact Support &rarr;
                </Link>
            </div>
        </div>
    );
}
