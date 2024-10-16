"use client";

import Sidebar from './Sidebar'; // For desktop sidebar
import MobileSidebar from './MobileSidebar'; // Mobile sidebar component

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="w-full overflow-hidden">
            {/* Desktop Sidebar */}
            <div className="hidden lg:flex">
                <Sidebar />
            </div>

            {/* Mobile Navbar with Burger Menu */}
            <div className="lg:hidden">
                <MobileSidebar />
            </div>

            {/* Main Content */}
            <div className="bg-gray-100 text-black lg:pt-16 pt-0 p-4">
                {children}
            </div>
        </div>
    );
};
