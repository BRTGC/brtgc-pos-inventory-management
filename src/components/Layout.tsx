// src/components/Layout.tsx
import { ThemeProvider } from '../context/ThemeContext';
import MobileSidebar from './MobileSidebar';
import Sidebar from './Sidebar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
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
        <div className="bg-lightBackground dark:bg-darkBackground text-black h-full overflow-auto dark:text-white lg:pt-16 pt-0 p-4">
          {children}
        </div>
      </div>
    </ThemeProvider>
  );
}
