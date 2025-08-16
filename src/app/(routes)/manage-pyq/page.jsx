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
  Chip,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Clear as ClearIcon,
  Search as SearchIcon,
  Download as DownloadIcon,
} from "@mui/icons-material";
import useAuthStore from "@/store/authStore";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

// Constants
const COUNTRIES = ["India", "USA", "UK", "Canada", "Australia", "Germany", "France", "Other"];
const PAPER_TYPES = ["pdf", "image"];
const STATUS_OPTIONS = ["active", "inactive", "draft"];

export default function ManagePYQ() {
  const [allPYQs, setAllPYQs] = useState([]);
  const [filteredPYQs, setFilteredPYQs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { getToken } = useAuthStore();
  const [dynamicFilters, setDynamicFilters] = useState({
    universities: [],
    countries: [],
    courses: [],
    subjects: [],
    years: [],
    examNames: [],
  });
  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText, setDebouncedSearchText] = useState("");
  const searchInputRef = useRef("");
  const searchTimeoutRef = useRef(null);
  const [filters, setFilters] = useState({
    universityName: "all",
    country: "all",
    courseName: "all",
    subject: "all",
    year: "all",
    examName: "all",
    status: "all",
  });
  const [totalRows, setTotalRows] = useState(0);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 50,
  });

  // Fetch PYQs from API
  const fetchPYQs = useCallback(async () => {
    try {
      setLoading(true);
      const token = getToken();
      if (!token) {
        router.push("/login");
        return;
      }

      const queryParams = new URLSearchParams({
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
        ...filters,
        searchText: debouncedSearchText,
      });

      const response = await fetch(`${BASE_URL}/api/v1/pyq?${queryParams}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch PYQs");
      }

      const data = await response.json();
      if (data.success) {
        setAllPYQs(data.data);
        setFilteredPYQs(data.data);
        setTotalRows(data.pagination.total);
      } else {
        throw new Error(data.message || "Failed to fetch PYQs");
      }
    } catch (error) {
      console.error("Error fetching PYQs:", error);
      setError(error.message);
      toast.error("Failed to fetch PYQs");
    } finally {
      setLoading(false);
    }
  }, [paginationModel, filters, debouncedSearchText, getToken, router]);

  // Fetch dropdown values
  const fetchDropdownValues = useCallback(async () => {
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
  }, [getToken]);

  // Delete PYQ
  const handleDeletePYQ = async (id) => {
    if (!window.confirm("Are you sure you want to delete this PYQ?")) {
      return;
    }

    try {
      const token = getToken();
      const response = await fetch(`${BASE_URL}/api/v1/pyq/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          toast.success("PYQ deleted successfully");
          fetchPYQs();
        } else {
          toast.error(data.message || "Failed to delete PYQ");
        }
      } else {
        toast.error("Failed to delete PYQ");
      }
    } catch (error) {
      console.error("Error deleting PYQ:", error);
      toast.error("Failed to delete PYQ");
    }
  };

  // Handle search with debouncing
  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchText(value);
    searchInputRef.current = value;

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearchText(value);
    }, 500);
  };

  // Handle filter changes
  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({ ...prev, [filterName]: value }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      universityName: "all",
      country: "all",
      courseName: "all",
      subject: "all",
      year: "all",
      examName: "all",
      status: "all",
    });
    setSearchText("");
    setDebouncedSearchText("");
    searchInputRef.current = "";
  };

  // DataGrid columns
  const columns = [
    {
      field: "universityName",
      headerName: "University",
      flex: 1,
      minWidth: 200,
    },
    {
      field: "country",
      headerName: "Country",
      width: 120,
      renderCell: (params) => (
        <Chip label={params.value} size="small" color="primary" variant="outlined" />
      ),
    },
    {
      field: "examName",
      headerName: "Exam Name",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "year",
      headerName: "Year",
      width: 80,
      type: "number",
    },
    {
      field: "courseName",
      headerName: "Course",
      width: 120,
    },
    {
      field: "subject",
      headerName: "Subject",
      width: 150,
    },
    {
      field: "paperType",
      headerName: "Type",
      width: 100,
      renderCell: (params) => (
        <Chip 
          label={params.value.toUpperCase()} 
          size="small" 
          color={params.value === 'pdf' ? 'error' : 'success'} 
        />
      ),
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          size="small" 
          color={params.value === 'active' ? 'success' : params.value === 'inactive' ? 'error' : 'warning'} 
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <IconButton
            size="small"
            color="primary"
            onClick={() => window.open(params.row.fileUrl, '_blank')}
            title="Download"
          >
            <DownloadIcon />
          </IconButton>
          <IconButton
            size="small"
            color="primary"
            onClick={() => router.push(`/manage-pyq/edit-pyq/${params.row._id}`)}
            title="Edit"
          >
            <EditIcon />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={() => handleDeletePYQ(params.row._id)}
            title="Delete"
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  // Effects
  useEffect(() => {
    fetchDropdownValues();
  }, [fetchDropdownValues]);

  useEffect(() => {
    fetchPYQs();
  }, [fetchPYQs]);

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  if (loading && allPYQs.length === 0) {
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
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4" component="h1">
          Manage PYQ
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => router.push("/manage-pyq/add-pyq")}
        >
          Add PYQ
        </Button>
      </Box>

      {/* Filters */}
      <Box sx={{ mb: 3, p: 2, bgcolor: "background.paper", borderRadius: 1 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Filters
        </Typography>
        
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center" }}>
          {/* Search */}
          <Box sx={{ minWidth: 200 }}>
            <input
              type="text"
              placeholder="Search..."
              value={searchText}
              onChange={handleSearchChange}
              style={{
                width: "100%",
                padding: "8px 12px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                fontSize: "14px",
              }}
            />
          </Box>

          {/* University Filter */}
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>University</InputLabel>
            <Select
              value={filters.universityName}
              label="University"
              onChange={(e) => handleFilterChange("universityName", e.target.value)}
            >
              <MenuItem value="all">All Universities</MenuItem>
              {dynamicFilters.universities?.map((university) => (
                <MenuItem key={university} value={university}>
                  {university}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Country Filter */}
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Country</InputLabel>
            <Select
              value={filters.country}
              label="Country"
              onChange={(e) => handleFilterChange("country", e.target.value)}
            >
              <MenuItem value="all">All Countries</MenuItem>
              {COUNTRIES.map((country) => (
                <MenuItem key={country} value={country}>
                  {country}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Course Filter */}
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Course</InputLabel>
            <Select
              value={filters.courseName}
              label="Course"
              onChange={(e) => handleFilterChange("courseName", e.target.value)}
            >
              <MenuItem value="all">All Courses</MenuItem>
              {dynamicFilters.courses?.map((course) => (
                <MenuItem key={course} value={course}>
                  {course}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Subject Filter */}
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Subject</InputLabel>
            <Select
              value={filters.subject}
              label="Subject"
              onChange={(e) => handleFilterChange("subject", e.target.value)}
            >
              <MenuItem value="all">All Subjects</MenuItem>
              {dynamicFilters.subjects?.map((subject) => (
                <MenuItem key={subject} value={subject}>
                  {subject}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Year Filter */}
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Year</InputLabel>
            <Select
              value={filters.year}
              label="Year"
              onChange={(e) => handleFilterChange("year", e.target.value)}
            >
              <MenuItem value="all">All Years</MenuItem>
              {dynamicFilters.years?.map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Status Filter */}
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={filters.status}
              label="Status"
              onChange={(e) => handleFilterChange("status", e.target.value)}
            >
              <MenuItem value="all">All Status</MenuItem>
              {STATUS_OPTIONS.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Clear Filters */}
          <Button
            variant="outlined"
            startIcon={<ClearIcon />}
            onClick={clearFilters}
          >
            Clear
          </Button>
        </Box>
      </Box>

      {/* DataGrid */}
      <Box sx={{ height: 600, width: "100%" }}>
        <DataGrid
          rows={filteredPYQs}
          columns={columns}
          getRowId={(row) => row._id}
          pagination
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[25, 50, 100]}
          rowCount={totalRows}
          paginationMode="server"
          loading={loading}
          disableRowSelectionOnClick
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: false,
            },
          }}
        />
      </Box>
    </Box>
  );
} 