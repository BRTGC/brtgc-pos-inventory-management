import { NextResponse } from 'next/server';
import prisma from '../../../../../prisma'; // Ensure this import path matches your project structure

export async function GET() {
    try {
        // Fetch all sales along with their associated saleProducts and product details
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
