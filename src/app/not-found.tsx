import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, Search, ArrowLeft } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center px-4">
            <div className="max-w-2xl w-full text-center">
                {/* 404 Illustration */}
                <div className="mb-8">
                    <h1 className="text-9xl font-black text-gray-200">404</h1>
                    <div className="relative -mt-16">
                        <div className="text-6xl">📦</div>
                    </div>
                </div>

                {/* Error Message */}
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Page Not Found
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                    Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                    <Button size="lg" asChild>
                        <Link href="/">
                            <Home className="mr-2 h-5 w-5" />
                            Go Home
                        </Link>
                    </Button>
                    <Button size="lg" variant="outline" asChild>
                        <Link href="/products">
                            <Search className="mr-2 h-5 w-5" />
                            Browse Products
                        </Link>
                    </Button>
                </div>

                {/* Helpful Links */}
                <div className="border-t border-gray-200 pt-8">
                    <p className="text-sm text-gray-500 mb-4">You might be looking for:</p>
                    <div className="flex flex-wrap gap-3 justify-center">
                        <Link href="/products" className="text-sm text-blue-600 hover:text-blue-700 hover:underline">
                            All Products
                        </Link>
                        <span className="text-gray-300">•</span>
                        <Link href="/about" className="text-sm text-blue-600 hover:text-blue-700 hover:underline">
                            About Us
                        </Link>
                        <span className="text-gray-300">•</span>
                        <Link href="/contact" className="text-sm text-blue-600 hover:text-blue-700 hover:underline">
                            Contact
                        </Link>
                        <span className="text-gray-300">•</span>
                        <Link href="/help" className="text-sm text-blue-600 hover:text-blue-700 hover:underline">
                            Help Center
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
