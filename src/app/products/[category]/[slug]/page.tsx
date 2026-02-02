
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
    return (
        <div className="h-[calc(100vh-64px)] bg-gray-50/50 overflow-hidden flex flex-col">
            {/* Breadcrumbs - Compact */}
            <div className="bg-white border-b border-gray-200 shrink-0">
                <div className="container mx-auto px-4 py-2">
                    <nav className="flex items-center gap-2 text-xs text-gray-500">
                        <a href="/" className="hover:text-blue-600 transition-colors">Home</a>
                        <span>/</span>
                        <a href="/products" className="hover:text-blue-600 transition-colors">Stickers</a>
                        <span>/</span>
                        <span className="text-gray-900 font-medium truncate max-w-[200px]">{product.title}</span>
                    </nav>
                </div>
            </div>

            {/* Main Content - Full Height Grid */}
            <main className="container mx-auto px-4 py-4 h-full">

                {/* Schema JSON-LD */}
                {product.schemaJSON && (
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{ __html: product.schemaJSON }}
                    />
                )}

                <div className="lg:grid lg:grid-cols-12 lg:gap-6 h-full items-start">

                    {/* Left Column: Gallery & Info (Scrollable) */}
                    <div className="lg:col-span-5 h-full overflow-y-auto pr-2 custom-scrollbar space-y-6">
                        {/* Title Section (Moved inside left col for better 2-col flow) */}
                        <div className="mb-4">
                            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">{product.title}</h1>
                            <div className="flex items-center gap-2 text-xs">
                                <div className="flex text-amber-500">
                                    {[1, 2, 3, 4, 5].map(i => <span key={i} className="text-sm">★</span>)}
                                </div>
                                <span className="text-gray-600 font-medium">4.9 (1.2k reviews)</span>
                            </div>
                        </div>

                        <ProductGallery images={galleryImages} title={product.title} />

                        {/* Description */}
                        {product.shortDescription && (
                            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                                <h2 className="text-sm font-bold text-slate-900 mb-2">Description</h2>
                                <p className="text-xs text-gray-600 leading-relaxed">{product.shortDescription}</p>
                            </div>
                        )}

                        {/* Order Assurance */}
                        <div className="bg-blue-50/50 rounded-xl p-3 flex items-center gap-3 border border-blue-100">
                            <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-900">Satisfaction Guarantee</p>
                                <p className="text-[10px] text-slate-500">Free reprints if faulty.</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Configurator (Fixed/Scrollable internal) */}
                    <div className="lg:col-span-7 h-full overflow-y-auto pl-2 custom-scrollbar">
                        <ProductConfigurator
                            productId={product._id}
                            productName={product.title}
                            productCategory={product.category.slug.current}
                            productSlug={slug}
                            pricingTiers={product.pricingTiers}
                            hasBackSide={false}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
}
