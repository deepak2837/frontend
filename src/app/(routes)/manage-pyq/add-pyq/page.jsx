"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  IconButton,
  CircularProgress,
  Grid,
  Paper,
  Chip,
} from "@mui/material";
import {
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import useAuthStore from "@/store/authStore";
import Autocomplete from "@mui/material/Autocomplete";
import universityNames from "@/lib/university_names";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

// Constants
const COUNTRIES = ["India", "USA", "UK", "Canada", "Australia", "Germany", "France", "Other"];
const PAPER_TYPES = ["pdf", "image"];
const MONTHS_SESSIONS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
  "Winter Session", "Summer Session", "Spring Session", "Fall Session"
];

// Static course and subject lists
const COURSES = [
  "MBBS", "MD", "MS", "BDS", "BPT", "BSc Nursing", "MSc Nursing", "DM", "MCh", "DNB", "Other"
];

const MBBS_SUBJECTS = [
  "Anatomy", "Physiology", "Biochemistry", "Pathology", "Pharmacology", "Microbiology",
  "Forensic Medicine", "Community Medicine", "Ophthalmology", "ENT", "Medicine", "Surgery",
  "Obstetrics and Gynaecology", "Paediatrics", "Orthopaedics", "Dermatology", "Psychiatry",
  "Anaesthesiology", "Radiology", "Other"
];

const OTHER_SUBJECTS = [
  "General Medicine", "General Surgery", "Paediatrics", "Obstetrics and Gynaecology",
  "Orthopaedics", "Anaesthesiology", "Radiology", "Dermatology", "Psychiatry", "Other"
];

const PAPER_SOURCES = [
  "First Ranker",
  "Telegram",
  "Internet",
  "Private Groups",
  "Official University Website",
  "Other"
];

