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

async function checkProducts() {
    console.log('🔍 Checking Sanity for products...\n');

    // Get all products
    const products = await client.fetch(`*[_type == "product"] {
        _id,
        title,
        slug,
        category,
        basePrice,
        shortDescription,
        featuredImage
    }`);

    console.log(`📦 Found ${products.length} products in Sanity:\n`);

    if (products.length === 0) {
        console.log('❌ No products found!');
        console.log('\nMake sure you:');
        console.log('1. Created a product in Sanity Studio');
        console.log('2. Clicked "Publish" (not just "Save")');
        console.log('3. The product has all required fields filled');
        return;
    }

    products.forEach((product: any, index: number) => {
        console.log(`\n${index + 1}. ${product.title || 'NO TITLE'}`);
        console.log(`   ID: ${product._id}`);
        console.log(`   Slug: ${product.slug?.current || '❌ MISSING'}`);
        console.log(`   Category: ${product.category?.title || product.category?._ref || '❌ MISSING'}`);
        console.log(`   Base Price: ${product.basePrice || '❌ MISSING'}`);
        console.log(`   Description: ${product.shortDescription ? '✅' : '❌ MISSING'}`);
        console.log(`   Image: ${product.featuredImage ? '✅' : '❌ MISSING'}`);
    });

    // Check categories
    console.log('\n\n📁 Checking categories...\n');
    const categories = await client.fetch(`*[_type == "category"] {
        _id,
        title,
        slug
    }`);

    console.log(`Found ${categories.length} categories:\n`);
    categories.forEach((cat: any, index: number) => {
        console.log(`${index + 1}. ${cat.title} (${cat.slug?.current})`);
    });

    if (categories.length === 0) {
        console.log('❌ No categories found!');
        console.log('You need to create a category first before products will show.');
    }
}

checkProducts().catch(console.error);
