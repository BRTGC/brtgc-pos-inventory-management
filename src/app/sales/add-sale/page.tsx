// src/app/sales/new-sales/page.tsx

'use client';

import withLayout from '@/components/withLayout';
import React, { useEffect, useState } from 'react';

interface Product {
    id: string;
    name: string;
    price: number;
    sku: string; // Assuming SKU is part of the Product
}

interface SelectedProduct {
    product: Product;
    quantity: number;
}

const NewSalePage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [products, setProducts] = useState<Product[]>([]); // All products
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [quantity, setQuantity] = useState(1); // Set default quantity to 1
    const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>(() => {
        // Load selected products from local storage on initial render
        const savedProducts = localStorage.getItem('selectedProducts');
        return savedProducts ? JSON.parse(savedProducts) : [];
    });
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [message, setMessage] = useState('');

    // Fetch products from the API only once, on mount
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

    // Save selected products to local storage whenever they change
    useEffect(() => {
        localStorage.setItem('selectedProducts', JSON.stringify(selectedProducts));
    }, [selectedProducts]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);

        // Filter products based on the search term only if there's at least one letter
        if (value.length > 0) {
            const filtered = products.filter((product) =>
                product.name.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredProducts(filtered);
        } else {
            setFilteredProducts([]); // Clear filtered products if the input is empty
        }
    };

    const handleProductSelect = (product: Product) => {
        setSelectedProduct(product);
        setQuantity(1); // Reset quantity to 1 when a product is selected
        setSearchTerm(''); // Clear search field
        setFilteredProducts([]); // Clear filtered products
    };

    const handleAddProduct = () => {
        if (!selectedProduct || quantity <= 0) {
            setMessage('Please select a product and enter a valid quantity.');
            return;
        }

        // Check if the selected product already exists in the selectedProducts array
        const existingProductIndex = selectedProducts.findIndex(
            (sp) => sp.product.sku === selectedProduct.sku
        );

        if (existingProductIndex !== -1) {
            // If it exists, update the quantity
            const updatedProducts = [...selectedProducts];
            updatedProducts[existingProductIndex].quantity += quantity;
            setSelectedProducts(updatedProducts);
        } else {
            // If it doesn't exist, add it as a new entry
            setSelectedProducts((prev) => [
                ...prev,
                { product: selectedProduct, quantity },
            ]);
        }

        // Reset fields
        setSelectedProduct(null);
        setQuantity(1); // Reset quantity to 1 after adding
    };

    const handleRemoveProduct = (index: number) => {
        setSelectedProducts((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(''); // Reset message
    
        if (selectedProducts.length === 0) {
            setMessage('Please add at least one product.');
            return;
        }
    
        try {
            const response = await fetch('/api/sales/add-sales', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    products: selectedProducts.map((sp) => ({
                        productId: sp.product.id,
                        quantity: sp.quantity,
                    })),
                    paymentMethod,
                }),
            });
    
            const data = await response.json();
    
            if (response.ok) {
                setMessage(`Sale created successfully! Total: ${data.total}`); // Adjust if you don't return total from the server
                // Clear selected products and reset fields
                setSelectedProducts([]);
                setPaymentMethod('cash'); // Reset to default payment method
                localStorage.removeItem('selectedProducts'); // Clear local storage after successful sale
            } else {
                // Handle non-200 responses
                setMessage(data.error || 'An error occurred while creating the sale.'); // Use fallback error message
            }
        } catch (error) {
            // Handle network or unexpected errors
            console.error('Error submitting form:', error);
            setMessage('An unexpected error occurred. Please try again.'); // Provide user-friendly error message
        }
    };
    

    // Calculate total price of selected products
    const totalAmount = selectedProducts.reduce(
        (acc, sp) => acc + sp.product.price * sp.quantity,
        0
    );

    return (
        <div className="container mx-auto p-4 max-w-4xl">
            <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Create New Sale</h1>
            <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow-md rounded-lg p-6">
                {/* Search Product */}
                <div>
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
                                type="text"
                                id="quantity"
                                value={quantity}
                                onChange={(e) => setQuantity(Number(e.target.value))}
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
                        <h3 className="text-lg font-semibold text-gray-800">Selected Products:</h3>
                        <ul className="border border-gray-300 rounded-md p-4 mt-2 bg-gray-50 space-y-2">
                            {selectedProducts.map((sp, index) => (
                                <li key={index} className="flex justify-between items-center">
                                    <span className="text-gray-700">
                                        {sp.product.name} - {sp.quantity} pcs @ &#8358;{sp.product.price.toFixed(2)}
                                    </span>
                                    <span className="text-gray-700">
                                        Total: &#8358;{(sp.product.price * sp.quantity).toFixed(2)}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveProduct(index)}
                                        className="text-red-600 hover:underline ml-4"
                                    >
                                        Remove
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Total Amount */}
                <div className="mt-6">
                    <h3 className="font-semibold text-xl text-gray-800">Total Amount: &#8358;{totalAmount.toFixed(2)}</h3>
                </div>

                {/* Payment Method */}
                <div>
                    <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700">
                        Payment Method
                    </label>
                    <select
                        id="paymentMethod"
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="cash">Cash</option>
                        <option value="credit">Transfer</option>
                        <option value="debit">Credit Card</option>
                    </select>
                </div>

                {/* Complete Sale Button */}
                <button
                    type="submit"
                    className="mt-4 w-full bg-blue-600 text-white rounded-md p-2 hover:bg-blue-700 transition-colors"
                >
                    Complete Sale
                </button>

                {/* Message */}
                {message && <p className="mt-2 text-red-500 text-center">{message}</p>}
            </form>
        </div>
    );
};

export default withLayout(NewSalePage);
