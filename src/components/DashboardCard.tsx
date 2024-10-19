// components/DashboardCard.tsx

import Link from 'next/link';
import { ReactNode } from 'react';

interface DashboardCardProps {
    link: string;
    icon: ReactNode;
    title: string;
    value: string | number;
    bgColor: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ link, icon, title, value, bgColor }) => {
    return (
        <div className={`${bgColor} w-full max-w-xs p-4 rounded-lg shadow-md transition-transform transform hover:scale-105`}>
            <Link href={link} className="block text-center">
                <div className="flex justify-center mb-2">
                    {icon}
                </div>
                <h4 className="text-xl font-semibold">{title}</h4>
                <h4 className="text-right mt-1 text-lg font-bold text-gray-800 dark:text-gray-200">{value}</h4>
            </Link>
        </div>
    );
};

export default DashboardCard;
