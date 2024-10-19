import { useState, useEffect } from 'react';
import { FiMenu, FiSettings, FiUser, FiLogOut, FiX, FiPackage } from 'react-icons/fi';
import { FaShoppingCart, FaFileAlt, FaUser } from 'react-icons/fa';
import { MdDashboard } from 'react-icons/md';
import { signOut, getSession } from 'next-auth/react';
import Image from 'next/image';  // Import next/image

interface MyComponentProps {
    bgColor: string;
  }

const MobileSidebar: React.FC<MyComponentProps> = ({ bgColor  }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    // const [inventoryDropdown, setInventoryDropdown] = useState(false);
    const [userRole, setUserRole] = useState<string | null>(null); // Allow string or null

    // Fetch session data using getSession
    useEffect(() => {
        const fetchSession = async () => {
            const session = await getSession();
            if (session) {
                setUserRole(session.user?.role as string); // Ensure role is string
            }
        };
        fetchSession();
    }, []);

    return (
        <nav className={`${bgColor} text-white relative rounded-b-lg`}>
            <div className="container mx-auto flex items-center justify-between px-4 py-3">
                {/* Logo */}
                <div className="flex items-center">
                    {/* Replace img with Image */}
                    <Image
                        src="/logo.png"
                        alt="Logo"
                        width={40}  // specify width
                        height={40} // specify height
                        className="mr-2"
                    />
                    <span className="text-lg font-semibold">BRTGC Inventory System</span>
                </div>

                {/* Hamburger Menu Icon */}
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="text-white focus:outline-none"
                    aria-label="Open Menu"
                    type="button" // Set button type explicitly
                >
                    <FiMenu size={30} />
                </button>
            </div>

            {/* Full-Screen Overlay Menu */}
            {menuOpen && (
                <div className={`fixed inset-0 bg-gray-900 ${bgColor} z-50`}>
                    <div className='flex items-center justify-end mr-10 pt-5'>
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="text-white focus:outline-none"
                            aria-label="Close Menu"
                            type="button" // Set button type explicitly
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

                        {/* Users */}
                        {userRole === 'ADMIN' && (
                            <a
                                href="/users"
                                className="flex items-center px-4 py-2 hover:bg-gray-700 transition-colors"
                            >
                                <FaUser className="inline mr-2" size={20} />
                                Users
                            </a>
                        )}

                        {/* Products with Dropdown */}
                        <a
                            href="/products"
                            className="flex items-center px-4 py-2 hover:bg-gray-700 transition-colors"
                        >
                            <FiPackage className="inline mr-2" size={20} />
                            Products
                        </a>

                        {/* Products with Dropdown */}
                        {/* <div className="relative">
                            <button
                                onClick={() => setInventoryDropdown(!inventoryDropdown)}
                                className="w-full flex justify-between px-4 py-2 hover:bg-gray-700 transition-colors"
                                aria-label="Toggle Products Dropdown"
                                type="button" // Set button type explicitly
                            >
                                <span className="flex items-center">
                                    <FiPackage className="inline mr-2" size={20} />
                                    Products
                                </span>
                                <svg
                                    className={`transform transition-transform ${inventoryDropdown ? 'rotate-180' : 'rotate-0'}`}
                                    width="20"
                                    height="20"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M12 15l-8-8h16z" />
                                </svg>
                            </button>
                            {inventoryDropdown && (
                                <div className="absolute left-0 top-full mt-2 bg-gray-700 rounded shadow-lg z-50 w-full">
                                    <a
                                        href="/products"
                                        className="block px-4 py-2 hover:bg-gray-600 transition-colors"
                                    >
                                        View Products
                                    </a>
                                    {userRole === 'ADMIN' && ( // Only show for admins
                                        <a
                                            href="/products/add-new"
                                            className="block px-4 py-2 hover:bg-gray-600 transition-colors"
                                        >
                                            Add Products
                                        </a>
                                    )}
                                </div>
                            )}
                        </div> */}

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
                        <button
                            onClick={() => signOut()}
                            className="flex items-center px-4 py-2 hover:bg-gray-700 transition-colors"
                            type="button" // Set button type explicitly
                        >
                            <FiLogOut className="inline mr-2" size={20} />
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default MobileSidebar;
