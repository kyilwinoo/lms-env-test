import fs from 'fs';
import path from 'path';
import * as csv from 'fast-csv'; // Install fast-csv using npm


// Load Discount Data from JSON
export function loadDiscountData(): any {
    const filePath = path.join(__dirname, '../input-data/discountTestData.json');
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

// Load Customer IDs from CSV
export async function loadCustomerIDs(): Promise<string[]> {
    const customerIDs: string[] = [];
    const filePath = path.join(__dirname, '../input-data/custID.csv');
    return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csv.parse({ headers: true, trim: true })) // `trim: true` removes spaces
            .on('data', (row) => {
                console.log('🔍 Row Data:', row);  // Debugging
                if (row.customerID) {
                    customerIDs.push(row.customerID.trim());  // Trim extra spaces
                } else {
                    console.warn('⚠️ Missing "customerID" field:', row);
                }
            })
            .on('end', () => {
                console.log('✅ Final Customer IDs:', customerIDs);
                resolve(customerIDs);
            })
            .on('error', (err) => {
                console.error('❌ CSV Read Error:', err);
                reject(err);
            });
    });
}   
