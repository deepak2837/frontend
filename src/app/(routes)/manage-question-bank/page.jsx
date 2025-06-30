"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Link from "next/link";

import { toast, Toaster } from "react-hot-toast";
import { IconButton } from "@mui/material";
import {
  Visibility as VisibilityIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import useAuthStore from "@/store/authStore";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default function ManageQuestionBanks() {
  const [questionBanks, setQuestionBanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const [allQuestionBanks, setAllQuestionBanks] = useState([]);
  const [filteredBanks, setFilteredBanks] = useState([]);

  const [filters, setFilters] = useState({
    status: "all", // live, draft, dead
  });
  const [page, setPage] = useState(1); // Add page state
  const [pageSize, setPageSize] = useState(10); // Add pageSize state
  const [total, setTotal] = useState(0); // Add total count state

  const { getToken } = useAuthStore();

  useEffect(() => {
    const storedToken = getToken();
    console.log(storedToken);
    if (!storedToken) {
      console.log("am i reachin here ");
      router.push("/login"); // Redirect to login if no token
      return;
    }
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/v1/blog`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching subjects:", error.message);
      toast.error("Failed to fetch subjects");
      return null;
    }
  };

  const fetchQuestions = async () => {
    try {
      const url = new URL(`${BASE_URL}/api/v1/question-bank/list`);
      url.searchParams.append("page", page); // Add page parameter
      url.searchParams.append("pageSize", pageSize); // Add pageSize parameter

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching questions:", error.message);
      toast.error("Failed to fetch questions");
      return null;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const questionsData = await fetchQuestions();

        if (questionsData) {
          setAllQuestionBanks(questionsData.data);
          setFilteredBanks(questionsData.data);
          setTotal(questionsData.total); // Update total count from backend
        }
      } catch (error) {
        setError("Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, pageSize]); // Fetch data whenever page or pageSize changes

  const columns = [
    {
      field: "title",
      headerName: "title",
      flex: 1,
      renderCell: (params) => (
        <div className="whitespace-normal font-medium text-gray-700">
          {params.value}
        </div>
      ),
    }, {
      field: "name",
      headerName: "Name",
      flex: 1,
      renderCell: (params) => (
        <div className="whitespace-normal font-medium text-gray-700">
          {params.value}
        </div>
      ),
    },
    , {
      field: "totalQuestions",
      headerName: "Number of Question",
      flex: 1,
      renderCell: (params) => (
        <div className="whitespace-normal font-medium text-gray-700">
          {params.value}
        </div>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params) => (
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
            params.value === "live"
              ? "bg-green-100 text-green-800"
              : params.value === "draft"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {params.value}
        </span>
      ),
    },

    {
      field: "actions",
      headerName: "Actions",
      width: 250,
      sortable: false, // Actions are typically not sortable
      headerAlign: "center",
      renderCell: (params) => (
        <div className="flex items-center justify-center gap-2">
          <IconButton
            aria-label="view"
            component={Link}
            href={`/manage-question-bank/view-question-bank/${params.row._id}`}
            color="primary"
          >
            <VisibilityIcon />
          </IconButton>
          <IconButton
            aria-label="add questions"
            component={Link}
            href={`/manage-question-bank/add-questions-to-bank/${params.row._id}`}
            color="success"
          >
            <AddIcon />
          </IconButton>
          <IconButton
            aria-label="edit"
            component={Link}
            href={`/manage-question-bank/edit-question-bank/${params.row._id}`}
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
          {params.row.status !== "dead" && (
            <IconButton
              aria-label="mark dead"
              onClick={() => handleMarkDead(params.row._id)}
              color="default"
            >
              <CloseIcon />
            </IconButton>
          )}
        </div>
      ),
    },
  ];

  useEffect(() => {
    setLoading(true);
    try {
      if (allQuestionBanks.length > 0) {
        let filtered = [...allQuestionBanks];

        // Apply status filter
        if (filters.status !== "all") {
          filtered = filtered.filter((bank) => bank.status === filters.status);
        }

        // Apply search filter
        if (searchText.trim()) {
          filtered = filtered.filter((bank) =>
            bank.name.toLowerCase().includes(searchText.toLowerCase())
          );
        }

        setFilteredBanks(filtered);
        setTotal(filtered.length);
      }
    } catch (error) {
      setError("Error filtering data: " + error.message);
    } finally {
      setLoading(false);
    }
  }, [searchText, filters.status, allQuestionBanks]);

  const handleDelete = async (bankId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this question bank?"
    );
    if (!confirmDelete) return;
    try {
      const token = getToken();
      console.log("token in delete ", token);
      const response = await fetch(
        `${BASE_URL}/api/v1/question-bank/delete/${bankId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        toast.success("Question bank deleted successfully");
        //Optimistic Update: Remove bank from local state
        setQuestionBanks((prevBanks) =>
          prevBanks.filter((bank) => bank._id !== bankId)
        );
        setTotal((prevTotal) => prevTotal - 1); //Reduce total count
      } else {
        const errorData = await response.json();
        toast.error(
          `Error deleting question bank: ${
            errorData.message || "Unknown error"
          }`
        );
      }
    } catch (error) {
      toast.error("Error deleting question bank: " + error.message);
    }
  };

  const handleMarkDead = async (bankId) => {
    const confirmMarkDead = window.confirm(
      "Are you sure you want to mark this question bank as dead?"
    );
    if (!confirmMarkDead) return;
    try {
      const token = getToken();
      console.log("token in mark dead ", token);
      const response = await fetch(
        `${BASE_URL}/api/v1/question-bank/mark-dead/${bankId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        toast.success("Question bank marked as dead");
        // Optimistic Update:  Update the status in the local state
        setQuestionBanks((prevBanks) =>
          prevBanks.map((bank) =>
            bank._id === bankId ? { ...bank, status: "dead" } : bank
          )
        );
      } else {
        const errorData = await response.json();
        toast.error(
          `Error marking question bank as dead: ${
            errorData.message || "Unknown error"
          }`
        );
      }
    } catch (error) {
      toast.error("Error marking question bank as dead: " + error.message);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Error: {error}
      </div>
    );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Manage Question Banks
        </h1>
        <Link
          href="/manage-question-bank/add-question-bank"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2"
        >
          <AddIcon className="h-5 w-5" />
          Create Question Bank
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Search question banks..."
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              setPage(1); // Reset to page 1 on search
            }}
            className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select
            value={filters.status}
            onChange={(e) => {
              setFilters((prev) => ({ ...prev, status: e.target.value }));
              setPage(1); // Reset to page 1 on filter change
            }}
            className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="live">Live</option>
            <option value="draft">Draft</option>
            <option value="dead">Dead</option>
          </select>
        </div>
      </div>
     
      <div className="bg-white rounded-xl shadow-md overflow-hidden display-flex flex-col">
        <DataGrid
          rows={filteredBanks} // Use filteredBanks directly
          columns={columns}
          pageSize={pageSize}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)} // Handle rows per page change
          rowsPerPageOptions={[10, 25]} // Rows per page options
          pagination // Enable client-side pagination
          page={page - 1} // DataGrid uses 0-based indexing
          onPageChange={(newPage) => setPage(newPage + 1)} // Update page state
          rowCount={total} // Use total count from backend
           // Enable server-side pagination
          disableSelectionOnClick
          getRowId={(row) => row._id} // Use `_id` as the unique identifier for rows
          components={{
            Toolbar: GridToolbar,
          }}
          autoHeight
          className="min-h-[600px]"
          sx={{
            "& .MuiDataGrid-columnHeader": {
              backgroundColor: "#f0f4f8",
              fontWeight: "bold",
              borderBottom: "1px solid #ccc",
            },
            "& .MuiDataGrid-row": {
              "&:hover": {
                backgroundColor: "#f5f5f5",
              },
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "1px solid #e0e0e0",
            },
            "& .MuiDataGrid-toolbarContainer": {
              backgroundColor: "#f8f8f8",
              borderBottom: "1px solid #ddd",
              padding: "8px",
            },
            "& .MuiDataGrid-footerContainer": {
              borderTop: "1px solid #ccc",
              backgroundColor: "#f8f9fa",
            },
            "& .MuiTablePagination-root": {
              color: "#333",
            },
            "& .MuiDataGrid-pagination": {
              justifyContent: "flex-end",
            },
          }}
        />
      </div>
      <Toaster />
    </div>
  );
}
