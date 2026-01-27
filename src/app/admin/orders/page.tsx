"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import {
    Search, Filter, Download,
    ArrowUpRight, ArrowDownRight, DollarSign,
    ShoppingBag, Clock, CheckCircle, Eye
} from "lucide-react";
import { useRouter } from "next/navigation";
import { StatsCard } from "@/components/admin/StatsCard";
import { Order } from "@/lib/types/database";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const router = useRouter();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await fetch("/api/admin/orders");
                const data = await res.json();
                if (Array.isArray(data)) {
                    setOrders(data);
                }
            } catch (error) {
                console.error("Failed to load orders", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    // Filter Logic
    const filteredOrders = orders.filter(order => {
        const matchesSearch =
            order.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.id.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === "all" || order.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    // Stats Calculation
    const totalRevenue = orders.reduce((sum, order) => sum + (Number(order.total_amount) || 0), 0);
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const completedOrders = orders.filter(o => o.status === 'delivered').length;

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Orders</h1>
                    <p className="text-gray-500 mt-1">Manage and track all customer orders.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2">
                        <Download className="h-4 w-4" />
                        Export
                    </Button>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Total Revenue"
                    value={`\u20B9${totalRevenue.toLocaleString()}`}
                    icon={DollarSign}
                    trend="up"
                    trendValue="+12%"
                />
                <StatsCard
                    title="Total Orders"
                    value={totalOrders.toString()}
                    icon={ShoppingBag}
                    trend="neutral"
                    trendValue="+2"
                />
                <StatsCard
                    title="Pending"
                    value={pendingOrders.toString()}
                    icon={Clock}
                    description="Orders awaiting processing"
                />
                <StatsCard
                    title="Delivered"
                    value={completedOrders.toString()}
                    icon={CheckCircle}
                    description="Successfully completed"
                />
            </div>

            {/* Filters & Table */}
            <div className="bg-white rounded-xl shadow-[0_2px_10px_-4px_rgba(6,81,237,0.1)] border border-slate-200 overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-white">
                    <div className="relative w-full sm:w-80">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Search orders, customers..."
                            className="pl-9 bg-slate-50 border-slate-200 focus:bg-white transition-all shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-3 w-full sm:w-auto">
                        <select
                            className="h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm outline-none"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">All Statuses</option>
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                        <Button variant="outline" size="icon" className="border-slate-200 hover:bg-slate-50 text-slate-600">
                            <Filter className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50/50 border-b border-slate-100 text-xs uppercase font-semibold text-slate-500 tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Order</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Total</th>
                                <th className="px-6 py-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-slate-50/80 transition-colors group">
                                    <td className="px-6 py-4 font-mono text-xs font-medium text-slate-700">
                                        #{order.id.slice(0, 8)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex flex-col">
                                            <span className="font-medium text-slate-900">
                                                {format(new Date(order.created_at), "MMM d, yyyy")}
                                            </span>
                                            <span className="text-xs text-slate-400">
                                                {format(new Date(order.created_at), "h:mm a")}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-md shadow-blue-200 border-2 border-white">
                                                {order.full_name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-semibold text-slate-900">{order.full_name}</div>
                                                <div className="text-xs text-slate-500">{order.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize border shadow-sm
                                            ${order.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-200' : ''}
                                            ${order.status === 'processing' ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}
                                            ${order.status === 'shipped' ? 'bg-purple-50 text-purple-700 border-purple-200' : ''}
                                            ${order.status === 'delivered' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : ''}
                                            ${order.status === 'cancelled' ? 'bg-rose-50 text-rose-700 border-rose-200' : ''}
                                        `}>
                                            <span className={`mr-1.5 h-1.5 w-1.5 rounded-full
                                                ${order.status === 'pending' ? 'bg-amber-500' : ''}
                                                ${order.status === 'processing' ? 'bg-blue-500' : ''}
                                                ${order.status === 'shipped' ? 'bg-purple-500' : ''}
                                                ${order.status === 'delivered' ? 'bg-emerald-500' : ''}
                                                ${order.status === 'cancelled' ? 'bg-rose-500' : ''}
                                            `}></span>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right font-semibold text-slate-900">
                                        {`\u20B9${Number(order.total_amount).toLocaleString()}`}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200"
                                            onClick={() => router.push(`/admin/orders/${order.id}`)}
                                        >
                                            <Eye className="h-3.5 w-3.5 mr-2" />
                                            View
                                        </Button>
                                    </td>
                                </tr>
                            ))}

                            {filteredOrders.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-16 text-center text-gray-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <ShoppingBag className="h-10 w-10 text-gray-300 mb-4" />
                                            <p className="text-lg font-medium text-gray-900">No orders found</p>
                                            <p className="text-sm">Try adjusting your search or filters.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer Pagination (Visual Only) */}
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
                    <p className="text-xs text-gray-500">
                        Showing <span className="font-medium">{filteredOrders.length}</span> results
                    </p>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" disabled>Previous</Button>
                        <Button variant="outline" size="sm" disabled>Next</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
