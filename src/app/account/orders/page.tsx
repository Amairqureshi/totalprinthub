"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import {
    Package, ArrowRight, ShoppingBag, Loader2, Search,
    Truck, CheckCircle, Clock, XCircle, MapPin, RefreshCw
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

interface Order {
    id: string;
    created_at: string;
    status: string;
    total_amount: number;
    order_items: any[];
}

export default function UserOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState("all");

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await fetch("/api/account/orders");
                if (res.ok) {
                    const data = await res.json();
                    setOrders(data);
                    setFilteredOrders(data);
                }
            } catch (error) {
                console.error("Failed to load orders", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    useEffect(() => {
        let results = orders;

        // 1. Filter by Tab
        if (activeTab === "open") {
            results = results.filter(o => ['pending', 'processing', 'shipped'].includes(o.status));
        } else if (activeTab === "cancelled") {
            results = results.filter(o => o.status === 'cancelled');
        }

        // 2. Filter by Search
        if (searchTerm) {
            results = results.filter(order =>
                order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.order_items.some(item => item.product_name?.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        setFilteredOrders(results);
    }, [searchTerm, orders, activeTab]);

    const getStatusStep = (status: string) => {
        switch (status) {
            case 'pending': return 1;
            case 'processing': return 2;
            case 'shipped': return 3;
            case 'delivered': return 4;
            default: return 0;
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="w-full space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Orders & Returns</h1>
                    <p className="text-slate-500 mt-1">Track your packages and view order history.</p>
                </div>

                <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Search all orders..."
                        className="pl-9 bg-white shadow-sm border-slate-200 focus:border-blue-500 transition-colors"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="bg-white border border-slate-200 p-1 h-auto rounded-lg shadow-sm inline-flex">
                    <TabsTrigger value="all" className="px-4 py-2 text-sm data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900 rounded-md">All Orders</TabsTrigger>
                    <TabsTrigger value="open" className="px-4 py-2 text-sm data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 rounded-md">Open Orders</TabsTrigger>
                    <TabsTrigger value="cancelled" className="px-4 py-2 text-sm data-[state=active]:bg-rose-50 data-[state=active]:text-rose-700 rounded-md">Cancelled</TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="space-y-6 mt-0">
                    {filteredOrders.length === 0 ? (
                        <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-slate-300">
                            <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <ShoppingBag className="h-8 w-8 text-slate-300" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900">No orders found</h3>
                            <p className="text-slate-500 mt-1 mb-6">We couldn't find any orders matching your filters.</p>
                            <Button asChild variant="outline">
                                <Link href="/products">Continue Shopping</Link>
                            </Button>
                        </div>
                    ) : (
                        filteredOrders.map((order) => {
                            const currentStep = getStatusStep(order.status);
                            const isCancelled = order.status === 'cancelled';

                            return (
                                <div key={order.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                    {/* Header */}
                                    <div className="bg-slate-50/50 px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div className="flex gap-8 text-sm">
                                            <div>
                                                <p className="text-slate-500 uppercase text-xs font-bold tracking-wider mb-1">Order Placed</p>
                                                <p className="font-medium text-slate-900">{format(new Date(order.created_at), "d MMMM yyyy")}</p>
                                            </div>
                                            <div>
                                                <p className="text-slate-500 uppercase text-xs font-bold tracking-wider mb-1">Total</p>
                                                <p className="font-medium text-slate-900">₹{Number(order.total_amount).toLocaleString()}</p>
                                            </div>
                                            <div>
                                                <p className="text-slate-500 uppercase text-xs font-bold tracking-wider mb-1">Ship To</p>
                                                <p className="font-medium text-blue-600 cursor-pointer group flex items-center gap-1">
                                                    Me <span className="opacity-0 group-hover:opacity-100 transition-opacity">▼</span>
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-slate-400 mb-1">Order # {order.id.slice(0, 8)}</p>
                                            <div className="flex items-center justify-end gap-3">
                                                <Link href={`/account/orders/${order.id}`} className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline">
                                                    View Invoice
                                                </Link>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Body */}
                                    <div className="p-6">
                                        <div className="flex flex-col lg:flex-row gap-8">
                                            {/* Main Content */}
                                            <div className="flex-1 space-y-6">
                                                <div className="flex items-start gap-4">
                                                    {/* Status Graphic */}
                                                    <div className="w-full">
                                                        <h3 className="text-lg font-bold text-slate-900 mb-1 capitalize flex items-center gap-2">
                                                            {isCancelled ? (
                                                                <span className="text-rose-600 flex items-center gap-2"><XCircle className="h-5 w-5" /> Cancelled</span>
                                                            ) : (
                                                                order.status === 'delivered' ? (
                                                                    <span className="text-emerald-700 flex items-center gap-2"><CheckCircle className="h-5 w-5" /> Delivered</span>
                                                                ) : (
                                                                    <span className="text-blue-600 flex items-center gap-2"><Truck className="h-5 w-5" /> {order.status}</span>
                                                                )
                                                            )}
                                                        </h3>
                                                        <p className="text-slate-500 text-sm mb-4">
                                                            {order.status === 'delivered' ? `Package delivered on ${format(new Date(), "MMMM d")}` : 'Updates will serve here'}
                                                        </p>

                                                        {/* Step Progress */}
                                                        {!isCancelled && (
                                                            <div className="hidden sm:block mt-6">
                                                                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-2">
                                                                    <div
                                                                        className="h-full bg-blue-600 transition-all duration-500 rounded-full"
                                                                        style={{ width: `${(currentStep / 4) * 100}%` }}
                                                                    />
                                                                </div>
                                                                <div className="flex justify-between text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                                                                    <span className={currentStep >= 1 ? "text-blue-600" : ""}>Ordered</span>
                                                                    <span className={currentStep >= 2 ? "text-blue-600" : ""}>Processing</span>
                                                                    <span className={currentStep >= 3 ? "text-blue-600" : ""}>Shipped</span>
                                                                    <span className={currentStep >= 4 ? "text-emerald-600" : ""}>Delivered</span>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Items Grid */}
                                                <div className="flex flex-col gap-4">
                                                    {order.order_items?.map((item, idx) => (
                                                        <div key={idx} className="flex gap-4">
                                                            <div className="relative h-24 w-24 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0">
                                                                {item.product_image ? (
                                                                    <img src={item.product_image} alt="" className="h-full w-full object-cover" />
                                                                ) : (
                                                                    <Package className="h-8 w-8 text-slate-300 m-auto translate-y-8" />
                                                                )}
                                                            </div>
                                                            <div>
                                                                <Link href={`/products`} className="font-semibold text-slate-900 hover:text-blue-600 hover:underline line-clamp-2">
                                                                    {item.product_name}
                                                                </Link>
                                                                <p className="text-sm text-slate-500 mt-1">Quantity: {item.quantity}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Action Sidebar */}
                                            <div className="w-full lg:w-64 space-y-3 pt-2">
                                                <Button variant="outline" className="w-full border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100 hover:border-blue-300" asChild>
                                                    <Link href={`/account/orders/${order.id}`}>View Order Details</Link>
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
