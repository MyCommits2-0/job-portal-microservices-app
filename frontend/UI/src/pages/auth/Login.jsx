<<<<<<< HEAD
=======
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiBriefcase,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiUser,
  
} from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa";

import authBg from "../../assets/images/register-bg.png";
import { validateLoginForm } from "../../utils/loginValidation";
import { setSession, updateSessionProfile, roleHomePath } from "../../utils/authStorage";
import { loginUser, getCurrentUser, extractAuthErrorMessage } from "../../services/authService";

export default function Login() {
  const navigate = useNavigate();

  const [role, setRole] = useState("candidate");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
    role: "candidate",
  });

  const handleRoleChange = (selectedRole) => {
    setRole(selectedRole);

    setFormData({
      ...formData,
      role: selectedRole,
    });

    setErrors({
      ...errors,
      role: "",
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateLoginForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitError("");
    setIsSubmitting(true);

    try {
      const authResponse = await loginUser({
        email: formData.email,
        password: formData.password,
      });

      // Navigate by the role Auth_User-Service actually returns, not by
      // whichever "Sign in as a" tab happened to be selected in the UI.
      const authUser = setSession(authResponse);

      try {
        const me = await getCurrentUser();
        updateSessionProfile({ name: me.fullName });
      } catch {
        // Non-critical — the dashboard falls back to a generic greeting.
      }

      navigate(roleHomePath[authUser.role] || "/login");
    } catch (error) {
      setSubmitError(extractAuthErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-300 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-7xl min-h-[90vh] bg-white overflow-hidden flex flex-col lg:flex-row">
        {/* Left Form Section */}
        <div className="w-full lg:w-[48%] bg-white px-6 sm:px-10 lg:px-24 py-8 flex flex-col justify-center">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-24">
            <FiBriefcase className="text-blue-600 text-2xl" />
            <span className="text-xl font-semibold text-gray-900">
              Jobpilot
            </span>
          </div>

          <div className="w-full max-w-md mx-auto lg:mx-0">
            <h1 className="text-3xl font-semibold text-gray-900 mb-3">
              Sign in
            </h1>

            <p className="text-sm text-gray-500 mb-6">
              Don’t have account?{" "}
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="text-blue-600 font-medium"
              >
                Create Account
              </button>
            </p>

            {/* Role Selection */}
            <div className="bg-gray-100 rounded-md p-3 mb-6">
              <p className="text-[11px] text-gray-400 text-center uppercase mb-3">
                Sign in as a
              </p>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleRoleChange("candidate")}
                  className={`flex items-center justify-center gap-2 py-3 rounded-md text-sm font-medium transition ${
                    role === "candidate"
                      ? "bg-blue-700 text-white shadow-sm"
                      : "bg-transparent text-gray-600 hover:bg-white"
                  }`}
                >
                  <FiUser />
                  Candidate
                </button>

                <button
                  type="button"
                  onClick={() => handleRoleChange("employer")}
                  className={`flex items-center justify-center gap-2 py-3 rounded-md text-sm font-medium transition ${
                    role === "employer"
                      ? "bg-blue-700 text-white shadow-sm"
                      : "bg-transparent text-gray-600 hover:bg-white"
                  }`}
                >
                  <FiBriefcase />
                  Employer
                </button>
              </div>

              {errors.role && (
                <p className="text-red-500 text-xs mt-2 text-center">
                  {errors.role}
                </p>
              )}
            </div>

            <form onSubmit={handleSubmit}>
              {submitError && (
                <p className="text-red-500 text-sm mb-4 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                  {submitError}
                </p>
              )}

              {/* Email */}
              <div className="mb-4">
                <input
                  type="email"
                  name="email"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full border rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 ${
                    errors.email
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-200 focus:ring-blue-500"
                  }`}
                />

                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div className="mb-4">
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full border rounded-md px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 ${
                      errors.password
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-200 focus:ring-blue-500"
                    }`}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>

                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Remember + Forgot */}
              <div className="flex items-center justify-between mb-6">
                <label className="flex items-center gap-2 text-sm text-gray-500">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="w-4 h-4 accent-blue-600"
                  />
                  Remember Me
                </label>

                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="text-sm text-blue-600 font-medium"
                >
                  Forget password
                </button>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-md flex items-center justify-center gap-2 transition"
              >
                {isSubmitting ? "Signing in..." : "Sign In"}
                <FiArrowRight />
              </button>
            </form>

            {/* OR */}
            <div className="flex items-center gap-4 my-8">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-xs text-gray-400">or</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            {/* Social Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button className="border border-gray-200 rounded-md py-3 flex items-center justify-center gap-3 text-sm text-gray-600 hover:bg-gray-50">
                <FaFacebookF className="text-blue-600" />
                Sign in with Facebook
              </button>

              <button className="border border-gray-200 rounded-md py-3 flex items-center justify-center gap-3 text-sm text-gray-600 hover:bg-gray-50">
                <FcGoogle />
                Sign in with Google
              </button>
            </div>
          </div>
        </div>

        {/* Right Image Section */}
        <div className="hidden lg:block relative w-[52%] min-h-[90vh]">
          <img
            src={authBg}
            alt="Job portal login"
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-[#001b3d]/70"></div>

          <div className="absolute inset-0 flex flex-col justify-center px-20 text-white">
            <h2 className="text-4xl font-semibold leading-tight mb-10 max-w-xl">
              Over 1,75,324 candidates <br />
              waiting for good employees.
            </h2>

            <div className="flex gap-16">
              <div>
                <div className="w-14 h-14 bg-white/10 rounded-md flex items-center justify-center mb-4">
                  <FiBriefcase className="text-2xl" />
                </div>
                <h3 className="text-lg font-semibold">1,75,324</h3>
                <p className="text-sm text-gray-300">Live Job</p>
              </div>

              <div>
                <div className="w-14 h-14 bg-white/10 rounded-md flex items-center justify-center mb-4">
                  <FiBriefcase className="text-2xl" />
                </div>
                <h3 className="text-lg font-semibold">97,354</h3>
                <p className="text-sm text-gray-300">Companies</p>
              </div>

              <div>
                <div className="w-14 h-14 bg-white/10 rounded-md flex items-center justify-center mb-4">
                  <FiBriefcase className="text-2xl" />
                </div>
                <h3 className="text-lg font-semibold">7,532</h3>
                <p className="text-sm text-gray-300">New Jobs</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
>>>>>>> develope
