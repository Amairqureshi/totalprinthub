
import * as XLSX from 'xlsx';
import * as path from 'path';
import * as fs from 'fs';

// Comprehensive product list based on research from kraftixdigital.in
// Organized by category with realistic pricing tiers

interface Product {
    title: string;
    category: string;
    material: string;
    finish: string;
    shape: string;
    minQty: number;
    maxQty: number;
    pricePerUnit: number;
}

const products: Product[] = [];

// Helper function to add tiered pricing
function addProduct(title: string, category: string, material: string, finish: string, shape: string, basePrice: number, moq: number = 50) {
    products.push(
        { title, category, material, finish, shape, minQty: moq, maxQty: moq * 2 - 1, pricePerUnit: basePrice },
        { title, category, material, finish, shape, minQty: moq * 2, maxQty: moq * 5 - 1, pricePerUnit: parseFloat((basePrice * 0.9).toFixed(2)) },
        { title, category, material, finish, shape, minQty: moq * 5, maxQty: moq * 20, pricePerUnit: parseFloat((basePrice * 0.8).toFixed(2)) }
    );
}

// === STICKERS & LABELS ===

// Standard Stickers
addProduct("Standard Stickers", "Stickers & Labels", "Art Paper", "Gloss/Matte", "Custom", 3.0);
addProduct("Premium Film Stickers", "Stickers & Labels", "Premium Film", "Matte", "Custom", 5.0);
addProduct("Uncoated Paper Stickers", "Stickers & Labels", "Uncoated Paper", "Natural", "Custom", 3.0);
addProduct("Kraft Paper Stickers", "Stickers & Labels", "Kraft Paper", "Natural", "Custom", 4.0);
addProduct("Writeable Paper Stickers", "Stickers & Labels", "Writeable Paper", "Matte", "Custom", 3.5);
addProduct("Gloss Laminated Paper Stickers", "Stickers & Labels", "Paper", "Gloss Laminated", "Custom", 4.5);
addProduct("Matt Laminated Paper Stickers", "Stickers & Labels", "Paper", "Matt Laminated", "Custom", 4.5);

// Vinyl Stickers
addProduct("Premium Vinyl Stickers", "Vinyl Stickers", "Vinyl", "Gloss/Matte", "Custom", 5.0);
addProduct("Clear Vinyl Stickers", "Vinyl Stickers", "Clear Vinyl", "Transparent", "Custom", 6.0);
addProduct("White-Ink Clear Stickers", "Vinyl Stickers", "Clear Vinyl", "White Ink Print", "Custom", 7.0);
addProduct("Gold Film Stickers", "Vinyl Stickers", "Gold Film", "Metallic", "Custom", 10.0);
addProduct("Silver Film Stickers", "Vinyl Stickers", "Silver Film", "Metallic", "Custom", 10.0);
addProduct("Silver & Gold Vinyl Stickers", "Vinyl Stickers", "Metallic Vinyl", "Metallic", "Custom", 12.0);

// Shape Variations
addProduct("Custom Shape Stickers", "Stickers & Labels", "Vinyl", "Gloss", "Die Cut", 4.0);
addProduct("Custom Round Stickers", "Stickers & Labels", "Vinyl", "Gloss", "Round", 3.5);
addProduct("Square & Rectangle Stickers", "Stickers & Labels", "Vinyl", "Gloss", "Square/Rectangle", 3.5);
addProduct("Die Cut Stickers", "Stickers & Labels", "Vinyl", "Gloss", "Die Cut", 4.0);
addProduct("Kiss Cut Stickers", "Stickers & Labels", "Vinyl", "Gloss", "Kiss Cut", 4.5);

// === EXCLUSIVE STICKERS ===

