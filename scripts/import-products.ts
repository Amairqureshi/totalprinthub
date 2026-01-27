
import * as XLSX from 'xlsx';
import { createClient } from '@sanity/client';
import * as path from 'path';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
// import { slugify } from '../src/lib/utils';

// Load env vars from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

if (!process.env.SANITY_API_TOKEN) {
    console.error('Error: SANITY_API_TOKEN is missing in .env.local');
    process.exit(1);
}

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '8yt7desf', // Fallback or read from env
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2024-01-01',
    token: process.env.SANITY_API_TOKEN,
    useCdn: false,
});

interface ProductRow {
    title: string;
    basePrice: number;
    shortDescription?: string;
    category?: string;
    minQty?: number;
    maxQty?: number;
    pricePerUnit?: number;
    material?: string;
    finish?: string;
    shape?: string;
}

const IMPORT_FILE_NAME = 'product_import_template.xlsx'; // Default file

function simpleSlugify(text: string) {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')     // Replace spaces with -
        .replace(/[^\w\-]+/g, '') // Remove all non-word chars
        .replace(/\-\-+/g, '-');  // Replace multiple - with single -
}

async function getOrCreateCategory(categoryTitle: string) {
    if (!categoryTitle) return null;

    const slug = simpleSlugify(categoryTitle);

    // Check if exists
    const existing = await client.fetch(`*[_type == "category" && slug.current == $slug][0]`, { slug });
    if (existing) return existing._id;

    // Create if not
    const newCat = await client.create({
        _type: 'category',
        title: categoryTitle,
        slug: { _type: 'slug', current: slug }
    });
    console.log(`Created new category: ${categoryTitle}`);
    return newCat._id;
}

async function importProducts() {
    let filePath = path.resolve(process.cwd(), IMPORT_FILE_NAME);
    const csvPath = path.resolve(process.cwd(), 'product_import_template.csv');

    // Check if user provided a file argument
    if (process.argv[2]) {
        filePath = path.resolve(process.cwd(), process.argv[2]);
    } else if (fs.existsSync(csvPath)) {
        // If CSV exists and default Excel doesn't, or user prefers CSV (we can prioritise CSV if it's there? Let's check both but default to Excel if it exists, else CSV)
        // Actually, let's just use CSV if Excel doesn't exist OR if user hasn't touched the Excel template?
        // Simplest: Check if Excel exists, if not check CSV.
        if (!fs.existsSync(filePath) && fs.existsSync(csvPath)) {
            filePath = csvPath;
        }
        // If BOTH exist, we might be confused. Let's just default to the Excel file unless we want to force CSV.
        // Better yet: Tell the user what we are using.
    }

    if (!fs.existsSync(filePath)) {
        console.error(`File not found: ${filePath}`);
        console.log('Please run the generate-template script or provide a file.');
        return;
    }

    console.log(`Reading file: ${filePath}`);

    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const rows: ProductRow[] = XLSX.utils.sheet_to_json(sheet);

    console.log(`Found ${rows.length} rows to process...`);

    // Group rows by Title
    const productsMap = new Map<string, ProductRow[]>();
    for (const row of rows) {
        if (!row.title) continue;
        const title = row.title.trim();
        if (!productsMap.has(title)) {
            productsMap.set(title, []);
        }
        productsMap.get(title)?.push(row);
    }

    console.log(`Identified ${productsMap.size} unique products.`);

    for (const [title, productRows] of productsMap) {
        const mainRow = productRows[0]; // Use first row for main details
        const slug = simpleSlugify(title);
        const categoryId = mainRow.category ? await getOrCreateCategory(mainRow.category) : null;

        const productDoc: any = {
            _type: 'product',
            title: title,
            slug: { _type: 'slug', current: slug },
            basePrice: mainRow.basePrice || 0,
            shortDescription: mainRow.shortDescription || '',
            hasBackSide: false,
        };

        if (categoryId) {
            productDoc.category = { _type: 'reference', _ref: categoryId };
        }


        // Process Pricing Tiers from ALL rows for this product
        const pricingTiers = [];

        // Also gather unique attributes to enrich description
        const uniqueMaterials = new Set<string>();
        const uniqueFinishes = new Set<string>();
        const uniqueShapes = new Set<string>();

        for (const row of productRows) {
            if (row.minQty && row.maxQty && row.pricePerUnit) {
                pricingTiers.push({
                    _key: Math.random().toString(36).substring(7),
                    minQty: row.minQty,
                    maxQty: row.maxQty,
                    pricePerUnit: row.pricePerUnit
                });
            }
            if (row.material) uniqueMaterials.add(row.material);
            if (row.finish) uniqueFinishes.add(row.finish);
            if (row.shape) uniqueShapes.add(row.shape);
        }

        if (pricingTiers.length > 0) {
            productDoc.pricingTiers = pricingTiers;
        }

        // Enrich Short Description with attributes if present
        let attributesText = "";
        if (uniqueMaterials.size > 0) attributesText += `Material: ${Array.from(uniqueMaterials).join(', ')}. `;
        if (uniqueFinishes.size > 0) attributesText += `Finish: ${Array.from(uniqueFinishes).join(', ')}. `;
        if (uniqueShapes.size > 0) attributesText += `Shape: ${Array.from(uniqueShapes).join(', ')}.`;

        if (attributesText) {
            productDoc.shortDescription = (productDoc.shortDescription ? productDoc.shortDescription + "\n" : "") + attributesText;
        }


        try {
            // Check if product exists to avoid duplicates or update?
            // For this script, we'll try to create, if it conflicts on slug, we'll skip or log
            // But Sanity create() makes a new ID. We should probably check slug.
            const existing = await client.fetch(`*[_type == "product" && slug.current == $slug][0]`, { slug });

            if (existing) {
                console.log(`Product "${title}" already exists. Skipping.`);
                // Optional: Update it? 
                // await client.patch(existing._id).set(productDoc).commit();
            } else {
                const res = await client.create(productDoc);
                console.log(`Imported: ${res.title}`);
            }
        } catch (err: any) {
            console.error(`Failed to import ${title}:`, err.message);
        }
    }
    console.log('Import complete.');
}


importProducts();
