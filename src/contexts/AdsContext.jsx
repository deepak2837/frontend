"use client";
import { createContext, useContext, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

const AdsContext = createContext();

export const useAds = () => {
  const context = useContext(AdsContext);
  if (!context) {
    throw new Error('useAds must be used within AdsProvider');
  }
  return context;
};

export const AdsProvider = ({ children }) => {
  const pathname = usePathname();
  const [disabledPaths, setDisabledPaths] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all disabled ad paths on mount (only once)
  useEffect(() => {
    const fetchDisabledPaths = async () => {
      try {
        const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
        if (!BASE_URL) {
          console.warn('NEXT_PUBLIC_BASE_URL not set, defaulting to show ads');
          setLoading(false);
          return;
        }

        const response = await fetch(`${BASE_URL}/api/v1/ads-config/public`);
        
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            // Extract just the paths where ads are disabled
            const paths = data.data.map(config => config.pagePath);
            setDisabledPaths(paths);
          }
        } else {
          console.warn('Failed to fetch ads config, defaulting to show ads');
        }
      } catch (error) {
        console.error('Error fetching ads config:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDisabledPaths();
  }, []); // Only fetch once on mount

  // Helper function to check if ads should be shown on current page
  const canShowAds = () => {
    if (loading) return false;
    
    // Check if current path matches or starts with any disabled path
    for (const disabledPath of disabledPaths) {
      if (pathname === disabledPath || pathname.startsWith(disabledPath + '/')) {
        return false;
      }
    }
    
    return true;
  };

  const value = {
    shouldShowAds: canShowAds(),
    canShowAds,
    loading,
    currentPath: pathname,
    disabledPaths
  };

  return <AdsContext.Provider value={value}>{children}</AdsContext.Provider>;
};
