import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuthContext } from 'src/auth/useAuthContext';

// ----------------------------------------------------------------------

export default function Index() {
  const router = useRouter();
  const { user } = useAuthContext();
  useEffect(() => {
    router.push('/shop');
  }, [user]);

  return null;
}
