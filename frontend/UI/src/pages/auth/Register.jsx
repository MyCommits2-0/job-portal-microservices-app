<<<<<<< HEAD
=======
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiBriefcase,
  FiEye,
  FiEyeOff,
  FiUser,
  FiArrowRight,
} from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa";
import registerBg from "../../assets/images/register-bg.png";
import { validateRegisterForm } from "../../utils/registerValidation";
import { setSession } from "../../utils/authStorage";
import { registerUser, extractAuthErrorMessage } from "../../services/authService";

// The role toggle uses "user"/"recruiter" for historical UI reasons; the
// backend's Role enum is CANDIDATE/RECRUITER.
const ROLE_TO_BACKEND = {
  user: "CANDIDATE",
  recruiter: "RECRUITER",
};

export default function Register() {
  const navigate = useNavigate();

  const [role, setRole] = useState("user");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });

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

    const validationErrors = validateRegisterForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitError("");
    setIsSubmitting(true);

    try {
      // Note: Auth_User-Service's RegisterDto has no "username" field — the
      // account is keyed by fullName/email/password/role, so username is
      // collected in the form but intentionally not sent.
      const authResponse = await registerUser({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: ROLE_TO_BACKEND[role],
      });

      // register() already returns a working token pair (email verification
      // is not required to log in), so the user is signed in immediately;
      // /verify-email is still shown next as a nudge, not a gate.
      setSession(authResponse, { name: formData.fullName });

      navigate("/verify-email", {
        state: {
          email: formData.email,
          role,
        },
      });
    } catch (error) {
      setSubmitError(extractAuthErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-7xl min-h-[90vh] bg-white overflow-hidden flex flex-col lg:flex-row">
        {/* Left Form Section */}
        <div className="w-full lg:w-[48%] bg-white px-6 sm:px-10 lg:px-24 py-8 flex flex-col justify-center">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-16">
            <FiBriefcase className="text-blue-600 text-2xl" />
            <span className="text-xl font-semibold text-gray-900">
              Jobpilot
            </span>
          </div>

          <div className="w-full max-w-md mx-auto lg:mx-0">
            <h1 className="text-3xl font-semibold text-gray-900 mb-3">
              Create account.
            </h1>

            <p className="text-sm text-gray-500 mb-6">
              Already have account?{" "}
              <a href="/login" className="text-blue-600 font-medium">
                Log In
              </a>
            </p>

            {/* Role Selection */}
            <div className="bg-gray-100 rounded-md p-3 mb-6">
              <p className="text-[11px] text-gray-400 text-center uppercase mb-3">
                Create account as a
              </p>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("user")}
                  className={`flex items-center justify-center gap-2 py-3 rounded-md text-sm font-medium transition ${
                    role === "user"
                      ? "bg-blue-700 text-white shadow-sm"
                      : "bg-transparent text-gray-600 hover:bg-white"
                  }`}
                >
                  <FiUser />
                  Candidate
                </button>

                <button
                  type="button"
                  onClick={() => setRole("recruiter")}
                  className={`flex items-center justify-center gap-2 py-3 rounded-md text-sm font-medium transition ${
                    role === "recruiter"
                      ? "bg-blue-700 text-white shadow-sm"
                      : "bg-transparent text-gray-600 hover:bg-white"
                  }`}
                >
                  <FiBriefcase />
                  Recruiter
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {submitError && (
                <p className="text-red-500 text-sm mb-4 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                  {submitError}
                </p>
              )}

              {/* Name Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Full Name"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={`w-full border rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 ${
                      errors.fullName
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-200 focus:ring-blue-500"
                    }`}
                  />

                  {errors.fullName && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                    className={`w-full border rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 ${
                      errors.username
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-200 focus:ring-blue-500"
                    }`}
                  />

                  {errors.username && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.username}
                    </p>
                  )}
                </div>
              </div>

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

              {/* Confirm Password */}
              <div className="mb-4">
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full border rounded-md px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 ${
                      errors.confirmPassword
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-200 focus:ring-blue-500"
                    }`}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>

                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Terms */}
              <label className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                <input
                  type="checkbox"
                  name="agree"
                  checked={formData.agree}
                  onChange={handleChange}
                  className="w-4 h-4 accent-blue-600"
                />
                <span>
                  I’ve read and agree with your{" "}
                  <a href="#" className="text-blue-600 font-medium">
                    Terms of Services
                  </a>
                </span>
              </label>

              {errors.agree && (
                <p className="text-red-500 text-xs mb-4">{errors.agree}</p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-md flex items-center justify-center gap-2 transition"
              >
                {isSubmitting ? "Creating account..." : "Create Account"}
                <FiArrowRight />
              </button>
            </form>

            {/* OR */}
            <div className="flex items-center gap-4 my-7">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-xs text-gray-400">OR</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            {/* Social Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button className="border border-gray-200 rounded-md py-3 flex items-center justify-center gap-3 text-sm text-gray-600 hover:bg-gray-50">
                <FaFacebookF className="text-blue-600" />
                Sign up with Facebook
              </button>

              <button className="border border-gray-200 rounded-md py-3 flex items-center justify-center gap-3 text-sm text-gray-600 hover:bg-gray-50">
                <FcGoogle />
                Sign up with Google
              </button>
            </div>
          </div>
        </div>

        {/* Right Image Section */}
        <div className="hidden lg:block relative w-[52%] min-h-[90vh]">
          <img
            src={registerBg}
            alt="Job portal registration"
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
