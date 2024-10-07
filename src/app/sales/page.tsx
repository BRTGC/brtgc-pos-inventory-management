"use client"

import withLayout from '@/components/withLayout'
import React, { useEffect, useState } from 'react'

const page = () => {
    const [sales, setSales] = useState<Sale[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSales = async () => {
            try {
                const response = await fetch('/api/sales/all-sales'); // Adjust the API endpoint accordingly
                if (!response.ok) {
                    throw new Error('Failed to fetch sales data');
                }
                const data = await response.json();
                setSales(data); // Assuming the data is an array of sales
            } catch (err) {
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

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Sales List</h1>
            <table className="min-w-full border border-gray-300">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border px-4 py-2">Sale ID</th>
                        <th className="border px-4 py-2">Timestamp</th>
                        <th className="border px-4 py-2">Payment Method</th>
                        <th className="border px-4 py-2">Products</th>
                    </tr>
                </thead>
                <tbody>
                    {sales.map((sale) => (
                        <tr key={sale.id}>
                            <td className="border px-4 py-2">{sale.id}</td>
                            <td className="border px-4 py-2">{new Date(sale.createdAt).toLocaleString()}</td>
                            <td className="border px-4 py-2">{sale.paymentMethod}</td>
                            <td className="border px-4 py-2">
                                {sale.saleProducts.map((sp) => (
                                    <div key={sp.id}>
                                        {sp.product.name} (Quantity: {sp.quantity})
                                    </div>
                                ))}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default withLayout(page)