import { getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react'

const useCheckSessionData = () => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkSessionData = async () => {
      setLoading(true); // Start loading
      const sessionData = await getSession();

      if (!sessionData || !sessionData.user) {  // Check if session or session.user is missing
        router.push("/auth/login"); // Redirect to login if no session data
      } else {
        // Optionally handle cases where session is valid and data exists
        console.log("Session data exists:", sessionData);
      }

      setLoading(false); // Stop loading
    };

    checkSessionData();
  }, [router]);

  return loading; // Return loading state, can be used in your component to show loading spinner if needed
};


export default useCheckSessionData
