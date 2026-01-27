import { client } from "@/lib/sanity/client";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function SanityTestPage() {
    let debugInfo: any = {
        envVars: {
            projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'NOT SET',
            dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'NOT SET',
        },
        error: null,
        products: [],
        rawQuery: null,
    };

    try {
        // Test basic connection
        const query = `*[_type == "product"] {
      _id,
      title,
      slug,
      publishedAt,
      "categoryTitle": category->title
    }`;

        debugInfo.rawQuery = query;
        const products = await client.fetch(query);
        debugInfo.products = products;
    } catch (error: any) {
        debugInfo.error = {
            message: error.message,
            stack: error.stack,
        };
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">Sanity Connection Test</h1>

                {/* Environment Variables */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
                    <div className="space-y-2 font-mono text-sm">
                        <div>
                            <span className="text-gray-600">Project ID:</span>{' '}
                            <span className={debugInfo.envVars.projectId === 'NOT SET' ? 'text-red-600' : 'text-green-600'}>
                                {debugInfo.envVars.projectId}
                            </span>
                        </div>
                        <div>
                            <span className="text-gray-600">Dataset:</span>{' '}
                            <span className={debugInfo.envVars.dataset === 'NOT SET' ? 'text-red-600' : 'text-green-600'}>
                                {debugInfo.envVars.dataset}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Error */}
                {debugInfo.error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
                        <h2 className="text-xl font-semibold text-red-900 mb-4">Error</h2>
                        <p className="text-red-700 mb-2">{debugInfo.error.message}</p>
                        <details>
                            <summary className="cursor-pointer text-sm text-red-600">Stack trace</summary>
                            <pre className="mt-2 text-xs bg-white p-2 rounded overflow-auto">
                                {debugInfo.error.stack}
                            </pre>
                        </details>
                    </div>
                )}

                {/* Products */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">
                        Products Found: {debugInfo.products.length}
                    </h2>

                    {debugInfo.products.length === 0 ? (
                        <div className="text-gray-600">
                            <p className="mb-4">No products found. This could mean:</p>
                            <ul className="list-disc list-inside space-y-2">
                                <li>No products have been created in Sanity Studio</li>
                                <li>Products exist but haven't been published</li>
                                <li>The Sanity project ID or dataset is incorrect</li>
                            </ul>
                            <div className="mt-4 p-4 bg-blue-50 rounded">
                                <p className="font-semibold text-blue-900 mb-2">Next Steps:</p>
                                <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
                                    <li>Go to Sanity Studio: <a href="http://localhost:3333" className="underline" target="_blank">http://localhost:3333</a></li>
                                    <li>Create a product</li>
                                    <li>Click the green "Publish" button (not just save)</li>
                                    <li>Refresh this page</li>
                                </ol>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {debugInfo.products.map((product: any) => (
                                <div key={product._id} className="border border-gray-200 rounded p-4">
                                    <h3 className="font-semibold text-lg">{product.title}</h3>
                                    <div className="text-sm text-gray-600 mt-2 space-y-1">
                                        <div>ID: {product._id}</div>
                                        <div>Slug: {product.slug?.current || 'NO SLUG'}</div>
                                        <div>Category: {product.categoryTitle || 'NO CATEGORY'}</div>
                                        <div>Published: {product.publishedAt || 'NOT PUBLISHED'}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Raw Data */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">Raw Response</h2>
                    <pre className="text-xs bg-gray-50 p-4 rounded overflow-auto max-h-96">
                        {JSON.stringify(debugInfo, null, 2)}
                    </pre>
                </div>
            </div>
        </div>
    );
}
