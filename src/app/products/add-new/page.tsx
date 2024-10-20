// src/app/products/add-new/page.tsx

"use client";

import withLayout from '@/components/withLayout';
import { useForm } from 'react-hook-form';

interface FormData {
  name: string;
  description: string;
  price: number;
  costPrice: number;
  sku: string;
  category: string;
  stock: number;
  lowStockAlert: number;
}

const AddNewProduct = () => {
  const { register, handleSubmit, reset } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      const res = await fetch('/api/products/add-new', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        alert('Product added successfully');
        reset(); // Reset form after submission
      } else {
        alert('Failed to add product');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred while adding the product.');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-700 rounded-lg shadow-lg border border-gray-200 m-10">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-gray-200">Add New Product</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="name">
            Product Name
          </label>
          <input
            id="name"
            {...register('name', { required: true })}
            placeholder="Enter product name"
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 transition duration-150 ease-in-out text-black"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            {...register('description', { required: true })}
            placeholder="Enter product description"
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 transition duration-150 ease-in-out text-black"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="price">
            Price ($)
          </label>
          <input
            type="number"
            id="price"
            {...register('price', { required: true, valueAsNumber: true })}
            placeholder="Enter price"
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 transition duration-150 ease-in-out text-black"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="costPrice">
            Cost Price ($)
          </label>
          <input
            type="number"
            id="costPrice"
            {...register('costPrice', { required: true, valueAsNumber: true })}
            placeholder="Enter cost price"
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 transition duration-150 ease-in-out text-black"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="sku">
            SKU
          </label>
          <input
            id="sku"
            {...register('sku', { required: true })}
            placeholder="Enter SKU"
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 transition duration-150 ease-in-out text-black"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="category">
            Category
          </label>
          <input
            id="category"
            {...register('category', { required: true })}
            placeholder="Enter category"
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 transition duration-150 ease-in-out text-black"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="stock">
            Stock
          </label>
          <input
            type="number"
            id="stock"
            {...register('stock', { required: true, valueAsNumber: true })}
            placeholder="Enter stock quantity"
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 transition duration-150 ease-in-out text-black"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="lowStockAlert">
            Low Stock Alert
          </label>
          <input
            type="number"
            id="lowStockAlert"
            {...register('lowStockAlert', { required: true, valueAsNumber: true })}
            placeholder="Enter low stock alert threshold"
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 transition duration-150 ease-in-out text-black"
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
