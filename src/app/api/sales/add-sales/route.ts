import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface Product {
    id: string;
    name: string;
    quantity: number;
    sku: string;
}

interface RequestBody {
    products: Product[];
    totalAmount: string; // Assuming it's received as a string and converted later
}

export async function POST(request: Request) {
    try {
        const { products, totalAmount }: RequestBody = await request.json();

        // Step 1: Create the sales record
        const sale = await prisma.sales.create({
            data: {
                amount: parseFloat(totalAmount), // Ensure amount is a float
                createdAt: new Date(),
                saleProducts: {
                    create: products.map((product: Product) => ({
                        productName: product.name,
                        quantity: product.quantity,
                        sku: product.sku,
                        productId: product.id, // Using productId from the frontend data
                    })),
                },
            },
        });

        // Step 2: Update the stock for each product sold
        await Promise.all(
            products.map(async (product: Product) => {
                // Find the product by its ID
                const existingProduct = await prisma.product.findUnique({
                    where: { id: product.id }, // Use id to find the product
                });

                if (existingProduct) {
                    // Calculate the new stock
                    const newStock = existingProduct.stock - product.quantity;

                    // Update the product's stock
                    await prisma.product.update({
                        where: { id: product.id }, // Use id to update the product
                        data: { stock: newStock },
                    });
                }
            })
        );

        return NextResponse.json({ message: 'Sale recorded and stock updated successfully', sale }, { status: 201 });
    } catch (error) {
        console.error('Error recording sale:', error);
        return NextResponse.json({ error: 'Failed to record sale' }, { status: 500 });
    }
}
