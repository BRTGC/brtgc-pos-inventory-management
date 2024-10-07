// src/app/api/sels/add-sales/route.ts

import { NextResponse } from 'next/server';
import prisma from '../../../../../prisma'; // Adjust this import according to your project structure

export async function POST(request: Request) {
    try {
        const { products, paymentMethod } = await request.json();

        // Ensure there are products to process
        if (!products || products.length === 0) {
            return NextResponse.json({ error: 'No products provided' }, { status: 400 });
        }

        // Create the sale entry
        const sale = await prisma.sale.create({
            data: {
                paymentMethod,
                products: { // Adjusted to match the relation field
                    create: products.map((product: { productId: string; quantity: number }) => ({
                        productId: product.productId,
                        quantity: product.quantity,
                    })),
                },
            },
            include: { products: true }, // Include sale products in the response
        });

        // Update the product quantities in the database
        await Promise.all(
            products.map(async (product: { productId: string; quantity: number }) => {
                await prisma.product.update({
                    where: { id: product.productId },
                    data: { stock: { decrement: product.quantity } }, // Decrease the stock quantity by the sold amount
                });
            })
        );

        return NextResponse.json({ message: 'Sale created successfully', sale });
    } catch (error) {
        console.error('Error creating sale:', error);
        return NextResponse.json({ error: 'Failed to create sale' }, { status: 500 });
    }
}
