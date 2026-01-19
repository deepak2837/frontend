"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast, Toaster } from "react-hot-toast";
import { useAdminAuth } from "@/middleware/adminAuth";
import useAuthStore from "@/store/authStore";
import {
  Settings,
  Save,
  RefreshCw,
  Eye,
  EyeOff,
  Plus,
  Trash2,
} from "lucide-react";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const ManageAds = () => {
  const router = useRouter();
  const { isAdmin } = useAdminAuth();
  const { getToken } = useAuthStore();
  const [adsConfigs, setAdsConfigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState("all");
  const [searchText, setSearchText] = useState("");

  // Show access denied if not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
            <svg
              className="h-8 w-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600 mb-6">
            You are not authorized to access this page. Admin privileges are required to manage ads.
          </p>
          <div className="space-y-3">
            <Link
              href="/"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 inline-block"
            >
              Go to Homepage
            </Link>
            <Link
              href="/profile"
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors duration-200 inline-block"
            >
              View Profile
            </Link>
          </div>
          <p className="text-sm text-gray-500 mt-6">
            If you believe this is an error, please contact your administrator.
          </p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    fetchAdsConfigs();
  }, []);

  const fetchAdsConfigs = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/api/v1/ads-config`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setAdsConfigs(data.data);
        }
      } else {
        toast.error("Failed to fetch ads configurations");
      }
    } catch (error) {
      console.error("Error fetching ads configs:", error);
      toast.error("Error fetching ads configurations");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAds = (index) => {
    const updated = [...adsConfigs];
    updated[index].showAds = !updated[index].showAds;
    setAdsConfigs(updated);
  };

  const handleSaveAll = async () => {
    try {
      setSaving(true);
      const response = await fetch(`${BASE_URL}/api/v1/ads-config/bulk`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ configs: adsConfigs }),
      });

      if (response.ok) {
        toast.success("Ads configurations saved successfully!");
        fetchAdsConfigs();
      } else {
        toast.error("Failed to save ads configurations");
      }
    } catch (error) {
      console.error("Error saving ads configs:", error);
      toast.error("Error saving ads configurations");
    } finally {
      setSaving(false);
    }
  };

  const handleInitializeDefaults = async () => {
    if (!confirm("This will initialize default configurations. Continue?")) {
      return;
    }

    try {
      setSaving(true);
      const response = await fetch(`${BASE_URL}/api/v1/ads-config/initialize`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      if (response.ok) {
        toast.success("Default configurations initialized!");
        fetchAdsConfigs();
      } else {
        toast.error("Failed to initialize defaults");
      }
    } catch (error) {
      console.error("Error initializing defaults:", error);
      toast.error("Error initializing defaults");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfig = async (id) => {
    if (!confirm("Are you sure you want to delete this configuration?")) {
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/v1/ads-config/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      if (response.ok) {
        toast.success("Configuration deleted successfully!");
        fetchAdsConfigs();
      } else {
        toast.error("Failed to delete configuration");
      }
    } catch (error) {
      console.error("Error deleting config:", error);
      toast.error("Error deleting configuration");
    }
  };

  const filteredConfigs = adsConfigs.filter((config) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "enabled" && config.showAds) ||
      (filter === "disabled" && !config.showAds) ||
      config.category === filter;

    const matchesSearch =
      searchText === "" ||
      config.pageName.toLowerCase().includes(searchText.toLowerCase()) ||
      config.pagePath.toLowerCase().includes(searchText.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const getCategoryColor = (category) => {
    switch (category) {
      case "admin":
        return "bg-red-100 text-red-800";
      case "public":
        return "bg-green-100 text-green-800";
      case "user":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Manage Ads Configuration
              </h1>
              <p className="text-lg text-gray-600">
                Control which pages display advertisements
              </p>
            </div>
            <Link
              href="/manage"
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              ← Back to Dashboard
            </Link>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 flex-wrap">
            <button
              onClick={handleSaveAll}
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              {saving ? "Saving..." : "Save All Changes"}
            </button>
            <button
              onClick={handleInitializeDefaults}
              disabled={saving}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              <RefreshCw className="w-5 h-5" />
              Initialize Defaults
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Search pages..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Pages</option>
              <option value="enabled">Ads Enabled</option>
              <option value="disabled">Ads Disabled</option>
              <option value="public">Public Pages</option>
              <option value="admin">Admin Pages</option>
              <option value="user">User Pages</option>
              <option value="other">Other Pages</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Total Pages</div>
            <div className="text-3xl font-bold text-gray-900">
              {adsConfigs.length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Ads Enabled</div>
            <div className="text-3xl font-bold text-green-600">
              {adsConfigs.filter((c) => c.showAds).length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Ads Disabled</div>
            <div className="text-3xl font-bold text-red-600">
              {adsConfigs.filter((c) => !c.showAds).length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Admin Pages</div>
            <div className="text-3xl font-bold text-blue-600">
              {adsConfigs.filter((c) => c.category === "admin").length}
            </div>
          </div>
        </div>

        {/* Configurations List */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Page Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Path
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Category
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                    Show Ads
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredConfigs.map((config, index) => (
                  <tr
                    key={config._id || index}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">
                        {config.pageName}
                      </div>
                      {config.description && (
                        <div className="text-sm text-gray-500">
                          {config.description}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                        {config.pagePath}
                      </code>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(
                          config.category
                        )}`}
                      >
                        {config.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() =>
                          handleToggleAds(
                            adsConfigs.findIndex((c) => c._id === config._id)
                          )
                        }
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                          config.showAds
                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                            : "bg-red-100 text-red-800 hover:bg-red-200"
                        }`}
                      >
                        {config.showAds ? (
                          <>
                            <Eye className="w-4 h-4" />
                            Enabled
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-4 h-4" />
                            Disabled
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleDeleteConfig(config._id)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                        title="Delete configuration"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredConfigs.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No configurations found matching your filters.
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            How it works
          </h3>
          <ul className="list-disc list-inside text-blue-800 space-y-1">
            <li>
              Toggle ads on/off for each page by clicking the status button
            </li>
            <li>
              Click "Save All Changes" to apply your configuration
            </li>
            <li>
              New pages will show ads by default until you configure them
            </li>
            <li>
              Admin pages are recommended to have ads disabled
            </li>
            <li>
              Use "Initialize Defaults" to set up common page configurations
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ManageAds;
