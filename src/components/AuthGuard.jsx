"use client";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";

export default function AuthGuard({ children }) {
  const { authenticated, check, loading } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      const valid = await check(); 
      if (!valid) {
        navigate("/login"); 
      }
    };

    verify();
  }, [check, navigate]);

  if (loading) {
    return <div>Checking authentication...</div>; 
  }

  return authenticated ? <>{children}</> : null;
}