addProduct("3D Raised & Embossed UV Stickers", "Exclusive Stickers", "UV Resin", "Embossed", "Custom", 15.0);
addProduct("3D Dome Stickers", "Exclusive Stickers", "Epoxy Resin", "Domed", "Custom", 30.0);
addProduct("Metal Stickers – Luxury Custom Label", "Exclusive Stickers", "Metal", "Metallic", "Custom", 25.0);
addProduct("Holographic Stickers", "Exclusive Stickers", "Holographic Vinyl", "Rainbow Shine", "Die Cut", 9.0);
addProduct("Foil Stickers", "Exclusive Stickers", "Foil Film", "Gold/Silver", "Custom", 12.0);
addProduct("Retro Reflective Stickers", "Exclusive Stickers", "Reflective Vinyl", "Reflective", "Custom", 20.0);
addProduct("Glow in the Dark Stickers", "Exclusive Stickers", "Phosphorescent", "Glow", "Custom", 22.0);
addProduct("Fluorescent Stickers", "Exclusive Stickers", "Neon Vinyl", "Bright", "Custom", 8.0);
addProduct("Textured Labels", "Exclusive Stickers", "Textured Material", "Textured", "Custom", 6.0);

// Transfer & Special
addProduct("Ink Transfer Stickers", "Transfer Stickers", "Transfer Film", "Matte", "Custom", 12.0, 2);
addProduct("DTF Transfer Stickers (for Fabrics)", "Transfer Stickers", "DTF Film", "Heat Transfer", "Custom", 10.0, 10);
addProduct("Vinyl Cut Decals", "Transfer Stickers", "Cut Vinyl", "No Background", "Cut", 15.0, 10);
addProduct("Front Adhesive (Reverse) Stickers", "Transfer Stickers", "Clear Vinyl", "Inside Glass", "Custom", 7.0);
addProduct("Reverse Transparent (Front Adh)", "Transfer Stickers", "Clear Vinyl", "Transparent", "Custom", 7.0);

// Security & Functional
addProduct("Void (Tamper Proof) Label", "Security Labels", "Destructible Vinyl", "Tamper Evident", "Rectangle", 6.0, 100);
addProduct("Warranty Labels", "Functional Labels", "Vinyl", "Gloss", "Rectangle", 5.0, 100);
addProduct("One Time Use Stickers", "Functional Labels", "Paper", "Matte", "Custom", 3.0);

// === PRODUCT LABELS ===

addProduct("Product Labels", "Product Labels", "Vinyl", "Gloss", "Custom", 4.0, 100);
addProduct("Bottle & Jar Labels", "Product Labels", "Waterproof Vinyl", "Gloss", "Roll", 5.0, 100);
addProduct("Candle Labels", "Product Labels", "Heat Resistant", "Matte", "Round", 6.0);
addProduct("Food Box/Container Labels", "Product Labels", "Food Safe", "Gloss", "Custom", 4.0, 100);
addProduct("Health & Beauty Labels", "Product Labels", "Oil Resistant", "Gloss", "Custom", 5.0, 100);
addProduct("Size & Price Labels", "Product Labels", "Paper", "Matte", "Rectangle", 2.0, 100);
addProduct("Address Labels", "Product Labels", "Paper", "Matte", "Rectangle", 3.0, 100);

// === INDUSTRIAL & HEAVY DUTY ===

addProduct("Industrial Hi-adhesive Labels", "Heavy Duty Stickers", "Hi-Tack Vinyl", "Gloss", "Custom", 8.0);
addProduct("Machine Stickers (Durable)", "Heavy Duty Stickers", "Durable Vinyl", "Laminated", "Custom", 8.0);
addProduct("Warning Labels", "Heavy Duty Stickers", "Vinyl", "Laminated", "Triangle/Rectangle", 6.0);
addProduct("Gadget Stickers", "Heavy Duty Stickers", "Vinyl", "Gloss", "Custom", 5.0);

// === SPECIALTY APPLICATIONS ===

addProduct("Wall Stickers", "Specialty Stickers", "Removable Vinyl", "Matte", "Custom", 15.0, 10);
addProduct("Window / Glass Stickers", "Specialty Stickers", "Clear Vinyl", "Transparent", "Custom", 8.0);
addProduct("Vehicle Bumper Stickers", "Specialty Stickers", "Outdoor Vinyl", "UV Resistant", "Rectangle", 10.0, 10);
addProduct("Custom Shape Magnets", "Specialty Stickers", "Magnetic", "Gloss", "Custom", 20.0, 25);

// === SHEETS & BULK ===

