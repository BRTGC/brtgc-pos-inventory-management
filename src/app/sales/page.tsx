"use client";

import withLayout from '@/components/withLayout';
import React, { useEffect, useState } from 'react';
import useCheckSessionData from '@/libs/useCheckSessionData';
import Loading from '@/components/Loading';

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
    const [isFreshDataLoading, setIsFreshDataLoading] = useState<boolean>(false);

    // Check if the session is still loading
    const sessionLoading = useCheckSessionData();

    useEffect(() => {
        const fetchSales = async () => {
            setIsFreshDataLoading(true); // Indicate that fresh data is being loaded
            try {
                // Use cached sales data first
                const cachedSales = localStorage.getItem('salesData');
                if (cachedSales) {
                    setSales(JSON.parse(cachedSales)); // Set cached sales
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
                // Handle error
                if (err instanceof Error) {
                    console.error('Fetch error:', err.message); // Log the error for debugging
                    setError(err.message || 'Unknown error occurred');
                } else {
                    setError('An unexpected error occurred');
                }
            } finally {
                setLoading(false);
                setIsFreshDataLoading(false); // Reset the loading state for fresh data
            }
        };

        if (!sessionLoading) {
            fetchSales();
        }
    }, [sessionLoading]);

    if (loading || sessionLoading || isFreshDataLoading) {
        return <Loading />; // Use your custom Loading component
    }

    if (error) {
        return <div className="text-center text-red-600">Error: {error}</div>; // Display error if something went wrong
    }

    if (sales.length === 0) {
        return <div className="text-center">No sales data available.</div>; // Show if there are no sales
    }

    return (
        <div className="container mx-auto p-4">
            <div className="flex flex-col md:flex-row md:justify-between items-center mb-4">
                <h1 className="text-2xl font-bold mb-2 md:mb-0 text-center md:text-left text-gray-800 dark:text-gray-200">Sales List</h1>
                <div>
                    <a
                        href="/sales/add-sale"
                        className="bg-blue-500 hover:bg-blue-600 sm:px-6 px-4 sm:py-3 py-2 text-gray-600 dark:text-gray-400 text-base sm:text-lg font-semibold rounded-md transition duration-200"
                    >
                        Add Sale
                    </a>
                </div>
            </div>
            <div className="overflow-x-auto rounded-lg">
                <table className="min-w-full border border-gray-300 bg-white dark:bg-gray-700 shadow-md rounded-lg">
                    <thead className="bg-gray-100 dark:bg-gray-600">
                        <tr>
                            <th className="border px-4 py-2">Sale ID</th>
                            <th className="border px-4 py-2">Timestamp</th>
                            <th className="border px-4 py-2">Payment Method</th>
                            <th className="border px-4 py-2">Products Ordered</th>
                            <th className="border px-4 py-2">Total Amount Paid</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sales.map((sale) => {
                            const totalAmountPaid = sale.saleProducts.reduce(
                                (total, saleProduct) => total + saleProduct.product.price * saleProduct.quantity,
                                0
                            );
                            return (
                                <tr key={sale.id} className="hover:bg-gray-100 text-black">
                                    <td className="border px-4 py-2">{sale.id}</td>
                                    <td className="border px-4 py-2">
                                        {new Date(sale.createdAt).toLocaleString()}
                                    </td>
                                    <td className="border px-4 py-2">{sale.paymentMethod || 'N/A'}</td>
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
                                    <td className="border px-4 py-2">${totalAmountPaid.toFixed(2)}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default withLayout(Page);
