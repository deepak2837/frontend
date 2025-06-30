"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { toast, Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";
import LineLoader from "@/components/common/Loader"; // Import loader component
import QuestionDetailsModal from "@/components/QuestionDetailsModal";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  IconButton,
  Typography,
} from "@mui/material";
import {
  Clear as ClearIcon,
  Search as SearchIcon,
} from "@mui/icons-material";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const QuestionHoverModal = ({ question, position }) => {
  if (!question) return null;

  return (
    <div
      className="absolute z-50 bg-white rounded-lg shadow-xl p-4 w-96"
      style={{
        top: `${position.y + 20}px`,
        left: `${position.x}px`,
      }}
    >
      <h3 className="font-bold mb-2">{question.question}</h3>
      <div className="space-y-2">
        {Object.entries(question.options).map(([key, value]) => (
          <div
            key={key}
            className={`${
              question.answer === key ? "text-green-600 font-medium" : ""
            }`}
          >
            {key}. {value}
          </div>
        ))}
      </div>
      <div className="mt-3 pt-3 border-t">
        <p className="text-sm text-gray-600">{question.explanation}</p>
      </div>
    </div>
  );
};

export default function AddQuestionsToTest({ params }) {
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [testDetails, setTestDetails] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText, setDebouncedSearchText] = useState("");
  const searchInputRef = useRef(""); // Ref to hold the input value
  const searchTimeoutRef = useRef(null);
  const { getToken } = useAuthStore();
  const router = useRouter();
  const [hoverQuestion, setHoverQuestion] = useState(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });

  const [filters, setFilters] = useState({
    subject: "all",
    difficulty: "all",
    exam: "all",
    tool: "all", // Add tool filter
    status: "all",
    pyqDetails: "all",
  });

  const [dynamicFilters, setDynamicFilters] = useState({
    subjects: [],
    exams: [],
    difficulties: [],
    tools: [], // Add tools to dynamic filters
    statuses: [],
    pyqDetails: [],
  });

  // Add pagination state
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 50, // Updated to match manage-questions
  });
  const [totalRows, setTotalRows] = useState(0); // Total rows from backend

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

  useEffect(() => {
    const token = getToken();
    if (!token) {
      toast.error("Please login to continue");
      router.push("/login");
      return;
    }
  }, []);

  const fetchDropdownValues = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/v1/questions/dropdowns`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setDynamicFilters(data.data); // Set dropdown values from API
      }
    } catch (error) {
      toast.error("Error fetching filter options: " + error.message);
    }
  };

  useEffect(() => {
    fetchDropdownValues();
  }, []);

  const fetchTestDetails = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/mock-test/${params.id}`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      const data = await response.json();
      if (data.success) setTestDetails(data.data);
    } catch (error) {
      toast.error("Error fetching test details");
    }
  };

  const fetchAllQuestions = async () => {
    try {
      const queryParams = new URLSearchParams({
        page: paginationModel.page + 1, // Convert to 1-based for backend
        limit: paginationModel.pageSize,
        ...(filters.subject !== "all" && { subject: filters.subject }),
        ...(filters.difficulty !== "all" && { difficulty: filters.difficulty }),
        ...(filters.exam !== "all" && { exam: filters.exam }),
        ...(filters.tool !== "all" && { tool: filters.tool }),
        ...(filters.status !== "all" && { status: filters.status }),
        ...(filters.pyqDetails !== "all" && { pyqDetails: filters.pyqDetails }),
        ...(debouncedSearchText && { searchText: debouncedSearchText }),
      });

      const response = await fetch(`${BASE_URL}/api/v1/questions?${queryParams}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setQuestions(data.data);
        setTotalRows(data.pagination.total); // Update total rows from backend
      }
      setLoading(false);
    } catch (error) {
      toast.error("Error fetching questions");
      setLoading(false);
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      await fetchTestDetails();
      await fetchAllQuestions();
    };

    initializeData();
  }, [params.id, debouncedSearchText, filters, paginationModel]);

  const handleAddQuestions = async () => {
    if (!selectedQuestions.length) {
      toast.error("Please select questions to add");
      return;
    }

    try {
      const token = getToken();
      const response = await fetch(
        `${BASE_URL}/api/v1/mock-test/${params.id}/add-questions`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ questions: selectedQuestions }),
        }
      );

      const data = await response.json();
      if (data.success) {
        toast.success("Questions added successfully");
        setSelectedQuestions([]);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
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
      field: "subject",
      headerName: "Subject",
      width: 150,
    },
    {
      field: "difficulty",
      headerName: "Difficulty",
      width: 120,
    },
    {
      field: "exam",
      headerName: "Exam",
      width: 150,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <button
          onClick={() => router.push(`/manage-questions/edit-question/${params.row._id}`)}
          className="text-blue-600 hover:underline"
        >
          Edit
        </button>
      ),
    },
  ];

  const FilterSection = () => (
    <Box sx={{ bgcolor: "white", borderRadius: 2, boxShadow: 1, p: 2, mb: 3 }}>
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

        {/* Subject Filter */}
        <FormControl variant="outlined" size="small" fullWidth>
          <InputLabel>Subject</InputLabel>
          <Select
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

        {/* Exam Filter */}
        <FormControl variant="outlined" size="small" fullWidth>
          <InputLabel>Exam</InputLabel>
          <Select
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

        {/* Difficulty Filter */}
        <FormControl variant="outlined" size="small" fullWidth>
          <InputLabel>Difficulty</InputLabel>
          <Select
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

        {/* Tool Filter */}
        <FormControl variant="outlined" size="small" fullWidth>
          <InputLabel>Tool</InputLabel>
          <Select
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

        {/* Status Filter */}
        <FormControl variant="outlined" size="small" fullWidth>
          <InputLabel>Status</InputLabel>
          <Select
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

        {/* PYQ Filter */}
        <FormControl variant="outlined" size="small" fullWidth>
          <InputLabel>Previous Year Questions</InputLabel>
          <Select
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
              subject: "all",
              difficulty: "all",
              exam: "all",
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
  );

  if (loading) return <LineLoader />;

  return (
    <div className="p-4 relative">
      <button
        onClick={() => router.push("/manage-mock-test")}
        className="mb-4 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 flex items-center gap-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
            clipRule="evenodd"
          />
        </svg>t
        Back to Mock Tests
      </button>
      {testDetails && (
        <div className="bg-white rounded-lg shadow p-4 mb-4">
          <h2 className="text-xl font-bold mb-2">{testDetails.testName}</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Test Type</p>
              <p className="font-medium">{testDetails.testType}</p>
            </div>
            <div>
              <p className="text-gray-600">Category</p>
              <p className="font-medium">{testDetails.category}</p>
            </div>
            <div>
              <p className="text-gray-600">Number of Questions</p>
              <p className="font-medium">{testDetails.numberOfQuestions}</p>
            </div>
          </div>
        </div>
      )}
      <FilterSection />
      {/* Questions Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <DataGrid
          rows={questions}
          columns={columns}
          getRowId={(row) => row._id}
          checkboxSelection
          onRowSelectionModelChange={(newSelection) => {
            setSelectedQuestions(newSelection);
          }}
          rowSelectionModel={selectedQuestions}
          pagination
          paginationMode="server"
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          rowCount={totalRows}
          loading={loading}
          pageSizeOptions={[10, 20, 50, 100]}
          components={{
            Toolbar: GridToolbar,
          }}
          autoHeight
          onMouseEnter={(e) => {
            const row = e.currentTarget.getBoundingClientRect();
            setHoverPosition({ x: row.left, y: row.top });
          }}
          getRowStyle={{ cursor: "pointer" }}
          getRowClassName={() => "MuiDataGrid-row:hover"}
          onRowMouseEnter={(params, event) => {
            setHoverQuestion(params.row);
            const row = event.currentTarget.getBoundingClientRect();
            setHoverPosition({ x: row.left, y: row.top });
          }}
          onRowMouseLeave={() => {
            setHoverQuestion(null);
          }}
          onRowClick={handleRowClick}
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
          }}
        />
        <QuestionHoverModal question={hoverQuestion} position={hoverPosition} />
      </div>

      {/* Add Selected Questions Button */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleAddQuestions}
          disabled={selectedQuestions.length === 0}
          className={`px-6 py-2 rounded-lg ${
            selectedQuestions.length > 0
              ? "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
              : "bg-gray-300 cursor-not-allowed text-gray-500"
          }`}
        >
          Add Selected Questions ({selectedQuestions.length})
        </button>
      </div>

      <QuestionDetailsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        question={selectedQuestion}
      />

      <Toaster />
    </div>
  );
}
