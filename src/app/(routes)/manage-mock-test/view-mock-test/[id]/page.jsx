"use client";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { toast, Toaster } from "react-hot-toast";
import {
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  CircularProgress,
  Tooltip,
  IconButton,
} from "@mui/material";
import { ArrowBack as ArrowBackIcon, Edit as EditIcon } from "@mui/icons-material";
import useAuthStore from "@/store/authStore";
import QuestionDetailsModal from "@/components/QuestionDetailsModal";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default function ViewMockTest({ params }) {
  const [loading, setLoading] = useState(true);
  const [testDetails, setTestDetails] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filters, setFilters] = useState({
    subject: "all",
    difficulty: "all",
  });
  const [dynamicFilters, setDynamicFilters] = useState({
    subjects: [],
    difficulties: [],
  });
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const { getToken } = useAuthStore();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      toast.error("Please login to continue");
      router.push("/login");
      return;
    }
  }, []);

  useEffect(() => {
    if (questions.length > 0) {
      setDynamicFilters({
        subjects: [...new Set(questions.map((q) => q.subject))],
        difficulties: [...new Set(questions.map((q) => q.difficulty))],
      });
    }
  }, [questions]);

  const fetchTestDetails = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/v1/mock-test/${params.id}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setTestDetails(data.data);
        setQuestions(data.data.questions || []);
      } else {
        toast.error(data.message || "Failed to fetch test details.");
      }
    } catch (error) {
      toast.error("Error fetching test details: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestDetails();
  }, [params.id]);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const subject = queryParams.get("subject") || "all";
    const difficulty = queryParams.get("difficulty") || "all";
    const search = queryParams.get("search") || "";

    setFilters({ subject, difficulty });
    setSearchText(search);
  }, []);

  const filteredQuestions = useMemo(() => {
    return questions.filter((question) => {
      const matchesSearch =
        searchText.trim() === "" ||
        question.question.toLowerCase().includes(searchText.toLowerCase());
      const matchesSubject =
        filters.subject === "all" || question.subject === filters.subject;
      const matchesDifficulty =
        filters.difficulty === "all" ||
        question.difficulty === filters.difficulty;

      return matchesSearch && matchesSubject && matchesDifficulty;
    }).map((question) => ({
      ...question,
      uniqueId: question._id || `${question.question}-${question.subject}-${Math.random()}`
    }));
  }, [questions, searchText, filters]);

  const resetFilters = () => {
    setSearchText("");
    setFilters({
      subject: "all",
      difficulty: "all",
    });
  };

  const handleDeleteSelectedQuestions = async () => {
    if (selectedQuestions.length < 1) return;

    // Get the actual question IDs from the filtered questions
    const questionIdsToDelete = selectedQuestions.map(selectedId => {
      const question = filteredQuestions.find(q => q.uniqueId === selectedId);
      return question._id;
    }).filter(Boolean); // Remove any undefined values

    try {
      const response = await fetch(`${BASE_URL}/api/v1/mock-test/${params.id}/remove-questions`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ questions: questionIdsToDelete }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Selected questions removed successfully.");
        setQuestions((prev) =>
          prev.filter((q) => !questionIdsToDelete.includes(q._id))
        );
        setSelectedQuestions([]);
      } else {
        toast.error(data.message || "Failed to remove questions.");
      }
    } catch (error) {
      toast.error("Error removing questions: " + error.message);
    }
  };

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
      field: "subject",
      headerName: "Subject",
      width: 150,
      renderCell: (params) => (
        <Typography variant="body2">{params.value}</Typography>
      ),
    },
    {
      field: "difficulty",
      headerName: "Difficulty",
      width: 120,
      renderCell: (params) => (
        <Typography variant="body2">{params.value}</Typography>
      ),
    },
    {
      field: "actions",
      headerName: "Edit",
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <Tooltip title="Edit Question">
          <IconButton
            aria-label="edit question"
            onClick={() => {
              const queryParams = new URLSearchParams({
                subject: filters.subject,
                difficulty: filters.difficulty,
                search: searchText,
              }).toString();
              router.push(`/manage-questions/edit-question/${params.row._id}`);
            }}
            color="primary"
            size="small"
          >
            <EditIcon />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  if (loading) {
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

  return (
    <Box sx={{ p: 3, bgcolor: "background.default", minHeight: "100vh" }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => router.push("/manage-mock-test")}
        sx={{ mb: 2 }}
      >
        Back to Mock Tests
      </Button>

      {/* Test Details Card */}
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h5" component="div" gutterBottom>
            Mock Test Details
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 2,
            }}
          >
            <Typography variant="body1">
              <Typography component="span" fontWeight="medium">
                Name:{" "}
              </Typography>
              {testDetails?.testName}
            </Typography>
            <Typography variant="body1">
              <Typography component="span" fontWeight="medium">
                Title:{" "}
              </Typography>{" "}
              {testDetails?.title}
            </Typography>
            <Typography variant="body1">
              <Typography component="span" fontWeight="medium">
                Type:{" "}
              </Typography>{" "}
              {testDetails?.testType}
            </Typography>
            <Typography variant="body1">
              <Typography component="span" fontWeight="medium">
                Category:{" "}
              </Typography>
              {testDetails?.category}
            </Typography>
            <Typography variant="body1">
              <Typography component="span" fontWeight="medium">
                Difficulty Level:{" "}
              </Typography>
              {testDetails?.difficultyLevel}
            </Typography>
            <Typography variant="body1">
              <Typography component="span" fontWeight="medium">
                Status:{" "}
              </Typography>
              {testDetails?.status}
            </Typography>
            <Typography variant="body1">
              <Typography component="span" fontWeight="medium">
                Pass Percentage:{" "}
              </Typography>
              {testDetails?.passPercentage}%
            </Typography>
            <Typography variant="body1">
              <Typography component="span" fontWeight="medium">
                Time Limit:{" "}
              </Typography>
              {testDetails?.timeLimit} minutes
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <TextField
            label="Search questions..."
            variant="outlined"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            fullWidth
            size="small"
          />

          <FormControl fullWidth size="small">
            <InputLabel>Subject</InputLabel>
            <Select
              value={filters.subject}
              label="Subject"
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, subject: e.target.value }))
              }
            >
              <MenuItem value="all">All Subjects</MenuItem>
              {dynamicFilters.subjects.map((subject) => (
                <MenuItem key={subject} value={subject}>
                  {subject}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel>Difficulty</InputLabel>
            <Select
              value={filters.difficulty}
              label="Difficulty"
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  difficulty: e.target.value,
                }))
              }
            >
              <MenuItem value="all">All Difficulties</MenuItem>
              {dynamicFilters.difficulties.map((difficulty) => (
                <MenuItem key={difficulty} value={difficulty}>
                  {difficulty}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <Button onClick={resetFilters} sx={{ mt: 2 }}>
          Reset Filters
        </Button>
      </div>

      {/* Questions Table */}
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Questions
          </Typography>
          <DataGrid
            rows={filteredQuestions}
            columns={columns}
            getRowId={(row) => row.uniqueId}
            initialState={{
              pagination: {
                pageSize: 10,
              },
            }}
            pageSizeOptions={[10, 25, 50]}
            components={{
              Toolbar: GridToolbar,
            }}
            autoHeight
            checkboxSelection
            disableRowSelectionOnClick
            onRowSelectionModelChange={(newSelection) => {
              setSelectedQuestions(newSelection);
            }}
            onRowClick={handleRowClick}
          />
          {selectedQuestions.length > 0 && (
            <Button
              variant="contained"
              color="error"
              onClick={handleDeleteSelectedQuestions}
              sx={{ mt: 2 }}
            >
              Delete Selected Questions
            </Button>
          )}
        </CardContent>
      </Card>

      <QuestionDetailsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        question={selectedQuestion}
      />

      <Toaster />
    </Box>
  );
}
