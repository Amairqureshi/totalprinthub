"use client";

import { useState, useEffect, useRef } from "react";
import { X, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function B2BPricingPopup() {
    const [isVisible, setIsVisible] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isClosed, setIsClosed] = useState(false);

    // Form State
    const [whatsapp, setWhatsapp] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    // Configuration
    const DELAY_BEFORE_SHOW = 12000;
    const DURATION_TO_SHOW = 10000;
    const PROGRESS_INTERVAL = 100;

    useEffect(() => {
        // Check session storage immediately on mount
        const isSessionClosed = sessionStorage.getItem("b2b_popup_closed");
        if (isSessionClosed) {
            setIsClosed(true);
            return;
        }

        const timer = setTimeout(() => {
            if (!isClosed) setIsVisible(true);
        }, DELAY_BEFORE_SHOW);

        return () => clearTimeout(timer);
    }, []); // Run once on mount

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isVisible && !isHovered && !isSubmitted && !loading) {
            const step = 100 / (DURATION_TO_SHOW / PROGRESS_INTERVAL);

            interval = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 100) {
                        handleClose();
                        return 100;
                    }
                    return prev + step;
                });
            }, PROGRESS_INTERVAL);
        }

        return () => clearInterval(interval);
    }, [isVisible, isHovered, isSubmitted, loading]);

    const handleClose = () => {
        setIsVisible(false);
        setIsClosed(true);
        sessionStorage.setItem("b2b_popup_closed", "true");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await fetch("/api/b2b-request", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ whatsapp, email }),
            });
            setIsSubmitted(true);
            setTimeout(() => {
                handleClose();
            }, 3000);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (isClosed && !isVisible) return null;

    return (
        <div
            className={cn(
                "fixed bottom-4 right-4 z-50 transition-all duration-500 transform",
                isVisible ? "translate-y-0 opacity-100" : "translate-y-[200%] opacity-0"
            )}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm sm:w-[350px] overflow-hidden border border-slate-100 relative">
                {/* Progress Bar (Time Line) */}
                {!isSubmitted && !loading && (
                    <div className="absolute top-0 left-0 w-full h-1 bg-slate-100">
                        <div
                            className="h-full bg-blue-600 transition-all duration-100 ease-linear"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                )}

                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 p-1"
                >
                    <X className="h-4 w-4" />
                </button>

                <div className="p-6 pt-8 text-center">
                    {!isSubmitted ? (
                        <>
                            <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-2">
                                Unlock B2B Pricing
                            </h3>
                            <p className="text-slate-600 text-sm mb-6">
                                For Genuine Buyers & Brands only.
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-3">
                                <Input
                                    placeholder="Enter whatsapp no."
                                    className="text-center bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                                    required
                                    value={whatsapp}
                                    onChange={(e) => setWhatsapp(e.target.value)}
                                />
                                <Input
                                    type="email"
                                    placeholder="Enter email address"
                                    className="text-center bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <Button type="submit" disabled={loading} className="w-full bg-[#006A4E] hover:bg-[#00543D] text-white font-medium mt-2">
                                    {loading ? <span className="animate-spin mr-2">⏳</span> : <CheckCircle className="w-4 h-4 mr-2" />}
                                    {loading ? "Sending..." : "Get it Now"}
                                </Button>
                            </form>
                        </>
                    ) : (
                        <div className="py-8 space-y-3 animate-in fade-in zoom-in duration-300">
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
                                <CheckCircle className="h-8 w-8" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">Request Sent!</h3>
                            <p className="text-slate-500 text-sm">We'll contact you shortly with our B2B rates.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
