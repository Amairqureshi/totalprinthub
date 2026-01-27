import { getProductsByCategory, getAllCategories } from "@/lib/sanity/queries";
import { ProductCard } from "@/components/product/ProductCard";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface CategoryPageProps {
    params: Promise<{
        category: string;
    }>;
}

export async function generateMetadata({ params }: CategoryPageProps) {
    const { category: categorySlug } = await params;
    const categories = await getAllCategories();
    const category = categories.find((c: any) => c.slug.current === categorySlug);

    if (!category) return { title: "Category Not Found" };

    return {
        title: `${category.title} - TotalPrintHub`,
        description: category.description || `Browse our range of ${category.title} printing products.`,
    };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
    const { category: categorySlug } = await params;
    const [products, categories] = await Promise.all([
        getProductsByCategory(categorySlug),
        getAllCategories(),
    ]);

    const currentCategory = categories.find((c: any) => c.slug.current === categorySlug);

    if (!currentCategory) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-gray-50/30">
            {/* Category Header */}
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                    <Breadcrumbs
                        items={[
                            { label: "Products", href: "/products" },
                            { label: currentCategory.title, href: `/products/${categorySlug}` }
                        ]}
                    />
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="max-w-3xl">
                            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 uppercase tracking-tight">
                                {currentCategory.title}
                            </h1>
                            <p className="text-lg text-gray-600">
                                {currentCategory.description || `High-quality custom ${currentCategory.title.toLowerCase()} for all your branding and packaging needs.`}
                            </p>
                        </div>
                        <div className="flex-shrink-0">
                            <span className="text-blue-600 font-black text-4xl opacity-10 uppercase tracking-tighter select-none hidden md:block">
                                {currentCategory.title.split(' ')[0]}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar */}
                    <aside className="lg:w-64 flex-shrink-0">
                        <div className="sticky top-24 space-y-8">
                            <div>
                                <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-4">
                                    Categories
                                </h3>
                                <nav className="space-y-1">
                                    <Link
                                        href="/products"
                                        className="flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-white rounded-lg group transition-all"
                                    >
                                        All Products
                                    </Link>
                                    {categories.map((cat: any) => {
                                        const isActive = cat.slug.current === categorySlug;
                                        return (
                                            <Link
                                                key={cat._id}
                                                href={`/products/${cat.slug.current}`}
                                                className={`flex items-center justify-between px-3 py-2 text-sm font-bold rounded-lg transition-all ${isActive
                                                    ? "bg-blue-50 text-blue-700"
                                                    : "text-gray-600 hover:text-blue-600 hover:bg-white"
                                                    }`}
                                            >
                                                {cat.title}
                                                <span className={`text-[10px] px-2 py-0.5 rounded-full ${isActive ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-400"
                                                    }`}>
                                                    {cat.productCount}
                                                </span>
                                            </Link>
                                        );
                                    })}
                                </nav>
                            </div>
                        </div>
                    </aside>

                    {/* Product Grid */}
                    <div className="flex-grow">
                        <div className="flex items-center justify-between mb-8">
                            <p className="text-sm text-gray-500">
                                Found <span className="font-bold text-gray-900">{products.length}</span> {currentCategory.title}
                            </p>
                        </div>

                        {products.length === 0 ? (
                            <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Coming Soon</h3>
                                <p className="text-gray-500 max-w-xs mx-auto mb-6">
                                    We're currently preparing new products for this category. Stay tuned!
                                </p>
                                <Link href="/products">
                                    <Button variant="outline">Browse All Products</Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
                                {products.map((product) => (
                                    <ProductCard key={product._id} product={{
                                        _id: product._id,
                                        title: product.title,
                                        slug: product.slug,
                                        category: product.category,
                                        mainImage: product.featuredImage,
                                        basePrice: product.basePrice,
                                        description: product.shortDescription
                                    }} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
