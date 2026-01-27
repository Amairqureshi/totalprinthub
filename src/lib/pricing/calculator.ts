/**
 * Pricing tier definition
 */
export type PricingTier = {
    minQty: number;
    maxQty: number;
    pricePerUnit: number;
};

/**
 * Packaging cost configuration
 */
export const PACKAGING_CONFIG = {
    baseBoxCost: 50, // Base cost for packaging
    extraPaddingCost: 25, // Cost per 100 units
    unitsPerPadding: 100, // Units threshold for extra padding
};

/**
 * Default pricing tiers (can be overridden by product-specific tiers from Sanity)
 */
export const DEFAULT_PRICING_TIERS: PricingTier[] = [
    { minQty: 1, maxQty: 99, pricePerUnit: 10 },
    { minQty: 100, maxQty: 499, pricePerUnit: 8 },
    { minQty: 500, maxQty: 999, pricePerUnit: 6 },
    { minQty: 1000, maxQty: 4999, pricePerUnit: 5 },
    { minQty: 5000, maxQty: Infinity, pricePerUnit: 4 },
];

/**
 * Get the applicable price per unit based on quantity
 */
export function getPricePerUnit(quantity: number, tiers: PricingTier[] | null = DEFAULT_PRICING_TIERS): number {
    const effectiveTiers = tiers || DEFAULT_PRICING_TIERS;
    const tier = effectiveTiers.find((t) => quantity >= t.minQty && quantity <= t.maxQty);
    return tier ? tier.pricePerUnit : effectiveTiers[effectiveTiers.length - 1].pricePerUnit;
}

/**
 * Calculate hidden packaging cost
 * Formula: BaseBoxCost + ceil(Qty / 100) × ExtraPaddingCost
 */
export function calculatePackagingCost(quantity: number): number {
    const { baseBoxCost, extraPaddingCost, unitsPerPadding } = PACKAGING_CONFIG;
    const paddingUnits = Math.ceil(quantity / unitsPerPadding);
    return baseBoxCost + paddingUnits * extraPaddingCost;
}

/**
 * Calculate final price
 * Formula: (UnitPriceForTier × Quantity) + HiddenPackagingCost
 */
export function calculateFinalPrice(
    quantity: number,
    tiers: PricingTier[] | null = DEFAULT_PRICING_TIERS
): {
    unitPrice: number;
    subtotal: number;
    packagingCost: number;
    finalPrice: number;
} {
    const unitPrice = getPricePerUnit(quantity, tiers);
    const subtotal = unitPrice * quantity;
    const packagingCost = calculatePackagingCost(quantity);
    const finalPrice = subtotal + packagingCost;

    return {
        unitPrice,
        subtotal,
        packagingCost,
        finalPrice,
    };
}

/**
 * Validate pricing calculation (for server-side validation)
 */
export function validatePricing(
    quantity: number,
    expectedPrice: number,
    tiers: PricingTier[] | null = DEFAULT_PRICING_TIERS
): boolean {
    const { finalPrice } = calculateFinalPrice(quantity, tiers);
    // Allow 1 rupee tolerance for rounding differences
    return Math.abs(finalPrice - expectedPrice) <= 1;
}
