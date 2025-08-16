"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
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

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

// Constants
const COUNTRIES = ["India", "USA", "UK", "Canada", "Australia", "Germany", "France", "Other"];
const PAPER_TYPES = ["pdf", "image"];
const MONTHS_SESSIONS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
  "Winter Session", "Summer Session", "Spring Session", "Fall Session"
];

export default function EditPYQ() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const { getToken } = useAuthStore();
  const [dynamicFilters, setDynamicFilters] = useState({
    universities: [],
    courses: [],
    subjects: [],
  });
  const [formData, setFormData] = useState({
    universityName: "",
    country: "India",
    examName: "",
    year: new Date().getFullYear(),
    monthSession: "",
    courseName: "",
    subject: "",
    paperCode: "",
    examDuration: "",
    maxMarks: "",
    paperSource: "",
    paperType: "pdf",
    status: "active"
  });
  const [originalData, setOriginalData] = useState(null);

  // Fetch PYQ data
  const fetchPYQData = async () => {
    try {
      setFetching(true);
      const token = getToken();
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch(`${BASE_URL}/api/v1/pyq/${params.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch PYQ data");
      }

      const data = await response.json();
      if (data.success) {
        setFormData(data.data);
        setOriginalData(data.data);
      } else {
        throw new Error(data.message || "Failed to fetch PYQ data");
      }
    } catch (error) {
      console.error("Error fetching PYQ data:", error);
      toast.error(error.message || "Failed to fetch PYQ data");
      router.push("/manage-pyq");
    } finally {
      setFetching(false);
    }
  };

  // Fetch dropdown values
  const fetchDropdownValues = async () => {
    try {
      const token = getToken();
      if (!token) return;

      const response = await fetch(`${BASE_URL}/api/v1/pyq/dropdowns`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setDynamicFilters(data.data);
        }
      }
    } catch (error) {
      console.error("Error fetching dropdown values:", error);
    }
  };

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
      
      // Append file if new file is selected
      if (file) {
        formDataToSend.append('file', file);
      }
      
      // Append form data
      Object.keys(formData).forEach(key => {
        if (formData[key] !== '') {
          formDataToSend.append(key, formData[key]);
        }
      });

      const response = await fetch(`${BASE_URL}/api/v1/pyq/${params.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success("PYQ updated successfully");
        router.push("/manage-pyq");
      } else {
        throw new Error(data.message || "Failed to update PYQ");
      }
    } catch (error) {
      console.error("Error updating PYQ:", error);
      toast.error(error.message || "Failed to update PYQ");
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
    fetchPYQData();
    fetchDropdownValues();
  }, [params.id, getToken, router]);

  if (fetching) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Toaster position="top-right" />
      
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <IconButton onClick={() => router.push("/manage-pyq")} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1">
          Edit PYQ
        </Typography>
      </Box>

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* University Name */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>University / Institution Name *</InputLabel>
                <Select
                  name="universityName"
                  value={formData.universityName}
                  label="University / Institution Name *"
                  onChange={handleInputChange}
                  required
                >
                  {dynamicFilters.universities?.map((university) => (
                    <MenuItem key={university} value={university}>
                      {university}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                Or type a new university name below
              </Typography>
              <TextField
                fullWidth
                label="New University Name (if not in list)"
                variant="outlined"
                sx={{ mt: 1 }}
                onChange={(e) => setFormData(prev => ({ ...prev, universityName: e.target.value }))}
                value={formData.universityName}
              />
            </Grid>

            {/* Country */}
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

            {/* Course Name */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Course Name *</InputLabel>
                <Select
                  name="courseName"
                  value={formData.courseName}
                  label="Course Name *"
                  onChange={handleInputChange}
                >
                  {dynamicFilters.courses?.map((course) => (
                    <MenuItem key={course} value={course}>
                      {course}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Subject */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Subject *</InputLabel>
                <Select
                  name="subject"
                  value={formData.subject}
                  label="Subject *"
                  onChange={handleInputChange}
                >
                  {dynamicFilters.subjects?.map((subject) => (
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
              <TextField
                fullWidth
                label="Paper Source"
                name="paperSource"
                value={formData.paperSource}
                onChange={handleInputChange}
                placeholder="e.g., Official University Website"
              />
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

            {/* Current File */}
            {originalData?.fileUrl && (
              <Grid item xs={12}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Current File
                  </Typography>
                  <Chip
                    label={`${originalData.fileName} (${(originalData.fileSize / 1024 / 1024).toFixed(2)} MB)`}
                    color="primary"
                    variant="outlined"
                    onClick={() => window.open(originalData.fileUrl, '_blank')}
                    sx={{ cursor: 'pointer' }}
                  />
                </Box>
              </Grid>
            )}

            {/* File Upload */}
            <Grid item xs={12}>
              <Box sx={{ border: '2px dashed #ccc', borderRadius: 2, p: 3, textAlign: 'center' }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  {file ? 'New File Selected' : 'Upload New File (Optional)'}
                </Typography>
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
                    Choose New File
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
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : null}
                >
                  {loading ? "Updating..." : "Update PYQ"}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
} 