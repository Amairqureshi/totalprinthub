
import ProductConfigurator from "@/components/product/ProductConfigurator";
import { ProductGallery } from "@/components/product/ProductGallery";
import { getProductBySlug } from "@/lib/sanity/queries";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface ProductPageProps {
    params: Promise<{
        category: string;
        slug: string;
    }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
    const { slug, category } = await params;
    const product = await getProductBySlug(slug);

    if (!product) {
        return {
            title: "Product Not Found",
        };
    }

    return {
        title: product.metaTitle || product.title,
        description: product.metaDescription || product.shortDescription,
        keywords: product.keywords,
        alternates: {
            canonical: product.canonicalUrl || `https://jhatpatprint.in/products/${category}/${slug}`,
        },
        openGraph: {
            title: product.metaTitle || product.title,
            description: product.metaDescription || product.shortDescription,
            images: product.featuredImage ? [product.featuredImage.asset.url] : [],
        },
    };
}
export default async function ProductPage({ params }: ProductPageProps) {
    const { slug } = await params;
    const product = await getProductBySlug(slug);

    if (!product) {
        notFound();
    }

    // Combine featured image and other images for gallery
    const galleryImages = [
        product.featuredImage,
        ...(product.productImages || [])
    ].filter(Boolean);

    return (
        <div className="min-h-screen bg-gray-50/50">

            {/* Breadcrumbs */}
            <div className="bg-white border-b border-gray-200">
                <div className="container mx-auto px-4 py-3">
                    <nav className="flex items-center gap-2 text-sm text-gray-500">
                        <a href="/" className="hover:text-blue-600 transition-colors">Home</a>
                        <span>/</span>
                        <a href="/products" className="hover:text-blue-600 transition-colors">Stickers</a>
                        <span>/</span>
                        <span className="text-gray-900 font-medium">{product.title}</span>
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8 md:py-12">

                {/* Product Header (Mobile/Desktop Unified for SEO) */}
                <div className="mb-8 max-w-4xl">
                    <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">{product.title}</h1>
                    <div className="flex items-center gap-4 text-sm">
                        <div className="flex text-amber-500">
                            {[1, 2, 3, 4, 5].map(i => <span key={i} className="text-lg">★</span>)}
                        </div>
                        <span className="text-gray-600 font-medium">4.9/5 based on 1,200+ reviews</span>
                    </div>
                </div>

                {/* Schema JSON-LD */}
                {product.schemaJSON && (
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{ __html: product.schemaJSON }}
                    />
                )}

                <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-start">

                    {/* Left Column: Gallery (Col 1) */}
                    <div className="space-y-6 top-24 lg:sticky">
                        <ProductGallery images={galleryImages} title={product.title} />

                        {/* Dynamic Description - Only show if exists */}
                        {product.shortDescription && (
                            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                                <h2 className="text-lg font-bold text-slate-900 mb-3">Description</h2>
                                <p className="text-sm text-gray-600 leading-relaxed">{product.shortDescription}</p>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Configurator (Col 2) */}
                    <div className="space-y-6">
                        <ProductConfigurator
                            productId={product._id}
                            productName={product.title}
                            productCategory={product.category.slug.current}
                            productSlug={slug}
                            pricingTiers={product.pricingTiers}
                            hasBackSide={false}
                        />

                        {/* Order Assurance - Replaces bulky guarantee section */}
                        <div className="bg-blue-50/50 rounded-xl p-4 flex items-center gap-3 border border-blue-100">
                            <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-900">100% Satisfaction Guarantee</p>
                                <p className="text-xs text-slate-500">Free reprints if you're not happy.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
