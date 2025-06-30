'use client';
import { useState } from 'react';
import { 
  Modal,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button
} from '@mui/material';


const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  maxHeight: '90vh',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  overflow: 'auto',
};

export default function AddBlogModal({ open, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    summary: '',
    content: '',
    course: '',
    subject: '',
    topic: '',
    type: 'normal',
    difficulty: 'beginner',
    tags: [],
    coverImage: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditorChange = (content) => {
    setFormData((prev) => ({ ...prev, content }));
  };

  const handleImageChange = (e) => {
    setFormData((prev) => ({ ...prev, coverImage: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    
    Object.keys(formData).forEach(key => {
      if (key === 'tags') {
        formDataToSend.append(key, JSON.stringify(formData[key]));
      } else if (key === 'coverImage' && formData[key]) {
        formDataToSend.append('coverImage', formData[key]);
      } else {
        formDataToSend.append(key, formData[key]);
      }
    });

    try {
      const response = await fetch('/api/blogs', {
        method: 'POST',
        body: formDataToSend,
      });
      
      if (response.ok) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error creating blog:', error);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <h2 className="text-2xl font-bold mb-4">Create New Blog</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <TextField
            fullWidth
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <TextField
            fullWidth
            label="Subtitle"
            name="subtitle"
            value={formData.subtitle}
            onChange={handleChange}
          />

          <TextField
            fullWidth
            label="Summary"
            name="summary"
            value={formData.summary}
            onChange={handleChange}
            multiline
            rows={3}
          />

         
          <div className="grid grid-cols-2 gap-4">
            <FormControl fullWidth>
              <InputLabel>Course</InputLabel>
              <Select
                name="course"
                value={formData.course}
                onChange={handleChange}
                required
              >
                <MenuItem value="MBBS">MBBS</MenuItem>
                <MenuItem value="NEET">NEET</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Subject</InputLabel>
              <Select
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
              >
                <MenuItem value="Anatomy">Anatomy</MenuItem>
                <MenuItem value="Physiology">Physiology</MenuItem>
                <MenuItem value="Biochemistry">Biochemistry</MenuItem>
              </Select>
            </FormControl>
          </div>

          <FormControl fullWidth>
            <InputLabel>Type</InputLabel>
            <Select
              name="type"
              value={formData.type}
              onChange={handleChange}
            >
              <MenuItem value="normal">Normal</MenuItem>
              <MenuItem value="news">News</MenuItem>
              <MenuItem value="exam">Exam</MenuItem>
              <MenuItem value="course">Course</MenuItem>
              <MenuItem value="article">Article</MenuItem>
            </Select>
          </FormControl>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mb-4"
          />

          <div className="flex justify-end space-x-2">
            <Button variant="outlined" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="contained" type="submit">
              Create Blog
            </Button>
          </div>
        </form>
      </Box>
    </Modal>
  );
}
