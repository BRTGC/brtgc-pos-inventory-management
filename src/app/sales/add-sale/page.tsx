'use client';

import withLayout from '@/components/withLayout';
import React, { useEffect, useState } from 'react';

interface Product {
    id: string;
    name: string;
    price: number;
    sku: string;
}

interface SelectedProduct {
    product: Product;
    quantity: number;
}

const NewSalePage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [quantity, setQuantity] = useState<number>(1);
    const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>(() => {
        const savedProducts = localStorage.getItem('selectedProducts');
        return savedProducts ? JSON.parse(savedProducts) : [];
    });
    const [paymentMethod, setPaymentMethod] = useState<string>('cash');
    const [message, setMessage] = useState<string>('');

    // Fetch products on mount
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch('/api/products/get-all');
                if (!res.ok) throw new Error('Failed to fetch products');
                const data = await res.json();
                setProducts(data);
                setFilteredProducts(data);
            } catch (error) {
                console.error(error);
                alert('Failed to load products');
            }
        };
        fetchProducts();
    }, []);

    // Save selected products to local storage
    useEffect(() => {
        localStorage.setItem('selectedProducts', JSON.stringify(selectedProducts));
    }, [selectedProducts]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);

        const filtered = products.filter((product) =>
            product.name.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredProducts(filtered);
    };

    const handleProductSelect = (product: Product) => {
        setSelectedProduct(product);
        setQuantity(1);
        setSearchTerm('');
        setFilteredProducts([]);
        setMessage(''); // Clear message when selecting a product
    };

    const handleAddProduct = () => {
        if (!selectedProduct || quantity <= 0) {
            setMessage('Please select a product and enter a valid quantity.');
            return;
        }

        const updatedProducts = [...selectedProducts];
        const existingProductIndex = updatedProducts.findIndex(
            (sp) => sp.product.sku === selectedProduct.sku
        );

        if (existingProductIndex !== -1) {
            updatedProducts[existingProductIndex].quantity += quantity;
        } else {
            updatedProducts.push({ product: selectedProduct, quantity });
        }

        setSelectedProducts(updatedProducts);
        resetFields();
    };

    const resetFields = () => {
        setSelectedProduct(null);
        setQuantity(1);
        setSearchTerm('');
        setFilteredProducts([]);
    };

    const handleRemoveProduct = (index: number) => {
        setSelectedProducts((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (selectedProducts.length === 0) {
            setMessage('Please select at least one product.');
            return;
        }

        const totalAmount = selectedProducts.reduce((acc, sp) => acc + sp.product.price * sp.quantity, 0);

        const saleData = {
            amount: totalAmount,
            saleProducts: selectedProducts.map((sp) => ({
                productId: sp.product.id,
                quantity: sp.quantity,
            })),
            paymentMethod,
        };

        try {
            const res = await fetch('/api/sales/add-sales', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(saleData),
            });

            const data = await res.json();

            if (!res.ok) {
                setMessage(data.error || 'Failed to complete the sale.');
            } else {
                // Reset the form and show success message
                setSelectedProducts([]);
                setPaymentMethod('cash');
                setMessage('Sale completed successfully!');
            }
        } catch (error) {
            console.error(error);
            setMessage('Error completing the sale. Please try again.');
        }
    };

    return (
        <div className="container mx-auto p-4 max-w-4xl">
            <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Create New Sale</h1>
            <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow-md rounded-lg p-6">
                {/* Search Product */}
                <div className="relative">
                    <label htmlFor="productSearch" className="block text-sm font-medium text-gray-700">
                        Search Product
                    </label>
                    <input
                        type="text"
                        id="productSearch"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Type to search..."
                    />
                    {searchTerm && filteredProducts.length > 0 && (
                        <ul className="border border-gray-300 rounded-md mt-2 absolute z-10 bg-white w-full shadow-lg max-h-60 overflow-auto">
                            {filteredProducts.map((product) => (
                                <li
                                    key={product.id}
                                    className="p-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => handleProductSelect(product)}
                                >
                                    {product.name} - (SKU: {product.sku})
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Selected Product */}
                {selectedProduct && (
                    <div className="mt-4 p-4 border border-gray-300 rounded-md bg-gray-50">
                        <h3 className="font-semibold text-lg text-gray-800">Selected Product:</h3>
                        <p className="mt-2 text-gray-700">Name: {selectedProduct.name}</p>
                        <p className="text-gray-700">Price: &#8358;{selectedProduct.price.toFixed(2)}</p>
                        <p className="text-gray-700">SKU: {selectedProduct.sku}</p>
                        <div className="mt-4">
                            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                                Quantity
                            </label>
                            <input
                                type="number"
                                id="quantity"
                                value={quantity}
                                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                                min={1}
                            />
                            <button
                                type="button"
                                onClick={handleAddProduct}
                                className="mt-3 w-full bg-green-600 text-white rounded-md p-2 hover:bg-green-700 transition-colors"
                            >
                                Add Product
                            </button>
                        </div>
                    </div>
                )}

                {/* Selected Products List */}
                {selectedProducts.length > 0 && (
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Selected Products:</h3>
                        <ul className="space-y-2">
                            {selectedProducts.map((sp, index) => (
                                <li key={index} className="flex justify-between items-center p-2 border border-gray-300 rounded-md bg-gray-50">
                                    <span>
                                        {sp.product.name} - {sp.quantity} pcs - &#8358;{(sp.product.price * sp.quantity).toFixed(2)}
                                    </span>
                                    <button
                                        className="text-red-500 hover:text-red-700"
                                        onClick={() => handleRemoveProduct(index)}
                                    >
                                        Remove
                                    </button>
                                </li>
                            ))}
                        </ul>
                        <div className="mt-4 font-bold text-lg">
                            Total Amount: &#8358;{selectedProducts.reduce(
                                (acc, sp) => acc + sp.product.price * sp.quantity,
                                0
                            ).toFixed(2)}
                        </div>
                    </div>
                )}

                {/* Payment Method Selection */}
                <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                    <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="cash">Cash</option>
                        <option value="card">Card</option>
                    </select>
                </div>

                {/* Message */}
                {message && (
                    <div className="mt-4 p-2 text-red-700 bg-red-100 rounded-md">{message}</div>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    className="mt-4 w-full bg-blue-600 text-white rounded-md p-2 hover:bg-blue-700 transition-colors"
                >
                    Complete Sale
                </button>
            </form>
        </div>
    );
};

export default withLayout(NewSalePage);
