'use client';

import withLayout from '@/components/withLayout';
import React, { useEffect, useState } from 'react';

interface Product {
    id: string;
    name: string;
    price: number;
    sku: string;
    stock: number;
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
            }
        };
        fetchProducts();
    }, []);

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
        setMessage('');
    };

    const handleAddProduct = () => {
        if (!selectedProduct || quantity <= 0) {
            setMessage('Please select a product and enter a valid quantity.');
            return;
        }

        if (quantity > selectedProduct.stock) {
            setMessage(`Cannot add more than ${selectedProduct.stock} items of ${selectedProduct.name}.`);
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
                setSelectedProducts([]);
                setPaymentMethod('cash');
                setMessage('Sale completed successfully!');
            }
        } catch (error) {
            console.error(error);
            setMessage('Error completing the sale. Please try again.');
        }
    };

    const handleNewSale = () => {
        setSelectedProducts([]);
        setSelectedProduct(null);
        setMessage('');
    };

    return (
        <div className="container mx-auto p-4 max-w-3xl h-screen text-black">
            <h1 className="text-4xl font-semibold text-center text-gray-800 dark:text-gray-200 mb-10">Create New Sale</h1>
            <form onSubmit={handleSubmit} className="space-y-8 bg-white shadow-lg rounded-lg p-8">
                {message && <p className="text-center text-red-500 font-medium">{message}</p>}

                {/* Search Product */}
                <div className="relative">
                    <label htmlFor="productSearch" className="block text-sm font-medium text-gray-700 mb-2">
                        Search Product
                    </label>
                    <input
                        type="text"
                        id="productSearch"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="block w-full border border-gray-300 outline-none rounded-lg px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Type to search product..."
                    />
                    {searchTerm && filteredProducts.length > 0 && (
                        <ul className="absolute z-20 bg-white border border-gray-200 rounded-lg mt-2 shadow-lg w-full max-h-60 overflow-y-auto">
                            {filteredProducts.map((product) => (
                                <li
                                    key={product.id}
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
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
                    <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                        <h3 className="font-medium text-lg mb-4">Selected Product</h3>
                        <p className="text-gray-600">Name: {selectedProduct.name}</p>
                        <p className="text-gray-600">Price: &#8358;{selectedProduct.price.toFixed(2)}</p>
                        <p className="text-gray-600">SKU: {selectedProduct.sku}</p>
                        <p className="text-gray-600">Stock: {selectedProduct.stock}</p>

                        <div className="mt-4">
                            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                                Quantity
                            </label>
                            <input
                                type="number"
                                id="quantity"
                                value={quantity}
                                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                                className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                                required
                                min={1}
                            />
                            <button
                                type="button"
                                onClick={handleAddProduct}
                                className="mt-3 w-full bg-green-600 text-white rounded-lg px-4 py-2 hover:bg-green-700 transition-colors"
                            >
                                Add to Cart
                            </button>
                        </div>
                    </div>
                )}

                {/* Selected Products List */}
                {selectedProducts.length > 0 && (
                    <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                        <h3 className="font-medium text-lg mb-4">Selected Products</h3>
                        <ul className="space-y-3">
                            {selectedProducts.map((sp, index) => (
                                <li key={index} className="flex justify-between items-center">
                                    <span className="text-gray-700">
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
                        <div className="mt-4 text-lg font-semibold text-gray-800">
                            Total: &#8358;{selectedProducts.reduce((acc, sp) => acc + sp.product.price * sp.quantity, 0).toFixed(2)}
                        </div>
                    </div>
                )}

                {/* Payment Method */}
                <div>
                    <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 mb-2">
                        Payment Method
                    </label>
                    <select
                        id="paymentMethod"
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        <option value="cash">Cash</option>
                        <option value="card">Card</option>
                        <option value="transfer">Transfer</option>
                    </select>
                </div>

                <div className="flex justify-between items-center">
                    <button
                        type="submit"
                        className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 transition-colors"
                    >
                        Complete Sale
                    </button>
                    <button
                        type="button"
                        onClick={handleNewSale}
                        className="bg-gray-500 text-white rounded-lg px-4 py-2 hover:bg-gray-600 transition-colors"
                    >
                        New Sale
                    </button>
                </div>
            </form>
        </div>
    );
};

export default withLayout(NewSalePage);
