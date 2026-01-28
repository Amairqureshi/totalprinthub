"use client";

import { useState } from "react";
import { useCart } from "@/components/providers/CartProvider";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { PaymentModal } from "@/components/checkout/PaymentModal";

export default function CheckoutPage() {
    const { cartItems, cartTotal, clearCart } = useCart();
    const router = useRouter();
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [pendingOrderId, setPendingOrderId] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // 1. Create Order (Pending Payment)
            const response = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    shippingDetails: {
                        firstName: (document.getElementById("firstName") as HTMLInputElement).value,
                        lastName: (document.getElementById("lastName") as HTMLInputElement).value,
                        email: (document.getElementById("email") as HTMLInputElement).value,
                        phone: (document.getElementById("phone") as HTMLInputElement).value,
                        address: (document.getElementById("address") as HTMLInputElement).value,
                        city: (document.getElementById("city") as HTMLInputElement).value,
                        pincode: (document.getElementById("pincode") as HTMLInputElement).value,
                    },
                    cartItems,
                    totalAmount: cartTotal,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Something went wrong");
            }

            // 2. Order Created -> Show Payment Modal
            setPendingOrderId(data.orderId);
            setShowPaymentModal(true);

        } catch (error: any) {
            console.error("Checkout submission error:", error);
            toast.error(error.message || "Failed to initialize order.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePaymentSuccess = () => {
        // 3. Payment Success -> Clear Cart & Redirect
        clearCart();
        toast.success("Payment Received! Order confirmed.");

        const emailParam = encodeURIComponent((document.getElementById("email") as HTMLInputElement)?.value || "");
        router.push(`/checkout/success?order_id=${pendingOrderId}&email=${emailParam}`);
    };

    const handlePaymentCancel = () => {
        // 4. Payment Cancelled -> Keep Cart, Close Modal
        setShowPaymentModal(false);
        toast.info("Payment Cancelled. You can try again.");
    };

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 py-16 text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
                    <p className="text-gray-600 mb-8">
                        It looks like you haven't added any products to your cart yet.
                    </p>
                    <Button asChild>
                        <Link href="/products">Start Shopping</Link>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Left: Shipping Form */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                            <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
                            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName">First Name</Label>
                                        <Input id="firstName" required placeholder="John" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lastName">Last Name</Label>
                                        <Input id="lastName" required placeholder="Doe" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" required placeholder="john@example.com" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="address">Address</Label>
                                    <Input id="address" required placeholder="123 Main St" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="city">City</Label>
                                        <Input id="city" required placeholder="Mumbai" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="pincode">Pincode</Label>
                                        <Input id="pincode" required placeholder="400001" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone</Label>
                                    <Input id="phone" type="tel" required placeholder="+91 98765 43210" />
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Right: Order Summary */}
                    <div>
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 sticky top-24">
                            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                            <div className="space-y-4 mb-6">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="flex gap-4 items-start">
                                        <div className="h-16 w-16 bg-gray-100 rounded-md flex items-center justify-center flex-shrink-0 overflow-hidden">
                                            {item.productImage && (
                                                <img
                                                    src={item.productImage}
                                                    alt={item.productName}
                                                    className="h-full w-full object-contain"
                                                />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between">
                                                <h3 className="font-medium text-sm">{item.productName}</h3>
                                                <span className="text-sm font-medium">
                                                    {formatPrice(item.pricing.finalPrice)}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">
                                                Qty: {item.configuration.quantity} • {item.configuration.paperType}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-gray-200 pt-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span>{formatPrice(cartTotal)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Shipping</span>
                                    <span className="text-green-600 font-medium">Free</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2 mt-2">
                                    <span>Total</span>
                                    <span>{formatPrice(cartTotal)}</span>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                form="checkout-form"
                                className="w-full mt-6"
                                size="lg"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Processing Order...
                                    </>
                                ) : (
                                    "Place Order"
                                )}
                            </Button>

                            <p className="text-xs text-center text-gray-500 mt-4">
                                Secure Payment • Fast Delivery
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            {showPaymentModal && (
                <PaymentModal
                    amount={cartTotal}
                    onSuccess={handlePaymentSuccess}
                    onCancel={handlePaymentCancel}
                />
            )}
        </div>
    );
}
