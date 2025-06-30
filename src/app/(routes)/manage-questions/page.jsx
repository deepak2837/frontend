"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Link from "next/link";
import { toast, Toaster } from "react-hot-toast";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  IconButton,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Clear as ClearIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import useAuthStore from "@/store/authStore";
import QuestionDetailsModal from "@/components/QuestionDetailsModal";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
// Constants (Consider moving these to a separate constants file if used elsewhere)
const DIFFICULTY_LEVELS = ["easy", "medium", "hard"];
const EXAM_OPTIONS = [
  "NEET-PG",
  "INI-CET",
  "FMGE",
  "USMLE",
  "NEET-UG",
  "NEET-SS",
  "AIIMS-PG",
  "JIPMER-PG",
  "MRCP",
];
const TOOL_OPTIONS = ["manual", "script", "other"];
const MEDICAL_SUBJECTS = [
  "Anatomy",
  "Physiology",
  "Biochemistry",
  "Pathology",
  "Microbiology",
  "Pharmacology",
  "Forensic Medicine and Toxicology (FMT)",
  "Community Medicine",
  "Ophthalmology",
  "Otorhinolaryngology (ENT)",
  "Medicine",
  "Surgery",
  "Obstetrics and Gynecology",
  "Pediatrics",
  "Orthopedics",
  "Dermatology",
  "Psychiatry",
  "Radiology",
  "Anesthesiology",
];

