"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { useSearchParams } from "next/navigation";

export default function CheckoutSuccessPage() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get("order_id");
    const email = searchParams.get("email");

    useEffect(() => {
        // Trigger confetti on load
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min: number, max: number) => {
            return Math.random() * (max - min) + min;
        }

        const interval: any = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
        }, 250);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50/30">

            <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center text-center">
                <div className="bg-green-100 p-6 rounded-full mb-6 animate-in zoom-in duration-500">
                    <CheckCircle className="h-16 w-16 text-green-600" />
                </div>
                <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Order Confirmed!</h1>
                <p className="text-lg text-gray-600 max-w-lg mb-8">
                    Thank you for your order {orderId && <span className="font-mono text-gray-900">#{orderId.slice(0, 8)}</span>}.
                    We have received your request and will begin processing it shortly. You will receive an email confirmation at <span className="font-medium text-gray-900">{email}</span>.
                </p>

                {/* Sign Up CTA */}
                <div className="bg-white p-6 rounded-xl border border-blue-100 shadow-sm max-w-md w-full mb-8">
                    <h3 className="font-bold text-gray-900 mb-2">Track your order</h3>
                    <p className="text-sm text-gray-600 mb-4">
                        Create an account with <strong>{email || "your email"}</strong> to save your details and track this order.
                    </p>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700" asChild>
                        <Link href={`/signup${email ? `?email=${encodeURIComponent(email)}` : ''}`}>
                            Create Account <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>

                <div className="flex gap-4">
                    <Button variant="outline" size="lg" asChild>
                        <Link href="/">Back to Home</Link>
                    </Button>
                    <Button size="lg" asChild>
                        <Link href="/products">Continue Shopping</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
