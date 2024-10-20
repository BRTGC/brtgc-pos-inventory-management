"use client";

import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import withLayout from "@/components/withLayout";
import { User } from "@/types/User";
import Loading from "@/components/Loading";
import { FaBox, FaDollarSign, FaShoppingCart, FaUser } from "react-icons/fa";
import DashboardCard from "@/components/DashboardCard";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import ThemeToggle from "@/components/ThemeToggle";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

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
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [salesData, setSalesData] = useState<{ [key: string]: number }>({});
  const [stockData, setStockData] = useState<{ [key: string]: number }>({});
  const router = useRouter();

  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      if (!session) {
        router.push("/auth/login"); // Redirect to sign in if not authenticated
      } else {
        setUser({
          id: session.user.id,
          username: session.user.username || "",
          role: session.user.role || "guest",
        }); // Set user data from session
      }
    };

    fetchSession();
  }, [router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, salesRes, userRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products/get-all`),
          fetch("/api/sales/all-sales"),
          fetch("/api/users"),
        ]);

        const productsData: Product[] = await productRes.json();
        const salesData: Sale[] = await salesRes.json();
        const dataUsers = await userRes.json(); // Fetch users

        // Set data
        setProducts(productsData);

        const usersData = dataUsers.data.users
        setUsers(usersData)
        setUserCount(usersData.length);
        setSales(salesData);
        setProductCount(productsData.length);


        // Calculate total sales amount
        const totalSalesAmount = salesData.reduce((total, sale) => {
          return total + sale.saleProducts.reduce((saleTotal, saleProduct) => {
            return saleTotal + saleProduct.product.price * saleProduct.quantity;
          }, 0);
        }, 0);
        setSalesAmount(`₦${totalSalesAmount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")}`);

        // Group sales and stock sold by day for the last 7 days
        const salesGroupedByDay: { [key: string]: number } = {};
        const stockGroupedByDay: { [key: string]: number } = {};

        // Get the date for the last 7 days
        const today = new Date();
        const last7Days = Array.from({ length: 7 }, (_, i) => {
          const date = new Date();
          date.setDate(today.getDate() - i);
          return date.toLocaleDateString();
        }).reverse(); // Reverse to have from oldest to newest

        // Initialize sales and stock data for the last 7 days
        last7Days.forEach((date) => {
          salesGroupedByDay[date] = 0;
          stockGroupedByDay[date] = 0;
        });

        salesData.forEach((sale) => {
          const date = new Date(sale.createdAt).toLocaleDateString(); // Group by date
          if (salesGroupedByDay[date] !== undefined) {
            // Add to sales in Naira
            salesGroupedByDay[date] += sale.saleProducts.reduce((total, saleProduct) => {
              return total + saleProduct.product.price * saleProduct.quantity;
            }, 0);

            // Add to total stock sold
            sale.saleProducts.forEach((saleProduct) => {
              stockGroupedByDay[date] += saleProduct.quantity;
            });
          }
        });

        setSalesData(salesGroupedByDay);
        setStockData(stockGroupedByDay);

        // Handle low stock count
        const lowStockItems = productsData.filter((product) => product.stock <= product.lowStockAlert);
        setLowStockCount(lowStockItems.length);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const downloadCSV = (data: any[], filename: string) => {
    const csvHeader = Object.keys(data[0]).join(",") + "\n";
    const csvRows = data.map((row) => Object.values(row).join(",")).join("\n");
    const csv = csvHeader + csvRows;
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadProducts = () => {
    const productData = products.map((product) => ({
      id: product.id,
      name: product.name,
      price: product.price,
      sku: product.sku,
      stock: product.stock,
      category: product.category,
      lowStockAlert: product.lowStockAlert,
    }));
    downloadCSV(productData, "products.csv");
  };

  const handleDownloadUsers = () => {
    const userData = users.map((user) => ({
      id: user.id,
      createdAt: user.createdAt,
      name: user.name,
      username: user.username,
      email: user.email,
      role: "USER",
    }));
    console.log(userData)
    downloadCSV(userData, "users.csv");
  };

  const handleDownloadSales = () => {
    const salesDataWithDetails = sales.flatMap((sale) =>
      sale.saleProducts.map((saleProduct) => ({
        saleId: sale.id,
        createdAt: sale.createdAt,
        paymentMethod: sale.paymentMethod,
        productName: saleProduct.product.name,
        quantity: saleProduct.quantity,
        price: saleProduct.product.price,
        total: saleProduct.product.price * saleProduct.quantity,
      }))
    );

    downloadCSV(salesDataWithDetails, "sales.csv");
  };

  if (!user) {
    return <Loading />; // Show loading spinner while fetching session
  }

  // Prepare data for charts
  const salesLabels = Object.keys(salesData);
  const salesValues = Object.values(salesData).map((value) => parseFloat(value).toFixed(2)); // Ensure sales amounts are formatted with 2 decimals
  const stockLabels = Object.keys(stockData);
  const stockValues = Object.values(stockData);

  const salesChartData = {
    labels: salesLabels,
    datasets: [
      {
        label: "Sales Amount (₦)",
        data: salesValues,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const stockChartData = {
    labels: stockLabels,
    datasets: [
      {
        label: "Total Stock Sold",
        data: stockValues,
        backgroundColor: "rgba(255, 99, 132, 0.6)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-center mb-6">
        Welcome, <span className="font-bold uppercase">{user.username}</span>
      </h1>

      {/* Dashboard Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <DashboardCard
          link="/users"
          icon={<FaUser className="inline mr-2" size={20} />}
          title="Users"
          value={userCount}
          bgColor="bg-blue-600"
        />
        <DashboardCard
          link="/products"
          icon={<FaBox className="inline mr-2" size={20} />}
          title="Products"
          value={productCount}
          bgColor="bg-green-600"
        />
        <DashboardCard
          link="/sales"
          icon={<FaDollarSign className="inline mr-2" size={20} />}
          title="Total Sales"
          value={salesAmount}
          bgColor="bg-orange-600"
        />
        <DashboardCard
          link="/low-stock"
          icon={<FaShoppingCart className="inline mr-2" size={20} />}
          title="Low Stock"
          value={lowStockCount}
          bgColor="bg-red-600"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-lg p-4">
          <h2 className="text-lg font-bold mb-4">Sales Over Last 7 Days</h2>
          <Bar data={salesChartData} options={{ responsive: true }} />
        </div>
        <div className="bg-white rounded-lg shadow-lg p-4">
          <h2 className="text-lg font-bold mb-4">Total Stock Sold Over Last 7 Days</h2>
          <Bar data={stockChartData} options={{ responsive: true }} />
        </div>
      </div>

      {/* Download CSV Section */}
      <div className="flex flex-col md:flex-row justify-around mb-6">
        <button onClick={handleDownloadProducts} className="bg-blue-500 text-white py-2 px-4 rounded mb-2 md:mb-0">Download Products CSV</button>
        <button onClick={handleDownloadUsers} className="bg-green-500 text-white py-2 px-4 rounded mb-2 md:mb-0">Download Users CSV</button>
        <button onClick={handleDownloadSales} className="bg-orange-500 text-white py-2 px-4 rounded">Download Sales CSV</button>
      </div>
    </div>
  );
};

export default withLayout(Dashboard);
