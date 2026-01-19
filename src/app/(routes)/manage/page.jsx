"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAdminAuth } from "@/middleware/adminAuth";
import useAuthStore from "@/store/authStore";
import {
  BookOpen,
  FileQuestion,
  TestTube,
  FileText,
  ClipboardList,
  Settings,
  FileStack,
  Mail,
  Users,
  Briefcase,
  ScrollText,
} from "lucide-react";

const ManageDashboard = () => {
  const router = useRouter();
  const { isAdmin, user } = useAdminAuth();

  const manageOptions = [
    {
      title: "Manage Question Bank",
      description: "Create, edit, and manage question banks",
      icon: BookOpen,
      href: "/manage-question-bank",
      color: "bg-blue-500",
    },
    {
      title: "Manage Questions",
      description: "Add, edit, and delete individual questions",
      icon: FileQuestion,
      href: "/manage-questions",
      color: "bg-green-500",
    },
    {
      title: "Manage Mock Tests",
      description: "Create and manage mock test papers",
      icon: TestTube,
      href: "/manage-mock-test",
      color: "bg-purple-500",
    },
    {
      title: "Manage Notes",
      description: "Create and manage study notes",
      icon: FileStack,
      href: "/manage-notes",
      color: "bg-pink-500",
    },
    {
      title: "Manage PYQ",
      description: "Manage previous year question papers",
      icon: ClipboardList,
      href: "/manage-pyq",
      color: "bg-orange-500",
    },
    {
      title: "Manage Blogs",
      description: "Create and edit blog posts",
      icon: FileText,
      href: "/manage-blogs",
      color: "bg-pink-500",
    },
    {
      title: "Manage Contacts",
      description: "View and manage contact form submissions",
      icon: Mail,
      href: "/manage-contacts",
      color: "bg-cyan-500",
    },
    {
      title: "Manage Ads",
      description: "Control ad visibility across pages",
      icon: Settings,
      href: "/manage-ads",
      color: "bg-indigo-500",
    },
    {
      title: "Manage Users",
      description: "View and manage registered users",
      icon: Users,
      href: "/manage-users",
      color: "bg-teal-500",
    },
    {
      title: "Manage Career Applications",
      description: "Review and manage job applications",
      icon: Briefcase,
      href: "/manage-careers",
      color: "bg-amber-500",
    },
    {
      title: "View PM2 Logs",
      description: "Monitor application logs and errors",
      icon: ScrollText,
      href: "/manage-logs",
      color: "bg-slate-500",
    },
  ];

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          {/* Access Denied Icon */}
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

          {/* Error Message */}
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600 mb-6">
            You are not authorized to access this page. Admin privileges are required to view the management dashboard.
          </p>

          {/* Action Buttons */}
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

          {/* Contact Info */}
          <p className="text-sm text-gray-500 mt-6">
            If you believe this is an error, please contact your administrator.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Admin Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            Welcome back, {user?.name}! Manage your content from here.
          </p>
        </div>

        {/* Management Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {manageOptions.map((option, index) => {
            const Icon = option.icon;
            return (
              <Link
                key={index}
                href={option.href}
                className="group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className="p-6">
                  {/* Icon */}
                  <div
                    className={`${option.color} w-14 h-14 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {option.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{option.description}</p>

                  {/* Arrow indicator */}
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg
                      className="w-6 h-6 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>

                {/* Hover effect border */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-500 rounded-xl transition-colors pointer-events-none"></div>
              </Link>
            );
          })}
        </div>

        {/* Quick Stats Section (Optional) */}
        <div className="mt-12 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/manage-question-bank/add-question-bank"
              className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <p className="font-semibold text-blue-900">
                + Create Question Bank
              </p>
            </Link>
            <Link
              href="/manage-questions/add-question"
              className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <p className="font-semibold text-green-900">+ Add Question</p>
            </Link>
            <Link
              href="/manage-mock-test/add-mock-test"
              className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <p className="font-semibold text-purple-900">+ Create Mock Test</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageDashboard;
