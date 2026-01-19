"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";
import { toast } from "react-toastify";

export const useAdminAuth = () => {
  const router = useRouter();
  const { getUser, getToken, isAuthenticated } = useAuthStore();

  useEffect(() => {
    const token = getToken();
    const user = getUser();

    if (!token || !isAuthenticated) {
      toast.error("Please login to access this page");
      router.push("/login");
      return;
    }

    if (user?.role !== 'admin') {
      toast.error("Access denied. Admin privileges required.");
      router.push("/");
      return;
    }
  }, [router, getToken, getUser, isAuthenticated]);

  const user = getUser();
  return {
    isAdmin: user?.role === 'admin',
    user,
  };
};

export const checkAdminAccess = (user) => {
  return user && user.role === 'admin';
};
