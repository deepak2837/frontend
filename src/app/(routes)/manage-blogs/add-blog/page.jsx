'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Paper,
} from '@mui/material';
// import {useAuthStore} from '@/store/authStore';
import useAuthStore from '@/store/authStore';
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
export default function AddBlog() {
  const {getToken} = useAuthStore()
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    summary: '',
    description: '', // Add this line
    course: '',
    subject: '',
    topic: '',
    type: 'normal',
    difficulty: 'beginner',
    tags: '',
    coverImage: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      coverImage: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === 'tags') {
        formDataToSend.append(key, formData[key].split(',').map(tag => tag.trim()));
      } else if (key === 'coverImage' && formData[key]) {
        formDataToSend.append(key, formData[key]);
      } else {
        formDataToSend.append(key, formData[key]);
      }
    });
    
    // Add isDraft flag
    formDataToSend.append('isDraft', true);
    formDataToSend.append('content', 'default content');

    try {
      const response = await fetch(`${BASE_URL}/api/v1/blog`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getToken()}`
        },
        body: formDataToSend,
      });

      if (response.ok) {
        router.push('/manage-blogs');
      } else {
        throw new Error('Failed to create blog');
      }
    } catch (error) {
      console.error('Error creating blog:', error);
    }
  };

  return (
    <Box className="p-4">
      <Paper className="p-6">
        <h1 className="text-2xl font-bold mb-6">Create New Blog</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <TextField
            fullWidth
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
          />

          <TextField
            fullWidth
            label="Subtitle"
            name="subtitle"
            value={formData.subtitle}
            onChange={handleInputChange}
          />

          <TextField
            fullWidth
            label="Summary"
            name="summary"
            value={formData.summary}
            onChange={handleInputChange}
            multiline
            rows={3}
          />

          <TextField
            fullWidth
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            multiline
            rows={4}
            required
          />

          <TextField
            fullWidth
            label="Course"
            name="course"
            value={formData.course}
            onChange={handleInputChange}
            required
          />

          <TextField
            fullWidth
            label="Subject"
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            required
          />

          <TextField
            fullWidth
            label="Topic"
            name="topic"
            value={formData.topic}
            onChange={handleInputChange}
          />

          <FormControl fullWidth>
            <InputLabel>Type</InputLabel>
            <Select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              label="Type"
            >
              <MenuItem value="normal">Normal</MenuItem>
              <MenuItem value="news">News</MenuItem>
              <MenuItem value="exam">Exam</MenuItem>
              <MenuItem value="course">Course</MenuItem>
              <MenuItem value="article">Article</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Difficulty</InputLabel>
            <Select
              name="difficulty"
              value={formData.difficulty}
              onChange={handleInputChange}
              label="Difficulty"
            >
              <MenuItem value="beginner">Beginner</MenuItem>
              <MenuItem value="intermediate">Intermediate</MenuItem>
              <MenuItem value="advanced">Advanced</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Tags (comma-separated)"
            name="tags"
            value={formData.tags}
            onChange={handleInputChange}
            helperText="Enter tags separated by commas"
          />

          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mb-4"
          />

          <div className="flex justify-end space-x-2">
            <Button
              variant="outlined"
              onClick={() => router.push('/manage-blogs')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
            >
              Save as Draft
            </Button>
          </div>
        </form>
      </Paper>
    </Box>
  );
}
