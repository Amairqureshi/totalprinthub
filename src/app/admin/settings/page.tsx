"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, Bell, Lock, User } from "lucide-react";

export default function AdminSettingsPage() {
    return (
        <div className="space-y-8 max-w-4xl">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Settings</h1>
                <p className="text-gray-500 mt-1">Manage your admin profile and preferences.</p>
            </div>

            <div className="grid gap-6">
                {/* Profile Section */}
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
                        <User className="h-5 w-5 text-blue-600" />
                        <h2 className="text-lg font-semibold text-gray-900">Admin Profile</h2>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">First name</Label>
                            <Input id="firstName" defaultValue="Amair" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Last name</Label>
                            <Input id="lastName" defaultValue="Qureshi" />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" defaultValue="admin@totalprinthub.com" disabled className="bg-gray-50" />
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <Button>
                            <Save className="mr-2 h-4 w-4" />
                            Save Changes
                        </Button>
                    </div>
                </div>

                {/* Notifications Section */}
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
                        <Bell className="h-5 w-5 text-blue-600" />
                        <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="new-orders" className="flex flex-col gap-1">
                                <span>New Order Alerts</span>
                                <span className="font-normal text-xs text-gray-500">Receive an email when a new order is placed.</span>
                            </Label>
                            <input type="checkbox" id="new-orders" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="low-stock" className="flex flex-col gap-1">
                                <span>Low Stock Warnings</span>
                                <span className="font-normal text-xs text-gray-500">Get notified when inventory runs low.</span>
                            </Label>
                            <input type="checkbox" id="low-stock" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600" />
                        </div>
                    </div>
                </div>

                {/* Security Section */}
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
                        <Lock className="h-5 w-5 text-blue-600" />
                        <h2 className="text-lg font-semibold text-gray-900">Security</h2>
                    </div>

                    <div className="space-y-4">
                        <Button variant="outline" className="w-full sm:w-auto">Change Password</Button>
                        <Button variant="outline" className="w-full sm:w-auto text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200">Revoke API Keys</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
