import { createClient } from '@sanity/client';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '8yt7desf',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2024-01-01',
    token: process.env.SANITY_API_TOKEN,
    useCdn: false,
});

async function testProductQuery() {
    console.log('🔍 Testing the EXACT query used by the products page...\n');

    // This is the EXACT query from getAllProducts()
    const query = `*[_type == "product"] | order(_createdAt desc) {
        _id,
        title,
        slug,
        shortDescription,
        longDescription,
        keywords,
        category->{
          _id,
          title,
          slug
        },
        basePrice,
        pricingTiers,
        featuredImage{
          asset->{
            _id,
            url
          },
          alt
        },
        productImages[]{
          asset->{
            _id,
            url
          },
          alt
        },
        hasBackSide,
        metaTitle,
        metaDescription,
        canonicalUrl,
        schemaJSON,
        publishedAt
      }`;

    const products = await client.fetch(query);

    console.log(`📦 Query returned ${products.length} products\n`);

    if (products.length === 0) {
        console.log('❌ NO PRODUCTS RETURNED!\n');
        console.log('This means the query is working but filtering out all products.');
        console.log('\nPossible reasons:');
        console.log('1. Products are not published (still in draft)');
        console.log('2. Products are missing required fields');
        console.log('3. Category reference is broken');
        return;
    }

    products.forEach((product: any, index: number) => {
        console.log(`\n${'='.repeat(60)}`);
        console.log(`Product ${index + 1}: ${product.title}`);
        console.log(`${'='.repeat(60)}`);
        console.log(`✅ Title: ${product.title}`);
        console.log(`${product.slug?.current ? '✅' : '❌'} Slug: ${product.slug?.current || 'MISSING'}`);
        console.log(`${product.category ? '✅' : '❌'} Category: ${product.category?.title || 'MISSING - REFERENCE NOT RESOLVED'}`);
        console.log(`${product.basePrice ? '✅' : '❌'} Base Price: ${product.basePrice || 'MISSING'}`);
        console.log(`${product.shortDescription ? '✅' : '❌'} Short Description: ${product.shortDescription ? 'Present' : 'MISSING'}`);
        console.log(`${product.featuredImage?.asset?.url ? '✅' : '❌'} Featured Image: ${product.featuredImage?.asset?.url ? 'Present' : 'MISSING'}`);

        if (!product.category) {
            console.log('\n⚠️  WARNING: Category reference is NOT resolving!');
            console.log('   This will cause the product page to crash.');
        }

        if (!product.basePrice) {
            console.log('\n⚠️  WARNING: Missing basePrice!');
            console.log('   Add a base price in Sanity Studio.');
        }
    });

    console.log(`\n\n${'='.repeat(60)}`);
    console.log('SUMMARY');
    console.log(`${'='.repeat(60)}`);
    console.log(`Total products found: ${products.length}`);
    console.log(`Products with valid category: ${products.filter((p: any) => p.category).length}`);
    console.log(`Products with basePrice: ${products.filter((p: any) => p.basePrice).length}`);
    console.log(`Products with image: ${products.filter((p: any) => p.featuredImage?.asset?.url).length}`);
}

testProductQuery().catch(console.error);
