import { useState } from 'react';
import { FiMenu, FiPackage, FiSettings, FiUser, FiLogOut, FiX } from 'react-icons/fi';
import { FaShoppingCart, FaFileAlt } from 'react-icons/fa';
import { MdDashboard } from 'react-icons/md';
import { useSession } from 'next-auth/react';

const MobileSidebar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [inventoryDropdown, setInventoryDropdown] = useState(false);
    const { data: session } = useSession();

    return (
        <nav className="bg-gray-800 text-white relative">
            <div className="container mx-auto flex items-center justify-between px-4 py-3">
                {/* Logo */}
                <div className="flex items-center">
                    <img src="/logo.png" alt="Logo" className="w-10 h-10 mr-2" />
                    <span className="text-lg font-semibold">BRTGC Inventory System</span>
                </div>

                {/* Hamburger Menu Icon */}
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="text-white focus:outline-none"
                >
                    <FiMenu size={30} />
                </button>
            </div>

            {/* Full-Screen Overlay Menu */}
            {menuOpen && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-95 z-50">
                    <div className='flex items-center justify-end mr-10 pt-5'>
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="text-white focus:outline-none text-right"
                        >
                            <FiX size={30} />
                        </button>
                    </div>
                    <div className="flex flex-col space-y-4 px-4 py-8">
                        {/* Dashboard */}
                        <a
                            href="/dashboard"
                            className="flex items-center px-4 py-2 hover:bg-gray-700 transition-colors"
                        >
                            <MdDashboard className="inline mr-2" size={20} />
                            Dashboard
                        </a>

                        {/* Products with Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setInventoryDropdown(!inventoryDropdown)}
                                className="w-full flex justify-between px-4 py-2 hover:bg-gray-700 transition-colors"
                            >
                                <span className="flex items-center">
                                    <FiPackage className="inline mr-2" size={20} />
                                    Products
                                </span>
                                <svg
                                    className={`transform transition-transform ${inventoryDropdown ? 'rotate-180' : 'rotate-0'
                                        }`}
                                    width="20"
                                    height="20"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M12 15l-8-8h16z" />
                                </svg>
                            </button>

                            {/* Dropdown Menu */}
                            {inventoryDropdown && (
                                <div className="absolute left-0 top-full mt-2 bg-gray-700 rounded shadow-lg z-50 w-full">
                                    <a
                                        href="/products"
                                        className="block px-4 py-2 hover:bg-gray-600 transition-colors"
                                    >
                                        View Products
                                    </a>
                                    {session?.user.role === 'ADMIN' && (
                                        <a
                                            href="/products/add-new"
                                            className="block px-4 py-2 hover:bg-gray-600 transition-colors"
                                        >
                                            Add Products
                                        </a>
                                    )}
                                    <a
                                        href="/inventory/low-stock"
                                        className="block px-4 py-2 hover:bg-gray-600 transition-colors"
                                    >
                                        Low Stock Alerts
                                    </a>
                                </div>
                            )}
                        </div>

                        {/* Sales */}
                        <a
                            href="/sales"
                            className="flex items-center px-4 py-2 hover:bg-gray-700 transition-colors"
                        >
                            <FaShoppingCart className="inline mr-2" size={20} />
                            Sales
                        </a>

                        {/* Reports */}
                        <a
                            href="/reports/restocking"
                            className="flex items-center px-4 py-2 hover:bg-gray-700 transition-colors"
                        >
                            <FaFileAlt className="inline mr-2" size={20} />
                            Restocking Report
                        </a>

                        {/* Profile */}
                        <a
                            href="/profile"
                            className="flex items-center px-4 py-2 hover:bg-gray-700 transition-colors"
                        >
                            <FiUser className="inline mr-2" size={20} />
                            Profile
                        </a>

                        {/* Settings */}
                        <a
                            href="/settings"
                            className="flex items-center px-4 py-2 hover:bg-gray-700 transition-colors"
                        >
                            <FiSettings className="inline mr-2" size={20} />
                            Settings
                        </a>

                        {/* Logout */}
                        <a
                            href="/logout"
                            className="flex items-center px-4 py-2 hover:bg-gray-700 transition-colors"
                        >
                            <FiLogOut className="inline mr-2" size={20} />
                            Logout
                        </a>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default MobileSidebar;
