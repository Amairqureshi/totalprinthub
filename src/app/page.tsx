"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Truck, Headphones, Tag, Star, Package } from "lucide-react";
import { PRODUCT_CATEGORIES } from "@/config/navigation";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-50 to-white py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Professional Printing,{" "}
                <span className="text-blue-600">Delivered to Your Doorstep.</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                High-quality custom printing for Indian businesses. From business cards to large-scale banners, get premium quality with fast Pan-India delivery.
              </p>
              <div className="flex items-center gap-2 mb-8 text-sm text-gray-500">
                <span>TRUSTED BY:</span>
                <div className="flex gap-4 font-semibold text-gray-700">
                  <span>Shopify</span>
                  <span>Zomato</span>
                  <span>Razorpay</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="h-12 px-8 text-base bg-blue-600 hover:bg-blue-700" asChild>
                  <Link href="/products">
                    Browse All Categories
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right: Product Image Mockup */}
            <div className="relative">
              <div className="bg-gradient-to-br from-orange-100 to-orange-50 rounded-3xl p-8 lg:p-12 shadow-xl">
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-4">
                  <div className="h-32 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                    <Package className="h-12 w-12 text-gray-300" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3">
                  <div className="bg-green-100 rounded-full p-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Quality Guaranteed</p>
                    <p className="text-xs text-gray-500">Premium Materials Only</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 bg-white border-y border-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <div className="bg-blue-50 rounded-lg p-3">
                <Truck className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Free Pan-India Delivery</h3>
                <p className="text-sm text-gray-500">On orders above ₹999</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-purple-50 rounded-lg p-3">
                <Headphones className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Expert Design Support</h3>
                <p className="text-sm text-gray-500">Free design help, 24x7</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-green-50 rounded-lg p-3">
                <Tag className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Bulk Pricing Discounts</h3>
                <p className="text-sm text-gray-500">Save up to 30% on bulk orders</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Now Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Trending Now</h2>
              <p className="text-gray-500 mt-1">Most loved products by businesses across India</p>
            </div>
            <Link href="/products" className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
              View All Products
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                id: "1",
                name: "Premium Matte Cards",
                category: "Business Cards",
                price: "₹199",
                badge: "BEST SELLER",
                rating: 4.9,
                image: "🎴"
              },
              {
                id: "2",
                name: "Die-Cut Vinyl Stickers",
                category: "Stickers & Labels",
                price: "₹249",
                badge: "NEW",
                rating: 5.0,
                image: "🏷️"
              },
              {
                id: "3",
                name: "Corporate Notebooks",
                category: "Books & Binding",
                price: "₹350",
                rating: 4.8,
                image: "📓"
              },
              {
                id: "4",
                name: "Premium Flyers (A5)",
                category: "Marketing",
                price: "₹699",
                badge: "SALE",
                rating: 4.7,
                image: "📄"
              },
            ].map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.category.toLowerCase().replace(/\s+/g, '-')}/${product.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-gray-100"
              >
                {product.badge && (
                  <div className="absolute top-3 left-3 z-10">
                    <span className={`text-xs font-bold px-2 py-1 rounded ${product.badge === 'BEST SELLER' ? 'bg-blue-600 text-white' :
                      product.badge === 'NEW' ? 'bg-green-600 text-white' :
                        'bg-red-600 text-white'
                      }`}>
                      {product.badge}
                    </span>
                  </div>
                )}
                <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center text-6xl group-hover:scale-105 transition-transform">
                  {product.image}
                </div>
                <div className="p-4">
                  <p className="text-xs text-gray-500 mb-1">{product.category}</p>
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900">{product.price}</span>
                    {product.rating && (
                      <div className="flex items-center text-amber-500 text-xs">
                        <Star className="w-3 h-3 fill-current mr-1" />
                        {product.rating}
                      </div>
                    )}
                  </div>
                  <Button size="sm" className="w-full mt-3 bg-blue-600 hover:bg-blue-700">
                    Add to Cart
                  </Button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Ready to make an impression?
          </h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Download our mobile app or get a custom quote for bulk requirements today. Our team of experts is ready to help you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="h-12 px-8 bg-white text-blue-600 hover:bg-gray-100" asChild>
              <Link href="/custom-quote">
                <Package className="mr-2 h-5 w-5" />
                Get Custom Quote
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8 border-white text-white hover:bg-white/10" asChild>
              <Link href="/products">
                Browse All Categories
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 pt-12 pb-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-gray-900 mb-4">Products</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/products/stickers" className="hover:text-blue-600">Stickers & Labels</Link></li>
                <li><Link href="/products/cards" className="hover:text-blue-600">Business Cards</Link></li>
                <li><Link href="/products/packaging" className="hover:text-blue-600">Custom Packaging</Link></li>
                <li><Link href="/products/marketing" className="hover:text-blue-600">Office Stationery</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/help" className="hover:text-blue-600">Help Center</Link></li>
                <li><Link href="/track-order" className="hover:text-blue-600">Track My Order</Link></li>
                <li><Link href="/policy" className="hover:text-blue-600">Returns Policy</Link></li>
                <li><Link href="/custom-quote" className="hover:text-blue-600">Bulk Order Center</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-4">Contact Us</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>📞 +91 98765 43210</li>
                <li>📧 info@totalpinthub.com</li>
                <li>📍 Mumbai, Maharashtra</li>
                <li>🕐 Mon-Sat, 9AM-6PM IST</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/privacy" className="hover:text-blue-600">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-blue-600">Terms of Service</Link></li>
                <li><Link href="/sitemap" className="hover:text-blue-600">Sitemap</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
            <p>© 2026 TotalPrintHub. All rights reserved.</p>
            <div className="flex gap-4">
              <Link href="/privacy" className="hover:text-blue-600">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-blue-600">Terms of Service</Link>
              <Link href="/sitemap" className="hover:text-blue-600">Sitemap</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
