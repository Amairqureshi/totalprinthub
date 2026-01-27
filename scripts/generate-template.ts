
import * as XLSX from 'xlsx';
import * as path from 'path';
import * as fs from 'fs';

const TEMPLATE_FILE_NAME = 'product_import_template.xlsx';

const data = [
    {
        title: 'Example Product Business Card',
        basePrice: 500,
        shortDescription: 'High quality business cards',
        category: 'Business Cards',
        minQty: 100,
        maxQty: 500,
        pricePerUnit: 5,
    },
    {
        title: 'Example Flyer',
        basePrice: 1000,
        shortDescription: 'A5 Glossy Flyers',
        category: 'Marketing Materials',
        minQty: 500,
        maxQty: 1000,
        pricePerUnit: 2,
    }
];

const wb = XLSX.utils.book_new();
const ws = XLSX.utils.json_to_sheet(data);

// Add some column widths for better readability
const wscols = [
    { wch: 30 }, // title
    { wch: 10 }, // basePrice
    { wch: 30 }, // shortDescription
    { wch: 20 }, // category
    { wch: 10 }, // minQty
    { wch: 10 }, // maxQty
    { wch: 15 }, // pricePerUnit
];
ws['!cols'] = wscols;

XLSX.utils.book_append_sheet(wb, ws, 'Products');

const outputPath = path.resolve(process.cwd(), TEMPLATE_FILE_NAME);
XLSX.writeFile(wb, outputPath);
console.log(`Excel Template created at: ${outputPath}`);

// Also create a CSV version for easier editing in VS Code
const csvContent = XLSX.utils.sheet_to_csv(ws);
const csvPath = path.resolve(process.cwd(), 'product_import_template.csv');
fs.writeFileSync(csvPath, csvContent);
console.log(`CSV Template created at: ${csvPath}`);
