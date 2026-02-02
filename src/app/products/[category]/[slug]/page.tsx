
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
        <div className="min-h-screen lg:h-[calc(100vh-64px)] bg-gray-50/50 lg:overflow-hidden flex flex-col">
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

                        {/* Feature Highlights */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex items-start gap-2">
                                <div className="bg-blue-100 p-1.5 rounded-full text-blue-600 shrink-0">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 text-xs mb-0.5">Fast Turnaround</h4>
                                    <p className="text-[10px] text-gray-500 leading-tight">3-day production or next-day express.</p>
                                </div>
                            </div>
                            <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex items-start gap-2">
                                <div className="bg-blue-100 p-1.5 rounded-full text-blue-600 shrink-0">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 text-xs mb-0.5">Pro Quality</h4>
                                    <p className="text-[10px] text-gray-500 leading-tight">Weather-proof & scratch-resistant.</p>
                                </div>
                            </div>
                        </div>

                        {/* Detailed Description */}
                        <div className="pt-4 border-t border-gray-200">
                            <h2 className="text-sm font-bold text-slate-900 mb-2">Product Details</h2>
                            <div className="prose prose-sm max-w-none text-gray-600 text-xs leading-relaxed">
                                <p>Our premium stickers are engineered for durability and vibrancy. We use high-quality vinyl and paper stocks paired with advanced adhesive technology to ensure your stickers stay put and look great in any condition.</p>
                                <ul className="mt-2 space-y-1 list-none pl-0">
                                    <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-blue-500"></div> Weatherproof vinyl options</li>
                                    <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-blue-500"></div> UV-resistant inks prevent fading</li>
                                    <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-blue-500"></div> Precise die-cutting for any shape</li>
                                </ul>
                            </div>
                        </div>

                        {/* Technical Specs */}
                        <div className="pt-4 border-t border-gray-200">
                            <h3 className="font-bold text-sm text-slate-900 mb-3">Technical Specs</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex gap-2">
                                    <div className="w-6 h-6 rounded bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900 text-xs">Resolution</p>
                                        <p className="text-[10px] text-gray-500">Min 300 DPI</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <div className="w-6 h-6 rounded bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path></svg>
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900 text-xs">Color Mode</p>
                                        <p className="text-[10px] text-gray-500">CMYK</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* FAQ Section */}
                        <div className="pt-4 border-t border-gray-200">
                            <h2 className="text-sm font-bold text-slate-900 mb-3">FAQ</h2>
                            <div className="space-y-2">
                                <details className="group bg-white rounded-lg border border-gray-200 overflow-hidden">
                                    <summary className="flex items-center justify-between p-3 cursor-pointer font-bold text-slate-800 hover:bg-gray-50 transition-colors text-xs">
                                        <span>Matte vs Gloss?</span>
                                        <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                                    </summary>
                                    <div className="p-3 pt-0 text-gray-600 text-xs leading-relaxed">
                                        Glossy offers a shiny, vibrant finish. Matte has a non-reflective, smooth elegant look.
                                    </div>
                                </details>
                                <details className="group bg-white rounded-lg border border-gray-200 overflow-hidden">
                                    <summary className="flex items-center justify-between p-3 cursor-pointer font-bold text-slate-800 hover:bg-gray-50 transition-colors text-xs">
                                        <span>Waterproof?</span>
                                        <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                                    </summary>
                                    <div className="p-3 pt-0 text-gray-600 text-xs leading-relaxed">
                                        Yes! Our Vinyl (White and Clear) options are fully waterproof. Paper is not.
                                    </div>
                                </details>
                            </div>
                        </div>

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
