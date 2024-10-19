// src/components/layout.tsx
import Sidebar from './Sidebar';
import MobileSidebar from './MobileSidebar';
import { ThemeProvider } from '../context/ThemeContext';

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider>
            <div className="w-full overflow-hidden">
                {/* Desktop Sidebar */}
                <div className="hidden lg:flex">
                    <Sidebar bgColor='bg-gray-700' />
                </div>

                {/* Mobile Navbar with Burger Menu */}
                <div className="lg:hidden">
                    <MobileSidebar bgColor='bg-gray-700' />
                </div>

                {/* Main Content */}
                <div className="text-[#021764] dark:text-white lg:pt-16 pt-0 p-4">
                    {children}
                </div>
            </div>
        </ThemeProvider>
    );
}
