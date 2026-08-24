import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { FiBriefcase, FiArrowRight } from "react-icons/fi";

import Button from "../../components/common/Button";
import { verifyEmail, extractAuthErrorMessage } from "../../services/authService";

export default function VerifyEmail() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const email = location.state?.email || "your email address";

  // Auth_User-Service verifies via a one-time link (/verify-email?token=...)
  // sent by email, not a typed-in code — so this page verifies automatically
  // as soon as it loads with a token in the URL.
  const [status, setStatus] = useState(token ? "verifying" : "missing-token");
  const [error, setError] = useState("");

  // The verification token is single-use — the backend nulls it out on first success.
  // React.StrictMode (see main.jsx) intentionally double-invokes effects in development,
  // which would otherwise fire this call twice: the second call always fails since the
  // token from the first call is already consumed. This ref makes sure it only fires once
  // per token, no matter how many times the effect itself re-runs.
  const verifiedTokenRef = useRef(null);

  useEffect(() => {
    if (!token || verifiedTokenRef.current === token) {
      return;
    }
    verifiedTokenRef.current = token;

    verifyEmail(token)
      .then(() => setStatus("verified"))
      .catch((err) => {
        setError(extractAuthErrorMessage(err));
        setStatus("failed");
      });
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-300 p-5">
      <div className="min-h-[calc(100vh-40px)] bg-white flex flex-col">
        {/* Logo */}
        <header className="pt-8">
          <div className="flex items-center justify-center gap-2">
            <FiBriefcase className="text-blue-600 text-2xl" />
            <span className="text-xl font-semibold text-gray-900">
              Jobpilot
            </span>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="w-full max-w-md text-center">
            <h1 className="text-3xl font-semibold text-gray-900 mb-5">
              Email Verification
            </h1>

            {status === "verifying" && (
              <p className="text-sm text-gray-500 leading-6 mb-8">
                Verifying your email address, please wait...
              </p>
            )}

            {status === "verified" && (
              <>
                <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-md px-4 py-3 mb-8">
                  Your email has been verified successfully.
                </p>

                <Button
                  onClick={() => navigate("/login")}
                  className="w-full flex items-center justify-center gap-2 py-3"
                >
                  Continue to Sign In
                  <FiArrowRight />
                </Button>
              </>
            )}

            {status === "failed" && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-4 py-3 mb-8">
                {error || "This verification link is invalid or has expired."}
              </p>
            )}

            {status === "missing-token" && (
              <p className="text-sm text-gray-500 leading-6 mb-8">
                We&apos;ve sent a verification link to{" "}
                <span className="text-gray-800 font-medium">{email}</span>.
                Open it from your inbox to verify your email address and
                activate your account.
              </p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}