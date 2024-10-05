import { useState } from 'react';
import { FiPackage, FiSettings, FiUser, FiLogOut } from 'react-icons/fi';
import { FaShoppingCart, FaFileAlt } from 'react-icons/fa';
import { MdDashboard } from 'react-icons/md';

const Navbar = () => {
  const [inventoryDropdown, setInventoryDropdown] = useState(false);

  return (
    <nav className="bg-gray-800 fixed text-white px-4 py-3 w-full">
      <div className="container mx-auto flex items-center justify-around">
        {/* Logo */}
        <div className="flex items-center">
          <img
            src="/logo.png"
            alt="Logo"
            className="w-12 h-12 mr-3"
          />
          <span className="text-xl font-semibold">BRTGC Inventory System</span>
        </div>

        {/* Links */}
        <div className="flex items-center space-x-6">
          {/* Dashboard */}
          <a href="/dashboard" className="flex items-center hover:text-gray-300">
            <MdDashboard className="mr-2" size={24} />
            <span>Dashboard</span>
          </a>

          {/* Products with Dropdown */}
          <div className="relative">
            <button
              onClick={() => setInventoryDropdown(!inventoryDropdown)}
              className="flex items-center hover:text-gray-300"
            >
              <FiPackage className="mr-2" size={24} />
              <span>Products</span>
              <svg
                className={`ml-1 transform transition-transform ${inventoryDropdown ? 'rotate-180' : 'rotate-0'
                  }`}
                width="20"
                height="20"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 15l-8-8h16z" />
              </svg>
            </button>
            {inventoryDropdown && (
              <div className="absolute mt-2 bg-gray-700 rounded shadow-lg z-20">
                <a
                  href="/products"
                  className="block px-4 py-2 hover:bg-gray-600 transition-colors"
                >
                  View Products
                </a>
                <a
                  href="/products/add-new"
                  className="block px-4 py-2 hover:bg-gray-600 transition-colors"
                >
                  Add Products
                </a>
                <a
                  href="/products/low-stocks"
                  className="block px-4 py-2 hover:bg-gray-600 transition-colors"
                >
                  Low Stock Alerts
                </a>
              </div>
            )}
          </div>
          {/* Sales */}
          <a href="/sales" className="flex items-center hover:text-gray-300">
            <FaShoppingCart className="mr-2" size={24} />
            <span>Sales</span>
          </a>

          {/* Reports */}
          <a href="/reports/restocking" className="flex items-center hover:text-gray-300">
            <FaFileAlt className="mr-2" size={24} />
            <span>Restocking Report</span>
          </a>
        </div>
        <div className='flex items-center gap-8'>
          {/* Profile */}
          <a href="/profile" className="flex items-center hover:text-gray-300">
            <FiUser className="mr-2" size={24} />
            <span>Profile</span>
          </a>

          {/* Settings */}
          <a href="/settings" className="flex items-center hover:text-gray-300">
            <FiSettings className="mr-2" size={24} />
            <span>Settings</span>
          </a>

          {/* Logout */}
          <a href="/logout" className="flex items-center hover:text-gray-300">
            <FiLogOut className="mr-2" size={24} />
            <span>Logout</span>
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
