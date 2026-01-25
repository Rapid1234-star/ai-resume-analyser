import React, { useEffect } from "react";
import { usePuterStore } from "~/lib/puter";
import { useNavigate, useLocation } from "react-router";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  requireAuth = true, 
  redirectTo = "/auth" 
}) => {
  const { auth } = usePuterStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (requireAuth && !auth.isAuthenticated) {
      // Store the current location so we can redirect after login
      const currentPath = location.pathname + location.search;
      navigate(`/?next=${encodeURIComponent(currentPath)}`, { replace: true });
    } else if (!requireAuth && auth.isAuthenticated && location.pathname === '/') {
      // If not requiring auth but user is authenticated and on hero page, redirect to dashboard
      const next = location.search.split("next=")[1];
      if (next) {
        try {
          const decodedNext = decodeURIComponent(next);
          navigate(decodedNext, { replace: true });
        } catch (error) {
          navigate('/dashboard', { replace: true });
        }
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [auth.isAuthenticated, requireAuth, navigate, location]);

  if (requireAuth && !auth.isAuthenticated) {
    return null; // Will redirect automatically
  }

  return <>{children}</>;
};

export default AuthGuard;