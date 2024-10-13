import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default prisma;

export const getProductById = async (id: string) => {
    const product = await prisma.product.findUnique({
        where: { id },
        select: {
            id: true,
            name: true,
            description: true,
            price: true,
            costPrice: true,
            sku: true,
            category: true,
            lowStockAlert: true,
            stock: true,
        },
    });

    if (!product) {
        throw new Error('Product not found');
    }

    return product;
};


export const updateProduct = async (
    id: string,
    data: Partial<{
        name: string;
        description: string;  // Include description
        price: number;
        costPrice: number;    // Include costPrice
        sku: string;
        category: string;     // Include category
        stock: number;
        lowStockAlert: number; // Include lowStockAlert
    }>
) => {
    return await prisma.product.update({
        where: { id },
        data,  // Spread data dynamically into the update query
    });
};

// Function to get all products with specific fields
export const getAllProducts = async () => {
    try {
        const products = await prisma.product.findMany({
            select: {
                id: true,
                name: true,
                description: true,
                price: true,
                costPrice: true,
                sku: true,
                category: true,
                stock: true,
                lowStockAlert: true,
            },
        });
        return products; // Return the filtered products
    } catch (error) {
        throw new Error('Failed to fetch products'); // Handle any errors
    }
};

export const getLowStockProducts = async () => {
    // Fetch all products from the database
    const products = await prisma.product.findMany({
        select: {
            id: true,
            name: true,
            stock: true,
            lowStockAlert: true,
        },
    });

    // Filter products that are low on stock
    const lowStockProducts = products.filter(
        (product) => product.stock <= product.lowStockAlert
    );

    return lowStockProducts;
};