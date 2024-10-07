// src/app/api/sales/all-sales/route.ts
// src/app/api/sales/all-sales/route.ts
import { NextResponse } from 'next/server';
import prisma from '../../../../../prisma';

export async function GET() {
    try {
        const sales = await prisma.sale.findMany({
            include: {
                saleProducts: {
                    include: {
                        product: true, // This should work if the relationship is defined correctly
                    },
                },
            },
            orderBy: {
                createdAt: 'desc', // Order sales by createdAt timestamp
            },
        });

        return NextResponse.json(sales);
    } catch (error) {
        console.error('Error fetching sales:', error);
        return NextResponse.json({ error: 'Failed to fetch sales' }, { status: 500 });
    }
}

