"use client";

import withLayout from '@/components/withLayout';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const EditProductPage = ({ params }) => {
  const router = useRouter();
  const { id } = params;

  // Initialize state for the product details
  const [product, setProduct] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [costPrice, setCostPrice] = useState(0);
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState(0);
  const [lowStockAlert, setLowStockAlert] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch the product details when the component mounts
  useEffect(() => {
    const fetchProduct = async () => {
      const res = await fetch(`/api/products/${id}`);
      if (!res.ok) {
        alert('Failed to load product');
        return;
      }
      const data = await res.json();
      setProduct(data);
      setName(data.name);
      setDescription(data.description);
      setPrice(data.price);
      setCostPrice(data.costPrice);
      setSku(data.sku);
      setCategory(data.category);
      setStock(data.stock);
      setLowStockAlert(data.lowStockAlert);
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    // Make a PUT request to update the product
    const res = await fetch(`/api/products/update`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id,
        name,
        description,
        price,
        costPrice,
        sku,
        category,
        stock,
        lowStockAlert,
      }),
    });

    if (res.ok) {
      alert('Product updated successfully');
      router.push('/products'); // Redirect back to product list
    } else {
      alert('Failed to update product');
    }
  };

  if (loading) return <p>Loading...</p>; // Show loading message while fetching data

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Edit Product</h1>
      <form onSubmit={handleUpdate}>
        {/* Product Name */}
        <div className="mb-4">
          <label className="block mb-2">Product Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border rounded-lg py-2 px-4 w-full"
            required
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border rounded-lg py-2 px-4 w-full"
            required
          />
        </div>

        {/* Price */}
        <div className="mb-4">
          <label className="block mb-2">Price</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="border rounded-lg py-2 px-4 w-full"
            required
          />
        </div>

        {/* Cost Price */}
        <div className="mb-4">
          <label className="block mb-2">Cost Price</label>
          <input
            type="number"
            value={costPrice}
            onChange={(e) => setCostPrice(Number(e.target.value))}
            className="border rounded-lg py-2 px-4 w-full"
            required
          />
        </div>

        {/* SKU */}
        <div className="mb-4">
          <label className="block mb-2">SKU</label>
          <input
            type="text"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            className="border rounded-lg py-2 px-4 w-full"
            required
          />
        </div>

        {/* Category */}
        <div className="mb-4">
          <label className="block mb-2">Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border rounded-lg py-2 px-4 w-full"
            required
          />
        </div>

        {/* Stock */}
        <div className="mb-4">
          <label className="block mb-2">Stock</label>
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(Number(e.target.value))}
            className="border rounded-lg py-2 px-4 w-full"
            required
          />
        </div>

        {/* Low Stock Alert */}
        <div className="mb-4">
          <label className="block mb-2">Low Stock Alert</label>
          <input
            type="number"
            value={lowStockAlert}
            onChange={(e) => setLowStockAlert(Number(e.target.value))}
            className="border rounded-lg py-2 px-4 w-full"
            required
          />
        </div>

        <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-500">
          Update Product
        </button>
      </form>
    </div>
  );
};

export default withLayout(EditProductPage);
