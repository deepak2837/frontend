"use client";
import Image from "next/image";
import React, { useState } from "react";
import useRegister from "@/hooks/auth/useRegister";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import CollegeSearchDropdown from "@/components/common/CollegeSearchDropdown";
import { FiEye, FiEyeOff } from "react-icons/fi";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import "../../phone-input-custom.css";

const Register = () => {
  const [role, setRole] = useState("Student");
  const [showCustomCourse, setShowCustomCourse] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    mobileNumber: "",
    password: "",
    confirmPassword: "",
    collegeName: "",
    course: "",
    year: "",
    examName: "",
    hospitalName: "",
    speciality: "",
    experience: "",
  });
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Popular medical courses
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

  // Popular medical exams
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

  // Year of study options
  const yearOptions = [
    { label: "First Year", value: 1 },
    { label: "Second Year", value: 2 },
    { label: "Third Year", value: 3 },
    { label: "Fourth Year", value: 4 },
    { label: "Fifth Year", value: 5 },
    { label: "Sixth Year", value: 6 }
  ];

  const { loading, onRegister, onSendOtp } = useRegister();
  const router = useRouter();

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setShowCustomCourse(false);
    setShowPassword(false);
    setShowConfirmPassword(false);
    setFormData((prevData) => ({
      ...prevData,
      collegeName: "",
      course: "",
      year: "",
      examName: "",
      hospitalName: "",
      speciality: "",
      experience: "",
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Handle different field types based on the model
    let processedValue = value;
    
    if (name === 'course' && showCustomCourse) {
      // Only allow letters, spaces, and common punctuation for course names
      const textValue = value.replace(/[0-9]/g, '');
      processedValue = textValue;
    }
    
    setFormData({ ...formData, [name]: processedValue });
  };

  const handlePhoneChange = (value) => {
    setFormData({ ...formData, mobileNumber: value || "" });
  };

  const handleCourseChange = (e) => {
    const selectedCourse = e.target.value;
    if (selectedCourse === "custom") {
      setShowCustomCourse(true);
      setFormData({ ...formData, course: "", year: "", examName: "" });
    } else {
      setShowCustomCourse(false);
      if (selectedCourse === "Preparing for Exam") {
        setFormData({ ...formData, course: selectedCourse, year: 0, examName: "" });
      } else {
        setFormData({ ...formData, course: selectedCourse, year: "", examName: "" });
      }
    }
  };

  const handleBackToDropdown = () => {
    setShowCustomCourse(false);
    setFormData({ ...formData, course: "" });
  };

  const handleYearChange = (e) => {
    const selectedYear = parseInt(e.target.value);
    setFormData({ ...formData, year: selectedYear });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Form validation based on model types
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    // Validate mobile number using the library
    if (!formData.mobileNumber) {
      toast.error("Mobile number is required");
      return;
    }
    
    // Use the library's validation function
    if (!isValidPhoneNumber(formData.mobileNumber)) {
      toast.error("Please enter a valid mobile number");
      return;
    }
    
    // Validate year field for students (should be a number between 1-6, except for "Preparing for Exam")
    if (role === "Student" && formData.course !== "Preparing for Exam") {
      const yearNum = formData.year;
      if (!yearNum || yearNum < 1 || yearNum > 6) {
        toast.error("Please select a valid year of study");
        return;
      }
    }
    
    // Validate exam name field for students preparing for exam
    if (role === "Student" && formData.course === "Preparing for Exam") {
      if (!formData.examName.trim()) {
        toast.error("Please select an exam name");
        return;
      }
    }
    
    // Validate experience field for doctors (should not be empty)
    if (role === "Doctor" && !formData.experience.trim()) {
      toast.error("Years of experience is required for doctors");
      return;
    }
    
    // Validate required fields based on role
    if (role === "Student") {
      if (!formData.collegeName.trim()) {
        toast.error("College name is required for students");
        return;
      }
      if (!formData.course.trim()) {
        toast.error("Course is required for students");
        return;
      }
      // Validate custom course input (should not be empty if custom is selected)
      if (showCustomCourse && !formData.course.trim()) {
        toast.error("Please enter your course name");
        return;
      }
    }
    
    if (role === "Doctor") {
      if (!formData.hospitalName.trim()) {
        toast.error("Hospital name is required for doctors");
        return;
      }
      if (!formData.speciality.trim()) {
        toast.error("Speciality is required for doctors");
        return;
      }
    }
    
    // Send OTP for registration
    const result = await onSendOtp(formData, role);
    if (result.success) {
      setOtpSent(true);
      toast.success("OTP sent to your mobile number");
    } else if (result.message === "User already registered please try to log in") {
      toast.info(result.message, { autoClose: 3000 });
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const result = await onRegister(formData, role, otp);
    if (result.success) {
      toast.success("Registered successfully!");
      setTimeout(() => router.push("/login"), 2000);
    } else {
      toast.error(result.message || "OTP verification failed");
    }
  };

  return (
    <div className="flex items-center justify-center pt-8 pb-8 w-full bg-white ">
      <div className="p-[2px] rounded-3xl max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg w-full bg-gradient-to-r from-[#FE6B8B] to-[#FF8E53]">
        <div className="bg-white p-6 shadow-lg rounded-3xl w-full">
          <div className="flex flex-col items-center mb-4">
            <Image
              src="/MedglossLogo.svg"
              alt="Logo"
              width={96}
              height={96}
              className="w-24 h-24"
            />
            <h1 className="text-3xl font-bold text-pink-500 mt-2">Register</h1>
          </div>
          <div className="flex justify-between mb-4 gap-2">
            {["Student", "Doctor"].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => handleRoleChange(item)}
                className={`w-1/2 py-2 rounded-lg font-semibold transition-all duration-150 border-2 ${
                  role === item
                    ? "bg-gradient-to-r from-[#FE6B8B] to-[#FF8E53] text-white border-pink-400 shadow"
                    : "bg-white text-gray-600 border-gray-300 hover:bg-pink-50"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
          <form className="space-y-4" onSubmit={otpSent ? handleVerifyOtp : handleSubmit}>
            <div>
              <label className="block text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
            </div>
            <div>
              <label className="block text-gray-700">Mobile Number</label>
              <PhoneInput
                international
                countryCallingCodeEditable={false}
                defaultCountry="IN"
                value={formData.mobileNumber}
                onChange={handlePhoneChange}
                placeholder="Enter mobile number"
                className="w-full"
              />
            </div>
            {!otpSent && (
              <>
                <div>
                  <label className="block text-gray-700">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 pr-10 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-300"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                      {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700">Confirm Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="Confirm Password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 pr-10 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-300"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                      {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                    </button>
                  </div>
                </div>
              </>
            )}

            {role === "Student" && (
              <>
                <div>
                  <label className="block text-gray-700">College Name</label>
                  <CollegeSearchDropdown
                    value={formData.collegeName}
                    onChange={(value) => setFormData({ ...formData, collegeName: value })}
                    placeholder="Search for your college..."
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Course</label>
                  {!showCustomCourse ? (
                    <select
                      name="course"
                      value={formData.course}
                      onChange={handleCourseChange}
                      required
                      className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-300"
                    >
                      <option value="">Select a course</option>
                      {popularCourses.map((course) => (
                        <option key={course} value={course}>
                          {course}
                        </option>
                      ))}
                      <option value="custom">Other (Enter manually)</option>
                    </select>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          name="course"
                          placeholder="Enter course name (no numbers)"
                          value={formData.course}
                          onChange={handleInputChange}
                          required
                          className="flex-1 px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-300"
                        />
                        <button
                          type="button"
                          onClick={handleBackToDropdown}
                          className="px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                        >
                          ← Back
                        </button>
                      </div>
                      <p className="text-sm text-gray-500">Enter your course name manually (letters only, no numbers)</p>
                    </div>
                  )}
                </div>
                {formData.course !== "Preparing for Exam" && (
                  <div>
                    <label className="block text-gray-700">Year of Study</label>
                    <select
                      name="year"
                      value={formData.year}
                      onChange={handleYearChange}
                      required
                      className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-300"
                    >
                      <option value="">Select year</option>
                      {yearOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                {formData.course === "Preparing for Exam" && (
                  <div>
                    <label className="block text-gray-700">Exam Name</label>
                    <select
                      name="examName"
                      value={formData.examName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-300"
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
              </>
            )}

            {role === "Doctor" && (
              <>
                <div>
                  <label className="block text-gray-700">Hospital Name</label>
                  <input
                    type="text"
                    name="hospitalName"
                    placeholder="Hospital Name"
                    value={formData.hospitalName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-300"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Speciality</label>
                  <input
                    type="text"
                    name="speciality"
                    placeholder="Speciality"
                    value={formData.speciality}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-300"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">
                    Years of Experience
                  </label>
                  <select
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-300"
                  >
                    <option value="">Select years of experience</option>
                    {Array.from({ length: 20 }, (_, i) => i + 1).map((year) => (
                      <option key={year} value={year}>
                        {year} {year === 1 ? 'year' : 'years'}
                      </option>
                    ))}
                    <option value="20+">20+ years</option>
                  </select>
                </div>
              </>
            )}

            {otpSent && (
              <div>
                <label className="block text-gray-700">OTP</label>
                <input
                  type="text"
                  name="otp"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  required
                  className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-300"
                />
              </div>
            )}
            <button
              type="submit"
              className="w-full py-2 bg-gradient-to-r from-[#FE6B8B] to-[#FF8E53] text-white font-semibold rounded-lg shadow-md hover:opacity-90 transition flex justify-center items-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    ></path>
                  </svg>
                  Processing...
                </>
              ) : (
                otpSent ? "Verify OTP & Register" : "Register"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
