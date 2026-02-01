
import React from 'react';
import ProductEditor from '@/components/admin/ProductEditor';

export default function PricingBuilderPage() {
    return (
        <div className="p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Create New Product</h1>
                <p className="text-gray-600 mt-2">
                    Add product details, configure options, and set pricing variants.
                </p>
            </div>
            <ProductEditor />
        </div>
    );
}
