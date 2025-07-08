"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiLoader, FiEye, FiEyeOff } from "react-icons/fi";
import { toast } from "react-toastify";
import useAuthStore from "@/store/authStore";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import "../../phone-input-custom.css";
import { normalizePhoneNumber } from "@/utils/phone";

const Login = () => {
  const [mobileNumber, setMobileNumber] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [signUpLoading, setSignUpLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: enter mobile, 2: enter password, 3: forgot password, 4: verify OTP, 5: update password
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const { isAuthenticated, setPhoneNumber, loginWithPassword, isLoading, error, clearError } = useAuthStore();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  // Handle error from auth store
  useEffect(() => {
    if (error) {
      setErrorMessage(error);
      clearError();
    }
  }, [error, clearError]);

  const checkMobileRegistered = async () => {
    setLoginLoading(true);
    setErrorMessage(null);
    try {
      const normalizedNumber = normalizePhoneNumber(mobileNumber);
      console.log("Checking if mobile number is registered:", normalizedNumber);
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/auth/user-exists?mobileNumber=${normalizedNumber}`);
      const data = await res.json();
      if (data.exists) {
        setPhoneNumber(normalizedNumber); // Store phone number in auth store
        setStep(2);
      } else {
        setErrorMessage("Mobile number not registered. Redirecting to sign up...");
        setTimeout(() => router.push("/register"), 1500);
      }
    } catch (err) {
      setErrorMessage("Error checking mobile number");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleMobileSubmit = async (e) => {
    e.preventDefault();
    if (!mobileNumber) {
      setErrorMessage("Mobile number is required.");
      return;
    }
    
    if (!isValidPhoneNumber(mobileNumber)) {
      setErrorMessage("Please enter a valid mobile number.");
      return;
    }
    
    await checkMobileRegistered();
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    clearError();
    
    const normalizedNumber = normalizePhoneNumber(mobileNumber);
    const success = await loginWithPassword(normalizedNumber, password);
    
    if (success) {
      toast.success("Login successful!");
      router.push("/");
    } else {
      setErrorMessage(error || "Login failed");
    }
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    setSignUpLoading(true);
    toast.info("Redirecting to Sign Up...");
    setTimeout(() => {
      router.push("/register");
      setSignUpLoading(false);
    }, 1000);
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotPasswordLoading(true);
    setErrorMessage(null);
    try {
      const normalizedNumber = normalizePhoneNumber(mobileNumber);
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobileNumber: normalizedNumber }),
      });
      const data = await res.json();
      if (res.ok) {
        setOtpSent(true);
        setStep(4); // Go to OTP verification step
        toast.success("OTP sent to your mobile number!");
      } else {
        setErrorMessage(data.message || "Failed to send OTP");
      }
    } catch (err) {
      setErrorMessage("Error sending OTP");
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setForgotPasswordLoading(true);
    setErrorMessage(null);
    try {
      const normalizedNumber = normalizePhoneNumber(mobileNumber);
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/auth/verify-forgot-password-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobileNumber: normalizedNumber, otp }),
      });
      const data = await res.json();
      if (res.ok) {
        setStep(5); // Go to update password step
        toast.success("OTP verified successfully!");
      } else {
        setErrorMessage(data.message || "Invalid OTP");
      }
    } catch (err) {
      setErrorMessage("Error verifying OTP");
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      setErrorMessage("Password must be at least 6 characters long");
      return;
    }
    
    setForgotPasswordLoading(true);
    setErrorMessage(null);
    try {
      const normalizedNumber = normalizePhoneNumber(mobileNumber);
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/auth/update-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobileNumber: normalizedNumber, otp, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Password updated successfully! Please login again  ...");
        // Reset all states and go back to login
        setStep(2);
        setOtp("");
        setNewPassword("");
        setConfirmPassword("");
        setShowNewPassword(false);
        setShowConfirmPassword(false);
        setOtpSent(false);
        setErrorMessage(null);
        
        // Redirect to home page after 3 seconds
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else {
        setErrorMessage(data.message || "Failed to update password");
      }
    } catch (err) {
      setErrorMessage("Error updating password");
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  const resetForgotPasswordFlow = () => {
    setStep(2);
    setOtp("");
    setNewPassword("");
    setConfirmPassword("");
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    setOtpSent(false);
    setErrorMessage(null);
  };

  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="bg-main px-10 py-8 sm:px-4 sm:py-10 rounded-2xl shadow-xl w-full max-w-xs relative border border-gray-300 loginBoxOverride">
        <div className="flex flex-col items-center mb-6">
          <Image src="/MedglossLogo.svg" alt="Logo" width={80} height={80} className="rounded-full" />
          <h1 className="text-2xl font-bold text-gray-100">Login</h1>
        </div>
        {step === 1 && (
          <form className="space-y-6" onSubmit={handleMobileSubmit}>
            <div className="relative">
              <PhoneInput
                international
                countryCallingCodeEditable={false}
                defaultCountry="IN"
                placeholder="Mobile Number"
                value={mobileNumber}
                onChange={setMobileNumber}
                className={`w-full ${errorMessage ? "error" : ""}`}
              />
              {(loginLoading || isLoading) && (
                <FiLoader className="absolute right-3 top-1/2 transform -translate-y-1/2 text-pink-500 animate-spin text-xl" />
              )}
            </div>
            {errorMessage && <p className="text-white text-base font-semibold mt-2">{errorMessage}</p>}
            <button type="submit" className="w-full py-2 bg-white font-semibold rounded-lg shadow-md hover:scale-[1.02] transition transform disabled:opacity-50" disabled={loginLoading || isLoading || !mobileNumber || !isValidPhoneNumber(mobileNumber)}>
              {(loginLoading || isLoading) ? <div className="flex items-center justify-center"><FiLoader className="animate-spin mr-2" />Processing...</div> : "Next"}
            </button>
            <button onClick={handleSignUp} className="w-full flex justify-center items-center text-gray-100 text-base" disabled={signUpLoading}>
              {signUpLoading ? <><FiLoader className="animate-spin mr-2" /> Redirecting...</> : "Sign Up here"}
            </button>
          </form>
        )}
        {step === 2 && (
          <form className="space-y-6" onSubmit={handlePasswordSubmit}>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className={`w-full px-4 py-2 md:py-3 pr-10 border rounded-lg text-gray-800 focus:outline-none focus:ring-2 ${errorMessage ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-pink-400"}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
              {(loginLoading || isLoading) && (
                <FiLoader className="absolute right-12 top-1/2 transform -translate-y-1/2 text-pink-500 animate-spin text-xl" />
              )}
            </div>
            {errorMessage && <p className="text-white text-base font-semibold mt-2">{errorMessage}</p>}
            <button type="submit" className="w-full py-2 bg-white font-semibold rounded-lg shadow-md hover:scale-[1.02] transition transform disabled:opacity-50" disabled={loginLoading || isLoading || password.length === 0}>
              {(loginLoading || isLoading) ? <div className="flex items-center justify-center"><FiLoader className="animate-spin mr-2" />Logging in...</div> : "Login"}
            </button>
            <button type="button" onClick={handleForgotPassword} className="w-full flex justify-center items-center text-gray-100 text-base mt-2" disabled={forgotPasswordLoading}>
              {forgotPasswordLoading ? <><FiLoader className="animate-spin mr-2" />Sending...</> : "Forgot Password?"}
            </button>
            <button type="button" onClick={() => { setStep(1); setPassword(""); setShowPassword(false); setErrorMessage(null); }} className="w-full flex justify-center items-center text-gray-100 text-base">Go Back</button>
          </form>
        )}
        {step === 4 && (
          <form className="space-y-6" onSubmit={handleVerifyOTP}>
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-100 mb-2">Verify OTP</h2>
              <p className="text-gray-300 text-sm">Enter the OTP sent to {mobileNumber}</p>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={e => setOtp(e.target.value)}
                required
                maxLength={6}
                className={`w-full px-4 py-2 md:py-3 border rounded-lg text-gray-800 focus:outline-none focus:ring-2 ${errorMessage ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-pink-400"}`}
              />
              {forgotPasswordLoading && (
                <FiLoader className="absolute right-3 top-1/2 transform -translate-y-1/2 text-pink-500 animate-spin text-xl" />
              )}
            </div>
            {errorMessage && <p className="text-white text-base font-semibold mt-2">{errorMessage}</p>}
            <button type="submit" className="w-full py-2 bg-white font-semibold rounded-lg shadow-md hover:scale-[1.02] transition transform disabled:opacity-50" disabled={forgotPasswordLoading || otp.length !== 6}>
              {forgotPasswordLoading ? <div className="flex items-center justify-center"><FiLoader className="animate-spin mr-2" />Verifying...</div> : "Verify OTP"}
            </button>
            <button type="button" onClick={resetForgotPasswordFlow} className="w-full flex justify-center items-center text-gray-100 text-base">Go Back to Login</button>
          </form>
        )}
        {step === 5 && (
          <form className="space-y-6" onSubmit={handleUpdatePassword}>
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-100 mb-2">Update Password</h2>
              <p className="text-gray-300 text-sm">Enter your new password</p>
            </div>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="New Password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                required
                className={`w-full px-4 py-2 md:py-3 pr-10 border rounded-lg text-gray-800 focus:outline-none focus:ring-2 ${errorMessage ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-pink-400"}`}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {showNewPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                className={`w-full px-4 py-2 md:py-3 pr-10 border rounded-lg text-gray-800 focus:outline-none focus:ring-2 ${errorMessage ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-pink-400"}`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
              {forgotPasswordLoading && (
                <FiLoader className="absolute right-12 top-1/2 transform -translate-y-1/2 text-pink-500 animate-spin text-xl" />
              )}
            </div>
            {errorMessage && <p className="text-white text-base font-semibold mt-2">{errorMessage}</p>}
            <button type="submit" className="w-full py-2 bg-white font-semibold rounded-lg shadow-md hover:scale-[1.02] transition transform disabled:opacity-50" disabled={forgotPasswordLoading || newPassword.length < 6 || confirmPassword.length < 6}>
              {forgotPasswordLoading ? <div className="flex items-center justify-center"><FiLoader className="animate-spin mr-2" />Updating...</div> : "Update Password"}
            </button>
            <button type="button" onClick={resetForgotPasswordFlow} className="w-full flex justify-center items-center text-gray-100 text-base">Go Back to Login</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
