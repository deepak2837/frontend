"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
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
import useAuthStore from "@/store/authStore";

const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];
const TEST_TYPES = ['Exam', 'Course', 'Subject'];
const TEST_STATUS = ['upcoming', 'live', 'dead'];

export default function EditMockTest() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const [loading, setLoading] = useState(true);
  const [uploadType, setUploadType] = useState("file");
  const [mediaUrl, setMediaUrl] = useState("");
  const [file, setFile] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const { getToken } = useAuthStore();

  const [formData, setFormData] = useState({
    testName: "",
    title: "",
    testType: "",
    targetYear: "",
    description: "",
    timeLimit: 60,
    numberOfQuestions: 0,
    difficultyLevel: "",
    passPercentage: 40,
    instructions: "",
    status: "",
    tags: [],
    startDate: "",
    endDate: "",
    negativeMarking: {
      enabled: false,
      value: 0.25
    },
    canReview: true,
    points: 0,
    category: ""
  });

  useEffect(() => {
    fetchTestData();
  }, [id]);
  const ImagePreview = ({ url }) => {
    if (!url) return null;
    return (
      <div className="mt-2 mb-4">
        <Typography variant="subtitle2" gutterBottom>Current Image:</Typography>
        <img 
          src={url} 
          alt="Test preview" 
          className="max-w-xs rounded-lg shadow-md"
          style={{ maxHeight: '200px', objectFit: 'contain' }} 
        />
      </div>
    );
  };
  const handleArrayFieldChange = (field, value) => {
    try {
      const values = value.split(",")
        .map(item => item.trim())
        .filter(item => item !== "");
      
      setFormData(prev => ({
        ...prev,
        [field]: values
      }));
      
      // Clear any errors
      setFormErrors(prev => ({ ...prev, [field]: undefined }));
    } catch (error) {
      console.error('Error handling array field:', error);
      setFormErrors(prev => ({ 
        ...prev, 
        [field]: "Invalid format. Please use comma-separated values" 
      }));
    }
  };
  const formatFormDataForSubmission = (data) => {
    const formatted = { ...data };
  
    // Handle questions array
    formatted.questions = Array.isArray(data.questions) && data.questions.length > 0 
      ? data.questions.filter(q => q && q !== '') 
      : [];
  
    // Handle negative marking
    formatted.negativeMarking = {
      enabled: Boolean(data.negativeMarking?.enabled),
      value: Number(data.negativeMarking?.value)
    };
  
    // Handle access control
    formatted.accessControl = {
      isPublic: true,
      allowedUsers: []
    };
  
    // Format dates
    if (formatted.startDate) {
      formatted.startDate = new Date(formatted.startDate).toISOString();
    }
    if (formatted.endDate) {
      formatted.endDate = new Date(formatted.endDate).toISOString();
    }
  
    // Clean up empty arrays
    if (Array.isArray(formatted.tags)) {
      formatted.tags = formatted.tags.filter(tag => tag && tag.trim());
    }
  
    return formatted;
  };
  
  
  const fetchTestData = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/mock-test/${id}`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`
          }
        }
      );

      if (!response.ok) throw new Error('Failed to fetch test data');

      const data = await response.json();
      if (data.success) {
        const test = data.data;
        setFormData({
          ...test,
          startDate: new Date(test.startDate).toISOString().slice(0, 16),
          endDate: new Date(test.endDate).toISOString().slice(0, 16),
          tags: Array.isArray(test.tags) ? test.tags : []
        });
        if (test.image) {
          setMediaUrl(test.image);
          setUploadType("url");
        }
      }
    } catch (error) {
      toast.error("Error fetching test data: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'startDate' || name === 'endDate') {
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

    
      try {
        const token = getToken();
        let requestBody;
        let headers = {
          Authorization: `Bearer ${token}`
        };
    
        // Format the data first
        const formattedData = formatFormDataForSubmission(formData);
    
        if (uploadType === "file" && file) {
          const formDataObj = new FormData();
          formDataObj.append("image", file);
          
          Object.keys(formattedData).forEach(key => {
            if (key === 'questions' && (!formattedData[key] || !formattedData[key].length)) {
              formDataObj.append(key, JSON.stringify([]));
            }
            else if (typeof formattedData[key] === 'object') {
              formDataObj.append(key, JSON.stringify(formattedData[key]));
            } else {
              formDataObj.append(key, formattedData[key]);
            }
          });
          requestBody = formDataObj;
        } else {
          headers["Content-Type"] = "application/json";
          requestBody = JSON.stringify({
            ...formattedData,
            image: mediaUrl
          });
        }
    
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/mock-test/${id}`,
          {
            method: "PUT",
            headers,
            body: requestBody
          }
        );
    
        const data = await response.json();
        if (data.success) {
          toast.success("Mock test updated successfully");
          router.push("/manage-mock-test");
        } else {
          toast.error(data.message || "Failed to update mock test");
        }
      } catch (error) {
        toast.error("Error updating mock test: " + error.message);
      } finally {
        setLoading(false);
      }
    };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 bg-gray-100 min-h-screen">
      <form 
        onSubmit={handleSubmit} 
        className="max-w-full sm:max-w-4xl mx-auto bg-white p-4 sm:p-8 rounded-2xl shadow-lg"
      >
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom 
          className="text-gray-800 text-center sm:text-left"
        >
          Edit Mock Test
        </Typography>
        <Box mt={4}>
          <Typography variant="h6" gutterBottom>
            Test Image
          </Typography>
          {/* Show current image */}
          <ImagePreview url={mediaUrl} />
          {/* ...existing code... */}
        </Box>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
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
            fullWidth5
            name="points"
            value={formData.points}
            onChange={handleInputChange}
          />
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              label="Status"
            >
              {TEST_STATUS.map(status => (
                <MenuItem key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Category"
            variant="outlined"
            fullWidth
            required
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            error={!!formErrors.category}
            helperText={formErrors.category}
          />
          <TextField
            label="Pass Percentage"
            type="number"
            variant="outlined"
            fullWidth
            name="passPercentage"
            value={formData.passPercentage}
            onChange={handleInputChange}
            error={!!formErrors.passPercentage}
            helperText={formErrors.passPercentage}
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
            error={!!formErrors.tags}
            helperText={formErrors.tags || "Enter tags separated by commas"}
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
         
          
         <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              label="Status"
            >
              {TEST_STATUS.map(status => (
                <MenuItem key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>


          <FormControl fullWidth required>
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
          <FormControl fullWidth required>
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
          <TextField
            label="Start Date"
            type="datetime-local"
            variant="outlined"
            fullWidth
            required
            name="startDate"
            value={formData.startDate ? formData.startDate.slice(0, 16) : ''}
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
            value={formData.endDate ? formData.endDate.slice(0, 16) : ''}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
            error={!!formErrors.endDate}
            helperText={formErrors.endDate}
          />
        </div>
        <Box mt={4} className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
          <Typography variant="h6" gutterBottom>
            Test Settings
          </Typography>
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
        </Box>
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
        <Box mt={4}>
          <Typography variant="h6" gutterBottom>
            Test Image
          </Typography>
          <Box 
            display="flex" 
            gap={2} 
            mb={2} 
            sx={{ flexDirection: { xs: "column", sm: "row" } }}
          >
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
              onChange={(e) => setFile(e.target.files[0])}
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
            {loading ? "Updating..." : "Update Mock Test"}
          </Button>
        </Box>
      </form>
      <Toaster />
    </div>
  );
}