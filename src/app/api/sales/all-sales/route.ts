import { NextResponse } from 'next/server';
import prisma from '../../../../../prisma'; // Ensure this import path matches your project structure

// Define the Sale and SaleProduct types to ensure type safety
interface SaleProduct {
    id: string;
    product: {
        id: string;
        name: string;
        price: number; // Product price
    };
    quantity: number;
}

interface Sale {
    id: string;
    createdAt: string; // Keep as string or change to Date based on your choice
    paymentMethod: string | null; // Allow null value
    saleProducts: SaleProduct[];
}

export async function GET() {
    try {
        // Fetch all sales along with their associated saleProducts and product details
        const salesFromDB = await prisma.sale.findMany({
            include: {
                saleProducts: {
                    include: {
                        product: true, // Include product details
                    },
                },
            },
        });

        // Map the fetched sales data to match the Sale type
        const sales: Sale[] = salesFromDB.map((sale) => ({
            id: sale.id,
            createdAt: sale.createdAt.toISOString(), // Convert Date to ISO string
            paymentMethod: sale.paymentMethod, // Allow null
            saleProducts: sale.saleProducts.map((saleProduct) => ({
                id: saleProduct.id,
                product: {
                    id: saleProduct.product.id,
                    name: saleProduct.product.name,
                    price: saleProduct.product.price,
                },
                quantity: saleProduct.quantity,
            })),
        }));

        return NextResponse.json(sales);
    } catch (error) {
        console.error('Error fetching sales data:', error);
        return NextResponse.json({ error: 'Error fetching sales data' }, { status: 500 });
    }
}
