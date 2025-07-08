"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import mbbsCollegeList from "@/lib/mbbs_college_list.json";
import LineLoader from "@/components/common/Loader";
import useAuthStore from "@/store/authStore";
import { toast } from "react-toastify";
import useProfile from "@/hooks/profile/useProfile";
import CollegeSearchDropdown from "@/components/common/CollegeSearchDropdown";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import "../../phone-input-custom.css";
import { normalizePhoneNumber } from "@/utils/phone";

const popularCourses = [
  "Preparing for Exam",
  "MBBS",
  "MD",
  "BDS",
  "BAMS",
  "BHMS",
  "BPT",
  "BOT",
  "BSc Nursing",
  "BSc Medical Lab Technology",
  "BSc Radiology",
  "BSc Optometry",
  "BSc Physiotherapy",
  "BSc Occupational Therapy",
  "BSc Respiratory Therapy",
  "BSc Cardiac Technology",
  "BSc Dialysis Technology",
  "BSc Operation Theatre Technology",
  "BSc Anesthesia Technology",
  "BSc Emergency Medical Technology",
  "BSc Medical Imaging Technology"
];

const popularExams = [
  "NEET PG",
  "NEET UG",
  "AIIMS PG",
  "JIPMER PG",
  "FMGE",
  "USMLE Step 1",
  "USMLE Step 2 CK",
  "USMLE Step 2 CS",
  "PLAB",
  "MCAT",
  "GRE",
  "IELTS",
  "TOEFL",
  "Other"
];

const yearOptions = [
  { label: "First Year", value: 1 },
  { label: "Second Year", value: 2 },
  { label: "Third Year", value: 3 },
  { label: "Fourth Year", value: 4 },
  { label: "Fifth Year", value: 5 },
  "Sixth Year",
  { label: "Sixth Year", value: 6 }
];

const experienceOptions = Array.from({ length: 20 }, (_, i) => ({ label: `${i+1} ${i+1 === 1 ? 'year' : 'years'}`, value: i+1 })).concat({ label: "20+ years", value: "20+" });

