"use client";

import { useState, useEffect, useMemo } from "react";
import { calculateFinalPrice, type PricingTier } from "@/lib/pricing/calculator";

export interface UseDynamicPriceOptions {
    quantity: number;
    tiers?: PricingTier[];
}

export interface PricingBreakdown {
    unitPrice: number;
    subtotal: number;
    packagingCost: number;
    finalPrice: number;
    isCalculating: boolean;
}

/**
 * Hook for dynamic pricing calculation
 * Provides real-time price updates as quantity changes
 */
export function useDynamicPrice({ quantity, tiers }: UseDynamicPriceOptions): PricingBreakdown {
    const [isCalculating, setIsCalculating] = useState(false);

    // Memoize the pricing calculation to avoid unnecessary recalculations
    const pricing = useMemo(() => {
        if (quantity <= 0) {
            return {
                unitPrice: 0,
                subtotal: 0,
                packagingCost: 0,
                finalPrice: 0,
            };
        }

        return calculateFinalPrice(quantity, tiers);
    }, [quantity, tiers]);

    // Simulate a brief calculation delay for UX feedback
    useEffect(() => {
        setIsCalculating(true);
        const timer = setTimeout(() => {
            setIsCalculating(false);
        }, 100);

        return () => clearTimeout(timer);
    }, [quantity]);

    return {
        ...pricing,
        isCalculating,
    };
}
