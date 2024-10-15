// src/app/api/sales/add-sales/route.ts

import { NextResponse } from 'next/server';
import prisma from '../../../../../prisma';
import { AddSaleRequest } from '../types';

export async function POST(req: Request) {
    try {
        const body: AddSaleRequest = await req.json();

        // Validate required fields
        if (!body.amount || !Array.isArray(body.saleProducts) || body.saleProducts.length === 0 || !body.paymentMethod) {
            return NextResponse.json({ error: "Amount, saleProducts, and paymentMethod are required" }, { status: 400 });
        }

        // Create a new Sale
        const sale = await prisma.sale.create({
            data: {
                amount: body.amount,
                paymentMethod: body.paymentMethod, // Now this should work without errors
                createdAt: new Date(),
            },
        });

        // Process each SaleProduct
        const saleProductData = await Promise.all(body.saleProducts.map(async (item) => {
            const { productId, quantity } = item;

            // Fetch the product to check stock
            const product = await prisma.product.findUnique({
                where: { id: productId },
            });

            if (!product) {
                throw new Error(`Product with ID ${productId} not found`);
            }

            // Check if there is enough stock
            if (product.stock < quantity) {
                throw new Error(`Not enough stock for product ${product.name}`);
            }

            // Create SaleProduct entry
            const saleProduct = await prisma.saleProduct.create({
                data: {
                    productName: product.name,
                    quantity,
                    sku: product.sku,
                    productId,
                    saleId: sale.id,
                    createdAt: new Date(),
                },
            });

            // Update the product stock
            await prisma.product.update({
                where: { id: productId },
                data: {
                    stock: { decrement: quantity },
                },
            });

            return saleProduct;
        }));

        // Return the sale details
        return NextResponse.json({
            saleId: sale.id,
            saleProducts: saleProductData,
        }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
