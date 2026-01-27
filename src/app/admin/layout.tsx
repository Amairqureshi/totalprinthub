"use client";

import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-[#f1f5f9] overflow-hidden">
            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#0f172a] z-50 flex items-center px-4 border-b border-[#1e293b]">
                <Sheet>
                    <SheetTrigger asChild>
                        <button className="text-white p-2 -ml-2 hover:bg-white/10 rounded-lg transition-colors">
                            <Menu className="h-6 w-6" />
                        </button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 border-r-[#1e293b] bg-[#0f172a] w-72 text-white border-none">
                        <AdminSidebar />
                    </SheetContent>
                </Sheet>
                <div className="ml-4 font-bold text-white text-lg tracking-tight">PrintHub</div>
            </div>

            {/* Sidebar (Desktop Fixed) */}
            <aside className="hidden md:block flex-shrink-0 w-64 border-r border-gray-200 bg-gray-900">
                <AdminSidebar />
            </aside>

            {/* Main Content (Scrollable) */}
            <main className="flex-1 flex flex-col min-w-0 overflow-y-auto mt-16 md:mt-0">
                <div className="flex-1 p-4 md:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
