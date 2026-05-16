"use client";

import { useAuth } from '@/app/context/AuthContext';
import AuthForm from '@/components/AuthForm';

export default function RegisterPage() {
  const { register } = useAuth();
  
  return (
    <div className="max-w-md mx-auto mt-8">
      {/* Pass the register function directly */}
      <AuthForm type="register" onSubmit={register} />
    </div>
  );
}