const Profile = () => {
  const { getUser, updateUser } = useAuthStore();
  const user = getUser();
  const { onUpdateProfile } = useProfile();

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    collegeName: "",
    course: "",
    year: "",
    hospitalName: "",
    speciality: "",
    experience: "",
    email: "",
    city: "",
    mobileNumber: "",
  });
  const [showCustomCourse, setShowCustomCourse] = useState(false);

  useEffect(() => {
    console.log("[Profile useEffect] user:", user);
    if (user && !isEditing) { // Only update if not editing
      setProfileData((prevData) => {
        const newData = {
          ...prevData,
          collegeName: user.role === "student" ? user.collegeName : "",
          course: user.role === "student" ? user.course : "",
          year: user.role === "student" ? user.year : "",
          hospitalName: user.role === "doctor" ? user.hospitalName : "",
          speciality: user.role === "doctor" ? user.speciality : "",
          experience: user.role === "doctor" ? user.experience : "",
          mobileNumber: user.mobileNumber || "",
          examName: user.role === "student" ? user.examName : "",
          city: user.city || "",
        };
        // Only update state if data has changed
        if (JSON.stringify(prevData) !== JSON.stringify(newData)) {
          console.log("[Profile useEffect] Updating profileData:", newData);
          return newData;
        }
        return prevData;
      });
    }
    setIsLoading(false);
  }, [user, isEditing]); // Ensure this only runs when `user` changes

  // Generate last 7 years
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 7 }, (_, i) =>
    (currentYear - i).toString()
  );
  const experiences = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
  // Course options
  const courses = ["MBBS", "MD", "MS"];

  // Sample college list - you can replace this with your actual college list
  const colleges = mbbsCollegeList.map((college) => college.collegeName);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;
    if (name === 'course' && showCustomCourse) {
      processedValue = value.replace(/[0-9]/g, '');
    }
    console.log(`[handleInputChange] name: ${name}, value: ${value}, processedValue: ${processedValue}`);
    setProfileData((prev) => ({ ...prev, [name]: processedValue }));
  };

  const handlePhoneChange = (value) => {
    console.log("[handlePhoneChange] value:", value);
    setProfileData((prev) => ({ ...prev, mobileNumber: value || "" }));
  };

  const handleCourseChange = (e) => {
    const selectedCourse = e.target.value;
    console.log("[handleCourseChange] selectedCourse:", selectedCourse);
    if (selectedCourse === "custom") {
      setShowCustomCourse(true);
      setProfileData((prev) => ({ ...prev, course: "", year: "", examName: "" }));
    } else if (selectedCourse === "Preparing for Exam") {
      setShowCustomCourse(false);
      setProfileData((prev) => ({ ...prev, course: selectedCourse, year: 0, examName: "" }));
    } else {
      setShowCustomCourse(false);
      setProfileData((prev) => ({ ...prev, course: selectedCourse, year: "", examName: "" }));
    }
  };

  const handleYearChange = (e) => {
    const selectedYear = parseInt(e.target.value);
    console.log("[handleYearChange] selectedYear:", selectedYear);
    setProfileData((prev) => ({ ...prev, year: selectedYear }));
  };

  const handleSave = async () => {
    // Validation (same as register page)
    if (user.role === "student" || user.role === "doctor") {
      // Validate mobile number
      if (!profileData.mobileNumber) {
        toast.error("Mobile number is required");
        return;
      }
      if (!isValidPhoneNumber(profileData.mobileNumber)) {
        toast.error("Please enter a valid mobile number");
        return;
      }
    }
    if (user.role === "student") {
      if (!profileData.collegeName.trim()) {
        toast.error("College name is required for students");
        return;
      }
      if (!profileData.course.trim()) {
        toast.error("Course is required for students");
        return;
      }
      if (showCustomCourse && !profileData.course.trim()) {
        toast.error("Please enter your course name");
        return;
      }
      if (profileData.course !== "Preparing for Exam") {
        const yearNum = profileData.year;
        if (!yearNum || yearNum < 1 || yearNum > 6) {
          toast.error("Please select a valid year of study");
          return;
        }
      }
      if (profileData.course === "Preparing for Exam") {
        if (!profileData.examName || !profileData.examName.trim()) {
          toast.error("Please select an exam name");
          return;
        }
      }
    }
    if (user.role === "doctor") {
      if (!profileData.hospitalName.trim()) {
        toast.error("Hospital name is required for doctors");
        return;
      }
      if (!profileData.speciality.trim()) {
        toast.error("Speciality is required for doctors");
        return;
      }
      if (!profileData.experience) {
        toast.error("Years of experience is required for doctors");
        return;
      }
    }
    // Normalize phone number
    const normalizedProfile = { ...profileData, mobileNumber: normalizePhoneNumber(profileData.mobileNumber) };
    try {
      const response = await onUpdateProfile(normalizedProfile);
      console.log("[handleSave] response:", response);
      console.log("[handleSave] response.user:", response.status);
      if (response?.status === 200) {
        // If backend returns a new token, update cookie
        if (response.token) {
          await fetch("/api/set-cookie", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: response.token }),
          });
        }
        updateUser(response.user);
        setProfileData((prev) => ({ ...prev, examName: response.user.examName || "" }));
        setIsEditing(false);
        toast.success("Profile updated successfully");
        setTimeout(() => {
          window.location.href = "/profile";
        }, 1500);
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile");
    }
  };
  const toggleEdit = async () => {
    if (isEditing) {
      await handleSave();
    } else {
      setIsEditing(true);
    }
  };
        if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LineLoader />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-red-50 p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-red-600 mb-3">
            User Not Found
          </h2>
          <p className="text-gray-700">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  console.log("[Profile render] profileData:", profileData, "isEditing:", isEditing);

  // Determine avatar based on user role
  const avatarSrc = user.role === "doctor" ? "/doctor.jpg" : "/student.jpg";

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-lg overflow-hidden">
        {/* Header with curved design */}
        <div className="bg-main h-32 md:h-48 rounded-b-[40%] flex items-center justify-center relative">
          <div className="absolute -bottom-16 md:-bottom-20 bg-white rounded-full p-1 border-4 border-white shadow-lg">
            <Image
              src="/doctor.jpg"
              alt={`${user.name}'s Avatar`}
              width={120}
              height={120}
              className="rounded-full w-24 h-24 md:w-32 md:h-32 object-cover"
              priority
            />
          </div>
        </div>

        {/* Profile Information */}
        <div className="mt-20 md:mt-24 px-4 pb-8">
          {/* User Basic Info */}
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              {user.name}
            </h2>
            <p className="text-indigo-600 font-medium mt-1">@{user.username}</p>
            <p className="text-gray-500 mt-1 capitalize">
              {user.role === "doctor"
                ? "Healthcare Professional"
                : "Medical Student"}
            </p>
          </div>

          {/* Edit/Save Button */}
          <div className="flex justify-center mb-6">
            <button
              onClick={toggleEdit}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                isEditing
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-main hover:bg-indigo-700 text-white"
              }`}
            >
              {isEditing ? (
                <>
                  <span className="mr-2">✓</span>Save Changes
                </>
              ) : (
                <>
                  <span className="mr-2">✏️</span>Edit Profile
                </>
              )}
            </button>
          </div>

          {/* Profile Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Contact Information Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold border-b pb-2 mb-4 text-indigo-800">
                Contact Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <span className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                    <span className="text-indigo-700">📱</span>
                  </span>
                  <div>
                    <p className="text-sm text-gray-500">Mobile Number</p>
                    <p className="font-medium">
                      {profileData.mobileNumber || "Not specified"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <span className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                    <span className="text-indigo-700">🏙️</span>
                  </span>
                  <div>
                    <p className="text-sm text-gray-500">City</p>
                    {isEditing ? (
                      <input
                        type="text"
                        name="city"
                        value={profileData.city}
                        onChange={handleInputChange}
                        className="border border-gray-300 rounded-md px-3 py-1 mt-1 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        autoComplete="off"
                      />
                    ) : (
                      <p className="font-medium">
                        {profileData.city || "Not specified"}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Professional Information Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold border-b pb-2 mb-4 text-indigo-800">
                {user.role === "doctor"
                  ? "Professional Information"
                  : "Academic Information"}
              </h3>
              <div className="space-y-4">
                {user.role === "student" && (
                  <>
                    <div>
                      <p className="text-sm text-gray-500">College Name</p>
                      {isEditing ? (
                        <CollegeSearchDropdown
                          options={colleges}
                          value={profileData.collegeName}
                          onChange={val => handleInputChange({ target: { name: "collegeName", value: val } })}
                          placeholder="Select College"
                          name="collegeName"
                        />
                      ) : (
                        <p className="font-medium">
                          {profileData.collegeName || "Not specified"}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Course</p>
                        {isEditing ? (
                          <select
                            name="course"
                            value={profileData.course}
                            onChange={handleCourseChange}
                            className="border border-gray-300 rounded-md px-3 py-1 mt-1 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          >
                            <option value="">Select Course</option>
                            {popularCourses.map((course) => (
                              <option key={course} value={course}>
                                {course}
                              </option>
                            ))}
                            <option value="custom">Custom Course</option>
                          </select>
                        ) : (
                          <p className="font-medium">
                            {profileData.course || "Not specified"}
                          </p>
                        )}
                      </div>
                      {/* Show year dropdown only if course is not 'Preparing for Exam' */}
                      {isEditing && profileData.course !== "Preparing for Exam" && (
                        <div>
                          <p className="text-sm text-gray-500">Year</p>
                          <select
                            name="year"
                            value={profileData.year}
                            onChange={handleYearChange}
                            className="border border-gray-300 rounded-md px-3 py-1 mt-1 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          >
                            <option value="">Select Year</option>
                            {yearOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                      {/* Show exam name dropdown only if course is 'Preparing for Exam' */}
                      {isEditing && profileData.course === "Preparing for Exam" && (
                        <div>
                          <p className="text-sm text-gray-500">Exam Name</p>
                          <select
                            name="examName"
                            value={profileData.examName}
                            onChange={handleInputChange}
                            className="border border-gray-300 rounded-md px-3 py-1 mt-1 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          >
                            <option value="">Select exam</option>
                            {popularExams.map((exam) => (
                              <option key={exam} value={exam}>
                                {exam}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {user.role === "doctor" && (
                  <>
                    <div>
                      <p className="text-sm text-gray-500">Hospital Name</p>
                      {isEditing ? (
                        <input
                          type="text"
                          name="hospitalName"
                          value={profileData.hospitalName}
                          onChange={handleInputChange}
                          className="border border-gray-300 rounded-md px-3 py-1 mt-1 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      ) : (
                        <p className="font-medium">
                          {profileData.hospitalName || "Not specified"}
                        </p>
                      )}
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Speciality</p>
                      {isEditing ? (
                        <input
                          type="text"
                          name="speciality"
                          value={profileData.speciality}
                          onChange={handleInputChange}
                          className="border border-gray-300 rounded-md px-3 py-1 mt-1 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      ) : (
                        <p className="font-medium">
                          {profileData.speciality || "Not specified"}
                        </p>
                      )}
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">
                        Experience (Years)
                      </p>
                      {isEditing ? (
                        <select
                          name="experience"
                          value={profileData.experience}
                          onChange={handleInputChange}
                          className="border border-gray-300 rounded-md px-3 py-1 mt-1 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="">Select Experience</option>
                          {experienceOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <p className="font-medium">
                          {profileData.experience
                            ? `${profileData.experience} ${
                                profileData.experience === "1"
                                  ? "year"
                                  : "years"
                              }`
                            : "Not specified"}
                        </p>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