export default function AddPYQ() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const { getToken } = useAuthStore();
  const [formData, setFormData] = useState({
    universityName: "",
    country: "India",
    examName: "",
    year: new Date().getFullYear(),
    monthSession: "Spring Session",
    courseName: "MBBS",
    subject: "",
    paperCode: "",
    examDuration: "",
    maxMarks: "",
    paperSource: "",
    paperType: "pdf",
    status: "active"
  });

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(selectedFile.type)) {
      toast.error("Only PDF and image files are allowed");
      return;
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (selectedFile.size > maxSize) {
      toast.error("File size must be less than 10MB");
      return;
    }

    setFile(selectedFile);

    // Create preview for images
    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFilePreview(e.target.result);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setFilePreview(null);
    }
  };

  // Remove file
  const handleRemoveFile = () => {
    setFile(null);
    setFilePreview(null);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      toast.error("Please select a file");
      return;
    }

    // Validate required fields
    const requiredFields = ['universityName', 'country', 'examName', 'year', 'courseName', 'subject', 'paperType'];
    for (const field of requiredFields) {
      if (!formData[field]) {
        toast.error(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
        return;
      }
    }

    try {
      setLoading(true);
      const token = getToken();
      if (!token) {
        router.push("/login");
        return;
      }

      const formDataToSend = new FormData();
      
      // Append file
      formDataToSend.append('file', file);
      
      // Append form data
      Object.keys(formData).forEach(key => {
        if (formData[key] !== '') {
          formDataToSend.append(key, formData[key]);
        }
      });

      const response = await fetch(`${BASE_URL}/api/v1/pyq`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success("PYQ uploaded successfully");
        router.push("/manage-pyq");
      } else {
        throw new Error(data.message || "Failed to upload PYQ");
      }
    } catch (error) {
      console.error("Error uploading PYQ:", error);
      toast.error(error.message || "Failed to upload PYQ");
    } finally {
      setLoading(false);
    }
  };

  // Generate years array (current year + 10 years back)
  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear; i >= currentYear - 10; i--) {
      years.push(i);
    }
    return years;
  };

  useEffect(() => {
    // No need to fetch dropdown values from API
  }, [getToken]);

  // Subject options based on course
  const subjectOptions = formData.courseName === "MBBS" ? MBBS_SUBJECTS : OTHER_SUBJECTS;

  return (
    <Box sx={{ p: 3 }}>
      <Toaster position="top-right" />
      
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <IconButton onClick={() => router.push("/manage-pyq")} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1">
          Add PYQ
        </Typography>
      </Box>

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* University Name (Searchable) */}
            <Grid item xs={12} md={6}>
              <Autocomplete
                freeSolo
                options={universityNames}
                value={formData.universityName}
                onChange={(_, value) => setFormData(prev => ({ ...prev, universityName: value || "" }))}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="University / Institution Name *"
                    required
                  />
                )}
              />
            </Grid>

            {/* Country (default India) */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Country *</InputLabel>
                <Select
                  name="country"
                  value={formData.country}
                  label="Country *"
                  onChange={handleInputChange}
                >
                  {COUNTRIES.map((country) => (
                    <MenuItem key={country} value={country}>
                      {country}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Exam Name */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Exam Name / Type *"
                name="examName"
                value={formData.examName}
                onChange={handleInputChange}
                required
                placeholder="e.g., Professional Exam, NEET-PG, USMLE Step 1"
              />
            </Grid>

            {/* Year */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Year *</InputLabel>
                <Select
                  name="year"
                  value={formData.year}
                  label="Year *"
                  onChange={handleInputChange}
                >
                  {generateYears().map((year) => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Month/Session */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Month / Session</InputLabel>
                <Select
                  name="monthSession"
                  value={formData.monthSession}
                  label="Month / Session"
                  onChange={handleInputChange}
                >
                  <MenuItem value="">None</MenuItem>
                  {MONTHS_SESSIONS.map((month) => (
                    <MenuItem key={month} value={month}>
                      {month}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Course Name (Static) */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Course Name *</InputLabel>
                <Select
                  name="courseName"
                  value={formData.courseName}
                  label="Course Name *"
                  onChange={handleInputChange}
                >
                  {COURSES.map((course) => (
                    <MenuItem key={course} value={course}>
                      {course}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Subject (Static, changes with course) */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Subject *</InputLabel>
                <Select
                  name="subject"
                  value={formData.subject}
                  label="Subject *"
                  onChange={handleInputChange}
                >
                  {subjectOptions.map((subject) => (
                    <MenuItem key={subject} value={subject}>
                      {subject}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Paper Code */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Paper Code / Set Code"
                name="paperCode"
                value={formData.paperCode}
                onChange={handleInputChange}
                placeholder="e.g., SET-A, CODE-001"
              />
            </Grid>

            {/* Exam Duration */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Exam Duration (HH:MM)"
                name="examDuration"
                value={formData.examDuration}
                onChange={handleInputChange}
                placeholder="e.g., 03:00"
              />
            </Grid>

            {/* Maximum Marks */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Maximum Marks"
                name="maxMarks"
                type="number"
                value={formData.maxMarks}
                onChange={handleInputChange}
                placeholder="e.g., 100"
              />
            </Grid>

            {/* Paper Source */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Paper Source</InputLabel>
                <Select
                  name="paperSource"
                  value={formData.paperSource}
                  label="Paper Source"
                  onChange={handleInputChange}
                >
                  {PAPER_SOURCES.map((source) => (
                    <MenuItem key={source} value={source}>
                      {source}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Paper Type */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Paper Type *</InputLabel>
                <Select
                  name="paperType"
                  value={formData.paperType}
                  label="Paper Type *"
                  onChange={handleInputChange}
                >
                  {PAPER_TYPES.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type.toUpperCase()}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* File Upload */}
            <Grid item xs={12}>
              <Box sx={{ border: '2px dashed #ccc', borderRadius: 2, p: 3, textAlign: 'center' }}>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                  id="file-upload"
                />
                <label htmlFor="file-upload">
                  <Button
                    component="span"
                    variant="outlined"
                    startIcon={<CloudUploadIcon />}
                    sx={{ mb: 2 }}
                  >
                    Choose File
                  </Button>
                </label>
                
                {file && (
                  <Box sx={{ mt: 2 }}>
                    <Chip
                      label={`${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`}
                      onDelete={handleRemoveFile}
                      color="primary"
                      variant="outlined"
                    />
                    {filePreview && (
                      <Box sx={{ mt: 2 }}>
                        <img 
                          src={filePreview} 
                          alt="Preview" 
                          style={{ maxWidth: '200px', maxHeight: '200px' }} 
                        />
                      </Box>
                    )}
                  </Box>
                )}
                
                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
                  Accepted formats: PDF, JPG, JPEG, PNG (Max size: 10MB)
                </Typography>
              </Box>
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
                <Button
                  variant="outlined"
                  onClick={() => router.push("/manage-pyq")}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading || !file}
                  startIcon={loading ? <CircularProgress size={20} /> : null}
                >
                  {loading ? "Uploading..." : "Upload PYQ"}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
}