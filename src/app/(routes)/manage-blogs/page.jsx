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
import useAuthStore from '@/store/authStore';
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
export default function ManageBlogs() {
  const [blogs, setBlogs] = useState([]);
  const router = useRouter();
  const { getToken } = useAuthStore();

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
