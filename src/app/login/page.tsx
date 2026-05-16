'use client';

import { useAuth } from '@/app/context/AuthContext';
import AuthForm from '@/components/AuthForm';

export default function LoginPage() {
  const { login } = useAuth();
  
  return (
    <div className="max-w-md mx-auto mt-8">
      <AuthForm type="login" onSubmit={login} />
    </div>
  );
}
