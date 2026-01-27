
import { NextResponse } from 'next/server';
import { clientWithToken } from '@/lib/sanity/client';

function generateSlug(text: string) {
    return text.toLowerCase()
        .replace(/[^\w ]+/g, '')
        .replace(/ +/g, '-');
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { config, selectedMaterial, selectedFinish, variants } = body;

        if (!process.env.SANITY_API_TOKEN) {
            return NextResponse.json({ error: 'Missing SANITY_API_TOKEN' }, { status: 500 });
        }

        const docName = `${config.name} - ${selectedMaterial.name}`;
        const slug = generateSlug(docName + '-' + Date.now().toString().slice(-4));

        // Map UI variants to Sanity Schema
        // Schema: variants: [{ name, width, height, pricingTiers: [{minQty, maxQty, pricePerUnit}] }]
        const sanityVariants = variants.map((v: any) => ({
            _key: v.id,
            name: v.name,
            width: v.width,
            height: v.height,
            pricingTiers: v.tiers.map((t: any) => ({
                _key: Math.random().toString(36).substring(7),
                minQty: t.min,
                maxQty: t.max,
                pricePerUnit: t.price
            }))
        }));

        const doc = {
            _type: 'product',
            title: docName,
            slug: { _type: 'slug', current: slug },
            shortDescription: `Configuration: ${selectedMaterial.name}, ${selectedFinish.name}. Available in ${variants.length} sizes.`,
            variants: sanityVariants,
            // Fallback for legacy fields if something still reads them (optional)
            basePrice: 0,
            pricingTiers: [],
        };

        // Try to find a category (optional but recommended)
        const categoryQuery = `*[_type == "category"][0]._id`;
        const categoryId = await clientWithToken.fetch(categoryQuery);
        if (categoryId) {
            // @ts-ignore
            doc.category = { _type: 'reference', _ref: categoryId };
        }

        const created = await clientWithToken.create(doc);

        return NextResponse.json({ success: true, id: created._id, title: created.title });
    } catch (error: any) {
        console.error('Sanity Create Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
