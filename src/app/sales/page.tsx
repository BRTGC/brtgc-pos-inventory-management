"use client";

import withLayout from '@/components/withLayout';
import React, { useEffect, useState } from 'react';

interface Sale {
    id: string;
    createdAt: string; // or Date
    paymentMethod: string;
    saleProducts: SaleProduct[];
}

interface SaleProduct {
    id: string;
    product: {
        id: string;
        name: string;
        price: number; // Product price
    };
    quantity: number;
}

const Page = () => {
    const [sales, setSales] = useState<Sale[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSales = async () => {
            try {
                const response = await fetch('/api/sales/all-sales');
                console.log('Response status:', response.status); // Check the response status
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                console.log(data)
                setSales(data);
            } catch (err) {
                console.error('Fetch error:', err); // Log the error for debugging
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSales();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (sales.length === 0) {
        return <div>No sales data available.</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Sales List</h1>
            <table className="min-w-full border border-gray-300">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border px-4 py-2">Sale ID</th>
                        <th className="border px-4 py-2">Timestamp</th>
                        <th className="border px-4 py-2">Payment Method</th>
                        <th className="border px-4 py-2">Products Ordered</th>
                    </tr>
                </thead>
                <tbody>
                    {sales.map((sale) => (
                        <tr key={sale.id}>
                            <td className="border px-4 py-2">{sale.id}</td>
                            <td className="border px-4 py-2">{new Date(sale.createdAt).toLocaleString()}</td>
                            <td className="border px-4 py-2">{sale.paymentMethod}</td>
                            <td className="border px-4 py-2">
                                {sale.saleProducts.map((saleProduct) => (
                                    <li key={saleProduct.id}>
                                        <strong>Product Name:</strong> {saleProduct.product.name} <br />
                                        <strong>Quantity:</strong> {saleProduct.quantity}
                                    </li>
                                ))}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default withLayout(Page);
