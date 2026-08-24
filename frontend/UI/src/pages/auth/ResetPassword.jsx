import { useState } from "react";
import { ArrowRight, BriefcaseBusiness } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import { validateResetPasswordForm } from "../../utils/resetPasswordValidation";
import { resetPassword, extractAuthErrorMessage } from "../../services/authService";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setSubmitError("This reset link is invalid or missing a token. Please request a new one.");
      return;
    }

    const validationErrors = validateResetPasswordForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitError("");
    setIsSubmitting(true);

    try {
      await resetPassword({ token, newPassword: formData.newPassword });
      navigate("/login");
    } catch (error) {
      setSubmitError(extractAuthErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white px-4">
      {/* Logo */}
      <div className="absolute top-8 flex items-center gap-2">
        <BriefcaseBusiness className="w-5 h-5 text-blue-600" />
        <span className="font-semibold text-gray-800 text-lg">
          Jobpilot
        </span>
      </div>

      <div className="w-full max-w-md">
        <h1 className="text-4xl font-semibold text-gray-900 mb-3 text-center">
          Reset Password
        </h1>

        <p className="text-gray-500 text-sm text-center mb-8">
          Create a new password for your account.
        </p>

        <form onSubmit={handleSubmit}>
          {submitError && (
            <p className="text-red-500 text-sm mb-4 bg-red-50 border border-red-200 rounded-md px-3 py-2">
              {submitError}
            </p>
          )}

          {/* New Password */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>

            <input
              type="password"
              name="newPassword"
              placeholder="Enter new password"
              value={formData.newPassword}
              onChange={handleChange}
              className={`w-full border rounded-md px-4 py-3 outline-none focus:border-blue-500 ${
                errors.newPassword ? "border-red-500" : "border-gray-300"
              }`}
            />

            {errors.newPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.newPassword}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full border rounded-md px-4 py-3 outline-none focus:border-blue-500 ${
                errors.confirmPassword ? "border-red-500" : "border-gray-300"
              }`}
            />

            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white py-3 rounded-md flex items-center justify-center gap-2 transition"
          >
            {isSubmitting ? "Resetting..." : "Reset Password"}
            <ArrowRight size={18} />
          </button>
        </form>

        {/* Back to Login */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Back to{" "}
          <Link
            to="/login"
            className="text-blue-600 font-medium hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;