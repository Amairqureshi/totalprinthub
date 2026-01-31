
import React from 'react';
import PricingCalculator from '@/components/admin/PricingCalculator';

export default function PricingBuilderPage() {
    return (
        <div className="p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Product Pricing Builder (v2)</h1>
                <p className="text-gray-600 mt-2">
                    Calculate sticker prices, set tiers, and generate import-ready files for Sanity.
                </p>
            </div>

            <PricingCalculator />
        </div>
    );
}
