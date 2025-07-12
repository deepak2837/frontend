import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import useAuthStore from '@/store/authStore';

const useBlogEngagement = (blogId) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { getToken } = useAuthStore();

  // Get initial engagement status
  useEffect(() => {
    if (blogId) {
      fetchEngagementStatus();
    }
  }, [blogId]);

  const fetchEngagementStatus = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
      const token = getToken();
      const headers = {
        'Content-Type': 'application/json'
      };
      
      // Add authorization header only if token exists
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`${baseUrl}/api/v1/blog-engagement/${blogId}`, {
        headers
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Engagement status response:', data);
        setIsLiked(data.data.opinion === 'like');
      } else {
        console.log('No engagement found for this user');
      }
    } catch (error) {
      console.error('Error fetching engagement status:', error);
    }
  };

  const toggleLike = async () => {
    if (!blogId) {
      console.error('Blog ID is required');
      return;
    }

    setIsLoading(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
      const token = getToken();
      const headers = {
        'Content-Type': 'application/json'
      };
      
      // Add authorization header only if token exists
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`${baseUrl}/api/v1/blog-engagement`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          blogId,
          opinion: isLiked ? 'none' : 'like'
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Like toggle response:', data);
        setIsLiked(data.data.opinion === 'like');
        setLikeCount(data.data.likeCount);
      } else {
        const errorData = await response.json();
        console.error('Failed to update like status:', errorData);
      }
    } catch (error) {
      console.error('Error updating like status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateLikeCount = (count) => {
    setLikeCount(count);
  };

  return {
    isLiked,
    likeCount,
    isLoading,
    toggleLike,
    updateLikeCount
  };
};

export default useBlogEngagement; 