import { useEffect, useState } from 'react';
import { FiSettings, FiUser, FiLogOut, FiPackage } from 'react-icons/fi';
import { FaShoppingCart, FaFileAlt, FaUser } from 'react-icons/fa';
import { MdDashboard } from 'react-icons/md';
import { getSession, signOut } from 'next-auth/react';
import Image from 'next/image';

interface MyComponentProps {
  bgColor: string;
}

const Navbar: React.FC<MyComponentProps> = ({ bgColor  }) => {
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
    <nav className={`${bgColor} fixed text-white px-4 py-3 w-full rounded-b-lg`}>
      <div className="container mx-auto flex items-center justify-around">
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
          <span className="text-xl font-semibold">BRTGC Inventory System</span>
        </div>

        {/* Links */}
        <div className="flex items-center space-x-6">
          {/* Dashboard */}
          <a href="/dashboard" className="flex items-center hover:text-gray-300">
            <MdDashboard className="mr-2" size={24} />
            <span>Dashboard</span>
          </a>

          {/* Users */}
          {userRole === 'ADMIN' && (
            <a href="/users" className="flex items-center hover:text-gray-300">
              <FaUser className="mr-2" size={24} />
              <span>Users</span>
            </a>
          )}

          {/* Products */}
          <a
            href="/products"
            className="flex items-center hover:text-gray-300"
          >
            <FiPackage className="mr-2" size={24} />
            <span>Products</span>
          </a>

          {/* Products with Dropdown */}
          {/* <div className="relative">
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
                {userRole === 'ADMIN' && (
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
          <a href="/sales" className="flex items-center hover:text-gray-300">
            <FaShoppingCart className="mr-2" size={24} />
            <span>Sales</span>
          </a>
        </div>
        <div className='flex items-center gap-8'>

          {/* lightt and dark mode */}
          

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
    </nav>
  );
};

export default Navbar;
