"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import {
    ArrowLeft, Printer, Download, MapPin, Phone, Package, CheckCircle, Truck, Clock, AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface OrderDetail {
    id: string;
    full_name: string;
    email: string;
    phone: string;
    address_line1: string;
    city: string;
    pincode: string;
    status: string;
    total_amount: number;
    created_at: string;
    order_items: any[];
}

export default function OrderDetailsPage() {
    const router = useRouter();
    const params = useParams();
    const id = Array.isArray(params?.id) ? params?.id[0] : params?.id;

    const [order, setOrder] = useState<OrderDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        const fetchOrder = async () => {
            try {
                const res = await fetch(`/api/account/orders/${id}`);
                if (!res.ok) throw new Error("Order not found");
                const data = await res.json();
                setOrder(data);
            } catch (err: any) {
                console.error("Failed to load order", err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id]);

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
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (!order) return <div className="p-8 text-center text-red-500">Order not found</div>;

    const currentStep = getStatusStep(order.status);
    const isCancelled = order.status === 'cancelled';

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Order Details</h1>
                    <p className="text-slate-500 text-sm">Order # {order.id}</p>
                </div>
                <div className="flex gap-2">
                    <Button asChild variant="outline" className="gap-2">
                        <Link href={`/account/orders/${order.id}/invoice`}>
                            <Printer className="h-4 w-4" /> View Invoice
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Status Card */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-slate-900 mb-1 flex items-center gap-2">
                        {isCancelled ? (
                            <>
                                <AlertCircle className="h-5 w-5 text-red-600" />
                                <span className="text-red-600">Order Cancelled</span>
                            </>
                        ) : (
                            <>
                                <Truck className="h-5 w-5 text-blue-600" />
                                <span className="capitalize">{order.status}</span>
                            </>
                        )}
                    </h2>
                    <p className="text-sm text-slate-500">
                        Placed on {format(new Date(order.created_at), "MMMM d, yyyy")}
                    </p>
                </div>

                {!isCancelled && (
                    <div className="relative py-4">
                        <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-blue-600 transition-all duration-500"
                                style={{ width: `${(currentStep / 4) * 100}%` }}
                            />
                        </div>
                        <div className="relative flex justify-between text-xs font-medium text-slate-500 uppercase tracking-tight pt-4">
                            <span className={currentStep >= 1 ? "text-blue-600 font-bold" : ""}>Ordered</span>
                            <span className={currentStep >= 2 ? "text-blue-600 font-bold" : ""}>Processing</span>
                            <span className={currentStep >= 3 ? "text-blue-600 font-bold" : ""}>Shipped</span>
                            <span className={currentStep >= 4 ? "text-emerald-600 font-bold" : ""}>Delivered</span>
                        </div>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Items List */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                        <div className="bg-slate-50 px-6 py-3 border-b border-slate-100">
                            <h3 className="font-semibold text-slate-700 text-sm uppercase tracking-wide">Items in your order</h3>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {order.order_items?.map((item, idx) => (
                                <div key={idx} className="p-6 flex gap-4">
                                    <div className="h-20 w-20 bg-slate-100 rounded-lg border border-slate-200 overflow-hidden flex-shrink-0">
                                        {item.product_image && <img src={item.product_image} className="w-full h-full object-cover" />}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h4 className="font-semibold text-slate-900">{item.product_name}</h4>
                                            <p className="font-bold text-slate-900">₹{Number(item.price).toLocaleString()}</p>
                                        </div>
                                        <p className="text-sm text-slate-500">Qty: {item.quantity}</p>

                                        {/* Optional: Show config details briefly */}
                                        <div className="mt-2 text-xs text-slate-500">
                                            {item.configuration && Object.entries(item.configuration).length > 0 && "Custom Configuration Included"}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                        <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-slate-400" /> Shipping Details
                        </h3>
                        <div className="text-sm text-slate-600 space-y-1">
                            <p className="font-medium text-slate-900">{order.full_name}</p>
                            <p>{order.address_line1}</p>
                            <p>{order.city}, {order.pincode}</p>
                            <p className="pt-2">{order.phone}</p>
                        </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                        <h3 className="font-semibold text-slate-900 mb-4">Payment Summary</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between text-slate-600">
                                <span>Subtotal</span>
                                <span>₹{Number(order.total_amount).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-slate-600">
                                <span>Shipping</span>
                                <span className="text-emerald-600">Free</span>
                            </div>
                            <div className="border-t border-slate-100 pt-2 flex justify-between font-bold text-slate-900 text-base">
                                <span>Total</span>
                                <span>₹{Number(order.total_amount).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
