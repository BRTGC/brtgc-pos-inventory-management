// src/app/products/add-new/page.tsx

"use client"

import Layout from '@/components/Layout';
import withLayout from '@/components/withLayout';
import { useState } from 'react';

const AddNewProduct = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    costPrice: 0,
    sku: '',
    category: '',
    stock: 0,
    lowStockAlert: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    // Convert numeric inputs to their respective types
    if (name === 'price' || name === 'costPrice') {
      setFormData((prevData) => ({
        ...prevData,
        [name]: parseFloat(value), // Convert to float
      }));
    } else if (name === 'stock' || name === 'lowStockAlert') {
      setFormData((prevData) => ({
        ...prevData,
        [name]: parseInt(value, 10), // Convert to integer
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await fetch('/api/products/add-new', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    if (res.ok) {
      alert('Product added successfully');
      setFormData({
        name: '',
        description: '',
        price: 0,
        costPrice: 0,
        sku: '',
        category: '',
        stock: 0,
        lowStockAlert: 0,
      }); // Reset form after submission
    } else {
      alert('Failed to add product');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-gray-50 rounded-lg shadow-lg border border-gray-200">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Add New Product</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="name">
            Product Name
          </label>
          <input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter product name"
            required
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 transition duration-150 ease-in-out"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter product description"
            required
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 transition duration-150 ease-in-out"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="price">
            Price ($)
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Enter price"
            required
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 transition duration-150 ease-in-out"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="costPrice">
            Cost Price ($)
          </label>
          <input
            type="number"
            id="costPrice"
            name="costPrice"
            value={formData.costPrice}
            onChange={handleChange}
            placeholder="Enter cost price"
            required
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 transition duration-150 ease-in-out"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="sku">
            SKU
          </label>
          <input
            id="sku"
            name="sku"
            value={formData.sku}
            onChange={handleChange}
            placeholder="Enter SKU"
            required
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 transition duration-150 ease-in-out"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="category">
            Category
          </label>
          <input
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="Enter category"
            required
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 transition duration-150 ease-in-out"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="stock">
            Stock
          </label>
          <input
            type="number"
            id="stock"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            placeholder="Enter stock quantity"
            required
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 transition duration-150 ease-in-out"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="lowStockAlert">
            Low Stock Alert
          </label>
          <input
            type="number"
            id="lowStockAlert"
            name="lowStockAlert"
            value={formData.lowStockAlert}
            onChange={handleChange}
            placeholder="Enter low stock alert threshold"
            required
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 transition duration-150 ease-in-out"
          />
        </div>
        <button type="submit" className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400">
          Add Product
        </button>
      </form>
    </div>
  );
};

export default withLayout(AddNewProduct);
