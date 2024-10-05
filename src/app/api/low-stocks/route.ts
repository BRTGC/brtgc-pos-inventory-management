// src/app/api/low-stocks/routes.ts

import { NextResponse } from 'next/server';
import { getLowStockProducts } from '../../../../prisma'; // Adjust the path to where you defined getLowStockProducts

export async function GET() {
    try {
        const lowStockProducts = await getLowStockProducts();
        return NextResponse.json(lowStockProducts);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to fetch low stock products' }, { status: 500 });
    }
}
