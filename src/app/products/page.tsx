"use client";
import Layout from '@/components/Layout';
import withLayout from '@/components/withLayout';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const ProductsPage = () => {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortOrder, setSortOrder] = useState('name');

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

  useEffect(() => {
    // Filter and sort products based on the search term and selected category
    const applyFilters = () => {
      let updatedProducts = products;

      // Filter by search term
      if (searchTerm) {
        updatedProducts = updatedProducts.filter(product =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Filter by category
      if (selectedCategory) {
        updatedProducts = updatedProducts.filter(product =>
          product.category === selectedCategory
        );
      }

      // Sort products
      if (sortOrder === 'price_asc') {
        updatedProducts.sort((a, b) => a.price - b.price);
      } else if (sortOrder === 'price_desc') {
        updatedProducts.sort((a, b) => b.price - a.price);
      } else {
        updatedProducts.sort((a, b) => a.name.localeCompare(b.name));
      }

      setFilteredProducts(updatedProducts);
    };

    applyFilters();
  }, [searchTerm, selectedCategory, sortOrder, products]);

  const handleDelete = async (id) => {
    try {
      const res = await fetch('/api/products/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error('Failed to delete product');
      setProducts(products.filter(product => product.id !== id));
    } catch (error) {
      alert(error.message);
    }
  };

  const handleEdit = (id) => {
    router.push(`/products/edit/${id}`);
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className='flex justify-between items-center my-2'>
        <h1 className="sm:text-3xl text-2xl font-bold mb-4">Product List</h1>
        <a href="/products/add-new" className='sm:px-4 px-2 sm:py-2 py-1 bg-gray-400 sm:text-lg text-base text-white font-semibold rounded-md'>Add Product</a>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded-lg py-2 px-4 w-full"
        />
      </div>

      {/* Filter and Sort Options */}
      <div className="flex flex-col sm:flex-row justify-between mb-4">
        <div className="mb-2 sm:mb-0">
          <label className="mr-2">Filter by Category:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border rounded-lg p-2"
          >
            <option value="">All Categories</option>
            {/* Add category options here */}
            <option value="category1">Category 1</option>
            <option value="category2">Category 2</option>
            {/* Add more categories as needed */}
          </select>
        </div>
        <div>
          <label className="mr-2">Sort By:</label>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="border rounded-lg p-2"
          >
            <option value="name">Name</option>
            <option value="price_desc">Price: Low to High</option>
            <option value="price_asc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-gray-100 p-4">
        {/* Product Grid/List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product) => (
            <div key={product.id} className="border rounded-lg p-4 shadow-md">
              <a className="text-xl font-semibold text-blue-500" href='#'>{product.name}</a>
              <p className="text-gray-700">Price: ${product.price.toFixed(2)}</p>
              <p className="text-gray-600">SKU: {product.sku}</p>
              <p className="text-gray-600">Stock: {product.stock}</p>
              <div className="mt-4">
                <button
                  className="bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-400 ml-2"
                  onClick={() => handleEdit(product.id)}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-400 ml-2"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-center">
        <button className="border py-2 px-4 rounded-lg bg-blue-600 text-white hover:bg-blue-500">
          Previous
        </button>
        <span className="mx-2">1 of 10</span>
        <button className="border py-2 px-4 rounded-lg bg-blue-600 text-white hover:bg-blue-500">
          Next
        </button>
      </div>
    </div>
  );
};

export default withLayout(ProductsPage);
