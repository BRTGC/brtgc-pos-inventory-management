// /app/products/page.tsx
"use client"

import withLayout from '@/components/withLayout';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Loading from '@/components/Loading';  // Import your Loading component

// Define a type for the Product
type Product = {
  id: number;
  name: string;
  price: number;
  sku: string;
  stock: number;
  category: string;
  lowStockAlert: number; // Added to handle low stock alerts
};

// Define a type for the SessionUser
type SessionUser = {
  role: string; // Changed to allow any string for roles
};

// Define a type for the Session
type Session = {
  user: SessionUser;
} | null;

const ProductsPage = () => {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<string>('name');
  const [session, setSession] = useState<Session>(null);
  const [loading, setLoading] = useState<boolean>(true);  // Add loading state for fetching

  // Fetch products and session data when the component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);  // Start loading
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products/get-all`, {
        cache: 'no-cache', // Optional: Ensure fresh data
      });
      const initialProducts: Product[] = await res.json();
      setProducts(initialProducts);
      setFilteredProducts(initialProducts); // Initialize filtered products
      setLoading(false); // Stop loading
    };

    const fetchSession = async () => {
      setLoading(true);  // Start loading session
      const sessionData = await getSession();
      setSession(sessionData as Session); // Use type assertion here

      if (!sessionData) {
        router.push("/auth/login"); // Redirect to sign in if not authenticated
      }
      setLoading(false);  // Stop loading session
    };

    fetchProducts();
    fetchSession();
  }, [router]);

  useEffect(() => {
    const applyFilters = () => {
      let updatedProducts = products;

      if (searchTerm) {
        updatedProducts = updatedProducts.filter(product =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      if (selectedCategory) {
        updatedProducts = updatedProducts.filter(product =>
          product.category === selectedCategory
        );
      }

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

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch('/api/products/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error('Failed to delete product');
      setProducts(products.filter(product => product.id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (id: number) => {
    router.push(`/products/edit/${id}`);
  };

  // If loading session or products, display <Loading /> component
  if (loading) {
    return <Loading />;
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className='flex flex-col sm:flex-row justify-between items-center my-4 p-4'>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center sm:text-left mb-4 sm:mb-0">Product List</h1>
        {session?.user.role === 'ADMIN' && (
          <a
            href="/products/add-new"
            className='bg-blue-500 hover:bg-blue-600 sm:px-6 px-4 sm:py-3 py-2 text-white text-base sm:text-lg font-semibold rounded-md transition duration-200'
          >
            Add Product
          </a>
        )}
      </div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded-lg py-2 px-4 w-full"
        />
      </div>

      <div className="flex flex-col sm:flex-row justify-between mb-4">
        <div className="mb-2 sm:mb-0">
          <label htmlFor="categorySelect" className="mr-2">Filter by Category:</label>
          <select
            id="categorySelect"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border rounded-lg p-2"
            aria-label="Filter by category"
          >
            <option value="">All Categories</option>
            <option value="category1">Category 1</option>
            <option value="category2">Category 2</option>
          </select>
        </div>
        <div>
          <label htmlFor="sortSelect" className="mr-2">Sort By:</label>
          <select
            id="sortSelect"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="border rounded-lg p-2"
            aria-label="Sort by"
          >
            <option value="name">Name</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      <div className="bg-gray-100 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product) => (
            <div key={product.id} className="border rounded-lg p-4 shadow-md relative">
              <a className="text-xl font-semibold text-blue-500" href='#'>{product.name}</a>
              <p className="text-gray-700">Price: ${product.price.toFixed(2)}</p>
              <p className="text-gray-600">SKU: {product.sku}</p>
              <p className="text-gray-600">Stock: {product.stock}</p>

              {/* Low stock alert */}
              {product.stock <= product.lowStockAlert && (
                <div className="absolute top-2 right-2 bg-red-600 text-white py-1 px-3 rounded-lg text-sm">
                  Low stock
                </div>
              )}

              {session?.user.role === 'ADMIN' && (
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
              )}
            </div>
          ))}
        </div>
      </div>

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

// Export component wrapped with layout
export default withLayout(ProductsPage);
