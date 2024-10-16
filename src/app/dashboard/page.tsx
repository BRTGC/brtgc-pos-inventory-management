// src/app/dashboard/page.tsx
"use client";

import { getSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import withLayout from "@/components/withLayout";
import { User } from "@/types/User"; // Import the User type
import Loading from "@/components/Loading";
import { FaBox, FaChartLine, FaDollarSign, FaShoppingCart, FaUser } from "react-icons/fa";
import DashboardCard from "@/components/DashboardCard";

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null); // Use the User type
  const [userCount, setUserCount] = useState<number>(0);
  const [productCount, setProductCount] = useState<number>(0);
  const [salesAmount, setSalesAmount] = useState<string>("$0");
  const [lowStockCount, setLowStockCount] = useState<number>(5); // Hardcoded for now
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      if (!session) {
        router.push("/auth/login"); // Redirect to sign in if not authenticated
      } else {
        const userFromSession: User = {
          id: session.user.id,
          username: session.user.username || "", // Provide a default if username is missing
          role: session.user.role,
        };

        setUser(userFromSession); // Set user data from session

        // Fetch dynamic data
        fetchDashboardData(); // Fetch the dashboard data after user is set
      }
    };

    fetchSession();
  }, [router]);

  const fetchDashboardData = async () => {
    try {
      // Fetch the counts from your API or database
      const response = await fetch('/api/dashboard'); // Adjust the endpoint as necessary
      const data = await response.json();

      // Set the fetched data
      setUserCount(data.userCount);
      setProductCount(data.productCount);
      setSalesAmount(data.salesAmount);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  if (!user) {
    return <Loading />; // Show loading state
  }

  return (
    <div className={`p-5 ${isDarkTheme ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
      <h1 className="text-2xl font-bold text-right mr-[5%]">
        Welcome, <span className="font-bold uppercase">{user.username}</span>
      </h1>
      <div className="flex flex-wrap justify-center space-x-4 space-y-4">
        {/* Users Card */}
        <DashboardCard
          link="/users"
          icon={<FaUser className="inline mr-2" size={20} />} // Adjust icon size if needed
          title="Users"
          value={20} // Hardcoded value for now
          bgColor="blue-400"
        />

        {/* Products Card */}
        <DashboardCard
          link="/products"
          icon={<FaBox className="inline mr-2" size={20} />}
          title="Products"
          value={productCount} // Dynamic value from state
          bgColor="green-400"
        />

        {/* Sales Card */}
        <DashboardCard
          link="/sales"
          icon={<FaDollarSign className="inline mr-2" size={20} />}
          title="Sales"
          value={salesAmount} // Dynamic value from state
          bgColor="red-400"
        />

        {/* Low Stocks Card */}
        <DashboardCard
          link="/low-stocks"
          icon={<FaShoppingCart className="inline mr-2" size={20} />}
          title="Low Stocks"
          value={lowStockCount} // Hardcoded value for now
          bgColor="purple-400" // Cool color
        />
      </div>

      <button
        onClick={() => router.push("/profile")} // Redirect to profile page
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Go to Profile
      </button>
      <button
        onClick={() => signOut()} // Logout function
        className="mt-4 ml-4 bg-red-500 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  );
};

export default withLayout(Dashboard);
