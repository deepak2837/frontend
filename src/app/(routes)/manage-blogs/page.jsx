'use client';
import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import useAuthStore from '@/store/authStore';
import { useAdminAuth } from '@/middleware/adminAuth';
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
export default function ManageBlogs() {
  const [blogs, setBlogs] = useState([]);
  const router = useRouter();
  const { getToken } = useAuthStore();
  const { isAdmin } = useAdminAuth();

  // Show access denied if not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
            <svg
              className="h-8 w-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600 mb-6">
            You are not authorized to access this page. Admin privileges are required to manage blogs.
          </p>
          <div className="space-y-3">
            <Link
              href="/"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 inline-block"
            >
              Go to Homepage
            </Link>
            <Link
              href="/profile"
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors duration-200 inline-block"
            >
              View Profile
            </Link>
          </div>
          <p className="text-sm text-gray-500 mt-6">
            If you believe this is an error, please contact your administrator.
          </p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    console.log('Fetching blogs...');
    try {
      const response = await fetch(`${BASE_URL}/api/v1/blog`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${getToken()}`
          },
        }
      );
      const data = await response.json();
      setBlogs(data.data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  };

  const handleEditBlog = (blogId) => {
    router.push(`/manage-blogs/edit-blog/${blogId}`);
  };

  const handleDeleteBlog = async (blogId) => {
    if (confirm('Are you sure you want to delete this blog?')) {
      try {
        await fetch(`${BASE_URL}/api/v1/blogs/${blogId}`, { method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${getToken()}`
          },
        });
        fetchBlogs();
      } catch (error) {
        console.error('Error deleting blog:', error);
      }
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Manage Blogs</h1>
        <Button
          variant="contained"
          color="primary"
          onClick={() => router.push('/manage-blogs/add-blog')}
        >
          Create New Blog
        </Button>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Created Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {blogs.map((blog) => (
              <TableRow key={blog._id}>
                <TableCell>{blog.title}</TableCell>
                <TableCell>
                  {new Date(blog.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>{blog.status || 'Draft'}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditBlog(blog._id)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteBlog(blog._id)}>
                    <DeleteIcon />
                  </IconButton>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => router.push(`/manage-blogs/edit-blog-content/${blog._id}`)}
                  >
                    Add Content
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
