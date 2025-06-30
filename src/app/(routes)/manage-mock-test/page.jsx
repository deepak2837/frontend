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
  AddCircle as AddCircleIcon,
} from "@mui/icons-material";
import useAuthStore from "@/store/authStore";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default function ManageMockTests() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const [allTests, setAllTests] = useState([]);
  const [filteredTests, setFilteredTests] = useState([]);
  const [filters, setFilters] = useState({
    status: "all",
    testType: "all"
  });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  
  const { getToken } = useAuthStore();

  const columns = [
    {
      field: "title",
      headerName: "Test Title",
      flex: 1,
      renderCell: (params) => (
        <div className="whitespace-normal font-medium text-gray-700">
          {params.value}
        </div>
      ),
    },
    {
      field: "testName",
      headerName: "Test Name",
      flex: 1,
      renderCell: (params) => (
        <div className="whitespace-normal font-medium text-gray-700">
          {params.value}
        </div>
      ),
    }
    ,
    {
      field: "numberOfQuestions",
      headerName: "Total Questions",
      flex: 1,
      renderCell: (params) => (
        <div className="whitespace-normal font-medium text-gray-700">
          {params.value}
        </div>
      ),
    },
    {
      field: "testType",
      headerName: "Type",
      width: 120,
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params) => (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold 
          ${params.value === "live" ? "bg-green-100 text-green-800" : 
            params.value === "upcoming" ? "bg-yellow-100 text-yellow-800" : 
            "bg-red-100 text-red-800"}`}>
          {params.value}
        </span>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 300,
      renderCell: (params) => (
        <div className="flex items-center justify-center gap-2">
          <IconButton
            component={Link}
            href={`/manage-mock-test/view-mock-test/${params.row._id}`}
            color="primary"
          >
            <VisibilityIcon />
          </IconButton>
          <IconButton
            component={Link}
            href={`/manage-mock-test/add-questions-to-test/${params.row._id}`}
            color="success"
          >
            <AddCircleIcon />
          </IconButton>
          <IconButton
            component={Link}
            href={`/manage-mock-test/edit-mock-test/${params.row._id}`}
            color="warning"
          >
            <EditIcon />
          </IconButton>
          <IconButton
            onClick={() => handleDelete(params.row._id)}
            color="error"
          >
            <DeleteIcon />
          </IconButton>
          {params.row.status !== "dead" && (
            <IconButton
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
    const storedToken = getToken();
    if (!storedToken) {
      router.push("/login");
      return;
    }
    fetchTests();
  }, []);

  const fetchTests = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/v1/mock-test`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch tests');
      
      const data = await response.json();
      setAllTests(data.data);
      setFilteredTests(data.data);
      setTotal(data.data.length);
    } catch (error) {
      setError(error.message);
      toast.error('Failed to fetch tests');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (testId) => {
    if (!window.confirm('Are you sure you want to delete this test?')) return;
    
    try {
      const response = await fetch(`${BASE_URL}/api/v1/mock-test/${testId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      
      if (response.ok) {
        toast.success('Test deleted successfully');
        setFilteredTests(prev => prev.filter(test => test._id !== testId));
      } else {
        toast.error('Failed to delete test');
      }
    } catch (error) {
      toast.error('Error deleting test');
    }
  };

  const handleMarkDead = async (testId) => {
    if (!window.confirm('Are you sure you want to mark this test as dead?')) return;
    
    try {
      const response = await fetch(`${BASE_URL}/api/v1/mock-test/${testId}/mark-dead`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      
      if (response.ok) {
        toast.success('Test marked as dead');
        fetchTests(); // Refresh the list
      } else {
        toast.error('Failed to mark test as dead');
      }
    } catch (error) {
      toast.error('Error updating test status');
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
  </div>;

  if (error) return <div className="flex justify-center items-center h-screen text-red-500">
    Error: {error}
  </div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Manage Mock Tests</h1>
        <Link
          href="/manage-mock-test/add-mock-test"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2"
        >
          <AddIcon className="h-5 w-5" />
          Create Mock Test
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Search tests..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg"
          />

          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg"
          >
            <option value="all">All Status</option>
            <option value="upcoming">Upcoming</option>
            <option value="live">Live</option>
            <option value="dead">Dead</option>
          </select>

          <select
            value={filters.testType}
            onChange={(e) => setFilters(prev => ({ ...prev, testType: e.target.value }))}
            className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg"
          >
            <option value="all">All Types</option>
            <option value="Exam">Exam</option>
            <option value="Course">Course</option>
            <option value="Subject">Subject</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <DataGrid
          rows={filteredTests.map(test => ({ ...test, id: test._id }))}
          columns={columns}
          pageSize={pageSize}
          rowCount={total}
          pagination
          page={page - 1}
          onPageChange={(newPage) => setPage(newPage + 1)}
          onPageSizeChange={setPageSize}
          rowsPerPageOptions={[10, 25, 50]}
          autoHeight
          components={{ Toolbar: GridToolbar }}
          className="min-h-[600px]"
        />
      </div>
      <Toaster />
    </div>
  );
}