'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log error to error reporting service
        console.error('Application error:', error);
    }, [error]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex items-center justify-center px-4">
            <div className="max-w-2xl w-full text-center">
                {/* Error Icon */}
                <div className="mb-8">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-red-100 rounded-full">
                        <AlertTriangle className="w-12 h-12 text-red-600" />
                    </div>
                </div>

                {/* Error Message */}
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Something went wrong!
                </h2>
                <p className="text-lg text-gray-600 mb-2">
                    We're sorry, but something unexpected happened.
                </p>
                {error.digest && (
                    <p className="text-sm text-gray-500 mb-8">
                        Error ID: {error.digest}
                    </p>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                    <Button size="lg" onClick={reset}>
                        <RefreshCw className="mr-2 h-5 w-5" />
                        Try Again
                    </Button>
                    <Button size="lg" variant="outline" asChild>
                        <Link href="/">
                            <Home className="mr-2 h-5 w-5" />
                            Go Home
                        </Link>
                    </Button>
                </div>

                {/* Help Text */}
                <div className="border-t border-gray-200 pt-8">
                    <p className="text-sm text-gray-500 mb-4">
                        If this problem persists, please contact our support team.
                    </p>
                    <Link href="/contact" className="text-sm text-blue-600 hover:text-blue-700 hover:underline">
                        Contact Support
                    </Link>
                </div>
            </div>
        </div>
    );
}
