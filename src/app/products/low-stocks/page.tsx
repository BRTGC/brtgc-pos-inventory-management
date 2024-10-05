// src/app/products/low-stocks/page.tsx

"use client";

import withLayout from '@/components/withLayout';
import { useEffect, useState } from 'react';

const LowStockProductsPage = () => {
    const [lowStockProducts, setLowStockProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch low-stock products on component mount
    useEffect(() => {
        const fetchLowStockProducts = async () => {
            try {
                const res = await fetch('/api/low-stocks');
                if (!res.ok) {
                    throw new Error('Failed to fetch low stock products');
                }
                const data = await res.json();
                setLowStockProducts(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchLowStockProducts();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="max-w-6xl mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Low Stock Products</h1>
            {lowStockProducts.length === 0 ? (
                <p>No products are low on stock.</p>
            ) : (
                <ul className="space-y-4">
                    {lowStockProducts.map(product => (
                        <li key={product.id} className="border p-4 rounded-lg">
                            <h2 className="text-xl font-semibold">{product.name}</h2>
                            <p>Stock: {product.stock}</p>
                            <p>Low Stock Alert: {product.lowStockAlert}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default withLayout(LowStockProductsPage);
