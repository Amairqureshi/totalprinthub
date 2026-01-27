
import * as XLSX from 'xlsx';
import * as path from 'path';
import * as fs from 'fs';

// Helper to create advanced product rows
function createProduct(
    title: string,
    basePrice: number,
    category: string,
    material: string = "Vinyl",
    finish: string = "Gloss",
    shape: string = "Custom",
    minQty: number = 50,
    maxQty: number = 99,
    pricePerUnit: number = 0
) {
    if (pricePerUnit === 0) pricePerUnit = basePrice;

    // Tiers
    return [
        {
            title, category, material, finish, shape,
            minQty, maxQty, pricePerUnit
        },
        {
            title, category, material, finish, shape,
            minQty: maxQty + 1, maxQty: (maxQty + 1) * 2, pricePerUnit: parseFloat((pricePerUnit * 0.9).toFixed(2))
        },
        {
            title, category, material, finish, shape,
            minQty: ((maxQty + 1) * 2) + 1, maxQty: ((maxQty + 1) * 10), pricePerUnit: parseFloat((pricePerUnit * 0.8).toFixed(2))
        }
    ];
}

const allRows: any[] = [];

// A. Standard & Paper Stickers
allRows.push(...createProduct("Standard Stickers (Art Paper)", 3.0, "Paper Stickers", "Art Paper", "Gloss/Matte", "Custom", 50, 100));
allRows.push(...createProduct("Uncoated Paper Stickers", 3.0, "Paper Stickers", "Uncoated Paper", "Natural", "Custom", 50, 100));
allRows.push(...createProduct("Kraft Paper Stickers", 4.0, "Paper Stickers", "Kraft Paper", "Textured", "Custom", 50, 100));
allRows.push(...createProduct("Writeable Paper Stickers", 3.5, "Paper Stickers", "Writeable Paper", "Matte", "Custom", 50, 100));
allRows.push(...createProduct("Textured Labels", 5.0, "Paper Stickers", "Textured Paper", "Rough", "Custom", 50, 100));

// B. Vinyl & Durable Stickers
allRows.push(...createProduct("Premium Vinyl Stickers", 5.0, "Vinyl Stickers", "Vinyl", "Gloss/Matte", "Custom", 50, 100));
allRows.push(...createProduct("Clear Vinyl (Transparent)", 6.0, "Vinyl Stickers", "Clear Vinyl", "Gloss", "Custom", 50, 100));
allRows.push(...createProduct("White-Ink Clear Stickers", 7.0, "Vinyl Stickers", "Clear Vinyl", "Gloss + White Ink", "Custom", 50, 100));
allRows.push(...createProduct("Industrial Hi-adhesive Labels", 8.0, "Heavy Duty Stickers", "Hi-Tack Vinyl", "Gloss", "Custom", 50, 100));
allRows.push(...createProduct("Machine Stickers (Durable)", 8.0, "Heavy Duty Stickers", "Durable Vinyl", "Laminated", "Custom", 50, 100));
allRows.push(...createProduct("Vehicle Bumper Stickers", 10.0, "Vinyl Stickers", "Outdoor Vinyl", "UV Resistant", "Rectangle", 10, 50));
allRows.push(...createProduct("Front Adhesive / Reverse Gumming", 7.0, "Vinyl Stickers", "Clear Vinyl", "Inside Glass", "Custom", 50, 100));

// C. Exclusive & Special Effect Stickers
allRows.push(...createProduct("Holographic Stickers", 9.0, "Exclusive Stickers", "Holographic Vinyl", "Rainbow Shine", "Die Cut", 50, 100));
allRows.push(...createProduct("Gold & Silver Foil Stickers", 12.0, "Exclusive Stickers", "Foil Film", "Metallic", "Custom", 50, 100));
allRows.push(...createProduct("3D Raised & Embossed UV", 15.0, "Exclusive Stickers", "UV Resin", "Embossed", "Custom", 50, 100));
allRows.push(...createProduct("3D Dome Stickers", 30.0, "Exclusive Stickers", "Epoxy Resin", "Domed", "Custom", 50, 100));
allRows.push(...createProduct("Metal Stickers (Luxury)", 25.0, "Exclusive Stickers", "Metal", "Metallic", "Custom", 50, 100));
allRows.push(...createProduct("Retro Reflective Stickers", 20.0, "Exclusive Stickers", "Reflective Vinyl", "Reflective", "Custom", 50, 100));
allRows.push(...createProduct("Glow in the Dark Stickers", 22.0, "Exclusive Stickers", "Phosphorescent", "Glow", "Custom", 50, 100));
allRows.push(...createProduct("Void (Tamper Proof) Labels", 6.0, "Exclusive Stickers", "Destructible Vinyl", "Tamper Evident", "Rectangle", 100, 500));
allRows.push(...createProduct("Fluorescent Stickers", 8.0, "Exclusive Stickers", "Neon Vinyl", "Matte", "Custom", 50, 100));

// D. Transfer Stickers
allRows.push(...createProduct("Ink Transfer Stickers", 12.0, "Transfer Stickers", "Transfer Film", "Matte", "Custom", 50, 100));
allRows.push(...createProduct("DTF Transfer (Fabric)", 10.0, "Transfer Stickers", "DTF Film", "Heat Transfer", "Custom", 50, 100));
allRows.push(...createProduct("Vinyl Cut Decals", 15.0, "Transfer Stickers", "Cut Vinyl", "No Background", "Cut", 10, 50));

// E. Sheets & Rolls
allRows.push(...createProduct("Sticker Sheets (A4/A3)", 50.0, "Sticker Sheets", "Various", "Any", "Sheet", 10, 50));
allRows.push(...createProduct("Kiss Cut Sticker Sheets", 55.0, "Sticker Sheets", "Vinyl", "Gloss", "Sheet", 10, 50));

// F. Use-Case Specific
allRows.push(...createProduct("Candle Labels (Heat Proof)", 6.0, "Product Labels", "Heat Resistant", "Matte", "Round", 50, 100));
allRows.push(...createProduct("Bottle & Jar Labels (Waterproof)", 5.0, "Product Labels", "Waterproof Vinyl", "Gloss", "Roll", 100, 500));
allRows.push(...createProduct("Food Packaging Labels", 4.0, "Product Labels", "Food Safe", "Gloss", "Custom", 100, 500));
allRows.push(...createProduct("Warranty Labels", 5.0, "Functional Labels", "Vinyl", "Gloss", "Rectangle", 100, 500));

const wb = XLSX.utils.book_new();
const ws = XLSX.utils.json_to_sheet(allRows);

// Adjust column width
const wscols = [
    { wch: 40 }, // title
    { wch: 20 }, // category
    { wch: 15 }, // material
    { wch: 15 }, // finish
    { wch: 15 }, // shape
    { wch: 10 }, // minQty
    { wch: 10 }, // maxQty
    { wch: 15 }, // pricePerUnit
];
ws['!cols'] = wscols;

XLSX.utils.book_append_sheet(wb, ws, 'Full Catalog');

const xlsxPath = path.resolve(process.cwd(), 'kraftix_full_catalog.xlsx');
XLSX.writeFile(wb, xlsxPath);
console.log(`Created: ${xlsxPath}`);

const csvContent = XLSX.utils.sheet_to_csv(ws);
const csvPath = path.resolve(process.cwd(), 'kraftix_full_catalog.csv');
fs.writeFileSync(csvPath, csvContent);
console.log(`Created: ${csvPath}`);
