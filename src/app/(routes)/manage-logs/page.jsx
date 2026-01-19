"use client";

import { useState, useEffect } from "react";
import { FileText, Trash2, RefreshCw, Filter, Download } from "lucide-react";
import Api from "@/services/Api";
import LineLoader from "@/components/common/Loader";

export default function ManageLogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [logType, setLogType] = useState("combined");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [linesPerPage, setLinesPerPage] = useState(100);

  useEffect(() => {
    fetchLogs();
  }, [logType, currentPage, linesPerPage]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        type: logType,
        page: currentPage,
        lines: linesPerPage,
      });

      const response = await Api.get(`/api/v1/logs?${params}`);
      setLogs(response.data.data.logs);
      setPagination(response.data.data.pagination);
    } catch (error) {
      console.error("Error fetching logs:", error);
      console.error("Error response:", error.response?.data);
      alert(`Failed to fetch logs: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleClearLogs = async (type) => {
    if (!confirm(`Are you sure you want to clear ${type === 'all' ? 'all' : type} logs?`)) {
      return;
    }

    try {
      await Api.post("/api/v1/logs/clear", { type });
      alert("Logs cleared successfully");
      fetchLogs();
    } catch (error) {
      console.error("Error clearing logs:", error);
      alert("Failed to clear logs");
    }
  };

  const getLogTypeColor = (type) => {
    const colors = {
      combined: "bg-blue-500",
      error: "bg-red-500",
      out: "bg-green-500",
    };
    return colors[type] || colors.combined;
  };

  const getLogLineColor = (line) => {
    if (line.toLowerCase().includes("error")) return "text-red-600";
    if (line.toLowerCase().includes("warn")) return "text-yellow-600";
    if (line.toLowerCase().includes("success")) return "text-green-600";
    return "text-gray-700";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">PM2 Logs Viewer</h1>
          <p className="text-gray-600">View and manage application logs</p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <select
                value={logType}
                onChange={(e) => {
                  setLogType(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="combined">Combined Logs</option>
                <option value="error">Error Logs</option>
                <option value="out">Output Logs</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Lines per page:</span>
              <select
                value={linesPerPage}
                onChange={(e) => {
                  setLinesPerPage(parseInt(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="50">50</option>
                <option value="100">100</option>
                <option value="200">200</option>
                <option value="500">500</option>
              </select>
            </div>

            <button
              onClick={fetchLogs}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>

            <button
              onClick={() => handleClearLogs(logType)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Clear {logType === 'combined' ? 'Combined' : logType === 'error' ? 'Error' : 'Output'} Logs
            </button>

            <button
              onClick={() => handleClearLogs('all')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Clear All Logs
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Lines</p>
                <p className="text-2xl font-bold text-gray-900">{pagination.totalLines || 0}</p>
              </div>
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Current Page</p>
                <p className="text-2xl font-bold text-blue-600">{pagination.currentPage || 0}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-400" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Pages</p>
                <p className="text-2xl font-bold text-green-600">{pagination.totalPages || 0}</p>
              </div>
              <FileText className="w-8 h-8 text-green-400" />
            </div>
          </div>
        </div>

        {/* Logs Display */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className={`${getLogTypeColor(logType)} px-6 py-3`}>
            <h2 className="text-white font-semibold">
              {logType === 'combined' ? 'Combined Logs' : logType === 'error' ? 'Error Logs' : 'Output Logs'}
            </h2>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <LineLoader />
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No logs found</p>
            </div>
          ) : (
            <div className="p-4">
              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-sm font-mono">
                  {logs.map((line, index) => (
                    <div key={index} className={`${getLogLineColor(line)} mb-1`}>
                      {line}
                    </div>
                  ))}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing page {currentPage} of {pagination.totalPages} ({pagination.totalLines} total lines)
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-gray-700">
                Page {currentPage} of {pagination.totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(pagination.totalPages, prev + 1))}
                disabled={currentPage === pagination.totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
