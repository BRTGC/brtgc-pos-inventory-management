"use client";

import withLayout from '@/components/withLayout';
import React, { useEffect, useState } from 'react';
import useCheckSessionData from '@/libs/useCheckSessionData';

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
    createdAt: string; // or Date
    paymentMethod: string | null; // Allow null value
    saleProducts: SaleProduct[];
}

const Page = () => {
    const [sales, setSales] = useState<Sale[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Check if the session is still loading
    const sessionLoading = useCheckSessionData();

    useEffect(() => {
        // Only fetch sales if session check is complete
        const fetchSales = async () => {
            try {
                // First, check for cached data
                const cachedSales = localStorage.getItem('salesData');
                if (cachedSales) {
                    setSales(JSON.parse(cachedSales)); // Set cached sales if available
                }

                const response = await fetch('/api/sales/all-sales');

                // Check if response is OK, otherwise throw an error
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data: Sale[] = await response.json();
                setSales(data);

                // Cache the fetched sales data in local storage
                localStorage.setItem('salesData', JSON.stringify(data));
            } catch (err) {
                // Ensure err is treated as an instance of Error
                if (err instanceof Error) {
                    console.error('Fetch error:', err.message); // Log the error for debugging
                    setError(err.message || 'Unknown error occurred');
                } else {
                    setError('An unexpected error occurred');
                }
            } finally {
                setLoading(false);
            }
        };

        if (!sessionLoading) {
            fetchSales();
        }
    }, [sessionLoading]);

    if (loading || sessionLoading) {
        return <div>Loading...</div>; // Simple loading indicator
    }

    if (error) {
        return <div>Error: {error}</div>; // Display error if something went wrong
    }

    if (sales.length === 0) {
        return <div>No sales data available.</div>; // Show if there are no sales
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
                        <th className="border px-4 py-2">Total Amount Paid</th> {/* New column */}
                    </tr>
                </thead>
                <tbody>
                    {sales.map((sale) => {
                        const totalAmountPaid = sale.saleProducts.reduce(
                            (total, saleProduct) => total + saleProduct.product.price * saleProduct.quantity,
                            0
                        );
                        return (
                            <tr key={sale.id}>
                                <td className="border px-4 py-2">{sale.id}</td>
                                <td className="border px-4 py-2">
                                    {new Date(sale.createdAt).toLocaleString()}
                                </td>
                                <td className="border px-4 py-2">{sale.paymentMethod}</td>
                                <td className="border px-4 py-2">
                                    <ul className="list-disc list-inside">
                                        {sale.saleProducts.map((saleProduct) => (
                                            <li key={saleProduct.id}>
                                                <strong>Product Name:</strong> {saleProduct.product.name} <br />
                                                <strong>Quantity:</strong> {saleProduct.quantity}
                                            </li>
                                        ))}
                                    </ul>
                                </td>
                                <td className="border px-4 py-2">${totalAmountPaid.toFixed(2)}</td> {/* Display total */}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default withLayout(Page);
