// pages/api/sales/all-sales.ts
import { NextResponse } from 'next/server';
import prisma from '../../../../../prisma'; // Ensure this import is correct for your project structure

export async function GET() {
    try {
        const sales = await prisma.sale.findMany({
            include: {
                saleProducts: {
                    include: {
                        product: true, // Include product details
                    },
                },
            },
        });

        return NextResponse.json(sales);
    } catch (error) {
        console.error('Error fetching sales data:', error);
        return NextResponse.json({ error: 'Error fetching sales data' }, { status: 500 });
    }
}