export default function ManageQuestions() {
  const [allQuestions, setAllQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { getToken } = useAuthStore();
  const [dynamicFilters, setDynamicFilters] = useState({
    subjects: [],
    exams: [],
    difficulties: [],
    tools: [],
    statuses: [],
    pyqDetails: [],
  });
  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText, setDebouncedSearchText] = useState("");
  const searchInputRef = useRef(""); // Ref to hold the input value
  const searchTimeoutRef = useRef(null);
  const [filters, setFilters] = useState({
    difficulty: "all",
    exam: "all",
    subject: "all",
    tool: "all",
    status: "all",
    pyqDetails: "all",
  });
  const [totalRows, setTotalRows] = useState(0);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 50, // Changed default to 50
  });

  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRowClick = (params) => {
    setSelectedQuestion(params.row);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedQuestion(null);
  };

  const columns = [
    {
      field: "question",
      headerName: "Question",
      flex: 2,
      renderCell: (params) => (
        <Typography variant="body1" sx={{ whiteSpace: "normal" }}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: "answer",
      headerName: "Answer",
      width: 100,
      renderCell: (params) => (
        <Typography variant="body1">{params.value}</Typography>
      ),
    },
    {
      field: "explanation",
      headerName: "Explanation",
      flex: 2,
      renderCell: (params) => (
        <Typography variant="body1" sx={{ whiteSpace: "normal" }}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: "subject",
      headerName: "Subject",
      width: 150,
      type: "singleSelect",
      valueOptions: dynamicFilters.subjects,
      renderCell: (params) => (
        <Typography variant="body1">{params.value}</Typography>
      ),
    },
    {
      field: "exam",
      headerName: "Exam",
      width: 150,
      type: "singleSelect",
      valueOptions: dynamicFilters.exams,
      renderCell: (params) => (
        <Typography variant="body1">{params.value}</Typography>
      ),
    },
    {
      field: "difficulty",
      headerName: "Difficulty",
      width: 120,
      type: "singleSelect",
      valueOptions: dynamicFilters.difficulties,
      renderCell: (params) => (
        <Typography variant="body1">{params.value}</Typography>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <IconButton
            aria-label="edit"
            component={Link}
            href={`/manage-questions/edit-question/${params.row._id}`}
            color="warning"
          >
            <EditIcon />
          </IconButton>
          <IconButton
            aria-label="delete"
            onClick={() => handleDelete(params.row._id)}
            color="error"
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  // Add new function to fetch dropdown values
  const fetchDropdownValues = async () => {
    try {
      const token = getToken();
      const response = await fetch(`${BASE_URL}/api/v1/questions/dropdowns`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          toast.error("Session expired. Please login again");
          router.push("/login");
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setDynamicFilters(data.data);
      }
    } catch (error) {
      toast.error("Error fetching filter options: " + error.message);
    }
  };

  // Modify useEffect to fetch dropdown values separately
  useEffect(() => {
    fetchDropdownValues();
  }, []); // Only fetch once when component mounts

  // Function to handle input change
  const handleSearchTextChange = useCallback((e) => {
    searchInputRef.current = e.target.value; // Update the ref directly
  }, []);

  // Function to handle search button click
  const handleSearch = () => {
    setSearchText(searchInputRef.current); // Update searchText state
    setDebouncedSearchText(searchInputRef.current); // Update debouncedSearchText state
  };

  // Function to handle clear button click
  const handleClear = () => {
    setSearchText("");
    setDebouncedSearchText("");
    searchInputRef.current = ""; // Clear the ref
  };

  // Debounce logic for search
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, 500); // 0.5-second delay

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchText]);

  // Initial fetch - only load data once
  useEffect(() => {
    fetchAllQuestions();
  }, [paginationModel, debouncedSearchText, filters]);

  const fetchAllQuestions = async () => {
    try {
      setLoading(true);
      const token = getToken();

      // Build query parameters
      const queryParams = new URLSearchParams({
        page: paginationModel.page + 1, // Convert to 1-based for backend
        limit: paginationModel.pageSize,
        ...(filters.subject !== "all" && { subject: filters.subject }),
        ...(filters.exam !== "all" && { exam: filters.exam }),
        ...(filters.difficulty !== "all" && { difficulty: filters.difficulty }),
        ...(filters.tool !== "all" && { tool: filters.tool }),
        ...(filters.status !== "all" && { status: filters.status }),
        ...(filters.pyqDetails !== "all" && { pyqDetails: filters.pyqDetails }),
        ...(debouncedSearchText && { searchText: debouncedSearchText }),
      });

      const response = await fetch(`${BASE_URL}/api/v1/questions?${queryParams}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          toast.error("Session expired. Please login again");
          router.push("/login");
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setAllQuestions(data.data);
        setFilteredQuestions(data.data);
        setTotalRows(data.pagination.total);
      }
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (questionId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this question?"
    );
    if (!confirmDelete) return;

    try {
      const token = getToken();
      const response = await fetch(
        `${BASE_URL}/api/v1/questions/${questionId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        toast.error("Session expired. Please login again");
        router.push("/login");
        return;
      }

      if (response.ok) {
        toast.success("Question deleted successfully");
        // Update local state after deletion
        const updatedQuestions = allQuestions.filter((q) => q._id !== questionId);
        setAllQuestions(updatedQuestions);
        // Filtered questions will be updated via the useEffect
      } else {
        const errorData = await response.json();
        toast.error(
          `Error deleting question: ${errorData.message || "Unknown error"}`
        );
      }
    } catch (error) {
      toast.error("Error deleting question: " + error.message);

      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again");
        router.push("/login");
      }
    }
  };

  // Prepare rows for DataGrid
  const rows = filteredQuestions.map((question) => ({
    id: question._id,
    _id: question._id,
    ...question,
  }));

  if (loading && !rows.length) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="50vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error && !rows.length) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="50vh"
        color="error.main"
      >
        {error}
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ p: 3, bgcolor: "background.default", minHeight: "100vh" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            sx={{ fontWeight: "bold", color: "text.primary" }}
          >
            Manage Questions
          </Typography>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            href="/manage-questions/add-question"
            startIcon={<AddIcon />}
          >
            Add Question
          </Button>
        </Box>

        <Box
          sx={{ bgcolor: "white", borderRadius: 2, boxShadow: 1, p: 2, mb: 3 }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
                md: "1fr 1fr 1fr 1fr",
              },
              gap: 2,
            }}
          >
            {/* Standard HTML Input Field */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <input
                type="text"
                placeholder="Search questions..."
                defaultValue={searchText} // Use defaultValue to initialize
                onChange={handleSearchTextChange} // Use the ref-based handler
                style={{
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                  width: "100%",
                  fontSize: "14px",
                }}
                ref={searchInputRef}
              />
              <IconButton size="small" onClick={handleClear}>
                <ClearIcon />
              </IconButton>
              <Button variant="contained" onClick={handleSearch} sx={{ minWidth: "auto" }}>
                <SearchIcon />
              </Button>
            </Box>

            <FormControl variant="outlined" size="small" fullWidth>
              <InputLabel id="subject-label">Subject</InputLabel>
              <Select
                labelId="subject-label"
                value={filters.subject}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, subject: e.target.value }))
                }
                label="Subject"
              >
                <MenuItem value="all">All Subjects</MenuItem>
                {dynamicFilters.subjects.map((subject) => (
                  <MenuItem key={subject} value={subject}>
                    {subject}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl variant="outlined" size="small" fullWidth>
              <InputLabel id="exam-label">Exam</InputLabel>
              <Select
                labelId="exam-label"
                value={filters.exam}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, exam: e.target.value }))
                }
                label="Exam"
              >
                <MenuItem value="all">All Exams</MenuItem>
                {dynamicFilters.exams.map((exam) => (
                  <MenuItem key={exam} value={exam}>
                    {exam}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl variant="outlined" size="small" fullWidth>
              <InputLabel id="difficulty-label">Difficulty</InputLabel>
              <Select
                labelId="difficulty-label"
                value={filters.difficulty}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, difficulty: e.target.value }))
                }
                label="Difficulty"
              >
                <MenuItem value="all">All Difficulties</MenuItem>
                {dynamicFilters.difficulties.map((difficulty) => (
                  <MenuItem key={difficulty} value={difficulty}>
                    {difficulty}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl variant="outlined" size="small" fullWidth>
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
                value={filters.status}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, status: e.target.value }))
                }
                label="Status"
              >
                <MenuItem value="all">All Status</MenuItem>
                {dynamicFilters.statuses?.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl variant="outlined" size="small" fullWidth>
              <InputLabel id="tool-label">Tool</InputLabel>
              <Select
                labelId="tool-label"
                value={filters.tool}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, tool: e.target.value }))
                }
                label="Tool"
              >
                <MenuItem value="all">All Tools</MenuItem>
                {dynamicFilters.tools.map((tool) => (
                  <MenuItem key={tool} value={tool}>
                    {tool}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl variant="outlined" size="small" fullWidth>
              <InputLabel id="pyq-label">Previous Year Questions</InputLabel>
              <Select
                labelId="pyq-label"
                value={filters.pyqDetails}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, pyqDetails: e.target.value }))
                }
                label="Previous Year Questions"
              >
                <MenuItem value="all">All Questions</MenuItem>
                {dynamicFilters.pyqDetails?.map((detail) => (
                  <MenuItem key={detail} value={detail}>
                    {detail}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => {
                handleClear();
                setFilters({
                  difficulty: "all",
                  exam: "all",
                  subject: "all",
                  tool: "all",
                  status: "all",
                  pyqDetails: "all",
                });
              }}
              startIcon={<ClearIcon />}
            >
              Reset Filters
            </Button>
          </Box>
        </Box>

        <Box
          sx={{
            bgcolor: "white",
            borderRadius: 2,
            boxShadow: 1,
            overflow: "hidden",
          }}
        >
          <DataGrid
            rows={rows}
            columns={columns}
            onRowClick={handleRowClick}
            pagination
            paginationMode="server"
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            rowCount={totalRows}
            loading={loading}
            pageSizeOptions={[10, 20, 50, 100]} // Add this line
            components={{
              Toolbar: GridToolbar,
            }}
            autoHeight
            sx={{
              "& .MuiDataGrid-columnHeader": {
                backgroundColor: "grey.100",
                fontWeight: "bold",
                borderBottom: "1px solid #ccc",
              },
              "& .MuiDataGrid-row": {
                "&:hover": {
                  backgroundColor: "grey.50",
                },
              },
              "& .MuiDataGrid-cell": {
                borderBottom: "1px solid #e0e0e0",
              },
              "& .MuiDataGrid-toolbarContainer": {
                backgroundColor: "grey.50",
                borderBottom: "1px solid #ddd",
                padding: 2,
              },
              "& .MuiDataGrid-footerContainer": {
                borderTop: "1px solid #ccc",
                backgroundColor: "grey.50",
              },
              "& .MuiTablePagination-root": {
                color: "text.primary",
              },
            }}
          />
        </Box>
        <Toaster />
      </Box>
      <QuestionDetailsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        question={selectedQuestion}
      />
    </>
  );
}