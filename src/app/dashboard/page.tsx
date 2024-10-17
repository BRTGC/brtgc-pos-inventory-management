"use client";

import { getSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import withLayout from "@/components/withLayout";
import { User } from "@/types/User"; // Import the User type
import Loading from "@/components/Loading";
import { FaBox, FaShoppingCart, FaUser } from "react-icons/fa";
import { FaNairaSign } from "react-icons/fa6";
import DashboardCard from "@/components/DashboardCard";

type Product = {
  id: number;
  name: string;
  price: number;
  sku: string;
  stock: number;
  category: string;
  lowStockAlert: number;
};

interface Sale {
  id: string;
  createdAt: string;
  paymentMethod: string | null;
  amount: number;
  saleProducts: SaleProduct[];
}

type SaleProduct = {
  product: {
    id: number;
    name: string;
    price: number;
    sku: string;
    stock: number;
    category: string;
  };
  quantity: number; // Quantity of the product sold in the sale
};

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userCount, setUserCount] = useState<number>(0);
  const [productCount, setProductCount] = useState<number>(0);
  const [salesAmount, setSalesAmount] = useState<string>("₦0");
  const [lowStockCount, setLowStockCount] = useState<number>(0);
  const router = useRouter();

  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      if (!session) {
        router.push("/auth/login"); // Redirect to sign in if not authenticated
      } else {
        const userFromSession: User = {
          id: session.user.id,
          username: session.user.username || "", // Provide default if missing
          role: session.user.role || "guest", // Provide default role if missing
        };

        setUser(userFromSession); // Set user data from session
      }
    };

    fetchSession();
  }, [router]);

  useEffect(() => {
    // Fetch data concurrently
    const fetchData = async () => {
      try {
        const [productRes, salesRes, userRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products/get-all`),
          fetch('/api/sales/all-sales'),
          fetch('/api/users'),
        ]);

        const products: Product[] = await productRes.json();
        const sales: Sale[] = await salesRes.json();
        const users = await userRes.json(); // Fetch users

        // Set user count
        const userCount = users.data.users.length
        setUserCount(userCount);

        // Set product count
        setProductCount(products.length);

        // Calculate total sales amount
        const totalSalesAmount = sales.reduce((total, sale) => {
          const saleTotal = sale.saleProducts.reduce((saleTotal, saleProduct) => {
            return saleTotal + saleProduct.product.price * saleProduct.quantity;
          }, 0);
          return total + saleTotal;
        }, 0);

        // Format sales amount with commas and two decimal places
        setSalesAmount(`₦${totalSalesAmount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`);

        // Handle low stock count
        const lowStockItems = products.filter((product) => product.stock <= product.lowStockAlert);
        setLowStockCount(lowStockItems.length);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  if (!user) {
    return <Loading />; // Show loading spinner while fetching session
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-right mr-[5%]">
        Welcome, <span className="font-bold uppercase">{user.username}</span>
      </h1>
      <div className="flex flex-wrap justify-center space-x-4 space-y-4 mt-6">
        {/* Users Card */}
        <DashboardCard
          link="/users"
          icon={<FaUser className="inline mr-2" size={20} />}
          title="Users"
          value={userCount}
          bgColor="blue-400"
        />

        {/* Products Card */}
        <DashboardCard
          link="/products"
          icon={<FaBox className="inline mr-2" size={20} />}
          title="Products"
          value={productCount}
          bgColor="green-400"
        />

        {/* Sales Card */}
        <DashboardCard
          link="/sales"
          icon={<FaNairaSign  className="inline mr-2" size={20} />}
          title="Sales"
          value={salesAmount}
          bgColor="red-400"
        />

        {/* Low Stocks Card */}
        <DashboardCard
          link="/low-stocks"
          icon={<FaShoppingCart className="inline mr-2" size={20} />}
          title="Low Stocks"
          value={lowStockCount}
          bgColor="purple-400"
        />
      </div>

      {/* Profile and Logout Buttons */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={() => router.push("/profile")}
          className="bg-blue-500 text-white px-4 py-2 rounded shadow"
        >
          Go to Profile
        </button>
        <button
          onClick={() => signOut()}
          className="ml-4 bg-red-500 text-white px-4 py-2 rounded shadow"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default withLayout(Dashboard);
