"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Box,
  Typography,
  FormHelperText,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { CloudUpload as CloudUploadIcon } from "@mui/icons-material";
import useAuthStore from "@/store/authStore";

const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];
const TEST_TYPES = ['Exam', 'Course', 'Subject'];

export default function AddMockTest() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadType, setUploadType] = useState("file");
  const [mediaUrl, setMediaUrl] = useState("");
  const [file, setFile] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const { getToken } = useAuthStore();

  const [formData, setFormData] = useState({
    testName: "",
    title: "",
    testType: "Exam",
    category: "Medical",
    description: "",
    timeLimit: 60,
    numberOfQuestions: 0,
    difficultyLevel: "Medium",
    passPercentage: 40,
    instructions: "",
    status: "upcoming",
    tags: [],
    startDate: "",
    endDate: "",
    negativeMarking: {
      enabled: false,
      value: 0.25
    },
    canReview: true,
    points: 0,
    targetYear: "",
    numberOfQuestions: 0,
    points: 0,
    description: "",
    category: "",
    passPercentage: 40,
    instructions: "",
    tags: [],
    negativeMarking: {
      enabled: false,
      value: 0.25}
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'startDate' || name === 'endDate') {
        // Convert local datetime to ISO string
        const date = new Date(value).toISOString();
        setFormData(prev => ({
          ...prev,
          [name]: date
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
      }
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    };
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setFormErrors(prev => ({
      ...prev,
      file: undefined,
      mediaUrl: undefined
    }));
  };

  const handleArrayFieldChange = (field, value) => {
    const values = value.split(",")
      .map(item => item.trim())
      .filter(item => item !== "");
    setFormData(prev => ({
      ...prev,
      [field]: Array.from(new Set(values))
    }));
    setFormErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const errors = {};

    // Validation
    if (!formData.testName) errors.testName = "Test name is required";
    if (!formData.title) errors.title = "Title is required";
    if (!formData.timeLimit) errors.timeLimit = "Time limit is required";
    if (!formData.startDate) errors.startDate = "Start date is required";
    if (!formData.endDate) errors.endDate = "End date is required";
    if (!formData.targetYear) errors.targetYear = "Target year is required";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setLoading(false);
      return;
    }

    try {
      const token = getToken();
      let requestBody;
      let headers = {
        Authorization: `Bearer ${token}`
      };

      if (uploadType === "file" && file) {
        const formDataObj = new FormData();
        formDataObj.append("image", file);
        Object.keys(formData).forEach(key => {
          if (typeof formData[key] === 'object' && !Array.isArray(formData[key])) {
            formDataObj.append(key, JSON.stringify(formData[key]));
          } else {
            formDataObj.append(key, formData[key]);
          }
        });
        requestBody = formDataObj;
      } else if (uploadType === "url" && mediaUrl) {
        headers["Content-Type"] = "application/json";
        requestBody = JSON.stringify({
          ...formData,
          image: mediaUrl
        });
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/mock-test`,
        {
          method: "POST",
          headers,
          body: requestBody
        }
      );

      const data = await response.json();
      if (data.success) {
        toast.success("Mock test created successfully");
        router.push("/manage-mock-test");
      } else {
        toast.error(data.message || "Failed to create mock test");
      }
    } catch (error) {
      toast.error("Error creating mock test: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
        <Typography variant="h4" component="h1" gutterBottom className="text-gray-800">
          Create Mock Test
        </Typography>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Details */}
          <TextField
            label="Test Name"
            variant="outlined"
            fullWidth
            required
            name="testName"
            value={formData.testName}
            onChange={handleInputChange}
            error={!!formErrors.testName}
            helperText={formErrors.testName}
          />

          <TextField
            label="Title"
            variant="outlined"
            fullWidth
            required
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            error={!!formErrors.title}
            helperText={formErrors.title}
          />

          <FormControl fullWidth>
            <InputLabel>Test Type</InputLabel>
            <Select
              name="testType"
              value={formData.testType}
              onChange={handleInputChange}
              label="Test Type"
            >
              {TEST_TYPES.map(type => (
                <MenuItem key={type} value={type}>{type}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Target Year"
            variant="outlined"
            fullWidth
            required
            name="targetYear"
            value={formData.targetYear}
            onChange={handleInputChange}
            error={!!formErrors.targetYear}
            helperText={formErrors.targetYear}
          />

          <TextField
            label="Time Limit (minutes)"
            type="number"
            variant="outlined"
            fullWidth
            required
            name="timeLimit"
            value={formData.timeLimit}
            onChange={handleInputChange}
            error={!!formErrors.timeLimit}
            helperText={formErrors.timeLimit}
          />

          <FormControl fullWidth>
            <InputLabel>Difficulty Level</InputLabel>
            <Select
              name="difficultyLevel"
              value={formData.difficultyLevel}
              onChange={handleInputChange}
              label="Difficulty Level"
            >
              {DIFFICULTIES.map(level => (
                <MenuItem key={level} value={level}>{level}</MenuItem>
              ))}
            </Select>
          </FormControl>

  <TextField
    label="Number of Questions"
    type="number"
    variant="outlined"
    fullWidth
    required
    name="numberOfQuestions"
    value={formData.numberOfQuestions}
    onChange={handleInputChange}
  />

  <TextField
    label="Points"
    type="number"
    variant="outlined"
    fullWidth
    name="points"
    value={formData.points}
    onChange={handleInputChange}
  />

  <TextField
    label="Category"
    variant="outlined"
    fullWidth
    required
    name="category"
    value={formData.category}
    onChange={handleInputChange}
  />

  <TextField
    label="Pass Percentage"
    type="number"
    variant="outlined"
    fullWidth
    name="passPercentage"
    value={formData.passPercentage}
    onChange={handleInputChange}
  />

  <TextField
    label="Description"
    variant="outlined"
    fullWidth
    multiline
    rows={4}
    name="description"
    value={formData.description}
    onChange={handleInputChange}
  />

  <TextField
    label="Instructions"
    variant="outlined"
    fullWidth
    multiline
    rows={4}
    name="instructions"
    value={formData.instructions}
    onChange={handleInputChange}
  />

  <TextField
    label="Tags (comma separated)"
    variant="outlined"
    fullWidth
    name="tags"
    value={formData.tags.join(", ")}
    onChange={(e) => {
      const value = e.target.value;
      setFormData(prev => ({
        ...prev,
        tags: value.split(",").map(tag => tag.trim())
      }));
    }}
    helperText="Enter tags separated by commas"
  />

  {formData.negativeMarking.enabled && (
    <TextField
      label="Negative Marking Value"
      type="number"
      variant="outlined"
      fullWidth
      name="negativeMarking.value"
      value={formData.negativeMarking.value}
      onChange={(e) => setFormData(prev => ({
        ...prev,
        negativeMarking: {
          ...prev.negativeMarking,
          value: parseFloat(e.target.value)
        }
      }))}
      InputProps={{
        inputProps: { 
          min: 0,
          max: 1,
          step: 0.25
        }
      }}
      helperText="Value between 0 and 1 (e.g., 0.25 for 25%)"
    />
  )}
<TextField
  label="Start Date"
  type="datetime-local"
  variant="outlined"
  fullWidth
  required
  name="startDate"
  value={formData.startDate ? new Date(formData.startDate).toISOString().slice(0, 16) : ''}
  onChange={handleInputChange}
  InputLabelProps={{ shrink: true }}
  error={!!formErrors.startDate}
  helperText={formErrors.startDate}
/>

<TextField
  label="End Date"
  type="datetime-local"
  variant="outlined"
  fullWidth
  required
  name="endDate"
  value={formData.endDate ? new Date(formData.endDate).toISOString().slice(0, 16) : ''}
  onChange={handleInputChange}
  InputLabelProps={{ shrink: true }}
  error={!!formErrors.endDate}
  helperText={formErrors.endDate}
/>
        </div>

        {/* Test Settings */}
        <Box mt={4}>
          <Typography variant="h6" gutterBottom>
            Test Settings
          </Typography>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormControlLabel
              control={
                <Switch
                  checked={formData.negativeMarking.enabled}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    negativeMarking: {
                      ...prev.negativeMarking,
                      enabled: e.target.checked
                    }
                  }))}
                />
              }
              label="Enable Negative Marking"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={formData.canReview}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    canReview: e.target.checked
                  }))}
                />
              }
              label="Allow Review"
            />
          </div>
        </Box>

        {/* Media Upload */}
        <Box mt={4}>
          <Typography variant="h6" gutterBottom>
            Test Image
          </Typography>
          <Box display="flex" gap={2} mb={2}>
            <Button
              variant={uploadType === "file" ? "contained" : "outlined"}
              onClick={() => setUploadType("file")}
            >
              Upload File
            </Button>
            <Button
              variant={uploadType === "url" ? "contained" : "outlined"}
              onClick={() => setUploadType("url")}
            >
              Provide URL
            </Button>
          </Box>

          {uploadType === "file" ? (
            <TextField
              type="file"
              variant="outlined"
              fullWidth
              onChange={handleFileChange}
              error={!!formErrors.file}
              helperText={formErrors.file}
            />
          ) : (
            <TextField
              label="Image URL"
              variant="outlined"
              fullWidth
              value={mediaUrl}
              onChange={(e) => setMediaUrl(e.target.value)}
              error={!!formErrors.mediaUrl}
              helperText={formErrors.mediaUrl}
            />
          )}
        </Box>

        {/* Submit Button */}
        <Box mt={4}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
            fullWidth
          >
            {loading ? "Creating..." : "Create Mock Test"}
          </Button>
        </Box>
      </form>
      <Toaster />
    </div>
  );
}