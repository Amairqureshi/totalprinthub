
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
    const { slug } = await params;
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

                <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-start">

                    {/* Left Column: Gallery & Highlights (Col 5) */}
                    <div className="lg:col-span-5 space-y-10">
                        <ProductGallery images={galleryImages} title={product.title} />

                        {/* Feature Highlights (Below Gallery) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-start gap-4">
                                <div className="bg-blue-100 p-2.5 rounded-full text-blue-600">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 mb-1">Fast Turnaround</h4>
                                    <p className="text-sm text-gray-500 leading-relaxed">Standard 3-day production or next-day express available.</p>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-start gap-4">
                                <div className="bg-blue-100 p-2.5 rounded-full text-blue-600">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 mb-1">Pro Quality</h4>
                                    <p className="text-sm text-gray-500 leading-relaxed">Weather-proof, scratch-resistant materials for all surfaces.</p>
                                </div>
                            </div>
                        </div>

                        {/* Detailed Description */}
                        <div className="pt-8 border-t border-gray-200">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">Product Details</h2>
                            <div className="prose prose-slate max-w-none text-gray-600 leading-loose">
                                <p>{product.shortDescription}</p>
                                <p>Our premium stickers are engineered for durability and vibrancy. We use high-quality vinyl and paper stocks paired with advanced adhesive technology to ensure your stickers stay put and look great in any condition.</p>
                                <ul className="mt-4 space-y-2 list-none pl-0">
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> Weatherproof vinyl options</li>
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> UV-resistant inks prevent fading</li>
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> Precise die-cutting for any shape</li>
                                </ul>
                            </div>
                        </div>

                        {/* FAQ Section */}
                        <div className="pt-8 border-t border-gray-200">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">Frequently Asked Questions</h2>
                            <div className="space-y-3">
                                <details className="group bg-white rounded-xl border border-gray-200 overflow-hidden">
                                    <summary className="flex items-center justify-between p-4 cursor-pointer font-bold text-slate-800 hover:bg-gray-50 transition-colors">
                                        <span>What is the difference between Matte and Gloss?</span>
                                        <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                                    </summary>
                                    <div className="p-4 pt-0 text-gray-600 text-sm leading-relaxed">
                                        Glossy offers a shiny, vibrant finish that makes colors pop. Matte has a non-reflective, smooth finish for a more elegant and subtle look.
                                    </div>
                                </details>
                                <details className="group bg-white rounded-xl border border-gray-200 overflow-hidden">
                                    <summary className="flex items-center justify-between p-4 cursor-pointer font-bold text-slate-800 hover:bg-gray-50 transition-colors">
                                        <span>Are these stickers waterproof?</span>
                                        <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                                    </summary>
                                    <div className="p-4 pt-0 text-gray-600 text-sm leading-relaxed">
                                        Yes! Our Vinyl (White and Clear) options are fully waterproof and dishwasher safe. Paper stickers are not waterproof.
                                    </div>
                                </details>
                                <details className="group bg-white rounded-xl border border-gray-200 overflow-hidden">
                                    <summary className="flex items-center justify-between p-4 cursor-pointer font-bold text-slate-800 hover:bg-gray-50 transition-colors">
                                        <span>Can I see a proof before printing?</span>
                                        <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                                    </summary>
                                    <div className="p-4 pt-0 text-gray-600 text-sm leading-relaxed">
                                        Absolutely. We send a digital proof for approval within 24 hours of your order before we start production.
                                    </div>
                                </details>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Configurator & Specs (Col 7) */}
                    <div className="lg:col-span-7 space-y-8 lg:sticky lg:top-24">
                        <ProductConfigurator
                            productId={product._id}
                            productName={product.title}
                            productCategory={product.category.slug.current}
                            productSlug={slug}
                            pricingTiers={product.pricingTiers}
                            hasBackSide={false}
                        />

                        {/* Technical Specs Card */}
                        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
                            <h3 className="font-bold text-xl text-slate-900 mb-6">Technical Specs</h3>
                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900 text-sm">Resolution</p>
                                        <p className="text-xs text-gray-500">Minimum 300 DPI for sharp prints</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path></svg>
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900 text-sm">Color Mode</p>
                                        <p className="text-xs text-gray-500">CMYK preferred for accuracy</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path></svg>
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900 text-sm">File Formats</p>
                                        <p className="text-xs text-gray-500">PDF, AI, PSD, PNG, JPEG</p>
                                    </div>
                                </div>
                            </div>

                            <button className="mt-8 w-full py-3 bg-white border border-gray-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                                Download Templates
                            </button>
                        </div>

                        {/* Satisfaction Guarantee */}
                        <div className="bg-sky-500 rounded-2xl p-8 text-center text-white shadow-lg shadow-sky-200">
                            <div className="mx-auto bg-white/20 w-12 h-12 rounded-full flex items-center justify-center mb-4 text-white">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            </div>
                            <h4 className="font-bold text-xl mb-2">100% Satisfaction</h4>
                            <p className="text-sky-100 text-sm leading-relaxed">If you're not happy with the quality, we'll reprint your order for free.</p>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}
