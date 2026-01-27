"use client";

import { useEffect, useState } from "react";
import { Loader2, Mail, Phone, MapPin, User, Search, Download } from "lucide-react";
import { Order } from "@/lib/types/database";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Customer {
    id: string; // Using email as ID for deduplication in this view
    name: string;
    email: string;
    phone: string;
    totalSpent: number;
    orderCount: number;
    lastOrderDate: string;
}

export default function AdminCustomersPage() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                // We fetch orders to derive customer data
                const res = await fetch("/api/admin/orders");
                const orders: Order[] = await res.json();

                if (Array.isArray(orders)) {
                    const customerMap = new Map<string, Customer>();

                    orders.forEach(order => {
                        const email = order.email;
                        if (!customerMap.has(email)) {
                            customerMap.set(email, {
                                id: email,
                                name: order.full_name,
                                email: order.email,
                                phone: order.phone,
                                totalSpent: 0,
                                orderCount: 0,
                                lastOrderDate: order.created_at
                            });
                        }

                        const customer = customerMap.get(email)!;
                        customer.totalSpent += Number(order.total_amount);
                        customer.orderCount += 1;
                        if (new Date(order.created_at) > new Date(customer.lastOrderDate)) {
                            customer.lastOrderDate = order.created_at;
                        }
                    });

                    setCustomers(Array.from(customerMap.values()));
                }
            } catch (error) {
                console.error("Failed to load customers", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCustomers();
    }, []);

    const filteredCustomers = customers.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Customers</h1>
                    <p className="text-gray-500 mt-1">View and manage your customer base.</p>
                </div>
                <Button variant="outline" className="gap-2">
                    <Download className="h-4 w-4" />
                    Export CSV
                </Button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                    <div className="relative w-full sm:w-72">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                        <Input
                            placeholder="Search customers..."
                            className="pl-9"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="grid gap-6 p-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredCustomers.map((customer) => (
                        <div key={customer.id} className="group relative flex flex-col gap-4 rounded-lg border border-gray-200 p-6 hover:border-blue-200 hover:shadow-md transition-all bg-white">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                                    {customer.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">{customer.name}</h3>
                                    <p className="text-sm text-gray-500">Member since {new Date(customer.lastOrderDate).getFullYear()}</p>
                                </div>
                            </div>

                            <div className="space-y-2 pt-2 border-t border-gray-100">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Mail className="h-4 w-4 text-gray-400" />
                                    {customer.email}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Phone className="h-4 w-4 text-gray-400" />
                                    {customer.phone}
                                </div>
                            </div>

                            <div className="mt-auto pt-4 flex items-center justify-between text-sm">
                                <div>
                                    <p className="text-gray-500">Orders</p>
                                    <p className="font-medium text-gray-900">{customer.orderCount}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-gray-500">Total Spent</p>
                                    <p className="font-medium text-gray-900">₹{customer.totalSpent.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredCustomers.length === 0 && (
                    <div className="p-12 text-center text-gray-500">
                        No customers found matching your search.
                    </div>
                )}
            </div>
        </div>
    );
}
