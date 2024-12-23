import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../lib/auth-context';
import { validateSession } from '../lib/auth';
import { Loader2 } from 'lucide-react';

interface PrivateRouteProps {
  children: React.ReactNode;
}

export function PrivateRoute({ children }: PrivateRouteProps) {
  const { user, logout } = useAuth();
  const [isValidating, setIsValidating] = useState(true);

  useEffect(() => {
    const validateUserSession = async () => {
      if (user) {
        const isValid = await validateSession(user.id);
        if (!isValid) {
          logout();
        }
      }
      setIsValidating(false);
    };

    validateUserSession();
  }, [user, logout]);

  if (isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return user ? <>{children}</> : <Navigate to="/login" replace />;
}