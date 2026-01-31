
import { NextResponse } from 'next/server';
import { clientWithToken } from '@/lib/sanity/client';

export async function POST(req: Request) {
    try {
        if (!process.env.SANITY_API_TOKEN) {
            return NextResponse.json({ error: 'Missing SANITY_API_TOKEN' }, { status: 500 });
        }

        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        const buffer = await file.arrayBuffer();
        const bufferData = Buffer.from(buffer);

        // Upload to Sanity
        const asset = await clientWithToken.assets.upload('image', bufferData, {
            filename: file.name,
            contentType: file.type,
        });

        return NextResponse.json({
            success: true,
            assetId: asset._id,
            url: asset.url
        });

    } catch (error: any) {
        console.error('Upload Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
