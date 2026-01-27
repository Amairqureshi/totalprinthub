"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import {
    ArrowLeft, Printer, Download, MapPin, Phone, Mail, FileText
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

export default function OrderInvoicePage() {
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

    const handlePrint = () => {
        window.print();
    };

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (!order) return <div className="p-8 text-center text-red-500">Order not found</div>;

    return (
        <div className="min-h-screen bg-slate-50/50 p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-6 flex items-center justify-between print:hidden">
                    <Button variant="outline" onClick={() => router.back()} className="gap-2">
                        <ArrowLeft className="h-4 w-4" /> Back to Order Details
                    </Button>
                    <div className="flex gap-2">
                        <Button onClick={handlePrint} className="gap-2 bg-slate-900 text-white hover:bg-slate-800">
                            <Printer className="h-4 w-4" /> Print Invoice
                        </Button>
                    </div>
                </div>

                {/* INVOICE CONTAINER */}
                <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-8 md:p-12 print:shadow-none print:border-none print:p-0" id="invoice">

                    {/* Header */}
                    <div className="flex justify-between items-start border-b border-slate-100 pb-8 mb-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="h-10 w-10 bg-black text-white rounded-lg flex items-center justify-center font-bold text-xl">
                                    T
                                </div>
                                <span className="text-2xl font-bold tracking-tight text-slate-900">TotalPrintHub</span>
                            </div>
                            <div className="text-sm text-slate-500 space-y-1">
                                <p>123 Printing Avenue, Tech Park</p>
                                <p>Mumbai, Maharashtra 400001</p>
                                <p>support@totalprinthub.com</p>
                                <p>+91 98765 43210</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <h1 className="text-3xl font-light text-slate-300 uppercase tracking-widest mb-4">Invoice</h1>
                            <div className="space-y-2 text-sm">
                                <p><span className="font-semibold text-slate-700">Invoice #:</span> INV-{order.id.slice(0, 8).toUpperCase()}</p>
                                <p><span className="font-semibold text-slate-700">Date:</span> {format(new Date(order.created_at), "dd MMM yyyy")}</p>
                                <p><span className="font-semibold text-slate-700">Order Status:</span> <span className="capitalize">{order.status}</span></p>
                            </div>
                        </div>
                    </div>

                    {/* Addresses */}
                    <div className="grid grid-cols-2 gap-12 mb-12">
                        <div>
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Bill To</h3>
                            <div className="text-slate-700 text-sm space-y-1 font-medium">
                                <p className="text-lg font-bold text-slate-900 mb-2">{order.full_name}</p>
                                <p>{order.email}</p>
                                <p>{order.phone}</p>
                                <p className="text-slate-500 font-normal mt-2">{order.address_line1}</p>
                                <p className="text-slate-500 font-normal">{order.city} - {order.pincode}</p>
                            </div>
                        </div>
                        {/* Can duplicate Ship To if different, assuming same for now based on data */}
                        <div>
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Ship To</h3>
                            <div className="text-slate-700 text-sm space-y-1 font-medium">
                                <p className="text-lg font-bold text-slate-900 mb-2">{order.full_name}</p>
                                <p>{order.address_line1}</p>
                                <p>{order.city} - {order.pincode}</p>
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <table className="w-full mb-8">
                        <thead>
                            <tr className="border-b-2 border-slate-100">
                                <th className="text-left py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Item Description</th>
                                <th className="text-center py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Qty</th>
                                <th className="text-right py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Rate</th>
                                <th className="text-right py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {order.order_items?.map((item, idx) => (
                                <tr key={idx}>
                                    <td className="py-4">
                                        <p className="font-semibold text-slate-900">{item.product_name}</p>
                                        <p className="text-xs text-slate-500 mt-0.5">Custom Configuration</p>
                                    </td>
                                    <td className="py-4 text-center text-slate-600">{item.quantity}</td>
                                    <td className="py-4 text-right text-slate-600">₹{Number(item.price).toFixed(2)}</td>
                                    <td className="py-4 text-right font-medium text-slate-900">₹{(Number(item.price)).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Totals */}
                    <div className="flex justify-end border-t border-slate-100 pt-8">
                        <div className="w-64 space-y-3">
                            <div className="flex justify-between text-sm text-slate-600">
                                <span>Subtotal</span>
                                <span>₹{Number(order.total_amount).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm text-slate-600">
                                <span>Tax (0%)</span>
                                <span>₹0.00</span>
                            </div>
                            <div className="flex justify-between text-sm text-slate-600">
                                <span>Shipping</span>
                                <span>Free</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold text-slate-900 border-t-2 border-slate-100 pt-3">
                                <span>Total</span>
                                <span>₹{Number(order.total_amount).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-16 pt-8 border-t border-slate-100 text-center">
                        <p className="text-slate-900 font-medium mb-1">Thank you for your business!</p>
                        <p className="text-slate-500 text-sm">Please keep this invoice for your records.</p>
                    </div>

                </div>
            </div>
        </div>
    );
}
