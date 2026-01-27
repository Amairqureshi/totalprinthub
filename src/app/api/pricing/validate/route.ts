import { NextRequest, NextResponse } from "next/server";
import { validatePricing } from "@/lib/pricing/calculator";

/**
 * Server-side pricing validation endpoint
 * Validates that client-side pricing calculations are correct
 */
export async function POST(request: NextRequest) {
    try {
        const { quantity, expectedPrice, tiers } = await request.json();

        if (!quantity || !expectedPrice) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        const isValid = validatePricing(quantity, expectedPrice, tiers);

        if (!isValid) {
            return NextResponse.json(
                {
                    valid: false,
                    error: "Price mismatch detected",
                },
                { status: 400 }
            );
        }

        return NextResponse.json({
            valid: true,
            message: "Pricing validated successfully",
        });
    } catch (error) {
        console.error("Error validating pricing:", error);
        return NextResponse.json(
            { error: "Failed to validate pricing" },
            { status: 500 }
        );
    }
}
