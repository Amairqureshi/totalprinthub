"use client";

import { StatsCard } from "@/components/admin/StatsCard";
import { DollarSign, ShoppingBag, Users, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { Order } from "@/lib/types/database";

export default function AdminDashboardPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

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

    const totalRevenue = orders.reduce((sum, order) => sum + (Number(order.total_amount) || 0), 0);
    const totalOrders = orders.length;

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard Overview</h1>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Total Revenue"
                    value={`₹${totalRevenue.toLocaleString()}`}
                    icon={DollarSign}
                    trend="up"
                    trendValue="+12.5%"
                />
                <StatsCard
                    title="Orders"
                    value={totalOrders.toString()}
                    icon={ShoppingBag}
                    trend="up"
                    trendValue="+4"
                />
                <StatsCard
                    title="Active Customers"
                    value={new Set(orders.map(o => o.email)).size.toString()}
                    icon={Users}
                    trend="neutral"
                />
                <StatsCard
                    title="Growth"
                    value="+24%"
                    icon={TrendingUp}
                    trend="up"
                    description="Compared to last month"
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-4 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                    <h3 className="text-lg font-medium">Recent Activity</h3>
                    <p className="text-sm text-gray-500 mt-2">No recent activity to show.</p>
                </div>
                <div className="col-span-3 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                    <h3 className="text-lg font-medium">Top Products</h3>
                    <div className="mt-4 space-y-4">
                        <div className="flex items-center">
                            <div className="ml-4 space-y-1">
                                <p className="text-sm font-medium leading-none">Custom Stickers</p>
                                <p className="text-sm text-muted-foreground">Vinyl, Die-cut</p>
                            </div>
                            <div className="ml-auto font-medium">₹12,450</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
