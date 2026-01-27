"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import {
    ArrowLeft,
    Printer,
    Download,
    Mail,
    Phone,
    MapPin,
    Package,
    Clock,
    Copy,
    Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface OrderDetail {
    id: string;
    user_id?: string;
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
    // Safely handle params.id which could be string or array
    const id = Array.isArray(params?.id) ? params?.id[0] : params?.id;

    const [order, setOrder] = useState<OrderDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState("");
    const [copied, setCopied] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        const fetchOrder = async () => {
            try {
                // Fetch directly from the single order endpoint
                const res = await fetch(`/api/admin/orders/${id}`);

                if (!res.ok) {
                    throw new Error("Order not found or loading failed");
                }

                const data = await res.json();
                setOrder(data);
            } catch (err: any) {
                console.error("Failed to load order", err);
                setError(err.message || "Failed to load order");
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id]);

    const handleStatusUpdate = async (newStatus: string) => {
        if (!order || !id) return;
        setUpdating(true);

        try {
            const res = await fetch(`/api/admin/orders/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });

            if (res.ok) {
                setOrder({ ...order, status: newStatus });
            }
        } catch (error) {
            console.error("Update failed", error);
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-slate-50 gap-4">
                <p className="text-slate-500 text-lg font-medium">{error || "Order not found"}</p>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => router.back()}>Go Back</Button>
                    <Button onClick={() => window.location.reload()}>Retry</Button>
                </div>
            </div>
        );
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'processing': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'shipped': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'delivered': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'cancelled': return 'bg-rose-100 text-rose-700 border-rose-200';
            default: return 'bg-slate-100 text-slate-700';
        }
    };



    return (
        <div className="min-h-screen bg-slate-50/50 p-6 md:p-10">
            <div className="max-w-5xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="icon" onClick={() => router.back()} className="bg-white border-slate-200">
                            <ArrowLeft className="h-4 w-4 text-slate-600" />
                        </Button>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Order #{order.id.slice(0, 8)}</h1>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide border ${getStatusColor(order.status)}`}>
                                    {order.status}
                                </span>
                            </div>
                            <p className="text-slate-500 text-sm mt-1 flex items-center gap-2">
                                <Clock className="h-3 w-3" />
                                {format(new Date(order.created_at), "PPP p")}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 bg-white p-2 rounded-lg border border-slate-200 shadow-sm">
                        <span className="text-sm font-medium text-slate-600 px-2">Update Status:</span>
                        <select
                            className="h-9 rounded-md border-slate-200 text-sm focus:ring-blue-500 focus:border-blue-500 bg-slate-50"
                            value={order.status}
                            onChange={(e) => handleStatusUpdate(e.target.value)}
                            disabled={updating}
                        >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content (Order Items) */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                                <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                                    <Package className="h-5 w-5 text-blue-600" />
                                    Order Items
                                </h2>
                                <span className="text-sm text-slate-500">{order.order_items?.length || 0} Items</span>
                            </div>
                            <div className="divide-y divide-slate-100">
                                {order.order_items?.map((item, idx) => (
                                    <div key={idx} className="p-6 flex gap-6">
                                        <div className="h-24 w-24 flex-shrink-0 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden">
                                            {item.product_image ? (
                                                <img src={item.product_image} alt={item.product_name} className="h-full w-full object-cover" />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center text-slate-400">
                                                    <Package className="h-8 w-8 opacity-50" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-semibold text-slate-900 text-lg">{item.product_name}</h3>
                                                    <div className="mt-2 space-y-1">
                                                        {item.configuration && Object.entries(item.configuration).map(([key, val]: any) => {
                                                            const isUrl = typeof val === 'string' && val.startsWith('http');
                                                            if (key === 'file' || key === 'artwork' || isUrl) {
                                                                return null;
                                                            }
                                                            return (
                                                                <p key={key} className="text-sm text-slate-600 capitalize">
                                                                    <span className="font-medium text-slate-700">{key}:</span> {val}
                                                                </p>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-lg font-bold text-slate-900">₹{Number(item.price).toLocaleString()}</p>
                                                    <p className="text-sm text-slate-500">Qty: {item.quantity}</p>
                                                </div>
                                            </div>

                                            {/* File Download Section */}
                                            {item.configuration && Object.entries(item.configuration).map(([key, val]: any) => {
                                                const isUrl = typeof val === 'string' && (val.startsWith('http') || val.startsWith('blob:') || val.includes('supabase.co'));
                                                // Be more aggressive in finding files

                                                if (isUrl) {
                                                    const downloadUrl = val;

                                                    return (
                                                        <div key={key} className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200 shadow-sm transition-all hover:bg-slate-100 group/file">
                                                            <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4">
                                                                <div className="p-2.5 bg-white rounded-lg border border-slate-100 shadow-sm text-slate-400 group-hover/file:text-blue-600 transition-colors">
                                                                    <Printer className="h-5 w-5" />
                                                                </div>
                                                                <div className="min-w-0">
                                                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                                                        {key.replace('_url', '').replace('_', ' ')}
                                                                    </p>
                                                                    <p className="text-sm font-medium text-slate-900 truncate mt-0.5">
                                                                        {val.split('/').pop() || val}
                                                                    </p>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        className="h-8 w-8 p-0"
                                                                        onClick={() => {
                                                                            navigator.clipboard.writeText(val);
                                                                            setCopied(key + idx);
                                                                            setTimeout(() => setCopied(null), 2000);
                                                                        }}
                                                                        title="Copy direct link"
                                                                    >
                                                                        {copied === (key + idx) ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                                                                    </Button>
                                                                    <Button
                                                                        asChild
                                                                        size="sm"
                                                                        className="bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-200"
                                                                    >
                                                                        <a
                                                                            href={`/api/admin/download?url=${encodeURIComponent(val)}&filename=${val.split('/').pop()}`}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            download
                                                                        >
                                                                            <Download className="h-4 w-4 mr-2" />
                                                                            Download (Proxy)
                                                                        </a>
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Info */}
                    <div className="space-y-6">
                        {/* Customer Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                                <h3 className="font-semibold text-slate-900">Customer Details</h3>
                            </div>
                            <div className="p-4 space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-slate-100 rounded-full">
                                        <div className="h-4 w-4 bg-slate-400 rounded-full" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-900">{order.full_name}</p>
                                        <p className="text-xs text-slate-500">ID: {order.user_id?.slice(0, 8) || 'Guest'}</p>
                                    </div>
                                </div>
                                <div className="space-y-3 pt-3 border-t border-slate-100">
                                    <div className="flex items-center gap-3 text-sm text-slate-600">
                                        <Mail className="h-4 w-4 text-slate-400" />
                                        <a href={`mailto:${order.email}`} className="hover:text-blue-600 transition-colors">{order.email}</a>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-slate-600">
                                        <Phone className="h-4 w-4 text-slate-400" />
                                        <span>{order.phone}</span>
                                    </div>
                                    <div className="flex items-start gap-3 text-sm text-slate-600">
                                        <MapPin className="h-4 w-4 text-slate-400 mt-0.5" />
                                        <span>
                                            {order.address_line1}<br />
                                            {order.city} - {order.pincode}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Summary */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                                <h3 className="font-semibold text-slate-900">Payment Summary</h3>
                            </div>
                            <div className="p-4 space-y-3">
                                <div className="flex justify-between text-sm text-slate-600">
                                    <span>Subtotal</span>
                                    <span>₹{Number(order.total_amount).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm text-slate-600">
                                    <span>Shipping</span>
                                    <span className="text-emerald-600 font-medium">Free</span>
                                </div>
                                <div className="flex justify-between text-sm text-slate-600">
                                    <span>Tax</span>
                                    <span>₹0.00</span>
                                </div>
                                <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                                    <span className="font-bold text-slate-900">Total Paid</span>
                                    <span className="font-bold text-xl text-blue-600">₹{Number(order.total_amount).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
