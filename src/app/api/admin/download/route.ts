import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const fileUrl = searchParams.get('url');
    const filename = searchParams.get('filename') || 'file';

    if (!fileUrl) {
        return new NextResponse('Missing URL parameter', { status: 400 });
    }

    try {
        // Extract public_id and resource_type from the URL
        // Example URL: https://res.cloudinary.com/dsue2mhwf/image/upload/v1769003386/totalprinthub_orders/un0ihu4njackfn7zmuyg.pdf
        // We need: totalprinthub_orders/un0ihu4njackfn7zmuyg

        let publicId = '';
        let resourceType = 'image'; // default
        let version = '';

        // Parsing logic
        // Match /upload/v12345/folder/file.ext or /upload/folder/file.ext
        const matches = fileUrl.match(/\/upload\/(?:(v\d+)\/)?(.+)\.(\w+)$/);
        if (matches) {
            version = matches[1] || ''; // Capture v12345
            publicId = matches[2];
            // Check if URL has /raw/ or /image/
            if (fileUrl.includes('/raw/')) resourceType = 'raw';
            else if (fileUrl.includes('/video/')) resourceType = 'video';
        } else {
            // Fallback for simple parsing
            const parts = fileUrl.split('/upload/');
            if (parts.length > 1) {
                const afterUpload = parts[1];
                const versionMatch = afterUpload.match(/^(v\d+)\//);
                if (versionMatch) {
                    version = versionMatch[1];
                    const withoutVersion = afterUpload.replace(/^(v\d+)\//, '');
                    publicId = withoutVersion.substring(0, withoutVersion.lastIndexOf('.'));
                } else {
                    publicId = afterUpload.substring(0, afterUpload.lastIndexOf('.'));
                }
            }
        }

        // Special handling for PDFs:
        // Cloudinary often strictly protects PDFs accessed as 'image', but allows them as 'raw'.
        // If it's a PDF, force 'raw' resource type to download the original blob.
        if (fileUrl.toLowerCase().endsWith('.pdf')) {
            console.log("[Proxy] PDF detected. Forcing resource_type: 'raw'");
            resourceType = 'raw';
            // For 'raw' resources, the public_id usually MUST include the extension
            if (!publicId.toLowerCase().endsWith('.pdf')) {
                publicId = publicId + '.pdf';
            }
        }

        // Generate a URL using the specialized private_download_url helper

        let format = fileUrl.split('.').pop();
        // If format is not found or is long (query params), default to nothing or clean it
        if (format && format.includes('?')) format = format.split('?')[0];

        // Ensure format is safe
        const safeFormat = format || '';

        console.log(`[Proxy] Generating Private Download URL for PublicID: ${publicId}, Format: ${safeFormat}, Type: ${resourceType}`);

        let downloadUrl = '';

        try {
            // Options for private download
            const options: any = {
                resource_type: resourceType,
                type: 'upload', // Try 'upload' first (signed)
                attachment: true,
                expires_at: Math.round((new Date).getTime() / 1000) + 3600
            };

            // private_download_url requires format separate from public_id usually
            downloadUrl = cloudinary.utils.private_download_url(publicId, safeFormat, options);

        } catch (e) {
            console.error("[Proxy] Error generating private_download_url:", e);
            // Fallback to basic manual construction
            const timestamp = Math.round((new Date).getTime() / 1000);
            const params = {
                public_id: publicId,
                timestamp: timestamp,
                format: safeFormat
            };
            const signature = cloudinary.utils.api_sign_request(params, process.env.CLOUDINARY_API_SECRET!);
            downloadUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/${resourceType}/upload/s--${signature}--/v${version}/${publicId}.${safeFormat}`;
        }

        console.log(`[Proxy] Fetching URL: ${downloadUrl}`);

        const response = await fetch(downloadUrl);

        if (!response.ok) {
            console.error(`[Proxy] Failed to fetch: ${downloadUrl} (${response.status})`);

            // Retry logic for PDF: Try switching to 'raw' if 'image' failed
            // Note: If we already forced raw above, this won't trigger, which is fine.
            if (resourceType === 'image' && (safeFormat === 'pdf' || fileUrl.includes('.pdf'))) {
                console.log("[Proxy] Retry: Attempting as RAW resource");
                const rawPublicId = publicId + '.pdf'; // Raw IDs often include extension
                try {
                    const rawUrl = cloudinary.utils.private_download_url(rawPublicId, 'pdf', {
                        resource_type: 'raw',
                        type: 'upload',
                        attachment: true,
                        expires_at: Math.round((new Date).getTime() / 1000) + 3600
                    });

                    console.log(`[Proxy] Retry URL: ${rawUrl}`);
                    const retryResponse = await fetch(rawUrl);

                    if (retryResponse.ok) {
                        console.log("[Proxy] Retry successful as RAW");
                        const retryHeaders = new Headers();
                        retryHeaders.set('Content-Disposition', `attachment; filename="${filename}"`);
                        retryHeaders.set('Content-Type', retryResponse.headers.get('Content-Type') || 'application/pdf');
                        const len = retryResponse.headers.get('Content-Length');
                        if (len) retryHeaders.set('Content-Length', len);

                        return new NextResponse(retryResponse.body, { headers: retryHeaders });
                    }
                } catch (err) {
                    console.error("[Proxy] Retry failed:", err);
                }
            }

            return new NextResponse(`Failed to fetch file from Cloudinary. Status: ${response.status}`, { status: response.status });
        }

        const headers = new Headers();
        headers.set('Content-Disposition', `attachment; filename="${filename}"`);
        headers.set('Content-Type', response.headers.get('Content-Type') || 'application/octet-stream');
        const contentLength = response.headers.get('Content-Length');
        if (contentLength) {
            headers.set('Content-Length', contentLength);
        }

        return new NextResponse(response.body, { headers });

    } catch (error) {
        console.error('[Proxy] Error:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
