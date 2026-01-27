"use client";

import { useState, useEffect } from "react";
import { X, Smartphone, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function MobileAppPopup() {
    const [isVisible, setIsVisible] = useState(false);
    const [isClosed, setIsClosed] = useState(false);

    // Configuration
    const DELAY_BEFORE_SHOW = 20000; // 20 seconds (appears after B2B popup)

    useEffect(() => {
        if (sessionStorage.getItem("mobile_app_popup_closed")) {
            setIsClosed(true);
            return;
        }

        const timer = setTimeout(() => {
            if (!isClosed) setIsVisible(true);
        }, DELAY_BEFORE_SHOW);

        return () => clearTimeout(timer);
    }, [isClosed]);

    const handleClose = () => {
        setIsVisible(false);
        setIsClosed(true);
        sessionStorage.setItem("mobile_app_popup_closed", "true");
    };

    if (isClosed && !isVisible) return null;

    return (
        <div
            className={cn(
                "fixed bottom-4 left-4 z-50 transition-all duration-500 transform",
                isVisible ? "translate-y-0 opacity-100" : "translate-y-[200%] opacity-0"
            )}
        >
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm sm:w-[320px] overflow-hidden border border-slate-100 relative group">
                {/* Close Button */}
                <button
                    onClick={() => { setIsVisible(false); setIsClosed(true); }}
                    className="absolute top-2 right-2 text-slate-300 hover:text-slate-500 p-1 z-10"
                >
                    <X className="h-4 w-4" />
                </button>

                <div className="flex">
                    {/* Image Section (Mockup) */}
                    <div className="w-1/3 bg-slate-900 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 opacity-20"></div>
                        <Smartphone className="text-white h-12 w-12 relative z-10" />
                    </div>

                    {/* Content Section */}
                    <div className="w-2/3 p-4">
                        <h3 className="font-bold text-slate-900 leading-tight mb-1">
                            Get the App
                        </h3>
                        <p className="text-xs text-slate-500 mb-3 leading-relaxed">
                            Order faster & get exclusive app-only discounts!
                        </p>

                        <div className="space-y-2">
                            <Button size="sm" className="w-full h-8 text-xs bg-black hover:bg-slate-800 text-white gap-1.5" onClick={() => alert("Redirect to App Store")}>
                                <Download className="h-3 w-3" /> Download Now
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
