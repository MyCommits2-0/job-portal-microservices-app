import { useState } from "react";
import { FaFacebookF } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { BriefcaseBusiness, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import { validateForgotPasswordForm } from "../../utils/resetPasswordValidation";
import { forgotPassword, extractAuthErrorMessage } from "../../services/authService";

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForgotPasswordForm({ email });

    if (validationErrors.email) {
      setError(validationErrors.email);
      return;
    }

    setError("");
    setSubmitError("");
    setIsSubmitting(true);

    try {
      // Backend always returns the same generic message whether or not the
      // email exists, so there is nothing to branch on besides success/failure.
      await forgotPassword(email);
      setIsSent(true);
    } catch (err) {
      setSubmitError(extractAuthErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return  (
    <div className="flex flex-col justify-center px-10 lg:px-24">
      {/* Logo */}
      <div className="absolute top-8 left-10 flex items-center gap-2">
        <BriefcaseBusiness className="w-5 h-5 text-blue-600" />
        <span className="font-semibold text-gray-800">
          Jobpilot
        </span>
      </div>

      <div className="max-w-md">
        <h1 className="text-4xl font-semibold text-gray-900 mb-3">
          Forget Password
        </h1>

        <p className="text-gray-500 text-sm">
          Go back to{" "}
          <Link
            to="/login"
            className="text-blue-600 cursor-pointer font-medium"
          >
            Sign In
          </Link>
        </p>

        <p className="text-gray-500 text-sm mb-8">
          Don't have account?{" "}
          <Link
                to="/register"
                className="text-blue-600 cursor-pointer font-medium"
              >
                Create Account
          </Link>
        </p>

        {isSent ? (
          <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-md px-4 py-3">
            If an account with that email exists, a password reset link has
            been sent. Please check your inbox.
          </p>
        ) : (
          <form onSubmit={handleSubmit}>
            {submitError && (
              <p className="text-red-500 text-sm mb-4 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                {submitError}
              </p>
            )}

            {/* Email */}
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              className={`w-full border rounded-md px-4 py-3 outline-none focus:border-blue-500 ${
                error ? "border-red-500" : "border-gray-300"
              }`}
            />

            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}

            {/* Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-5 w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white py-3 rounded-md flex items-center justify-center gap-2 transition"
            >
              {isSubmitting ? "Sending..." : "Send Reset Link"}
              <ArrowRight size={18} />
            </button>
          </form>
        )}

        {/* Divider */}
        <div className="flex items-center my-8">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-4 text-gray-400 text-sm">or</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        {/* Social Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button className="border border-gray-300 rounded-md py-3 flex items-center justify-center gap-2 hover:bg-gray-50">
            <FaFacebookF className="text-blue-600" />
            <span className="text-sm">Sign in with Facebook</span>
          </button>

          <button className="border border-gray-300 rounded-md py-3 flex items-center justify-center gap-2 hover:bg-gray-50">
            <FcGoogle />
            <span className="text-sm">Sign in with Google</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;