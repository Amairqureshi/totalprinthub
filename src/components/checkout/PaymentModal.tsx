"use client";

import { X, CreditCard, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaymentModalProps {
    amount: number;
    onSuccess: () => void;
    onCancel: () => void;
}

export function PaymentModal({ amount, onSuccess, onCancel }: PaymentModalProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
                <div className="bg-[#2b3543] text-white p-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="bg-white/10 p-1.5 rounded">
                            <CreditCard className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-sm">Razorpay Trusted</h3>
                            <p className="text-xs text-slate-300">Secure Payment</p>
                        </div>
                    </div>
                    <button onClick={onCancel} className="text-slate-400 hover:text-white">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="p-6">
                    <div className="mb-6">
                        <p className="text-sm text-gray-500 mb-1">Total Payable</p>
                        <p className="text-3xl font-bold text-gray-900">₹{amount.toLocaleString()}</p>
                    </div>

                    <div className="space-y-3">
                        <div className="p-4 border border-blue-200 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors" onClick={onSuccess}>
                            <h4 className="font-bold text-blue-800">UPI / QR Code</h4>
                            <p className="text-xs text-blue-600">GooglePay, PhonePe, Paytm</p>
                        </div>
                        <div className="p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors" onClick={onSuccess}>
                            <h4 className="font-bold text-gray-800">Card</h4>
                            <p className="text-xs text-gray-500">Visa, Mastercard, RuPay</p>
                        </div>
                    </div>

                    <div className="mt-8 flex gap-3">
                        <Button variant="outline" className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700" onClick={onCancel}>
                            Cancel Payment
                        </Button>
                    </div>

                    <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-gray-400">
                        <Lock className="h-3 w-3" />
                        256-bit SSL Encrypted
                    </div>
                </div>
            </div>
        </div>
    );
}