addProduct("White A4 Sticker Sheets (Blank)", "Sticker Sheets", "Paper", "Gloss", "A4 Sheet", 15.0, 10);
addProduct("Multiple Stickers in Sheets", "Sticker Sheets", "Vinyl", "Gloss", "Sheet", 50.0, 10);
addProduct("Kiss Cut Sticker Sheets", "Sticker Sheets", "Vinyl", "Gloss", "Sheet", 55.0, 10);
addProduct("Ink Transfer A4 Sheets", "Sticker Sheets", "Transfer Film", "Matte", "A4 Sheet", 40.0, 10);
addProduct("Ink Transfer A3 Sheets", "Sticker Sheets", "Transfer Film", "Matte", "A3 Sheet", 60.0, 10);
addProduct("Stickers & Labels Trial Pack", "Sticker Sheets", "Various", "Various", "Sample Pack", 100.0, 1);

// === PACKAGING ===

addProduct("D Cut Handle Bags", "Packaging", "Non-Woven", "Printed", "Bag", 15.0, 100);
addProduct("Paper Bags", "Packaging", "Kraft Paper", "Natural", "Bag", 25.0, 100);
addProduct("Luxury Foil Paper Bags", "Packaging", "Paper + Foil", "Metallic", "Bag", 45.0, 50);
addProduct("Custom Paper Pouches", "Packaging", "Paper", "Printed", "Pouch", 20.0, 100);
addProduct("Custom Print Stand Up Zip Pouches", "Packaging", "Plastic", "Printed", "Pouch", 30.0, 100);
addProduct("Custom Packaging Tape", "Packaging", "BOPP", "Printed", "Roll", 200.0, 10);
addProduct("Custom Courier Poly Bags (with POD)", "Packaging", "Polyethylene", "Printed", "Bag", 12.0, 100);
addProduct("Custom Bubble Courier Envelopes", "Packaging", "Bubble Wrap", "Printed", "Envelope", 18.0, 50);
addProduct("Kraft Paper Mailer Envelopes", "Packaging", "Kraft Paper", "Natural", "Envelope", 15.0, 50);
addProduct("Custom Wrapping Paper Rolls", "Packaging", "Paper", "Printed", "Roll", 300.0, 10);
addProduct("Key Card Paper Sleeves", "Packaging", "Paper", "Printed", "Sleeve", 5.0, 100);
addProduct("Packing Sleeves", "Packaging", "Paper", "Printed", "Sleeve", 8.0, 100);

// === MARKETING MATERIALS ===

addProduct("Standard Business Cards", "Business Cards", "300gsm Paper", "Matte/Gloss", "Rectangle", 6.0, 50);
addProduct("Raised Spot-UV Business Cards", "Business Cards", "350gsm Paper", "Spot UV", "Rectangle", 10.0, 50);
addProduct("Event Flyers & Leaflets", "Marketing Materials", "Paper", "Gloss", "A5/A4", 5.0, 100);
addProduct("Posters", "Marketing Materials", "Paper", "Gloss", "A3/A2", 50.0, 10);
addProduct("Premium Thank You Cards", "Marketing Materials", "Card Stock", "Matte", "Card", 8.0, 50);
addProduct("Tent Cards", "Marketing Materials", "Card Stock", "Gloss", "Folded", 20.0, 25);
addProduct("Custom Roll Up Standees", "Signs & Banners", "Flex", "Printed", "Banner", 1500.0, 1);

const wb = XLSX.utils.book_new();
const ws = XLSX.utils.json_to_sheet(products);

// Set column widths
const wscols = [
    { wch: 40 }, // title
    { wch: 22 }, // category
    { wch: 18 }, // material
    { wch: 18 }, // finish
    { wch: 15 }, // shape
    { wch: 10 }, // minQty
    { wch: 10 }, // maxQty
    { wch: 12 }, // pricePerUnit
];
ws['!cols'] = wscols;

XLSX.utils.book_append_sheet(wb, ws, 'Complete Catalog');

const xlsxPath = path.resolve(process.cwd(), 'kraftix_complete_catalog.xlsx');
XLSX.writeFile(wb, xlsxPath);
console.log(`✅ Created complete catalog: ${xlsxPath}`);
console.log(`📊 Total products: ${products.length / 3} (with ${products.length} pricing tiers)`);

const csvContent = XLSX.utils.sheet_to_csv(ws);
const csvPath = path.resolve(process.cwd(), 'kraftix_complete_catalog.csv');
fs.writeFileSync(csvPath, csvContent);
console.log(`✅ Created CSV version: ${csvPath}`);
