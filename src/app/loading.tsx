export default function Loading() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Skeleton */}
            <div className="bg-white border-b border-gray-200">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="h-8 w-40 bg-gray-200 rounded animate-pulse" />
                        <div className="flex gap-4">
                            <div className="h-10 w-64 bg-gray-200 rounded animate-pulse" />
                            <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse" />
                            <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Skeleton */}
            <div className="container mx-auto px-4 py-8">
                <div className="space-y-8">
                    {/* Title Skeleton */}
                    <div className="space-y-3">
                        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
                        <div className="h-4 w-96 bg-gray-200 rounded animate-pulse" />
                    </div>

                    {/* Grid Skeleton */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
                                <div className="aspect-square bg-gray-200 rounded animate-pulse" />
                                <div className="space-y-2">
                                    <div className="h-4 bg-gray-200 rounded animate-pulse" />
                                    <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
                                    <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
