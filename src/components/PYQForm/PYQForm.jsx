import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
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
import Autocomplete from "@mui/material/Autocomplete";
import universityNames from "@/lib/university_names";

// Constants
const COUNTRIES = ["India", "USA", "UK", "Canada", "Australia", "Germany", "France", "Other"];
const PAPER_TYPES = ["pdf", "image"];

const PAPER_SOURCES = ["first ranker", "telegram", "internet", "private groups", "other"];

const MONTHS_SESSIONS = [
  "january", "february", "march", "april", "may", "june",
  "july", "august", "september", "october", "november", "december",
  "winter session", "summer session", "spring session", "fall session"
];


const COURSES = [
  "mbbs", "md", "ms", "bds", "bpt", "bsc nursing", "msc nursing", "dm", "mch", "dnb", "other"
];
;

const MBBS_SUBJECTS = [
  "physiology",
  "human anatomy",
  "otorhinolaryngology (ent)",
  "biochemistry",
  "neurology",
  "ophthalmology",
  "community medicine",
  "psychiatry",
  "radiodiagnosis",
  "pharmacology",
  "general medicine",
  
  "pathology",
  "pediatrics",
  "obstetrics & gynecology",
  "general surgery",
  "respiratory medicine",
  "orthopaedics",
  "physical medicine & rehabilitation",
  "other"
];
;

const OTHER_SUBJECTS = [
  "General Medicine", "General Surgery", "Paediatrics", "Obstetrics and Gynaecology",
  "Orthopaedics", "Anaesthesiology", "Radiology", "Dermatology", "Psychiatry", "Other"
];

export default function PYQForm({ initialData = null, isEdit = false, onSave, loading = false }) {
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(initialData?.fileUrl || null);
  
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
    paperSource: "Internet",
    paperType: "pdf",
    status: "active"
  });

  // Initialize form with initialData if in edit mode
  useEffect(() => {
    if (isEdit && initialData) {
      setFormData({
        universityName: initialData.universityName || "",
        country: initialData.country || "India",
        examName: initialData.examName || "",
        year: initialData.year || new Date().getFullYear(),
        monthSession: initialData.monthSession || "Spring Session",
        courseName: initialData.courseName || "MBBS",
        subject: initialData.subject || "",
        paperCode: initialData.paperCode || "",
        examDuration: initialData.examDuration || "",
        maxMarks: initialData.maxMarks || "",
        paperSource: initialData.paperSource || "Internet",
        paperType: initialData.paperType || "pdf",
        status: initialData.status || "active"
      });
      
      if (initialData.fileUrl) {
        setFilePreview(initialData.fileUrl);
      }
    }
  }, [isEdit, initialData]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Convert university name, subject, and course name to lowercase
    if (['universityName', 'subject', 'courseName'].includes(name)) {
      setFormData(prev => ({ ...prev, [name]: value.toLowerCase() }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
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
    
    if (!file && !isEdit) {
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

    // Do NOT lowercase universityName or subject here, keep original casing and punctuation
    const dataToSave = {
      ...formData,
      file: file,
      filePreview: filePreview
    };

    // Call the onSave callback with form data and file
    onSave(dataToSave);
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

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <IconButton onClick={() => router.push("/manage-pyq")} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1">
          {isEdit ? "Edit PYQ" : "Add PYQ"}
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
                  {COURSES.map((course) => (
                    <MenuItem key={course} value={course}>
                      {course}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Subject (Dropdown for MBBS, Input for other courses) */}
            <Grid item xs={12} md={6}>
              {formData.courseName === "MBBS" ? (
                <FormControl fullWidth required>
                  <InputLabel>Subject *</InputLabel>
                  <Select
                    name="subject"
                    value={formData.subject}
                    label="Subject *"
                    onChange={handleInputChange}
                  >
                    {MBBS_SUBJECTS.map((subject) => (
                      <MenuItem key={subject} value={subject}>
                        {subject}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ) : (
                <TextField
                  fullWidth
                  label="Subject *"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter subject name"
                />
              )}
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
              <FormControl fullWidth required>
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

            {/* Status */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  label="Status"
                  onChange={handleInputChange}
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                  <MenuItem value="draft">Draft</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* File Upload */}
            <Grid item xs={12}>
              <Box sx={{ mt: 2, mb: 2 }}>
                <input
                  accept="application/pdf,image/*"
                  style={{ display: 'none' }}
                  id="pyq-file-upload"
                  type="file"
                  onChange={handleFileChange}
                />
                <label htmlFor="pyq-file-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<CloudUploadIcon />}
                    sx={{ mr: 2 }}
                  >
                    {file ? 'Change File' : 'Upload File *'}
                  </Button>
                </label>
                {file && (
                  <Chip
                    label={file.name}
                    onDelete={handleRemoveFile}
                    deleteIcon={<DeleteIcon />}
                    variant="outlined"
                    sx={{ ml: 1 }}
                  />
                )}
                {filePreview && !file && (
                  <Chip
                    label="Current File"
                    onDelete={handleRemoveFile}
                    deleteIcon={<DeleteIcon />}
                    variant="outlined"
                    sx={{ ml: 1 }}
                    onClick={() => window.open(filePreview, '_blank')}
                    clickable
                  />
                )}
                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                  {!isEdit && 'PDF or Image (max 10MB)'}
                  {isEdit && 'Leave empty to keep existing file'}
                </Typography>
              </Box>
            </Grid>

            {/* File Preview */}
            {filePreview && filePreview.startsWith('data:image') && (
              <Grid item xs={12}>
                <Box sx={{ mt: 2, maxWidth: '100%', maxHeight: '400px', overflow: 'hidden' }}>
                  <img 
                    src={filePreview} 
                    alt="Preview" 
                    style={{ maxWidth: '100%', maxHeight: '400px', objectFit: 'contain' }} 
                  />
                </Box>
              </Grid>
            )}

            {/* Buttons */}
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
              <Button
                variant="outlined"
                onClick={() => router.push('/manage-pyq')}
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
                {isEdit ? 'Update PYQ' : 'Add PYQ'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
}
  