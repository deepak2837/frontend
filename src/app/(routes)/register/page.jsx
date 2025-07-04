"use client";
import Image from "next/image";
import React, { useState } from "react";
import useRegister from "@/hooks/auth/useRegister";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const Register = () => {
  const [role, setRole] = useState("Student");

  const [formData, setFormData] = useState({
    name: "",
    mobileNumber: "",
    collegeName: "",
    course: "",
    year: "",
    hospitalName: "",
    speciality: "",
    experience: "",
  });

  const { loading, onRegister } = useRegister();
  const router = useRouter();

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setFormData((prevData) => ({
      ...prevData,
      collegeName: "",
      course: "",
      year: "",
      hospitalName: "",
      speciality: "",
      experience: "",
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await onRegister(formData, role);
    if (result && result.message === "User already registered please try to log in") {
      toast.info(result.message, { autoClose: 3000 });
      setTimeout(() => {
        router.push("/login");
      }, 3000);
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
          <form className="space-y-4" onSubmit={handleSubmit}>
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
              <input
                type="tel"
                name="mobileNumber"
                placeholder="Mobile number"
                value={formData.mobileNumber}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
            </div>

            {role === "Student" && (
              <>
                <div>
                  <label className="block text-gray-700">College Name</label>
                  <input
                    type="text"
                    name="collegeName"
                    placeholder="College Name"
                    value={formData.collegeName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-300"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Course</label>
                  <input
                    type="text"
                    name="course"
                    placeholder="Course"
                    value={formData.course}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-300"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Year of Study</label>
                  <input
                    type="text"
                    name="year"
                    placeholder="Year of Study"
                    value={formData.year}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-300"
                  />
                </div>
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
                  <input
                    type="number"
                    name="experience"
                    placeholder="Experience (in years)"
                    value={formData.experience}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-300"
                  />
                </div>
              </>
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
                "Register"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
