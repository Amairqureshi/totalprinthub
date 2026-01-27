import { getAllProducts } from "@/lib/sanity/queries";
import { getAllCategories } from "@/lib/sanity/queries";
import { Button } from "@/components/ui/button";
import { Package, Plus, ExternalLink, Search, Filter } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";

export default async function AdminProductsPage() {
    const products = await getAllProducts();

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Products</h1>
                    <p className="text-gray-500 mt-1">Manage your product catalog from Sanity CMS.</p>
                </div>
                <div className="flex gap-2">
                    <Link href="/studio/structure/product" target="_blank">
                        <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
                            <Plus className="h-4 w-4" />
                            Create New Product
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Helper Alert */}
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start gap-3">
                <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                    <Package className="h-5 w-5" />
                </div>
                <div>
                    <h3 className="font-semibold text-blue-900 text-sm">Product Management</h3>
                    <p className="text-sm text-blue-700 mt-1">
                        TotalPrintHub uses <strong>Sanity Studio</strong> for advanced content management.
                        Clicking "Create" or "Edit" will open a new tab where you can upload images, set prices, and manage variants.
                    </p>
                </div>
            </div>

            {/* Filters Bar (Visual Only for now as this is server component) */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50/50">
                    <div className="relative w-full sm:w-72">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                        <Input
                            placeholder="Search products..."
                            className="pl-9 bg-white"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-50 border-b border-gray-100 text-xs uppercase font-medium text-gray-500">
                            <tr>
                                <th className="px-6 py-4">Product Name</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4 text-right">Base Price</th>
                                <th className="px-6 py-4 text-center">Status</th>
                                <th className="px-6 py-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {products.map((product) => (
                                <tr key={product._id} className="hover:bg-gray-50/80 transition-colors group">
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-gray-100 p-2 rounded-lg">
                                                <Package className="h-5 w-5 text-gray-500" />
                                            </div>
                                            {product.title}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                                            {product.category?.title || 'Uncategorized'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right font-mono text-gray-900">
                                        ₹{product.basePrice}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700">
                                            Active
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <Link href={`/studio/desk/structure/product;${product._id}`} target="_blank">
                                            <Button variant="ghost" size="sm" className="gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                                                Edit <ExternalLink className="h-3 w-3" />
                                            </Button>
                                        </Link>
                                    </td>
                                </tr>
                            ))}

                            {products.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                        No products found in Sanity.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
