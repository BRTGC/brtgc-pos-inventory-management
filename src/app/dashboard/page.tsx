// src/app/dashboard/page.tsx

import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '../api/auth/[...nextauth]/route';
import LogoutButton from '../../components/LogoutButton';
import withLayout from '@/components/withLayout';

const Dashboard = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-right">Welcome, {session?.user.username}</h1>
      <p className='text-3xl'>/ <a href="/dashboard" className='text-blue-400 font-medium text-xl'>Dashboard</a></p>
      <p>Email: {session?.user.email}</p>
      <p>Role: {session?.user.role}</p>

      {session?.user.role === 'ADMIN' && (
        <div>
          <h2 className="text-2xl font-semibold">Admin Actions</h2>
          <p>You can modify the inventory here.</p>
          {/* Admin-specific actions go here */}
        </div>
      )}

      <LogoutButton />
    </div>
  );
};

export default withLayout(Dashboard) ;
